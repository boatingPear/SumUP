## java概述

> 1. 定义：Java是一种高级语言。它被设计为一种通用的、面向对象的编程语言，具有跨平台性和可移植性
> 2. 特点：简单易学、面向对象编程、平台无关性、安全性、高性能、多线程支持、开源免费
> 3. 跨平台原理：针对于不同的操作系统，Java提供了不同的虚拟机，对于不同的操作系统，安装不同的虚拟机
> 4. 三大版本：
>    JavaSE：SE即标准版，包含了Java核心类库，主要用来开发桌面应用
>    JavaME：ME即微型版，包含了SE中部分类库，又有自己扩展部分，主要用来做移动类嵌入式开发
>    JavaEE：EE即企业版，包含SE，又有扩展部分（Servlet，JDBC等），主要用来开发分布式网络程序
> 5. JRE、JVM、JDK：
>    JVM（Java Virtual Machine），Java虚拟机
>    JRE（Java Runtime Environment），Java运行环境，包含了JVM和Java的核心类库（Java API）
>    JDK（Java Development Kit）称为Java开发工具，包含了JRE和开发工具
> 6. 下载和安装
> 7. 目录介绍
> 8. 环境变量配置

### 定义

 Java是一种广泛使用的**计算机编程语言**，由Sun Microsystems（后来被Oracle收购）在1995年推出。它被设计为一种通用的、面向对象的编程语言，具有跨平台性和可移植性

补充:

> - 语言：人与人交流沟通的表达方式
> - 计算机语言：人与计算机之间进行信息交流沟通的**一种特殊语言**

### 特点

1. 简单易学：Java采用类似于C++的语法，但它去除了一些容易导致错误的复杂特性，使得它更加简单易学。
2. 面向对象编程：Java是一种完全面向对象编程语言，这意味着所有的程序元素都是对象，通过对象之间的交互实现程序的逻辑。
3. 跨平台性：Java程序在不同平台上可以运行，这是因为Java程序通过JVM（Java虚拟机）来运行，JVM能够在不同平台上执行相同的Java代码。
4. 安全性：Java是一种安全性较高的编程语言，因为它具有内置的安全机制，如内存管理、异常处理和访问控制。
5. 高性能：尽管Java是一种解释型语言，但它可以通过JIT（即时编译）技术提高性能。
6. 多线程支持：Java提供了内置的多线程支持，使得程序员可以很方便地编写多线程程序。
7. 开源免费：Java是一种开源免费的编程语言，可以通过许多渠道获得它的开发工具和运行环境。

##### **Java语言跨平台的原理**

- 操作系统本身其实是不认识Java语言的。
- 但是针对于不同的操作系统，Java提供了**不同的虚拟机**。

![image-20230227102000755](./assets/image.png#pic_center)

### 三大版本

JavaSE、JavaME、JavaEE

##### JavaSE标准版

JavaSE(Java Platform, Standard Edition)，Java语言]的（标准版)，用于**桌面应用的开发**，是其他两个版本的基础。

##### JavaME微型版

JavaME(Java Platform, Micro Edition)，Java语言的小型版，用于嵌入式消费类电子设备或者小型移动设备的开发。（嵌入式，电视机，微波炉，电视机等），其中最为主要的还是小型移动设备的开发（手机）。渐渐的没落了，已经被安卓和IOS给替代了。但是，安卓也是可以用Java来开发的。

#### JavaEE企业版

JavaEE（Java Platform, Enterprise Edition）用于**Web方向**的网站开发。（主要从事**后台**服务器的开发）在服务器领域，Java是当之无愧的龙头老大。

![在这里插入图片描述](./assets/857826861298487572cc7ed58e09d4cc.png#pic_center)

### JDK安装

##### 概述

**JVM**（Java Virtual Machine），Java虚拟机
**JRE**（Java Runtime Environment），Java运行环境，包含了JVM和Java的核心类库（Java API）
**JDK**（Java Development Kit）称为Java开发工具，包含了JRE和开发工具

![在这里插入图片描述](./assets/73c76b7e53f2d8d7e37037ffcaf2a671.png#pic_center)

说明:

> 当我们开发时，我们**只需安装JDK**即可，它包含了java的运行环境和虚拟机。当我们只运行时只需要**装JRE**即可

##### 基本用例

说明：

> 通过官方网站获取JDK，网址：[Java Downloads | Oracle 中国](https://www.oracle.com/cn/java/technologies/downloads/)

注意：

> - 安装路径不要有中文，不要有空格等一些特殊的符号。
> - 以后跟开发相关的所有软件建议都安装在同一个文件夹中，方便管理。

步骤一：下载JDK

![在这里插入图片描述](./assets/8dfa2482df9d7226505056c494925edc.png#pic_center)


补充：安装目录

> ![在这里插入图片描述](./assets/b8043a4b47173beb2d4c48a52fdc254f.png#pic_center)
>
> 以上是JDK17的安装目录，以下是JDK的目录解释
>
> | 目录名称 | **说明**                                                     |
> | -------- | ------------------------------------------------------------ |
> | bin      | 该路径下存放了JDK的**各种工具**命令。javac和java就放在这个目录。 |
> | conf     | 该路径下存放了JDK的相关**配置**文件。                        |
> | include  | 该路径下存放了一些平台特定的**头文件**。                     |
> | jmods    | 该路径下存放了JDK的**各种模块**。                            |
> | legal    | 该路径下存放了JDK各模块的**授权文档**。                      |
> | lib      | 该路径下存放了JDK工具的一些补充**JAR包**。                   |


步骤二：环境变量配置

说明：

> 开发Java程序，需要使用JDK提供的开发工具（比如javac.exe、java.exe等命令），而这些工具在JDK的安装目录的bin目录下，如果不配置环境变量，那么这些命令只可以在bin目录下使用，而我们想要在任意目录下都能使用，所以就要配置环境变量

1.配置JAVA_HOME环境

![image-20230809140945961](./assets/34fb05e4591f07b76b4ec27460fd840d.png#pic_center)

2.配置`PATH`环境

![在这里插入图片描述](./assets/f0343202df73f932671377f7d3bd1014.png#pic_center)

补充：

> **JAVA_HOME**：告诉操作系统JDK安装在了哪个位置（未来其他技术要通过这个找JDK）
> **Path**：告诉操作系统JDK提供的javac(编译)、java(执行)命令安装到了哪个位置

步骤三：演示

![image-20230809141449697](./assets/03513093521714fa114e9240ad9d85c2.png)

新建cmd命名窗口，输入java --version


说明：

> 此处可以看到JDK的版本为17

