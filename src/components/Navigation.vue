<template>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/foo">Foo</a></li>
      <li><a href="/bar">Bar</a></li>
      <li><a href="/baz">Baz</a></li>
      <li><a href="/login">Login</a></li>
      <li><a href="/profile">Profile</a></li>
      <li><a href="/logout" data-no-prefetch>Logout</a></li>
    </ul>
  </nav>
</template>

<script>
  import Prefetch from "prefetch";
  
  export default {
    mounted() {
      Prefetch.init({ containers: ["nav"]});
    },
  };
</script>

<style lang="scss" scoped>
  nav {
    padding: 8px;
    margin: 24px 0;
  }
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  
  li:not(:last-child) {
    margin-right: 8px;
  }
</style>
