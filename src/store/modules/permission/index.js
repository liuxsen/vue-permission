import api from '../../../api';
import constants from './constant';

import { routerMap as initRouterList, asyncRouterMap as asyncRouterInitList } from '../../../router/index';
// 按钮权限
import { constantButtonPermission } from './buttonPermission';

export const modulePermission = {
  namspaced: true,
  state: {
    userinfo: {},
    roles: [],
    addRoutes: [],
    routers: initRouterList,
    allButtons: AllButton(constantButtonPermission),
    accessedButtons: []
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
    },
    [constants.INIT_PERMISSION_BUTTONS](state, buttons) {
      state.accessedButtons = buttons;
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
        const accessedButtons = FilterButton(constantButtonPermission, rolesList);
        commit(constants.ADD_ROUTERS, accessedRoutes);
        commit(constants.INIT_PERMISSION_BUTTONS, accessedButtons);
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

// --------button---------

/**
 * 返回所有用户按钮和视图
 * @param {constantButtonPermission} constantButtonPermission
 */
function AllButton(constantButtonPermission) {
  const AllPermission = {};
  constantButtonPermission.forEach(item => {
    AllPermission[item.name] = item;
  });
  return AllPermission;
}

/**
 * 过滤按钮视图，返回符合用户的按钮和视图
 * @param {constantButtonPermission} constantButtonPermission
 * @param {rolesList} rolesList
 */
function FilterButton(constantButtonPermission, rolesList) {
  return constantButtonPermission.filter(button => {
    return filterRole(button.meta.roles, rolesList);
  });
}
