<template>
  <div>
    <slot name="deletePost"></slot>
    <div class="post">
      <div class="author">
        <p role="link" v-on:click="openProfile(userId)">
          <slot name="userName"></slot>
          <slot name="userAvatar"></slot>
          <slot name="userPseudo"></slot>
        </p>
      </div>
      <div class="content">
        <slot name="postLegend"></slot>
        <div class="postGif" role="link" v-on:click="openPost(postId)">
          <slot name="postGif"></slot>
        </div>
      </div>
      <div class="reactions">
        <i
          class="fas fa-angle-up fa-lg"
          role="button"
          :class="reactionUp"
          v-on:click="sendReactionUp"
        ></i>
        <span v-on:click="sendReactionUp">Like</span>
        <span>
          <slot name="postUp"></slot>
        </span>
        <i
          class="fas fa-angle-down fa-lg"
          role="button"
          :class="reactionDown"
          v-on:click="sendReactionDown"
        ></i>
        <span v-on:click="sendReactionDown">Dislike</span>
        <span>
          <slot name="postDown"></slot>
        </span>
      </div>
    </div>
    <div class="footer">
      <p>
        <a class="d-md-none">
          <i
            class="fas fa-comments"
            role="button"
            v-on:click="displayCommentInput"
          ></i>
          <span v-on:click="displayCommentInput" >Comment the post</span>
        </a>
        <slot name="createComment"></slot>
      </p>
      <div class="date">
        <small>
          <slot name="postDate"></slot>
        </small>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "Post",
  props: ["postId", "userId", "reaction"],
  data() {
    return {
      reactionUp: "",
      reactionDown: "",
    };
  },
  methods: {
    openProfile(userId) {
      this.$router.push({
        name: "Profile",
        params: {
        id: userId,
        },
      });
    },
    openPost(postId) {
      console.log(postId)
      this.$router.push({
        name: "Post",
        params: {
        id: postId
        },
      });
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
    displayCommentInput() {
      this.$emit("display-comment-input", this.postId);
    },
    updateReaction() {
      if (this.reaction === 1) {
        this.reactionUp = "active";
        this.reactionDown = "inactive";
      } else if (this.reaction === -1) {
        this.reactionUp = "inactive";
        this.reactionDown = "active";
      } else {
        this.reactionUp = "inactive";
        this.reactionDown = "inactive";
      }
    },
  },
  mounted() {
    this.updateReaction();
  },
  updated() {
    this.updateReaction();
  },
}
</script>

<style>
.post {
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e6e6e6;
  background-color: #fff;
  /* width: 80%; */
}
.postGif {
  width: 100%;
  height: auto;
  max-height: 300px;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid #e6e6e6;
  background-color: #fff;
}
.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
</style>
