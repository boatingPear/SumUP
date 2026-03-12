# 知识加油站

## 成员变量和局部变量

**成员变量和局部变量的区别**

- **类中位置不同**：
  - 成员变量：类中方法外
  - 局部变量：定义在方法内部或方法声明上--形参的形式
- **内存中位置不同**：
  - 成员变量：堆内存
  - 局部变量：栈内存
- **生命周期不同**：
  - 成员变量：随着对象的存在而存在，随着对象的消失而消失
  - 局部变量：随着方法的调用而存在，随着方法的调用完毕而消失
- **初始化不同**：
  - 成员变量：有默认初始化值
  - 局部变量：没有默认初始化值，必须先定义，赋值才能使用

## DateTimeFormatter和SimpleDateFormat的区别

`DateTimeFormatter`和`SimpleDateFormat`都是用于格式化和解析日期时间字符串的类，但它们有几个主要的区别：

1. **线程安全性**：`SimpleDateFormat`不是线程安全的，因此在多线程环境下使用它可以能会导致并发问题，而`DateTimeFormatter`是线程安全的，可以在多线程环境下安全使用。
2. **API设计**：`DateTimeForamtter`是在Java 8 中引入的，是新的API,而`SimpleDateFormat`则是在Java 1.1中引入的，是旧的API。`DateimeFormatter`设计更加清晰，易于使用，而且支持更多的格式化选项，比如使用解析器解析文本。而`SimpleDateFormat`使用的是预定义的格式化字符串，需要自己手动解析日期时间字符串。
3. **日期时间处理**：`DateTimeFormatter`支持`LocalDateTime`、`ZonedDateTime`和`OffsetDateTime`等Java 8新增的日期时间类，而`SimpleDateFormat`只支持`java.util.Date`和`java.util.Calendar`。
4. **性能**：`DateTimeFormatter`比`SimpleDateFormat`更快，因为它是基于解析器的，不需要进行解析字符串，也不需要进行格式检查。

因此，对于Java 8 及更高版本，建议使用`DateTimeFormatter`进行日期时间格式化和解析操作。而对于Java 7 及更低版本，只能使用`SimpleDateFormat`。如果必须在多线程环境下使用`SimpleDateFormat`，可以使用`ThreadLocal`来实现线程安全。

> - 线程安全，也就意味着是否要抛出异常
> - 通常来说，使用`DateTimeFormatter`时，将字符串转换为时间类型，需要指定时区偏移量

## Java键盘录入

### next和nextLine

这两种方法可以接受任意数据，但是都会返回一个字符串

> 比如：键盘录入abc，那么会把abc看做字符串返回。键盘录入123，那么会把123当做字符串返回

#### 基本用例

```java
Scanner sc = new Scanner(System.in);
String s = sc.next(); // 录入的所有数据都会看做是字符串
System.out.println(s);
```

```java
Scanner sc = new Scanner(System.in);
String s = sc.nextLine(); // 录入的所有数据都会看做是字符串
System.out.println(s);
```

### nextInt

只能接受整数

> 比如：键盘录入123，那么会把123当做int类型的整数返回、键盘录入小数或者其他字母，就会报错。

#### 基本用例

```java
Scanner sc = new Scanner(System.in);
int s = sc.nextInt(); // 只能录入整数
System.out,println(s)
```

### nextDouble

能接受整数和小数，但是都会看做小数返回

> 录入字符会报错

#### 基本用例

```java
Scanner sc = new Scanner(System.in);
double d = sc.nextDouble(); // 录入的整数，小数都会看做小数，录入字母会报错
System.out.println(d);
```

### 总结

next(),nextInt(),nextDouble()在接收数据的时候，会遇到空格、回车、制表符其中一个就会停止接收数据，并且报错

```java
Scanner sc = new Scanner(System.in);
double d = sc.nextDouble();
System.out.println(d);
// 键盘录入，输入1.3 2.4时只会输出1.3 在遇到空格时停止解析
```

```java
Scanner sc = new Scanner(System.in);
String s = sc.next();
System.out.println(s);
// 键盘录入，输入a b时，只会输出a，在遇到空格时停止解析
```

next(),nextInt(),nextDouble()在接收数据的时候，会遇到空格，回车，制表符其中一个就会停止接收数据。但是这些符号+后面的数据还在内存中没有接收。如果后面还有其他键盘录入的方法，会自动将这些数据接收。

```java
Scanner sc = new Scanner(System.in);
String s1 = sc.next();
String s2 = sc.next();
System.out.println(s1); 
System.out.println(s2);
// 输入'你 好'用空格隔开时是s1会接收你，空格后面的停止解析，但其实后面的好还在内存中，如果后面有sc.next的输入，那么不会在让你二次输入，好会直接被s2接收
```

nextLine()方法是把一整行全部接收完毕

```java
Scanner sc = new Scanner(System.in);
String s = sc.nextLine();
System.out.println(s);
// 在输入'你好 啊 李银河'时，空格不会中断解析，nextLine会将一整行的值全部接收
// 输出:你好 啊 李银河
```

混用引起的后果

```java
Scanner sc = new Scanner(System.in);
int i = sc.nextInt();
String s = sc.nextLine();
System.out.println(i);
System.out.println(s);
// 在输入1的时候，其实输入的是1和回车，只不过nextInt只能接收数字不能接收回车，但回车其实还会被保存在内存中，后面如果有next，那么就被下面的next接收了，所有输出的是1和回车，第二个不是空格时回车
```

> 当代码运行到第二行时，会让我们键盘录入，此时录入123,。但是实际上我们录入的是123+回车。而nextInt是遇到空格，回车，制表符都会停止。所以nextInt只能接收123，回车还在内存中没有被接收。此时就被nextLine接收了。所以，如果混用就会导致nextLine接收不到数据。

