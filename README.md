# Hola

## 前言

本项目旨在**从零到壹**，制作一款界面美观的聊天软件。

## 技术栈

* **开发环境**
	* 操作系统：macOS High Sierra v10.13.1
	* 编辑器：Visual Studio Code v1.19.1
	* npm：v5.3.0
	* Node：v8.4.0

* **客户端**
	* UI设计：Sketch
	* 软件框架：Electron
	* 界面实现：Vue.js + Vuex + Vue-Router + Webpack
	* 通信模块：[socket.io-client](https://github.com/socketio/socket.io-client)
	* 视频聊天：[原生 WebRTC](https://www.html5rocks.com/en/tutorials/webrtc/basics/)

* **服务端**
	* 服务器：Node.js
	* 后端框架：Koa2
	* 通信模块：[socket.io](https://github.com/socketio/socket.io) 
	* 数据库：Redis 和 MongoDB

## 需求列表

- [x] 登录注册模块（<手机号+验证码>形式的登录注册）
- [x] 聊天区模块
	- [x] 最近联系人列表
	- [x] 历史消息
	- [x] 私聊
		- [x] 文本消息
		- [x] 图片消息
		- [x] 视频聊天
	- [x] 群聊
		- [x] 文本消息
		- [x] 图片消息
- [x] 联系人模块
	- [x] 联系人列表
	- [x] 好友资料展示
	- [x] 群组资料展示
	- [x] 删好友，退出或解散群组
- [x] 功能区模块
	- [x] 添加好友/群组
	- [x] 创建群组
- [x] 设置区模块
	- [x] 个人资料设置
	- [x] 软件设置
		- [x] 国际化
			- [x] 中文
			- [x] 英文
	
## 通信架构

## 软件演示

## 反思 & 展望

## 扩展阅读

* [初探 Electron - 理论篇](http://jartto.wang/2018/01/03/first-exploration-electron/)
* [初探 Electron - 升华篇](http://jartto.wang/2018/01/04/first-exploration-electron-2/)
* [XCel 项目总结 - Electron 与 Vue 的性能优化](https://segmentfault.com/a/1190000007665162)
* [【译】Electron 自动更新的完整教程（Windows 和 OSX）](https://segmentfault.com/a/1190000007616641)