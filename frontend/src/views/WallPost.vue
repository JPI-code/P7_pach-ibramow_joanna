<template>
  <div v-if="!connected">
    <strong>Connection to user has not been established</strong>
  </div>
  <div v-else>
    <wall-nav />

    <post
      v-if="posts"
      v-bind:userId="posts.at(-1).userID"
      v-bind:reaction="posts.at(-1).yourReaction"
      v-bind:postID="posts.at(-1).postID"
      v-on:d-comment-input="displayCommentInput(posts.at(-1).postID)"
      v-on:reaction-down="sendReaction(posts.at(-1).postID, -1)"
      v-on:reaction-up="sendReaction(posts.at(-1).postID, 1)"
      v-on:reaction-none="sendReaction(posts.at(-1).postID, 0)"
    >
      <template v-slot:postDelete v-if="userRole == 'admin'">
        <i
          class="fas fa-times"
          role="button"
          v-on:click="deletePost(post.postId)"
        ></i>
        <span>Delete the post</span>
      </template>

      <template v-slot:postDelete v-else-if="posts.at(-1).yourPost > 0">
        <i
          class="fas fa-times"
          role="button"
          v-on:click="deletePost(posts.at(-1).postID)"
        ></i>
        <span>Delete the post</span>
      </template>

      <template
        v-slot:postGif
        v-if="posts.at(-1).gifUrl.includes('.gif') || posts.at(-1).gifUrl.includes('.jpg') || posts.at(-1).gifUrl.includes('.jpeg')"
      >
      <!-- {{ posts.at(-1).gifUrl.includes('.jpeg') }} -->
        <img v-bind:src="posts.at(-1).gifUrl" alt="Post image" />
      </template>

      
      <template v-slot:postLegend>
        <div>
          <p>{{ posts.at(-1).legend }}</p>
        </div>
      </template>

      <template v-slot:postDate>
        <small>{{ posts.at(-1).dateCreation }}</small>
      </template>
      <template v-slot:postUp>
        <span>{{ posts.at(-1).countUp }}</span>
      </template>
      <template v-slot:postDown>
        <span>{{ posts.at(-1).countDown }}</span>
      </template>

      <template v-slot:createComment>
        <create-comment
          v-on:comment-sent="updateComment"
          v-if="commentInputShow && commentID === posts.at(-1).postID"
        >
          <button type="submit" v-on:click.prevent="postComment(posts.at(-1).postID)">
            Send comment
          </button>
        </create-comment>
      </template>
    </post>

    <comment
    v-for="comment in comments"
    v-bind:key="comment.postID"
    v-bind:userId="comment.userID"
    v-on:reaction-down="sendReaction(comment.postID, -1)"
    v-on:reaction-up="sendReaction(comment.postID, 1)"
    v-on:reaction-none="sendReaction(comment.postID, 0)"
    v-bind:reaction="comment.yourReaction"
    >
      <template v-slot:commentDelete v-if="comment.yourPost > 0">
        <i
          class="fas fa-times"
          role="button"
          v-on:click="deleteComment(comment.postID)"
        ></i>
        <span>Delete the comment</span>
      </template>

      <template v-slot:userAvatar>
        <img
          v-bind:src="posts.at(-1).userAvatar"
          alt="User avatar"
        />
      </template>

      <template v-slot:userName> {{ posts.at(-1).name }} {{ posts.at(-1).surname }} </template>
      <template v-slot:userPseudo v-if="posts.at(-1).pseudo !== null">
        @{{ posts.at(-1).pseudo }}
      </template>

      <template v-slot:commentContent>
        <p>{{ comment.commentContent }}</p>
      </template>
      
      <template v-slot:commentDate>
        <small>{{ comment.commentDate }}</small>
      </template>
      <template v-slot:commentUp>
        <span>{{ comment.commentUp }}</span>
      </template>
      <template v-slot:commentDown>
        <span>{{ comment.commentDown }}</span>
      </template>
    </comment>

  </div>
</template>

<script>
import Comment from '../components/Comment.vue';
import CreateComment from "../components/CreateComment.vue";
import Post from "../components/Post.vue";
import WallNav from "../components/WallNav.vue";
export default {
  name: "Wall",
  components: {
    WallNav,
    Post,
    CreateComment,
    Comment,
  },
  data: function() {
    return {
      connected: true,
      posts: [false],
      commentInputShow: false,
      commentID: "",
      commentContent: "",
      userRole: "",
    };
  },
  computed: {
    comments(){
      return this.posts.filter(post => {
        return post.postId != this.$route.params.id
      })
    }
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
          console.log("Server error")
        }
        else {
          console.error(error.response)
          console.log("Unknown server error")
        }
      })
    },
    getPosts() {
      this.$axios.get("post")
      .then((response) => {
        this.posts = response.data;
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
          console.error(error.response)
        }
      })
    },
    sendPost(post) {
      const formData = new FormData();
      formData.append("image", post.image)
      formData.append("postLegend", post.postLegend)
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
        else{
          console.log("Error deleting post")
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
        .post("/post/" + postId + "/comment/", {body: this.commentContent})
        .then(() => {
          this.getPosts()
          this.commentInputShow = false;
        })
        .catch((error) => {console.log(error)})
      }
    },
  },
  created() {
    this.getUserRole();
  },
  mounted() {
    this.getPosts();
    this.getUserRole()
    document.title ="Groupomania - Post";
  },
};
</script>
