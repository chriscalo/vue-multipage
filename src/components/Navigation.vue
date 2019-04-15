<template>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/foo">Foo</a></li>
      <li><a href="/bar">Bar</a></li>
      <li><a href="/baz">Baz</a></li>
      <li><a href="/login">Login</a></li>
      <li><a href="/profile">Profile</a></li>
      <li><a href="/logout">Logout</a></li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
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
