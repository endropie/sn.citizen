
const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/account',
    component: () => import('layouts/AccountLayout.vue'),
    meta: { auth: true },
    children: [
      { path: '', component: () => import('pages/account/Index.vue') },
      { path: 'dashboard', component: () => import('pages/account/Index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
