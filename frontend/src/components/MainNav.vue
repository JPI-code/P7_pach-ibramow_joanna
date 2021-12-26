<template>
  <div class="navbar">
    <div class="logo">
      <img class="logo-image" src="../assets/icon-left-font-monochrome-black.png" />
    </div>
    <div class="nav">
      <router-link class="r-link" to="/">Login</router-link>
      <router-link class="r-link" to="/Signup">Signup</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainNav",
};
</script>

<style>
.navbar {
  height: 100px;
  border: 2px solid lightgray;
  box-shadow: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
.logo{
  display: flex;
}
.logo-image {
  height: 100px;
  width: 100px;
}
.nav{
  display: flex;
  gap: 1rem;
}
.r-link{
  display: inline-block;
  background-color: #e6e6e6;
  padding: 0.5rem;
  border-radius: 20%;
}
</style>
