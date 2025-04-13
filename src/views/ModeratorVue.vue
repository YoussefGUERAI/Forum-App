<template>
    <nav-bar></nav-bar>
    
    <div class="container mt-4">
    <h2>Reports</h2>
    <div class="card shadow-sm mb-3 p-3" v-for="report in reportList" :key="report.id">
        <div class="card-body">
            <h4 class="card-title"><strong>Title:</strong> {{ report.title }}</h4>
            <p class="mb-1"><strong>Type:</strong> {{report.type}} report</p>
            <div class="d-flex flex-row gap-2">
                <p class="mb-1"><strong>Status: </strong></p>
                <p v-if="isAvailable[report.id]" class="text-success"> <strong>Available</strong></p>
                <p v-else class="text-danger"><strong>Deleted</strong></p>
            </div>
            <p class="card-text text-muted mb-1"><strong>Reason:</strong> {{report.reason}} </p>
            <p class="mb-1"><strong>Reported by:</strong> {{modoList[report.reportAuthor]}}</p>
            <div class="d-flex gap-2">
                <router-link :to="{ path: report.targetPath }" v-if="isAvailable[report.id]">
                    <input type="button" value="Go to discussion" class="btn btn-sm btn-outline-primary" />
                </router-link>
                <input type="button" value="Delete report" class="btn btn-sm btn-outline-danger" @click="deleteReport(report.id)"/>
            </div>
        </div>
        
    </div>
    
    </div>
    
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import {onMounted } from "vue";
import { db } from "@/firebase/config";
import { ref } from "vue";

const reportList = ref([]);
const modoList = ref({});
const isAvailable = ref({});

onMounted(async () => {
  const reportSnapshot = await db.collection("reports").get();

  reportSnapshot.forEach(doc => {
    reportList.value.push({ ...doc.data(), id: doc.id });
  });

  const usersnapshot = await db.collection("users").get();

  usersnapshot.forEach(doc => {
    const userData = doc.data();
    if (userData.role === "moderator") {
      modoList.value[doc.id] = userData.name;
    }
  });

  for (const report of reportList.value) {
    if (report.type === "discussion") {
      const discussionDoc = await db.collection("discussions").doc(report.targetID).get();
      isAvailable.value[report.id] = discussionDoc.exists;
      report.targetPath = `/discussion/${report.targetID}`;
    } else if (report.type === "reply") {
      const replyDoc = await db.collection("replies").doc(report.targetID).get();
      isAvailable.value[report.id] = replyDoc.exists;

      if (replyDoc.exists) {
        const replyData = replyDoc.data();
        report.targetPath = `/discussion/${replyData.discussionId}`;
      } else {
        report.targetPath = "#";
      }
    }
  }

  console.log(modoList);
});


function deleteReport(reportId){
    if (confirm("Do you want to delete this report?")) {
        db.collection('reports').doc(reportId).delete().then(() => {
            console.log("Report deleted successfully");
            alert("Report deleted successfully");
            reportList.value = reportList.value.filter(report => report.id !== reportId);
        }).catch((error) => {
            console.error("Error deleting report: ", error);
        });
    }

}

</script>
