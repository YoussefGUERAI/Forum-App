<template>
    <div>
      <nav-bar></nav-bar>
  
      <div class="container mt-5" style="max-width: 600px;">
        <div class="card shadow-sm p-4">
          <h2 class="mb-4 text-center">New Report</h2>
  
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input
              id="title"
              type="text"
              v-model="title"
              class="form-control"
              disabled="true"
            />
          </div>
          <div class="mb-3">
            <label for="type" class="form-label">Type</label>
            <input
              id="reportType"
              type="text"
              v-model="reportType"
              class="form-control"
              disabled="true"
            />
          </div>
          <div class="mb-3">
            <label for="type" class="form-label">Reason</label>
            <input
              id="title"
              type="text"
              v-model="reason"
              placeholder="Enter reason for report"
              class="form-control"
              required
            />
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
import NavBar from "@/components/NavBar.vue";
import {db, auth} from "@/firebase/config";
import {ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()

const targetId = route.query.targetId;
const title = route.query.discussionTitle;
const reportType = route.query.type;
const reason = ref('');

const confirm = () => {
    db.collection('reports').add({
        created_at: new Date(),
        reason: reason.value,
        reportAuthor: auth.currentUser.uid,
        targetID: targetId,
        title: title,
        type: reportType,
    }).then(() => {
        alert('Report submitted successfully!');
        route.push('/home')
    }).catch((error) => {
        console.error("Error adding report: ", error);
    })
}

</script>
