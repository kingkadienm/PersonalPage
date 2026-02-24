# Java 基础

## 语言概述

Java 是面向对象、静态类型、跨平台（JVM）的语言。一次编译、到处运行；支持自动 GC、多线程。JDK 包含 JRE（运行环境）和开发工具；JRE 包含 JVM 和类库。

## 环境与运行

```bash
javac Main.java
java Main
java -jar app.jar
java -version
```

包与目录对应；入口为 `public static void main(String[] args)`。

## 基本类型与包装类

| 基本类型 | 字节 | 包装类     | 默认值   |
|----------|------|------------|----------|
| byte     | 1    | Byte       | 0        |
| short    | 2    | Short      | 0        |
| int      | 4    | Integer    | 0        |
| long     | 8    | Long       | 0L       |
| float    | 4    | Float      | 0.0f     |
| double   | 8    | Double     | 0.0d     |
| char     | 2    | Character  | '\u0000'  |
| boolean  | -    | Boolean    | false    |

自动装箱/拆箱：基本类型与包装类之间自动转换。包装类比较用 `equals()`；缓存：Integer 等对 -128~127 有缓存，`Integer.valueOf(127)==Integer.valueOf(127)` 为 true。

## 变量与常量

```java
int a = 1;
final int B = 2;
var s = "hello";
```

final：修饰变量不可改、方法不可重写、类不可继承。static：类级别，所有实例共享。

## 字符串

```java
String s = "hello";
String s2 = new String("hello");
s.length();
s.charAt(0);
s.substring(0, 2);
s.indexOf("ll");
s.replace("l", "L");
s.split(",");
String.join(",", "a", "b");
s.trim();
s.equals(s2);
s.equalsIgnoreCase("HELLO");
s.startsWith("he");
String.format("%s %d", "x", 1);
```

String 不可变；拼接大量字符串用 StringBuilder（线程不安全）或 StringBuffer（线程安全）。字面量在常量池；`new String()` 在堆。

## 运算符与流程控制

- 算术：+ - * / % ++ --
- 比较：== != > < >= <=；equals 比较内容
- 逻辑：&& || !
- 三元：cond ? a : b
- switch：支持 byte/short/int/char/String/enum；break 防穿透

```java
if (x > 0) { }
for (int i = 0; i < n; i++) { }
for (String item : list) { }
while (cond) { }
do { } while (cond);
```

## 面向对象

### 类与对象

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

构造方法可重载；不写则默认无参构造；子类构造首行隐式/显式 `super(...)`。

### 继承与多态

- 单继承，extends；子类拥有父类非 private 成员；可重写（@Override）方法。
- 多态：父类引用指向子类对象；编译看左边、运行看右边；重写方法运行执行子类。
- super：调用父类成员/构造。final 类不可继承，final 方法不可重写。

### 抽象类与接口

- 抽象类：abstract class，可有抽象方法（无体）和普通方法，单继承。
- 接口：interface，JDK8 前只能抽象方法+常量；JDK8 可 default/static 方法；JDK9 可 private。多实现。
- 抽象类强调“是什么”，接口强调“能做什么”。

### 内部类

- 成员内部类：依赖外部实例；可访问外部 private。
- 静态内部类：不依赖外部实例。
- 局部内部类：方法内定义。
- 匿名内部类：实现接口或继承类并实例化，常用于回调、事件。

## 集合

### 常用实现

| 接口    | 有序 | 允许重复 | 实现类           |
|---------|------|----------|------------------|
| List    | 是   | 是       | ArrayList、LinkedList |
| Set     | 否*  | 否       | HashSet、LinkedHashSet、TreeSet |
| Queue   | 是   | 是       | LinkedList、ArrayDeque、PriorityQueue |
| Map     | 否*  | key 不重复 | HashMap、LinkedHashMap、TreeMap、Hashtable |

\* Linked 保持插入顺序；Tree 按 key 排序。

### List

```java
List<String> list = new ArrayList<>();
list.add("a");
list.get(0);
list.set(0, "b");
list.remove(0);
list.size();
list.contains("a");
list.indexOf("a");
Collections.sort(list);
```

ArrayList 基于数组，随机访问 O(1)，尾部增删 O(1)，中间插入 O(n)。LinkedList 双向链表，头尾增删 O(1)，随机访问 O(n)。

### Set

```java
Set<String> set = new HashSet<>();
set.add("a");
set.remove("a");
set.contains("a");
set.size();
```

HashSet 基于 HashMap；元素需正确实现 equals/hashCode。TreeSet 基于红黑树，元素需 Comparable 或传入 Comparator。

### Map

```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");
map.getOrDefault("b", 0);
map.remove("a");
map.containsKey("a");
map.keySet();
map.values();
map.entrySet();
```

HashMap：数组+链表/红黑树，key 需 equals/hashCode；允许 null key（1 个）和 null value。Hashtable 线程安全、不允 null。ConcurrentHashMap 分段/桶级锁，高并发用。

### 迭代与遍历

```java
for (String s : list) { }
list.forEach(s -> System.out.println(s));
Iterator<String> it = list.iterator();
while (it.hasNext()) { it.next(); }
map.forEach((k, v) -> { });
```

## 泛型

泛型在编译期做类型检查，运行时擦除为裸类型（类型擦除），故不能 new T()、不能 T[] 等具化类型操作。

```java
class Box<T> {
    private T value;
    public void set(T v) { value = v; }
    public T get() { return value; }
}
Box<String> box = new Box<>();
```

通配符：`?` 未知类型；`? extends T` 上界，只读；`? super T` 下界，可写。PECS：Producer extends, Consumer super。

```java
void read(List<? extends Number> list) { Number n = list.get(0); }
void write(List<? super Integer> list) { list.add(1); }
```

类型擦除：泛型信息编译后丢失，T 变为 Object 或声明时的上界；桥方法用于多态时保持重写签名一致。

## Lambda 与 Stream API

Lambda：函数式接口（仅一个抽象方法）的实例化。(参数) -> 表达式 或 (参数) -> { 语句 }。

```java
@FunctionalInterface
interface F { int apply(int a, int b); }
F f = (a, b) -> a + b;

List<String> list = Arrays.asList("a", "bb", "ccc");
list.sort((a, b) -> a.length() - b.length());
list.forEach(s -> System.out.println(s));
```

方法引用：静态 MethodRef::staticMethod、实例 obj::instanceMethod、构造 Class::new、任意对象类型 Class::instanceMethod。

Stream：惰性、一次性；不修改源。创建：list.stream()、Stream.of()、Arrays.stream()。中间：filter、map、flatMap、distinct、sorted、limit、peek。终结：forEach、collect、reduce、count、anyMatch、allMatch、findFirst。

```java
list.stream()
    .filter(s -> s.length() > 1)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
int sum = list.stream().mapToInt(String::length).sum();
```

## Optional

避免 NPE，表示“有或没有”的值。创建：Optional.of(value)、Optional.ofNullable(value)、Optional.empty()。使用：isPresent()、ifPresent(Consumer)、orElse(default)、orElseGet(Supplier)、orElseThrow()、map()、flatMap()、filter()。

```java
Optional<String> opt = Optional.ofNullable(getName());
String s = opt.orElse("default");
opt.ifPresent(System.out::println);
```

## 异常体系

- Throwable：Error（OutOfMemoryError、StackOverflowError 等，一般不捕获）、Exception。Exception 分 RuntimeException（非受检，可不声明）与受检异常（IOException、SQLException 等，必须处理或声明）。常见：NullPointerException、IndexOutOfBoundsException、IllegalArgumentException、IOException、ClassNotFoundException。自定义异常继承 Exception 或 RuntimeException；重写 fillInStackTrace 可减少开销。

```java
try {
    // ...
} catch (IOException e) {
    e.printStackTrace();
} catch (Exception e) {
    throw new RuntimeException(e);
} finally {
    // 通常用于释放资源
}
```

throws 声明可能抛出的异常；throw 抛出异常对象。try-with-resources 自动关闭实现了 AutoCloseable 的资源。

```java
try (InputStream in = new FileInputStream("a.txt")) {
    // ...
}
```

## Java 新特性（record / switch 表达式 / var）

**record（JDK16 正式）**：不可变数据载体，自动生成构造器、getter、equals、hashCode、toString；可加紧凑构造器做校验。

```java
record Point(int x, int y) {}
Point p = new Point(1, 2);
```

**switch 表达式（JDK14 预览，JDK17 正式）**：可返回值，用箭头 -> 无 fall-through；yield 返回值。

```java
String s = switch (x) {
    case 1 -> "one";
    case 2, 3 -> "two or three";
    default -> yield "other";
};
```

**var（JDK10）**：局部变量类型推断，编译期确定类型；不能用于 lambda 形参、字段、方法参数与返回类型。仅提高可读性，不改变静态类型。

```java
var list = new ArrayList<String>();
for (var e : list) { }
```

## 常用 API

- Object：equals、hashCode、toString、clone、getClass；重写 equals 必须重写 hashCode。
- 时间：JDK8+ 用 java.time（LocalDate、LocalDateTime、ZonedDateTime、Duration、Period）；旧版 Date、Calendar。
- 数学：Math、Random、BigInteger、BigDecimal。
- 工具：Arrays（sort、asList、copyOf）、Collections（sort、reverse、shuffle、binarySearch）。

## IO 基础

- 字节流：InputStream/OutputStream；FileInputStream、FileOutputStream、BufferedInputStream。
- 字符流：Reader/Writer；InputStreamReader、FileReader、BufferedReader。
- 缓冲流减少系统调用。NIO 见进阶。

```java
try (BufferedReader br = new BufferedReader(new FileReader("a.txt"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```
