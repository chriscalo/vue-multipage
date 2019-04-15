<template>
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
</template>

<script>
  import axios from "axios";
  
  
  export default {
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
            console.log(data)
            window.location = data.redirectTo || "/";
          })
          .then(console.log)
          .catch(error => {
            this.error = error.response.data.error;
          });
      },
    },
  };
</script>
