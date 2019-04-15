<template>
  <main>
    <Navigation/>
    <img alt="Vue logo" src="@/assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </main>
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
  @import "@/style.scss";
</style>
