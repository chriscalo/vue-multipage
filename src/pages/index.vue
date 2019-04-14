<template>
  <main>
    <Navigation/>
    <img alt="Vue logo" src="@/assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </main>
</template>

<script>
  import HelloWorld from '@/components/HelloWorld.vue'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'app',
    components: {
      HelloWorld,
      Navigation,
    },
  };
</script>

<style lang="scss">
  main {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
