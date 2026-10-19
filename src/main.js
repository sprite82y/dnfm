import { createApp } from 'vue'
// 顺序很重要：先 Bootstrap，再 App.vue（其样式与 style.css 同属项目样式）。
// 反过来的话，项目样式会被 Bootstrap 的工具类（多带 !important）覆盖。
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import 'bootstrap'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
