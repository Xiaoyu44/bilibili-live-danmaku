# bilive-dm

一个跨平台的哔哩哔哩直播弹幕桌面应用，基于 Electron + Vue 3 构建。提供弹幕展示、数据统计、自动回复、AI 语音识别等全方位直播辅助功能。

## ✨ 功能特性

### 🎯 多直播间管理

- 支持同时连接多个直播间，数据按房间独立隔离
- 多窗口并存，每个直播间可分别打开弹幕窗、仿原弹幕窗和直播窗
- 可自由拖拽排序、折叠侧边栏，灵活管理房间列表

### 💬 弹幕展示

- **自定义弹幕窗**：高度可定制的弹幕叠加层，支持调整透明度、背景、字体大小、颜色、合并时间、超时阈值等
- **仿原弹幕窗**：仿 B 站原生弹幕样式，支持滚动方向、持续时间等设置
- **OBS 集成**：提供弹幕窗 URL，可导入 OBS 作为浏览器源，支持置顶和鼠标穿透
- 支持按用户等级（普通 / 舰长 / 总督 / 提督 / 房管）分别配置样式
- 支持互动消息（进场 / 关注 / 分享）以及礼物 / SC 等特殊消息展示

### 📊 数据统计

- 按日期范围查询直播数据：弹幕数、礼物总额、送礼人数等
- 基于 ECharts 的可视化折线图展示统计趋势
- 支持生成弹幕词云图
- 礼物数据支持导出下载

### 🗳️ 弹幕投票

- 创建投票活动，设置关键词选项和持续时间
- 支持精确匹配 / 模糊匹配模式，允许/禁止重复投票
- 实时统计投票结果，通过饼图或柱状图可视化展示
- 可查看每位用户的投票记录

### 🤖 自动回复

- 可视化规则编辑器，支持拖拽排序，按房间独立配置
- 多种触发类型：弹幕消息、礼物、SC（SuperChat）、互动事件
- 丰富的条件标签：按用户角色、关键词过滤、礼物类型、粉丝牌等级、SC 价格
- 支持文字回复和语音回复（调用系统 TTS 引擎）
- 回复模板支持变量占位符：`{user}` `{comment}` `{gift}` `{gift.count}` `{superchat}`

### 🎙️ AI 语音识别

- 基于 sherpa-onnx 生态的本地语音识别（STT），无需联网
- 支持麦克风输入和直播音频输入两种模式
- VAD（语音活动检测）参数可调：最小语音时长、静音时长、最大语音时长
- 实时返回识别结果，可用于联动自动回复等模块

### 🔧 其他功能

- 支持 Cookie 登录（手动输入 / 二维码扫码）
- 直播录制功能，可自定义画质和保存路径
- 一键点亮粉丝牌

### 下载

https://github.com/usagiring/bilibili-live-danmaku/releases

## 📸 预览

### 主界面 & 多窗口

![overview.png](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/overview.png)
![window.png](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/window.png)

### 弹幕投票

![vote](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/vote.png)

### 数据统计

![stats](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/stats.png)

### 自动回复

![reply](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/reply.png)

### AI 语音识别

![ai](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/ai.png)
![ai2](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/ai2.png)

## 📦 AI 语音模型配置

语音识别基于 [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) 生态。为减小安装包体积，需自行下载语音模型并放入安装目录 `resources/models` 下。

目前支持 **sence-voice** 模型，后续将加入更多模型支持。

模型下载地址：https://github.com/k2-fsa/sherpa-onnx/releases/asr-models

## ⚠️ 数据说明

本应用所有数据均基于本地实时收集，未被应用统计到的数据不会纳入统计结果。

## 🛠️ 开发者指南

### 架构图

![er-v2](https://github.com/usagiring/bilibili-live-danmaku/blob/master/static/er-v2.png)

### 技术栈

- **框架**：Electron + Vue 3（Composition API）
- **状态管理**：Pinia
- **UI 组件**：View UI Plus
- **图表**：ECharts + echarts-wordcloud
- **构建**：electron-vite + electron-builder
- **B 站接口**：@tokine/bilibili-bridge
- **语音识别**：sherpa-onnx
- **分词**：@node-rs/jieba
