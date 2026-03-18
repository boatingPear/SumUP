# 视频生成网站快速启动指南

## 项目架构

本项目包含以下组件：

- **前端**: HTML + JavaScript (Nginx服务)
- **后端**: FastAPI (Python)
- **AI流程编排**: Dify
- **视频生成引擎**: ComfyUI (需手动部署)
- **任务队列**: Redis

## 快速启动步骤

### 第一步：启动Docker服务（后端 + Dify + Redis + Nginx）

```powershell
# 进入项目目录
cd d:\前端agent

# 启动Docker服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 第二步：手动部署ComfyUI

#### 方法1：使用自动部署脚本（推荐）

```powershell
# 进入ComfyUI目录
cd d:\前端agent\comfyui

# 运行自动部署脚本
.\install_comfyui.bat

# 按照提示完成安装
```

#### 方法2：手动部署

详细步骤请参考：`comfyui/部署说明.md`

### 第三步：启动ComfyUI服务

```powershell
# 进入ComfyUI目录
cd d:\前端agent\comfyui

# 启动ComfyUI
.\start_comfyui.bat

# 服务将在 http://localhost:8188 启动
```

### 第四步：验证部署

1. **访问前端页面**: http://localhost
2. **访问ComfyUI**: http://localhost:8188
3. **访问Dify**: http://localhost:8000
4. **测试后端API**: http://localhost:8080/docs

### 第五步：配置AI模型

1. **下载基础模型**:
   - 从 https://civitai.com/ 或 https://huggingface.co/ 下载模型
   - 将模型文件放入 `comfyui/models/checkpoints/` 目录

2. **在ComfyUI中创建工作流**:
   - 访问 http://localhost:8188
   - 创建视频生成工作流
   - 保存工作流配置

3. **配置Dify**:
   - 访问 http://localhost:8000
   - 创建应用并配置API密钥
   - 配置大语言模型（如OpenAI GPT）

## 使用流程

### 1. 用户操作流程

1. 打开浏览器访问 http://localhost
2. 在输入框中描述视频需求（如："生成10秒的海边日落视频，风格治愈"）
3. 点击"生成视频"按钮
4. 等待视频生成完成（可能需要几分钟）
5. 查看并下载生成的视频

### 2. 系统处理流程

```
用户输入 → 前端页面 → Nginx → FastAPI后端
    ↓
Dify + LangChain 解析需求生成参数
    ↓
调用ComfyUI API生成视频
    ↓
视频保存到服务器
    ↓
前端轮询查询状态 → 显示视频
```

## 常见问题

### 1. Docker服务启动失败

```powershell
# 检查Docker是否运行
docker info

# 如果Docker未运行，启动Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# 重新启动服务
docker-compose down
docker-compose up -d
```

### 2. ComfyUI无法连接

```powershell
# 检查ComfyUI是否运行
# 访问 http://localhost:8188

# 如果无法访问，检查：
# 1. ComfyUI是否正确安装
# 2. 端口8188是否被占用
# 3. 防火墙是否阻止连接
```

### 3. 模型下载慢

```powershell
# 使用国内镜像加速
# 在浏览器中使用代理下载模型
# 或使用迅雷等下载工具
```

### 4. 显存不足

```powershell
# 降低视频分辨率（如从1080p改为720p）
# 减少视频帧数
# 使用更小的模型
# 关闭其他占用显存的程序
```

## 配置文件说明

### 环境变量配置

在 `docker-compose.yml` 中可以配置以下环境变量：

```yaml
video-api:
  environment:
    - COMFYUI_API_URL=http://host.docker.internal:8188/prompt  # ComfyUI地址
    - DIFY_API_URL=http://dify:8000/v1/completions            # Dify地址
    - DIFY_API_KEY=your_dify_api_key                          # Dify API密钥
```

### 本地开发配置

如果需要在本地开发环境运行后端：

```python
# 修改 main.py 中的配置
COMFYUI_API_URL = "http://localhost:8188/prompt"
DIFY_API_URL = "http://localhost:8000/v1/completions"
```

## 目录结构

```
d:\前端agent\
├── frontend\                    # 前端文件
│   └── index.html               # 主页面
├── comfyui\                     # ComfyUI目录
│   ├── install_comfyui.bat      # 安装脚本
│   ├── start_comfyui.bat        # 启动脚本
│   ├── stop_comfyui.bat         # 停止脚本
│   ├── 部署说明.md              # 详细部署文档
│   ├── models\                  # AI模型目录
│   ├── output\                  # 视频输出目录
│   └── workflows\               # 工作流配置
├── generated_videos\            # 生成的视频存储
├── main.py                      # FastAPI后端
├── docker-compose.yml           # Docker配置
├── Dockerfile                   # 后端镜像配置
├── nginx.conf                   # Nginx配置
├── requirements.txt             # Python依赖
└── 快速启动指南.md              # 本文件
```

## 停止服务

### 停止Docker服务

```powershell
cd d:\前端agent

# 停止所有服务
docker-compose down

# 停止并删除卷（会清除数据）
docker-compose down -v
```

### 停止ComfyUI

```powershell
cd d:\前端agent\comfyui
.\stop_comfyui.bat
```

## 性能优化建议

1. **使用SSD**: 模型文件较大，建议使用SSD存储
2. **增加内存**: 建议16GB以上内存
3. **GPU加速**: 使用NVIDIA显卡加速视频生成
4. **模型缓存**: 保持ComfyUI运行，避免重复加载模型
5. **定期清理**: 清理生成的旧视频文件，释放磁盘空间

## 技术支持

- **ComfyUI文档**: https://github.com/comfyanonymous/ComfyUI
- **Dify文档**: https://docs.dify.ai/
- **FastAPI文档**: https://fastapi.tiangolo.com/

---

**注意**: 首次启动需要下载大量模型文件，请确保网络连接稳定并有足够的磁盘空间（建议100GB以上）。