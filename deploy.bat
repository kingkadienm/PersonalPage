@echo off
setlocal
set "ROOT=%cd%"
set /p MSG="commit message: "
if "%MSG%"=="" set "MSG=update"
call npm run docs:build
if errorlevel 1 exit /b 1
cd /d "%ROOT%\docs\.vuepress\dist"
copy /y "%ROOT%\deploy-server.sh" .
echo .user.ini>.gitignore
git init
git add -A
git update-index --chmod=+x deploy-server.sh
git commit -m "%MSG%"
git push -f https://gitee.com/kingkadienm/kingkadienm.github.io.git master
cd /d "%ROOT%"
