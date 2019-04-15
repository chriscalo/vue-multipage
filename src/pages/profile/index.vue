<template>
  <main>
    <Navigation/>
    Profile
    <br/>
    username = {{user.username}}
  </main>
</template>

<script>
  import axios from "axios";
  import Navigation from "@/components/Navigation.vue";
  
  const userPromise = axios.get("/whoami").then(response => response.data.user);
  
  export default {
    name: "profile",
    components: {
      Navigation,
    },
    data: () => ({
      user: {
        username: "loading…",
      },
    }),
    mounted() {
      userPromise.then(user => {
        this.user = user;
      });
    },
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
