# SQL

全称Structured Query Language，结构化查询语言。操作关系型数据库的编程语言，定义了一套操作关系型数据库统一标准。

## SQL通用语法

1. SQL语句可以单行或多行书写，以分号结尾。
2. SQL语句可以使用空格/缩进来增强语句的可读性。
3. MySQL数据库的SQL语句不区分大小写，关键字建议使用大写。
4. 注释
   - 单行注释：`-- 注释内容`或`# 注释内容（MySQL特有）`
   - 多行注释：`/* 注释内容 */`

## SQL分类

| 分类 | 全称                       | 说明                                                   |
| ---- | -------------------------- | ------------------------------------------------------ |
| DDL  | Data Denfinition Language  | 数据定义语言，用来定义数据库对象（数据库，表，字段）   |
| DML  | Data Manipulation Language | 数据操作语言，用来对数据库中的数据进行增删改           |
| DQL  | Data Query Language        | 数据查询语言，用来查询数据库中表的记录                 |
| DCL  | Data Control Language      | 数据控制语言，用来创建数据库用户、控制数据库的访问权限 |

## DDL

### 数据库操作

#### 查询

**查询所有数据库：**`SHOW DATABASE;`

**查询当前数据库：**`SELECT DATABASE();`

**创建：**`CREATE DATABASE [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET 字符集] [COLLATE 排序规则];`

> `[]`中的内容可以忽略，系统会按照默认进行操作。

**删除：**`DROP DATABSE [IF EXISTS] 数据库名;`

**使用：**`USE 数据库名;`

### 表操作

**查询当前数据库所有表：**`SHOW TABLES;`

**查询表结构：**`DESC 表名；`

**查询指定表的建表语句：**`SHOW CREATE TABLE 表名;`

**创建：**

```sql
CREATE TABLE 表名 (
	字段1 字段1类型 [COMMENT 字段1注释],
    字段1 字段1类型 [COMMENT 字段1注释],
)[COMMENT 表注释];
```

![[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-w17KKpN8-1660918799755)(数据库.assets/image-20220729125925877.png)]](https://i-blog.csdnimg.cn/blog_migrate/886fc78b9104f3f53f77811e223bcbbf.png)

**例：创建一张表tb_user，，对应的结构和建表语句如下：**

| id   | name     | age  | gender |
| ---- | -------- | ---- | ------ |
| 1    | 令狐冲   | 28   | 男     |
| 2    | 风清扬   | 68   | 男     |
| 3    | 东方不败 | 32   | 男     |



### 数据类型

MySQL中的数据类型主要分为三类：数值类型、字符串类型、日期时间类型。

#### 数值类型

| **类型**     | **大小** | **有符号(SIGNED)范围**                                | **无符号(UNSIGNED)范围**                                  | **描述**           |
| ------------ | -------- | ----------------------------------------------------- | --------------------------------------------------------- | ------------------ |
| TINYINT      | 1 byte   | (-128，127)                                           | (0，255)                                                  | 小整数值           |
| SMALLINT     | 2 bytes  | (-32768，32767)                                       | (0，65535)                                                | 大整数值           |
| MEDIUMINT    | 3 bytes  | (-8388608，8388607)                                   | (0，16777215)                                             | 大整数值           |
| INT或INTEGER | 4 bytes  | (-2147483648，2147483647)                             | (0，4294967295)                                           | 大整数值           |
| BIGINT       | 8 bytes  | (-263，263-1)                                         | (0，2^64-1)                                               | 极大整数值         |
| FLOAT        | 4 bytes  | (-3.402823466 E+38，3.402823466351 E+38)              | 0 和 (1.175494351 E-38，3.402823466 E+38)                 | 单精度浮点数值     |
| DOUBLE       | 8 bytes  | (-1.7976931348623157 E+308，1.7976931348623157 E+308) | 0 和 (2.2250738585072014 E-308，1.7976931348623157 E+308) | 双精度浮点数值     |
| DECIMAL      |          | 依赖于M(精度)和D(标度)的值                            | 依赖于M(精度)和D(标度)的值                                | 小数值(精确定点数) |

#### 字符串类型

| 类型       | 大小                  | 描述                         |
| ---------- | --------------------- | ---------------------------- |
| CHAR       | 0-255 bytes           | 定长字符串                   |
| VARCHAR    | 0-65535 bytes         | 变长字符串                   |
| TINYBLOB   | 0-255 bytes           | 不超过255个字符的二进制数据  |
| TINYTEXT   | 0-255 bytes           | 短文本字符串                 |
| BLOB       | 0-65 535 bytes        | 二进制形式的长文本数据       |
| TEXT       | 0-65 535 bytes        | 长文本数据                   |
| MEDIUMBLOB | 0-16 777 215 bytes    | 二进制形式的中等长度文本数据 |
| MEDIUMTEXT | 0-16 777 215 bytes    | 中等长度文本数据             |
| LONGBLOB   | 0-4 294 967 295 bytes | 二进制形式的极大文本数据     |
| LONGTEXT   | 0-4 294 967 295 bytes | 极大文本数据                 |

> **注意：** CHAR 比 VARCHAR 性能要好一些，但是具体还是要分场景。比如，接收用户的用户名就最好用 VARCHAR ，因为长度不固定；而记录用户的性别就用 CHAR ，因为长度是固定的。

#### 日期时间类型

| 类型      | 大小 | 范围                                       | 格式                | 描述                     |
| --------- | ---- | ------------------------------------------ | ------------------- | ------------------------ |
| DATE      | 3    | 1000-01-01 至 9999-12-31                   | YYYY-MM-DD          | 日期值                   |
| TIME      | 3    | 1000-01-01 至 9999-12-31                   | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1    | 1000-01-01 至 9999-12-31                   | YYYY                | 年份值                   |
| DATETIME  | 8    | 1000-01-01 00:00:00 至 9999-12-31 23:59:59 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4    | 1970-01-01 00:00:01 至 2038-01-19 03:14:07 | YYYY-MM-DD HH:MM:SS | 混合日期和时间值，时间戳 |

## 表操作

**表操作-案例**

![img](https://i-blog.csdnimg.cn/direct/27bb128ffa514fa2ae3df71789319b53.png)

```sql
create table worker (
	`id` int comment '编号',
    `job_num` varchar(10) comment '工号',
    `name` varchar(10) comment '姓名',
    `gender` char(1) comment '性别',
    `age` tinyint unsigned comment '年龄',
    `id_card` char(18) comment '身份证号',
    `entry_time` date comment '入职时间‑YYYY‑MM‑DD',
    primary key(`id`)
) comment = '员工表';
```

#### 表操作-修改

**添加字段**

```sql 
alter table 表名 add 字段名 类型 (长度) [ comment 注释 ] [ 约束 ];
```

案例：

为woker表增加一个新的字段，字段名为nickname-昵称，类型为varchar(20)

```sql
alter table worker add nickname varchar(20) comment '昵称';
```

**修改数据类型**

```sql
alter table 表名 modify 字段名 新数据类型(长度);
```

**修改字段名和字段类型**

```sql
alter table 表名 change 旧字段名 新字段名 类型(长度) [ comment 注释 ] [ 约束 ];
```

案例：

将worker表的nickname字段修改为username，类型为varchar(20);

```sql
alter table worker change nickname username varchar(20)comment '昵称';
```

**删除字段**

```sql
alter table worker drop 字段名;
```

案例：将worker表的字段username删除

```sql
alter table worker drop username;
```

**修改表名**

```sql 
alter table 表名 rename to 新表名;
```

案例：将worker表名改为employee

```sql
alter table worker rename to employee;
```

#### 表操作-删除

**删除表**

```sql
drop table [ iif exists ] 表名;
```

- 可选项if exists代表，只有该表存在时，才会触发删除表操作，表不存在，，则不执行删除操作(如果不加该参数项，三处一张不存在的表，执行将会报错)。

案例：如果tb_user表存在，则删除tb_user表

```sql
drop table if exists tb_user;
```

**销毁重新创建表-用来清空数据**

```sql
truncate table 表名;
```

## DML

### 添加数据

#### 添加数据

**给自定字段添加数据**

```sql
insert into 表名 (字段名1，字段名2，...) values (值1，值2，...);
```

案例：给employee表所有字段添加数据;

```sql
insert into employee (id, job_num, name, gender, age, id_card, entrytime) values (1, '1', 'iTCAST', '男', 10, '123456789012345678',, '2002-01-01');
```

**给全部字段添加数据**

```sql
insert into 表名 values (值1，值2,...);
```

案例插入数据到employee表

```sql
insert into employee values (2, '2 ', '张无忌 ', '男 ',18, '123456789012345670 ', '2005-01-	01 ');
```

**批量添加数据**

案例：批量插入数据到employee表，具体的SQL如下

```sql
insert into employee values (3, '3 ', '韦一笑', '男',38, '123456789012345670', '2005-01-
01'), (4, '4 ', '赵敏 ', '女',18, '123456789012345670', '2005-01-01');
```

> - 插入数据时，指定的字段顺序需要与值的顺序是一一对应的。
> - 字符串和日期型数据应该包含在引号中。
> - 插入的数据大小，应该在字段的规定范围内。

**修改数据**

```sql
update 表名 set 字段名1 = 值1, 字段名2 = 值2, ... [ where 条件 ];
```









**给指定字段添加数据：**`INSERT INTO 表名(字段1,字段2,...) VALUES (值,值2, ...);`

**给全部字段添加数据：**`INSERT INTO 表名 VALUES (值1,值2,...);`

**批量添加数据：**

- `INSERT INTO 表名(字段名1,字段名2,...) VALUES (值1,值2,...),(值1,值2,...);`
- `INSERT INTO 表名 VALUES (值1,值2,...),(值1,值2,...);`

::: warning

- 插入数据时，指定的字段孙旭需要与值的顺序一一对应的。
- 字符串和日期数据应该包含在引号中。
- 插入的数据大小，应该在字段的规定范围内。

:::

**修改数据：**`UPDATE 表名 SET 字段名1 = 值1，字段名2 = 值2,...[WHERE 条件];`

::: warning

修改语句的条件可以有，也可以没有，如果没有条件，则会修改整张表的所有数据。

:::
