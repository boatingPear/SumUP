# 前端ai开发经验

你好！作为一名资深的 AI 前端产品开发者，我很高兴为你详细解答这些技术问题。让我结合实际的 AI 产品开发经验来逐一回答。

## 一面 (技术基础)

### 1. 浏览器事件循环与 AI 流式输出

**事件循环机制**：

```
调用栈 → 宏任务队列 → 微任务队列 → 渲染
```

**流程**：

1. 执行同步代码（调用栈）
2. 清空所有微任务（Promise.then、MutationObserver）
3. 渲染更新
4. 取一个宏任务执行（setTimeout、setInterval、I/O）
5. 重复步骤 2-4

**AI 流式输出的影响**：

```javascript
// 流式数据到达时
fetch('/api/ai').then(response => {
  const reader = response.body.getReader();
  
  async function read() {
    const { done, value } = await reader.read();
    
    if (!done) {
      // 方式 1：直接修改 state（触发 re-render）
      setContent(prev => prev + decoder.decode(value));
      // 这是微任务，会在当前宏任务结束后立即执行
      
      // 方式 2：使用 setTimeout 延迟渲染（宏任务）
      // setTimeout(() => setContent(...), 0);
    }
  }
  read();
});
```

**关键差异**：

- **微任务优先**：流式片段会立即累积到当前帧渲染，可能导致频繁重绘
- **宏任务延迟**：可以 batching 多个片段后统一渲染，减少渲染次数但增加延迟

### 2. 长文本换行与代码块溢出处理

```css
/* 聊天容器 */
.chat-container {
  max-width: 100%;
  word-wrap: break-word;      /* 长单词换行 */
  overflow-wrap: break-word;  /* CSS3 标准属性 */
  white-space: pre-wrap;      /* 保留空白符并自动换行 */
}

/* 代码块特殊处理 */
.code-block {
  position: relative;
  max-width: 100%;
  overflow-x: auto;           /* 横向滚动 */
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

/* 防止代码块撑破容器 */
pre {
  margin: 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  max-width: 100%;
}

code {
  font-family: 'Fira Code', monospace;
  white-space: pre; /* 代码保持原格式 */
}
```

**JavaScript 增强**：

```javascript
// 自动滚动到底部
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

// 检测并处理超长行
const handleLongText = (text) => {
  const maxWidth = window.innerWidth - 40; // 容器宽度
  const avgCharWidth = 8; // 估算值
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);
  
  return text.split('\n').map(line => {
    if (line.length > maxCharsPerLine && !line.includes('```')) {
      return line.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g')).join('\n');
    }
    return line;
  }).join('\n');
};
```

### 3. ReadableStream 工作原理

```javascript
// ReadableStream 是一个二进制数据流
async function streamAIResponse(url) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Hello' })
  });
  
  // 获取 ReadableStream
  const stream = response.body;
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8');
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      // value 是 Uint8Array 类型
      const chunk = decoder.decode(value, { stream: true });
      console.log('收到片段:', chunk);
      
      // 实时更新 UI
      appendToMessage(chunk);
    }
  } finally {
    reader.releaseLock();
  }
}
```

**工作流程**：	

1. **生产者**：服务器通过 `res.write()` 或 `yield` 推送数据块
2. **传输**：每个数据块被封装为 `Uint8Array`
3. **消费者**：前端通过 `reader.read()` 异步读取
4. **解码**：`TextDecoder` 将二进制转为字符串
5. **渲染**：增量更新 DOM

**优势**：

- 内存高效：不需要等待完整响应
- 实时性强：用户可以立即看到部分结果
- 背压支持：可以通过 `read()` 控制流速

### 4. 并发控制函数实现

```javascript
// 方案 1：基于 Promise 的并发控制
class ConcurrentRunner {
  constructor(limit) {
    this.limit = limit;
    this.queue = [];
    this.running = 0;
  }
  
  async run(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.next();
    });
  }
  
  async next() {
    if (this.running >= this.limit || this.queue.length === 0) {
      return;
    }
    
    this.running++;
    const { task, resolve, reject } = this.queue.shift();
    
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.next(); // 启动下一个任务
    }
  }
}

// 使用示例
async function callMultipleAIModels(prompts) {
  const runner = new ConcurrentRunner(3);
  
  const tasks = prompts.map(prompt => 
    () => fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    }).then(res => res.json())
  );
  
  const results = await Promise.all(
    tasks.map(task => runner.run(task))
  );
  
  return results;
}

// 方案 2：更简洁的实现
function concurrencyLimit(tasks, limit) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let running = 0;
    let completed = 0;
    const results = [];
    
    function run() {
      if (index >= tasks.length && running === 0) {
        resolve(results);
        return;
      }
      
      while (running < limit && index < tasks.length) {
        const taskIndex = index++;
        running++;
        
        tasks[taskIndex]()
          .then(result => {
            results[taskIndex] = result;
            completed++;
            running--;
            run();
          })
          .catch(reject);
      }
    }
    
    run();
  });
}
```

### 5. TypeScript 泛型在 AI 接口封装中的应用

```typescript
// 基础泛型接口
interface AIResponse<T> {
  data: T;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ImageGeneration {
  url: string;
  revised_prompt?: string;
}

// 泛型请求函数
async function requestAI<T>(
  endpoint: string,
  payload: unknown
): Promise<AIResponse<T>> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`AI API Error: ${response.status}`);
  }
  
  return response.json();
}

// 使用示例
async function chat() {
  const result = await requestAI<ChatMessage>('/api/chat', {
    messages: [{ role: 'user', content: 'Hello' }]
  });
  
  console.log(result.data.content); // 类型安全
}

async function generateImage() {
  const result = await requestAI<ImageGeneration>('/api/dalle', {
    prompt: 'A cute cat'
  });
  
  console.log(result.data.url); // 类型提示
}

// 高级：条件泛型
type AIResponseType<T extends 'chat' | 'image' | 'embedding'> = 
  T extends 'chat' ? ChatMessage :
  T extends 'image' ? ImageGeneration :
  number[];

function createAIRequest<T extends 'chat' | 'image' | 'embedding'>(
  type: T
) {
  return async (payload: unknown) => 
    requestAI<AIResponseType<T>>(`/api/${type}`, payload);
}
```

**泛型的价值**：

1. **类型安全**：不同 AI 接口返回不同数据结构
2. **代码复用**：一套逻辑处理多种响应类型
3. **智能提示**：IDE 可以推断具体类型
4. **错误预防**：编译时发现类型不匹配

### 6. Markdown 渲染防 XSS 攻击

```javascript
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 方案 1：DOMPurify 清洗
const SafeMarkdown = ({ content }) => {
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: ['class'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload'] // 禁止事件处理器
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

// 方案 2：react-markdown + 自定义组件
const CustomCode = ({ node, inline, className, children, ...props }) => {
  // 只允许安全的 class
  const match = /language-(\w+)/.exec(className || '');
  const safeClass = match ? `language-${match[1]}` : '';
  
  return !inline ? (
    <pre {...props} className={safeClass}>
      <code className={safeClass}>{children}</code>
    </pre>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const SecureMarkdownRenderer = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code: CustomCode,
      // 过滤危险标签
      script: () => null,
      iframe: () => null
    }}
    disallowedElements={['script', 'iframe', 'object']}
  >
    {content}
  </ReactMarkdown>
);

// 方案 3：CSP 头防护（服务端配置）
// Content-Security-Policy: default-src 'self'; script-src 'none';
```

**最佳实践组合**：

```javascript
const ProductionMarkdown = ({ content }) => {
  // 1. 预处理：移除危险模式
  const cleaned = content
    .replace(/javascript:/gi, '')
    .replace(/data:image/svg/gi, '');
  
  // 2. DOMPurify 深度清洗
  const purified = DOMPurify.sanitize(cleaned, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['pre', 'code'],
    ADD_ATTR: ['class']
  });
  
  // 3. 沙箱 iframe（可选）
  // <iframe sandbox="allow-same-origin" srcDoc={purified} />
  
  return <div dangerouslySetInnerHTML={{ __html: purified }} />;
};
```

### 7. CSS Sticky 布局与聊天列表应用

```css
/* Sticky 定位 */
.sticky-header {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0; /* 距离视口顶部 0 时固定 */
  z-index: 100;
  background: white;
}

/* 聊天界面应用 */
.chat-container {
  height: 100vh;
  overflow-y: auto;
}

/* 日期分组标题 */
.date-divider {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  z-index: 10;
}

/* 输入框固定在底部 */
.chat-input-wrapper {
  position: sticky;
  bottom: 0;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* 功能按钮组 */
.action-bar {
  position: sticky;
  top: 60px; /* 在日期标题下方 */
  z-index: 9;
}
```

**应用场景**：

1. **日期分隔线**：长对话列表中，当前分组的标题始终可见
2. **输入框**：无论滚动到哪里，输入区域始终在底部
3. **工具栏**：快捷操作按钮跟随滚动
4. **未读消息提示**：滚动时显示"新消息"按钮

```jsx
// 实际案例
const ChatList = ({ messages }) => {
  const groupedMessages = groupByDate(messages);
  
  return (
    <div className="chat-container">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div className="date-divider sticky-header">
            {date}
          </div>
          {msgs.map(msg => <MessageItem key={msg.id} {...msg} />)}
        </div>
      ))}
      <div className="chat-input-wrapper sticky-footer">
        <Input />
      </div>
    </div>
  );
};
```

### 8. React useEffect 闭包陷阱与避免方法

**陷阱示例**：

```javascript
// ❌ 错误示范
function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  
  useEffect(() => {
    if (!streaming) return;
    
    // 闭包陷阱：这里的 streaming 永远是初始值
    const interval = setInterval(() => {
      console.log(streaming); // 即使外部变为 false，这里仍是 true
      if (!streaming) { // 这个判断永远不会成立
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [streaming]); // 依赖变化会重新创建 interval
  
  return <div>...</div>;
}
```

**解决方案**：

```javascript
// ✅ 方案 1：使用 ref 保持最新值
function ChatBox() {
  const streamingRef = useRef(streaming);
  useEffect(() => {
    streamingRef.current = streaming;
  }, [streaming]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      console.log(streamingRef.current); // 总是最新的
      if (!streamingRef.current) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // 空依赖，只执行一次
}

// ✅ 方案 2：使用函数式更新
function ChatBox() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const handleStream = async () => {
      const response = await fetch('/api/stream');
      const reader = response.body.getReader();
      
      while (true) {
        const { value } = await reader.read();
        if (!value) break;
        
        // 函数式更新，不依赖外部 state
        setMessages(prev => [...prev, decode(value)]);
      }
    };
    
    handleStream();
  }, []); // 不需要依赖
}

// ✅ 方案 3：使用 useCallback 稳定依赖
function ChatBox() {
  const processMessage = useCallback((msg) => {
    // 稳定的函数引用
  }, []);
  
  useEffect(() => {
    // processMessage 不会变化
  }, [processMessage]);
}

// ✅ 方案 4：清理函数中取消订阅
function ChatBox() {
  useEffect(() => {
    let cancelled = false;
    
    const streamData = async () => {
      const reader = getReader();
      
      while (!cancelled) {
        const chunk = await reader.read();
        if (cancelled) break;
        updateUI(chunk);
      }
    };
    
    streamData();
    
    return () => {
      cancelled = true; // 清理标志
    };
  }, []);
}
```

### 9. 字符串模板替换函数

```javascript
// 方案 1：基础正则替换
function templateReplace(template, variables) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in variables ? variables[key] : match;
  });
}

// 使用示例
const prompt = '你好，{{name}}！你是{{role}}，请{{task}}';
const result = templateReplace(prompt, {
  name: '张三',
  role: '前端工程师',
  task: '写一份简历'
});
// "你好，张三！你是前端工程师，请写一份简历"

// 方案 2：支持嵌套对象
function deepTemplateReplace(template, data) {
  return template.replace(/\{\{([\w.]+)\}\}/g, (match, path) => {
    const value = path.split('.').reduce((obj, key) => {
      return obj?.[key];
    }, data);
    
    return value !== undefined ? String(value) : match;
  });
}

const userPrompt = '用户{{user.name}}({{user.email}})需要{{service.type}}服务';
deepTemplateReplace(userPrompt, {
  user: { name: '李四', email: 'lisi@example.com' },
  service: { type: '咨询' }
});

// 方案 3：支持默认值
function templateWithDefault(template, variables) {
  return template.replace(/\{\{(\w+)(?:\|([^}]*))?\}\}/g, (match, key, defaultValue) => {
    return key in variables ? variables[key] : (defaultValue || '');
  });
}

templateReplace('欢迎{{name|访客}}', {}); // "欢迎访客"

// 方案 4：支持 HTML 转义（安全）
function safeTemplateReplace(template, variables) {
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };
  
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in variables)) return match;
    return escapeHtml(String(variables[key]));
  });
}

// 方案 5：支持逻辑表达式（高级）
function advancedTemplate(template, data) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    try {
      // 使用 Function 构造器安全求值
      const fn = new Function('data', `with(data) { return ${expression} }`);
      return fn(data);
    } catch {
      return match;
    }
  });
}

advancedTemplate('价格：{{price * quantity}}', { price: 100, quantity: 3 });
// "价格：300"
```

### 10. 括号匹配算法

```javascript
// 方案 1：栈实现
function isValidParentheses(s) {
  const stack = [];
  const map = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  
  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else if (char in map) {
      if (stack.pop() !== map[char]) {
        return false;
      }
    }
    // 忽略其他字符（AI 返回的 JSON 片段可能包含内容）
  }
  
  return stack.length === 0;
}

// 测试
isValidParentheses('()'); // true
isValidParentheses('()[]{}'); // true
isValidParentheses('(]'); // false
isValidParentheses('{[()]}'); // true
isValidParentheses('{"data": {"key": [1,2,3]}}'); // true

// 方案 2：带位置信息（用于错误提示）
function validateWithPosition(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    
    if (char === '(' || char === '[' || char === '{') {
      stack.push({ char, index: i });
    } else if (char in pairs) {
      const last = stack.pop();
      if (!last || last.char !== pairs[char]) {
        return {
          valid: false,
          error: `位置 ${i} 的 '${char}' 没有匹配的左括号`,
          position: i
        };
      }
    }
  }
  
  if (stack.length > 0) {
    const last = stack[stack.length - 1];
    return {
      valid: false,
      error: `位置 ${last.index} 的 '${last.char}' 没有闭合`,
      position: last.index
    };
  }
  
  return { valid: true };
}

// 方案 3：提取并验证 JSON 结构
function extractAndValidateJSON(text) {
  // 尝试提取 JSON 片段
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  
  const jsonStr = jsonMatch[0];
  
  // 验证括号
  const validation = validateWithPosition(jsonStr);
  if (!validation.valid) {
    console.error(validation.error);
    return null;
  }
  
  // 尝试解析
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('JSON 解析失败:', e.message);
    return null;
  }
}
```

---

## 二面 (深入原理与项目)

### 1. SSE vs WebSocket 选型分析

| 维度         | SSE (Server-Sent Events) | WebSocket              |
| ------------ | ------------------------ | ---------------------- |
| **协议**     | HTTP 长连接              | WebSocket 协议 (ws://) |
| **方向**     | 单向（服务器→客户端）    | 双向通信               |
| **数据格式** | 文本（默认）             | Binary/String          |
| **心跳**     | 自动重连                 | 需手动实现 ping/pong   |
| **兼容性**   | 不支持 IE                | 全浏览器支持           |
| **性能**     | 轻量                     | 稍重（握手开销）       |

**SSE 实现**：

```javascript
// 前端
const eventSource = new EventSource('/api/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  appendMessage(data.content);
};

eventSource.onerror = () => {
  eventSource.close();
  // 自动重连
};

// 后端 (Node.js/Express)
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // AI 流式输出
  aiStream.on('data', (chunk) => send({ content: chunk }));
  aiStream.on('end', () => {
    send({ done: true });
    res.end();
  });
});
```

**WebSocket 实现**：

```javascript
// 前端
const ws = new WebSocket('ws://localhost:8080/chat');

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'chat', prompt: 'Hello' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'chunk') {
    appendMessage(data.content);
  }
};

// 心跳检测
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);

// 后端
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
      return;
    }
    
    // 处理 AI 请求
    aiStream.on('data', (chunk) => {
      ws.send(JSON.stringify({ type: 'chunk', content: chunk }));
    });
  });
});
```

**选型建议**：

- **选 SSE**：纯 AI 流式输出、简单通知推送
- **选 WebSocket**：需要客户端主动发送消息、实时协作编辑、多人聊天室

### 2. Markdown 频繁渲染性能优化

**问题**：AI 逐字输出时，每次更新都重新渲染整个 Markdown

**解决方案**：

```javascript
// 方案 1：虚拟列表 + 分片渲染
import { FixedSizeList } from 'react-window';

const VirtualizedChat = ({ messages }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={messages.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <Message message={messages[index]} />
        </div>
      )}
    </FixedSizeList>
  );
};

// 方案 2：Memoization 避免无效渲染
const MessageItem = React.memo(({ message }) => {
  const rendered = useMemo(() => {
    return <MarkdownRenderer content={message.content} />;
  }, [message.content]); // 只在内容变化时重新渲染
  
  return <div>{rendered}</div>;
});

// 方案 3：节流更新
function useThrottledStream(callback, delay = 100) {
  const [content, setContent] = useState('');
  const timeoutRef = useRef(null);
  
  const append = useCallback((chunk) => {
    if (timeoutRef.current) {
      // 已有定时器，累积内容
      setContent(prev => prev + chunk);
    } else {
      // 立即更新
      setContent(prev => prev + chunk);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, delay);
    }
  }, []);
  
  return { content, append };
}

// 方案 4：Canvas 渲染（极端优化）
class CanvasMarkdown extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.pendingUpdates = [];
  }
  
  componentDidUpdate() {
    // 批量绘制
    requestAnimationFrame(() => {
      this.renderToCanvas(this.props.content);
    });
  }
  
  renderToCanvas(text) {
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 自定义文本渲染逻辑
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, 10, 20 + i * 20);
    });
  }
  
  render() {
    return <canvas ref={this.canvasRef} width={800} height={600} />;
  }
}

// 方案 5：防止页面跳动
const ChatContainer = () => {
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };
  
  // 只在用户接近底部时自动滚动
  const shouldAutoScroll = useRef(true);
  
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 100; // 距离底部 100px
    
    shouldAutoScroll.current = 
      scrollHeight - (scrollTop + clientHeight) < threshold;
  };
  
  useEffect(() => {
    if (shouldAutoScroll.current) {
      scrollToBottom();
    }
  }, [messages]);
  
  return (
    <div onScroll={handleScroll}>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      <div ref={messagesEndRef} style={{ height: '1px' }} />
    </div>
  );
};
```

### 3. AI Agent 上下文管理

**前端职责**：

```javascript
// 方案 1：本地状态管理
const useContextManager = () => {
  const [context, setContext] = useState({
    messages: [],
    systemPrompt: '',
    metadata: {}
  });
  
  // 添加消息到上下文
  const addMessage = useCallback((role, content) => {
    setContext(prev => ({
      ...prev,
      messages: [...prev.messages, { role, content, timestamp: Date.now() }]
    }));
  }, []);
  
  // 压缩上下文（超出 token 限制时）
  const compressContext = useCallback((maxTokens = 4000) => {
    setContext(prev => {
      const tokens = estimateTokens(prev.messages);
      
      if (tokens <= maxTokens) return prev;
      
      // 保留系统提示和最近 N 条消息
      const recentMessages = prev.messages.slice(-10);
      return { ...prev, messages: recentMessages };
    });
  }, []);
  
  // 持久化到 localStorage
  useEffect(() => {
    localStorage.setItem('chat-context', JSON.stringify(context));
  }, [context]);
  
  return { context, addMessage, compressContext };
};

// 方案 2：IndexedDB 存储大上下文
import { openDB } from 'idb';

class ContextStorage {
  async init() {
    this.db = await openDB('chat-db', 1, {
      upgrade(db) {
        db.createObjectStore('contexts', { keyPath: 'sessionId' });
      }
    });
  }
  
  async save(sessionId, context) {
    await this.db.put('contexts', { sessionId, ...context, updatedAt: Date.now() });
  }
  
  async load(sessionId) {
    return await this.db.get('contexts', sessionId);
  }
  
  async prune(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    const tx = this.db.transaction('contexts', 'readwrite');
    const store = tx.objectStore('contexts');
    
    for await (const cursor of store.iterate()) {
      if (cursor.value.updatedAt < cutoff) {
        cursor.delete();
      }
    }
  }
}

// 方案 3：上下文摘要（高级）
const createContextSummary = async (messages) => {
  // 调用小型模型生成摘要
  const summary = await fetch('/api/summarize', {
    method: 'POST',
    body: JSON.stringify({ messages })
  }).then(r => r.json());
  
  return {
    original: messages,
    summary: summary.text,
    keyPoints: summary.points
  };
};

// 使用策略
const manageContext = (messages) => {
  const tokenCount = countTokens(messages);
  
  if (tokenCount < 3000) {
    return { type: 'full', data: messages };
  } else if (tokenCount < 6000) {
    return { type: 'recent', data: messages.slice(-20) };
  } else {
    return { type: 'summary', data: await createContextSummary(messages) };
  }
};
```

**前端工作清单**：

1. ✅ 维护消息历史队列
2. ✅ Token 计数与限制检测
3. ✅ 上下文压缩策略
4. ✅ 会话持久化（localStorage/IndexedDB）
5. ✅ 多会话切换
6. ✅ 上下文导出/导入

### 4. Function Calling 处理

**什么是 Function Calling**：
模型返回的不是文本，而是一个 JSON 对象，指示前端调用某个函数。

```javascript
// 模型返回示例
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "function_call": {
        "name": "get_weather",
        "arguments": "{\"location\": \"北京\", \"date\": \"2024-01-01\"}"
      }
    }
  }]
}

// 前端定义可用函数
const functions = [
  {
    name: 'get_weather',
    description: '查询天气',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
        date: { type: 'string' }
      },
      required: ['location']
    }
  },
  {
    name: 'search_database',
    description: '搜索数据库',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' }
      }
    }
  }
];

// 发送给模型
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{ role: 'user', content: '北京明天天气怎么样？' }],
    functions,
    function_call: 'auto' // auto: 让模型决定是否调用
  })
});

const data = await response.json();
const message = data.choices[0].message;

// 处理函数调用
if (message.function_call) {
  const { name, arguments: argsStr } = message.function_call;
  const args = JSON.parse(argsStr);
  
  // 执行对应函数
  const result = await executeFunction(name, args);
  
  // 将结果返回给模型
  const finalResponse = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      messages: [
        { role: 'user', content: '北京明天天气怎么样？' },
        message, // 包含 function_call
        {
          role: 'function',
          name,
          content: JSON.stringify(result)
        }
      ]
    })
  });
  
  // 最终回复
  const reply = await finalResponse.json();
  displayMessage(reply.choices[0].message.content);
}

// 函数执行器
async function executeFunction(name, args) {
  switch (name) {
    case 'get_weather':
      return await fetchWeather(args.location, args.date);
    case 'search_database':
      return await searchDB(args.query, args.limit);
    default:
      throw new Error(`Unknown function: ${name}`);
  }
}

// 现代 API（OpenAI Tool Calls）
const tools = [
  {
    type: 'function',
    function: {
      name: 'create_calendar_event',
      description: '创建日历事件',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          start_time: { type: 'string', format: 'date-time' },
          end_time: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
];

// 处理 tool_calls
const toolCalls = message.tool_calls;
for (const call of toolCalls) {
  const result = await executeFunction(call.function.name, 
    JSON.parse(call.function.arguments));
  
  // 返回结果
  messages.push({
    role: 'tool',
    tool_call_id: call.id,
    content: JSON.stringify(result)
  });
}
```

### 5. RAG 引用来源展示优化

```javascript
// 数据结构
const ragResponse = {
  answer: "Vue 3 采用了 Composition API...",
  citations: [
    {
      id: 1,
      source: "Vue 官方文档",
      url: "https://vuejs.org/guide/introduction.html",
      excerpt: "Composition API 提供了一种新的代码组织方式",
      confidence: 0.95
    },
    {
      id: 2,
      source: "技术博客",
      url: "https://example.com/vue3",
      excerpt: "相比 Options API，Composition API 更适合复杂逻辑",
      confidence: 0.87
    }
  ]
};

// 方案 1：侧边栏引用面板
const CitationSidebar = ({ citations }) => {
  const [activeId, setActiveId] = useState(null);
  
  return (
    <aside className="citation-panel">
      <h3>参考来源 ({citations.length})</h3>
      <ul>
        {citations.map((cite, index) => (
          <li
            key={cite.id}
            className={`citation-item ${activeId === cite.id ? 'active' : ''}`}
            onMouseEnter={() => setActiveId(cite.id)}
            onClick={() => window.open(cite.url, '_blank')}
          >
            <span className="citation-number">[{index + 1}]</span>
            <span className="citation-source">{cite.source}</span>
            <span className="citation-confidence">
              可信度：{(cite.confidence * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

// 方案 2：内联引用标记
const AnswerWithCitations = ({ answer, citations }) => {
  // 假设答案中包含 [1], [2] 等标记
  const parts = answer.split(/(\[\d+\])/g);
  
  return (
    <div className="answer-content">
      {parts.map((part, i) => {
        const match = part.match(/\[(\d+)\]/);
        if (match) {
          const citation = citations[parseInt(match[1]) - 1];
          return (
            <Tooltip
              key={i}
              content={
                <div className="citation-tooltip">
                  <strong>{citation.source}</strong>
                  <p>{citation.excerpt}</p>
                  <a href={citation.url} target="_blank">查看原文</a>
                </div>
              }
            >
              <sup className="citation-marker">{part}</sup>
            </Tooltip>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

// 方案 3：可折叠引用卡片
const CollapsibleCitations = ({ citations }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="citations-collapsible">
      <button 
        className="toggle-btn"
        onClick={() => setExpanded(!expanded)}
      >
        📚 参考来源 ({citations.length})
        {expanded ? '▲' : '▼'}
      </button>
      
      {expanded && (
        <div className="citations-content">
          {citations.map((cite, i) => (
            <div key={cite.id} className="citation-card">
              <div className="card-header">
                <span className="index">[{i + 1}]</span>
                <a href={cite.url} target="_blank">{cite.source}</a>
              </div>
              <p className="excerpt">{cite.excerpt}</p>
              <div className="meta">
                <span className="confidence">
                  匹配度：{Math.round(cite.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 方案 4：高亮引用片段
const HighlightedExcerpts = ({ citations }) => {
  return (
    <div className="highlight-section">
      <h4>关键引用</h4>
      {citations.map((cite, i) => (
        <blockquote key={cite.id} className="highlighted-quote">
          <p>"{cite.excerpt}"</p>
          <footer>
            — <cite>
              <a href={cite.url} target="_blank">{cite.source}</a>
            </cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
};

// CSS 样式优化
.css`
  .citation-marker {
    color: #1890ff;
    cursor: pointer;
    font-size: 0.8em;
    vertical-align: super;
  }
  
  .citation-marker:hover {
    text-decoration: underline;
  }
  
  .citation-tooltip {
    max-width: 300px;
    padding: 8px;
    background: white;
    border: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  
  .citation-confidence {
    display: inline-block;
    padding: 2px 6px;
    background: #f6ffed;
    border: 1px solid #b7eb8f;
    border-radius: 4px;
    font-size: 0.8em;
    color: #52c41a;
  }
`;
```

### 6. 通用 AI Chat 组件库设计

```typescript
// 核心架构
interface ChatComponentProps {
  // 数据层
  messages: Message[];
  onSend: (message: string) => Promise<void>;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  
  // 配置层
  config: ChatConfig;
  
  // UI 定制
  renderers: {
    message?: (msg: Message) => React.ReactNode;
    input?: (props: InputProps) => React.ReactNode;
    loading?: () => React.ReactNode;
  };
  
  // 主题
  theme: 'light' | 'dark' | 'custom';
}

// 组件结构
const AIChatLibrary = {
  // 1. 核心聊天组件
  ChatContainer: ({ children, className }) => ...,
  MessageList: ({ messages, virtualized }) => ...,
  MessageItem: ({ message, actions }) => ...,
  
  // 2. 输入区域
  InputArea: ({ 
    placeholder, 
    onSubmit, 
    attachments,
    suggestions 
  }) => ...,
  
  // 3. 功能组件
  TypingIndicator: () => ...,
  RegenerateButton: () => ...,
  CopyButton: ({ text }) => ...,
  EditButton: ({ messageId }) => ...,
  
  // 4. 高级功能
  CodeBlock: ({ language, code }) => ...,
  MarkdownRenderer: ({ content, sanitize }) => ...,
  CitationPanel: ({ citations }) => ...,
  
  // 5. Hooks
  useChat: (config) => ({
    messages,
    sendMessage,
    regenerate,
    editMessage,
    clearHistory
  }),
  
  useStream: (url) => ({
    data,
    loading,
    error,
    stop
  })
};

// 扩展性设计
// 方案 1：插件系统
interface ChatPlugin {
  name: string;
  install: (chat: ChatInstance) => void;
  uninstall: () => void;
}

class PluginManager {
  private plugins: Map<string, ChatPlugin> = new Map();
  
  register(plugin: ChatPlugin) {
    this.plugins.set(plugin.name, plugin);
  }
  
  apply(extensionPoint: string, ...args: any[]) {
    this.plugins.forEach(plugin => {
      if (plugin[extensionPoint]) {
        plugin[extensionPoint](...args);
      }
    });
  }
}

// 使用示例
const emojiPlugin: ChatPlugin = {
  name: 'emoji-picker',
  install: (chat) => {
    chat.addComponent('EmojiPicker', EmojiPickerComponent);
  }
};

// 方案 2：Render Props
<ChatContainer
  renderMessage={(message) => (
    <CustomMessage>
      <Avatar src={message.avatar} />
      <Content>{message.content}</Content>
      <Actions>
        <LikeButton />
        <ShareButton />
      </Actions>
    </CustomMessage>
  )}
/>

// 方案 3：Compound Components
<Chat>
  <Chat.Header>
    <Chat.Title>AI Assistant</Chat.Title>
    <Chat.Status online={true} />
  </Chat.Header>
  
  <Chat.Messages>
    {messages.map(msg => (
      <Chat.Message key={msg.id} {...msg} />
    ))}
  </Chat.Messages>
  
  <Chat.Input
    placeholder="输入消息..."
    onSubmit={sendMessage}
  />
</Chat>

// 方案 4：Headless Hooks（无 UI 逻辑）
const {
  getInputProps,
  getSubmitButtonProps,
  messages,
  sendMessage
} = useChatHeadless({
  api: '/api/chat',
  stream: true
});

// 完全自定义 UI
<input {...getInputProps()} />
<button {...getSubmitButtonProps()}>发送</button>
```

**扩展性考虑**：

1. ✅ **多模态支持**：图片、音频、文件上传
2. ✅ **国际化**：i18n 配置
3. ✅ **无障碍**：ARIA 属性
4. ✅ **主题系统**：CSS Variables + Theme Provider
5. ✅ **性能插件**：虚拟列表、懒加载
6. ✅ **分析集成**：埋点接口

### 7. AI 响应慢的感知优化

```javascript
// 方案 1：乐观更新
const OptimisticChat = () => {
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(new Set());
  
  const sendMessage = async (content) => {
    const tempId = `temp-${Date.now()}`;
    
    // 立即显示用户消息
    setMessages(prev => [...prev, {
      id: tempId,
      role: 'user',
      content,
      status: 'pending'
    }]);
    
    setPending(prev => new Set(prev).add(tempId));
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content })
      });
      
      // 流式接收 AI 响应
      const reader = response.body.getReader();
      let aiContent = '';
      
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: '',
        status: 'streaming'
      }]);
      
      while (true) {
        const { value } = await reader.read();
        if (!value) break;
        
        aiContent += new TextDecoder().decode(value);
        
        // 实时更新
        setMessages(prev => prev.map(msg => 
          msg.status === 'streaming' 
            ? { ...msg, content: aiContent }
            : msg
        ));
      }
    } finally {
      setPending(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }
  };
  
  return <div>...</div>;
};

// 方案 2：骨架屏与进度提示
const LoadingStates = () => {
  const [stage, setStage] = useState('thinking'); // thinking | generating | streaming
  
  return (
    <div className="loading-indicator">
      {stage === 'thinking' && (
        <div className="thinking-animation">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
          <span>AI 正在思考...</span>
        </div>
      )}
      
      {stage === 'generating' && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '30%' }}></div>
          <span>正在生成回复...</span>
        </div>
      )}
      
      {stage === 'streaming' && (
        <div className="streaming-badge">
          <span className="pulse-dot"></span>
          输出中...
        </div>
      )}
    </div>
  );
};

// 方案 3：预估时间显示
const EstimatedTime = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);
  const estimatedTotal = 3000; // 预估 3 秒
  
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  const progress = Math.min(elapsed / estimatedTotal, 1);
  
  return (
    <div className="time-estimate">
      <div className="progress-ring">
        <svg viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#1890ff"
            strokeWidth="3"
            strokeDasharray={`${progress * 100}, 100`}
          />
        </svg>
      </div>
      <span>预计还需 {Math.round(estimatedTotal - elapsed)}ms</span>
    </div>
  );
};

// 方案 4：分阶段提示
const StageMessages = () => {
  const stages = [
    { threshold: 0, message: '正在理解您的问题...' },
    { threshold: 1000, message: '检索相关知识...' },
    { threshold: 2000, message: '组织回答内容...' },
    { threshold: 3000, message: '即将完成...' }
  ];
  
  const [currentStage, setCurrentStage] = useState(0);
  
  useEffect(() => {
    const timers = stages.map((stage, index) =>
      setTimeout(() => setCurrentStage(index), stage.threshold)
    );
    
    return () => timers.forEach(clearTimeout);
  }, []);
  
  return (
    <div className="stage-message">
      <TransitionGroup>
        <CSSTransition key={currentStage} timeout={300} classNames="fade">
          <span>{stages[currentStage].message}</span>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

// 方案 5：后台预加载
const PrefetchStrategy = () => {
  const prefetchResponse = useCallback(() => {
    // 用户开始输入时就准备请求
    const controller = new AbortController();
    
    fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: '' }), // 空 prompt 预热连接
      signal: controller.signal
    }).catch(() => {}); // 忽略错误
    
    return () => controller.abort(); // 清理
  }, []);
  
  return <button onMouseEnter={prefetchResponse}>提问</button>;
};
```

### 8. 前端参与 Prompt Engineering

```javascript
// 方案 1：动态 Prompt 构建器
class PromptBuilder {
  constructor(basePrompt) {
    this.parts = {
      system: basePrompt.system,
      context: [],
      examples: [],
      user: null
    };
  }
  
  addContext(context) {
    this.parts.context.push(context);
    return this;
  }
  
  addExample(example) {
    this.parts.examples.push(example);
    return this;
  }
  
  setUserPrompt(prompt) {
    this.parts.user = prompt;
    return this;
  }
  
  build() {
    const { system, context, examples, user } = this.parts;
    
    return [
      `<system>${system}</system>`,
      context.length ? `<context>\n${context.join('\n')}</context>` : '',
      examples.length ? `<examples>\n${examples.join('\n')}</examples>` : '',
      `<user>${user}</user>`
    ].filter(Boolean).join('\n\n');
  }
}

// 使用
const prompt = new PromptBuilder('你是一个专业的编程助手')
  .addContext('用户正在学习 React')
  .addExample('Q: 什么是 hooks? A: hooks 是 React 函数组件的状态管理工具')
  .setUserPrompt('解释一下 useEffect')
  .build();

// 方案 2：Prompt 模板系统
const promptTemplates = {
  code_review: `
你是一位资深代码审查专家。请审查以下代码：

审查要点：
1. 代码规范
2. 性能优化
3. 安全性
4. 可维护性

代码：
\`\[\](file://d:\ai\pack_projecta\projects\vue-h5-vant\README.md)
{{code}}
\[\](file://d:\ai\pack_projecta\projects\vue-h5-vant\README.md)\`

请以表格形式输出审查结果。
`,
  
  bug_fix: `
你是一个调试专家。帮我找出以下代码的问题：

错误信息：{{error}}
相关代码：
\`\[\](file://d:\ai\pack_projecta\projects\vue-h5-vant\README.md)
{{code}}
\[\](file://d:\ai\pack_projecta\projects\vue-h5-vant\README.md)\`

请提供：
1. 问题原因
2. 修复方案
3. 修改后的代码
`,
  
  explanation: `
用通俗易懂的语言解释以下概念：

概念：{{concept}}
目标受众：{{audience}}
深度要求：{{depth}}
`
};

function renderPrompt(template, variables) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}

// 方案 3：Prompt 版本管理
const usePromptVersioning = () => {
  const [versions, setVersions] = useState([
    {
      id: 1,
      prompt: '你是一个助手',
      performance: { accuracy: 0.75, latency: 2000 },
      createdAt: Date.now()
    },
    {
      id: 2,
      prompt: '你是一个专业的编程助手，擅长解答前端问题',
      performance: { accuracy: 0.85, latency: 1800 },
      createdAt: Date.now()
    }
  ]);
  
  const testPrompt = async (promptText, testCases) => {
    const results = await Promise.all(
      testCases.map(async testCase => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            system: promptText,
            user: testCase.input
          })
        });
        
        const data = await response.json();
        return {
          input: testCase.input,
          output: data.content,
          expected: testCase.expected,
          score: calculateScore(data.content, testCase.expected)
        };
      })
    );
    
    return {
      avgScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
      results
    };
  };
  
  return { versions, testPrompt };
};

// 硬编码 Prompt 的风险：
// 1. ⚠️ 难以迭代优化
// 2. ⚠️ 无法 A/B 测试
// 3. ⚠️ 敏感词难以管控
// 4. ⚠️ 多语言支持困难
// 5. ⚠️ 业务逻辑耦合

// 最佳实践：
// ✅ Prompt 集中管理（配置文件/数据库）
// ✅ 支持热更新
// ✅ 版本控制与回滚
// ✅ 环境变量区分场景
// ✅ 敏感词过滤中间件
```

### 9. AI 产品 Web Vitals 监控

```javascript
// 标准 Web Vitals
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

// AI 特有指标
const AIMetrics = {
  // 1. 首字时间（Time to First Token）
  measureTTFT: () => {
    let startTime;
    let firstTokenTime;
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.name === 'ai-request-start') {
          startTime = entry.startTime;
        }
        if (entry.name === 'ai-first-token' && !firstTokenTime) {
          firstTokenTime = entry.startTime;
          
          // 上报 TTFT
          const ttft = firstTokenTime - startTime;
          reportMetric('TTFT', ttft);
        }
      });
    });
    
    observer.observe({ entryTypes: ['mark'] });
    
    return {
      markStart: () => performance.mark('ai-request-start'),
      markFirstToken: () => performance.mark('ai-first-token')
    };
  },
  
  // 2. 流式速率（Tokens per Second）
  measureTokenRate: () => {
    const tokens = [];
    let startTime;
    
    return {
      start: () => { startTime = Date.now(); },
      recordToken: () => { tokens.push(Date.now()); },
      getRate: () => {
        if (tokens.length < 2) return 0;
        const duration = (tokens[tokens.length - 1] - startTime) / 1000;
        return tokens.length / duration;
      }
    };
  },
  
  // 3. 响应完整时间（Time to Complete Response）
  measureTTCR: () => {
    const marks = performance.getEntriesByName('ai-request-start');
    const start = marks[0]?.startTime;
    
    return {
      markComplete: () => {
        const complete = performance.mark('ai-response-complete').startTime;
        const ttcr = complete - start;
        reportMetric('TTCR', ttcr);
      }
    };
  },
  
  // 4. 渲染延迟（Rendering Latency）
  measureRenderLatency: () => {
    const renders = [];
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'paint') {
          renders.push(entry.startTime);
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
    
    return {
      getAverageDelay: () => {
        if (renders.length < 2) return 0;
        const delays = [];
        for (let i = 1; i < renders.length; i++) {
          delays.push(renders[i] - renders[i - 1]);
        }
        return delays.reduce((a, b) => a + b, 0) / delays.length;
      }
    };
  },
  
  // 5. 用户感知质量（Quality of Experience）
  measureQoE: () => {
    const metrics = {
      interruptions: 0, // 中断次数
      regenerations: 0, // 重新生成次数
      edits: 0, // 编辑次数
      satisfaction: null // 用户评分
    };
    
    return {
      recordInterruption: () => { metrics.interruptions++; },
      recordRegeneration: () => { metrics.regenerations++; },
      recordEdit: () => { metrics.edits++; },
      setSatisfaction: (score) => { metrics.satisfaction = score; },
      getQoEScore: () => {
        // QoE = 100 - (中断*10 + 重生成*5 + 编辑*5) + 满意度*20
        return Math.max(0, Math.min(100,
          100 - (metrics.interruptions * 10 + 
                 metrics.regenerations * 5 + 
                 metrics.edits * 5) +
          (metrics.satisfaction || 0) * 20
        ));
      }
    };
  }
};

// 集成到 React
const AIChatWithMetrics = () => {
  const ttft = useMemo(() => AIMetrics.measureTTFT(), []);
  const tokenRate = useMemo(() => AIMetrics.measureTokenRate(), []);
  
  const sendMessage = async (content) => {
    ttft.markStart();
    tokenRate.start();
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    
    const reader = response.body.getReader();
    let isFirstToken = true;
    
    while (true) {
      const { value } = await reader.read();
      if (!value) break;
      
      if (isFirstToken) {
        ttft.markFirstToken();
        isFirstToken = false;
      }
      
      tokenRate.recordToken();
      appendContent(value);
    }
  };
  
  return <Chat onSend={sendMessage} />;
};

// 上报到监控系统
function reportMetric(name, value) {
  // 发送到分析平台
  navigator.sendBeacon('/api/metrics', JSON.stringify({
    name,
    value,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    url: window.location.href
  }));
}

// Dashboard 展示
const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    ttft: { avg: 1200, p95: 2500 },
    tokenRate: { avg: 45, unit: 'tokens/s' },
    ttcr: { avg: 3500 },
    renderLatency: { avg: 16 },
    qoe: { score: 85 }
  });
  
  return (
    <div className="metrics-dashboard">
      <MetricCard title="首字时间" value={`${metrics.ttft.avg}ms`} />
      <MetricCard title="生成速率" value={`${metrics.tokenRate.avg} ${metrics.tokenRate.unit}`} />
      <MetricCard title="响应完整时间" value={`${metrics.ttcr.avg}ms`} />
      <MetricCard title="渲染延迟" value={`${metrics.renderLatency.avg}ms`} />
      <MetricCard title="用户体验分" value={metrics.qoe.score} />
    </div>
  );
};
```

### 10. AI 返回 React 组件的即时预览

```javascript
// 方案 1：Sandpack（CodeSandbox）
import { Sandpack } from "@codesandbox/sandpack-react";

const LivePreview = ({ code }) => {
  const files = {
    "/App.js": code,
    "/index.js": `
      import React from 'react';
      import ReactDOM from 'react-dom/client';
      import App from './App';
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
    `,
    "/public/index.html": `
      <!DOCTYPE html>
      <html>
        <body><div id="root"></div></body>
      </html>
    `
  };
  
  return (
    <Sandpack
      template="react"
      files={files}
      options={{
        showNavigator: true,
        showRefreshButton: true,
        closableTabs: false
      }}
      customSetup={{
        dependencies: {
          "react": "^18.0.0",
          "react-dom": "^18.0.0",
          "antd": "^5.0.0"
        }
      }}
    />
  );
};

// 方案 2：iframe 沙箱
const IframePreview = ({ code }) => {
  const [srcDoc, setSrcDoc] = useState('');
  
  useEffect(() => {
    const transpile = async () => {
      try {
        // 使用 Babel Standalone 转换 JSX
        const { transformFromAstAsync } = require('@babel/standalone');
        const result = await transformFromAstAsync(code, {
          presets: ['react', 'es2015']
        });
        
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                ${result.code}
              </script>
            </body>
          </html>
        `;
        
        setSrcDoc(html);
      } catch (error) {
        setSrcDoc(`<div class="error">${error.message}</div>`);
      }
    };
    
    transpile();
  }, [code]);
  
  return (
    <iframe
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin"
      style={{ width: '100%', height: '500px', border: 'none' }}
      title="Live Preview"
    />
  );
};

// 方案 3：Web Component 隔离
class PreviewElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  async connectedCallback() {
    const code = this.getAttribute('code');
    
    // 创建独立的 Shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        :host { all: initial; display: block; }
      </style>
      <div id="root"></div>
    `;
    
    // 在 Shadow DOM 中渲染 React 组件
    const container = this.shadowRoot.getElementById('root');
    
    // 动态加载 React
    const React = await import('https://esm.sh/react');
    const ReactDOM = await import('https://esm.sh/react-dom');
    
    // eval 执行代码（注意安全风险）
    const component = eval(`(${code})`);
    
    ReactDOM.render(React.createElement(component), container);
  }
}

customElements.define('live-preview', PreviewElement);

// 使用
// <live-preview code={aiGeneratedCode}></live-preview>

// 方案 4：Monaco Editor + 实时预览
import MonacoEditor from '@monaco-editor/react';

const EditorWithPreview = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState(null);
  
  const handleEditorChange = (value) => {
    setCode(value);
    setError(null);
  };
  
  return (
    <div className="editor-preview">
      <div className="editor-pane">
        <MonacoEditor
          height="400px"
          language="javascript"
          value={code}
          onChange={handleEditorChange}
          options={{ minimap: { enabled: false } }}
        />
      </div>
      
      <div className="preview-pane">
        {error ? (
          <div className="error-boundary">
            <h4>编译错误</h4>
            <pre>{error}</pre>
          </div>
        ) : (
          <LivePreview code={code} />
        )}
      </div>
    </div>
  );
};

// 安全注意事项：
// ⚠️ 永远不要信任 AI 生成的代码
// ✅ 使用 CSP 限制资源加载
// ✅ 禁用 eval，使用 Web Worker 隔离
// ✅ 限制网络访问（iframe sandbox）
// ✅ 超时保护（防止死循环）
```

### 11. Web Worker 在 AI 前端的应用

```javascript
// 场景 1：Markdown 解析（避免阻塞主线程）
// markdown.worker.js
self.addEventListener('message', async (e) => {
  const { type, content } = e.data;
  
  if (type === 'parse-markdown') {
    const marked = await import('marked');
    const html = marked.parse(content);
    self.postMessage({ type: 'parsed', html });
  }
});

// 主线程
class MarkdownWorker {
  constructor() {
    this.worker = new Worker('./markdown.worker.js');
    this.callbacks = new Map();
    this.idCounter = 0;
    
    this.worker.addEventListener('message', (e) => {
      const { id, type, html } = e.data;
      const callback = this.callbacks.get(id);
      if (callback) {
        callback(html);
        this.callbacks.delete(id);
      }
    });
  }
  
  parse(content) {
    return new Promise((resolve) => {
      const id = this.idCounter++;
      this.callbacks.set(id, resolve);
      this.worker.postMessage({ id, type: 'parse-markdown', content });
    });
  }
}

// 使用
const worker = new MarkdownWorker();
const html = await worker.parse(aiResponse);

// 场景 2：语法高亮
// highlight.worker.js
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

self.addEventListener('message', (e) => {
  const { code, language } = e.data;
  const highlighted = Prism.highlight(code, Prism.languages[language], language);
  self.postMessage({ highlighted });
});

// 主线程
const highlightCode = (code, lang) => {
  return new Promise((resolve) => {
    const worker = new Worker('./highlight.worker.js');
    worker.addEventListener('message', (e) => {
      resolve(e.data.highlighted);
      worker.terminate();
    });
    worker.postMessage({ code, language: lang });
  });
};

// 场景 3：大量数据处理（如向量搜索）
// vector-search.worker.js
import { cosineSimilarity } from './utils';

self.addEventListener('message', (e) => {
  const { queryVector, documents } = e.data;
  
  // 计算相似度（CPU 密集型）
  const results = documents.map(doc => ({
    ...doc,
    similarity: cosineSimilarity(queryVector, doc.vector)
  }));
  
  // 排序
  results.sort((a, b) => b.similarity - a.similarity);
  
  self.postMessage({ results });
});

// 使用
const searchResults = await new Promise(resolve => {
  const worker = new Worker('./vector-search.worker.js');
  worker.addEventListener('message', (e) => {
    resolve(e.data.results);
    worker.terminate();
  });
  worker.postMessage({ queryVector, documents });
});

// 场景 4：流式数据聚合
// stream-aggregator.worker.js
class StreamAggregator {
  constructor() {
    this.buffer = [];
    this.decoder = new TextDecoder();
  }
  
  process(chunk) {
    const text = this.decoder.decode(chunk, { stream: true });
    this.buffer.push(text);
    
    // 每 10 个 chunk 发送一次聚合结果
    if (this.buffer.length % 10 === 0) {
      self.postMessage({
        type: 'partial',
        content: this.buffer.join('')
      });
    }
  }
  
  finalize() {
    self.postMessage({
      type: 'complete',
      content: this.buffer.join('')
    });
  }
}

const aggregator = new StreamAggregator();

self.addEventListener('message', (e) => {
  const { type, data } = e.data;
  
  if (type === 'chunk') {
    aggregator.process(data);
  } else if (type === 'done') {
    aggregator.finalize();
  }
});

// 场景 5：AI 响应缓存
// cache.worker.js
const cache = new Map();

self.addEventListener('message', (e) => {
  const { type, key, value } = e.data;
  
  if (type === 'get') {
    self.postMessage({ key, value: cache.get(key) });
  } else if (type === 'set') {
    cache.set(key, value);
    self.postMessage({ success: true });
  } else if (type === 'clear') {
    cache.clear();
    self.postMessage({ success: true });
  }
});

// 主线程
const aiCache = {
  worker: new Worker('./cache.worker.js'),
  
  async get(key) {
    return new Promise(resolve => {
      this.worker.addEventListener('message', function handler(e) {
        if (e.data.key === key) {
          resolve(e.data.value);
          this.removeEventListener('message', handler);
        }
      });
      this.worker.postMessage({ type: 'get', key });
    });
  },
  
  async set(key, value) {
    return new Promise(resolve => {
      this.worker.addEventListener('message', () => {
        resolve();
      }, { once: true });
      this.worker.postMessage({ type: 'set', key, value });
    });
  }
};

// 使用
await aiCache.set('prompt-1', 'result-1');
const cached = await aiCache.get('prompt-1');
```

### 12. 复杂场景：完整的 AI 聊天界面实现

```typescript
// 完整架构设计
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status: 'pending' | 'streaming' | 'completed' | 'error';
  timestamp: number;
  editable?: boolean;
  regeneratedFrom?: string;
}

interface Conversation {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  metadata: {
    title?: string;
    tags?: string[];
  };
}

// 状态管理
const useChatSystem = () => {
  const [conversations, setConversations] = useState<Map<string, Conversation>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [streamControllers, setStreamControllers] = useState<Map<string, AbortController>>(new Map());
  
  // 1. 发送消息
  const sendMessage = async (content: string) => {
    const conversation = conversations.get(activeId);
    if (!conversation) return;
    
    const userMessage: Message = {
      id: uuid(),
      role: 'user',
      content,
      status: 'completed',
      timestamp: Date.now()
    };
    
    const aiMessage: Message = {
      id: uuid(),
      role: 'assistant',
      content: '',
      status: 'pending',
      timestamp: Date.now()
    };
    
    // 乐观更新
    updateConversation(activeId, [userMessage, aiMessage]);
    
    // 发起请求
    const controller = new AbortController();
    setStreamControllers(prev => new Map(prev).set(aiMessage.id, controller));
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: conversation.messages.concat(userMessage),
          stream: true
        }),
        signal: controller.signal
      });
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      updateMessageStatus(aiMessage.id, 'streaming');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        appendToMessage(aiMessage.id, chunk);
      }
      
      updateMessageStatus(aiMessage.id, 'completed');
    } catch (error) {
      if (error.name === 'AbortError') {
        updateMessageStatus(aiMessage.id, 'completed', true); // 标记为已中断
      } else {
        updateMessageStatus(aiMessage.id, 'error');
      }
    } finally {
      setStreamControllers(prev => {
        const next = new Map(prev);
        next.delete(aiMessage.id);
        return next;
      });
    }
  };
  
  // 2. 中断输出
  const stopGeneration = (messageId: string) => {
    const controller = streamControllers.get(messageId);
    if (controller) {
      controller.abort();
    }
  };
  
  // 3. 编辑历史消息
  const editMessage = (messageId: string, newContent: string) => {
    const conversation = conversations.get(activeId);
    if (!conversation) return;
    
    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    // 删除该消息之后的所有 AI 回复
    const updatedMessages = conversation.messages.slice(0, messageIndex + 1);
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
      editable: false
    };
    
    updateConversation(activeId, updatedMessages);
    
    // 重新生成 AI 回复
    sendMessage(newContent);
  };
  
  // 4. 重新生成
  const regenerate = (messageId: string) => {
    const conversation = conversations.get(activeId);
    if (!conversation) return;
    
    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    // 找到上一条用户消息
    let lastUserMessage: Message | null = null;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (conversation.messages[i].role === 'user') {
        lastUserMessage = conversation.messages[i];
        break;
      }
    }
    
    if (lastUserMessage) {
      // 删除当前的 AI 回复
      const updatedMessages = conversation.messages.filter(m => m.id !== messageId);
      updateConversation(activeId, updatedMessages);
      
      // 重新发送
      sendMessage(lastUserMessage.content);
    }
  };
  
  // 5. 创建新对话
  const createConversation = () => {
    const newConv: Conversation = {
      id: uuid(),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {}
    };
    
    setConversations(prev => new Map(prev).set(newConv.id, newConv));
    setActiveId(newConv.id);
    
    return newConv.id;
  };
  
  // 6. 切换对话
  const switchConversation = (id: string) => {
    setActiveId(id);
  };
  
  // 7. 删除对话
  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    
    if (activeId === id) {
      setActiveId(null);
    }发生异常，可以输入更多信息再让我来回答或重试
```