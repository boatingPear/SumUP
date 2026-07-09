# MySQL 概述

## MySQL安装

[mysql官网社区版下载]: (https://dev.mysql.com/downloads/installer/)

## MySQL 启动

### 方法一

使用系统自带的功能，通过`win+r`输入`services.msc`就可以看到控制界面。

![](overview/image-20220729115649366.png)

![](overview/image-20220729120804822.png)

### 方式二

执行指令，以管理员的身份启动`cmd`，输入：

```bask
//停止
net stop mysql80
//启动
net start mysql80
```

![](overview/image-20220729120818491.png)

## 客户端连接

### 方法一

MySQL提供的客户端命令行工具。

![](overview/image-20220729121444067.png)

![](overview/image-20220729121533044.png)

### 方式二

系统自带的命令行工具执行指令。

```bash
mysql [-h 127.0.0.1][-P 3306] -u root -p
```

想要执行该命令，需要先配置环境变量，在系统高级设置中，找到环境配置，在`Path`下添加如下路径（路径在自己安装的目录下找）：

![](overview/image-20220729122115407.png)

![](overview/image-20220729122221770.png)

## MySQL数据库

MySQL数据库是关系型数据库

#### 关系型数据库

**概念：**建立在关系模型基础上，由多张互相连接的二维表组成的数据库。

**特点：**

1. 使用表存储数据，格式统一，便于维护
2. 使用SQL语言操作，标准统一，使用方便

> 非关系型数据库就是不用表存储数据的数据库。

![](overview/image-20220729122432254.png)

**数据模型**

![](overview/image-20220729122711775.png)
