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

