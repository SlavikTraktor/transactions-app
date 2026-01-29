import './assets/main.css'

import Aura from '@primeuix/themes/aura'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'light',
    },
  },
})
app.use(createPinia())
app.use(router)

app.mount('#app')
