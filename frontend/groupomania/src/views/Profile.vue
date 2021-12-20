<template>
    <div>
        <wall-nav />
        <div>
        <form>
            <input 
            type="file" 
            accept="image/*"
            v-on:change="updateAvatar"  
            />
            <input 
            type="text" 
            name="pseudo"
            v-model="user.pseudo"
            />
            <input 
            type="email" 
            name="email"
            v-model="user.email"
            />
            <input 
            type="password" 
            name="password"
            v-model="user.password"
            />
            <textarea
            type="text" 
            name="bio"
            v-model="user.bio"
            ></textarea>
        </form>
        <div>
    <div>
        <img :src="user.avatarUrl">
        <p>{{user.firstName}} {{user.lastName}} </p>
        <p
        v-if="user.bio!=null">{{user.bio}} </p>
        <p v-if="user.pseudo!=null">{{user.pseudo}}</p>
        <p>{{user.email}}</p>
    </div>
    <div
    v-if="user.yourProfile===1">
        <!-- user can delete his profile -->
<form>
               <input 
            type="password" 
            name="passwordConfirmed"
    
            />
                <button 
                v-on:click = "deleteProfile"
                type="button"
                >Delete account</button>
            
            
</form>
        </div>
    </div>


</template>

<script>
import WallNav from "../components/WallNav.vue"
export default {
    name: "Pofile",
    components: {
        WallNav
    },
    data: ()=>
    {
        return {
            user: {}
        }
    },
    methods: {
        getUser:()=>
        {
            this.$axios.get(`/auth/${this.$route.params.id}`)
            .then((res)=>
        {
            this.user= res.data[0]
        })
        .catch(er=> {
            console.log(er)
        })
        }
    }
}
</script>

