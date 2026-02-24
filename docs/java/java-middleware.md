# 中间件

## MySQL

### B+Tree 索引

- InnoDB 主键为聚簇索引，叶子存整行；二级索引叶子存主键，回表查完整行。B+ 树多路平衡、叶子有序链表，适合范围与排序。
- 最左前缀：联合索引 (a,b,c) 可支持 a、a,b、a,b,c 的查询与排序；中间断则后面列无法用索引。

### 事务 ACID

- 原子性：undo log 回滚。持久性：redo log 先写、崩溃恢复重做。隔离性：锁 + MVCC。一致性：业务约束，由前三点与应用保证。

### MVCC

- 多版本并发控制；通过 undo 链 + 行隐藏字段（DB_TRX_ID、DB_ROLL_PTR）及 Read View 判断可见性。读已提交、可重复读 通过不同 Read View 策略实现；可重复读 在 RR 下可减少幻读（当前读仍要锁）。

### 锁机制

- 行锁、间隙锁、临键锁；共享锁 S、排他锁 X。意向锁 IS/IX。加锁顺序一致防死锁。死锁检测或超时回滚。

### 主从复制

- 异步/半同步/组复制；binlog 格式 statement/row/mixed。主写 binlog，从 IO 线程拉取写 relay log，SQL 线程重放。主从延迟导致读从库可能读到旧数据，需业务容忍或强制读主。

### 分库分表

- 垂直：按业务拆库表。水平：按分片键拆库表；路由策略（取模、范围、一致性哈希）；跨库 join/聚合、分布式 ID、分布式事务需额外方案。ShardingSphere、MyCat 等中间件。

## Redis

### 五大数据结构

- **String**：缓存、计数、分布式锁；SET NX EX、INCR。
- **Hash**：对象字段；HGETALL、HINCRBY。
- **List**：列表、队列、栈；LPUSH/RPUSH、LPOP/RPOP、BRPOP 阻塞。
- **Set**：去重、交集并集；SADD、SINTER、SUNION。
- **ZSet**：有序，score；ZADD、ZRANGE、ZRANK；排行榜、延迟队列。

### 持久化

- **RDB**：快照；bgsave  fork 子进程写；恢复快，可能丢最后一次快照后的数据。
- **AOF**：追加写命令；可 fsync 每次/每秒/由系统；重写压缩。可 RDB+AOF，AOF 含 RDB 头做混合持久化。

### 缓存穿透 / 击穿 / 雪崩

- **穿透**：查不存在 key，打穿到 DB。解决：布隆过滤器、空值缓存短 TTL。
- **击穿**：热点 key 过期瞬间大量请求打 DB。解决：互斥锁（只有一个线程查 DB 并回填）、逻辑过期（不设真实过期，异步更新）。
- **雪崩**：大量 key 同时过期或 Redis 宕机，流量打垮 DB。解决：过期时间加随机、多级缓存、限流降级、集群与持久化。

### 分布式锁

- SET key value NX EX seconds；value 唯一标识，释放时校验再 DEL 或 Lua 脚本保证原子。 Redisson：看门狗续期、可重入、红锁（多实例）。

### 集群模式

- **主从**：读写分离，从只读；主挂需手动或哨兵提升。
- **哨兵**：监控、自动选主、通知客户端。
- **Cluster**：分片 16384 slot；CRC16(key)%16384 落槽；节点间 gossip；不支持跨槽命令，需 hash tag 或客户端分片。

## 消息队列

### Kafka

- 分区、副本、消费者组；高吞吐、持久化、回溯消费。Producer 可指定 key 做分区；Consumer 拉取、提交 offset。适用日志、流处理。

### RocketMQ

- Topic、Tag、顺序消息、延迟消息、事务消息。NameServer 做路由；Broker 存消息。适用订单、解耦、削峰。

### RabbitMQ

- Exchange（direct/topic/fanout/headers）+ 队列 + 绑定；消息确认、死信队列、延迟插件。适用复杂路由、企业集成。

### 消息可靠性

- 生产者：确认机制（ack）、重试、落库补偿。Broker：持久化、副本。消费者：手动 ack、幂等处理、死信与重试队列。

### 幂等设计

- 业务键去重（Redis/DB 唯一）、消息 id 去重、状态机（已处理则跳过）。

### 顺序消息

- 单分区或按 key 路由到同一分区；消费者单线程或按 key 串行处理。

### 延迟队列

- RabbitMQ 延迟插件、RocketMQ 定时消息、Redis 有序集合 + 轮询、专用延迟队列表 + 定时任务。

## Elasticsearch

### 倒排索引

- 词项 → 文档列表（含位置、频率）；全文检索先分词再查倒排，算分排序。

### 分词器

- 内置 standard、ik（中文）等；可自定义 analyzer；mapping 中指定。

### 聚合查询

- 桶聚合（terms、range、date_histogram）、指标聚合（sum、avg、min、max）、管道聚合。用于统计、多维分析。

### 日志检索

- 与 Logstash/Filebeat 配合；按时间、级别、关键词检索；Kibana 可视化。
