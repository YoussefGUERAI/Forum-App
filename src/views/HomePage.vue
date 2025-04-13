<template>
  <div class="container mt-4">
    <nav-bar></nav-bar>

    
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
        <router-link
          class="btn btn-sm btn-outline-primary"
          :to="`/discussion/${discussion.id}`"
        >
          View Discussion
        </router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import NavBar from "@/components/NavBar.vue";
import { db } from "@/firebase/config";
import { ref, onMounted, computed } from "vue";

let discussions = ref([]);
let selectedCategory = ref("all");
let search = ref("");

onMounted(() => {
  db.collection("discussions").get().then(snapshot => {
    discussions.value = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      }
    });
    console.log(discussions);
  });
  }
);

const filteredDiscussions = computed(() => {
  return discussions.value.filter(disc => {
    const matchesCategory = selectedCategory.value === "all" || disc.category === selectedCategory.value;
    const matchesSearch = disc.title.toLowerCase().includes(search.value.toLowerCase()) || !search.value;
    return matchesCategory && matchesSearch;
  });
});

</script> 

<style>

</style>