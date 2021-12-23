<template>
  <div>
    <slot name="commentDelete"></slot>
    <div class="comment">
      <div class="author">
        <p role="link" v-on:click="openProfile(userId)">
          <slot name="userName"></slot>
          <slot name="userAvatar"></slot>
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
          class="fas fa-thumb-up"
          role="button"
          :class="reactionUp"
          v-on:click="sendReactionUp"
        ></i>
        <span>Like</span>
        <span>
          <slot name="commentUp"></slot>
        </span>
        <i
          class="fas fa-thumb-down"
          role="button"
          :class="reactionDown"
          v-on:click="sendReactionDown"
        ></i>
        <span>Dislike</span>
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
  name:"Comment",
  props: ["userId", "reaction"],
  data: function(){
    return {
      reactionUp: "",
      reactionDown: "",
    }
  },
  methods: {
    openProfile(userId) {
      this.$router.push({ name: "Profile", params: { id: userId } });
    },
    sendReactionUp() {
      if (this.reaction === 1)
      {
        this.$emit("reaction-none")
      }
      else
      {
        this.$emit("reaction-up")
      }
    },
    sendReactionDown() {
      if (this.reaction === -1)
      {
        this.$emit("reaction-none")
      }
      else
      {
        this.$emit("reaction-down")
      }
    },
    updateReaction(){
      if (this.reaction === 1)
      {
        this.reactionUp = "active"
        this.reactionDown = "inactive"
      }
      else if (this.reaction === -1)
      {
        this.reactionUp = "inactive"
        this.reactionDown = "active"
      }
      else
      {
        this.reactionUp = "inactive"
        this.reactionDown = "inactive"
      }
    }
  },
  mounted(){
    this.updateReaction()
  },
  updated(){
    this.updateReaction()
  }
}
</script>