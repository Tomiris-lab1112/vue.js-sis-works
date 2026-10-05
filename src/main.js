import { createApp } from 'vue'
import App from './App.vue'
import BaseCard from './components/UI/BaseCard.vue'

const app = createApp(App)

// Глобальная регистрация компонента BaseCard (требование ТЗ)[cite: 37, 63, 64]
app.component('BaseCard', BaseCard)

app.mount('#app')