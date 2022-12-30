@echo off

chcp 65001

openfiles >NUL 2>&1

if errorlevel 1 (
  echo 管理者として実行されていません。
  pause > NUL
  exit
)

where node > NUL

if errorlevel 1 (
  echo Node.jsがインストールされていません。
  pause > NUL
  exit
)

cd /d %~dp0


@echo on

call npm install
npm run dev

cmd /k