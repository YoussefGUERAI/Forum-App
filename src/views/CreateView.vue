<template>
    <div>
      <nav-bar></nav-bar>
  
      <div class="container mt-5" style="max-width: 600px;">
        <div class="card shadow-sm p-4">
          <h2 class="mb-4 text-center">Create a New Discussion</h2>
  
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input
              id="title"
              type="text"
              v-model="title"
              placeholder="Enter a discussion title"
              class="form-control"
              required
            />
          </div>
  
          <div class="mb-3">
            <label for="category" class="form-label">Category</label>
            <input
              id="category"
              type="text"
              v-model="category"
              placeholder="e.g. Vue.js, Firebase, Design"
              class="form-control"
              required
            />
          </div>
  
          <div class="mb-4">
            <label for="content" class="form-label">Discussion</label>
            <textarea
              id="content"
              v-model="content"
              placeholder="Write your discussion content here..."
              class="form-control"
              rows="5"
              required
            ></textarea>
          </div>
  
          <div class="d-flex justify-content-between">
            <button class="btn btn-success" @click="confirm()">Confirm</button>
            <router-link to="/home" class="btn btn-outline-secondary">Cancel</router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
import NavBar from '../components/NavBar.vue'
import { db, auth } from '../firebase/config.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
let title = ref("")
let category = ref("")
let content = ref("")

const confirm = () => {
    db.collection('discussions').add({
        title : title.value,
        category : category.value,
        content : content.value,
        created_at : new Date(),
        author: auth.currentUser.displayName
        
    }).then(() => {
        
        console.log("Discussion created");
        
        router.push('/home');
    }).catch((error) => {
        console.error("Error creating discussion: ", error);
    });
}

</script>