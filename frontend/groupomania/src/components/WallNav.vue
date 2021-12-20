<template>

    <div class="nav">
        
    <router-link to="/Wall">Wall</router-link>
    <router-link :to="{
        //name has to be the same as COMPONENT vue
        name: 'Profile',
        params: {
            id: 'MyProfile'
        }
    }
        ">My Profile</router-link>
    <router-link to="/">Logout</router-link>
    
    </div>
    
</template>

<script>
export default {
    name: "WallNav"
}
</script>