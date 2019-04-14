import Vue from "vue";
import page from "./foo.vue";

new Vue({
  render: h => h(page)
}).$mount("#app");
