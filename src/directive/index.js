import Vue from 'vue';
import store from '../store';

// 权限指令
// 使用方式 v-permission="$store.state.permission.allButtons.person_delete"
Vue.directive('permission', {
  bind(el, binding) {
    setTimeout(() => {
      if (!store.state.permission.accessedButtons.includes(binding.value)) {
        el.parentNode.removeChild(el);
      }
    }, 0);
  }
});
