# Java 工程

## 构建工具

### Maven

- 坐标：groupId、artifactId、version。生命周期：validate、compile、test、package、verify、install、deploy。
- 常用命令：mvn compile、mvn test、mvn package、mvn clean install、mvn dependency:tree。
- pom.xml：dependencies、dependencyManagement、parent、modules、plugins、properties。scope：compile（默认）、provided、runtime、test。
- 仓库：本地 ~/.m2/repository；中央仓库；可配 mirror、私服（Nexus）。

### Gradle

- 基于 Groovy/Kotlin DSL；增量构建、构建缓存。gradle build、gradle run、gradle test。
- build.gradle：plugins、dependencies、repositories、sourceSets、tasks。依赖：implementation、api、compileOnly、testImplementation。

## Spring 生态概要

- Spring Framework：IoC 容器（Bean 生命周期、作用域 singleton/prototype）、AOP、事务、Web MVC、数据访问集成。
- Spring Boot：自动配置、起步依赖、内嵌容器、actuator；主类 @SpringBootApplication；配置文件 application.properties/yml。
- Spring Cloud：微服务；服务发现（Eureka、Nacos）、配置中心、网关（Gateway）、负载均衡（Ribbon/LoadBalancer）、熔断（Resilience4j）、OpenFeign。
- 常用注解：@Component/@Service/@Repository/@Controller、@Autowired/@Resource、@Value、@Configuration、@Bean、@Transactional、@RequestMapping、@RequestBody、@PathVariable、@RequestParam。

## 单元测试

- JUnit 5：@Test、@BeforeEach、@AfterEach、@DisplayName、assertTrue/assertEquals/assertThrows。
- Mockito：@Mock、@InjectMocks、when().thenReturn()、verify()、ArgumentCaptor。
- 测试类命名 *Test 或 *Tests；与 src 对应目录结构放在 src/test/java。

## 日志

- 门面：SLF4J。实现：Logback（常用）、Log4j2。log.info("msg {}", arg)；避免字符串拼接，用占位符。
- 配置：logback.xml 或 logback-spring.xml；level、appender、pattern、按包/类调整级别。

## 配置与环境

- 多环境：application-{profile}.yml；spring.profiles.active=dev。敏感信息用环境变量或配置中心，不提交密钥。
- 配置注入：@Value("${key}")、@ConfigurationProperties 绑定前缀到 Bean。

## 数据库访问

- JDBC：DriverManager、Connection、Statement/PreparedStatement、ResultSet；防 SQL 注入用 PreparedStatement。
- JPA/Hibernate：ORM、实体映射、JPQL、懒加载、一级/二级缓存。
- MyBatis：XML/注解 SQL 映射、#{} 与 ${}、动态 SQL、分页插件。
- 事务：@Transactional；传播行为、隔离级别、只读、回滚规则。同一线程内保证同一连接。

## 工程结构建议

- 分层：controller、service、repository/dao、entity/dto/vo、config、util。包按功能划分。
- 分层职责：controller 入参校验与转换、调用 service；service 业务逻辑、事务边界；repository 数据访问。
- 统一返回格式、统一异常处理（@ControllerAdvice + @ExceptionHandler）、参数校验（@Valid、Bean Validation）。

## 部署与运行

- 打包：mvn package 或 gradle build；Spring Boot 打可执行 jar，java -jar 运行。
- 容器化：Dockerfile 基于 openjdk 或 eclipse-temurin；多阶段构建减小镜像；JVM 参数 -XX:+UseContainerSupport。
- 生产 JVM：-Xms 与 -Xmx 设同值避免动态扩容；根据内存设堆与元空间；GC 日志 -Xlog:gc*。
