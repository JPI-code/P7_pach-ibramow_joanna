<template> 
<div>
     <main-nav />
    <form> 
        <LoginPanel 
        v-on:data-sent="updateLoginData"
        v-on:connect-user="login"/> 
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
    methods:{
        login(){
            console.log("send data from login");
            console.log(this.$data.email)
            console.log(this.$data.password)
            this.$axios.post("/auth/login", this.$data)
            .then((res)=> {
                sessionStorage.setItem("userID", res.data.userID)
                sessionStorage.setItem("token", res.data.token)
                this.$axios.defaults.headers.common["Authorization"] = 
                    "Bearer " + res.data.token;
                this.$router.push('/Wall')
            
            })
            .catch(err=>console.error(err.response.data))
        },
        updateLoginData(data){
            // console.log("updating data")
            this.email = data.email;
            this.password = data.password;
        }
    },
    mounted(){
        sessionStorage.removeItem("token")
        delete this.$axios.defaults.headers.common["Authorization"]
        document.title = "Login | Groupomania"
    }
}
</script>

