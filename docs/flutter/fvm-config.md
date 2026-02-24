# FVM 环境配置

FVM（Flutter Version Management）用于在本地管理多个 Flutter SDK 版本，方便按项目切换版本，避免全局 Flutter 升级影响所有项目。

## 安装 FVM

### macOS / Linux

```bash
# 方式一：pub global
dart pub global activate fvm

# 方式二：Homebrew（macOS）
brew tap leoafarias/fvm
brew install fvm
```

安装后确保 `$HOME/.pub-cache/bin` 或 Homebrew 的 bin 已加入 PATH：

```bash
export PATH="$PATH:$HOME/.pub-cache/bin"
```

### Windows

```powershell
# 以管理员运行
dart pub global activate fvm
```

将 `%LOCALAPPDATA%\Pub\Cache\bin` 加入系统环境变量 Path。

## 常用命令

```bash
# 查看已安装的 Flutter 版本
fvm list

# 安装指定版本（不设为项目使用版本）
fvm install 3.16.0

# 为当前项目指定使用的 Flutter 版本（会生成 .fvm 目录）
fvm use 3.16.0

# 使用稳定版最新
fvm use stable

# 使用 beta / master
fvm use beta
fvm use master

# 查看当前项目使用的版本
fvm flutter --version

# 移除项目绑定的版本（删除 .fvm）
fvm use --remove
```

## 项目内使用

在项目根目录执行 `fvm use 3.16.0` 后：

- 会创建 `.fvm/` 目录，内含当前使用的 Flutter SDK 的链接或配置。
- 会生成或更新 `.fvmrc` 或 `fvm_config.json`，记录版本号，便于团队统一。

**推荐：用 FVM 的 Flutter 执行所有命令，避免混用全局 Flutter：**

```bash
# 运行、构建、测试等都用 fvm 前缀
fvm flutter pub get
fvm flutter run
fvm flutter build apk
fvm flutter test
```

也可直接使用 `.fvm/flutter_sdk` 下的 Flutter（FVM 会在此创建符号链接）：

```bash
.fvm/flutter_sdk/bin/flutter run
```

## IDE 配置

### VS Code

1. 安装插件：**Flutter**（以及 **Dart**）。
2. 设置 Flutter SDK 路径为项目内的 FVM 路径：
   - 打开项目根目录（包含 `.fvm` 的目录）。
   - `Ctrl/Cmd + Shift + P` → “Flutter: Change SDK”，选择 `.fvm/flutter_sdk`；  
   或在 `.vscode/settings.json` 中配置：

```json
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk"
}
```

3. 若使用 **fvm** 插件，可在命令面板执行 “FVM: Select Flutter SDK” 选择版本。

### Android Studio / IntelliJ

1. 安装 **Flutter** 插件。
2. **File → Settings → Languages & Frameworks → Flutter**，将 Flutter SDK path 设为项目内的 `.fvm/flutter_sdk`（绝对路径），例如：
   - macOS/Linux: `/path/to/your_project/.fvm/flutter_sdk`
   - Windows: `C:\path\to\your_project\.fvm\flutter_sdk`

这样 IDE 的 Run/Debug、代码补全、分析都基于该版本。

## .fvmrc 与团队协作

项目根目录的 `.fvmrc` 示例：

```
3.16.0
```

或使用 `fvm_config.json`：

```json
{
  "flutter": "3.16.0"
}
```

团队成员拉代码后执行一次 `fvm install`（或 `fvm use`）即可使用相同版本，CI 里也可用 `fvm use` 再 `fvm flutter ...` 保证版本一致。

## 与全局 Flutter 的关系

- 全局安装的 `flutter` 仍可使用；FVM 只是在项目目录下通过 `.fvm` 绑定一个版本。
- 建议：项目开发统一用 `fvm flutter` 或 IDE 指向 `.fvm/flutter_sdk`，避免“本地是 FVM、CI 是全局”导致版本不一致。

## 常见问题

- **fvm: command not found**  
  检查 PATH 是否包含 `pub global activate fvm` 后的 bin 目录，或重新打开终端。

- **IDE 仍用全局 Flutter**  
  确认 IDE 的 Flutter SDK 路径指向项目 `.fvm/flutter_sdk`，并重启 IDE。

- **.fvm 要不要提交**  
  一般提交 `.fvmrc`（或 `fvm_config.json`），不提交 `.fvm/flutter_sdk`（或只提交其内的版本标识，视 FVM 版本而定）；团队统一执行 `fvm use` 或 `fvm install` 即可。
