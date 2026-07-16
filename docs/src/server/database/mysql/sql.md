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

案例：

```sql
// 修改id为1的数据，，将name修改为itheima
update employee set name = 'itheima' where id = 1;
// 修改id为1的数据将name修改为小昭，gender修改为女
update employee set name = '小昭', gender = '女' where id = 1;
// 将所有的员工入职日期修改为 2008-01-01
update employee set entrydate = '2008-01-01';
```

> 注：修改语句的条件可以有，也可以没有，如果没有条件，则会修改整张表的所有数据。

**删除数据**

```sql
delete from 表名 [ where 条件 ];
```

案例

```sql 
// 删除所有女性员工
delete from employee where gender = '女';
// 删除所有员工
delete from employee;
```

::: tip

- delete语句的条件可以有，也可以没有，如果没有条件，则会删除整张表的所有数据。
- delete语句不能删除某一个字段的值(可以使用update，将改字段值置为null)。
- 当进行删除全部数据操作时，datagriip会提示我们，询问是否确认删除，我们直接点击execute即可。

:::

## DQL

DQL英文全称是 Data Query Language数据查询语言，用来查询数据库中表的记录。

### 基本语法

```sql
select 字段列表
from 表名列表
where 条件列表
group by 分组字段列表
having 分组后条件列表
order by 排序字段列表
limit 分页参数 select 字段列表
```

### 基础查询

**查询多个字段**

```sql
select 字段1， 字段2， 字段3， ...from 表名;
select * from 表名;
select 字段1 [ 别名1 ]，字段2[ 别名2 ] ... from 表名;
```

::: tip

*号代表查询所有字段，在实际开发中尽量少用(不直观且影响效率)。

:::

**字段设置别名**

```sql
select 字段1 [ as 别名1 ]， 字段2 [ as 别名2 ] ... from 表名;
select 字段1 [ 别名1 ]，字段2 [ 别名2 ] ... from 表名;
```

**去除重复记录**

```sql
select distinct 字段列表 from 表名;
```

案例：

```sql 
// 查询自定字段name，workno，age并返回
select name,, workno, age from emp;

// 查询所有字段并返回
select id ,workno,name,gender,age,idcard,workaddress,entrydate from emp;
select * from emp; // 实际开发中不要用，，用上面的

// 查询所有员工的工作地址起别名
select workaddress as '工作地址' from emp;
select workaddress '工作地址' from emp;

// 查询公司员工的上班地址有哪些(不要重复的)
select distinct workaddress '工作地址' from emp;
```

### 条件查询

**语法**

```sql
select 字段列表 from 表名 where 条件列表;
```

**条件**

| 比较运算符      | 功能                                         |
| --------------- | -------------------------------------------- |
| >               | 大于                                         |
| \>=             | 大于等于                                     |
| <               | 小于                                         |
| <=              | 小于等于                                     |
| =               | 等于                                         |
| <> 或 !=        | 不等于                                       |
| betwee...and... | 在某个范围内(含最小值和最大值)               |
| in(...)         | 在in之后的列表中的值，多选一                 |
| link占位符      | 模糊平匹配(_匹配单个字符，，%匹配任意个字符) |
| is null         | 判断是否是null                               |

| 逻辑运算符 | 功能                        |
| ---------- | --------------------------- |
| AND 或 &&  | 并且 (多个条件同时成立)     |
| OR 或 \|\| | 或者 (多个条件任意一个成立) |
| NOT 或 !   | 非 , 不是                   |

案例

```sql
// 查询年龄等于88的员工
select * from emp where age = 88;

// 查询年纪小于20的员工
select * from emp where age < 20;

// 查询年纪小于等于20的员工信息
select * from emp where age <= 20;
```

### 聚合函数

**介绍**

其作用是将一列数据作为一个整体，进行纵向计算。

**常见的聚合函数**

| 函数  | 功能     |
| ----- | -------- |
| count | 统计数量 |
| max   | 最大值   |
| min   | 最小值   |
| avg   | 平均值   |
| sum   | 求和     |

**语法**

```sql
select 聚合函数(字段列表) from 表名;
// 注意：null值是不参与所有聚合函数运算的。
```

案例：

```sql
// 统计该企业员工数量 
select count(*) from emp; // 统计的是总记录数
select count (idcard)from emp; // 统计的是idcard字段不为null

// 统计该企业员工的平均年龄
select avg(age) from emp;

// 统计该企业员工的最大年龄
select max(age) from emp;

// 统计该企业员工的最小年龄
select min(age) from emp;

// 统计西安地区员工的年龄之和
select sum(age) from emp where workaddress = '西安';
```

### 分组查询

**语法**

```sql
select 字段列表 from 表名 [ where 条件] group by 分组字段名 [ having 分组后过滤条件 ];
```

**where与having区别**

- 执行时机不同：where是分组之前进行过滤，不满足where条件，不参与分组，而having是分组之后对结果进行过滤。

- 判断条件不同：where不能对聚合函数进行判断，而having可以。

::: tip

- 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义。
- 执行顺序：where>聚合函数>having。
- 支持多字段分组，具体语法为：group by columnA,columnB

:::

案例

```sql
// 根据性别分组，统计男性员工和女性员工的数量
select gender, count(gender) total from emp group by gender;
[{gender: "男",, total: 10}, {gender: "女",, total: 12}]

// 根据性别分组，统计男性员工和女性员工的平均年龄
select gender, avg(age) avg_age from emp group by gender;

// 查询年龄小于45的员工，并根据工作地址分组，获取员工数量大于等于3的工作地址
select workaddress, sum(*) total from emp where age < 45 group by workaddress having total >= 3;

// 统计各个工作地址上班的男性及女性员工的数量
select workaddress, gender, count(*) total from emp group by workaddress, gender; 
```

### 排序查询

- 排序在日常开发中是非常常见的一个操作，有升序排序，也有降序排序。

**语法**

```sql
select 字段列表 from 表名 order by 字段1 排序方式， 字段2 排序方式;
```

**排序方式**

- ASC:升序（默认值）
- DESC:降序

::: tip 

- 默认排序方式为升序，如果要求是升序，可以不指定排序方式ASC;
- 如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序；

:::

案例：

```sql
// 根据年龄对公司的员工进行升序排序
select * from emp order by age asc;
select * from emp order by age; // asc可以省略

// 根据入职时间，对员工进行降序排序
select * from emp order by entrydate desc;
// 根据年龄对公司的员工进行升序排序，年龄相同，再按照入职时间进行降序排序
select *  from emp  order by age asc, enrydate desc;
```

### 分页查询

- 分页操作在业务系统开发时，也是非常常见的一个功能，我们在网站中看到的各种各样的分页条，后台都需要借助于数据库的分页操作

**语法**

```sql
select 字段列表 from 表名 limit 起始索引，查询记录数;
```

> - 起始索引从0开始，起始索引=(查询页码-1)*每页显示记录数。
> - 分页查询是数据库的方言，不同的数据库有不同的实现，MySQL中是limit
> - 如果查询的是第一页数据，起始索引可以省略，直接简写limit 10

```sql
// 查询第一页员工数据，每页展示10条记录
select * from emp limit 0, 10;
select * from emp limit 10;
// 查询第二页员工数据，每页展示10条数据
select * from emp limit 10, 10;
```

### 综合案例

```sql
// 查询年龄为20,21,22,23的员工信息
select * from emp where age in(20,21,22,23);
select * from emp where age between 20 and 23; // between左右都是闭区间
// 查询性别为男，并且年龄在20-40岁(含)以内的姓名为三个字的员工; 
select * from emp where gender = '男' and (age between 20 and 40) and name link '---';
// 统计员工表中，年龄小于60岁的，男性员工和女性员工的人数
select gender, count(*) total from emp where age < 60 group by gender;
// 查询所有年龄小于等于35岁员工的姓名和年龄，并对查询结果按年龄升序排序，如果年龄相同按入职时间降序排序
select name, age from emp where age <= 35 order by age asc, entrydate desc;
// 查询性别为男，且年龄在20-40岁(含)以内的前5个员工信息，对查询的结果按年龄升序排序，年龄相同按入职时间升序排序
select * from emp where gender = '男' and (age between 20 and 40) order by age asc,entrydata desc limit 5;
```

### 执行顺序

![img](https://i-blog.csdnimg.cn/direct/86becc9c47b449bca067a339eeaab686.png)

```sql
// 执行顺序
// 查询年龄大于15的员工姓名、年龄，并根据年龄进行升序排序
select name, age from emp where age > 15 order by age asc;
// 给emp表起一个别名e，然后在select及where中使用该别名
select e.name, e.age from emp e where e.age > 15 order by age asc;
```

## DCL

- DCL英文全称是Data Control Language(数据控制语言)，引用来管理数据库用户、控制数据库的访问权限。

### 管理用户

**查询用户**

```sql
select * from mysql.user;
```

![img](https://i-blog.csdnimg.cn/direct/cd61940e227a43b39dd7709453b71262.png)

- Host代表当前用户访问的主机，如果为localhost，仅代表只能够在当前本机访问，是不可以远程访问的。
- User代表的是访问改数据库的用户名，在MySQL中需要通过Host和User来唯一标识一个用户。

****

**创建用户**

```sql
select user '用户名' @ '主机名' identified by '密码';
```

案例：

```sql
// 创建用户
create user 'itcast'@'loaclhost' identified by '1234';
```

使用新创建的用户itcast登录MySQL，查询数据库，发现其只能访问两个数据库，其他数据库没有权限

![img](https://i-blog.csdnimg.cn/direct/9a4049ace9494378acc26b8d0c837e21.png)

**修改用户密码**


























