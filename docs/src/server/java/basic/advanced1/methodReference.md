# 方法引用

### 定义

在Java中，方法引用是一种特殊的Lambda表达式，他是用来简化Lambda表达式的写法，特别是当Lambda表达式中只调用了一个已经存在的方法时。

### 规则

- 引用处必须是函数式接口
- 被引用的方法必须已经存在
- 被引用方法的形参和返回值需要跟抽象方法保持一致
- 被引用方法的功能要满足当前的需求

### 方法引用符

`::`该符号为引用运算符，而他所在的表达式被称为方法引用

```java
class JavaMainApplicationTests {
    public static int subtraction(int num1, int num2) {
        return num2 - num1;
    }

    @Test
    void contextLoads() {
        //需求：创建一个数组，进行倒序排列
        Integer[] arr = {3, 5, 4, 1, 6, 2};
        //方式一：匿名内部类

        /* Arrays.sort(arr, new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o2 - o1;
            }
        });*/


        //方式二：lambda表达式
        //因为第二个参数的类型Comparator是一个函数式接口
        /* Arrays.sort(arr, (Integer o1, Integer o2)->{
            return o2 - o1;
        });*/

        //方式三：lambda表达式简化格式
        //Arrays.sort(arr, (o1, o2)->o2 - o1 );


        //方式四：方法引用
        //1.引用处需要是函数式接口
        //2.被引用的方法需要已经存在
        //3.被引用方法的形参和返回值需要跟抽象方法的形参和返回值保持一致
        //4.被引用方法的功能需要满足当前的要求

        //表示引用FunctionDemo1类里面的subtraction方法
        //把这个方法当做抽象方法的方法体
        Arrays.sort(arr, JavaMainApplicationTests::subtraction);
        
        System.out.println(Arrays.toString(arr));
    }
}
```

### 分类

1. 引用静态方法
2. 引用成员方法
3. 引用构造方法
4. 类名引用成员方法
5. 引用数组的构造方法

## 作用

他是将方法作为一个对象来使用，而不是想Lambda表达式那样直接定义一个匿名方法。

方法引用可以使代码更加简洁易懂，提高代码的可读性和可维护性。另外，方法引用还可以用于提高代码的性能，因为他避免了Lambda表达式中的不必要的重复调用。

![image-20230812092547466](../assets/200824d871ced0734129e1c37cb73e12.png)

> 此处展示方法引用的作用区别

## 引用静态方法

**格式：**`类::方法名`

**示例**

```java
//1.创建集合并添加元素
ArrayList<String> list = new ArrayList<>();
Collections.addAll(list,"1","2","3","4","5");

//2.把他们都变成int类型
/* list.stream().map(new Function<String, Integer>() {
            @Override
            public Integer apply(String s) {
                int i = Integer.parseInt(s);
                return i;
            }
        }).forEach(s -> System.out.println(s));*/



//1.方法需要已经存在
//2.方法的形参和返回值需要跟抽象方法的形参和返回值保持一致
//3.方法的功能需要把形参的字符串转换成整数

list.stream()
    .map(Integer::parseInt)
    .forEach(s-> System.out.println(s));
```

> 当需要的方法已经存在时，可以根据`类名::方法名`，进行调用

## 引用成员方法

**格式**

```java
对象::成员方法
1. 其他类：
    对象::方法名
2. 本类:
	this::方法名
3. 父类:
	super::方法名
```

**示例(其他类)**

```java
class stringOpration {
public boolean stringJudge(String s){
        return s.startsWith("张") && s.length() == 3;
    }
}
```

```java
/* 格式：
	其他类:其他类对象::方法名*/
public static void main(String[] args) {
    //1.创建集合
    ArrayList<String> list = new ArrayList<>();
    //2.添加数据
    Collections.addAll(list,"张无忌","周芷若","赵敏","张强","张三丰");
    //3.其他类：
    list.stream().filter(new stringOpration()::stringJudge)
        .forEach(s-> System.out.println(s));
}
```

> 通过调用其他类实例对象的方法名进行调用

**示例(本类)**

```java
/* 格式：
	本类:this ::方法名*/
public class FunctionDemo3  {
    public static void main(String[] args) {
        //1.创建集合
        ArrayList<String> list = new ArrayList<>();
        //2.添加数据
        Collections.addAll(list,"张无忌","周芷若","赵敏","张强","张三丰");
        //3.本类，静态方法中是没有this的
        list.stream().filter(new FunctionDemo3()::stringJudge)
                .forEach(s-> System.out.println(s));
    }

    public boolean stringJudge(String s){
        return s.startsWith("张") && s.length() == 3;
    }
}
```

> 在静态方法中，是没有`this`的，因此需要调用`new`本类对象

**示例(父类)**

```java
/* 格式：
	父类:super::方法名*/
public class FunctionDemo3  {
    public static void main(String[] args) {
        //1.创建集合
        ArrayList<String> list = new ArrayList<>();
        //2.添加数据
        Collections.addAll(list,"张无忌","周芷若","赵敏","张强","张三丰");
        //3.本类，静态方法中是没有this的
        list.stream().filter(super::stringJudge)
                .forEach(s-> System.out.println(s));
    }
}
```

> 若本类`FunctionDemo3`有父类，则可以通过`super`的方法名进行调用

## 引用构造方法

```java
/* 格式：
	类名::new
*/
// 1.创建集合对象
ArrayList<String> list = new ArrayList<>();
// 2.添加数据
Collections.addAll(list, "张无忌,15", "周芷若,14", "赵敏,13", "张强,20", "张三丰,100", "张翠山,40", "张良,35", "王二麻子,37", "谢广坤,41");
```

