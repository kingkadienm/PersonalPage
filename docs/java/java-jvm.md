# JVM 详解

## 内存结构

### 程序计数器（PC Register）

- 当前线程执行的字节码行号指示器；各线程独立；唯一不会 OOM 的区域。

### 虚拟机栈（Java 栈）

- 每线程一个栈；每方法一个栈帧。栈帧含：局部变量表、操作数栈、动态链接、方法出口等。
- 局部变量表以 Slot 为单位；long/double 占 2 Slot。栈深度超限抛 StackOverflowError；可动态扩展时无法申请到内存抛 OutOfMemoryError。
- -Xss 设置栈容量。

### 本地方法栈

- 为 Native 方法服务；HotSpot 中与虚拟机栈合一。

### 堆（Heap）

- 存放对象实例与数组；GC 主要区域。逻辑上分新生代、老年代；新生代分 Eden、Survivor0、Survivor1（From/To）。
- 新生代：大多数对象在这里分配并很快被回收。老年代：长期存活对象、大对象（直接进老年代的策略视收集器而定）。
- -Xms 初始堆、-Xmx 最大堆，建议设成相同避免动态扩容。-Xmn 新生代大小。-XX:SurvivorRatio=8 表示 Eden:From:To=8:1:1。

### 方法区（元空间）

- 存类信息、常量、静态变量、JIT 编译后代码。JDK8 用元空间（Metaspace）在本地内存实现，不再用永久代。
- -XX:MetaspaceSize、-XX:MaxMetaspaceSize。OOM：类元数据过多或泄漏。

### 直接内存

- NIO 使用的堆外内存，受 -XX:MaxDirectMemorySize 限制；分配时可能触发 Full GC。

## 类加载机制

### 过程

- **加载**：通过全限定名取二进制流；转为方法区数据结构；生成 Class 对象。
- **链接**：验证（格式、元数据、字节码、符号引用）；准备（静态变量赋零值，final 常量赋实际值）；解析（符号引用→直接引用，可延迟到使用前）。
- **初始化**：执行 \<clinit\>（静态块与静态变量赋值）；父类先初始化；接口实现类初始化时不要求父接口先初始化。

### 双亲委派

- 类加载器：Bootstrap（加载 lib 下核心类）、Extension（ext 目录）、Application（类路径）。
- 收到加载请求先委派给父加载器；父无法加载时自己加载。保证核心类由 Bootstrap 加载，避免被替换。
- 破坏双亲委派：JDK1.2 前 findClass、SPI（如 JDBC 用线程上下文类加载器加载驱动）、OSGi 等模块化。

### 自定义类加载器

- 继承 ClassLoader，重写 findClass；不破坏双亲委派则重写 findClass，否则重写 loadClass。

## 垃圾回收

### 判定死亡

- **引用计数**：有循环引用问题，Java 不用。
- **可达性分析**：从 GC Roots 出发，不可达即可回收。GC Roots：栈中引用、静态变量、常量、JNI 引用等。

### 引用类型

- 强、软（SoftReference，内存不足时回收）、弱（WeakReference，下次 GC 必回收）、虚（PhantomReference，用于跟踪回收）。

### 回收算法

- **标记-清除**：标记后统一清除；有碎片。
- **标记-复制**：分两块，存活对象复制到另一块；适合新生代，Eden+Survivor 即此思想。
- **标记-整理**：标记后存活对象向一端移动；适合老年代，无碎片但移动有成本。

### 收集器

- **Serial**：单线程，STW；新生代复制。
- **ParNew**：多线程版 Serial，配合 CMS 用。
- **Parallel Scavenge**：多线程新生代，关注吞吐量；-XX:MaxGCPauseMillis、-XX:GCTimeRatio。
- **Serial Old**：老年代单线程标记-整理。
- **Parallel Old**：老年代多线程标记-整理，与 Parallel Scavenge 搭配。
- **CMS**：并发标记清除，目标低停顿。步骤：初始标记（STW）→ 并发标记 → 重新标记（STW）→ 并发清除。缺点：碎片、浮动垃圾、并发阶段占用 CPU。-XX:+UseConcMarkSweepGC。
- **G1**：分区（Region），可设定停顿目标。Young GC + 并发标记 + Mixed GC（回收部分 Old）。-XX:+UseG1GC、-XX:MaxGCPauseMillis。
- **ZGC**：低延迟，着色指针、读屏障；支持 TB 级堆。JDK15 生产可用。

## 调优工具

### jstack

- 打印线程栈；查死锁、线程卡在何处。`jstack <pid>`；可配合 -l 打印锁信息。

### jmap

- 堆信息、堆 dump。`jmap -heap <pid>`、`jmap -dump:format=b,file=heap.hprof <pid>`。dump 会 STW，线上慎用或选低峰。

### jstat

- 查看 GC 统计：`jstat -gc <pid> 1000` 每秒打印；-gcutil 看占比。

### jvisualvm

- 图形化：监控堆、线程、CPU、采样、dump 分析。

### arthas

- 阿里开源；attach 到进程，不重启排查。thread 看线程、jad 反编译、watch 观察方法入参返回值、heapdump  dump、trace 追踪调用链。

## OOM 排查

- 堆溢出：dump 用 MAT/VisualVM 看占用最大的对象、是否泄漏（如集合只增不减）。
- 元空间溢出：类加载过多、重复加载；检查 CGLIB、反射、动态类。
- 栈溢出：-Xss 调大或查递归/调用链是否过深。
- 直接内存：-XX:MaxDirectMemorySize、NIO 使用不当。

## CPU 100% 排查

- top 找进程；top -Hp \<pid\> 找线程；把线程 id 转成 16 进制，jstack \<pid\> 中查对应 nid，看该线程栈在做什么（如死循环、频繁 GC）。
- 若是 GC 导致：jstat 看 GC 频率与耗时；考虑堆大小、对象分配速率、老年代是否过小。

## Full GC 频繁

- 老年代满或元空间满触发。看 jstat 中 Old 区、Metaspace 变化；dump 看大对象、是否有内存泄漏；调整堆与比例、检查代码里大对象与静态集合。
