# Android进阶

## 架构模式

### MVVM

- Model：数据与业务逻辑；View：界面；ViewModel：暴露状态与命令，不持有 View 引用。
- 数据驱动：ViewModel 通过 LiveData/StateFlow 暴露 UI 状态，View 观察并更新。
- 生命周期安全：LiveData/StateFlow 与 Lifecycle 绑定，避免内存泄漏。

### Repository 模式

- 统一数据入口：本地（Room、DataStore）与远程（Retrofit）在 Repository 中聚合。
- 可做缓存策略：先内存/本地，再网络；可暴露 Flow 实现响应式。

### 依赖注入（Hilt）

- 构造注入、单例与作用域、模块与组件；便于测试与解耦。
- @Inject、@Module、@Provides、@AndroidEntryPoint、@HiltViewModel。

## Kotlin 协程

- 挂起函数：suspend；CoroutineScope（lifecycleScope、viewModelScope）；launch、async；withContext 切换调度器（Dispatchers.Main/IO/Default）。
- 取消与异常：Job.cancel、CoroutineExceptionHandler；取消会传播，需在耗时处检查 isActive 或 yield。
- Flow：冷流、collect、map、filter、flatMapConcat、stateIn/shareIn；用于替代 LiveData 做更复杂流式数据。

## Jetpack 组件

- ViewModel：配置变更存活、与 Activity/Fragment 生命周期关联。
- LiveData：可观察、生命周期感知、主线程分发；observe、observeAsState（Compose）。
- Room：DAO、Entity、Database；TypeConverter、Migration；配合 Flow 返回 Flow<List<T>>。
- WorkManager：延迟/周期/约束任务；OneTimeWorkRequest、PeriodicWorkRequest；链式与唯一工作。
- Navigation：NavHost、NavController、SafeArgs；单 Activity 多 Fragment 或 Compose 路由。
- DataStore：替代 SharedPreferences；Preferences DataStore、Proto DataStore。

## 网络与序列化

- Retrofit：接口定义、@GET/@POST、@Body/@Query/@Path；Call 或 suspend 函数；Converter（Gson/Moshi）。
- OkHttp：Interceptor（日志、鉴权、重试）；Cookie、缓存；可单独使用或作为 Retrofit 底层。
- 序列化：Gson、Moshi、kotlinx.serialization；注意 ProGuard 规则。

## 性能与优化

- 列表：RecyclerView + ViewHolder、DiffUtil、预取；避免在 onBindViewHolder 做重逻辑。
- 图片：Glide/Coil 加载、占位与错误图、缓存、缩略图与采样；大图或长列表注意内存。
- 启动：Application 与首屏精简、懒加载、异步初始化、Baseline Profile；避免主线程阻塞。
- 内存：LeakCanary 检测；避免非静态内部类持有多余引用、及时取消协程与监听。
- 包体积：minify、shrinkResources、ABI 过滤、资源与 so 优化。

## 安全与存储

- 敏感数据：EncryptedSharedPreferences、Keystore；密钥不硬编码。
- 组件导出：不需要的 Activity/Service 等设 android:exported="false"；深链与 intent-filter 需校验数据。
- 网络安全：HTTPS、证书锁定（谨慎）、不要忽略证书错误。

## 测试

- 单元测试：JUnit4/5、Mockito/MockK；ViewModel、Repository、UseCase 的纯逻辑。
- UI 测试：Espresso；Idling Resource 处理异步；必要时用 Barista 等封装。
- 测试架构：清晰分层便于 mock；依赖注入便于替换实现。

## 最佳实践小结

- 使用 Kotlin、协程、Flow、ViewModel、Repository、Hilt。
- 统一错误处理与加载/空状态；网络与缓存策略明确。
- 遵循 Material Design 与无障碍；适配深色主题与多分辨率。
- 日志与埋点规范；ProGuard 与混淆规则完整；版本与依赖管理清晰。
