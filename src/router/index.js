import Vue from 'vue';
import Router from 'vue-router';

import Login from '../views/login';
import Dashboard from '../views/dashboard/index.vue';
import Permission from '../views/permission/index.vue';
import NotFund from '../views/404/index.vue';
import Container from '../views/container.vue';
import PermissionFoo from '../views/permission/foo.vue';
import Info from '../views/info/index.vue';
import store from '../store';

Vue.use(Router);

export const routerMap = [
  {
    path: '/dashboard',
    component: Container,
    children: [
      {
        path: '/dashboard',
        component: Dashboard,
        meta: {
          title: '仪表盘'
        }
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    }
  }
];

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Container,
    children: [
      {
        path: 'index',
        component: Permission,
        meta: {
          title: '权限管理',
          roles: ['m1', 'g1']
        }
      },
      {
        path: 'foo',
        component: PermissionFoo,
        meta: {
          title: '权限管理--foo',
          roles: ['m1', 'g1']
        }
      }
    ]
  },
  {
    path: '*',
    component: NotFund
  }
];

// 白名单
const routeWhiteRouteMap = [
  {
    path: '/info',
    component: Info,
    meta: {
      title: 'info'
    }
  }
];

const routeWhiteList = ['/info', '/dashboard'];

const router = new Router({
  mode: 'history',
  routes: routerMap.concat(routeWhiteRouteMap)
});

router.beforeEach((to, from, next) => {
  if (store.getters.token) {
    // 如果已登录
    if (to.path === '/login') {
      next('/');
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('getUserInfo').then(roles => {
          const rolesList = roles.map(item => generateRoleKey(item.typeid, item.userRoleId));
          store.dispatch('GenerateRoutes', rolesList).then(() => {
            router.addRoutes(store.getters.addRoutes);
            next({ ...to, replace: true });
          });
        });
      } else {
        next();
      }
    }
  } else {
    // 如果未登录，在白名单中
    if (routeWhiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (to.path !== '/login') {
        next('/login');
      } else {
        next();
      }
    }
  }
});

/**
 * 生成 角色key
 * @param {number} typeId 1, 2, 3
 * @param {number} roleId 1, 2, 3
 */
function generateRoleKey(typeId, roleId) {
  switch (typeId) {
    case 1:
      return 'maintenance'[0] + roleId;
      break;
    case 2:
      return 'property'[0] + roleId;
    case 3:
      return 'government'[0] + roleId;
    default:
      break;
  }
}

export default router;
