# Python AI 智能体开发 - 任务导向型学习大纲

> 通过完成 **个人 AI 智能助手** 项目的 5 个版本迭代，系统掌握 AI 智能体开发全栈技能

---

## 📋 项目总览

| 版本     | 项目名称          | 核心功能                | 学习周期    | 技术重点                |
| -------- | ----------------- | ----------------------- | ----------- | ----------------------- |
| **V1.0** | 基础对话机器人    | 简单问答对话            | 第 1-2 周   | Python 基础、API 调用   |
| **V2.0** | 知识库问答系统    | 文档检索 + 回答         | 第 3-6 周   | RAG、向量数据库         |
| **V3.0** | 多模态解析助手    | 图片/视频/音频处理      | 第 7-9 周   | OCR、语音识别           |
| **V4.0** | 智能体 Agent 系统 | 工具调用、Function Call | 第 10-13 周 | Agent 编排、Text-to-SQL |
| **V5.0** | 企业级部署版本    | 高并发、版本管理、监控  | 第 14-16 周 | 性能优化、部署上线      |

---

## 🎯 V1.0 基础对话机器人（第 1-2 周）

### 学习目标

掌握 Python 基础语法、异步编程、大模型 API 调用

### 任务清单

| 任务编号 | 任务名称         | 学习内容                      | 交付物                   | 验收标准                        |
| -------- | ---------------- | ----------------------------- | ------------------------ | ------------------------------- |
| **T1.1** | 环境搭建         | Python 3.10+、`pip`、虚拟环境 | `requirements.txt`       | 能成功安装所有依赖              |
| **T1.2** | FastAPI 框架入门 | `FastAPI` 路由、请求响应      | `app/main.py`            | 能启动服务并访问 `/health` 接口 |
| **T1.3** | 异步编程基础     | `async/await`、`asyncio`      | `utils/async_helper.py`  | 理解并发与并行区别              |
| **T1.4** | 大模型 API 调用  | 通义千问/`OpenAI` API         | `services/llm_client.py` | 能完成简单对话                  |
| **T1.5** | 对话接口开发     | `POST /chat` 接口             | `api/v1/chat.py`         | 能接收用户消息并返回回复        |

### 项目结构

```
project_v1/
├── app/
│   ├── main.py              # 入口文件
│   ├── config.py            # 配置管理
│   └── api/
│       └── v1/
│           └── chat.py      # 对话接口
├── services/
│   └── llm_client.py        # 大模型客户端
├── utils/
│   └── async_helper.py      # 异步工具
├── requirements.txt
└── .env                     # 环境变量
```

### 核心代码任务

**任务 T1.4 代码示例**：

```python
# services/llm_client.py
from openai import AsyncOpenAI

class LLMClient:
    def __init__(self, api_key: str, base_url: str):
        self.client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        self.model = "qwen-turbo"
    
    async def chat(self, messages: list) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages
        )
        return response.choices[0].message.content
```

**任务 T1.5 代码示例**：

```python
# app/api/v1/chat.py
from fastapi import APIRouter
from pydantic import BaseModel
from services.llm_client import LLMClient

router = APIRouter()
llm_client = LLMClient(api_key="xxx", base_url="xxx")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    messages = [{"role": "user", "content": request.message}]
    reply = await llm_client.chat(messages)
    return ChatResponse(reply=reply)
```

### 学习检查点

- [ ] 能独立创建 Python 虚拟环境
- [ ] 理解 `async/await` 工作原理
- [ ] 能调用大模型 API 完成对话
- [ ] 能用 `FastAPI` 创建 RESTful 接口
- [ ] V1.0 项目能成功运行并对话

---

## 🎯 V2.0 知识库问答系统（第 3-6 周）

### 学习目标

掌握 RAG 全链路、向量数据库、文档解析与分片

### 任务清单

| 任务编号 | 任务名称           | 学习内容                                                     | 交付物                      | 验收标准             |
| -------- | ------------------ | ------------------------------------------------------------ | --------------------------- | -------------------- |
| **T2.1** | 向量数据库部署     | [Chroma](file://d:\前端agent\comfyui\comfy\model_base.py#L1597-L1607)/`Milvus` Docker 部署 | `docker-compose.yml`        | 向量库能正常启动     |
| **T2.2** | Embedding 模型集成 | `BGE-M3` 模型调用                                            | `engines/embedding.py`      | 能将文本转为向量     |
| **T2.3** | 文档解析模块       | `PyMuPDF`、`python-docx`                                     | `services/parser.py`        | 能解析 PDF/Word 文档 |
| **T2.4** | 分片策略实现       | `ChunkingStrategy` 5 种策略                                  | `services/chunking.py`      | 支持多种分片方式     |
| **T2.5** | 向量索引构建       | 向量存储与检索                                               | `services/vector_store.py`  | 能存储和查询向量     |
| **T2.6** | 检索服务开发       | `retrieve_context` 函数                                      | `services/retrieval.py`     | 能返回相关文档片段   |
| **T2.7** | RAG 问答接口       | 结合检索与生成                                               | `api/v1/knowledge_chat.py`  | 能基于知识库回答     |
| **T2.8** | 查询改写优化       | `query_rewrite` 提升检索                                     | `services/query_rewrite.py` | 模糊提问能正确理解   |

### 项目结构升级

```
project_v2/
├── app/
│   ├── main.py
│   ├── config.py
│   └── api/
│       └── v1/
│           ├── chat.py
│           └── knowledge_chat.py    # 知识库问答接口
├── services/
│   ├── llm_client.py
│   ├── parser.py                    # 文档解析
│   ├── chunking.py                  # 分片策略
│   ├── vector_store.py              # 向量存储
│   ├── retrieval.py                 # 检索服务
│   └── query_rewrite.py             # 查询改写
├── engines/
│   ├── embedding.py                 # Embedding 模型
│   └── rerank.py                    # Rerank 模型
├── models/
│   └── document.py                  # 文档数据模型
├── docker-compose.yml
└── requirements.txt
```

### 核心代码任务

**任务 T2.4 代码示例**：

```python
# services/chunking.py
from typing import List
from abc import ABC, abstractmethod

class ChunkingStrategy(ABC):
    @abstractmethod
    def chunk(self, text: str) -> List[str]:
        pass

class TokenChunking(ChunkingStrategy):
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def chunk(self, text: str) -> List[str]:
        # 按 Token 分片实现
        chunks = []
        # ... 实现逻辑
        return chunks

class ParagraphChunking(ChunkingStrategy):
    def chunk(self, text: str) -> List[str]:
        # 按段落分片实现
        return text.split('\n\n')
```

**任务 T2.7 代码示例**：

```python
# services/retrieval.py
from typing import List
from engines.embedding import EmbeddingModel
from engines.rerank import RerankEngine

class RetrievalService:
    def __init__(self):
        self.embedder = EmbeddingModel()
        self.reranker = RerankEngine()
    
    async def retrieve_context(self, query: str, top_k: int = 5) -> List[dict]:
        # 1. 向量化查询
        query_vector = await self.embedder.embed(query)
        
        # 2. 向量检索
        candidates = await self.vector_search(query_vector, top_k=top_k * 2)
        
        # 3. Rerank 重排
        ranked_docs = await self.reranker.rerank(query, candidates, top_k=top_k)
        
        return ranked_docs
```

### 学习检查点

- [ ] 理解向量检索原理
- [ ] 能部署并使用向量数据库
- [ ] 掌握 5 种文档分片策略
- [ ] 能实现完整的 RAG 检索链路
- [ ] V2.0 项目能基于知识库准确回答

---

## 🎯 V3.0 多模态解析助手（第 7-9 周）

### 学习目标

掌握 OCR、语音识别、多模态数据处理

### 任务清单

| 任务编号 | 任务名称         | 学习内容               | 交付物                          | 验收标准            |
| -------- | ---------------- | ---------------------- | ------------------------------- | ------------------- |
| **T3.1** | OCR 引擎集成     | `PaddleOCR` 部署与调用 | `engines/ocr.py`                | 能识别图片文字      |
| **T3.2** | 语音转文字       | `Whisper` 模型集成     | `engines/whisper.py`            | 能转录音频内容      |
| **T3.3** | 视频处理模块     | 视频抽帧 + 语音提取    | `services/video_parser.py`      | 能解析视频内容      |
| **T3.4** | 多模态统一接口   | 统一文件解析入口       | `services/multimodal_parser.py` | 支持 5+ 种文件格式  |
| **T3.5** | 图表理解模块     | `Qwen-VL` 图片描述生成 | `engines/vision.py`             | 能描述图表内容      |
| **T3.6** | 知识库多模态入库 | 多模态数据向量化       | `services/multimodal_ingest.py` | 图片/视频能入库检索 |

### 项目结构升级

```
project_v3/
├── services/
│   ├── parser.py
│   ├── chunking.py
│   ├── multimodal_parser.py       # 多模态解析统一入口
│   └── video_parser.py            # 视频处理
├── engines/
│   ├── embedding.py
│   ├── rerank.py
│   ├── ocr.py                     # OCR 引擎
│   ├── whisper.py                 # 语音识别
│   └── vision.py                  # 视觉模型
└── tests/
    └── test_multimodal.py         # 多模态测试
```

### 核心代码任务

**任务 T3.1 代码示例**：

```python
# engines/ocr.py
from paddleocr import PaddleOCR

class OCRProcessor:
    def __init__(self):
        self.ocr = PaddleOCR(use_angle_cls=True, lang='ch')
    
    async def extract_text(self, image_path: str) -> str:
        result = self.ocr.ocr(image_path, cls=True)
        text = ""
        for line in result[0]:
            text += line[1][0] + "\n"
        return text
```

**任务 T3.4 代码示例**：

```python
# services/multimodal_parser.py
from typing import List
from engines.ocr import OCRProcessor
from engines.whisper import AudioTranscriber
from engines.vision import VisionModel

class MultiModalParser:
    def __init__(self):
        self.ocr = OCRProcessor()
        self.transcriber = AudioTranscriber()
        self.vision = VisionModel()
    
    async def parse_file(self, file_path: str, file_type: str) -> List[str]:
        if file_type in ["jpg", "png", "jpeg"]:
            return await self.ocr.extract_text(file_path)
        elif file_type in ["mp3", "wav"]:
            return await self.transcriber.transcribe(file_path)
        elif file_type in ["mp4", "avi"]:
            return await self.parse_video(file_path)
        elif file_type in ["pdf", "docx"]:
            return await self.parse_document(file_path)
        return []
    
    async def parse_video(self, video_path: str) -> List[str]:
        # 视频抽帧 + 语音提取
        pass
```

### 学习检查点

- [ ] 能集成 OCR 识别图片文字
- [ ] 能使用 Whisper 转录音频
- [ ] 理解多模态数据处理流程
- [ ] V3.0 项目能处理图片/视频/音频

---

## 🎯 V4.0 智能体 Agent 系统（第 10-13 周）

### 学习目标

掌握 Agent 编排、Function Call、Text-to-SQL、工具调用

### 任务清单

| 任务编号 | 任务名称           | 学习内容                                                     | 交付物                       | 验收标准            |
| -------- | ------------------ | ------------------------------------------------------------ | ---------------------------- | ------------------- |
| **T4.1** | Agent 框架学习     | `LangChain` Agent 核心                                       | `services/agent_base.py`     | 理解 Agent 工作原理 |
| **T4.2** | 工具定义与注册     | [Tools](file://d:\前端agent\dify-main\web\app\components\app\configuration\tools\index.tsx#L22-L193) 集合定义 | `tools/base.py`              | 能定义自定义工具    |
| **T4.3** | Function Call 实现 | 函数调用机制                                                 | `services/function_call.py`  | 模型能调用指定函数  |
| **T4.4** | Text-to-SQL 模块   | 自然语言查数据库                                             | `services/sql_agent.py`      | 能用自然语言查询    |
| **T4.5** | 提示词工程         | `PromptTemplate` 设计                                        | `prompts/system.py`          | 减少模型幻觉        |
| **T4.6** | 溯源机制实现       | `Advisor` 机制、引用标注                                     | `models/citation.py`         | 回答能标注来源      |
| **T4.7** | Agent 工作流编排   | 多工具协同工作                                               | `services/agent_workflow.py` | 能完成复杂任务      |
| **T4.8** | 代码解释器集成     | Python 代码执行                                              | `tools/code_interpreter.py`  | 能执行模型生成代码  |

### 项目结构升级

```
project_v4/
├── services/
│   ├── agent_base.py              # Agent 基类
│   ├── agent_workflow.py          # 工作流编排
│   ├── function_call.py           # 函数调用
│   └── sql_agent.py               # SQL 代理
├── tools/
│   ├── base.py                    # 工具基类
│   ├── calculator.py              # 计算器工具
│   ├── search.py                  # 搜索工具
│   └── code_interpreter.py        # 代码解释器
├── prompts/
│   └── system.py                  # 系统提示词
├── models/
│   ├── document.py
│   └── citation.py                # 溯源模型
└── tests/
    └── test_agent.py
```

### 核心代码任务

**任务 T4.2 代码示例**：

```python
# tools/base.py
from abc import ABC, abstractmethod
from typing import Any, Dict

class Tool(ABC):
    name: str
    description: str
    
    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        pass

class CalculatorTool(Tool):
    name = "calculator"
    description = "执行数学计算"
    
    async def execute(self, expression: str) -> float:
        return eval(expression)
```

**任务 T4.4 代码示例**：

```python
# services/sql_agent.py
from sqlalchemy import text
from langchain.sql_database import SQLDatabase

class SQLAgent:
    def __init__(self, db_uri: str):
        self.db = SQLDatabase.from_uri(db_uri)
    
    async def query(self, natural_language: str) -> dict:
        # 1. 自然语言转 SQL
        sql = await self.nl_to_sql(natural_language)
        
        # 2. 执行 SQL
        result = self.db.run(sql)
        
        # 3. 返回结果
        return {"sql": sql, "data": result}
    
    async def nl_to_sql(self, nl: str) -> str:
        # 调用 LLM 生成 SQL
        pass
```

**任务 T4.6 代码示例**：

```python
# models/citation.py
from pydantic import BaseModel
from typing import List

class Citation(BaseModel):
    source_doc_id: str
    page_number: int
    chunk_index: int
    content: str

class GenerationResult(BaseModel):
    answer: str
    citations: List[Citation]
    confidence: float

class AdvisorMechanism:
    def attach_citations(self, answer: str, contexts: List[dict]) -> GenerationResult:
        # 绑定溯源信息
        citations = [
            Citation(
                source_doc_id=ctx["doc_id"],
                page_number=ctx["page"],
                chunk_index=ctx["chunk_idx"],
                content=ctx["content"]
            )
            for ctx in contexts
        ]
        return GenerationResult(answer=answer, citations=citations, confidence=0.95)
```

### 学习检查点

- [ ] 理解 Agent 工作原理
- [ ] 能定义和注册自定义工具
- [ ] 掌握 Function Call 机制
- [ ] 能实现 Text-to-SQL 查询
- [ ] V4.0 项目能调用工具完成复杂任务

---

## 🎯 V5.0 企业级部署版本（第 14-16 周）

### 学习目标

掌握高并发优化、版本管理、监控部署、简历包装

### 任务清单

| 任务编号 | 任务名称          | 学习内容                  | 交付物                    | 验收标准         |
| -------- | ----------------- | ------------------------- | ------------------------- | ---------------- |
| **T5.1** | 知识库版本隔离    | 版本管理表设计            | `models/version.py`       | 支持多版本知识库 |
| **T5.2** | 增量更新机制      | `incremental_update` 实现 | `services/version_mgr.py` | 支持热更新       |
| **T5.3** | 任务队列集成      | `Celery`+`Redis` 异步任务 | `tasks/ingest.py`         | 支持异步文档处理 |
| **T5.4** | 性能压力测试      | `locust` 压测工具         | `tests/performance.py`    | 输出性能报告     |
| **T5.5** | 监控日志系统      | `Prometheus`+`Grafana`    | `monitoring/`             | 能查看系统指标   |
| **T5.6** | Docker 容器化部署 | 生产环境部署              | `docker-compose.prod.yml` | 一键部署上线     |
| **T5.7** | API 文档完善      | `Swagger` 文档            | `/docs` 页面              | 接口文档完整     |
| **T5.8** | 简历与作品集整理  | 项目亮点量化              | `README.md`、简历         | 完成求职材料     |

### 项目结构升级

```
project_v5/
├── app/
├── services/
├── tools/
├── tasks/                         # 异步任务
│   └── ingest.py                  # 文档入库任务
├── models/
│   ├── document.py
│   ├── citation.py
│   └── version.py                 # 版本模型
├── monitoring/                    # 监控配置
├── tests/
│   ├── test_agent.py
│   └── performance.py             # 性能测试
├── docker-compose.yml
├── docker-compose.prod.yml        # 生产环境
├── README.md                      # 项目文档
└── requirements.txt
```

### 核心代码任务

**任务 T5.2 代码示例**：

```python
# services/version_mgr.py
from typing import Optional
from models.version import KnowledgeVersion

class VersionManager:
    async def create_version(self, knowledge_id: str, version_name: str) -> int:
        # 创建新版本
        pass
    
    async def incremental_update(self, knowledge_id: str, documents: list) -> dict:
        # 增量更新逻辑
        # 1. 识别新增/修改/删除文档
        # 2. 只处理变更部分
        # 3. 更新向量索引
        pass
    
    async def rollback(self, knowledge_id: str, target_version: int) -> bool:
        # 版本回滚
        pass
```

**任务 T5.4 代码示例**：

```python
# tests/performance.py
from locust import HttpUser, task, between

class RAGUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def chat(self):
        self.client.post("/api/v1/chat", json={"message": "测试问题"})
    
    @task(3)
    def knowledge_chat(self):
        self.client.post("/api/v1/knowledge/chat", json={"message": "知识库问题"})
```

### 学习检查点

- [ ] 理解版本隔离与增量更新
- [ ] 能使用 Celery 处理异步任务
- [ ] 能进行性能压力测试
- [ ] 能 Docker 容器化部署
- [ ] V5.0 项目可生产环境部署
- [ ] 完成简历与作品集整理

---

## 📊 学习进度追踪表

```markdown
| 周次 | 版本 | 完成任务 | 累计进度 | 状态 |
|------|------|----------|----------|------|
| 第 1 周 | V1.0 | T1.1-T1.3 | 6% | ⬜ |
| 第 2 周 | V1.0 | T1.4-T1.5 | 12% | ⬜ |
| 第 3 周 | V2.0 | T2.1-T2.2 | 20% | ⬜ |
| 第 4 周 | V2.0 | T2.3-T2.4 | 28% | ⬜ |
| 第 5 周 | V2.0 | T2.5-T2.6 | 36% | ⬜ |
| 第 6 周 | V2.0 | T2.7-T2.8 | 44% | ⬜ |
| 第 7 周 | V3.0 | T3.1-T3.2 | 52% | ⬜ |
| 第 8 周 | V3.0 | T3.3-T3.4 | 60% | ⬜ |
| 第 9 周 | V3.0 | T3.5-T3.6 | 68% | ⬜ |
| 第 10 周 | V4.0 | T4.1-T4.2 | 76% | ⬜ |
| 第 11 周 | V4.0 | T4.3-T4.4 | 84% | ⬜ |
| 第 12 周 | V4.0 | T4.5-T4.6 | 92% | ⬜ |
| 第 13 周 | V4.0 | T4.7-T4.8 | 100% | ⬜ |
| 第 14 周 | V5.0 | T5.1-T5.3 | - | ⬜ |
| 第 15 周 | V5.0 | T5.4-T5.6 | - | ⬜ |
| 第 16 周 | V5.0 | T5.7-T5.8 | - | ⬜ |
```

---

## 🏆 最终交付物清单

| 交付物           | 说明                  | 用途       |
| ---------------- | --------------------- | ---------- |
| **完整项目代码** | GitHub 仓库           | 作品集展示 |
| **技术文档**     | `README.md`、API 文档 | 项目说明   |
| **部署脚本**     | Docker 配置、部署指南 | 快速部署   |
| **测试报告**     | 单元测试、性能测试    | 质量证明   |
| **演示视频**     | 项目功能演示          | 面试展示   |
| **简历项目描述** | 量化指标、技术亮点    | 求职材料   |

---

## 📚 配套学习资源

| 阶段 | 资源类型 | 资源名称             | 链接/说明                                |
| ---- | -------- | -------------------- | ---------------------------------------- |
| V1.0 | 教程     | Python 官方教程      | docs.python.org                          |
| V1.0 | 教程     | FastAPI 官方文档     | fastapi.tiangolo.com                     |
| V2.0 | 教程     | LangChain 官方教程   | python.langchain.com                     |
| V2.0 | 文档     | Milvus 快速开始      | milvus.io/docs                           |
| V3.0 | 教程     | PaddleOCR 文档       | github.com/PaddlePaddle/PaddleOCR        |
| V3.0 | 教程     | Whisper 官方文档     | github.com/openai/whisper                |
| V4.0 | 教程     | LangChain Agent 指南 | python.langchain.com/docs/modules/agents |
| V5.0 | 教程     | Celery 官方文档      | docs.celeryq.dev                         |
| V5.0 | 教程     | Docker 官方教程      | docs.docker.com                          |

---

按照此大纲学习，**每完成一个任务就打勾**，16 周后您将拥有一个完整的企业级 AI 智能体项目，同时掌握所有核心技能，可直接用于求职面试。