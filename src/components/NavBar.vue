<template>
    <div class="navbar">

        <input id="logout" type="button" value="Logout" @click="logOut()">
        <div class="navbar-links">
        <router-link to="/home"><input type="button" value="Home"></router-link>
        <router-link to="/profile"><input type="button" value="Profile"></router-link>
        <router-link to="/create"><input type="button" value="New discussion"></router-link>
        <router-link to="/moderator" v-if="isModerator && loaded"><input type="button" value="Dashboard"></router-link>
        </div>
    </div>

</template>

<script setup>

</script>

<style scoped>
.navbar {
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 15px;
    border-radius: 10px; border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.navbar-links {
    display: flex;
    gap: 10px;
}
.navbar input[type="button"] {
    background-color: #237fe1;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
}
.navbar input[type="button"]:hover {
    background-color: #1a5bb8;
}
.navbar input[type="button"]:active {
    opacity: 75%;
}
#logout{
    width:100px;
    margin-left: 10px;
}

</style>

<script setup>
import {auth} from "@/firebase/config";
import { useUserRole } from  "@/composables/userRole";
import { useRouter } from "vue-router";

const router = useRouter();
const {isModerator, loaded} = useUserRole();

function logOut() {
    auth.signOut().then(() => {
        console.log("User signed out.");
        router.push("/login"); 
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

</script>
