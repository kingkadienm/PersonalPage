# 网络进阶

## TCP 深入

### 序号与确认

- 序号（SEQ）：本报文段首字节在字节流中的偏移，用于重组与去重。
- 确认号（ACK）：期望收到的下一字节序号；累计确认。
- 窗口：接收方通告的可接收字节数，用于流量控制。

### 重传与 RTO

- 超时重传（RTO）：未在 RTO 内收到 ACK 则重发。RTO 由 RTT 估算（如指数加权移动平均）。
- 快速重传：连续收到 3 个相同 ACK 即重传该序号，不必等超时。
- SACK：选择性确认，可告知已收到的非连续块，减少重传量。

### 拥塞控制

- 慢启动：拥塞窗口 cwnd 从 1 开始，每收到一个 ACK 翻倍，直到达到 ssthresh 或丢包。
- 拥塞避免：cwnd 线性增加（每 RTT +1）。
- 快重传 + 快恢复：收到 3 个重复 ACK 时，ssthresh = cwnd/2，cwnd = ssthresh，进入拥塞避免。
- 超时丢包：ssthresh = cwnd/2，cwnd 置 1，重新慢启动。

## HTTP 进阶

### 持久连接与管道化

- HTTP/1.1 默认 Keep-Alive，同一 TCP 连接可发多个请求。
- 管道化（pipelining）：可连续发多个请求不等响应，但易队头阻塞，实践中少用。

### 缓存

- 强缓存：Expires、Cache-Control（max-age、no-cache、no-store、private、public）。命中则 200 from cache。
- 协商缓存：Last-Modified/If-Modified-Since、ETag/If-None-Match。未变则 304。
- 建议：静态资源长 max-age + 文件名/路径带 hash；接口多用 no-cache + ETag。

### Cookie 与 Session

- Cookie：由服务端 Set-Cookie 下发，之后请求自动携带；可设 HttpOnly、Secure、SameSite、Domain、Path。
- Session：服务端存会话数据，用 session id（常放 Cookie）关联；无状态接口可用 JWT 等 token。

## HTTPS

- TLS/SSL 在应用层与传输层之间，提供加密、完整性、身份验证。
- 流程简述：客户端 ClientHello → 服务端 ServerHello + 证书 → 客户端校验证书、生成预主密钥、用证书公钥加密发送 → 双方据此得到会话密钥 → 后续数据用对称加密。
- 证书链：根 CA → 中间 CA → 站点证书；客户端需信任根 CA。
- 常见 TLS 1.2/1.3；1.3 简化握手、禁用弱算法。

## HTTP/2 与 HTTP/3

- HTTP/2：多路复用（单连接多流）、头部压缩 HPACK、服务端推送、二进制分帧。解决队头阻塞在“应用层”，但 TCP 层仍可能队头阻塞。
- HTTP/3：基于 QUIC（跑在 UDP 上），内置 TLS、连接迁移、每流独立，减少 TCP 队头阻塞影响。

## WebSocket

- 全双工、长连接，适用实时推送、聊天、游戏。
- 握手：HTTP 请求带 Upgrade: websocket、Connection: Upgrade、Sec-WebSocket-Key，服务端返回 101 + Sec-WebSocket-Accept。
- 之后为二进制帧：文本/二进制/关闭/ping/pong 等；可带掩码（客户端→服务端）。

## 网络安全要点

- XSS：注入脚本，窃取 Cookie 或篡改页面。防护：输出转义、CSP、HttpOnly Cookie。
- CSRF：跨站伪造请求。防护：SameSite Cookie、CSRF Token、校验 Referer/Origin。
- 中间人：HTTPS 防窃听与篡改；证书钉扎在移动端可加强。
- SQL 注入：参数化查询/ORM，避免拼接 SQL。
- DDoS：流量清洗、限流、CDN、扩容；应用层限流与熔断。

## 跨域与 CORS

- 同源：协议 + 域名 + 端口相同。不同源即跨域，浏览器会限制脚本访问响应（除非 CORS）。
- CORS：服务端响应 Access-Control-Allow-Origin（或 *）、Allow-Methods、Allow-Headers、Allow-Credentials。预检请求（OPTIONS）由浏览器自动发。
- JSONP：通过 `<script>` 跨域加载，仅 GET，逐渐被 CORS 替代。

## 抓包与调试

- Wireshark 过滤：`tcp.port == 443`、`http`、`ip.addr == 1.2.3.4`。
- HTTPS：导入浏览器/系统证书或 mitmproxy/Fiddler 代理解密（需安装 CA）。
- Chrome DevTools：Network 看瀑布图、Waterfall、Priority；Performance 看加载与长任务。

## 性能与优化

- 减少请求：合并资源、雪碧图、内联关键 CSS/JS。
- 压缩：gzip/brotli 响应体；HTTP/2 头部压缩。
- CDN：边缘节点缓存与回源，降低 RTT。
- DNS 预解析：`<link rel="dns-prefetch">`、preconnect。
- 长连接与 HTTP/2：复用连接，减少握手与队头阻塞影响。
