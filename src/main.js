import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/style.css'
import App from '@/App.vue'
import VueTheMask from 'vue-the-mask'

const app = createApp(App)
app.use(VueTheMask)
app.mount('#app')
