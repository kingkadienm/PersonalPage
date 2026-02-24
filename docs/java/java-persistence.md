# 持久层与数据库

## MyBatis

### 基本使用

- 接口 + XML/注解 映射 SQL；SqlSessionFactory 由配置构建；SqlSession 执行语句。与 Spring 集成：SqlSessionFactoryBean、MapperScan 扫描 Mapper 接口。

### 动态 SQL

- \<if\>、\<choose/\>when/otherwise、\<where\>、\<set\>、\<foreach\>、\<trim\>。避免拼接导致语法错误与注入；OGNL 表达式。

### 插件机制

- 拦截器 Interceptor；可拦截 Executor、StatementHandler、ParameterHandler、ResultSetHandler。实现 Interceptor，@Intercepts 指定签名；常用于分页、审计、加解密。

### 一级缓存与二级缓存

- **一级**：SqlSession 级别；同一 Session 内相同查询走缓存；增删改会清空该 Session 缓存；默认开启。
- **二级**：Mapper 命名空间级别；跨 SqlSession；需显式开启，并实现序列化；集群需考虑分布式缓存。生产常关二级，用 Redis 等替代。

### 批量操作

- ExecutorType.BATCH；foreach 拼 insert（注意 SQL 长度与占位符限制）；或 BatchExecutor 提交多条语句。

### #{} 与 ${}

- #{} 预编译占位符，防注入；${} 字符串替换，有注入风险，仅用于动态表名/列名等且需校验。

## MyBatis Plus

- 基于 MyBatis，增强不改变结构。BaseMapper 提供 insert/selectById/updateById/delete 等；Wrapper 条件构造（QueryWrapper、LambdaQueryWrapper、UpdateWrapper）。
- 分页：PaginationInnerInterceptor；逻辑删除：@TableLogic。代码生成器可生成 entity/mapper/service。

## SQL 优化

### 索引设计

- 区分度高的列、常查常排常分组的列；联合索引注意最左前缀；避免过多索引（写代价、空间）。
- 覆盖索引避免回表；索引下推减少回表次数。

### 执行计划 explain

- type：const/ref/range/index/all，越前越好；possible_keys、key、rows、Extra（Using index、Using filesort、Using temporary 等）。关注是否走索引、是否全表、是否临时表/排序。

### 慢查询日志

- 开启 slow_query_log、设置 long_query_time；分析慢 SQL，加索引、改写法、拆库表。

### 常见优化点

- 避免 SELECT *；避免在索引列上函数/运算；避免隐式类型转换；小表驱动大表（in/exists 视数据量）；分页大偏移用延迟关联或游标。

## 事务（Spring）

- @Transactional：声明式；传播行为（REQUIRED、REQUIRES_NEW、NESTED 等）、隔离级别、只读、回滚规则。同一线程内同一数据源保证同一连接。方法内部自调用不经过代理，事务不生效，需注入自身或拆到另一 Bean。
