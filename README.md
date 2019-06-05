[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Build Status](https://travis-ci.org/GACHAIN/gachain-front.svg?branch=master)](https://travis-ci.org/GACHAIN/gachain-front)
[![](https://tokei.rs/b1/github/GACHAIN/gachain-front)](https://github.com/GACHAIN/gachain-front)
![](https://reposs.herokuapp.com/?path=GACHAIN/gachain-front&style=flat)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/GACHAIN?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


# Govis

- 为政务链提供用户界面。
- 提供开发应用程序的IDE。
- 存储用户帐户的私钥并执行授权。
- 从数据库请求应用程序的页面数据并向用户展示。
- 通过REST API将事务发送到后端。
- 为需要事务的用户操作自动创建事务。例如，当应用程序开发人员从IDE执行合约时，Govis会将此操作转换为事务。

## 快速开始

> 该项目基于react，所以你必须安装 Nodejs v6+ 并且使用`yarn`管理第三方依赖

**注意：yarn start 将请求服务器的地址默认绑定到http://127.0.0.1:7079/api/v2。 可以使用yarn start-desktop在桌面环境中调试项目。如果需要自定义更多的API请求服务器的地址，需在public目录下创建settings.json文件，示例配置在public目录下settings.json.dist。**

### 配置示例
- fullNodes 配置主节点地址

```json
{
    "defaultNetwork": "DEFAULT_NETWORK",
    "networks": [
        {
            "key": "DEFAULT_NETWORK",
            "name": "Default Network",
            "networkID": 100,
            "fullNodes": [
                "http://127.0.0.1:7079"
            ],
            "socketUrl": "",
            "activationEmail": "",
            "enableDemoMode": true,
            "disableSync": false
        }
    ]
}
```
- **defaultNetwork** - 将自动连接的默认网络的键
- **networks.key** - 指定网络的唯一键
- **networks.name** - 一个可读的网络名称，将显示在页面中
- **networks.networkID** - 在所有交易中被标示的唯一标识符。请参考go-gachian实例的配置
- **networks.fullNodes** - 将用于同步的预构建url列表
- **networks.socketUrl** - 重写离心机连接端点的可选参数。默认值:由go-apla配置提供。默认值:由go-gachain配置提供
- **networks.activationEmail** - 可选参数,当没有要登录的激活的节点时，它将显示给用户，用于KYC。
- **networks.enableDemoMode** - 当设置为true时，将启用使用访客密钥授权
- **networks.disableSync** - 可选参数，禁用完整节点的同步。不安全，谨慎使用

### 获取代码
`$ git clone https://github.com/GACHAIN/gachain-front.git`

### 安装依赖
`$ yarn install`

### 在浏览器启动
`$ yarn start`

---

## 桌面客户端

> 如果你想构建桌面应用程序只需如下2步就可以轻松搞定（请确保所有依赖已经安装完毕，并且已经在浏览器正常运行）。

`$ yarn build-desktop`

`$ yarn release --publish never -mwl`

> -mwl 参数代表 mac os, windows, linux，该参数可指定编译不同的操作系统