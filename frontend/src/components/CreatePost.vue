<template>
  <div>
    <form name="createPost">
      <div>
        <textarea
          name="legend"
          rows="3"
          maxlength="180"
          required
          placeholder="Write post here"
          v-model="legend"
        ></textarea>
      </div>
      <div class="custom-file">
        <input
          name="image"
          type="file"
          required
          v-on:change="getFile($event)"
        />
        <label for="image">Send file</label>
      </div>
      <button
        type="submit"
        v-on:click.prevent="sendPost()"
      >Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name:"CreatePost",
  data: function() {
    return {
      legend: "",
      image: "",
    };
  },
  methods: {
    sendPost: function() {
      const formValid = document
        .getElementsByName("createPost")[0]
        .checkValidity();
      if (formValid) {
        //console.log("Sent image: ", this.$data.image);
        this.$emit("post-sent", this.$data);
        document
          .getElementsByName("legend")[0].value = null;
        document
          .getElementsByName("image")[0].value = null;
      }
    },
    getFile: function(event) {
      this.$data.image = event.target.files[0];
    },
  },
}
</script>
