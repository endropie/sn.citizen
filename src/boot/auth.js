function isArrayOrString (variable) {
  if (typeof variable === typeof [] || typeof variable === typeof '') {
    return true
  }
  return false
}
import auth from '@/store/auth'
import enUS from '@/i18n/en-us/auth'

export default ({ app, router, store, Vue }) => {
  // Register auth store
  store.registerModule('auth', auth)
  // Register auth i18n)
  app.i18n.mergeLocaleMessage('en-us', enUS)

  // Set route guard
  router.beforeEach((to, from, next) => {
    const record = to.matched.find(record => record.meta.auth)
    if (record) {
      if (!store.getters['auth/loggedIn']) {
        return store.dispatch('auth/fetch').then((data) => {
          if (!store.getters['auth/loggedIn']) {
            next('/authentication')
          } else if (
            isArrayOrString(record.meta.auth) &&
            !store.getters['auth/check'](record.meta.auth)
          ) {
            next('/admin')
          } else {
            next()
          }
        }).catch(() => {
          next('/authentication')
        })
      } else if (
        isArrayOrString(record.meta.auth) &&
        !store.getters['auth/check'](record.meta.auth)
      ) {
        return next('/admin')
      }
    }
    next()
  })

  // Set authentication routes
  const { routes } = router.options
  const routeData = routes.find(r => r.path === '/')
  const currentRoutes = routeData.children.map(route => route.path)
  const newRoutes = [
    {
      path: '/authentication',
      name: 'authentication',
      component: () => import('pages/authentication')
    }
    // {
    //   path: '/authentication/verification',
    //   name: 'authentication-verification',
    //   component: () => import('pages/auth/Verification')
    // },
    // {
    //   path: '/authentication/password-reset',
    //   name: 'authentication-password-reset',
    //   component: () => import('pages/auth/password-reset')
    // }
  ]

  routeData.children = []
  for (const route of newRoutes) {
    if (!currentRoutes.includes(route.path)) {
      routeData.children.push(route)
    }
  }
  router.addRoutes([routeData])

  app.mounted = () => {
    store.dispatch('auth/fetch').catch(() => {
      store.dispatch('auth/logout')
    })
  }

  var helper = {}
  helper.register = (data) => { return store.dispatch('auth/register', data) }
  helper.login = async (data) => { return store.dispatch('auth/login', data) }
  helper.logout = () => { return store.dispatch('auth/logout') }
  helper.verify = (token) => { return store.dispatch('auth/verify', token) }
  helper.passwordForgot = (data) => { return store.dispatch('auth/passwordForgot', data) }
  helper.passwordReset = (data) => { return store.dispatch('auth/passwordReset', data) }
  helper.loggedIn = () => { return store.getters['auth/loggedIn'] }
  helper.check = (roles) => { return store.getters['auth/check'](roles) }
  helper.setHeader = (data) => { return store.dispatch('auth/setHeader', data) }
  helper.fetch = () => { return store.dispatch('auth/fetch') }
  helper.user = () => { return store.getters['auth/user'] }
  Vue.prototype.$auth = helper

  store.commit('auth/addLoginCallback', () => console.log('Logged in'))
}
