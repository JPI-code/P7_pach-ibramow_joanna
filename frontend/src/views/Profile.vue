<template>
  <div>
    <div class="wall-nav-for-my-profile">
    <wall-nav />
    </div>
    <div>
      <form class="changeForm" v-if="user.yourProfile === 1">
        <div class="input-content">
          <div class="input">
            <span>Set avatar:</span>
            <input type="file" accept="image/*" v-on:change="updateAvatar" />
          </div>
          <div class="input">
            <span>Set pseudonym:</span>
            <input type="text" name="pseudo" v-model="user.pseudo" />
          </div>
          <div class="input">
            <span>Set email:</span>
            <input type="email" name="email" v-model="user.email" />
          </div>
          <div class="input">
            <span>Set bio:</span>
            <textarea type="text" name="bio" v-model="user.bio"></textarea>
          </div>
          <div class="new-password-container">
            <span>Change password</span>
            <div class="input">
              <span>New password:</span>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                v-model="user.newPassword"
              />
            </div>
            <div class="input">
              <span>Current password:</span>
              <input
                type="password"
                id="password"
                name="password"
                v-model="user.password"
              />
            </div>
          </div>
          <div class="input-button-container">
            <button type="submit" v-on:click.prevent="updateProfile">
              SendData
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="user-info">
      <img class="user-profile-picture" :src="user.avatarUrl" />
      <p>{{ user.firstName }} {{ user.lastName }}</p>
      <p v-if="user.bio != null">{{ user.bio }}</p>
      <p v-if="user.pseudo != null">{{ user.pseudo }}</p>
      <p>{{ user.email }}</p>
    </div>
    <div class="account-delete-form" v-if="user.yourProfile === 1">
      <!-- user can delete his profile -->
      <form>
        <input type="password" id="passwordDelete" />
        <button v-on:click="deleteProfile" type="button">Delete account</button>
      </form>
    </div>
  </div>
</template>



<script>
import WallNav from "../components/WallNav.vue";
export default {
  name: "Profile",
  components: {
    WallNav,
  },
  data: () => {
    return {
      connected: true,
      user: {},
    };
  },
  methods: {
    getUser() {
      this.$axios
        //sessionStorage in this case: as long as user has token, sessionStorage keep his id
        .get(`/auth/${this.$route.params.id}`, {
          params: {
            id: this.$route.params.id,
            userID: sessionStorage.getItem("userID"),
          },
        })
        .then((data) => {
          this.user = data.data[0];
        })
        .catch((e) => {
          console.log(e);
        });
    },
    updateAvatar(event) {
      const image = event.target.files[0];
      let formData = new FormData();
      formData.append("image", image);
      formData.append("userID", sessionStorage.getItem("userID"));
      this.$axios
        .put("auth/modify", formData)
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
          userID: sessionStorage.getItem("userID"),
          email: email,
          pseudo: pseudo,
          bio: bio,
          password: password,
        };
      } else {
        data = {
          userID: sessionStorage.getItem("userID"),
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
      const password = document.getElementById("passwordDelete").value;
      this.$axios
        .delete("auth/delete", {
          data: {
            password: password,
            userID: sessionStorage.getItem("userID"),
          },
        })
        .then(() => {
          sessionStorage.removeItem("userID");
          sessionStorage.removeItem("token");
          delete this.$axios.defaults.headers.common["Authorization"];
          this.$router.push("/");
        })
        .catch((e) => {
          if (e.response.status === 401) {
            console.log("Invalid password");
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

<style>
.wall-nav-for-my-profile{
  display: flex;
  flex-flow:column;
  align-items: center;

}
.user-profile-picture{
  height: 200px;
  border-radius: 1.5rem;
}
.input-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  /* border: 2px solid blue; */
  gap: 0.5rem;
}
.input {
  display: flex;
  flex-direction: row nowrap;
  /* border: 2px solid cyan; */
  width: 50%;
  justify-content: space-between;
}
.new-password-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  /* border: 2px solid red; */
  gap: 0.5rem;
}
</style>