# Flutter进阶

## 状态管理

### Provider

- ChangeNotifier + ChangeNotifierProvider；Consumer、context.watch/read/select。
- 多 Provider 组合；ProxyProvider 依赖其他 Provider。
- 适合中小型应用、局部状态与全局状态混合。

### Riverpod

- Provider 定义不依赖 BuildContext；ref.watch/read/listen；自动依赖与测试友好。
- StateProvider、FutureProvider、StreamProvider；family、autoDispose。
- 适合需要强依赖注入与可测试性的项目。

### Bloc / Cubit

- 事件 → Bloc → 状态；单一职责、可预测、易测试。
- BlocBuilder、BlocListener、BlocConsumer；mapEventToState、emit。
- 适合复杂业务流与多步骤交互。

### GetX

- 响应式变量、依赖注入、路由、国际化一体；语法简洁但需注意与 Flutter 生命周期的配合。
- 适合快速原型或偏好“全家桶”的团队。

## 路由与导航

- Navigator.push/pop；命名路由 MaterialApp(routes: ...)；onGenerateRoute 做参数传递。
- Go Router：声明式路由、深链、嵌套、redirect；适合中大型应用。
- 传参：构造函数、ModalRoute.of(context).settings.arguments、路由表里封装。

## 网络与本地存储

- http、dio（拦截器、取消、超时、FormData）；反序列化 json_serializable、freezed。
- shared_preferences、path_provider + 文件；sqflite/hive 做本地库；secure_storage 存敏感信息。

## 性能优化

- const 构造函数与 const 组件树，减少重建。
- ListView.builder（懒加载）；RepaintBoundary 隔离重绘；避免在 build 里创建大对象或回调。
- 图片：cached_network_image、合适分辨率、precacheImage；大图考虑解码与裁剪。
- 包体积：--split-debug-info、--obfuscate；分析工具查看大 so 与资源。

## 平台通道与插件

- MethodChannel：Flutter 与原生（Android/iOS）互调；InvokeMethod、setMethodCallHandler。
- EventChannel：原生向 Flutter 推流；适合持续事件。
- 开发插件：flutter create --template=plugin；实现平台端 API 与 Dart 端封装。

## 测试

- 单元测试：test 包；mockito 模拟依赖；ViewModel/逻辑类测试。
- Widget 测试：testWidgets、Finder、WidgetTester；pump、tap、expect。
- 集成测试：IntegrationTest；真机或模拟器上跑完整流程。

## 国际化与主题

- intl、flutter_localizations；Arb 文件与 l10n 生成；MaterialApp localizationsDelegates、supportedLocales。
- ThemeData、ColorScheme、TextTheme；Dark theme；子组件通过 Theme.of(context) 获取。

## 最佳实践小结

- 组件拆分与复用；状态管理选型一致；路由清晰、深链可测。
- 错误处理与加载/空状态统一；网络层封装、重试与缓存策略。
- 可访问性（语义、字体缩放、对比度）；性能与包体积持续关注。
- 代码规范（lint）、文档与注释；版本与依赖管理（pub、版本号）。
