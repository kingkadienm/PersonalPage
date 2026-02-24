# 工程化与 DevOps

## 构建与版本

### Maven

- 坐标 groupId、artifactId、version；生命周期：validate、compile、test、package、install、deploy。常用命令：mvn compile、mvn test、mvn package、mvn clean install、mvn dependency:tree。
- pom：dependencies、dependencyManagement（统一版本）、parent、modules、plugins、properties。scope：compile、provided、runtime、test。
- 仓库：本地 ~/.m2/repository；中央/阿里镜像；私服 Nexus。

### Gradle

- 基于 Groovy/Kotlin DSL；增量构建、缓存。build.gradle：plugins、dependencies、repositories、tasks。gradle build、gradle test、gradle run。

### Git

- 分支策略：Git Flow（master/develop/feature）、GitHub Flow（master + feature）、Trunk Based。commit 规范：feat/fix/docs/style/refactor/test；merge/rebase 选择；tag 发版。

## CI/CD

### Jenkins

- 流水线 Pipeline（Declarative/Scripted）；拉代码、编译、测试、构建镜像、推送仓库、部署。插件：Git、Maven、Docker、K8s、钉钉/邮件通知。

### GitLab CI

- .gitlab-ci.yml 定义 stages、jobs；Runner 执行；与代码同仓、变量与权限集成好。

## 容器化

### Docker

- 镜像：Dockerfile（FROM、RUN、COPY、ADD、ENV、EXPOSE、CMD/ENTRYPOINT）；多阶段构建减小体积。容器：run、exec、logs、stats。网络、数据卷。

### Kubernetes

- Pod、Deployment、Service、Ingress、ConfigMap、Secret、HPA。编排、自愈、扩缩容、滚动更新。kubectl、helm 包管理。

## 日志与监控

### ELK

- Elasticsearch 存储检索、Logstash/Filebeat 采集、Kibana 查询与可视化。日志规范：格式统一、 traceId、级别、结构化字段。

### Prometheus + Grafana

- Prometheus 拉取指标、PromQL 查询；Grafana 仪表盘。应用暴露 /actuator/prometheus 或自定义 metrics；告警 Alertmanager。

### SkyWalking

- 链路追踪、服务拓扑、JVM 指标；无侵入 agent；与 Spring Cloud、Dubbo、MQ、DB 集成。
