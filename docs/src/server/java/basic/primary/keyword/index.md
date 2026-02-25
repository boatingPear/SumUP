# 关键字

## this关键字

在 Java 中，this 是一个关键字，**表示当前对象**。它可以用于访问当前对象的属性和方法。

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name; //使用this关键字引用当前对象的成员变量name
        this.age = age; //使用this关键字引用当前对象的成员变量age
    }
}
```

## static关键字

static是一个关键字，用于修饰类的成员变量、成员方法和代码块，其作用是将这些成员变量、成员方法和代码块与类本身关联，而不是与类的实例对象关联

### 静态变量及其访问

有static修饰成员变量，说明这个成员变量是属于类的，这个成员变量称为**类变量**或者**静态成员变量**。 直接用 类名访问即可。因为类只有一个，所以静态成员变量在内存区域中也只存在一份。所有的对象都可以共享这个变量。

#### 基本用例-static关键字使用

```java
/* 格式：
	修饰符 static 数据类型 变量名 = 初始值；*/    
public class Student {
    public static String schoolName = "传智播客"； // 类变量或者静态成员变量
    // .....
}
```

#### 访问

```java
/*格式：
	类名.静态变量	*/
public static void  main(String[] args){
    System.out.println(Student.schoolName); // 传智播客
    Student.schoolName = "黑马程序员";
    System.out.println(Student.schoolName); // 黑马程序员
}
```

### 实例变量及其访问

无static修饰的成员变量属于每个对象的， 这个成员变量叫**实例变量**，之前我们写成员变量就是实例成员变量。

#### 基本用例-实例变量使用

```java
public class Student {
    public  String schoolName = "传智播客"； // 成员变量
    // .....
}
```

#### 访问

```java
/* 格式：
	对象.实例成员变量 */
public static void main(String[] args) {
    Student stu = new Student();
    System.out.println(stu.schoolName);
}
```

> 实例成员变量属于每个对象，必须**创建类的对象**才可以访问。

### 静态方法及其访问

有static修饰成员方法，说明这个成员方法是属于类的，这个成员方法称为**类方法或者**静态方法。 直接用 类名访问即可。因为类只有一个，所以静态方法在内存区域中也只存在一份。所有的对象都可以共享这个方法。

与静态成员变量一样，静态方法也是直接通过**类名.方法名称**即可访问。

#### 基本用例

```java
public class Student{
    public static String schoolName = "传智播客"； 
    // .....
    public static void study(){ // 类方法或者静态方法。
        System.out.println("我们都在黑马程序员学习");   
    }
}
```

#### 访问

```java
/* 格式：
	类名.静态方法*/
public static void  main(String[] args){
    Student.study();
}
```

### 实例方法及其访问

无static修饰的成员方法属于每个对象的，这个成员方法也叫做**实例方法**。

> 实例方法是属于每个对象，必须创建类的对象才可以访问

#### 基本用例-实例方法使用

```java
/*格式：
	对象.实例方法*/
public class Student {
    // 实例变量
    private String name ;
    // 2.方法：行为
    // 无 static修饰，实例方法。属于每个对象，必须创建对象调用
    public void run(){
        System.out.println("学生可以跑步");
    }
	// 无 static修饰，实例方法
    public  void sleep(){
        System.out.println("学生睡觉");
    }
    public static void study(){
        
    }
}
```

#### 访问

```java
public static void main(String[] args){
    // 创建对象 
    Student stu = new Student ;
    stu.name = "徐干";
    // Student.sleep();// 报错，必须用对象访问。
    stu.sleep();
    stu.run();
}
```

### Static内存图（重点）

`静态方法`

![img](../../assets/67346d564628d15a6a0acf4c17753cb7.png)

> 若想让类中的某个成员变量被共享，可以将它变为static给修饰，这就是**static的内存中的执行流程**
>
> 方法入栈后会退出

### 静态方法不能访问非静态

![img](../../assets/278bbbb9a8e1544b384bca7f102b939b.png)

> 1. 若name是非static修饰，则不会出现在堆内存中的静态存储位置，因此**静态方法不能访问非静态**
> 2. 现在堆内存中并没有任何实例过的对象，因此**静态方法不能调用实例变量**
> 3. main方法中读取到Student.teacherName方法的Student时，会把Student.class字节码文件加载到方法区

### 静态方法不能调用非静态成员方法

![img](../../assets/244f8143404c34fc8a6cacf154975caf.png)

> - 假如method方法中可以调用show方法，那么在栈内存中，这个？？？.show方法又是谁来进行调用，正常来说应该是由一个对象来进行调用，因此**静态方法不能访问非静态**
> - 静态成员的生命周期与类的生命周期一样长，也就是说，当类被加载时，静态成员就被分配内存；当类被卸载时，静态成员所占用的内存也被释放。

### Static修饰成员变量和成员方法

![img](../../assets/2c8a1694012ead7eedf8c27dcd7790bb.png)

### 工具类常用Static

帮助我们做一些事情的,但是不描述任何事物的类

1. 有同学没听懂，我这里解释一下，上节课说到静态变量先于类创建

2. 意思就是我先加载静态变量，再创建类，是按照这个步骤来的

3. 那么，如果这个类只有方法，也就是工具类，我没必要创建这个类

4. 因为我可以先于这个类直接调用方法，而只有静态方法可以优先被创建

## final关键字

`final` 是一个关键字，它可以用来修饰变量、方法和类，表示不可改变的、终态的。

### 修饰变量

- `final` 修饰的变量表示常量，一旦被赋值后，就**不能再被改变**。
- `final` 声明的变量必须在声明时或者在构造器中初始化，否则编译器会报错。
- 声明 `final` 变量时，一般使用全大写字母和下划线来表示。

### 修饰方法

- `final` 修饰的方法表示该方法不**能被子类重写或覆盖**。
- 当一个类被声明为 `final` 时，其中所有的方法都会自动地成为 `final`，但是实例变量不会受到影响。

### 修饰类

- `final` 修饰的类表示该类**不能被继承**。
- 使用 `final` 修饰类可以保证该类的行为不会被改变，也可以提高代码的安全性和可靠性。

## private关键字

被private修饰的成员，只能在本类进行访问，针对private修饰的成员变量，如果需要被其他类使用，提供相应的操作

> - 提供“get变量名()”方法，用于获取成员变量的值，方法用public修饰
> - 提供“set变量名(参数)”方法，用于设置成员变量的值，方法用public修饰

### 基本用例-private关键字使用

```java
/*
    学生类
 */
class Student {
    //成员变量
    String name;
    private int age;

    //提供get/set方法
    public void setAge(int a) {
        if(a<0 || a>120) {
            System.out.println("你给的年龄有误");
        } else {
            age = a;
        }
    }

    public int getAge() {
        return age;
    }

    //成员方法
    public void show() {
        System.out.println(name + "," + age);
    }
}
/*
    学生测试类
 */
public class StudentDemo {
    public static void main(String[] args) {
        //创建对象
        Student s = new Student();
        //给成员变量赋值
        s.name = "林青霞";
        s.setAge(30);
        //调用show方法
        s.	show();
    }
}
```

### 案例-private的使用

需求：定义标准的学生类，要求name和age使用private修饰，并提供set和get方法以及便于显示数据的show方法，测试类中创建对象并使用，最终控制台输出 林青霞，30

```java
/*
    学生类
 */
class Student {
    //成员变量
    private String name;
    private int age;

    //get/set方法
    public void setName(String n) {
        name = n;
    }

    public String getName() {
        return name;
    }

    public void setAge(int a) {
        age = a;
    }

    public int getAge() {
        return age;
    }

    public void show() {
        System.out.println(name + "," + age);
    }
}
/*
    学生测试类
 */
public class StudentDemo {
    public static void main(String[] args) {
        //创建对象
        Student s = new Student();

        //使用set方法给成员变量赋值
        s.setName("林青霞");
        s.setAge(30);

        s.show();
        //使用get方法获取成员变量的值
        System.out.println(s.getName() + "---" + s.getAge());
        System.out.println(s.getName() + "," + s.getAge());
    }
}
```

## this关键字

### **this关键字内存原理（重点）**

![image-20230228093820021](../../assets/a8343914eb4afcb722118edc7da565a4.png)

![img](../../assets/d5b250c57c1633c8e0e94088f95c75b5.png)

> 方法执行完成后会出栈
>
> 总结一句话：**this的本质就是所在方法调用者的地址值**

this修饰的变量用于指代成员变量，其主要作用是（区分局部变量和成员变量的重名问题）

- 方法的形参如果与成员变量同名，不带this修饰的变量指的是形参，带this修饰的变量是成员变量
- 方法的形参没有与成员变量同名，不带this修饰的变量指的是成员变量

## super关键字

在Java中super关键字，表示父类对象的引用，可以用来调用父类的构造方法、实例方法和实例变量

```java
class Person {
    private String name;
    private int age;

    public Person() {
        System.out.println("父类无参");
    }

    // getter/setter省略
}

class Student extends Person {
    private double score;

    public Student() {
        //super(); // 调用父类无参构造方法,默认就存在，可以不写，必须再第一行
        System.out.println("子类无参");
    }
    
     public Student(double score) {
        //super();  // 调用父类无参构造方法,默认就存在，可以不写，必须再第一行
        this.score = score;    
        System.out.println("子类有参");
     }
      // getter/setter省略
}

public class Demo07 {
    public static void main(String[] args) {
        // 调用子类有参数构造方法
        Student s2 = new Student(99.9);
        System.out.println(s2.getScore()); // 99.9
        System.out.println(s2.getName()); // 输出 null
        System.out.println(s2.getAge()); // 输出 0
    }
}
```

> 我们发现，**子类有参数构造方法只是初始化了自己对象中的成员变量**score，而父类中的成员变量name和age依然是没有数据的，怎么解决这个问题呢，我们可以**借助与super(…)去调用父类构造方法，以便初始化继承自父类对象的name和age**

### 基本用例-super关键字使用

```java
/* 格式：
    super.成员变量    	--    父类的
    super.成员方法名()   --    父类的 */
class Person {
    private String name ="凤姐";
    private int age = 20;

    public Person() {
        System.out.println("父类无参");
    }
    
    public Person(String name , int age){
        this.name = name ;
        this.age = age ;
    }

    // getter/setter省略
}

class Student extends Person {
    private double score = 100;

    public Student() {
        //super(); // 调用父类无参构造方法,默认就存在，可以不写，必须再第一行
        System.out.println("子类无参");
    }
    
     public Student(String name ， int age，double score) {
        super(name ,age);// 调用父类有参构造方法Person(String name , int age)初始化name和age
        this.score = score;    
        System.out.println("子类有参");
     }
      // getter/setter省略
}

public class Demo07 {
    public static void main(String[] args) {
        // 调用子类有参数构造方法
        Student s2 = new Student("张三"，20，99);
        System.out.println(s2.getScore()); // 99
        System.out.println(s2.getName()); // 输出 张三
        System.out.println(s2.getAge()); // 输出 20
    }
}
```

> - 子类的每个构造方法中均有默认的super()，调用父类的空参构造。手动调用父类构造会覆盖默认的super()。
> - super() 和 this() 都必须是在构造方法的第一行，所以**不能同时出现**。
> - super(…)是根据参数去确定调用父类哪个构造方法的。

### 内存图

**父类空间优先于子类对象产生**

在每次创建子类对象时，先初始化父类空间，再创建其子类对象本身。目的在于子类对象中包含了其对应的父类空间，便可以包含其父类的成员，如果父类成员非private修饰，则子类可以随意使用父类成员。代码体现在子类的构造器调用时，一定先调用父类的构造方法。理解图解如下：

![image-20230813112250239](../../assets/037a33312dc82c7a8574566ec6b7078e.png)

### this( )基本用例

- 默认是去找本类中的其他构造方法，**根据参数来确定**具体调用哪一个构造方法。
- 为了借用其他构造方法的功能。

```java
/* 格式：
	this.成员变量    	--    本类的
	this.成员方法名()  	--    本类的    */
package com.itheima._08this和super调用构造方法;
/**
 * this(...):
 *    默认是去找本类中的其他构造方法，根据参数来确定具体调用哪一个构造方法。
 *    为了借用其他构造方法的功能。
 */
public class ThisDemo01 {
    public static void main(String[] args) {
        Student xuGan = new Student();
        System.out.println(xuGan.getName()); // 输出:徐干
        System.out.println(xuGan.getAge());// 输出:21
        System.out.println(xuGan.getSex());// 输出： 男
    }
}

class Student{
    private String name ;
    private int age ;
    private char sex ;

    public Student() {
  // 很弱，我的兄弟很牛逼啊，我可以调用其他构造方法：Student(String name, int age, char sex)
        this("徐干",21,'男');
    }

    public Student(String name, int age, char sex) {
        this.name = name ;
        this.age = age   ;
        this.sex = sex   ;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public char getSex() {
        return sex;
    }

    public void setSex(char sex) {
        this.sex = sex;
    }
}
```



