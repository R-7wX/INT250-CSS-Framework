import { createRouter, createMemoryHistory } from 'vue-router'
import Discovery from '../views/Discovery.vue'
import Storyboard from '../views/Storyboard.vue'
import Dashboard from '../views/Dashboard.vue'
import Checklist from '../views/Checklist.vue'

const routes = [
  { path: '/', name: 'Discovery', component: Discovery },
  { path: '/storyboard', name: 'Storyboard', component: Storyboard },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/checklist', name: 'Checklist', component: Checklist },
]

export default createRouter({
  history: createMemoryHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})