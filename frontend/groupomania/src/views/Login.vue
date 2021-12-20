<template> 
<div>
     <main-nav />
    <form> 
        <LoginPanel v-on:connect-user="login"/> 
    </form>


</div>
</template> 

<script>
import MainNav from '../components/MainNav.vue'
import LoginPanel from "../components/LoginPanel.vue" 

export default{
    name: "Login",
    components: {
        MainNav,
        LoginPanel
    },
    data:() => {
        return {
            email: "",
            password: ""
        }
    },
    method:{
        login(){
            this.$axios.post("/auth/login", this.$data)
            .then((res)=> {
            sessionStorage.setItem("token", res.data.token) 
            
            })
            .catch(err=>console.log(err))
        }
    }
}
</script>

