# Java 进阶

## JVM 概要

- 类加载：加载 → 链接（验证、准备、解析）→ 初始化。双亲委派：类加载器收到请求先委派父加载器，父无法加载才自己加载。
- 内存：堆（对象、数组）、方法区/元空间（类信息、常量池）、虚拟机栈（栈帧、局部变量）、本地方法栈、程序计数器。堆分新生代（Eden、Survivor）、老年代。
- GC：分代收集；新生代常用复制；老年代标记-清除或标记-整理。可达性分析判定垃圾；GC Roots：栈中引用、静态引用、常量、JNI 引用等。
- 常用参数：-Xms/-Xmx 堆初/最大，-Xmn 新生代，-XX:+UseG1GC，-XX:MaxMetaspaceSize。

## 并发基础

### 线程创建与生命周期

- 方式：继承 Thread 重写 run；实现 Runnable 传参给 Thread；实现 Callable 配合 FutureTask。推荐 Runnable/Callable，避免单继承、便于线程池。
- 状态：NEW、RUNNABLE、BLOCKED、WAITING、TIMED_WAITING、TERMINATED。start() 后进入 RUNNABLE；wait() 进入 WAITING；sleep() 进入 TIMED_WAITING。

### synchronized

- 用法：修饰实例方法（锁 this）、静态方法（锁 Class）、代码块 synchronized(obj)。
- 原理：Monitor（管程）；锁升级：无锁 → 偏向锁 → 轻量级锁 → 重量级锁。
- 可重入；锁释放时唤醒等待线程。

### volatile

- 保证可见性：写立即刷新主存，读从主存读。禁止指令重排（内存屏障）。
- 不保证原子性；适合一写多读或作为状态标志。i++ 等复合操作需配合 synchronized 或 CAS。

### wait / notify

- 在 synchronized 块内调用；wait() 释放锁并进入等待，被 notify/notifyAll 唤醒后竞争锁。通常用 while 判断条件，避免虚假唤醒。

```java
synchronized (lock) {
    while (!condition) lock.wait();
    // ...
    lock.notifyAll();
}
```

### Lock 与 AQS

- ReentrantLock：显式加锁 unlock 必须在 finally；可重入、可公平/非公平；支持 tryLock、lockInterruptibly。
- Condition：await/signal/signalAll，替代 wait/notify，可多条件队列。
- AQS：AbstractQueuedSynchronizer，state + CLH 队列；ReentrantLock、Semaphore、CountDownLatch、ReentrantReadWriteLock 等基于 AQS。

## JUC 常用

- ConcurrentHashMap：分段/桶锁，高并发下替代 HashMap。
- CopyOnWriteArrayList：写时复制，读多写少。
- BlockingQueue：ArrayBlockingQueue、LinkedBlockingQueue、PriorityBlockingQueue、DelayQueue、SynchronousQueue。put/take 阻塞；offer/poll 带超时。
- 线程池：ThreadPoolExecutor（corePoolSize、maximumPoolSize、keepAliveTime、workQueue、threadFactory、handler）；提交顺序：核心未满新建核心线程 → 入队 → 队满且未达最大则新建非核心 → 满则拒绝。Executors 工厂：newFixedThreadPool、newCachedThreadPool、newSingleThreadExecutor（注意 OOM 与无界队列）。
- Future/FutureTask：异步结果；get() 阻塞。CompletableFuture：组合异步、thenApply、thenCompose、allOf、anyOf。
- CountDownLatch：countDown() 减一，await() 等为 0。CyclicBarrier：多线程到齐后执行屏障动作。Semaphore：许可数，acquire/release。
- AtomicXxx：CAS 无锁；AtomicInteger、AtomicLong、AtomicReference、LongAdder（高并发计数更优）。

## 反射与注解

- Class：Class.forName("全限定名")、obj.getClass()、类.class。可获取构造、方法、字段（含私有，setAccessible(true)）。
- Method.invoke(obj, args)；Constructor.newInstance(args)。
- 注解：@Retention(SOURCE/CLASS/RUNTIME)、@Target、@Documented、@Inherited。运行时通过反射 getAnnotation、getDeclaredAnnotations 等读取。
- 应用：框架配置、序列化、代理、单元测试。

## 代理

- 静态代理：手写代理类实现同一接口，委托给被代理对象。
- 动态代理：JDK 动态代理（基于接口，Proxy.newProxyInstance、InvocationHandler）；CGLIB（基于子类，无接口）。Spring AOP 默认 JDK 代理接口、CGLIB 代理类。

## BIO / NIO / AIO

- BIO：同步阻塞，一连接一线程；ServerSocket.accept()、Socket 读写均阻塞。适合连接数少。
- NIO：同步非阻塞，Selector 多路复用；Channel、Buffer、Selector。单线程可处理多 Channel。适用高并发、短连接。
- AIO：异步非阻塞，Proactor；CompletionHandler，OS 完成 IO 后回调。JDK7+；适用长连接、重 IO。

## 新特性概要

- JDK8：Lambda、Stream API、Optional、接口 default/static、方法引用、新时间 API（java.time）。
- JDK9：模块系统、接口 private 方法、集合 of()、Stream 增强。
- JDK11：var 局部变量推断、String 新方法、HttpClient、单文件运行。
- JDK17 LTS：sealed 类、pattern matching for switch、record、文本块等。

## 设计模式（简述）

- 单例：懒汉/饿汉、双重检查锁、静态内部类、枚举。
- 工厂/抽象工厂：封装创建。
- 建造者：链式构造复杂对象。
- 代理：见上。
- 观察者/发布订阅：事件解耦。
- 策略：算法可替换。
- 模板方法：骨架固定、步骤可重写。
- 适配器、装饰器、迭代器等。

## 序列化

- Serializable：实现接口；transient 不序列化；serialVersionUID 控制版本兼容。
- 反序列化不走构造方法。安全注意：避免反序列化不可信数据（可导致 RCE）。
- 替代：JSON（Jackson、Gson）、Protobuf 等。

## 常见面试点

- equals 与 ==：== 比较引用；equals 比较内容，需重写 hashCode。
- String 不可变原因与好处：安全、可缓存 hash、常量池、线程安全。
- ArrayList 与 LinkedList 区别与选用。
- HashMap 原理：结构、hash、扩容、树化；1.7 与 1.8 差异。
- ConcurrentHashMap 1.7 与 1.8 实现差异。
- synchronized 与 Lock 区别；synchronized 与 volatile 区别。
- 线程池参数与拒绝策略；为什么不用 Executors 创建。
- JVM 内存模型、类加载、GC 算法与收集器。
- 如何排查 OOM、死锁、CPU 高。
