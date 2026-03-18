### 一、整体方案设计思路

要制作一个基于 `ComfyUI + Dify + Python Web + LangChain` 的视频生成网站并部署到服务器，核心逻辑是：

1. **LangChain**：处理用户文本输入，进行意图解析、文案生成、关键词提取（如视频主题/风格/时长）；
2. **Dify**：封装LangChain的能力，提供可视化的prompt管理、对话流程编排，简化业务逻辑开发；
3. **ComfyUI**：作为视频生成的核心引擎（可对接AI绘画、视频剪辑、文生视频模型），通过API调用执行视频生成工作流；
4. **Python Web**：搭建后端服务（如FastAPI），承接前端请求，串联Dify、LangChain、ComfyUI，同时处理文件存储、任务队列；
5. **前端**：简单的网页界面，供用户输入需求、查看生成进度、下载视频；
6. **服务器部署**：将各组件容器化（Docker），通过Docker Compose编排，保证环境一致性。

### 二、环境准备（服务器端）

#### 1. 基础依赖安装

```bash
# 更新系统依赖
sudo apt update && sudo apt install -y docker docker-compose python3-pip git
# 启动Docker服务
sudo systemctl start docker && sudo systemctl enable docker
# 安装Python依赖
pip3 install fastapi uvicorn requests langchain dify-client python-multipart redis celery
```

#### 2. 组件部署前置准备

- **ComfyUI**：提前部署并开启API服务（默认端口8188），配置好视频生成的工作流（如文生图→图生视频、文本直接生视频）；
- **Dify**：参考[Dify官方部署文档](https://docs.dify.ai/v/zh-hans/getting-started/install-self-hosted)，用Docker Compose部署，创建应用并配置LangChain的插件；
- **Redis**：用于任务队列（Celery），存储视频生成任务状态。

### 三、核心代码实现

#### 1. 后端服务（FastAPI）：串联所有组件

```python
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dify_client import DifyClient
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
import requests
import json
import uuid
import os

# 初始化FastAPI
app = FastAPI(title="视频生成网站后端")

# 跨域配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境替换为前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置各组件地址和密钥
COMFYUI_API_URL = "http://localhost:8188/prompt"  # ComfyUI API地址
DIFY_API_KEY = "your_dify_api_key"
DIFY_API_URL = "http://localhost:8000/v1/completions"  # Dify API地址
VIDEO_SAVE_DIR = "./generated_videos"
os.makedirs(VIDEO_SAVE_DIR, exist_ok=True)

# 初始化Dify客户端
dify_client = DifyClient(api_key=DIFY_API_KEY, base_url=DIFY_API_URL)

# 1. LangChain + Dify：处理用户输入，生成视频参数
def generate_video_params(user_prompt: str) -> dict:
    """
    通过Dify调用LangChain，解析用户输入生成视频参数
    :param user_prompt: 用户输入的视频需求（如"生成10秒的海边日落视频，风格治愈"）
    :return: 视频参数（主题、风格、时长、分辨率等）
    """
    # LangChain提示词模板
    prompt_template = PromptTemplate(
        input_variables=["user_prompt"],
        template="""解析用户需求，生成视频生成所需的参数，返回JSON格式：
        要求：
        1. 主题：简洁描述视频内容
        2. 风格：如治愈、科技、卡通等
        3. 时长：单位秒，整数
        4. 分辨率：如1080p、720p
        用户需求：{user_prompt}
        """
    )
    # 调用Dify API（Dify已集成LangChain和大模型）
    response = dify_client.completions.create(
        model="gpt-3.5-turbo",  # Dify中配置的模型
        prompt=prompt_template.format(user_prompt=user_prompt),
        temperature=0.7
    )
    # 解析返回的参数
    params = json.loads(response.choices[0].text.strip())
    return params

# 2. 调用ComfyUI API生成视频
def generate_video_with_comfyui(params: dict, task_id: str) -> str:
    """
    调用ComfyUI API执行视频生成工作流
    :param params: 视频参数
    :param task_id: 任务ID（用于命名视频文件）
    :return: 生成的视频文件路径
    """
    # ComfyUI工作流配置（需提前在ComfyUI中保存工作流，复制JSON）
    comfyui_workflow = {
        "prompt": {
            "3": {"inputs": {"text": params["主题"]}},  # 文本输入节点
            "5": {"inputs": {"style": params["风格"]}},  # 风格节点
            "7": {"inputs": {"seconds": params["时长"]}},  # 时长节点
            "9": {"inputs": {"resolution": params["分辨率"]}},  # 分辨率节点
            "10": {"inputs": {"output_path": f"{VIDEO_SAVE_DIR}/{task_id}.mp4"}}  # 输出路径节点
        },
        "client_id": "video_generator",
        "extra": {"save_images": True}
    }
    # 调用ComfyUI API
    response = requests.post(
        COMFYUI_API_URL,
        json=comfyui_workflow,
        headers={"Content-Type": "application/json"}
    )
    if response.status_code == 200:
        return f"{VIDEO_SAVE_DIR}/{task_id}.mp4"
    else:
        raise Exception(f"ComfyUI调用失败：{response.text}")

# 3. 前端接口：提交视频生成请求
@app.post("/api/generate-video")
async def generate_video(user_prompt: str, background_tasks: BackgroundTasks):
    """
    接收用户视频生成请求，异步执行生成任务
    """
    # 生成唯一任务ID
    task_id = str(uuid.uuid4())
    try:
        # 步骤1：生成视频参数
        params = generate_video_params(user_prompt)
        # 步骤2：异步调用ComfyUI生成视频（避免前端等待）
        background_tasks.add_task(generate_video_with_comfyui, params, task_id)
        return {
            "code": 200,
            "msg": "视频生成任务已提交",
            "data": {"task_id": task_id, "params": params}
        }
    except Exception as e:
        return {"code": 500, "msg": f"任务提交失败：{str(e)}"}

# 4. 前端接口：查询任务状态/获取视频链接
@app.get("/api/task-status/{task_id}")
async def get_task_status(task_id: str):
    """
    查询视频生成任务状态
    """
    video_path = f"{VIDEO_SAVE_DIR}/{task_id}.mp4"
    if os.path.exists(video_path):
        return {
            "code": 200,
            "status": "completed",
            "video_url": f"/videos/{task_id}.mp4"  # 前端访问的视频URL
        }
    else:
        return {"code": 200, "status": "processing", "msg": "视频生成中..."}

# 5. 静态文件服务：提供视频下载
@app.get("/videos/{filename}")
async def serve_video(filename: str):
    from fastapi.responses import FileResponse
    return FileResponse(f"{VIDEO_SAVE_DIR}/{filename}")

# 启动服务
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

#### 2. 简单前端页面（HTML+JS）：用户交互

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>AI视频生成网站</title>
    <style>
        body { max-width: 800px; margin: 0 auto; padding: 20px; }
        #prompt-input { width: 100%; height: 100px; margin-bottom: 10px; }
        #generate-btn { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; }
        #status { margin-top: 20px; color: #666; }
        #video-container { margin-top: 20px; display: none; }
    </style>
</head>
<body>
    <h1>AI视频生成工具</h1>
    <textarea id="prompt-input" placeholder="请输入视频需求（如：生成10秒的海边日落视频，风格治愈）"></textarea>
    <button id="generate-btn">生成视频</button>
    <div id="status"></div>
    <div id="video-container">
        <h3>生成的视频：</h3>
        <video controls width="100%"></video>
    </div>

    <script>
        const generateBtn = document.getElementById('generate-btn');
        const statusDiv = document.getElementById('status');
        const videoContainer = document.getElementById('video-container');
        const videoElement = videoContainer.querySelector('video');
        let taskId = null;

        // 提交生成请求
        generateBtn.addEventListener('click', async () => {
            const prompt = document.getElementById('prompt-input').value.trim();
            if (!prompt) {
                alert('请输入视频需求！');
                return;
            }
            statusDiv.textContent = '提交中...';
            try {
                const response = await fetch('http://localhost:8080/api/generate-video', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_prompt: prompt })
                });
                const data = await response.json();
                if (data.code === 200) {
                    taskId = data.data.task_id;
                    statusDiv.textContent = '视频生成中，请等待...';
                    // 轮询查询任务状态
                    checkTaskStatus();
                } else {
                    statusDiv.textContent = `失败：${data.msg}`;
                }
            } catch (e) {
                statusDiv.textContent = `请求失败：${e.message}`;
            }
        });

        // 轮询查询任务状态
        async function checkTaskStatus() {
            if (!taskId) return;
            try {
                const response = await fetch(`http://localhost:8080/api/task-status/${taskId}`);
                const data = await response.json();
                if (data.status === 'completed') {
                    statusDiv.textContent = '视频生成完成！';
                    videoElement.src = data.video_url;
                    videoContainer.style.display = 'block';
                } else if (data.status === 'processing') {
                    statusDiv.textContent = '视频生成中（进度：未知，ComfyUI可扩展进度接口）...';
                    setTimeout(checkTaskStatus, 3000); // 每3秒查询一次
                }
            } catch (e) {
                statusDiv.textContent = `查询失败：${e.message}`;
                setTimeout(checkTaskStatus, 3000);
            }
        }
    </script>
</body>
</html>
```

#### 3. Docker Compose部署配置（服务器端）

创建`docker-compose.yml`文件，统一管理所有组件：

```yaml
version: '3'

services:
  # Redis：任务队列/状态存储
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: always

  # ComfyUI：视频生成引擎
  comfyui:
    image: comfyui/comfyui:latest  # 或自定义构建的镜像
    ports:
      - "8188:8188"
    volumes:
      - ./comfyui:/app
      - ./generated_videos:/app/output
    environment:
      - PYTHONUNBUFFERED=1
    restart: always
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]  # 需服务器有NVIDIA显卡，支持CUDA

  # Dify：LLM流程编排
  dify:
    image: langgenius/dify-api:latest
    ports:
      - "8000:8000"
    volumes:
      - ./dify:/app
    environment:
      - DATABASE_URL=sqlite:///./dify.db
      - REDIS_URL=redis://redis:6379/0
      - OPENAI_API_KEY=your_openai_api_key  # 若使用OpenAI模型
    depends_on:
      - redis
    restart: always

  # Python Web后端（FastAPI）
  video-api:
    build: ./  # 假设Dockerfile和代码在同一目录
    ports:
      - "8080:8080"
    volumes:
      - ./generated_videos:/app/generated_videos
    environment:
      - COMFYUI_API_URL=http://comfyui:8188/prompt
      - DIFY_API_URL=http://dify:8000/v1/completions
      - DIFY_API_KEY=your_dify_api_key
    depends_on:
      - redis
      - comfyui
      - dify
    restart: always

  # Nginx：前端静态文件服务+反向代理
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html  # 前端HTML文件放此目录
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./generated_videos:/usr/share/nginx/html/videos
    depends_on:
      - video-api
    restart: always

volumes:
  redis_data:
```

创建`Dockerfile`（用于构建FastAPI后端镜像）：

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

创建`requirements.txt`：

```txt
fastapi>=0.104.1
uvicorn>=0.24.0
requests>=2.31.0
dify-client>=0.3.0
langchain>=0.1.0
langchain-openai>=0.1.0
python-multipart>=0.0.6
redis>=5.0.1
celery>=5.3.4
```

创建`nginx.conf`（Nginx反向代理配置）：

```nginx
server {
    listen 80;
    server_name localhost;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端API反向代理
    location /api {
        proxy_pass http://video-api:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 视频文件访问
    location /videos {
        alias /usr/share/nginx/html/videos;
        expires 7d;  # 视频文件缓存7天
    }
}
```

### 四、部署步骤（服务器端）

1. **目录结构准备**：

   ```
   /video-generator/
   ├── frontend/          # 前端HTML文件
   │   └── index.html
   ├── comfyui/           # ComfyUI挂载目录（提前复制ComfyUI配置）
   ├── generated_videos/  # 视频存储目录
   ├── main.py            # FastAPI后端代码
   ├── Dockerfile
   ├── requirements.txt
   ├── docker-compose.yml
   └── nginx.conf
   ```

2. **启动所有服务**：

   ```bash
   cd /video-generator
   docker-compose up -d  # 后台启动所有服务
   ```

3. **验证部署**：

   - 访问`http://服务器IP`：可看到前端页面，输入视频需求提交；
   - 访问`http://服务器IP:8188`：验证ComfyUI是否正常；
   - 访问`http://服务器IP:8000`：验证Dify是否正常；
   - 查看日志：`docker-compose logs -f video-api`（排查后端错误）。

### 五、关键优化点

1. **任务队列**：若视频生成耗时久，用Celery替代BackgroundTasks，支持任务重试、进度追踪；
2. **资源限制**：ComfyUI视频生成耗GPU/CPU，在docker-compose中配置资源限制（如`mem_limit: 16g`）；
3. **缓存与清理**：定期清理`generated_videos`目录的旧视频，避免磁盘占满；
4. **权限控制**：生产环境添加用户登录（如FastAPI-Users），限制视频生成次数；
5. **进度反馈**：扩展ComfyUI的API，返回视频生成进度（如帧生成百分比），前端实时展示。

### 总结

1. **核心流程**：前端输入 → FastAPI后端 → Dify+LangChain解析需求生成参数 → ComfyUI执行视频生成 → 前端查询进度/下载视频；
2. **部署关键**：通过Docker Compose统一编排ComfyUI、Dify、FastAPI、Nginx，保证环境一致性；
3. **扩展方向**：添加任务队列、GPU优化、用户权限、视频预览、多模型支持（如Stable Video Diffusion）。