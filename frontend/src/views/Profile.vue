<template>
  <div>
    <wall-nav />
    <div>
      <form v-if="user.yourProfile === 1">
        <input type="file" accept="image/*" v-on:change="updateAvatar(event)" />
        <input type="text" name="pseudo" v-model="user.pseudo" />
        <input type="email" name="email" v-model="user.email" />
        <input type="password" name="password" v-model="user.password" />
        <textarea type="text" name="bio" v-model="user.bio"></textarea>
      </form>
    </div>
    <div>
      <img :src="user.avatarUrl" />
      <p>{{ user.firstName }} {{ user.lastName }}</p>
      <p v-if="user.bio != null">{{ user.bio }}</p>
      <p v-if="user.pseudo != null">{{ user.pseudo }}</p>
      <p>{{ user.email }}</p>
    </div>
    <div v-if="user.yourProfile === 1">
      <!-- user can delete his profile -->
      <form>
        <input type="password" id="passwordDelete" />
        <button v-on:click="deleteProfile" type="button">Delete account</button>
      </form>
    </div>
  </div>
</template>

<script>
import WallNav from '../components/WallNav.vue';
export default {
  name: "Profile",
  components: {
    WallNav
  },
  data: () => {
    return {
      connected: true,
      messageError: null,
      user: {},
    };
  },
  methods: {
    getUser() {
      this.$axios
      //sessionStorage in this case: as long as user has token, sessionStorage keep his id
        .get(`auth/${this.$route.params.id}`, {params:{userID: sessionStorage.getItem("userID")}})
        .then(function(data) {
          this.user = data.data[0];
        })
        .catch((e) => {
          console.log(e)
        });
    },
    updateAvatar(event) {
      const image = event.target.files[0];
      const formData = new FormData();
      formData.append("image", image);
      this.$axios
        .put("user/modify", formData)
        .then(() => {
          this.getUser();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateProfile() {
      // Update les autres infos
      const email = this.user.email;
      const pseudo = this.user.pseudo;
      const bio = this.user.bio;
      const password = document.getElementById("password").value;
      const newPassword = document.getElementById("newPassword").value;
      let data;

      if (newPassword === "") {
        data = {
          email: email,
          pseudo: pseudo,
          bio: bio,
          password: password,
        };
      } else {
        data = {
          email: email,
          pseudo: pseudo,
          bio: bio,
          password: password,
          newPassword: newPassword,
        };
      }
      this.$axios
        .put("auth/modify", data)
        .then(() => {
          this.$router.go();
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.messageError = "Invalid password";
          }
        });
    },
    deleteProfile() {
      // Supprime l'utilisateur
      const password = document.getElementById("passwordDelete").value;
      this.$axios
        .delete("auth/delete", { data: { password: password } })
        .then(() => {
          sessionStorage.removeItem("token");
          delete this.$axios.defaults.headers.common["Authorization"];
          this.$router.push({ name: "/" });
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.messageError = "Invalid password";
          }
        });
    },
  },
  mounted() {
    // Récupère les posts et défini le titre
    this.getUser();
    document.title = "Profile | Groupomania"; 
  },
  watch: {
    "$route.params.id": function () {
      this.getUser();
    },
  },
};
</script>
