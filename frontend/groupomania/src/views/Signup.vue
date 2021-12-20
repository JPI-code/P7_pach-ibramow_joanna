<template> 
<div>
    <main-nav />
    <form> 
        <SignupPanel /> 
        <!-- <LoginPanel v-on:connect-user="signup"/>  -->
    </form>


</div>
</template> 

<script>
import MainNav from '../components/MainNav.vue'
// import LoginPanel from "../components/LoginPanel.vue" 
import SignupPanel from "../components/SignupPanel.vue" 

export default{
    name: "Signup",
    components: {
        // LoginPanel, 
        SignupPanel,
        MainNav
    },
    data:() => {
        return {
            firstName: "", 
            lastName: "",
            email: "",
            password: ""
        }
    },
    method:{
        signup(){
            this.$axios.post("/auth/signup", this.$data)
            .then(()=> {
                //this will redirect user to login page
                this.$router.push('/')
            })
            .catch(err=>console.log(err))
        }
    }
}
</script>

