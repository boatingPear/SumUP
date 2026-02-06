# Drawio 插件

## 集成流程

### 安装依赖包

```bash
npm install drawio-embed
```

### 添加工具函数

在 src\frame\utils 目录下创建 `useDrawio.ts` 文件，复制以下代码到文件中

```ts
import { onDeactivated } from "vue";
import drawioEmbed from "drawio-embed";
import { ElMessage } from "element-plus";

let defaultOpenDrawio: any;
let isLoaded = false;
export default function useDrawio(
  url: string,
  updated: ({ png, svg }: { png: string; svg: string }) => void
) {
  const data = {
    png: "",
    svg: "",
  };
  const drawioImageCreatedEventHandler = (evt: any) => {
    const { imageContent, imageType } = evt;
    if (imageType === "png") {
      data.png = imageContent;
    }
    if (imageType === "svg") {
      data.svg = imageContent;
      updated(data);
    }
  };

  const drawioLoadedHandler = () => (isLoaded = true);

  if (!defaultOpenDrawio) {
    defaultOpenDrawio = drawioEmbed(url);
    // 监听返回的图片数据
  }

  window.addEventListener("drawioLoaded", drawioLoadedHandler);
  window.addEventListener("drawioImageCreated", drawioImageCreatedEventHandler);
  onDeactivated(() => {
    window.removeEventListener(
      "drawioImageCreated",
      drawioImageCreatedEventHandler
    );
    window.removeEventListener("drawioLoaded", drawioLoadedHandler);
  });
  function openDrawio(content?: string) {
    return new Promise((_, reject) => {
      try {
        defaultOpenDrawio(content).catch(() => {
          ElMessage.warning("编辑器还在初始化中，请稍后再打开...");
          reject("编辑器还在初始化中，请稍后再打开...");
        });
      } catch (error) {}
    });
  }

  openDrawio.isLoaded = () => defaultOpenDrawio.isLoaded() && isLoaded;
  openDrawio.isOpen = defaultOpenDrawio.isOpen;
  openDrawio.close = defaultOpenDrawio.close;
  return {
    openDrawio,
  };
}
```

### 添加静态资源

[下载](http://suitex.nomax.in/download/drawio/webapp.zip)静态资源文件，解压后放在 public 文件夹下

目录结构如下所示：

```
├─api_build							# 根据后端接口生成前端API接口脚本目录
├─dist								# 通过命令npm run build打包输出目录
├─node_modules						# 通过命令npm install安装依赖产生目录
├─public							# 存放静态资源目录
│   └─webapp						# drawio 静态资源
│      ├─connect
│      ├─images
│      ├─index.html
│      └─...(其他文件)
├─.env								# 环境配置参数
├─.env.development					# 开发环境配置参数
├─.env.production					# 打包环境配置参数
├─package.json						# npm 命令定义，依赖包管理
├─package-lock.json					# 依赖包版本锁定文件
├─tsconfig.json               		# TypeScript 配置文件，定义编译选项
├─vite.config.ts              		# Vite 配置文件，定义构建、开发服务器、插件等
└─uno.config.ts              		# Uno CSS 配置文件
```

### 富文本编辑器扩展

下面是个集成到 tinymce 富文本编辑器的 demo 示例步骤和效果预览

![上方demo代码效果预览](./drawio.assets/QQ2026116-17243.gif)

1. 在 src\frame\components\Editor\TinymceEditor 目录下创建 drawio-plugin.ts 插件声明文件

```ts
import tinymce from "tinymce/tinymce";
import useDrawio from "@/frame/utils/useDrawio";

let base =
  import.meta.env.SUITEX_BASE_PATH === "/"
    ? ""
    : import.meta.env.SUITEX_BASE_PATH || "";
tinymce.PluginManager.add("drawio", function (editor) {
  let currentTime: string | undefined;

  const { openDrawio } = useDrawio(
    `${base}/webapp/index.html?embed=1&dev=1&libraries=1`,
    (data) => {
      if (data.png && data.svg) {
        if (currentTime) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = tinymce.activeEditor?.getContent() ?? "";

          const img = tempDiv.querySelector(`img[data-time="${currentTime}"]`);
          img!.setAttribute("src", data.png);
          img!.setAttribute(
            "data-svg",
            btoa(unescape(encodeURIComponent(data.svg)))
          );

          editor.insertContent(img!.outerHTML);
        } else {
          const imgContent = `<img src="${
            data.png
          }" data-type="drawio-svg" data-time="${Date.now()}" data-svg="${btoa(
            unescape(encodeURIComponent(data.svg))
          )}" alt="流程图">`;
          editor.insertContent(imgContent);
          currentTime = undefined;
        }
      }
    }
  );

  editor.on("dblclick", function (e) {
    const node = editor.selection.getNode();
    if (node && node.tagName === "IMG" && node.dataset.svg) {
      openDrawio(decodeURIComponent(escape(atob(node.dataset.svg))));
      currentTime = node.dataset.time;
    }
  });

  editor.ui.registry.addIcon(
    "drawio",
    '<svg width="24" height="24" t="1764928533463" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29469" width="200" height="200"><path d="M810.528 640l-224.032-256H640V128h-256v256h53.504l-224.032 256H128v256h256v-256H298.496L512 396.032 725.504 640H640v256h256v-256z" fill="#2c2c2c" p-id="29470"></path></svg>'
  );
  editor.ui.registry.addToggleButton("drawio", {
    icon: "drawio",
    tooltip: "draw.io",
    onAction: function () {
      const node = editor.selection.getNode();
      if (node && node.tagName === "IMG" && node.dataset.svg) {
        openDrawio(decodeURIComponent(escape(atob(node.dataset.svg))));
        currentTime = node.dataset.time;
      } else {
        openDrawio();
        currentTime = undefined;
      }
    },
    onSetup(api) {
      const unbindSelectorChanged = editor.selection.selectorChangedWithUnbind(
        "img:not([data-mce-object]):not([data-mce-placeholder]),img[data-svg],figure.image,figure.image[data-svg]",
        api.setActive
      ).unbind;
      const unbindEditable = () => {
        const nodeChanged = () => {
          api.setEnabled(editor.selection.isEditable());
        };
        editor.on("NodeChange", nodeChanged);
        nodeChanged();
        return () => {
          editor.off("NodeChange", nodeChanged);
        };
      };
      return () => {
        unbindSelectorChanged();
        unbindEditable();
      };
    },
  });

  return {
    getMetadata: function () {
      return {
        name: "draw.io",
        author: "nomax",
        origin: "",
        url: "",
      };
    },
  };
});
```

2. 添加定义的 drawio-plugin.ts 插件引用

![image-20260116171240938](.\drawio.assets\image-20260116171240938.png)

3. 在使用时配置添加`plugins="| drawio" toolbar=" drawio"`即可

![image-20260116171909160](.\drawio.assets\image-20260116171909160.png)

## 自定义绘图面板

### 自定义左侧图形集合区域

![image-20260116144847799](.\drawio.assets\image-20260116144847799.png)

- public\webapp\js\diagramly\sidebar\Sidebar.js

  - **Sidebar.prototype.defaultEntries**的**general**项同时控制通用、杂项和高级三项
    ![image-20260116150207450](.\drawio.assets\image-20260116150207450.png)
  - **initPalettes**方法中 注释对应的方法可以隐藏或添加对应图形集合
    ![image-20260116151321212](.\drawio.assets\image-20260116151321212.png)

- public\webapp\js\grapheditor\Sidebar.js

  - 注释下方代码可以隐藏左侧图形集合区的更多图形按钮 ![image-20260116151743525](.\drawio.assets\image-20260116151743525.png)
    ![image-20260116151613275](.\drawio.assets\image-20260116151613275.png)

- public\webapp\js\diagramly\EditorUi.js

  - 隐藏全局的便笺本修改下面的方法，始终返回 false![image-20260116163503353](.\drawio.assets\image-20260116163503353.png)
    ![image-20260116163251552](.\drawio.assets\image-20260116163251552.png)

### 自定义顶部工具栏菜单项

![image-20260116152412177](.\drawio.assets\image-20260116152412177.png)

- public\webapp\js\grapheditor\Menus.js
  ![image-20260116152631334](.\drawio.assets\image-20260116152631334.png)

- 如果想要隐藏整个工具栏可以注释下方代码
  ![image-20260116152846646](.\drawio.assets\image-20260116152846646.png)

### 自定义图形集

![image-20260116154151796](.\drawio.assets\image-20260116154151796.png)

- 创建自定义图形的文件，文件名称格式为 Sidebar-自定义.js

  ![image-20260116154912275](.\drawio.assets\image-20260116154614631.png)

- 下方是文件的实例代码

```ts
(function () {
  Sidebar.prototype.addExamPalette = function () {
    var w = 100;
    var h = 100;
    this.setCurrentSearchEntryLibrary("exam");

    // 对 SVG 进行 URL 编码
    const getEncodeSvg = (svgString) => {
      return (
        "data:image/svg+xml," +
        encodeURIComponent(svgString)
          .replace(/'/g, "%27")
          .replace(/"/g, "%22")
          .replace(/</g, "%3C")
          .replace(/>/g, "%3E")
          .replace(/#/g, "%23")
      );
    };
    this.addPaletteFunctions("exam", mxResources.get("exam"), false, [
      this.createVertexTemplateEntry(
        "shape=image;image=" +
          getEncodeSvg(
            '<svg t="1764902290520" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2433" width="200" height="200"><path d="M663.258091 0.064624a35.19118 35.19118 0 0 1 15.932007 3.839038l1.535615 0.831791a39.286154 39.286154 0 0 1 4.606846 3.135214l0.575855 0.511872 1.599599 1.471631 233.605453 233.605453 0.703824 0.767808-1.407648-1.471632 1.919519 2.111471 0.767808 0.95976a45.236663 45.236663 0 0 1 2.047487 2.815294l0.831791 1.343663 0.831792 1.535615a34.679308 34.679308 0 0 1 3.839038 15.932007v709.582161a46.516342 46.516342 0 0 1-46.516342 46.516342H139.741297a46.516342 46.516342 0 0 1-46.516342-46.516342V46.580966a46.516342 46.516342 0 0 1 46.516342-46.516342zM581.806505 69.871129H163.03146v884.06643h698.001064V349.033164H628.386831a46.516342 46.516342 0 0 1-46.516342-46.516342z m-34.871261 604.904395a34.87126 34.87126 0 1 1 0 69.806505H360.805893a34.87126 34.87126 0 1 1 0-69.806505z m120.225869-209.419514a35.127196 35.127196 0 0 1 0 69.806505H356.902871a35.127196 35.127196 0 0 1 0-69.806505z m-15.548104-392.733571v206.60422h206.60422z" p-id="2434"></path></svg>'
          ) +
          ";aspect=fixed;",
        w,
        h,
        "",
        "自定义svg图标"
      ),
    ]);

    this.setCurrentSearchEntryLibrary();
  };
})();
```

- 创建完成后需要在上图中添加调用
  ![image-20260116155227413](.\drawio.assets\image-20260116155227413.png)

- 添加加载文件
  ![image-20260116155430445](.\drawio.assets\image-20260116155430445.png)

- 如果需要配置多语言可以在下方添加
  ![image-20260116155929460](.\drawio.assets\image-20260116155929460.png)

## useDrawio

### 参数: [url, updated]

- `url: string`
  - drawio 前端项目的静态地址，地址 webapp/index.html?embed=1&dev=1&libraries=1
  - embed=1；表示嵌入模式
  - dev=1；使用开发环境代码--如果修改的自定义代码才有效
  - libraries=1； 指定嵌入模式下是否启用库
  - 更多参数请查看官方文档 [drawio 嵌入模式](https://www.drawio.com/doc/faq/embed-mode)
  - drawio 前端项目的下载地址为：[webapp](https://github.com/jgraph/drawio/tree/dev/src/main/webapp)
  - 只使用 webapp 目录，放在 public 目录下
- `updated: (data: { png: string; svg: string }) => void`
  - 在绘制面板中，进行保存操作后，会调用当前回调函数
  - 函数的形参为保存时，绘制面板上绘制图形的整体图像数据，同时有 base64 的 png 图像数据和 svg 的矢量图数据(可以回显在绘图面板)

### 返回值: { openDrawio }

- `openDrawio: (content?: string) => void`

```js
openDrawio("<svg>...</svg>");
// 注：这里的 svg 图片须为通过本项目导出的 svg，而非任意 svg。
```

> 打开绘图面板的方法，形参为回显在绘图面板中的图形数据，svg 的矢量图字符串

- openDrawio 不止有调用栈，还有方法

  - `openDrawio.isLoaded()` 返回值为布尔值；判断编辑器是否加载成功
  - `openDrawio.isOpen()` 返回值为布尔值；判断绘制面板是否打开
  - `openDrawio.close()` 主动关闭绘制面板

### 示例

```ts
const { openDrawio } = useDrawio(
  `${base}/webapp/index.html?embed=1&dev=1&libraries=1`,
  (data) => {}
);
// url部分的参数解释
// embed=1:客户端将在嵌入模式下运行
// dev=1:使用开发模式的代码
// libraries=1:指定嵌入模式下是否启用库。默认为禁用（0）
```

更多更详细信息请查看官方文档：[drawio 文档](https://www.drawio.com/doc/faq/embed-mode)

### 尝试打开一个尚未加载好的编辑器

编辑器初始化需要一定的时间，如果过早的调用 `openDrawio()` 打开，可能实际无法打开，原因有：

1. 流程图的网络资源还在加载
2. 流程图的内部初始化尚未结束

### 关闭流程图编辑器

通常，用户在编辑时，如果点击了「保存」或者「取消」按钮，会自动关闭编辑器。当然我们也可以主动控制其关闭

```
openDrawio.close();
```

> 参考文档：
>
> 1. [drawio-embed](https://github.com/imaoda/drawio-embed)
>
> 如果需要对绘制面板自定义请参考下方文档：
>
> 1. [Drawio 二次开发与接入 Vue 项目](https://blog.csdn.net/m0_66509866/article/details/138150894)
