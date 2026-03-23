# File 类

`java.io.File`类是文件和目录路径名的抽象表示，主要用于文件和目录的创建、查找和删除等操作

## 路径

![image-20230426155057941](../assets/2386b5667cf2e76dff3b2e9d41ccc6a0.png)

## 作用

Java中的`File`类是一个用于表示文件或目录的类。他可以用来**操作文件或目录**，如创建、读取、写入、删除等操作。

`File`类还是Java I/O库中的一部分，他提供了多种方法来获取有关文件和目录信息，例如文件名、路径、大小、修改时间等等。

`File`类还可以用于文件和目录的遍历，以及文件和目录的过滤。他是Java程序中常用的一个类之一

## 构造方法

| 方法名称                                   | 说明                                             |
| ------------------------------------------ | ------------------------------------------------ |
| `public File(String pathname)`             | 根据文件路径创建文件对象                         |
| `public File(String parent, String child)` | 根据父路径字符串和子路径字符串创建文件对象       |
| `public File(File parent, String child)`   | 根据父路径对应文件对象和子路径字符串创建文件对象 |

**示例：**

```java
// 都是根据不同信息，创建文件对象
// 文件路径名
String pathname = "D:\\aaa.txt";
File file1 = new File(pathname);

// 文件路径名
String pathname2 = "D:\\aaa\\bbb.txt";

// 通过父路径和子路径字符串
Sting parent = "d:\\aaa";
String child = "bbb.txt";
File file3 = new File(parent, child);

// 通过父级File对象和子路径字符串
File parentDir = new File("d:\\aaa");
String child = "bbb.txt";
File file4 = new File(parentDir, child);
```

> 1. 一个`File`对象代表硬盘中实际存在的一个文件或者目录。
> 2. 无论该路径下是否存在文件或者目录，都不影响`File`对象的创建。

## 常用成员方法

### 判断、获取

| 方法名称                          | 说明                               |
| --------------------------------- | ---------------------------------- |
| `public boolean isDirectory()`    | 判断此路径名表示的File是否是文件夹 |
| `public boolean isFile()`         | 判断此路径名表示的File是否为文件   |
| `public boolean exists()`         | 判断此路径名表示的File是否存在     |
| `public long length()`            | 返回文件的大小(字节数量)           |
| `public String getAbsolutePath()` | 返回文件的绝对路径                 |
| `public String getPath()`         | 返回定义文件时使用的路径           |
| `public String getName()`         | 返回文件的名称，带后缀             |
| `public long lastModified()`      | 返回文件的最后修改时间(时间毫秒值) |

#### isDirectory()、isFile()、exists()

```java

```

