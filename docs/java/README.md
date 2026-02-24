# Java 技术体系完整知识地图（工程实战版）

目标：构建「体系化 + 企业级 + 高并发 + 架构型」Java 能力  
适用人群：Java 初级 → 中级 → 高级 → 架构师

## 文档导航

### 一、基础内功

| 文档 | 内容 |
|------|------|
| [Java 基础](/java/java-basics) | 语法、OOP、泛型、Lambda/Stream/Optional、集合、异常、record/switch/var、IO |
| [集合框架](/java/java-collections) | ArrayList/HashMap/ConcurrentHashMap 原理、扩容、红黑树、fail-fast |

### 二、JVM 与并发

| 文档 | 内容 |
|------|------|
| [JVM](/java/java-jvm) | 内存结构、类加载与双亲委派、GC 与收集器、jstack/jmap/arthas、OOM/CPU/Full GC 排查 |
| [并发编程](/java/java-concurrent) | 线程、synchronized/Lock/volatile、AQS、线程池、JMM、JUC 工具类 |
| [Java 进阶](/java/java-advanced) | 反射与代理、BIO/NIO/AIO、新特性、设计模式、序列化、面试要点 |

### 三、企业开发

| 文档 | 内容 |
|------|------|
| [Spring 全家桶](/java/java-spring) | IOC/AOP、Bean 生命周期、循环依赖、Boot 自动装配、MVC、Cloud 微服务 |
| [持久层与数据库](/java/java-persistence) | MyBatis 动态 SQL/缓存、MyBatis Plus、SQL 优化、索引、explain、事务 |
| [中间件](/java/java-middleware) | MySQL/Redis/消息队列/ES：原理、持久化、缓存问题、分布式锁、集群 |

### 四、架构与工程化

| 文档 | 内容 |
|------|------|
| [架构设计](/java/java-architecture) | 设计模式、SOLID、DDD、限流熔断降级、分布式锁与事务、微服务治理 |
| [工程化与 DevOps](/java/java-devops) | Maven/Gradle、Git、CI/CD、Docker、K8s、ELK、Prometheus、SkyWalking |
| [源码与进阶](/java/java-source-advanced) | Netty、Reactor、手写线程池/IOC/MQ、JVM 调优、Spring/MyBatis 源码、分布式原理 |

### 五、工程实践

| 文档 | 内容 |
|------|------|
| [Java 工程](/java/java-project) | 项目结构、测试、日志、配置、数据库访问、部署 |

---

## 一、Java 基础内功（地基能力）

### 1. Java 语言基础

- 面向对象：封装 / 继承 / 多态
- 接口 vs 抽象类
- 泛型（类型擦除原理）
- 注解 + 反射
- Lambda / Stream API
- Optional
- 异常体系
- Java 新特性（record / switch 表达式 / var）

### 2. 集合框架（必须精通）

**常用集合**：ArrayList、LinkedList、HashSet、TreeSet、HashMap、LinkedHashMap、ConcurrentHashMap

**核心原理**：HashMap 数组+链表+红黑树、扩容机制、负载因子、fail-fast、线程安全集合实现

**必会问题**：HashMap put 过程？1.8 为什么引入红黑树？ConcurrentHashMap 如何保证线程安全？

### 3. JVM（高级工程师核心）

**内存结构**：堆、栈、方法区/元空间、程序计数器

**核心知识**：类加载机制（双亲委派）、GC 原理、垃圾回收算法、CMS / G1 / ZGC

**调优工具**：jstack、jmap、jvisualvm、arthas

**必备能力**：OOM 排查、CPU 100% 排查、Full GC 频繁定位

### 4. 并发编程（非常重要）

**基础**：线程创建、synchronized、Lock、volatile、CAS

**进阶**：AQS、线程池原理、CompletableFuture、ConcurrentHashMap、JMM 内存模型

**并发工具类**：CountDownLatch、CyclicBarrier、Semaphore、ThreadLocal

**必会问题**：线程池参数怎么设计？volatile 的作用？synchronized 和 Lock 区别？

---

## 二、Spring 全家桶（企业标配）

### 1. Spring Core

IOC 原理、AOP 原理、Bean 生命周期、循环依赖、动态代理（JDK / CGLIB）

### 2. Spring Boot

自动装配原理、starter 机制、配置加载流程、Actuator 监控

### 3. Spring MVC / WebFlux

请求处理流程、HandlerMapping、拦截器 vs 过滤器、异步请求、响应式编程（Reactor）

### 4. Spring Cloud（微服务）

Nacos / Eureka、Gateway、Feign、Sentinel / Resilience4j、配置中心、链路追踪（Skywalking / Zipkin）

---

## 三、持久层与数据库

- **MyBatis**：动态 SQL、插件机制、一级/二级缓存、批量操作
- **MyBatis Plus**：CRUD 自动化、条件构造器
- **SQL 优化**：索引设计、执行计划 explain、慢查询日志

---

## 四、中间件（高薪关键）

**MySQL**：B+Tree 索引、事务 ACID、MVCC、锁机制、主从复制、分库分表

**Redis**：五大数据结构、持久化（RDB/AOF）、缓存穿透/击穿/雪崩、分布式锁、Redisson、集群模式

**消息队列**：Kafka、RocketMQ、RabbitMQ — 消息可靠性、幂等设计、顺序消息、延迟队列、重复消费处理

**Elasticsearch**：倒排索引、分词器、聚合查询、日志检索

---

## 五、架构设计能力（高级核心）

**设计思想**：设计模式（工厂/策略/责任链/模板）、SOLID 原则、DDD、分层架构

**高并发设计**：限流、熔断、降级、异步削峰、缓存架构、分布式锁、分布式事务（Seata）

**微服务治理**：服务拆分、CAP / BASE、灰度发布、蓝绿部署、零停机发布

---

## 六、工程化与 DevOps

**构建与版本**：Maven / Gradle、Git、CI/CD（Jenkins、GitLab CI）

**容器化**：Docker、Kubernetes

**日志监控**：ELK、Prometheus + Grafana、Skywalking

---

## 七、源码与进阶能力（大厂/架构方向）

Netty、Reactor、手写线程池/手写 IOC/手写 MQ、JVM 调优实战、阅读 Spring / MyBatis 源码、分布式系统原理

---

## 八、学习成长路线建议

| 阶段 | 内容 |
|------|------|
| 初级 | Java 基础、集合、SpringBoot、MyBatis、MySQL |
| 中级 | JVM、并发、Redis、MQ、微服务、Docker |
| 高级 | 架构设计、性能优化、分布式系统、源码阅读、高并发系统设计 |

---

## 九、核心能力终极目标（真正值钱）

应能独立回答：

- 10 万 QPS 怎么抗？
- 如何防止缓存雪崩？
- 如何做分布式事务？
- 如何定位线上 OOM？
- 如何设计高可用系统？

👉 能解决这些，才是高级工程师/架构师。
