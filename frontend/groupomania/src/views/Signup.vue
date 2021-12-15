<template> 
<div>
    <form> 
        <SignupPanel /> 
        <LoginPanel v-on:connect-user="signup"/> 
    </form>








</div>
</template> 

<script>
import LoginPanel from "../components/LoginPanel.vue" 
import SignupPanel from "../components/SignupPanel.vue" 

export default{
    name: "Signup",
    components: {
        LoginPanel, SignupPanel
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
            
        }
    }
}
</script>

