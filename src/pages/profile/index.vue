<template>
  <div id="app">
    <Navigation/>
    Profile
    <br/>
    username = {{user.username}}
  </div>
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
  @import "@/styles.scss";
</style>
