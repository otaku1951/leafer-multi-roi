import { App } from 'vue'
import RoiEditor from './components/RoiEditor.vue'

export function install(app: App) {
  app.component('RoiEditor', RoiEditor)
}

export { RoiEditor }

export default RoiEditor