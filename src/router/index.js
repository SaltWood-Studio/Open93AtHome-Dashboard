import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'

export const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
})
console.log(router.getRoutes())
// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router