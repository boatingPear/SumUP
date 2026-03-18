# ComfyUI完整使用教程与指南

## 1. ComfyUI简介

ComfyUI是一个基于节点的Stable Diffusion图形界面，通过拖拽节点和连接线的方式构建复杂的AI图像生成工作流。

### 1.1 核心特点

- **节点化设计**：通过节点和连接线构建工作流
- **高度可定制**：支持自定义节点和工作流
- **批量处理**：支持队列和批量生成
- **API接口**：提供完整的HTTP API
- **跨平台**：支持Windows、Linux、macOS

## 2. 安装与配置

### 2.1 系统要求

| 组件     | 最低配置                           | 推荐配置                     |
| -------- | ---------------------------------- | ---------------------------- |
| 操作系统 | Windows 10+ / Linux / macOS 10.15+ | Windows 11 / Ubuntu 20.04+   |
| CPU      | Intel i5 8代+                      | Intel i7 10代+ / AMD Ryzen 7 |
| 内存     | 16GB                               | 32GB+                        |
| 显卡     | NVIDIA GTX 1060 6GB                | NVIDIA RTX 3060 12GB+        |
| 显存     | 6GB                                | 12GB+                        |
| 存储     | 20GB SSD                           | 50GB+ NVMe SSD               |

### 2.2 安装步骤

#### Windows安装

```powershell
# 1. 克隆仓库
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 2. 创建虚拟环境
python -m venv venv
venv\Scripts\activate

# 3. 安装依赖
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

# 4. 启动ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

#### Linux安装

```bash
# 1. 克隆仓库
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 2. 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 3. 安装依赖
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

# 4. 启动ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

### 2.3 目录结构

```
ComfyUI/
├── models/                          # 模型文件目录
│   ├── checkpoints/                  # 检查点模型（主模型）
│   │   ├── v1-5-pruned-emaonly.safetensors
│   │   └── sd_xl_base_1.0.safetensors
│   ├── vae/                         # VAE模型
│   │   └── vae-ft-mse-840000.safetensors
│   ├── lora/                        # LoRA模型
│   │   └── detail_tweaker.safetensors
│   ├── embeddings/                   # 文本嵌入（Textual Inversion）
│   │   └── negative_hand.safetensors
│   ├── controlnet/                   # ControlNet模型
│   │   ├── control_v11p_sd15_canny.pth
│   │   └── control_v11p_sd15_openpose.pth
│   ├── ipadapter/                    # IP-Adapter模型
│   ├── upscale_models/               # 放大模型
│   ├── clip_vision/                 # CLIP视觉模型
│   └── hypernetworks/               # 超网络模型
├── custom_nodes/                    # 自定义节点
├── input/                          # 输入文件目录
├── output/                         # 输出文件目录
│   ├── images/                      # 图片输出
│   └── videos/                      # 视频输出
├── workflows/                       # 工作流保存目录
├── main.py                         # 主程序
├── server.py                        # 服务器程序
└── requirements.txt                 # 依赖列表
```

## 3. 基础节点详解

### 3.1 核心节点分类

| 节点类型 | 功能                | 常用节点                                      |
| -------- | ------------------- | --------------------------------------------- |
| 加载节点 | 加载模型、VAE、CLIP | CheckpointLoaderSimple, VAELoader, CLIPLoader |
| 文本编码 | 将文本转换为嵌入    | CLIPTextEncode, CLIPTextEncodeSDXL            |
| 采样节点 | 生成图像            | KSampler, KSamplerAdvanced                    |
| 解码节点 | 潜空间解码          | VAEDecode                                     |
| 保存节点 | 保存输出            | SaveImage, SaveImageWebP                      |
| 图像处理 | 图像后处理          | ImageScale, ImageUpscaleWithModel             |
| 条件节点 | 条件控制            | ControlNetApply, IPAdapterAdvanced            |

### 3.2 常用节点详解

#### 3.2.1 CheckpointLoaderSimple

**功能**：加载检查点模型

**参数**：

```python
{
    "ckpt_name": "v1-5-pruned-emaonly.safetensors"  # 模型文件名
}
```

**输出**：

- `MODEL`: 模型
- `CLIP`: CLIP模型
- `VAE`: VAE模型

#### 3.2.2 CLIPTextEncode

**功能**：将文本提示转换为嵌入向量

**参数**：

```python
{
    "text": "a beautiful sunset over the ocean",  # 提示词
    "clip": ["1", 1]  # CLIP模型引用
}
```

**输出**：

- `CONDITIONING`: 条件嵌入

#### 3.2.3 KSampler

**功能**：执行采样过程生成图像

**参数**：

```python
{
    "seed": 123456789,              # 随机种子，-1表示随机
    "steps": 20,                    # 采样步数
    "cfg": 7.0,                    # CFG Scale
    "sampler_name": "euler",         # 采样器名称
    "scheduler": "normal",            # 调度器
    "denoise": 1.0,                # 去噪强度
    "model": ["1", 0],             # 模型引用
    "positive": ["2", 0],           # 正向提示词
    "negative": ["3", 0]            # 负向提示词
}
```

**采样器选项**：

- `euler`: Euler采样器，快速
- `euler_a`: Euler Ancestral采样器
- `dpmpp_2m`: DPM++ 2M采样器
- `dpmpp_2m_sde`: DPM++ 2M SDE采样器
- `ddim`: DDIM采样器
- `uni_pc`: UniPC采样器

**调度器选项**：

- `normal`: 正常调度
- `karras`: Karras调度
- `exponential`: 指数调度
- `sgm_uniform`: SGM均匀调度

#### 3.2.4 VAEDecode

**功能**：将潜空间解码为图像

**参数**：

```python
{
    "samples": ["4", 0],  # 采样器输出
    "vae": ["1", 2]       # VAE模型引用
}
```

**输出**：

- `IMAGE`: 解码后的图像

#### 3.2.5 SaveImage

**功能**：保存生成的图像

**参数**：

```python
{
    "filename_prefix": "ComfyUI",  # 文件名前缀
    "images": ["5", 0]            # 图像引用
}
```

## 4. 完整工作流案例

### 4.1 基础文生图工作流

```python
workflow = {
    "1": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly.safetensors"
        }
    },
    "2": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "a beautiful sunset over the ocean, highly detailed, 8k, masterpiece",
            "clip": ["1", 1]
        }
    },
    "3": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "low quality, blurry, ugly, deformed",
            "clip": ["1", 1]
        }
    },
    "4": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 123456789,
            "steps": 20,
            "cfg": 7.0,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
            "model": ["1", 0],
            "positive": ["2", 0],
            "negative": ["3", 0]
        }
    },
    "5": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": ["4", 0],
            "vae": ["1", 2]
        }
    },
    "6": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "text_to_image",
            "images": ["5", 0]
        }
    }
}
```

### 4.2 图生图工作流

```python
workflow = {
    "1": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly.safetensors"
        }
    },
    "2": {
        "class_type": "LoadImage",
        "inputs": {
            "image": "input.png",
            "choose file to upload": "image"
        }
    },
    "3": {
        "class_type": "VAEEncode",
        "inputs": {
            "pixels": ["2", 0],
            "vae": ["1", 2]
        }
    },
    "4": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "enhance details, improve quality",
            "clip": ["1", 1]
        }
    },
    "5": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "low quality, blurry",
            "clip": ["1", 1]
        }
    },
    "6": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 123456789,
            "steps": 20,
            "cfg": 7.0,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 0.5,  # 图生图通常使用0.3-0.7
            "model": ["1", 0],
            "positive": ["4", 0],
            "negative": ["5", 0],
            "latent_image": ["3", 0]
        }
    },
    "7": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": ["6", 0],
            "vae": ["1", 2]
        }
    },
    "8": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "image_to_image",
            "images": ["7", 0]
        }
    }
}
```

### 4.3 ControlNet工作流

```python
workflow = {
    "1": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly.safetensors"
        }
    },
    "2": {
        "class_type": "ControlNetLoader",
        "inputs": {
            "control_net_name": "control_v11p_sd15_canny.pth"
        }
    },
    "3": {
        "class_type": "LoadImage",
        "inputs": {
            "image": "control_input.png",
            "choose file to upload": "image"
        }
    },
    "4": {
        "class_type": "CannyEdgeDetection",
        "inputs": {
            "image": ["3", 0],
            "low_threshold": 0.1,
            "high_threshold": 0.2
        }
    },
    "5": {
        "class_type": "ControlNetApply",
        "inputs": {
            "conditioning": ["6", 0],
            "control_net": ["2", 0],
            "image": ["4", 0]
        }
    },
    "6": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "a beautiful landscape",
            "clip": ["1", 1]
        }
    },
    "7": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "low quality",
            "clip": ["1", 1]
        }
    },
    "8": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 123456789,
            "steps": 20,
            "cfg": 7.0,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
            "model": ["1", 0],
            "positive": ["5", 0],
            "negative": ["7", 0]
        }
    },
    "9": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": ["8", 0],
            "vae": ["1", 2]
        }
    },
    "10": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "controlnet",
            "images": ["9", 0]
        }
    }
}
```

### 4.4 LoRA工作流

```python
workflow = {
    "1": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "v1-5-pruned-emaonly.safetensors"
        }
    },
    "2": {
        "class_type": "LoraLoader",
        "inputs": {
            "lora_name": "detail_tweaker.safetensors",
            "strength_model": 0.8,
            "strength_clip": 0.8
        }
    },
    "3": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "a beautiful sunset, detailed",
            "clip": ["2", 1]
        }
    },
    "4": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "low quality",
            "clip": ["2", 1]
        }
    },
    "5": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 123456789,
            "steps": 20,
            "cfg": 7.0,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
            "model": ["2", 0],
            "positive": ["3", 0],
            "negative": ["4", 0]
        }
    },
    "6": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": ["5", 0],
            "vae": ["1", 2]
        }
    },
    "7": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "lora",
            "images": ["6", 0]
        }
    }
}
```

## 5. 参数详解与调优

### 5.1 采样参数

#### Seed（种子）

- **作用**：控制随机性，相同种子产生相同结果
- **范围**：-1（随机）到4294967295
- **建议**：
  - 调试时使用固定种子
  - 批量生成时使用不同种子

#### Steps（步数）

- **作用**：采样迭代次数，影响质量和速度
- **范围**：10-150
- **建议**：
  - 快速预览：10-15步
  - 标准质量：20-30步
  - 高质量：40-50步
  - 超过50步收益递减

#### CFG Scale（无分类器引导缩放）

- **作用**：控制提示词的强度
- **范围**：1.0-30.0
- **建议**：
  - 默认：7.0
  - 创意生成：5.0-8.0
  - 严格遵循提示词：10.0-15.0
  - 过高会导致图像失真

#### Denoise（去噪强度）

- **作用**：控制图像变化程度
- **范围**：0.0-1.0
- **建议**：
  - 文生图：1.0
  - 图生图：0.3-0.7
  - 图像编辑：0.1-0.3

### 5.2 采样器选择

| 采样器       | 特点       | 适用场景   | 速度   |
| ------------ | ---------- | ---------- | ------ |
| euler        | 快速，简单 | 快速预览   | ⭐⭐⭐⭐⭐⭐ |
| euler_a      | 更自然     | 通用场景   | ⭐⭐⭐⭐⭐  |
| dpmpp_2m     | 平衡       | 高质量生成 | ⭐⭐⭐⭐   |
| dpmpp_2m_sde | 高质量     | 精细细节   | ⭐⭐⭐    |
| ddim         | 稳定       | 视频生成   | ⭐⭐⭐    |
| uni_pc       | 新型       | 实验性     | ⭐⭐⭐    |

### 5.3 提示词工程

#### 正向提示词结构

```
[主体描述] + [风格修饰] + [质量修饰] + [技术参数]

示例：
"a beautiful sunset over the ocean, oil painting style, highly detailed, 8k resolution, masterpiece, best quality"
```

#### 负向提示词结构

```
[质量负面] + [内容负面] + [技术负面]

示例：
"low quality, blurry, ugly, deformed, bad anatomy, watermark, signature"
```

#### 常用修饰词

**质量修饰**：

- `masterpiece` - 杰作
- `best quality` - 最佳质量
- `highly detailed` - 高度细节
- `8k, 4k` - 分辨率
- `sharp focus` - 清晰焦点

**风格修饰**：

- `oil painting` - 油画风格
- `watercolor` - 水彩风格
- `anime style` - 动漫风格
- `photorealistic` - 照片写实
- `digital art` - 数字艺术

**负面修饰**：

- `low quality` - 低质量
- `blurry` - 模糊
- `ugly` - 丑陋
- `deformed` - 变形
- `bad anatomy` - 解剖错误
- `watermark` - 水印
- `signature` - 签名

## 6. 模型管理

### 6.1 主模型（Checkpoints）

#### Stable Diffusion 1.5系列

- `v1-5-pruned-emaonly.safetensors` - 标准模型
- `v1-5-inpainting.safetensors` - 修复模型
- `dreamshaper_8.safetensors` - 艺术风格

#### Stable Diffusion XL系列

- `sd_xl_base_1.0.safetensors` - SDXL基础模型
- `sd_xl_refiner_1.0.safetensors` - SDXL细化模型

#### 下载地址

- Hugging Face: https://huggingface.co/stabilityai
- Civitai: https://civitai.com
- 模型放置：`ComfyUI/models/checkpoints/`

### 6.2 LoRA模型

**功能**：微调模型，添加特定风格或概念

**使用方法**：

1. 下载LoRA模型到`models/lora/`
2. 使用LoraLoader节点加载
3. 设置强度参数（0.0-1.0）

**常用LoRA**：

- `detail_tweaker` - 细节增强
- `add_more_details` - 增加细节
- `epi_noiseoffset` - 噪声优化

### 6.3 VAE模型

**功能**：变分自编码器，影响图像解码质量

**常用VAE**：

- `vae-ft-mse-840000.safetensors` - 标准VAE
- `vae-ft-mse-560000-ema-pruned.safetensors` - 优化VAE

**放置位置**：`ComfyUI/models/vae/`

### 6.4 ControlNet模型

**功能**：通过控制图像引导生成

**常用ControlNet**：

- `control_v11p_sd15_canny.pth` - 边缘检测
- `control_v11p_sd15_openpose.pth` - 姿态控制
- `control_v11p_sd15_depth.pth` - 深度图
- `control_v11p_sd15_seg.pth` - 分割图

**放置位置**：`ComfyUI/models/controlnet/`

## 7. 高级功能

### 7.1 批量生成

```python
# 批量生成不同种子的图像
seeds = [123456789, 987654321, 555555555]

for seed in seeds:
    workflow["4"]["inputs"]["seed"] = seed
    workflow["6"]["inputs"]["filename_prefix"] = f"batch_{seed}"
    
    response = requests.post(
        f"{comfyui_url}/prompt",
        json={"prompt": workflow, "client_id": f"batch_{seed}"}
    )
```

### 7.2 图像放大

```python
workflow = {
    # ... 前面的节点 ...
    "7": {
        "class_type": "ImageUpscaleWithModel",
        "inputs": {
            "upscale_method": "nearest-exact",
            "image": ["6", 0],
            "model": "4x-UltraSharp.pth",
            "factor": 2.0
        }
    },
    "8": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "upscaled",
            "images": ["7", 0]
        }
    }
}
```

### 7.3 图像修复

```python
workflow = {
    "1": {
        "class_type": "CheckpointLoaderSimple",
        "inputs": {
            "ckpt_name": "v1-5-inpainting.safetensors"
        }
    },
    "2": {
        "class_type": "LoadImage",
        "inputs": {
            "image": "input.png",
            "choose file to upload": "image"
        }
    },
    "3": {
        "class_type": "LoadImageMask",
        "inputs": {
            "image": "mask.png",
            "choose file to upload": "image"
        }
    },
    "4": {
        "class_type": "VAEEncodeForInpaint",
        "inputs": {
            "pixels": ["2", 0],
            "vae": ["1", 2],
            "mask": ["3", 0],
            "grow_mask_by": 6
        }
    },
    "5": {
        "class_type": "CLIPTextEncode",
        "inputs": {
            "text": "restore the damaged area",
            "clip": ["1", 1]
        }
    },
    "6": {
        "class_type": "KSampler",
        "inputs": {
            "seed": 123456789,
            "steps": 20,
            "cfg": 7.0,
            "sampler_name": "euler",
            "scheduler": "normal",
            "denoise": 1.0,
            "model": ["1", 0],
            "positive": ["5", 0],
            "negative": ["5", 1],
            "latent_image": ["4", 0]
        }
    },
    "7": {
        "class_type": "VAEDecode",
        "inputs": {
            "samples": ["6", 0],
            "vae": ["1", 2]
        }
    },
    "8": {
        "class_type": "SaveImage",
        "inputs": {
            "filename_prefix": "inpaint",
            "images": ["7", 0]
        }
    }
}
```

## 8. 性能优化

### 8.1 内存优化

```python
# 启动参数
python main.py --listen 0.0.0.0 --port 8188 --fp16-vae --directml
```

**参数说明**：

- `--fp16-vae`: 使用FP16 VAE，减少显存
- `--directml`: 使用DirectML加速（Windows）
- `--xformers`: 使用xformers加速
- `--force-fp16`: 强制FP16精度

### 8.2 批处理优化

```python
# 使用KSamplerAdvanced进行批量处理
workflow = {
    "1": {
        "class_type": "KSamplerAdvanced",
        "inputs": {
            "add_noise": "enable",
            "noise_seed": 123456789,
            "steps": 20,
            "cfg": 7.0,
            "sampler_name": "euler",
            "scheduler": "normal",
            "start_at_step": 0,
            "end_at_step": 20,
            "return_with_leftover_noise": "disable",
            "model": ["1", 0],
            "positive": ["2", 0],
            "negative": ["3", 0]
        }
    }
}
```

## 9. 最佳实践

### 9.1 工作流组织

1. **模块化设计**：将复杂工作流分解为子模块
2. **命名规范**：使用有意义的节点ID和文件名
3. **版本控制**：保存工作流的不同版本
4. **文档记录**：为工作流添加注释和说明

### 9.2 质量控制

1. **参数调优**：逐步调整参数，观察效果
2. **种子控制**：使用固定种子进行对比测试
3. **批量验证**：生成多个样本选择最佳结果
4. **迭代优化**：基于结果不断改进工作流

### 9.3 错误处理

```python
try:
    response = requests.post(f"{comfyui_url}/prompt", json=payload)
    response.raise_for_status()
except requests.exceptions.RequestException as e:
    print(f"请求失败: {e}")
except json.JSONDecodeError as e:
    print(f"JSON解析失败: {e}")
```

## 10. 常见问题与解决方案

### 10.1 显存不足

**问题**：CUDA out of memory
**解决**：

- 减少batch size
- 降低分辨率
- 使用FP16精度
- 减少采样步数

### 10.2 生成速度慢

**问题**：生成时间过长
**解决**：

- 减少采样步数
- 使用更快的采样器
- 启用xformers加速
- 升级硬件

### 10.3 质量不佳

**问题**：生成图像质量差
**解决**：

- 增加采样步数
- 调整CFG Scale
- 优化提示词
- 使用更好的模型

通过以上完整教程，你可以全面了解ComfyUI的使用方法、参数配置、模型管理和最佳实践，从而有效地集成到Dify或其他应用中。