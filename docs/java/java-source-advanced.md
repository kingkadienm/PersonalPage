# 源码与进阶能力

## Netty

- 基于 NIO，事件驱动；Channel、EventLoop、ChannelPipeline、ChannelHandler（入站/出站）。ByteBuf 池化、零拷贝、堆外；编解码器。
- Reactor 模式：Boss 接受连接、Worker 处理 IO；主从多线程。适用 RPC、网关、IM、MQ 等高性能网络层。

## Reactor 模型

- 单 Reactor 单线程：accept + read/write 同一线程。单 Reactor 多线程：IO 单线程，业务交线程池。主从 Reactor 多线程：主线程 accept、子线程组处理 IO。Netty 即主从多 Reactor。

## 手写练习要点

- **手写线程池**：阻塞队列 + 固定 worker 线程；submit 返回 Future；shutdown 优雅关闭。
- **手写简易 IOC**：扫描包得 Class → 实例化 Bean → 解析 @Autowired 注入 → 放入容器；可加单例/多例、生命周期回调。
- **手写简易 MQ**：内存队列 + 主题/消费者组；生产者 push、消费者 pull 或 push；持久化可落文件/DB。

## JVM 调优实战

- 根据机器内存设 -Xms/-Xmx、-Xmn、-XX:MetaspaceSize；选收集器（G1 通用）；-XX:MaxGCPauseMillis 控停顿。观察 GC 日志与 jstat，调堆比例、新生代大小。OOM 时 dump 分析见 [JVM](/java/java-jvm)。

## 阅读 Spring / MyBatis 源码

- Spring：容器启动流程（BeanDefinition 加载、Bean 创建、依赖注入、AOP 织入）、Bean 生命周期、循环依赖解决、事务代理执行顺序。
- MyBatis：SqlSession 获取、Mapper 代理、SQL 解析与执行、缓存、插件链。

## 分布式系统原理

- 一致性协议：Paxos、Raft；选举、日志复制。分布式一致性：强一致、最终一致；2PC、3PC、TCC、Saga。
- 分布式 ID：雪花、号段、UUID。分布式会话：无状态 token、Redis 集中存储。
- 高可用：冗余、无单点、故障转移、熔断限流降级、容灾与多活思路。
