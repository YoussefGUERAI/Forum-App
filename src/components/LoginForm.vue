<template>
    <div class="welcome container">
        <form @submit.prevent="handleLogin">
            <input type="email" required placeholder="Your email" v-model="email">
            <input type="password" required placeholder="Your password" v-model="password">
            <button>Login</button>
            <div class="error"> </div>
        </form>
    </div>
  </template>
  
  <script setup>
  /*import useLogin from '@/composables/useLogin'*/
 
import { ref } from 'vue';

  
  const email = ref('')
  const password = ref('')

  </script>
  
<style>
</style>