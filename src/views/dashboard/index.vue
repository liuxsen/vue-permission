<template>
  <div>
    <h2>dashboard</h2>
    <router-link to="/permission/index">/permission/index</router-link>
    <router-link to="/1111">/404</router-link>
    <h3>按钮权限</h3>
    <button v-permission="$store.state.permission.allButtons.person_delete">删除</button>
  </div>
</template>

<script>
export default {};
</script>
