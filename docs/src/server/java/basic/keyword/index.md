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

![img](../assets/67346d564628d15a6a0acf4c17753cb7.png)

> 若想让类中的某个成员变量被共享，可以将它变为static给修饰，这就是**static的内存中的执行流程**
>
> 方法入栈后会退出

### 静态方法不能访问非静态

![img](../assets/278bbbb9a8e1544b384bca7f102b939b.png)

> 1. 若name是非static修饰，则不会出现在堆内存中的静态存储位置，因此**静态方法不能访问非静态**
> 2. 现在堆内存中并没有任何实例过的对象，因此**静态方法不能调用实例变量**
> 3. main方法中读取到Student.teacherName方法的Student时，会把Student.class字节码文件加载到方法区

### 静态方法不能调用非静态成员方法

![img](../assets/244f8143404c34fc8a6cacf154975caf.png)

> - 假如method方法中可以调用show方法，那么在栈内存中，这个？？？.show方法又是谁来进行调用，正常来说应该是由一个对象来进行调用，因此**静态方法不能访问非静态**
> - 静态成员的生命周期与类的生命周期一样长，也就是说，当类被加载时，静态成员就被分配内存；当类被卸载时，静态成员所占用的内存也被释放。

### Static修饰成员变量和成员方法

![img](../assets/2c8a1694012ead7eedf8c27dcd7790bb.png)

### 工具类常用Static

帮助我们做一些事情的,但是不描述任何事物的类

1. 有同学没听懂，我这里解释一下，上节课说到静态变量先于类创建

2. 意思就是我先加载静态变量，再创建类，是按照这个步骤来的

3. 那么，如果这个类只有方法，也就是工具类，我没必要创建这个类

4. 因为我可以先于这个类直接调用方法，而只有静态方法可以优先被创建