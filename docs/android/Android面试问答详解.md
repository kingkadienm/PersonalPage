Android面试问答详解
一、Java 基础
1. == 和 equals 的区别？
回答：
• == 比较的是内存地址（引用是否指向同一对象）
• equals 比较的是内容（逻辑上是否相等）
代码示例：
String s1 = new String("abc");
String s2 = new String("abc");
s1 == s2       // false，不同对象
s1.equals(s2)  // true，内容相同

String s3 = "abc";
String s4 = "abc";
s3 == s4       // true，常量池复用追问：基本类型呢？
基本类型没有 equals 方法，只能用 == 比较值。
---
2. 为什么重写 equals 必须重写 hashCode？
回答：
因为 HashMap 等集合先用 hashCode 定位桶，再用 equals 判断是否相等。
如果两个对象 equals 相等但 hashCode 不同，会被放到不同的桶里，导致查找失败。
反例：
class User {
    String name;
    @Override
    public boolean equals(Object o) {
        return this.name.equals(((User)o).name);
    }
    // 没重写 hashCode
}

Map<User, String> map = new HashMap<>();
User u1 = new User("张三");
map.put(u1, "value");
User u2 = new User("张三");
map.get(u2);  // null！因为 hashCode 不同，定位到不同桶正确写法：
@Override
public int hashCode() {
    return Objects.hash(name);
}---
3. String 为什么不可变？有什么好处？
回答：
String 内部用 final char[] 存储，且没有提供修改方法。
好处：
1. 线程安全，无需同步
2. 可以缓存 hashCode，HashMap 性能更好
3. 字符串常量池复用，节省内存
追问：String 为什么容易造成内存问题？
频繁拼接会创建大量临时对象，应该用 StringBuilder。
// 差
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i;  // 每次创建新对象
}

// 好
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);
}---
4. String、StringBuilder、StringBuffer 区别？
类
可变性
线程安全
性能

String
不可变
安全
拼接慢

StringBuilder
可变
不安全
快

StringBuffer
可变
安全（synchronized）
较慢

使用场景：
• 单线程拼接：StringBuilder
• 多线程拼接：StringBuffer
• 不拼接：String
---
5. ArrayList 和 LinkedList 区别？
特性
ArrayList
LinkedList

底层
数组
双向链表

随机访问
O(1)
O(n)

插入删除
O(n)
O(1)（已定位）

内存
连续，紧凑
分散，有指针开销

ArrayList 扩容：
1. 默认容量 10
2. 扩容为原来的 1.5 倍
3. Arrays.copyOf 复制到新数组
使用场景：
• 查询多：ArrayList
• 增删多（头尾操作）：LinkedList
• 实际开发中 90% 用 ArrayList
---
6. HashMap 原理？（必考）
结构：
JDK 1.8：数组 + 链表 + 红黑树
put 流程：
1. 计算 key 的 hash：(h = key.hashCode()) ^ (h >>> 16)
2. 定位下标：(n - 1) & hash
3. 如果为空，直接放入
4. 如果有冲突：
    ◦ 链表长度 < 8：尾插法插入链表
    ◦ 链表长度 >= 8 且数组长度 >= 64：转红黑树
5. 检查是否需要扩容
扩容：
• 默认容量 16，负载因子 0.75
• 元素数量 > 16 * 0.75 = 12 时扩容
• 扩容为原来的 2 倍
• 重新计算所有元素位置
追问：为什么线程不安全？
6. JDK 1.7 头插法扩容会形成环形链表，导致死循环
7. JDK 1.8 虽然改成尾插法，但 put 时仍可能数据覆盖
追问：1.7 和 1.8 区别？
版本
结构
插入方式
扩容

1.7
数组+链表
头插法
先扩容后插入

1.8
数组+链表+红黑树
尾插法
先插入后扩容

---
7. ConcurrentHashMap 原理？
JDK 1.7：
分段锁（Segment），每个 Segment 是一个小 HashMap，默认 16 个。
并发度 = Segment 数量
JDK 1.8：
CAS + synchronized
• 写操作：synchronized 锁住链表头节点
• 读操作：volatile 保证可见性，无锁
追问：为什么不用 Hashtable？
Hashtable 用一把大锁锁住整个表，并发度太低。
---
O(1）和O(n）是什么?
O(1) 和 O(n) 是时间复杂度（Time Complexity）的表示方式，用来描述算法执行时间随数据规模变化的趋势，而不是具体用了多少秒。
---
一、什么是时间复杂度？
时间复杂度用 大 O 表示法（Big O Notation） 描述：
算法执行时间 = f(n)
时间复杂度 = O(f(n))
其中：
• n：输入数据规模（比如数组长度）
• f(n)：操作次数随 n 的增长关系
---
二、O(1)：常数时间复杂度
含义
不管数据有多少，执行时间都一样
示例
int x = arr[5];
• 不管数组是 10 个还是 1 亿个
• 访问一次，时间固定
✅ O(1)
特点
• 最快
• 和数据规模无关
---
三、O(n)：线性时间复杂度
含义
数据翻倍，执行时间也翻倍
示例
for (int i = 0; i < n; i++) {
    System.out.println(arr[i]);
}
• 有 10 个元素 → 执行 10 次
• 有 100 个元素 → 执行 100 次
✅ O(n)
---
四、直观对比（非常重要）
时间复杂度
n = 10
n = 100
n = 1,000

O(1)
1 次
1 次
1 次

O(n)
10 次
100 次
1,000 次

👉 n 越大，差距越明显
---
五、常见时间复杂度排序（由快到慢）
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)
---
六、结合 ArrayList / LinkedList 理解
ArrayList.get(index)
list.get(5);
• 直接根据下标访问
• O(1)
LinkedList.get(index)
list.get(5);
• 从头或尾一个一个找
• O(n)
---
七、一句话记忆（面试用）
O(1)：执行时间和数据规模无关
O(n)：执行时间随数据规模线性增长
8. 泛型擦除是什么？
回答：
Java 泛型只在编译期检查，运行时会擦除类型信息。
List<String> 和 List<Integer> 运行时都是 List。
问题：
List<String> list = new ArrayList<>();
list.getClass() == ArrayList.class  // true，类型信息丢失追问：<? extends T> 和 <? super T> 区别？
• <? extends T>：上界通配符，只能读不能写（生产者）
• <? super T>：下界通配符，只能写不能读（消费者）
记忆口诀：PECS（Producer Extends, Consumer Super）
---
9.ArrayList为什么不用数组
特性
数组Array
ArrayList

长度
固定不变
动态扩容

类型
基本类型+对象
只能存储对象

特性
访问速度快
稍慢（装箱拆箱）

使用
arr[0]
list.get(0)

扩容
手动创建新数组
自动扩容

API
基础操作
丰富的方法

二、Java 并发
9. 线程的生命周期？
NEW → RUNNABLE → (BLOCKED/WAITING/TIMED_WAITING) → TERMINATED状态
说明

NEW
创建未启动

RUNNABLE
可运行（包含运行中和就绪）

BLOCKED
等待锁

WAITING
无限等待（wait/join）

TIMED_WAITING
限时等待（sleep/wait(timeout)）

TERMINATED
终止

---
10. sleep 和 wait 区别？
特性
sleep
wait

所属类
Thread
Object

释放锁
不释放
释放

使用位置
任意
synchronized 块内

唤醒方式
时间到自动
notify/notifyAll

用途
暂停执行
线程间通信

---
11. synchronized 原理？

Synchronized是java最基本的同步机制， 是Java的一个关键字，使用于多线程并发环境下，可以用来修饰实例对象和类对象，确保在同一时刻只有一个线程可以访问被 Synchronized 修饰的对象，并且能确保线程间的共享变量及时可见性，还可以避免重排序，从而保证线程安全。
回答：
synchronized 通过 Monitor（监视器锁）实现。
每个对象都有一个 Monitor，线程进入 synchronized 块时获取 Monitor，退出时释放。
对象锁 【类的实例对象】vs 类锁【类对象】：
// 对象锁：锁的是 this
synchronized void method() {}
synchronized(this) {}

// 类锁：锁的是 Class 对象
static synchronized void method() {}
synchronized(MyClass.class) {}锁升级（JDK 1.6+）：
无锁 → 偏向锁 → 轻量级锁 → 重量级锁
---
12. volatile 作用？
两个作用：
1. 可见性：一个线程修改后，其他线程立即可见
2. 禁止指令重排：禁止编译器和 CPU处理器重新排序 
                              1通过插入内存屏障实现，
                              2底层使用lock前缀指令，保证可见性
    指令重排序：正常顺序1.分配内存 2.初始化引用对象 3.赋值引用
                          重排序后1.分配内存2.赋值引用（提前赋值）3.初始化引用对象
危害：线程B可能拿到未初始化完成的对象
不保证原子性：
volatile int count = 0;
count++;  // 不是原子操作！读-改-写三步使用场景：
• 状态标记：volatile boolean running = true;
• 双重检查锁定（DCL）单例
• 对象发布与初始化顺序问题
---
13. synchronized 和 volatile 区别？
特性
synchronized
volatile

原子性
保证
不保证

可见性
保证
保证

有序性
保证
保证

阻塞
会
不会

使用范围
方法/代码块
变量

---
14. ReentrantLock 和 synchronized 区别？
特性
synchronized
ReentrantLock

实现
JVM 关键字
API

释放锁
自动
手动 unlock

可中断
不可
lockInterruptibly

超时
不支持
tryLock(timeout)

公平锁
非公平
可选公平/非公平

条件变量
单个
多个 Condition

使用建议：
• 简单场景：synchronized
• 需要高级功能：ReentrantLock
---
15. 线程池参数含义？
ThreadPoolExecutor(
    int corePoolSize,      // 核心线程数（常驻）
    int maximumPoolSize,   // 最大线程数
    long keepAliveTime,    // 非核心线程空闲存活时间
    TimeUnit unit,         // 时间单位
    BlockingQueue<Runnable> workQueue,  // 任务队列
    ThreadFactory threadFactory,         // 线程工厂
    RejectedExecutionHandler handler     // 拒绝策略
)线程池的本质不是提高速度，而是控制资源。
核心线程保证稳定处理能力，
队列决定系统承压方式，
非核心线程用于应对突发流量，
拒绝策略是系统最后一道保护。
❓1为什么要用线程池？
线程池通过复用线程，减少频繁创建和销毁线程的开销；
通过核心线程数、最大线程数和队列控制并发量，防止系统资源被打爆；
同时统一管理线程生命周期，提高系统稳定性和可维护性。
❓2. 线程池的核心参数有哪些？
考点
• 是否真正理解 ThreadPoolExecutor
• 参数之间的关系
高分回答
核心参数包括 corePoolSize、maximumPoolSize、workQueue、keepAliveTime 和拒绝策略。
corePoolSize 决定常驻线程数，workQueue 决定任务堆积方式，maximumPoolSize 决定最大并发能力，
keepAliveTime 控制非核心线程的回收时机，拒绝策略用于资源耗尽时的兜底处理。
执行流程：
1. 线程数 < corePoolSize：创建核心线程
2. 核心线程满：放入队列
3. 队列满：创建非核心线程（不超过 maximumPoolSize）
4. 都满：执行拒绝策略
拒绝策略：
策略
行为

AbortPolicy
抛异常（默认）

CallerRunsPolicy
调用者线程执行

DiscardPolicy
静默丢弃

DiscardOldestPolicy
丢弃队列最老任务

---
16. 为什么不推荐 Executors？
// 1. newFixedThreadPool / newSingleThreadExecutor
// 队列是 LinkedBlockingQueue，无界！可能 OOM
Executors.newFixedThreadPool(10);

// 2. newCachedThreadPool
// maximumPoolSize = Integer.MAX_VALUE，可能创建大量线程 OOM
Executors.newCachedThreadPool();正确做法：
new ThreadPoolExecutor(
    5, 10, 60, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(100),  // 有界队列
    new ThreadPoolExecutor.CallerRunsPolicy()
);---
17. CAS 原理？什么是 ABA 问题？
CAS（Compare And Swap）：
比较并交换，原子操作。
期望值 == 内存值 → 更新为新值，返回 true
期望值 != 内存值 → 不更新，返回 falseABA 问题：
线程 1 读取 A，线程 2 把 A 改成 B 再改回 A，线程 1 CAS 成功但数据其实变过。
解决：
AtomicStampedReference，加版本号。
---
三、JVM
18. JVM 内存结构？
区域
作用
线程
GC

堆
对象实例
共享
主要区域

栈
方法调用、局部变量
私有
不 GC

方法区
类信息、常量
共享
Full GC

程序计数器
当前指令地址
私有
不 GC

本地方法栈
Native 方法
私有
不 GC

堆内存划分：
• 新生代（Young）：Eden + Survivor0 + Survivor1（8:1:1）
• 老年代（Old）
---
19. GC Roots 有哪些？
1. 虚拟机栈中的局部变量
2. 方法区的静态变量
3. 方法区的常量引用
4. 本地方法栈中的 JNI 引用
5. synchronized 锁定的对象
可达性分析：
从 GC Roots 出发，不可达的对象就是垃圾。
---
20. GC 算法？
算法
原理
优点
缺点

标记-清除
标记垃圾后清除
简单
碎片

复制
存活对象复制到另一块
无碎片
空间浪费

标记-整理
标记后整理到一端
无碎片
效率低

分代收集：
• 新生代：复制算法（对象存活率低）
• 老年代：标记-清除/标记-整理
---
21. Minor GC 和 Full GC？
类型
触发条件
范围
速度

Minor GC
Eden 满
新生代
快

Full GC
老年代满/方法区满/System.gc()
全堆
慢

对象进入老年代：
1. 年龄到达阈值（默认 15）
2. 大对象直接进老年代
3. Survivor 空间不足
---
22. 双亲委派机制？
加载顺序：
Bootstrap ClassLoader（启动类加载器）
    ↑
Extension ClassLoader（扩展类加载器）
    ↑
Application ClassLoader（应用类加载器）
    ↑
自定义 ClassLoader流程：
先委托父加载器加载，父加载器无法加载时才自己加载。
好处：
1. 避免类重复加载
2. 保证核心类安全（如 java.lang.String 不会被篡改）
---
四、Android 基础
23. Activity 生命周期？
onCreate → onStart → onResume → [运行中]
    → onPause → onStop → onDestroy方法
时机
常见操作

onCreate
创建
初始化、setContentView

onStart
可见
-

onResume
可交互
恢复资源、注册监听

onPause
部分可见
释放资源、停止动画

onStop
不可见
保存数据

onDestroy
销毁
释放所有资源

追问：横竖屏切换？
默认会销毁重建：onPause → onStop → onDestroy → onCreate → onStart → onResume
配置 android:configChanges="orientation|screenSize" 后只调用 onConfigurationChanged。
追问：A 启动 B，生命周期顺序？
A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop
追问：B 返回 A？
B.onPause → A.onRestart → A.onStart → A.onResume → B.onStop → B.onDestroy
追问：A 启动透明/Dialog 主题的 B？
A.onPause → B.onCreate → B.onStart → B.onResume
（A 不会调 onStop，因为仍部分可见）
追问：Activity 启动模式？
模式
特点
场景

standard
每次创建新实例
默认

singleTop
栈顶复用，调 onNewIntent
通知跳转、防重复点击

singleTask
栈内复用，清除其上所有
首页、登录页

singleInstance
独占任务栈
来电界面、系统应用

追问：singleTop 生命周期？
场景 1：A 在栈顶，再启动 A（singleTop）
A.onPause → A.onNewIntent → A.onResume不会创建新实例，直接复用。
场景 2：栈是 A → B，启动 A（singleTop）
B.onPause → A.onCreate → A.onStart → A.onResume → B.onStopA 不在栈顶，创建新实例，栈变成 A → B → A。
追问：singleTask 生命周期？
场景 1：栈是 A → B → C，启动 A（singleTask）
C.onPause → B.onDestroy → C.onDestroy → A.onNewIntent → A.onRestart → A.onStart → A.onResumeA 在栈内，清除 B、C，复用 A。
场景 2：栈是 A → B，启动 C（singleTask，不在栈内）
B.onPause → C.onCreate → C.onStart → C.onResume → B.onStop正常创建 C。
追问：onNewIntent 注意事项？
• getIntent() 返回的还是旧 Intent
• 需要调用 setIntent(intent) 更新
@Override
protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);  // 更新 Intent
    // 处理新数据
}追问：onSaveInstanceState 什么时候调用？
• 系统可能销毁 Activity 前调用（旋转、内存不足、跳转）
• onPause 之后，onStop 之前或之后（版本差异）
• 用户主动销毁（返回键）不调用
@Override
protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    outState.putString("key", value);
}

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (savedInstanceState != null) {
        value = savedInstanceState.getString("key");
    }
}追问：任务栈相关 Flag？
Flag
效果

FLAG_ACTIVITY_NEW_TASK
新任务栈启动（singleTask 效果）

FLAG_ACTIVITY_SINGLE_TOP
栈顶复用（singleTop 效果）

FLAG_ACTIVITY_CLEAR_TOP
清除目标之上的 Activity

FLAG_ACTIVITY_CLEAR_TASK
清空任务栈（需配合 NEW_TASK）

常用组合：
// 回到首页并清空栈
intent.setFlags(FLAG_ACTIVITY_CLEAR_TOP | FLAG_ACTIVITY_SINGLE_TOP);

// 登录成功后清空栈启动主页
intent.setFlags(FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_CLEAR_TASK);---
24. Fragment 生命周期？
onAttach → onCreate → onCreateView → onViewCreated → onActivityCreated
→ onStart → onResume → [运行中]
→ onPause → onStop → onDestroyView → onDestroy → onDetach注意点：
• getActivity() 可能为 null（已 detach）
• Fragment 重叠问题：用 savedInstanceState 判断
---
25. Service 生命周期？
startService：
onCreate → onStartCommand → [运行中] → onDestroy
bindService：
onCreate → onBind → [运行中] → onUnbind → onDestroy
混合使用：
先 start 再 bind，必须同时 stopService 和 unbindService 才会销毁。
---
26. Handler 原理？（必考）
核心组件：
• Handler：发送和处理消息
• Message：消息载体
• MessageQueue：消息队列（优先队列，按 when 排序）
• Looper：循环取消息
流程：
1. Handler.sendMessage() 把 Message 放入 MessageQueue
2. Looper.loop() 死循环从 MessageQueue 取消息
3. 调用 msg.target.dispatchMessage() 处理消息
4. 最终回调到 Handler.handleMessage()
追问：子线程能更新 UI 吗？
不能。ViewRootImpl.checkThread() 会检查当前线程是否是创建 ViewRootImpl 的线程。
但在 onCreate 中可以，因为 ViewRootImpl 还没创建。
追问：Handler 内存泄漏？
非静态内部类持有外部 Activity 引用，Message 持有 Handler 引用。
如果 Message 还在队列中，Activity 无法回收。
解决：
5. 静态内部类 + 弱引用
6. onDestroy 中 removeCallbacksAndMessages(null)
追问：Handler如何保证MessageQueue并发访问安全？
答：循环加锁，配合阻塞唤醒机制。
追问：主线程为什么不用初始化Looper？
答：因为应用在启动的过程中就已经初始化主线程Looper了
---
27. ANR 原因和排查？
超时时间：
类型
超时

按键/触摸
5s

BroadcastReceiver
前台 10s / 后台 60s

Service
前台 20s / 后台 200s

常见原因：
1. 主线程 IO 操作
2. 主线程做耗时计算
3. 死锁
4. Binder 对端阻塞
排查：
5. 查看 /data/anr/traces.txt
6. adb bugreport
7. StrictMode 检测
---
28. View 绘制流程？
三大流程：
measure（测量大小）→ layout（确定位置）→ draw（绘制内容）MeasureSpec：
• EXACTLY：精确值（match_parent / 具体 dp）
• AT_MOST：最大不超过（wrap_content）
• UNSPECIFIED：不限制
追问：wrap_content 为什么不生效？
自定义 View 默认 onMeasure 把 AT_MOST 当 EXACTLY 处理。
需要重写 onMeasure 处理 wrap_content 情况。
draw 流程：
1. drawBackground（背景）
2. onDraw（自身内容）
3. dispatchDraw（子 View）
4. onDrawForeground（前景、滚动条）
---
1、 Activity、PhoneWindow、DecorView、ViewRootImpl 之间的关系？
• PhoneWindow：是Activity和View交互的中间层，帮助Activity管理View。
• DecorView：是所有View的最顶层View，是所有View的parent。
• ViewRootImpl：用于处理View相关的事件，比如绘制，事件分发，也是DecorView的parent。
---
2、四者的创建时机？
• Activity创建于performLaunchActivity方法中，在startActivity时候触发。
• PhoneWindow，同样创建于performLaunchActivity方法中，再具体点就是Activity的attach方法。
• DecorView，创建于setContentView->PhoneWindow.installDecor。
• ViewRootImpl，创建于handleResumeActivity方法中，最后通过addView被创建。
---

3、View的第一次绘制发生在什么时候？
• 第一次绘制就是发生在handleResumeActivity方法中，通过addView方法，创建了ViewRootImpl，并调用了其setView方法。
• 最后调用到requestLayout方法开始了布局、测量、绘制的流程。
---
4、线程更新UI导致崩溃的原因？
• 在触发绘制方法requestLayout中，有个checkThread方法：
void checkThread() {
        if (mThread != Thread.currentThread()) {
            throw new CalledFromWrongThreadException(
                    "Only the original thread that created a view hierarchy can touch its views.");
        }
    }其中对mThread和当前线程进行了比较。而mThread是在ViewRootImpl实例化的时候赋值的。
所以崩溃的原因就是 view被绘制到界面时候的线程（也就是ViewRootImpl被创建时候的线程）和进行UI更新时候的线程不是同一个线程。
5、Activity、Dialog、PopupWindow、Toast 与Window的关系
这是扩展的一题，简单的从创建方式的角度来说一说：
Activity。在Activity创建过程中所创建的PhoneWindow，是层级最小的Window，叫做应用Window，层级范围1-99。（层级范围大的Window可以覆盖层级小的Window）
Dialog。Dialog的显示过程和Activity基本相同，也是创建了PhoneWindow，初始化DecorView,并将Dialog的视图添加到DecorView中，最终通过addView显示出来。
但是有一点不同的是，Dialog的Window并不是应用窗口，而是子窗口，层级范围1000-1999，子Window的显示必须依附于应用窗口，也会覆盖应用级Window。这也就是为什么Dialog传入的上下文必须为Activity的Context了。
PopupWindow。PopupWindow的显示就有所不同了，它没有创建PhoneWindow，而是直接创建了一个View（PopupDecorView），然后通过WindowManager的addView方法显示出来了。
没有创建PhoneWindow，是不是就跟Window没关系了呢？
并不是，其实只要是调用了WindowManager的addView方法，那就是创建了Window，跟你有没有创建PhoneWindow无关。View就是Window的表现形式，只不过PhoneWindow的存在让Window形象更立体了一些。
所以PopupWindow也是通过Window展示出来的，而它的Window层级属于子Window，必须依附与应用窗口。
Toast。Toast和PopupWindow比较像，没有新建PhoneWindow，直接通过addView方法显示View即可。不同的是它属于系统级Window,层级范围2000-2999，所以无须依附于Activity。
四个比较下来，可以发现，只要想显示View，就会涉及到WindowManager的addView方法，也就用到了Window这个概念，然后会根据不同的分层依次显示覆盖到界面上。
不同的是，Activity和Dialog涉及到了布局比较复杂，还会有布局主题等元素，所以用到了PhoneWindow进行一个解耦，帮助他们管理View。而PopupWindow和Toast结构比较简单，所以直接新建一个类似DecorView的View，通过addView显示到界面。
6、为什么限制在应用间共享文件
打个比方，应用A有一个文件，绝对路径为file:///storage/emulated/0/Download/photo.jpg
现在应用A想通过其他应用来完成一些需求，比如拍照，就把他的这个文件路径发给了照相应用B，然后应用B照完相就把照片存储到了这个绝对路径。
看起来似乎没有什么问题，但是如果这个应用B是个“坏应用”呢？
泄漏了文件路径，也就是应用隐私。
如果这个应用A是“坏应用”呢？
自己可以不用申请存储权限，利用应用B就达到了存储文件的这一危险权限。
可以看到，这个之前落伍的方案，从自身到对方，都是不太好的选择。
所以Google就想了一个办法，把对文件的访问限制在应用内部。
如果要分享文件路径，不要分享file:// URI这种文件的绝对路径，而是分享content:// URI，这种相对路径，也就是这种格式：content://com.jimu.test.fileprovider/external/photo.jpg
然后其他应用可以通过这个绝对路径来向文件所属应用 索要 文件数据，所以文件所属的应用本身必须拥有文件的访问权限。
也就是应用A分享相对路径给应用B，应用B拿着这个相对路径找到应用A，应用A读取文件内容返给应用B。
7、介绍下FileProvider
涉及到应用间通信的问题，还记得IPC的几种方式吗？
文件
AIDL
ContentProvider
Socket
等等。
从易用性，安全性，完整度等各个方面考虑，Google选择了ContentProvider为这次限制应用分享文件的 解决方案。于是，FileProvider诞生了。
具体做法就是：
<!-- 配置FileProvider-->

<provider
    android:name="androidx.core.content.FileProvider"
    android:authorities="${applicationId}.provider"
    android:exported="false"
    android:grantUriPermissions="true">
    <meta-data
        android:name="android.support.FILE_PROVIDER_PATHS"
        android:resource="@xml/provider_paths"/>
</provider>

<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="external" path="."/>
</paths>//修改文件URL获取方式

Uri photoURI = FileProvider.getUriForFile(context, context.getApplicationContext().getPackageName() + ".provider", createImageFile());这样配置之后，就能生成content:// URI，并且也能通过这个URI来传输文件内容给外部应用。
FileProvider这些配置属性也就是ContentProvider的通用配置：
android:name，是ContentProvider的类路径。
android:authorities，是唯一标示，一般为包名+.provider
android:exported，表示该组件是否能被其他应用使用。
android:grantUriPermissions，表示是否允许授权文件的临时访问权限。
其中要注意的是android:exported正常应该是true，因为要给外部应用使用。
但是FileProvider这里设置为false，并且必须为false。
这主要为了保护应用隐私，如果设置为true，那么任何一个应用都可以来访问当前应用的FileProvider了，对于应用文件来说肯定是不可取的，所以Android7.0以上会通过其他方式让外部应用安全的访问到这个文件，而不是普通的ContentProvider访问方式，后面会说到。
当然，也正是因为这个属性为true，所以在Android7.0以下，Android默认是将它当成一个普通的ContentProvider，外部无法通过content:// URI来访问文件。所以一般要判断下系统版本再确定传入的Uri到底是File格式还是content格式。
8、Service与子线程
关于Service，我的第一反应是运行在后台的服务。
关于后台，我的第一反应又是子线程。
那么Service和子线程到底是什么关系呢？
Service有两个比较重要的元素：
长时间运行。Service可以在Activity被销毁，程序被关闭之后都可以继续运行。
不提供界面的应用组件。这其实解释了后台的意义，Service的后台指的是不和界面交互，不依赖UI元素。
而且比较关键的点是，Service也是运行在主线程之中。
所以运行在后台的Service和运行在后台的线程区别还是挺大的。
首先，所运行的线程不同。Service还是运行在主线程，而子线程肯定是开辟了新的线程。
其次，后台的概念不同。Service的后台指的是不与界面交互，子线程的后台指的是异步运行。
最后，Service作为四大组件之一，控制它也更方便，只要有上下文就可以对其进行控制。
当然，虽然两者概念不同，但是还是有很多合作之处。
Service作为后台运行的组件，其实很多时候也会被用来做耗时操作，那运行在主线程的Service肯定不能直接进行耗时操作，这就需要子线程了。
开启一个后台Service，然后在Service里面进行子线程操作，这样的结合给项目带来的可能性就更大了。
Google也是考虑到这一点，设计出了IntentService这种已经结合好的组件供我们使用。
9、后台和前台Service
这就涉及到Service的分类了。
如果从是否无感知来分类，Service可以分为前台和后台。前台Service会通过通知的方式让用户感知到，后台有这么一个玩意在运行。
比如音乐类APP，在后台播放音乐的同时，可以发现始终有一个通知显示在前台，让用户知道，后台有一个这么音乐相关的服务。
在Android8.0，Google要求如果程序在后台，那么就不能创建后台服务，已经开启的后台服务会在一定时间后被停止。
所以，建议使用前台Service，它拥有更高的优先级，不易被销毁。使用方法如下：
startForegroundService(intent);

    public void onCreate() {
        super.onCreate();
        Notification notification = new Notification.Builder(this)
                .setChannelId(CHANNEL_ID)
                .setContentTitle("主服务")//标题
                .setContentText("运行中...")//内容
                .setSmallIcon(R.mipmap.ic_launcher)
                .build();
        startForeground(1,notification);
    }  

    <!--android 9.0上使用前台服务，需要添加权限-->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />那后台任务该怎么办呢？官方建议使用 JobScheduler 。

29. 事件分发机制？
• 三个方法：
• dispatchTouchEvent：分发
• onInterceptTouchEvent：拦截（ViewGroup 独有）
• onTouchEvent：处理
流程（U 型）：
Activity.dispatchTouchEvent
    ↓
ViewGroup.dispatchTouchEvent
    ↓
ViewGroup.onInterceptTouchEvent
    ↓（不拦截）
View.dispatchTouchEvent
    ↓
View.onTouchEvent
    ↓（不消费，向上传）
ViewGroup.onTouchEvent
    ↓
Activity.onTouchEvent核心结论：
• 返回 true：消费事件，不再传递
• 返回 false：不消费，传给上级
• onInterceptTouchEvent 返回 true：拦截，自己处理
---
30. RecyclerView 缓存机制？
四级缓存：
级别
名称
说明

1
mAttachedScrap
屏幕内，直接复用

2
mCachedViews
刚移出屏幕，默认 2 个，直接复用

3
ViewCacheExtension
自定义缓存

4
RecycledViewPool
按 ViewType 缓存，需重新绑定

优化：
• setHasFixedSize(true)
• setItemViewCacheSize()
• 共享 RecycledViewPool
• DiffUtil
---
31.Context的理解
1. 上下文环境  四大组件中的获取方式
Context可以做什么，为什么如此重要？
操作文件，操作数据库等，通过context.根据提示就可以看到
context中定义了四大组件必须的操作方法，startActivity ,startService,bindService等，
1、资源访问，字符串，颜色，尺寸等资源；
2、加载布局文件；
3、组件交互【1.启动四大组件 2.获取系统服务】；
4、数据存储与访问【getFileInput   getSharePreferences】;
5、组件生命周期的管理
32.什么是进程 什么是线程
进程：Android系统控制的最小单元 进程progress
线程：应用/cup控制的最小单元 线程Thread
33.Binder
34.Glide
功能强大且广泛应用于Android开发的图片加载框架；
特点：
• 高效的加载与缓存机制
     内存缓存 LruCache，根据设备的内存情况自动调整缓存大小，优先保留最近使用的图片，当内存不足时，自动删除长时间未使用的图片，避免了内存溢出。
     磁盘缓存 减少重复的网络请求，提高效率，尤其是网络不佳的时候
• 支持多种图片格式与来源
     静态图片和Gif动态图片
     本地的，网络的，sdk的，文件系统，相册
• 灵活的图片变换与处理
     裁剪，缩放，旋转等。
     自定义处理
• 生命周期跟随组件，防止内存泄露

Jpg
Png
Webp

压缩原理
有损压缩算法
无损压缩算法，基于LZ77派生算法
支持有损和无损压缩算法

图像质量与文件大小
降低
基本不变
比它们都小

透明图支持
不支持
支持 完全透明和半透明
都支持，且保证效果的同时，减小文件体积

兼容性
极佳
很好
旧的浏览期不支持，逐渐提高

使用场景
色彩丰富的图片
需要透明度的图像
对文件大小敏感且兼容性允许

五、性能优化
31. 内存泄漏常见场景？
场景
原因
解决

Handler
持有 Activity 引用
静态 + 弱引用

单例
持有 Context
用 ApplicationContext

静态变量
持有 View/Activity
及时置 null

匿名内部类
持有外部类引用
改静态内部类

资源未关闭
Cursor/Stream/Bitmap
finally 关闭

 注册未反注册
广播/监听器
onDestroy 反注册

WebView
内核问题
独立进程

检测工具：
• LeakCanary
• Android Profiler
• MAT
---
32. 启动优化？
启动类型：
• 冷启动：进程不存在，最慢
• 热启动：进程存在，Activity 在后台
• 温启动：进程存在，Activity 被销毁
优化手段：
方法
说明

懒加载
非必要不在 Application 初始化

异步初始化
子线程初始化不依赖主线程的 SDK

延迟初始化
IdleHandler 空闲时初始化

启动器
拓扑排序处理依赖关系

预加载
闪屏页预加载首页数据

减少布局层级
加快 View 创建

---
33. 布局优化？
方法
说明

减少层级
ConstraintLayout 替代嵌套

merge
消除冗余 ViewGroup

ViewStub
延迟加载

include
复用布局

避免过度绘制
移除不必要背景

工具：
• Layout Inspector
• Hierarchy Viewer
• GPU 过度绘制
---
34. 卡顿优化？
原因：
主线程 16ms 内未完成绘制（60fps）
检测：
• Choreographer.FrameCallback
• BlockCanary
• Systrace
• TraceView
优化：
1. 耗时操作移到子线程
2. 减少布局层级
3. 避免频繁 GC（内存抖动）
4. 减少主线程 IO
---
六、架构
35. MVC、MVP、MVVM 区别？
架构
特点
缺点

MVC
View 和 Model 耦合
Activity 臃肿

MVP
Presenter 中转，View 接口化
接口多，Presenter 臃肿

MVVM
ViewModel + 数据绑定
学习成本，调试难

MVVM 核心：
• ViewModel：持有数据，生命周期感知
• LiveData：可观察数据，生命周期感知
• DataBinding/ViewBinding：UI 绑定
---
36. Jetpack ViewModel 原理？
生命周期：
ViewModel 在 Activity 配置变化（旋转）时不销毁，直到 Activity 真正 finish。
原理：
1. ViewModelStore 存储 ViewModel
2. 配置变化时，Activity 通过 NonConfigurationInstances 保存 ViewModelStore
3. 新 Activity 从 NonConfigurationInstances 恢复
---
37. LiveData 原理？
特点：
• 生命周期感知，自动取消订阅
• 只在 STARTED/RESUMED 时通知
• 粘性事件（新订阅者会收到最新值）
原理：
1. observe() 时包装成 LifecycleBoundObserver
2. setValue() 时遍历观察者，检查生命周期状态
3. 只通知 STARTED 以上的观察者
---
七、网络
38. OkHttp 原理？
核心：拦截器链
应用拦截器
    ↓
RetryAndFollowUpInterceptor（重试/重定向）
    ↓
BridgeInterceptor（添加请求头）
    ↓
CacheInterceptor（缓存）
    ↓
ConnectInterceptor（建立连接）
    ↓
网络拦截器
    ↓
CallServerInterceptor（发送请求）连接池：
• 默认 5 个空闲连接，5 分钟超时
• 复用 TCP 连接，减少握手
---
39. Retrofit 原理？
核心：动态代理 + 注解解析
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build();

ApiService service = retrofit.create(ApiService.class);流程：
1. create() 返回动态代理对象
2. 调用方法时，解析注解生成 ServiceMethod
3. ServiceMethod 创建 OkHttp Call
4. Converter 处理请求/响应
---
八、项目难点模板
结构：背景 → 问题 → 方案 → 结果
示例 1：启动优化
项目启动时间较长，用户反馈体验差。
分析发现 Application 中初始化了 10+ SDK，全在主线程。
方案：按依赖关系分类，必须主线程的保留，其他用线程池异步初始化，还有一些用 IdleHandler 延迟。
结果：冷启动时间从 3s 降到 1.2s。
示例 2：内存泄漏
LeakCanary 报 Activity 泄漏。
排查发现是单例持有了 Activity Context。
方案：改为 ApplicationContext，同时梳理了项目中所有单例的 Context 使用。
结果：泄漏消除，内存占用下降 15%。
示例 3：列表卡顿
RecyclerView 滑动掉帧。
Systrace 发现 onBindViewHolder 耗时 30ms+，主要是图片处理和布局复杂。
方案：图片改异步加载 + 缓存，布局用 ConstraintLayout 减少层级，共享 RecycledViewPool。
结果：帧率从 45fps 提升到 58fps。