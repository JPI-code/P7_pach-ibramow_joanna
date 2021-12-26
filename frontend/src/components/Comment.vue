<template>
  <div class="comment">
    <slot name="commentDelete"></slot>
    <div class="comment">
      <div class="author">
        <p role="link" v-on:click="openProfile(userId)">
          <slot name="userAvatar"></slot>
          <slot name="userName"></slot>
          <slot name="userPseudo"></slot>
        </p>
      </div>

      <div class="content">
        <p>
          <slot name="commentBody"></slot>
        </p>
      </div>

      <div class="reactions">
        <i
          class="fas fa-thumbs-up"
          role="button"
          v-on:click="sendReactionUp"
        ></i>
        <span v-on:click="sendReactionUp">Like</span>
        <span>
          <slot name="commentUp"></slot>
        </span>
        <i
          class="fas fa-thumbs-down"
          role="button"
          v-on:click="sendReactionDown"
        ></i>
        <span v-on:click="sendReactionDown">Dislike</span>
        <span>
          <slot name="commentDown"></slot>
        </span>
      </div>

      <div class="date">
        <small>
          <slot name="commentDate"></slot>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: ["userId", "reaction"],
  data: function (){
    return {
      reactionUp: "",
      reactionDown: "",
    };
  },
  methods: {
    openProfile(userId) {
      this.$router.push({ name: "Profile", params: { id: userId } });
    },
    sendReactionUp() {
 if (this.reaction === 1) {
        this.$emit("reaction-none");
      } else {
        this.$emit("reaction-up");
      }
    },
    sendReactionDown() {
 if (this.reaction === -1) {
        this.$emit("reaction-none");
      } else {
        this.$emit("reaction-down");
      }
    },
updateReaction() {
      if (this.reaction === 1) {
        this.reactionUp = "reactionActive";
        this.reactionDown = "reactionNone";
      } else if (this.reaction === -1) {
        this.reactionUp = "reactionNone";
        this.reactionDown = "reactionActive";
      } else {
        this.reactionUp = "reactionNone";
        this.reactionDown = "reactionNone";
      }
    },
  },
   mounted() {
    this.updateReaction();
    // console.log(this.body)
  },
  updated() {
    this.updateReaction();
  },
};
</script>

<style>
.comment {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  border: 2px solid #e6e6e6;
}
</style>