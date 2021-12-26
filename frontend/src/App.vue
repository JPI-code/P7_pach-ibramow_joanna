<template>
  <div id="app"><router-view /></div> <!-- to launch all other Vue elements-->
  </template>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img {
  width:150px;
  height:150px;
  border: solid 2px white;
  border-radius: 1rem;
    box-shadow:
       inset 0 -3em 3em rgba(0,0,0,0.1),
             0 0  0 2px rgb(255,255,255),
             0.3em 0.3em 1em rgba(0,0,0,0.3);
}
</style>


<script>
export default {
  mounted() {
    let fontAwesomeScript = document.createElement("script");
    fontAwesomeScript.src = "https://kit.fontawesome.com/c5c10cb967.js";
    document.head.appendChild(fontAwesomeScript);
  },
}
</script>
