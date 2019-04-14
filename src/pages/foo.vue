<template>
  <main>
    <Navigation/>
    /foo
  </main>
</template>

<script>
  import Navigation from "@/components/Navigation.vue";
  
  export default {
    name: "foo",
    components: {
      Navigation
    }
  };
</script>

<style lang="scss">
  main {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
