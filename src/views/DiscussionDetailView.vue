<template>
    <nav-bar></nav-bar>
    <div v-if="discussion">
    <h2>{{ discussion.title }}</h2>
    <h3> {{ discussion.category }}</h3>
    <p>{{ discussion.content }}</p>
    <small>Posted by {{ discussion.author }} | {{ formattedDate }}</small>

    <hr>

    <h3>Replies</h3>
    <ul>
        <li v-for="reply in replies" :key="reply.id">
            <div v-if="editingReplyId !== reply.id">
                <strong>{{ reply.authorName }}</strong>: {{ reply.content }}

                <template v-if="reply.authorId === currentUserId">
                <button @click="startEditing(reply)">✏️</button>
                <button @click="deleteReply(reply.id)">🗑️</button>
                </template>
            </div>

            <!-- Edit Mode -->
            <div v-else>
                <textarea v-model="editedContent" rows="3" cols="50"></textarea><br>
                <button @click="saveEdit(reply.id)">💾 Save</button>
                <button @click="cancelEditing">✖️ Cancel</button>
            </div>
            </li>
    </ul>

    <hr>

    <h3>Add a Reply</h3>
    <form @submit.prevent="addReply">
      <textarea v-model="newReply" required placeholder="Write your reply here..." rows="4" cols="50"></textarea><br>
      <button type="submit">Post Reply</button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>


    </div>
</template>
<script setup>

import { db , auth } from "@/firebase/config";
import { ref , onMounted , computed} from "vue";
import { useRoute } from "vue-router";
import NavBar from "../components/NavBar.vue";

const discussion = ref(null);
const route = useRoute();
const discussionId = route.params.id;
const replies = ref([]);
const newReply = ref("");
const error = ref("");
const currentUserId = auth.currentUser?.uid || "";
const editingReplyId = ref(null);
const editedContent = ref("");

const startEditing = (reply) => {
  editingReplyId.value = reply.id;
  editedContent.value = reply.content;
};

const saveEdit = async (replyId) => {
  try {
    await db.collection("replies").doc(replyId).update({
      content: editedContent.value,
      updatedAt: new Date()
    });
    editingReplyId.value = null;
    editedContent.value = "";
    await getReplies(); // Refresh list
  } catch (err) {
    error.value = err.message;
  }
};

const cancelEditing = () => {
  editingReplyId.value = null;
  editedContent.value = "";
};

const deleteReply = async (replyId) => {
  if (confirm("Are you sure you want to delete this reply?")) {
    try {
      await db.collection("replies").doc(replyId).delete();
      await getReplies(); // Refresh list
    } catch (err) {
      error.value = err.message;
    }
  }
};



// Fetch discussion details
const getDiscussion = async () => {
  const doc = await db.collection("discussions").doc(discussionId).get();
  if (doc.exists) {
    discussion.value = { id: doc.id, ...doc.data() };
  }
};

const formattedDate = computed(() => {
  if (!discussion.value?.created_at) return "";
  return new Date(discussion.value.created_at.seconds * 1000).toLocaleString();
});


// Fetch replies
const getReplies = async () => {
  const snapshot = await db.collection("replies")
    .where("discussionId", "==", discussionId)
    .get();

  replies.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Add new reply
const addReply = async () => {
  error.value = "";

  if (!newReply.value.trim()) {
    error.value = "Reply cannot be empty.";
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    error.value = "You must be logged in to reply.";
    return;
  }

  try {
    await db.collection("replies").add({
      content: newReply.value,
      createdAt: new Date(),
      discussionId: discussionId,
      authorId: user.uid,
      authorName: user.displayName || "Anonymous"
    });

    newReply.value = "";
    await getReplies(); // Refresh list
  } catch (err) {
    error.value = err.message;
  }
};


onMounted(async () => {
  await getDiscussion();
  await getReplies();
});


</script>

<style scoped>

</style>