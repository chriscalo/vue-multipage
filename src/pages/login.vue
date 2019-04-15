<template>
  <div id="app">
    <Navigation/>
    <form
      @submit.prevent="submit"
      action="/login"
      method="POST"
    >
      <label style="display: block">
        User name<br/>
        <input type="text" name="username" v-model="username"/>
      </label>
      <label style="display: block">
        Password<br/>
        <input type="password" name="password" v-model="password"/>
      </label>
      <div v-if="error" style="background: red; padding: 8px; color: white;">
        {{ error }}
      </div>
      <button type="submit">Log in</button>
    </form>
  </div>
</template>

<script>
  import axios from "axios";
  import Navigation from "@/components/Navigation.vue";
  
  
  export default {
    components: {
      Navigation,
    },
    data: () => ({
      username: "",
      password: "",
      error: null,
    }),
    methods: {
      submit(event) {
        axios
          .post("/login", {
            username: this.username,
            password: this.password,
          })
          .then(response => response.data)
          .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            window.location = urlParams.get("returnTo") || "/";
          })
          .then(console.log)
          .catch(error => {
            this.error = error.response.data.error;
          });
      },
    },
  };
</script>

<style lang="scss">
  @import "@/styles.scss";
</style>
