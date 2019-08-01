# Android嵌套Flutter(上).md

本文记录一下Android主工程中嵌入部分Fluttter页面的实现方法。

创建一个Android工程模拟你的现有工程
为了让Android工程和Flutter工程互不干扰，这里不再以Android工程为工程的跟目录，而是让Android工程和平级的Flutter工程的公共目录作为根目录。 最终的目录结构应该是下面这样的
```
你的项目根目录（随便什么你喜欢的地方）

  ├── 原生安卓工程（Flutter2App）
  └── Flutter工程 (plugin_test)
```
所以首先在你的项目根目录下用AS创建一个新的Android原生项目，可以勾选上kotlin支持，这样更舒服。 创建完成后你会得到一个这样的结构

```
你的项目根目录（随便什么你喜欢的地方）

  └── Flutter2App
Flutter2App目录内是一个完整的Android工程
```
module模式创建Flutter工程
    接下来使用Flutter命令来创建module工程，在你的项目根目录下执行：

* $  flutter create -t module plugin_test
创建完成后你会得到一个这样的结构

```
你的项目根目录（随便什么你喜欢的地方）

  ├── Flutter2App

  └── plugin_test
```
plugin_test是一个Flutter的module工程，用来供Android项目引入

在Android工程中引入依赖


在Flutter2App这个Android工程的setting.gradle文件中追加flutter工程的引入

你的项目跟目录/Flutter2App/setting.gradle

```
include ':app'
setBinding(new Binding([gradle: this]))
evaluate(new File(
        settingsDir.parentFile,
        'Flutter2App/plugin_test/.android/include_flutter.groovy'
))
```
在app的build.gradle文件中加入工程依赖

你的项目跟目录/Flutter2App/app/build.gradle
```
dependencies {
    // 加入下面配置implementation project(':flutter')
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'com.android.support:appcompat-v7:28.0.0'
    implementation 'com.android.support.constraint:constraint-layout:1.1.3'
    testImplementation 'junit:junit:4.12'
    androidTestImplementation 'com.android.support.test:runner:1.0.2'
    androidTestImplementation 'com.android.support.test.espresso:espresso-core:3.0.2'
    implementation 'com.android.support:design:28.0.0'
}
```

使用AS打开Flutter2App工程，重新构建项目，即可成功的将Flutter加入Android工程。

在Android工程中创建Flutter的View
Flutter提供了两种方式让Android工程来引用组件，一种是View，一种是Fragment，这里选用View来进行讲解，Fragment同理。 这里我们用两种方式来引入FLutter，本质是还是是作为一个view引入布局还是将FlutterView作为Activity的根View。

以单个view引入布局
FlutterView flutterView = Flutter.createView(this, getLifecycle(), "route");
通过上面很简单的一个方法，我们就能通过Flutter创建出一个view，这个方法提供三个参数，第一个是Activity，第二个参数是一个Lifecycle对象，我们之间取Activity的lifecycle即可，第三个参数是告诉Flutter我们要创建一个什么样的view，这个字符串参数可以在Flutter工程中获取得到。
创建出这个FlutterView之后就可以按常规的操作来将它加入到任何你想要的布局中去了。

以根view作为Activity
创建一个空的Activity，用Flutter创建一个View作为页面的根View：

```java
public class FlutterActivity extends AppCompatActivity {
    public static final String FlutterToAndroidCHANNEL = "com.wangzs.native2flutter";
    public static final String AndroidToFlutterCHANNEL = "com.wangzs.flutter2native";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_flutter_acticity);
        FrameLayout frameLayout = findViewById(R.id.rl_flutter);
        FlutterView flutterView = Flutter.createView(this, getLifecycle(), "route");
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
        flutterView.setLayoutParams(layoutParams);
        frameLayout.addView(flutterView, layoutParams);
        new EventChannel(flutterView, AndroidToFlutterCHANNEL)
                .setStreamHandler(new EventChannel.StreamHandler() {
                    @Override
                    public void onListen(Object o, EventChannel.EventSink eventSink) {
                        String androidParmas = "来自android原生的参数";
                        eventSink.success(androidParmas);
                    }

                    @Override
                    public void onCancel(Object o) {

                    }
                });
        new MethodChannel(flutterView, FlutterToAndroidCHANNEL).setMethodCallHandler(new MethodChannel.MethodCallHandler() {
            @Override
            public void onMethodCall(MethodCall methodCall, MethodChannel.Result result) {

                //接收来自flutter的指令oneAct
                if (methodCall.method.equals("withoutParams")) {

                    //跳转到指定Activity
                    Intent intent = new Intent(FlutterActivity.this, Main2Activity.class);
                    startActivity(intent);
                    //返回给flutter的参数
                    result.success("success");
                }
                //接收来自flutter的指令twoAct
                else if (methodCall.method.equals("withParams")) {

                    //解析参数
                    String text = methodCall.argument("flutter");
                    //带参数跳转到指定Activity
                    Intent intent = new Intent(FlutterActivity.this, Main2Activity.class);
                    intent.putExtra("test", text);
                    startActivity(intent);
                    //返回给flutter的参数
                    result.success("success");
                } else {
                    result.notImplemented();
                }
            }
        });
    }
}
```


这里我们并没有使用setContentView而是是用了addContentView这个方法，原因是这样的：

虽然FLutter的加载速度非常快，但是这个过程依然存在，在创建FLutterView之前我们先给ContentView设置了一个R.layout.activity_native布局，这个布局可以作为FlutterView加载完成之前展示给用户的界面，当然大部分情况下用户根本感知不到这个界面Flutter已经加载完成了，但我们仍需要它，因为debug模式下造成Flutter的加载速度并不是非常快，这个界面可以给开发人员看，还有就是如果没有这个界面的话在Activity的加载过程会出现一个黑色的闪屏，而这个情况对用户来说并不友好。

在Flutter工程中根据不同的route创建不同的组件
用AndroidStudio在你的项目跟目录/plugin_test打开Flutter工程，这时候AndroidStudio插件会识别到Flutter工程并以Flutter工程进行加载。

忽略掉.android和.ios文件夹之后你会发现，这个FLutter工程和完整的Flutter工程并没有任何不同，你依然能够以完整Flutter工程的流程来进行Flutter开发并启动调试，这是一个非常人性化的设计。

上面我们在原生Android工程中以View的形式调用了Flutter，而Flutter本质上是只有一个入口的，也就是main.dart文件中的main函数：

```
void main() {
  runApp(new MyApp());
}
```

我们的目的是根据原生工程的调用让Flutter生成不同的组件作为View来供原生工程使用，那么我们就可以从这个main函数来入手。

通过文档我们可以通过window的全局变量中获取到当前的routeName，这个值正是上面通过原生工程传给Flutter的标识，有了这个标识就可以简单的做判断来进行不同的组件创建了：

```dart
import 'dart:ui';
import 'package:flutter/material.dart';

void main() => runApp(new MyApp());

//根据不同的标识创建不同的组件给原生工程调用Widget _widgetForRoute(String route) {
  switch (route) {
    case 'route_input':
      return MyHomePage(title: 'Flutter Demo Home Page1');
    case 'route_create':
      return MyHomePage(title: 'Flutter Demo Home Page2');
    default:
      return MyHomePage(title: 'Flutter Demo Home Page2');
  }
}
```
让Flutter模块支持热加载
首先在Flutter目录下启动监听服务，在你的项目根目录/plugin_test下执行

flutter attach
执行后，监听服务会等待并监听debug应用中flutter的状态

然后在打开Flutter2App项目的AS中以正常方式调试运行，在真机或模拟器中运行app后并不会立即出发flutter的监听服务，当flutter的view或Fragment激活时才会触发。

当flutter的监听服务和app建立连接后，终端会出现如下输出：
```
$ flutter attach -d W8
Waiting for a connection from Flutter on vivo x21...
Done.
Syncing files to device vivo x21...                          8.7s
🔥  To hot reload changes while running, press "r". To hot restart (and rebuild state), press "R".
An Observatory debugger and profiler on  vivo x21 is available at: http://127.0.0.1:54218/
For a more detailed help message, press "h". To quit, press "q".
```

这时我们修改flutter工程中的dart代码文件，保存后在终端中点击r键即可进行热加载，R键进行热重启。

[参考链接](https://github.com/flutter/flutter/wiki/Add-Flutter-to-existing-apps)

[Demo](https://github.com/kingkadienm/Flutter2App)