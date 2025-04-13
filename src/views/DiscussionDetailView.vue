<template>
  <nav-bar></nav-bar>

  <div class="container mt-4">
    <div v-if="discussion" class="card shadow-sm p-4">
      <h2 class="card-title">{{ discussion.title }}</h2>
      <h5 class="text-muted">{{ discussion.category }}</h5>
      <p class="card-text">{{ discussion.content }}</p>
      <small class="text-muted">Posted by {{ discussion.author }} | {{ formattedDate }}</small>
    </div>

    <hr class="my-4" />

    <div class="replies-section">
      <h4>Replies</h4>
      <ul class="list-group mb-4">
        <li
          v-for="reply in replies"
          :key="reply.id"
          class="list-group-item d-flex flex-column align-items-start"
        >
          <div v-if="editingReplyId !== reply.id" class="w-100">
            <strong class="text-primary">{{ reply.authorName }}</strong>: {{ reply.content }}
            <div v-if="reply.authorId === currentUserId" class="mt-2">
              <button class="btn btn-sm btn-outline-primary me-2" @click="startEditing(reply)">
                ✏️ Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteReply(reply.id)">
                🗑️ Delete
              </button>
            </div>
          </div>

          <div v-else class="w-100">
            <textarea
              v-model="editedContent"
              class="form-control mb-2"
              rows="3"
            ></textarea>
            <button class="btn btn-sm btn-success me-2" @click="saveEdit(reply.id)">💾 Save</button>
            <button class="btn btn-sm btn-secondary" @click="cancelEditing">✖️ Cancel</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="add-reply">
      <h4>Add a Reply</h4>
      <form @submit.prevent="addReply">
        <div class="mb-3">
          <textarea
            v-model="newReply"
            required
            class="form-control"
            placeholder="Write your reply here..."
            rows="4"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Post Reply</button>
        <div v-if="error" class="text-danger mt-2">{{ error }}</div>
      </form>
    </div>
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


