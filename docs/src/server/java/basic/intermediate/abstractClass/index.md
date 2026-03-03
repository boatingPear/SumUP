# 抽象类

小结

> 1. 概述
>
>    - 定义：没有方法体的方法称为抽象方法，包含抽象方法的类就是抽象类
>
>    - 抽象方法：没有方法体的方法
>
>      ```java
>      // 抽象方法
>      public abstract void abstractMethod();
>      ```
>
>    - 抽象类：包含抽象方法的类
>
>      ```java
>      public abstract class AbstractClass {
>          // 抽象方法
>          public abstract void abstractMethod();
>      }
>      ```
>
>    - 注意：抽象类不一定有抽象方法，但是有抽象方法的类必须定义成抽象类。
>
> 2. abstract介绍
>    - 特征： 
>      - 抽象类得到了拥有抽象方法的能力，也就是说有了自己的一套规范
>        - 抽象类失去了创建对象的能力，也就是说不能创建对象