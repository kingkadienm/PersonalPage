#!/bin/bash
set -e

PROJECT_DIR="/www/wwwroot/wangzs.vip"
BRANCH="master"

echo -e "\033[32m========== 开始部署 ==========\033[0m"

cd $PROJECT_DIR

echo "📦 当前目录: $(pwd)"

echo "🧹 清理未跟踪文件"
git clean -fd

echo "🌐 获取远程更新"
git fetch --all

echo "🔄 强制覆盖本地代码"
git reset --hard origin/$BRANCH

echo -e "\033[32m🚀 部署完成\033[0m"
