<template> 
<div> 
        <input
          class="form-control text-center"
          type="text"
          placeholder="Votre mail"
          id="email"
          required
          maxlength="100"
          aria-label="Entrez votre mail"
          v-model="email"
          v-on:input="sendData"
        />

        <input
          class="form-control text-center"
          type="text"
          placeholder="Votre mot de passe"
          id="password"
          required
          maxlength="30"
          aria-label="Entrez votre mot de passe"
          v-model="password"
          v-on:input="sendData"
        />
     
      <button
      type="button"
      v-on:click="connectUser"> 
      SUBMIT
      </button>
</div>

</template>

<script>
export default {
    name: "SignupPanel",
    data() {
        return {
            email: "",
            password: "",
        }
    },

 methods: {
    sendData() { // Envois des données au parent pour traiter l'envois à l'API
    //   const firstNameValid = document
    //     .getElementById("firstName")
    //     // .checkValidity();
    //   const lastNameValid = document.getElementById("lastName").checkValidity();
    //   if (firstNameValid && lastNameValid) {
      console.log("sending data from login panel");
      this.$emit("data-sent", this.$data);
    //   }
    },
    connectUser(){
        const emailValid = document.getElementById("email").checkValidity();
        const passwordValid = document.getElementById("password").checkValidity();
        if (emailValid && passwordValid) {
            //return the event when sb is connected
        this.$emit("connect-user", this.$data);
      }
    }
  },

}
</script>
