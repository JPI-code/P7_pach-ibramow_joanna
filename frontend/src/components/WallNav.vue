<template>
  <div class="navbar">
    <div class="logo">
      <img class="logo-image" src="../assets/icon-left-font-monochrome-black.png">
    </div>

    <div class="nav">
    <router-link to="/Wall">Wall</router-link>
    <router-link
      :to="{
        //name has to be the same as COMPONENT vue
        name: 'Profile',
        params: {
          id: 'yourProfile',
        },
      }"
      >My Profile</router-link
    >
    <router-link to="/">Logout</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "WallNav",
};
</script>

<style>
.nav{
  display: flex;
}
</style>
