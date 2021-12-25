<template> 
<div>
    <main-nav />
    <img class="logo" src="assets/icon-left-front-monochrome-black.png" alt="Logo" title="Grouporama" />
    <form onsubmit="return false"> 
        <SignupPanel
        v-on:data-sent="updateSingupData"
        /> 
        <LoginPanel 
        v-on:connect-user="signup"
        v-on:data-sent="updateLoginData"/> 
    </form>
</div>
</template> 

<script>
import MainNav from '../components/MainNav.vue'
import LoginPanel from "../components/LoginPanel.vue" 
import SignupPanel from "../components/SignupPanel.vue" 

export default{
    name: "Signup",
    components: {
        LoginPanel, 
        SignupPanel,
        MainNav
    },
    data:function() {
        return {
            firstName: "", 
            lastName: "",
            email: "",
            password: "",
            avatarUrl: ""
        }
    },
    methods:{
        signup(){
            console.log("send data from signup");
            console.log(this.$data.email)
            console.log(this.$data.password)
            console.log(this.$data.firstName)
            console.log(this.$data.lastName)
            this.$axios.post("/auth/signup", this.$data)
            .then((res)=> {
                console.log(`send to server ${this.$data}`)
                //this will redirect user to login page
                this.$router.push('/')
            })
            .catch(err=>console.error(err.response.data))
        },
        updateSingupData(data){
            this.firstName = data.firstName;
            this.lastName = data.lastName;
        },
        updateLoginData(data){
            this.email = data.email;
            this.password = data.password;
        }
    }
}
</script>

<style>
/* to be added */
</style>

