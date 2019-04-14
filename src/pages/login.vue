<template>
  <form action="/login" method="POST">
    <label style="display: block">
      User name<br/>
      <input type="text" name="username"/>
    </label>
    <label style="display: block">
      Password<br/>
      <input type="password" name="password"/>
    </label>
    <button type="submit">Log in</button>
  </form>
</template>
