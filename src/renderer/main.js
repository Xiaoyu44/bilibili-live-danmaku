import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import global from '../service/global'

const app = createApp(App)
  .use(router)
  .use(store)
  .use(ViewUIPlus)

app.config.globalProperties.$global = global
app.provide('globalValue', global)

app.mount('#app')
