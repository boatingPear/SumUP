# 面向对象

## 类

类的组成是由属性和行为两部分组成

- `属性`：在类中通过成员变量来体现（类中方法外的变量）
- `行为`：在类中通过成员方法来体现（和前面的方法相比去掉static关键字即可）

## 方法

方法（method）是程序中最小的执行单元

> - 方法必须先创建才可以使用，该过程称为方法定义
> - 方法创建后并不是直接可以运行的，需要**手动使用**后，才执行该过程称为方法调用

### 定义和调用

#### 无参数方法定义和调用

```java
/*格式：
	public static void 方法名 (   ) {
	// 方法体;
} */

public static void method (    ) {
    // 方法体;
}

// 调用
/*格式：
	方法名();	*/
method();
```

> 方法必须先定义，后调用，否则程序将报错

#### 带参数方法定义和调用

```java
/* 格式：
public static void 方法名 (参数1) {
	方法体;
}

public static void 方法名 (参数1, 参数2, 参数3...) {
	方法体;
}	*/

public static void isEvenNumber(int number){
    ...
}
public static void getMax(int num1, int num2){
    ...
}

// 调用

/* 格式：
方法名(参数)；

方法名(参数1,参数2);	*/
isEvenNumber(10);

getMax(10,20)
```

> 参数是由数据类型和变量名组成-格式：`数据类型 变量名`;例如：`int a`

::: warning

- 方法定义时，参数中的数据类型与变量名都不能缺少，缺少任意一个程序将报错
- 方法定义时，多个参数之间使用逗号(,)分割
- 方法调用时，参数的数量与类型必须与方法顶级中的设置像匹配，否则从程序将报错

:::

**`形参`**：方法中定义的参数：int a--等同定义参数

**`实参`**：方法调用中的参数 ：10, 20-- 等同使用参数

#### 带返回值方法的定义和调用

```java
/*格式：public static 数据类型 方法名 ( 参数 ) { 
	return 数据 ;
} */
public static boolean isEvenNumber( int number ) {           
	return true ;
}
public static int getMax( int a, int b ) {
	return  100 ;
}

// 调用

/* 方法名 ( 参数 ) ;
   数据类型 变量名 = 方法名 ( 参数 ) ; */
isEvenNumber( 5 );
boolean flag = isEvenNumber( 5 ); 
```

> - 方法定义时return后面的返回值与方法定义上的数据类型要匹配，否则程序将报错
> - 方法的返回值通常会随时用变量接收，否则该返回值将无意义

### 方法的注意事项

#### 方法不能嵌套定义

```java
public class MethodDemo {
    public static void main(String[] args) {

    }

    public static void methodOne() {
		public static void methodTwo() {
       		// 这里会引发编译错误!!!
    	}
    }
}
```

#### void表示无返回值

可以省略return，也可以单独的书写return，后面不加数据

```java
public class MethodDemo {
    public static void main(String[] args) {

    }
    public static void methodTwo() {
        //return 100; 编译错误，因为没有具体返回值类型
        return;
        //System.out.println(100); return语句后面不能跟数据或代码
    }
}
```

#### 方法的通用格式

```java
public static 返回值类型 方法名(参数) {
   方法体; 
   return 数据;
}
```

> - public static 修饰符，目前先记住和这个格式
> - 返回值类型
>   - 方法操作完毕之后返回的数据类型
>   - 如果方法操作完毕，没有数据返回，这里写void，而起方法体中一般不写return
> - `方法名`：调用方法时使用的标识
> - `参数`：由数据类型和变量名组成，，多个参数之间用逗号隔开
> - `方法体`：完成功能的代码块
> - `return`：如果方法操作完毕，有数据返回，用于把数据返回给调用者

- 定义方法时，要做到两个明确
  - 明确**返回值类型**：主要是明确方法操作完毕之后是否有数据返回，如果没有，写void；如果有，写对应的数据类型
  - 明确**参数**：主要是明确参数的类型和数量

- ​	调用方法时的注意：
  - void类型的方法，直接调用即可
  - 非void类型的方法，推荐用变量接收调用

### 方法重载

方法重载指同一个类中定义的多个方法之间的关系

瞒住下列条件的多个方法互相构成重载

- 多个方法在同一个类中
- 多个方法具有相同的方法名
- 多个方法的参数不相同，类型不同或数量不同

::: warning

- 重载仅对应方法的定义，与方法的调用无关，调用方法参照标准格式
- 重载仅针对同一个类中方法的名称与参数进行识别，与返回值无关，换句话说不能通过返回值来判定两个方法是否互相构成重载

:::

#### 基本用例

`正确范例`

```java
public class MethodDemo {
	public static void fn(int a) {
    	//方法体
    }
    public static int fn(double a) {
    	//方法体
    }
}

public class MethodDemo {
	public static float fn(int a) {
    	//方法体
    }
    public static int fn(int a , int b) {
    	//方法体
    }
}
```

`错误范例`

```java
public class MethodDemo {
	public static void fn(int a) {
    	//方法体
    }
    public static int fn(int a) { 	/*错误原因：重载与返回值无关*/
    	//方法体
    }
}

public class MethodDemo01 {
    public static void fn(int a) {
        //方法体
    }
} 
public class MethodDemo02 {
    public static int fn(double a) { /*错误原因：这是两个类的两个fn方法*/
        //方法体
    }
}
```

### 构造方法

构造方法是一种特殊的方法

- 作用：创建对象 Student stu = new Student();
- 功能：主要是完成对象数据的初始化

#### 基本用例

```java
/* 格式：
	public class 类名{
       修饰符 类名( 参数 ) {
        }
} */

class Student {
    private String name;
    private int age;

    //构造方法
    public Student() {
        System.out.println("无参构造方法");
    }

    public void show() {
        System.out.println(name + "," + age);
    }
}
/*
    测试类
 */
public class StudentDemo {
    public static void main(String[] args) {
        //创建对象
        Student s = new Student();
        s.show();
    }
}
```

#### 注意事项

- 构造方法的创建：
  - 如果没有定义构造方法，系统将给出一个**默认**的无参数构造方法
  - 如果定义了构造方法，系统将不再提供默认的构造方法
- 构造方法的重载
  - 如果自定义了带参数的构造方法，还要使用无参数构造方法，就必须再写一个无参数构造方法
- 推荐的使用方式
  - 无论时是否使用，都手工书写无参数构造方法
- **重要功能**
  - 可以使用带参数构造，为成员变量进行初始化

```java
/*
    学生类
 */
class Student {
    private String name;
    private int age;

    public Student() {}

    public Student(String name) {
        this.name = name;
    }

    public Student(int age) {
        this.age = age;
    }

    public Student(String name,int age) {
        this.name = name;
        this.age = age;
    }

    public void show() {
        System.out.println(name + "," + age);
    }
}
/*
    测试类
 */
public class StudentDemo {
    public static void main(String[] args) {
        //创建对象
        Student s1 = new Student();
        s1.show();

        //public Student(String name)
        Student s2 = new Student("林青霞");
        s2.show();

        //public Student(int age)
        Student s3 = new Student(30);
        s3.show();

        //public Student(String name,int age)
        Student s4 = new Student("林青霞",30);
        s4.show();
    }
}
```

#### 标准类制作

1. 类名需要**见名知义**
2. 成员变量使用`private`修饰
3. 提供至少两个构造方法
   - 无参数构造方法
   - 带全部参数的构造方法
4. get和set方法
   - 提供每一个成员变量的对应的`setXxx()`/`getXxx()`

## 对象

对象就是一种客观存在的事物，客观存在的事物皆为对象，所以我们也常常说万物皆为对象。

- 类
  - 类的理解
    - 类是对现实生活中一类具有**共同属性和行为**的事物的抽象
    - 类是对象的数据类型，类是具有**相同属性和行为**的一组对象的集合
  - 类的组成：**属性**、**行为**
- 类和对象的关系
  - 类：类是对现实生活中一类具有共同属性和行为的事物的抽象
  - 对象：是能够看得到摸得着的真是存在的实体

### 基本用例

```java
/*格式：
	创建对象
		类名 对象名 = new 类名();*/

/*格式：
   使用成员变量
      格式：对象名.变量名
   使用成员方法
      格式：对象名.方法名()
             */
public class PhoneDemo {
    public static void main(String[] args) {
        //创建对象
        Phone p = new Phone();

        //使用成员变量
        System.out.println(p.brand);
        System.out.println(p.price);

        p.brand = "小米";
        p.price = 2999;

        System.out.println(p.brand);
        System.out.println(p.price);

        //使用成员方法
        p.call();
        p.sendMessage();
    }
}
```

### 对象内存图（重点）

#### 单个对象内存图

`成员变量使用过程`

![image-20230813145155388](../../assets/f5f297dd24cc388f834ad9f2ae67bc95.png)

`成员方法调用过程`

![image-20230813145205253](../../assets/f99c4b5812c98c2b2a9d69f05ee5cd24.png)

#### 多个对象内存图

`成员变量使用过程`
![image-20230813145212598](../../assets/41ab854b22f0c1280d4745ecd6123d40.png)

`成员方法调用过程`

![image-20230813145218840](../../assets/0ffd6dfa69532240b74d00fd499f5fd4.png)

> 多个对象在堆内存中，都有不同的内存划分，成员变量存储在各自的内存区域中，**成员方法多个对象共用的一份堆内存空间**

## 封装

 在 Java 中，封装是面向对象编程中的一种重要的概念，它指的是将类的属性和方法保护起来，以避免外部程序直接访问和修改它们，从而提高了类的安全性和可维护性。封装的实现可以通过访问控制修饰符（public、private、protected）来实现。

```java
public class Person {
    private String name;
    private int age;
    private double height;

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

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }
}
```

> 将类的某些信息隐藏在类内部，不允许外部程序直接访问，而是通过该类提供的方法来实现对隐藏信息的操作和访问

## 继承

继承就是子类继承父类的**属性**和**行为**，使得子类对象可以直接具有与父类相同的属性、相同的行为。子类可以直接访问父类中的非私有的属性和行为。从而提高**代码的复用性**（减少代码冗余，相同代码重复利用）。使类与类之间产生了关系。

#### 子类不能继承的内容

> - 子类中不能继承构造方法，不能继承非虚方法表里的方法。
> - 虚方法表就算非`static`、`final`、`private`修饰的方法

![image-20230303195211274](../../assets/efd1d4038269dc1d4b78cce5c3e1b002.png)

> Java的继承，并不是一层一层往上寻找父方法，而是先判断虚方法表中有无此方法，方便直接调用

::: warning 

值得注意的是子类可以继承父类的私有成员（成员变量，方法），只是子类无法直接访问而已，可以通过getter/setter方法访问父类的private成员变量

:::

### 基本用例

通过`extends`关键字，可以声明一个子类继承另一个父类，定义格式如下：

```java
class 父类 {
	...
}

class 子类 extends 父类 {
	...
}
```

::: warning 

Java是单继承的，一个类只能继承一个直接父类

:::

### 继承后的特点——成员变量

#### 成员变量不重名

如果子类父类中出现不重名的成员变量，这时的访问是没有影响的。代码如下：

```java
class Fu {
	// Fu中的成员变量
	int num = 5;
}
class Zi extends Fu {
	// Zi中的成员变量
	int num2 = 6;
  
	// Zi中的成员方法
	public void show() {
		// 访问父类中的num
		System.out.println("Fu num="+num); // 继承而来，所以直接访问。
		// 访问子类中的num2
		System.out.println("Zi num2="+num2);
	}
}
class Demo04 {
	public static void main(String[] args) {
        // 创建子类对象
		Zi z = new Zi(); 
      	// 调用子类中的show方法
		z.show();  
	}
}

演示结果：
Fu num = 5
Zi num2 = 6
```

#### 成员变量重名

如果子类父类中出现重名的成员变量，这时的访问是有影响的。

```java
class Fu1 {
	// Fu中的成员变量。
	int num = 5;
}
class Zi1 extends Fu1 {
	// Zi中的成员变量
	int num = 6;
  
	public void show() {
		// 访问父类中的num
		System.out.print9ln("Fu num=" + num);
		// 访问子类中的num
		System.out.println("Zi num=" + num);
	}
}
class Demo04 {
	public static void main(String[] args) {
      	// 创建子类对象
		Zi1 z = new Zi1(); 
      	// 调用子类中的show方法
		z1.show(); 
	}
}
演示结果：
Fu num = 6
Zi num = 6
```

> - 子父类中出现了同名的成员变量时，子类会优先访问自己对象中的成员变量。如果此时想访问父类成员变量如何解决呢？我们可以使用super关键字。
>
> - ```java
>   class Fu {
>   	// Fu中的成员变量。
>   	int num = 5;
>   }
>   
>   class Zi extends Fu {
>   	// Zi中的成员变量
>   	int num = 6;
>   
>   	public void show() {
>           int num = 1;
>   
>           // 访问方法中的num
>           System.out.println("method num=" + num);  //method num=1
>           // 访问子类中的num
>           System.out.println("Zi num=" + this.num); // Zi num=6
>           // 访问父类中的num
>           System.out.println("Fu num=" + super.num); // Fu num=5
>   	}
>   }
>   
>   class Demo04 {
>   	public static void main(String[] args) {
>         	// 创建子类对象
>   		Zi1 z = new Zi1(); 
>         	// 调用子类中的show方法
>   		z1.show(); 
>   	}
>   }
>   ```
>
> - 需要注意的是：**super代表的是父类对象的引用，this代表的是当前对象的引用。**

### 继承后的特点——成员方法

#### 成员方法不重名

如果子类父类中出现**不重名**的成员方法，这时的调用是**没有影响的**。对象调用方法时，会先在子类中查找有没有对应的方法，若子类中存在就会执行子类中的方法，若子类中不存在就会执行父类中相应的方法。代码如下：

```java
class Fu {
	public void show() {
		System.out.println("Fu类中的show方法执行");
	}
}
class Zi extends Fu {
	public void show2() {
		System.out.println("Zi类中的show2方法执行");
	}
}
public  class Demo05 {
	public static void main(String[] args) {
		Zi z = new Zi();
     	//子类中没有show方法，但是可以找到父类方法去执行
		z.show(); 
		z.show2();
	}
}
```

#### 成员方法重名

如果子类父类中出现**重名**的成员方法，则创建子类对象调用该方法的时候，子类对象会**优先调用自己**的方法。代码如下：

```java
class Fu {
	public void show() {
		System.out.println("Fu show");
	}
}
class Zi extends Fu {
	//子类重写了父类的show方法
	public void show() {
		System.out.println("Zi show");
	}
}
public class ExtendsDemo05{
	public static void main(String[] args) {
		Zi z = new Zi();
     	// 子类中有show方法，只执行重写后的show方法
		z.show();  // Zi show
	}
}
```

### 方法重写

**方法重写** ：子类中出现与父类一模一样的方法时（返回值类型，方法名和参数列表都相同），会出现覆盖效果，也称为重写或者复写。**声明不变，重新实现**。

#### @Override重写注解

- @Override：注解，重写注解校验！
- 这个注解标记的方法，就说明这个方法必须是重写父类的方法，否则编译阶段报错。
- 建议重写都加上这个注解，一方面可以提高代码的可读性，一方面可以防止重写出错！

#### 注意事项

::: tip

1. 方法重写时发生在子父类之间的关系
2. 子类方法覆盖父类方法，必须要保证权限大于等于父类权限
3. 子类方法覆盖父类方法，返回值类型、函数名和参数列表都要一模一样

:::

### 继承后的特点——构造方法

> 子类构造方法的第一行都隐含了一个**super()**去调用父类无参数构造方法，**super()**可以省略不写。

### 继承的特点

1. java只支持单继承，不支持多继承
2. 一个类可以有多个子类
3. 可以多层继承

> 顶层父类是Object类。所有的类默认继承Object，作为父类。
