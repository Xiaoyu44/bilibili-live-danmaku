<template>
  <div class="main">
    <div class="item-container">
      <span class="setting-text">显示滚动弹幕窗</span>
      <i-switch :model-value="isShowDanmakuWindow" :loading="isShowDanmakuWindowLoading" @on-change="showDanmakuWindow" />
      <Checkbox :style="{ 'padding-left': '10px' }" :model-value="isScrollDanmakuWindowAlwaysOnTop" @on-change="changeAlwaysOnTop">置顶</Checkbox>
    </div>

    <div class="item-container">
      <span class="setting-text">背景色</span>
      <ColorPicker transfer :model-value="scrollDanmakuBackground" size="small" alpha @on-active-change="debouncedUpdateBackground" />
    </div>
    <div class="item-container">
      <span class="setting-text">透明度</span>
      <InputNumber
        :model-value="scrollDanmakuOpacity"
        :min="0"
        :max="100"
        :formatter="(value) => `${value}%`"
        size="small"
        :parser="(value) => value.replace('%', '')"
        :style="{ width: '70px' }"
        @on-change="changeScrollDanmakuOpacity"
      />
    </div>
    <div class="item-container">
      <span class="setting-text">弹幕样式选择</span>
      <RadioGroup :model-value="scrollDanmakuStyleExtend" @on-change="changeScrollDanmakuStyleExtend">
        <Radio label="bilibili">
          <span>保持与B站弹幕一致</span>
        </Radio>
        <Radio label="self">
          <span>继承普通弹幕的「内容」样式设置</span>
        </Radio>
      </RadioGroup>
    </div>
    <div class="item-container">
      <span class="setting-text">整体字号</span>
      <InputNumber :model-value="scrollDanmakuFontSize" :min="1" size="small" :style="{ width: '55px' }" @on-change="changeScrollDanmakuFontSize" />
    </div>
    <div class="item-container">
      <span class="setting-text">表情大小</span>
      <InputNumber :model-value="scrollDanmakuEmojiSize" :min="1" size="small" :style="{ width: '55px' }" @on-change="changeScrollDanmakuEmojiSize" />
    </div>
    <div class="item-container">
      <span class="setting-text">弹幕显示时间</span>
      <InputNumber
        :model-value="scrollDanmakuDuration"
        :min="0"
        :step="500"
        :formatter="(value) => `${value}ms`"
        size="small"
        :parser="(value) => value.replace('ms', '')"
        :style="{ width: '90px' }"
        @on-change="changeScrollDanmakuDuration"
      />
    </div>
    <div class="item-container">
      <span class="setting-text">方向</span>
      <RadioGroup :model-value="scrollDanmakuDirection" @on-change="changeScrollDanmakuDirection">
        <Radio label="RL">
          <span>从右到左</span>
        </Radio>
        <Radio label="LR">
          <span>从左到右</span>
        </Radio>
      </RadioGroup>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { PORT } from '../../service/config-loader'
import { updateSetting } from '../../service/api'
import { BrowserWindow, nativeImage } from '@electron/remote'
import icon from '../assets/logo.png'

export default {
  data() {
    return {
      isShowDanmakuWindow: false,
      isShowDanmakuWindowLoading: false,
      checkOnTopInterval: null,
    }
  },
  computed: {
    scrollDanmakuFontSize() {
      return this.$store.state.Config.scrollDanmakuFontSize
    },
    scrollDanmakuDuration() {
      return this.$store.state.Config.scrollDanmakuDuration
    },
    scrollDanmakuDirection() {
      return this.$store.state.Config.scrollDanmakuDirection
    },
    isScrollDanmakuWindowAlwaysOnTop() {
      return this.$store.state.Config.isScrollDanmakuWindowAlwaysOnTop
    },
    isOnTopForce() {
      return this.$store.state.Config.isOnTopForce
    },
    disableIgnoreMouseEvent() {
      return this.$store.state.Config.disableIgnoreMouseEvent
    },
    onTopLevel() {
      return this.$store.state.Config.onTopLevel
    },
    scrollDanmakuWindowId() {
      return this.$store.state.Config.scrollDanmakuWindowId
    },
    scrollDanmakuWidth() {
      return this.$store.state.Config.scrollDanmakuWidth
    },
    scrollDanmakuHeight() {
      return this.$store.state.Config.scrollDanmakuHeight
    },
    scrollDanmakuX() {
      return this.$store.state.Config.scrollDanmakuX
    },
    scrollDanmakuY() {
      return this.$store.state.Config.scrollDanmakuY
    },
    scrollDanmakuBackground() {
      return this.$store.state.Config.scrollDanmakuBackground
    },
    scrollDanmakuOpacity() {
      return this.$store.state.Config.scrollDanmakuOpacity
    },
    scrollDanmakuStyleExtend() {
      return this.$store.state.Config.scrollDanmakuStyleExtend
    },
    scrollDanmakuEmojiSize() {
      return this.$store.state.Config.scrollDanmakuEmojiSize
    },
  },

  created() {
    this.debouncedUpdateBackground = debounce(this.updateBackground, 100)

    let win
    if (this.scrollDanmakuWindowId) {
      win = BrowserWindow.fromId(this.scrollDanmakuWindowId)
    }

    if (win) {
      this.win = win
      this.isShowDanmakuWindow = true
    }
  },

  methods: {
    showDanmakuWindow(status) {
      // const { x, y } = screen.getCursorScreenPoint();
      this.isShowDanmakuWindowLoading = true

      if (status) {
        const win = new BrowserWindow({
          width: this.scrollDanmakuWidth || 480,
          height: this.scrollDanmakuHeight || 540,
          // x, y,
          x: this.scrollDanmakuX || 0,
          y: this.scrollDanmakuY || 0,
          frame: false,
          transparent: true,
          hasShadow: false,
          // webPreferences: {
          //   nodeIntegration: true,
          // },
          resizable: true,
        })

        this.$store.dispatch('UPDATE_CONFIG', {
          scrollDanmakuWindowId: win.id,
        })

        console.log(win)
        const winURL = `http://localhost:${PORT}/danmaku-scroll?port=${PORT}`
        win.setIcon(nativeImage.createFromDataURL(icon))
        win.loadURL(winURL)
        win.on('close', (e) => {
          this.closeDanmakuWindow()
        })
        win.on(
          'resize',
          debounce(() => {
            const [width, height] = win.getSize()
            this.$store.dispatch('UPDATE_CONFIG', {
              scrollDanmakuWidth: width,
              scrollDanmakuHeight: height,
            })
          }, 400)
        )
        win.on(
          'move',
          debounce(() => {
            const [x, y] = win.getPosition()
            this.$store.dispatch('UPDATE_CONFIG', {
              scrollDanmakuX: x,
              scrollDanmakuY: y,
            })
          }, 400)
        )
        this.win = win
        this.isShowDanmakuWindow = true
        this.isShowDanmakuWindowLoading = false
      } else {
        this.closeDanmakuWindow()
      }
    },
    async changeScrollDanmakuFontSize(value) {
      const data = {
        scrollDanmakuFontSize: value,
      }
      await updateSetting(data)
      this.$store.dispatch('UPDATE_CONFIG', data)
    },

    async changeScrollDanmakuDuration(value) {
      const data = {
        scrollDanmakuDuration: value,
      }
      await updateSetting(data)
      this.$store.dispatch('UPDATE_CONFIG', data)
    },

    closeDanmakuWindow() {
      if (!this.win) return
      this.$store.dispatch('UPDATE_CONFIG', {
        scrollDanmakuWindowId: null,
      })
      // clear
      if (this.checkOnTopInterval) {
        clearInterval(this.checkOnTopInterval)
        this.checkOnTopInterval = null
      }
      this.win.close()
      this.win = null
      this.isShowDanmakuWindow = false
      this.isShowDanmakuWindowLoading = false
      // this.isScrollDanmakuWindowAlwaysOnTop = false
      this.$store.dispatch('UPDATE_CONFIG', {
        isScrollDanmakuWindowAlwaysOnTop: false,
      })
    },

    changeAlwaysOnTop(status) {
      this.win.setFocusable(!status)
      // this.win.setVisibleOnAllWorkspaces(true)
      if (this.isOnTopForce && status) {
        this.checkOnTopInterval = setInterval(() => {
          if (!this.win) return
          this.win.moveTop()
        }, 1000)
      } else if (this.checkOnTopInterval) {
        clearInterval(this.checkOnTopInterval)
        this.checkOnTopInterval = null
      }
      this.win.setAlwaysOnTop(status, this.onTopLevel)
      // 如果鼠标穿透 或者 取消置顶时，设置ignore
      if (!this.disableIgnoreMouseEvent || !status) {
        this.win.setIgnoreMouseEvents(status, { forward: true })
      }
      this.$store.dispatch('UPDATE_CONFIG', {
        isScrollDanmakuWindowAlwaysOnTop: status,
      })
      // this.isScrollDanmakuWindowAlwaysOnTop = status
    },

    async updateBackground(color) {
      const data = {
        scrollDanmakuBackground: color,
      }
      await updateSetting(data)
      this.$store.dispatch('UPDATE_CONFIG', data)
    },

    async changeScrollDanmakuOpacity(value) {
      const data = {
        scrollDanmakuOpacity: value,
      }
      await updateSetting(data)
      this.$store.dispatch('UPDATE_CONFIG', data)
    },

    async changeScrollDanmakuDirection(value) {
      const data = {
        scrollDanmakuDirection: value,
      }
      await updateSetting(data)
      this.$store.dispatch('UPDATE_CONFIG', data)
    },

    async changeScrollDanmakuStyleExtend(value) {
      const data = {
        scrollDanmakuStyleExtend: value,
      }
      await updateSetting(data)
      this.$store.dispatch('UPDATE_CONFIG', data)
    },

    async changeScrollDanmakuEmojiSize(value) {
      const data = {
        scrollDanmakuEmojiSize: value,
      }
      await updateSetting(data)
      this.$store.dispatch('UPDATE_CONFIG', data)
    },
  },
}
</script>

<style scoped>
.item-container {
  padding: 20px 0 0 40px;
}
.setting-text {
  vertical-align: middle;
  padding-right: 10px;
}
</style>
