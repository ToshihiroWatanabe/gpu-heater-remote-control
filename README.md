# gpu-heater-remote-control
![demo](https://user-images.githubusercontent.com/79039863/209477040-eb4d2a49-b1cb-4c78-90f0-00742be7c566.gif)

GPUの排熱を暖房として使うためのリモコンアプリです。

スマホ等からGPUの電力制限ができます。

# 動作環境

- Windows 10またはWindows 11のPC  
（NVIDIA製のGPUを1枚搭載し、NVIDIAドライバがインストールされていること）
- Node v18.12.1

※WSL2上のUbuntuでも動作しますが、外部からアクセスするにはポートフォワーディングの設定が必要になります。

# 事前準備

1. ファイアウォールの設定で、同じネットワークからのアクセスを許可する
1. PCを操作する端末を、PCと同じネットワークに接続する

PCのローカルIPアドレスを固定しておくと便利です。

# インストールと実行

**※サーバーの起動は管理者権限で行う必要があります。**

```bash
npm install
npm run dev
```

[gpu-heater-remote-control.bat](/gpu-heater-remote-control.bat)を「管理者として実行」することでも起動できます。

起動後、`http://<PCのローカルIPアドレス>:<ポート>`にアクセスしてください。

# License

MIT
