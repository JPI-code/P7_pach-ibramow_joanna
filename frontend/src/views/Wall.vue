<template>
  <div v-if="!connected">
    <strong>Connection to user has not been established</strong>
  </div>
  <div v-else>
    
    <wall-nav />

    <create-post v-on:post-sent="sendPost" />

    <post
      v-for="post in posts"
      v-bind:key="post.postID"
      v-bind:postID="post.postID"
      v-bind:userID="post.userID"
      v-bind:reaction="post.yourReaction"
      v-on:reaction-up="sendReaction(post.postID, 1)"
      v-on:reaction-down="sendReaction(post.postID, -1)"
      v-on:reaction-none="sendReaction(post.postID, 0)"
      v-on:display-comment-input="displayCommentInput(post.postID)"
    >
      <template v-slot:postDelete v-if="userRole == 'admin'">
        <i
          class="fas fa-times"
          aria-hidden="true"
          title="Delete the post"
          role="button"
          v-on:click="deletePost(post.postId)"
        ></i>
        <span class="sr-only">Delete the post</span>
      </template>

      <template v-slot:postDelete v-else-if="post.yourPost > 0">
        <i
          class="fas fa-times"
          aria-hidden="true"
          title="Delete the post"
          role="button"
          v-on:click="deletePost(post.postId)"
        ></i>
        <span class="sr-only">Delete the post</span>
      </template>

      <template
        v-slot:postGif
        v-if="
          post.gifUrl.includes('.gif') ||
          post.gifUrl.includes('.jpg') ||
          post.gifUrl.includes('.jpeg')
        "
      >
        <img :src="post.gifUrl" alt="Post image" />
      </template>

      <template v-slot:userAvatar>
        <img
          v-bind:src="post.avatarUrl"
          alt="User avatar" 
        />
      </template>

      <template v-slot:userName> {{ post.firstName }} {{ post.lastName }} </template>
      <template v-slot:userPseudo v-if="post.pseudo !== null">
        {{ post.pseudo }}
      </template>
      <template v-slot:postLegend>
        <div>
          <p>{{ post.legend }}</p>
        </div>
      </template>

      <template v-slot:postDate>
        <small>{{ post.dateCreation }}</small>
      </template>
      <template v-slot:postUp>
        <span>{{ post.countUp }}</span>
      </template>
      <template v-slot:postDown>
        <span>{{ post.countDown }}</span>
      </template>

      <template v-slot:createComment>
        <create-comment
          v-on:comment-sent="updateComment"
          v-if="commentInputShow && commentID === post.postId"
        >
          <template v-slot:sendButton>
          <button type="submit" v-on:click.prevent="postComment(post.postID)">
            Send comment
          </button>
          </template>
        </create-comment>
      </template>
    </post>
  </div>
</template>

<script>
import CreateComment from '../components/CreateComment.vue';
import CreatePost from "../components//CreatePost.vue";
import Post from "../components//Post.vue";
import WallNav from "../components/WallNav.vue";
export default {
  name: "Wall",
  components: {
    WallNav,
    CreatePost,
    Post,
    CreateComment,
  },
  data: function() {
    return {
      connected: true,
      posts: [],
      commentInputShow: false,
      commentID: "",
      commentContent: "",
      userRole: "",
    };
  },
  methods: {
    getUserRole() {
      this.$axios.get("/auth/role")
      .then((response) => {
        this.userRole = response.data[0].role;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // this.connected = false;
          console.log("Connection to server failed")
        }
        else if(error.response.status === 500) {
          console.log(error.response.data)
        }
        else {
          console.log("Unknown server error")
        }
      })
    },
    getPosts() {
      console.log("trying to get posts")
      this.$axios.get("/post")
      .then((response) => {
        this.posts = response.data;
        console.log(response.data)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // this.connected = false;
          console.log("Connection to server failed")
        }
        else if(error.response.status === 500) {
          console.log("Server error")
        }
        else {
          console.log("Unknown server error")
        }
      })
    },
    sendPost(post) {
      const formData = new FormData();
      formData.append("image", post.image);
      formData.append("legend", post.legend);
      formData.append("userID", sessionStorage.getItem("userID"));
      this.$axios.post("/post", formData)
      .then(() => {
        this.getPosts()
      })
      .catch((error) => {console.log(error)})
    },
    deletePost(postId){
      this.$axios.delete("/post/" + postId)
      .then(() => {
        const index = this.$data.posts.findIndex(post => post.postId === postId);
        if (index != -1) {
          this.$data.posts.splice(index, 1);
        }
      })
      .catch((error) => {console.log(error)})
    },
    sendReaction(postId, reaction) {
      this.$axios.post("/post/" + postId + "/react/", { reaction, userID:sessionStorage.getItem("userID") })
      .then(() => {
        this.getPosts()
      })
      .catch((error) => {console.log(error)})
    },
    displayCommentInput(postId) {
      this.commentInputShow = true;
      this.commentID = postId;
    },
    updateComment(content) {
      this.commentContent = content.body;
    },
    postComment(postId) {
      const formValid = document.getElementsByName("commentForm")[0]
      .checkValidity();
      if (formValid) {
        this.$axios
        .post("/post/" + postId + "/comment/", {content: this.commentContent, userID: sessionStorage.getItem("userID")})
        .then((that=this) => {
          //that = this: to avoid arrow function before this, in order not to change "this" context
          that.commentInputShow = false;
        })
        .catch((error) => {console.log(error)})
      }
    },
  },
  created() {
    this.getUserRole();
  },
  mounted() {
    console.log("Wall mounted")
    this.getPosts();
    this.getUserRole();
    document.title = "Groupomania - Wall"
  },
};
</script>

<style>
.post-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}
.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 30%;
  margin-right: 1rem;
}
</style>

