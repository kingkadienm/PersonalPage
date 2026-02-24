# Spring 全家桶

## Spring Core

### IOC（控制反转）

- 对象创建与依赖由容器管理，而非 new。通过 DI（依赖注入）注入依赖：构造器、setter、字段（@Autowired）。
- 容器：BeanFactory（基础）、ApplicationContext（常用，扩展了事件、资源、国际化等）。启动时读取配置/注解，创建 Bean 并维护依赖关系。

### Bean 生命周期

- 实例化 → 属性赋值 → 初始化（BeanNameAware、BeanFactoryAware、ApplicationContextAware、@PostConstruct、InitializingBean.afterPropertiesSet、init-method）→ 使用 → 销毁（@PreDestroy、DisposableBean、destroy-method）。
- 作用域：singleton（默认）、prototype、request、session、application。

### 循环依赖

- 单例 + 构造器注入：无法解决，需改 setter/字段注入。
- setter/字段注入：A 依赖 B、B 依赖 A 时，先实例化 A（未完成注入），放入三级缓存（早期引用）；再实例化 B，注入 A；B 完成后再注入到 A。三级缓存：单例池、早期引用（未完成属性注入）、ObjectFactory（用于创建早期引用，可处理 AOP 代理）。

### AOP（面向切面编程）

- 将横切逻辑（日志、事务、权限）与业务解耦。概念：切点（Pointcut）、通知（Advice：前置/后置/环绕/异常/最终）、切面（Aspect = 切点 + 通知）、织入（Weaving）。
- 实现：动态代理。若目标实现接口则默认 JDK 动态代理（基于接口）；否则 CGLIB 子类代理。可配置强制 CGLIB。

### 动态代理

- **JDK 动态代理**：Proxy.newProxyInstance(类加载器, 接口数组, InvocationHandler)；目标必须实现接口。
- **CGLIB**：生成目标子类，重写方法；不能代理 final。Spring 可配置 proxyTargetClass=true 强制 CGLIB。

## Spring Boot

### 自动装配原理

- @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan。
- @EnableAutoConfiguration 通过 @Import(AutoConfigurationImportSelector.class) 加载 META-INF/spring.factories 中 EnableAutoConfiguration 的配置类；配置类通常带 @Conditional（OnClass、OnBean、OnProperty 等），条件满足才注册 Bean。

### Starter 机制

- 一个 starter 依赖若干库 + 一个 autoconfigure 模块；autoconfigure 里提供 @Configuration 与条件 Bean；使用者只需引入 starter 即可获得默认配置与依赖。

### 配置加载流程

- 优先级（高覆盖低）：命令行 > 系统环境变量 > application-{profile}.yml > application.yml；内部按 config file > config location 等顺序。@Value、@ConfigurationProperties 绑定。

### Actuator

- 暴露监控端点：health、info、metrics、env、beans 等。启用：spring-boot-starter-actuator；可配合 Prometheus、Grafana。生产可关敏感端点或加安全。

## Spring MVC

### 请求处理流程

- DispatcherServlet 接收请求 → HandlerMapping 找 Handler → HandlerAdapter 执行 Handler 得 ModelAndView → ViewResolver 解析 View → 渲染响应。

### HandlerMapping

- 将 URL 映射到 Handler（Controller 方法）；常用 RequestMappingHandlerMapping（@RequestMapping）。

### 拦截器 vs 过滤器

- 过滤器：Servlet 规范，在 DispatcherServlet 前后都可；基于回调。
- 拦截器：Spring 提供，在 DispatcherServlet 内、Controller 前后；可拿到 Handler、ModelAndView；preHandle、postHandle、afterCompletion。

### 异步请求

- @ResponseBody + DeferredResult / CompletableFuture / WebAsyncTask；或 Servlet 3.0 异步 + Callable。适用长轮询、SSE。

## WebFlux 与 Reactor

- 响应式栈；基于 Reactor（Publisher/Subscriber）；非阻塞 IO。RouterFunction、Handler 返回 Mono/Flux。适用高并发、背压场景；与 Spring MVC 二选一或混用（如网关用 WebFlux）。

## Spring Cloud（微服务）

### 服务发现

- **Eureka**：AP；客户端拉取注册表、定时续约；服务端二级缓存、剔除过期实例。
- **Nacos**：支持 CP/AP；同时做配置中心；健康检查、权重、分组。

### 网关

- **Gateway**：基于 WebFlux；路由、断言、过滤器；可限流、鉴权、灰度。

### 远程调用

- **OpenFeign**：声明式 HTTP 客户端；集成负载均衡（LoadBalancer）、可配编码解码、日志、熔断。

### 熔断与限流

- **Sentinel**：流控、熔断、降级、热点、系统规则；控制台、规则持久化。
- **Resilience4j**：熔断、限流、重试、舱壁；与 Feign 集成。

### 配置中心

- Nacos Config、Spring Cloud Config；支持动态刷新（@RefreshScope）。

### 链路追踪

- **Sleuth**：打 traceId/spanId、注入 MDC。
- **Zipkin / SkyWalking**：收集、存储、展示调用链；SkyWalking 无侵入、支持更多中间件。
