<template>
    <div>
        <nav-bar></nav-bar>
        <h1>New Discussion</h1>
        <div class="form-group">
            <input type="text" v-model="title" placeholder="Title" required>
            <input type="text" placeholder="Category" v-model="category" required>
            <textarea v-model="content" placeholder="Discussion" required></textarea>
            <div class="buttons">
                <input type="button" value="Confirm" @click="confirm()">
                <router-link to="/home"><input type="button" value="Cancel"></router-link>
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