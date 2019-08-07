import api from '../../../api';
import constants from './constant';

import { routerMap as initRouterList, asyncRouterMap as asyncRouterInitList } from '../../../router/index';

export const modulePermission = {
  namspaced: true,
  state: {
    userinfo: {},
    roles: [],
    addRoutes: [],
    routers: initRouterList
  },
  getters: {
    token(state, getters, rootstate) {
      const token = document.cookie;
      return !!token;
    },
    roles(state, getters, rootstate) {
      return state.roles;
    },
    addRoutes(state, getters, rootstate) {
      return state.addRoutes;
    },
    whiteRouteList(state) {
      return state.whiteRouteList;
    }
  },
  mutations: {
    [constants.GET_USER_INFO](state, roles) {
      state.roles = roles;
    },
    [constants.ADD_ROUTERS](state, routers) {
      state.addRoutes = routers;
      state.routers = initRouterList.concat(routers);
    }
  },
  actions: {
    getUserInfo({ commit, state }) {
      return api.permission.getUerInfo().then(({ roles }) => {
        commit(constants.GET_USER_INFO, roles);
        return roles;
      });
    },
    GenerateRoutes({ commit, state }, rolesList) {
      return new Promise((resolve, reject) => {
        const accessedRoutes = fillterAsyncRouter(asyncRouterInitList, rolesList);
        commit(constants.ADD_ROUTERS, accessedRoutes);
        resolve();
      });
    }
  }
};

function fillterAsyncRouter(asyncRouterInitList, rolesList) {
  const accessedRoutes = asyncRouterInitList.filter(route => {
    if (route.children) {
      route.children = fillterAsyncRouter(route.children, rolesList);
    }
    if (route.meta && route.meta.roles) {
      return filterRole(route.meta.roles, rolesList);
    } else {
      return true;
    }
  });
  return accessedRoutes;
}

function filterRole(routeRoles, currentRoles) {
  return routeRoles.some(item => currentRoles.indexOf(item) !== -1);
}
