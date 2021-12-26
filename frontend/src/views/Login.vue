<template>
  <div class="login-main-menu">
    <main-nav />
    <p>
      Enter your data to login:
    </p>
    <form>
      <LoginPanel v-on:data-sent="updateLoginData" v-on:connect-user="login" />
    </form>
  </div>
</template>



<script>
import MainNav from "../components/MainNav.vue";
import LoginPanel from "../components/LoginPanel.vue";

export default {
  name: "Login",
  components: {
    MainNav,
    LoginPanel,
  },
  data: () => {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      this.$axios
        .post("/auth/login", this.$data)
        .then((res) => {
          sessionStorage.setItem("userID", res.data.userID);
          sessionStorage.setItem("token", res.data.token);
          this.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + res.data.token;
          this.$router.push("/Wall");
        })
        .catch((err) =>{
          console.error(err.message)
          if (err.response.status === 401) {
            alert("Wrong email or password");
          }
          else if (err.response.status === 500) {
            alert("Server error");
          }
        })
    },
    updateLoginData(data) {
      // console.log("updating data")
      this.email = data.email;
      this.password = data.password;
    },
  },
  mounted() {
    sessionStorage.removeItem("token");
    delete this.$axios.defaults.headers.common["Authorization"];
    document.title = "Login | Groupomania";
  },
};
</script>
<style>
input{
  border-radius: 10px;
  padding: 0.5rem;
  border: 1px solid #e6e6e6;
}
.login-main-menu{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}
</style>