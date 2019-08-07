import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from '../plugins/logger';

import { modulePermission } from './modules/permission/index';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    permission: modulePermission
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});

export default store;
