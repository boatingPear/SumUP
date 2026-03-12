# 枚举

Java中枚举是一种特殊的数据类型，用于定义 一组固定的常亮。枚举类型定义了一个枚举集合，可以在其中定义枚举常量，并且可以通过名称来访问他们。枚举在Java中可以看做是个特殊的类，可以包含属性、方法和构造函数等元素

枚举常量通常用来表示一组有限的可能取值，例如一周中的星期几、一年中的季节、颜色等等。使用枚举类型可以提高代码的可读性、可维护行和可扩展性

## 基本用例

步骤一：定义枚举

- 创建枚举`Weekday`类

```java
enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}
```

> 常量的定义用`,`作为分隔符进行分割

步骤二：演示

```java
// 调用
Weekday today = Weekday.SUNDAY;
```

> 调用的方式和调用类的静态常量相同

## 枚举常量

```java
/*
格式:
enum 枚举名 {
	枚举常量1, 枚举常量2, ......;
}
*/
enum Weekday {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}

// 使用
Weekday today = Weekday.MONDAY;
System.out.println(day); // 输出 MONDAY
```

## 带有参数的枚举常量

```java
/*
格式：
enum 枚举名 {
	枚举常量1(值), 枚举常量2(值), .....;
}

其实就是枚举常量名（）括号就是调用枚举本身的构造方法
*/
enum DayOfWeek {
    MONDAY(1), TUESDAY(2), WEDNESDAY(3), THURSDAY(4), FRIDAY(5), SATURDAY(6), SUNDAY(7);
	private int value;
    private DayOfWeek(int value) {
        this.value = value;
    } 
    public int getValue() {
        retun this.value;
    }
}

// 使用
DayOfWeek dow = DayOfWeek.SUNDAY;
sout(dow.getValue); // 7
```

## 实现接口的枚举常量

```java
/*
格式
public interface Operation {
	int apply(int x, int y);
}
*/

public enum BasicOperation implements Operation {
    PLUS("+") {
        public int apply(int x, int y) { return x + y };
    },
    MINUS("-") {
        public int apply(int x, int y) { return x - y; }
    },
    TIMES("*") {
        public int apply(int x, int y) { return x * y; }
    },
    DIVIDE("/") {
        public int apply(int x, int y) { return x / y; }
    };
    
     private final String symbol;

    BasicOperation(String symbol) {
        this.symbol = symbol;
    }

    @Override public String toString() {
        return symbol;
    }
}

// 使用
int result = BasicOperation.PLUS.apply(1, 2);  // 3
```

## 匿名内部类的方式

```java
enum Operation {
    PLUS {
        public int apply(int x, int y) {
            retun x + y;
        }
    }
    MINUS {
        public int apply(int x, int y) {
            return x - y;
        }
    },
    TIMES {
        public int apply(int x, int y) {
            return x * y;
        }
    },
    DIVIDE {
        public int apply(int x, int y) {
            return x / y;
        }
    };
	public abstract int apply(int x, int y);
}

// 使用
int result = Operation.PLUS.apply(1, 2) // 返回值为3
```

