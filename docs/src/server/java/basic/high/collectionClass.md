# 集合类

## 集合体系结构

Java中的集合类是用于操作、存储和管理一组对象的容器。其中集合可以分为，单列集合和双列集合。

![image-20230321141743728](../assets/d64ba5d9483b011ac664d722694da882.png)

在Java中，单列合集值得是只能保存一个元素序列的集合，例如List、Set和Queue等。双列合集则是指可以保存键值对的集合，例如Map等。单列集合和双列集合在保存和操作数据时的方式和目的有所不同。

### 单列集合

单列集合又分为：List系列集合、Set系列集合

![image-20230321141847845](../assets/1bbb8a8f9f32c7bced1d1c0f67a775ab.png)

> - List系列集合：有序、可重复的集合。可以通过索引来访问其中的元素，可以存储重复的数据。
> - Set系列集合：无需、不可重复的集合。不可以通过索引来访问其中的元素，不可以存储重复的数据。

### 双列集合    

Java中的双列集合是指可以存储键值对数据结构的集合，也称为映射表或关联数组

![image-20230424194516589](../assets/a1f5f59583158372e66fc32504c1a247.png)

> - 双列集合，一个键对应一个值
> - 键不可以重复，值可以重复

## Collection集合

Collection是单列集合的祖宗接口，他的功能是全部单列集合都可以继承使用的

::: warning

Collection是一个接口，我们不能直接创建他的对象。所以，我们现在学习他的方法时，只能创建他实现类的对象

:::

### 常用成员方法

| 方法名                     | 说明                                 |
| -------------------------- | ------------------------------------ |
| boolean add(E e)           | 添加元素                             |
| boolean remove(Object o)   | 从集合中移除指定的元素               |
| boolean removeIf(Object o) | 根据条件进行移除                     |
| void clear()               | 清空集合中的元素                     |
| boolean contains(Object o) | 判断集合中是否存在指定的元素         |
| boolean isEmpty()          | 判断集合是否为空                     |
| int size()                 | 集合的长度，也就是集合中元素的总个数 |

#### add

```java
Collection<String> coll = new ArrayList<>();
coll.add("aaa");
coll.add("bbb");
coll.add("ccc");
System.out.println(coll); // [aaa, bbb, ccc]
```

- 如果我们要往List系列集合中添加数据，那么方法永远返回true，因为List系列集合是允许元素重复的。
- 如果我们要往Set系列集合中添加数据，如果当前要添加的元素不存在，方法返回true，添加成功。如果当前添加的元素已经存在，方法返回false，表示添加失败。因为Set系列的集合不允许重复。

#### clear

``` java
Collection<String> coll = new ArrayList<>(Arrays.asList("aaa", "bbb", "ccc"));
coll.clear();
```

#### remove

```java
Collection<String> coll = new ArrayList<>(Arrays.asList("aaa", "bbb",, "ccc"));
sout(coll.remove("bbb")); // true
sout(coll); // [aaa, ccc]
```

- 因为Collection里面定义的是共性的方法，不是他的所有子类都有索引(如map)，所以此时不能通过索引进行删除。只能通过元素的对象进行删除
- 方法会有一个布尔类型的返回值，删除成功返回true，删除失败返回false
- 如果要删除的元素不存在，就会删除失败。

#### contains

```java
Collection<String> coll = new ArrayList<>(Arrays.asList("aaa", "bbb", "ccc"));
boolean result1 = coll.contains("bbb");
sout(result1); // true
```

- 底层是依赖equals方法进行判断是否存在的
- 所以，如果集合中存储的是自定义对象，也想通过contains方法来判断是否包含，那么在javaBean类中，一定要重写equals方法

#### isEmpty

```java
Collection<String> coll = new ArrayList<>();
boolean result = coll.isEmpty;
sout(result); // true
```

#### size

```java
Collection<String> coll = new ArrayList<>(Arrays.asList("aaa","bbb"));
coll.add("ccc");
int size = coll.size();
sout(size); // 3
```

#### 案例--学生查询

```java
package com.itcode.commonClass;

import java.util.Objects;

public class Student {
    private String name;
    private int age;

    public Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
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

    @Override
    public boolean equals(Object o) {
        // 先判断对象的地址是不是一致
        if (o == this) return true;
        // 如果为空或者Class类型不一致，则返回false
        if (o == null || o.getClass() != this.getClass()) return false;
        // 在判断name和age是不是相同
        Student s = (Student)o;
        if (this.name.equals(s.getName()) && this.age == s.getAge()) return true;
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

//1.创建集合的对象
Collection<Student> coll = new ArrayList<>();

//2.创建三个学生对象
Student s1 = new Student("zhangsan",23);
Student s2 = new Student("lisi",24);
Student s3 = new Student("wangwu",25);

//3.把学生对象添加到集合当中
coll.add(s1);
coll.add(s2);
coll.add(s3);

//4.判断集合中某一个学生对象是否包含
Student s4 = new Student("zhangsan",23);
//因为contains方法在底层依赖equals方法判断对象是否一致的。
//如果存的是自定义对象，没有重写equals方法，那么默认使用Object类中的equals方法进行判断，而Object类中equals方法，依赖地址值进行判断。
//需求：如果同姓名和同年龄，就认为是同一个学生。
//所以，需要在自定义的Javabean类中，重写equals方法就可以了。
System.out.println(coll.contains(s4));
```

### 遍历方式

#### 迭代器

概述：迭代器在Java中的类是`Iterator`，迭代器是集合专用的遍历方式

- `Collection`集合获取迭代器
  - `Iterator<E> iterator()` 返回迭代器对象，默认指向当前集合的`0`索引
- `Iterator`中的常用成员方法
  - `boolean hasNext()`判断当前位置是否有元素，有元素返回`true`，没有返回`false`
  - `E next()`获取当前位置的元素，并将迭代器对象移向下一个位置。

**代码示例**

```java
public class IteratorDemo1 {
    public static void main(String[] args) {
        // 创建集合对象
        Collection<String> c = new ArrayList<>();
        
        // 添加元素
        c.add("hello");
        c.add("world");
        c.add("java");
        c.add("javaee");
        
        //Iterator<E> iterator()：返回此集合中元素的迭代器，通过集合的iterator()方法得到
        Iterator<String> it = c.iterator(); // 1.获取迭代器
        
        //用while循环改进元素的判断和获取
        while (it.hasNext()) { // 2.判断是否有元素
            // 先获取元素，再移动指针
            String s = it.next(); // 3.获取元素 // 4.移动指针
            System.out.println(s);
        }
    }
}
```

> 迭代器运行流程
>
> 1. 创建指针
> 2. 判断是否有元素
> 3. 获取指针
> 4. 移动指针

::: tip

1. 当迭代器中**无元素**或元素遍历完成，再次调用`it.next()`方法，则报错`NoSuchElementException`
2. 迭代器遍历完毕，指针不会复位
3. 循环中只能用一次`next()`方法（因为`next`方法会做两件事，分别是获取元素和移动指针）

:::

**迭代器删除**

`void remove()`删除迭代器对象当前指向的元素

```java
public class IteratorDemo2 {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("a");
        list.add("b");
        list.add("b");
        list.add("c");
        list.add("d");

        Iterator<String> it = list.iterator();
        while(it.hasNext()){
            String s = it.next();
            if("b".equals(s)){
                //指向谁,那么此时就删除谁.
                it.remove();
            }
        }
        System.out.println(list);
    }
}
```

::: warning

迭代器遍历时，不能用集合的方法进行增加或删除，否则报错`ConcurrentModificationException`

:::

#### 增强for循环

**格式：**

```java
for(集合/数组中元素的数据类型 变量名 : 集合/数组名) {
    // 已经将当前遍历到的元素封装到变量中了，直接使用变量即可
}
// 例如
for(String s : list) {
    sout(s);
}
```

**示例：**

```java
public class MyCollectonDemo1 {
    public static void main(String[] args) {
        ArrayList<String> list =  new ArrayList<>();
        list.add("a");
        list.add("b");
        list.add("c");
        list.add("d");
        list.add("e");
        list.add("f");

        //1,数据类型一定是集合或者数组中元素的类型
        //2,str仅仅是一个变量名而已,在循环的过程中,依次表示集合或者数组中的每一个元素
        //3,list就是要遍历的集合或者数组
        for(String str : list){
            System.out.println(str);
        }
    }
}
```

::: tip

修改增强`for`中的变量，不会改变集合中原本的数据，因为是通过第三方变量进行赋值

![image-20230420160153625](../assets/018493f14c8bb68336daf7d919bcfe6e.png)

:::

#### Lambda表达式

概述：得益于JDK 8开始的新技术`Lambda`表达式，提供了一种更简单、更直接的遍历集合的方式。

**常用成员方法：**

`default void forEach(Consumer<? super > action);`结合`lambda`遍历集合

```java
Collection<String> coll = new ArrayList<>(Arrays.asList(
	new Student("张三" ,17),
    new Student("李四" ,18),
    new Student("王五" ,19),
    new Student("赵六" ,20)
));
coll.add("zhangsan");
coll.add("lisi");
coll.add("wangwu");
coll.forEach(s -> System.out.println(s));
```

::: tip

底层原理：其实也会自己遍历集合，依次得到每一个元素。把得到的每一个元素，传递给下面的accept方法。s依次表示集合中的每一个数据

![image-20230420160647933](../assets/1d9498ef7c208d992a21241d13945b9a.png)

:::

## List集合

