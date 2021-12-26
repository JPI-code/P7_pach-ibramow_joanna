<template>
  <div class="login-main-menu">
    <main-nav />
    <p>
      Enter your data to signup:
    </p>
    <form onsubmit="return false">
      <SignupPanel v-on:data-sent="updateSingupData" />
      <LoginPanel v-on:connect-user="signup" v-on:data-sent="updateLoginData" />
    </form>
  </div>
</template>

<style>
button{
  border-radius: 10px;
  padding: 0.5rem;
  border: 1px solid black;
}


</style>


<script>
import MainNav from "../components/MainNav.vue";
import LoginPanel from "../components/LoginPanel.vue";
import SignupPanel from "../components/SignupPanel.vue";

export default {
  name: "Signup",
  components: {
    LoginPanel,
    SignupPanel,
    MainNav,
  },
  data: function () {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      avatarUrl: "",
    };
  },
  methods: {
    signup() {
      console.log("send data from signup");
      console.log(this.$data.email);
      console.log(this.$data.password);
      console.log(this.$data.firstName);
      console.log(this.$data.lastName);
      this.$axios
        .post("/auth/signup", this.$data)
        .then((res) => {
          console.log(`send to server ${this.$data}`);
          //this will redirect user to login page
          this.$router.push("/");
        })
        .catch((err) =>{
          console.error(err.message)
          if (err.response.status === 401) {
            alert("Wrong email and/or password");
          }
          else if (err.response.status === 500) {
            alert("Server error");
          }
        })
    },
    updateSingupData(data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    },
    updateLoginData(data) {
      this.email = data.email;
      this.password = data.password;
    },
  },
};
</script>
