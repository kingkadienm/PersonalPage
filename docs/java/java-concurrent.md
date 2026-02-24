# 并发编程详解

## 线程创建与生命周期

- **创建方式**：继承 Thread 重写 run；实现 Runnable 传 Thread；实现 Callable 配 FutureTask。推荐 Runnable/Callable，便于线程池与复用。
- **状态**：NEW、RUNNABLE（含就绪与运行）、BLOCKED（等 monitor）、WAITING（无时限 wait/join）、TIMED_WAITING（sleep/带时限 wait）、TERMINATED。
- start() 只能调用一次；run() 只是普通方法，直接调用不会新线程。

## synchronized

- **用法**：修饰实例方法（锁 this）、静态方法（锁 Class）、代码块 synchronized(obj)。同一锁同一时刻仅一线程持有；可重入。
- **原理**：Monitor（管程）；字节码 monitorenter/monitorexit；锁存在对象头 Mark Word。
- **锁升级**：无锁 → 偏向锁（单线程多次进入）→ 轻量级锁（CAS 自旋）→ 重量级锁（挂起，OS 互斥）。-XX:-UseBiasedLocking 可关偏向锁。

## Lock 与 ReentrantLock

- 显式加锁解锁；unlock 必须在 finally。可重入；公平/非公平（默认）；tryLock()、lockInterruptibly()。
- 与 synchronized 区别：Lock 可非块结构、可中断、可超时、多条件；synchronized 由 JVM 实现，自动释放。

## volatile

- 保证可见性：写立即刷新主存，读从主存读（或缓存一致性协议）。禁止指令重排：内存屏障。
- 不保证原子性；适合一写多读、状态标志。i++ 等需 CAS 或 synchronized。

## CAS

- Compare-And-Swap；无锁更新，ABA 问题可用版本号或 AtomicStampedReference 解决。
- AtomicInteger、AtomicLong、AtomicReference、LongAdder（高并发计数拆分 cell，再 sum）。

## AQS（AbstractQueuedSynchronizer）

- state 表示资源数；CLH 队列管理等待线程。获取：tryAcquire 成功则占坑，失败则入队、挂起；释放：tryRelease 改 state，唤醒后继。
- 基于 AQS：ReentrantLock、ReentrantReadWriteLock、Semaphore、CountDownLatch（共享）、CyclicBarrier 通过 ReentrantLock+Condition 实现。

## JMM（Java 内存模型）

- 主内存与工作内存；线程对变量的操作在工作内存，再同步到主内存。happens-before：程序顺序、锁规则、volatile、传递性等；满足 hb 则可见性有保障。
- volatile、synchronized、final 的可见性与有序性保证。

## 线程池

### 参数

- corePoolSize：核心线程数，常驻。
- maximumPoolSize：最大线程数。
- keepAliveTime + unit：非核心线程空闲存活时间。
- workQueue：任务队列，ArrayBlockingQueue、LinkedBlockingQueue、SynchronousQueue、PriorityBlockingQueue、DelayedWorkQueue 等。
- threadFactory：创建线程的工厂。
- handler：拒绝策略；AbortPolicy（抛异常）、CallerRunsPolicy（调用者跑）、DiscardPolicy、DiscardOldestPolicy。

### 流程

- 任务数 ≤ corePoolSize：新建核心线程执行。
- 任务数 > corePoolSize：放入 workQueue。
- 队列满且 当前线程数 < maximumPoolSize：新建非核心线程。
- 队列满且 当前线程数 = maximumPoolSize：执行 handler。

### 为什么不用 Executors

- newFixedThreadPool、newSingleThreadExecutor 用无界 LinkedBlockingQueue，任务堆积可能 OOM。
- newCachedThreadPool 最大线程数为 Integer.MAX_VALUE，可能创建过多线程。推荐手动 new ThreadPoolExecutor，显式设队列大小与拒绝策略。

### 线程池参数设计

- CPU 密集：核心数 + 1 或 Ncpu；IO 密集：可 2*Ncpu 或按 IO 等待比放大。队列有界；拒绝策略按业务选（记录、降级、CallerRunsPolicy）。

## CompletableFuture

- 组合异步任务；supplyAsync、thenApply、thenCompose、thenCombine、allOf、anyOf、exceptionally、handle。
- 替代 Future.get() 阻塞；可链式编排多步异步。

## ConcurrentHashMap

- JDK8：CAS + synchronized 锁桶；put/get 见 [集合](/java/java-collections)。size 用 baseCount + CounterCell 分段计数。

## 并发工具类

- **CountDownLatch**：计数减到 0 时 await 的线程放行；一次性。countDown()、await()。
- **CyclicBarrier**：多线程到齐后执行屏障动作；可复用。await()。
- **Semaphore**：许可数，acquire/release；限流、控制并发数。
- **Phaser**：分阶段协同，可动态注册。
- **ThreadLocal**：线程局部变量；注意内存泄漏：用完 remove()，或使用池化线程时务必 remove。

## 必会问题简答

- **volatile 的作用**：可见性、禁止重排；不保证原子性。
- **synchronized 和 Lock 区别**：见上 Lock 小节。
- **线程池参数怎么设计**：见上「线程池参数设计」。
