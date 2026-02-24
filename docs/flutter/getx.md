# GetX 使用指南

GetX 是 Flutter 的一个轻量级库，集成了状态管理、路由、依赖注入、国际化等，API 简洁，适合快速开发和中小型项目。

## 依赖

```yaml
dependencies:
  get: ^4.6.6
```

```bash
flutter pub add get
```

## 入口与 MaterialApp

使用 GetMaterialApp 替代 MaterialApp，才能使用 Get 的路由、Snackbar、对话框等：

```dart
void main() {
  runApp(GetMaterialApp(
    title: 'My App',
    initialRoute: '/',
    getPages: [
      GetPage(name: '/', page: () => HomePage()),
      GetPage(name: '/detail', page: () => DetailPage()),
    ],
    home: HomePage(),
  ));
}
```

## 状态管理

### 响应式变量 Obx

通过 `.obs` 将变量变为响应式，在 `Obx(() => ...)` 中访问时，变量变化会触发重建：

```dart
final count = 0.obs;
final name = 'Tom'.obs;
final list = <int>[].obs;

Obx(() => Text('${count.value}'));
Obx(() => Text('${name.value}'));

// 修改
count.value++;
count(1);
name.value = 'Jerry';
list.add(1);
```

在 Obx 内只应读取 `.obs` 变量，避免在 Obx 里写业务逻辑。

### GetxController 与 Get.put / Get.lazyPut

把状态和逻辑放到 Controller，再注入到 GetX：

```dart
class CounterController extends GetxController {
  final count = 0.obs;

  void increment() => count++;

  @override
  void onClose() {
    // 释放资源
    super.onClose();
  }
}

// 在页面或更上层注入
final controller = Get.put(CounterController());

// 使用
Obx(() => Text('${controller.count}'));
// 或
Get.find<CounterController>().increment();
```

- `Get.put(CounterController())`：立即创建，默认单例，绑定当前路由栈。
- `Get.lazyPut(() => CounterController())`：首次 `Get.find` 时再创建。
- `Get.put(CounterController(), permanent: true)`：不随路由销毁。
- 在 Controller 里需要时可用 `Get.find<OtherController>()` 获取其它 Controller。

### GetBuilder（非响应式）

不依赖 `.obs`，需要手动 `update()` 才会刷新对应 GetBuilder：

```dart
class CounterController extends GetxController {
  int count = 0;

  void increment() {
    count++;
    update();
  }
}

Get.put(CounterController());

GetBuilder<CounterController>(
  builder: (c) => Text('${c.count}'),
)
```

适合不需要细粒度响应式、希望自己控制刷新范围的场景。

### Workers（响应式监听）

在 Controller 里监听 `.obs` 变化：

```dart
@override
void onInit() {
  super.onInit();
  ever(count, (_) => print('count changed'));
  once(count, (_) => print('count changed once'));
  debounce(searchText, (_) => search(), time: Duration(milliseconds: 500));
  interval(count, (_) => print('throttle'), time: Duration(seconds: 1));
}
```

- `ever`：每次变化都触发。
- `once`：仅第一次。
- `debounce`：防抖。
- `interval`：节流。

## 依赖注入

```dart
Get.put(Service());
Get.lazyPut(() => ApiService());
Get.putAsync<SharedPreferences>(() async {
  return await SharedPreferences.getInstance();
});

final s = Get.find<Service>();
```

- 结合 `Get.lazyPut` 和 `Get.find` 可实现按需创建。
- 在 Controller 的 `onInit` 里 `Get.put` 自己，或在页面 `Get.put(MyController())` 均可，视是否需要单例、生命周期而定。

## 路由

### 命名路由

```dart
Get.toNamed('/detail');
Get.toNamed('/detail', arguments: {'id': 1});
Get.offNamed('/home');      // 替换当前
Get.offAllNamed('/login');   // 清空栈并跳转

Get.back();
Get.back(result: 'ok');
```

### 传参与取参

```dart
Get.toNamed('/detail', arguments: {'id': 1, 'name': 'Tom'});
Get.to(DetailPage(), arguments: {'id': 1});

// 目标页
final args = Get.arguments as Map<String, dynamic>;
int id = Get.arguments['id'];
```

### 中间件

```dart
GetPage(
  name: '/admin',
  page: () => AdminPage(),
  middlewares: [
    GetMiddleware(
      redirect: (route) {
        if (!isLoggedIn) return RouteSettings(name: '/login');
        return null;
      },
    ),
  ],
)
```

## Snackbar、Dialog、BottomSheet

```dart
Get.snackbar('标题', '内容');
Get.snackbar('标题', '内容', snackPosition: SnackPosition.BOTTOM);

Get.dialog(AlertDialog(title: Text('提示')));
Get.defaultDialog(title: '标题', content: Text('内容'));

Get.bottomSheet(Container(...));
```

## 国际化（简要）

```dart
GetMaterialApp(
  translations: MyTranslations(),
  locale: Get.deviceLocale,
  fallbackLocale: Locale('zh', 'CN'),
);

// 使用
Text('key'.tr);
```

在 Map 或类中维护各语言文案，通过 `Get.locale`、`Get.updateLocale` 切换。

## 与 Flutter 生命周期

- GetX 的 Controller 默认在路由 pop 时会被 Get 删除（非 permanent 时），此时 `onClose` 会调用。
- 若在页面里 `Get.put(Controller())`，该页面销毁时该 Controller 也会被回收；若在更上层 put 且 `permanent: true`，则不会随路由销毁。
- 注意：不要在不合适的生命周期里依赖已销毁的 Controller，避免在已 dispose 的 Widget 里继续调用 Get.find。

## 最佳实践小结

- 页面级状态用 GetxController + Obx；全局单例用 `Get.put(..., permanent: true)` 或 Get.lazyPut。
- 路由统一用 GetPage 与 toNamed，便于参数和中间件。
- 简单提示用 Get.snackbar/Get.dialog；复杂 UI 仍可用 showDialog 等原生方式。
- 大项目可只选用 GetX 的路由或状态之一，与 Provider/Riverpod 等混用；团队需统一约定，避免风格混乱。
