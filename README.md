# gpu-heater-remote-control

GPUを暖房として使うためのリモコンです。

スマホ等からGPUの電力制限ができます。

対象: nVIDIA製のGPUを1枚搭載したWindows PC

事前にPCのローカルIPアドレスを固定しておくと便利です。

# 動作環境

- Node v18.12.1

# インストールと実行

**サーバーの起動は管理者権限で行う必要があります。**
```bash
npm install
npm run dev
```

起動後、`http://<PCのローカルIPアドレス>:3000`にアクセスしてください。
