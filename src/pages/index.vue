<template>
  <div id="app">
    <Navigation/>
    <img alt="Vue logo" src="@/assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
  import HelloWorld from "@/components/HelloWorld.vue";
  import Navigation from "@/components/Navigation.vue";
  
  
  export default {
    name: 'app',
    components: {
      HelloWorld,
      Navigation,
    },
  };
</script>

<style lang="scss">
  @import "@/styles.scss";
</style>
