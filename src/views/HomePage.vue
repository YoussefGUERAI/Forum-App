<template>
  
    <nav-bar></nav-bar>

    <div class="container mt-4">
    <div class="card p-3 shadow-sm mb-4">
      <div class="row g-3">
        <div class="col-md-8">
          <input
            class="form-control"
            type="text"
            placeholder="Search discussions..."
            v-model="search"
          />
        </div>
        <div class="col-md-4">
          <select class="form-select" v-model="selectedCategory">
            <option value="all">All Categories</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <h2>Discussions</h2>
    <div
      class="card shadow-sm mb-3 p-3"
      v-for="discussion in filteredDiscussions"
      :key="discussion.id"
    >
      <div class="card-body">
        <h4 class="card-title">{{ discussion.title }}</h4>
        <p class="card-text text-muted mb-1">{{ discussion.content }}</p>
        <p class="mb-1"><strong>Category:</strong> {{ discussion.category }}</p>
        <p class="mb-2"><strong>Created by:</strong> {{ discussion.author }}</p>
        <div class="d-flex gap-2">
        <router-link
          class="btn btn-sm btn-outline-primary"
          :to="`/discussion/${discussion.id}`"
        >
          View Discussion
        </router-link>
        <input v-if="isModerator && loaded" class="btn btn-sm btn-outline-danger" type="button" value="Delete as mod" @click="deleteAsMod(discussion.id)"/>

        <router-link :to="{
          path: 'report',
          query: {
            targetId: discussion.id,
            discussionTitle: discussion.title,
            type: 'discussion'
          }

        }">
          <input v-if="isModerator" type="button" value="Report" class="btn btn-sm btn-outline-danger" />
        </router-link>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import NavBar from "@/components/NavBar.vue";
import { db } from "@/firebase/config";
import { ref, onMounted, computed } from "vue";
import { useUserRole } from "@/composables/userRole";

let discussions = ref([]);
let selectedCategory = ref("all");
let search = ref("");
let categories = ref([]);
const {isModerator, loaded} = useUserRole();

onMounted(() => {
  db.collection("discussions").get().then(snapshot => {
    discussions.value = snapshot.docs.map(doc => {
      const data = doc.data();

      const newcategory = data.category.trim().toLowerCase();
      if (!categories.value.some(category => category.name === newcategory)){
        categories.value.push({ id: newcategory, name: newcategory });
      }
      return {
        id: doc.id,
        ...data,
      }
    
    });
    console.log(categories.value);
  });
  }
);

const filteredDiscussions = computed(() => {
  const selected = selectedCategory.value.trim().toLowerCase();
  const searchQuery = search.value.trim().toLowerCase();

  return discussions.value.filter(disc => {
    const discCategory = disc.category?.trim().toLowerCase();
    const discTitle = disc.title?.trim().toLowerCase();

    const matchesCategory = selected === "all" || discCategory === selected;
    const matchesSearch = !searchQuery || discTitle.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });
});

const deleteAsMod = async (discussionId) => {
  if (confirm("Are you sure you want to delete this discussion?")){

    try{
      //removing replies
      const replies = await db.collection('replies')
      .where('discussionId', '==', discussionId).get();

      const toRemove = db.batch();
      replies.forEach(doc => {
        toRemove.delete(doc.ref);
      })
      await toRemove.commit();
      console.log("Replies deleted successfully.");
      //removing discussion
      db.collection("discussions").doc(discussionId).delete();
      alert("Discussion deleted successfully.");
      //updating discussion list
      discussions.value = discussions.value.filter(d => d.id !== discussionId);
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
    
  }
  console.log(isModerator.value);
}

</script> 

<style>

</style>