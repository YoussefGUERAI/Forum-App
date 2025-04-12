<template>
  <div class="welcome container">
    <nav-bar></nav-bar>

    <div class="search">
        <input type="text" placeholder="Search..." v-model="search">
        <select v-model="selectedCategory">
            <option value="all">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
            </option>
        </select>

    </div>

    <div class="discs" v-for="discussion in filteredDiscussions" :key="discussion.id">
      <div class="disc">
        <h3>{{ discussion.title }}</h3>
        <p>{{ discussion.content }}</p>
        <p><strong>Category:</strong> {{ discussion.category }}</p>
        <p><strong>Created by:</strong> {{ discussion.author }}</p>
        <router-link :to="`/discussion/${discussion.id}`">View Discussion</router-link>
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
let categories = ref([]);

onMounted(() => {
  db.collection("discussions").get().then(snapshot => {
    discussions.value = snapshot.docs.map(doc => {
      const data = doc.data();
      if (!(data.category in categories.value)){
        categories.value.push({ id: data.category, name: data.category });
      }
      return {
        id: doc.id,
        ...data,
        author: data.author?.path || "unknown",
      }
    
    });
    console.log(categories.value);
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