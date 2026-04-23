import { App } from 'vue'
import RoiEditor from './components/RoiEditor.vue'

export default {
  install(app: App) {
    app.component('RoiEditor', RoiEditor)
  }
}

export { RoiEditor }