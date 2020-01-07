    
# Flutter 安装配置（mac）

引言：说起mac对于我个人来说是又爱又恨，刚买不到一年的mac，主板被我玩坏了，然后无奈的送到了售后。时隔一周终于又再次拿到了我的mac，然而不幸的是换完主板，我mac的之前所有好用的，珍贵的资料没了没了没了，无奈之下只能再次安装配置该死的环境变量

，好记性不如烂笔头，想着就把安装环境、配置信息 写一篇blok，方便以后再次遇到问题直接查看而不是g.cn

[Flutter中文网](https://flutterchina.club/)

[Flutter插件](https://pub.dev/packages)

1.下载flutter sdk

有两种方式下载，这里我个人推荐git下载

1. git 下载
 
       git clone -b stable [https://github.com/flutter/flutter.git](https://github.com/flutter/flutter.git) （stable为正式发布板，想体验新功能可切换到master、dev、beta版）</pre>
3. zip下载

      进入到[下载链接](https://flutter.dev/docs/development/tools/sdk/releases#macos)，然后选择版本，下载完成后解压  

2.配置环境
```
#android
export ANDROID_HOME=你的Android SDK 目录
export PATH=${PATH}:${ANDROID_HOME}/tools
export PATH=${PATH}:${ANDROID_HOME}/platform-tools
#flutter
export PATH=你的Flutter SDK目录
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```

3.验证环境
    <pre>运行 flutter doctor 

第一次运行一个flutter命令（如flutter doctor）时，它会下载它自己的依赖项并自行编译。以后再运行就会快得多。

4.编译器配置

flutter  支持的编译器有 IntelliJ IDEA，Android Studio和VS Code 

这里我只简单介绍写Android Studio和Intellij IDEA 

打开编译器-command+, &gt; plugin &gt; marketplace &gt; 搜索flutter 点击下载 ，下载完重启即可

![](https://file.zsxq.com/3fa/41/fa41f9f478b22e2b4891e04781d820d8079eb54ea08d9cc479bb6c73047c39f1)

5.再次验证环境 运行 flutter doctor 

![](https://file.zsxq.com/3ed/43/ed4374f05325369aa804923ee80e2f102814e165430c3a734a1ed948fdf4e61e)

ios的错误是因为我的mac没有安装xcode，Android 开发已经木有问题了

6.新建一个flutter项目

打开编译器-new Project-new Flutter Project 一路next 就完事了 