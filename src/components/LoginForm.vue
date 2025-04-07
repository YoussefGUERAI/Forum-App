<template>
    <div class="welcome container">
        <form @submit.prevent="handleLogin">
            <input type="email" required placeholder="Your email" v-model="email">
            <input type="password" required placeholder="Your password" v-model="password">
            <button>Login</button>
            <div class="error">{{ error }}</div>
        </form>
    </div>
  </template>
  
  <script setup>
  import useLogin from '@/composables/useLogin';
 
import { ref } from 'vue';

  
  const email = ref('')
  const password = ref('')
  const {error, login} = useLogin()

  const emit = defineEmits(['customEvent']);

  const handleLogin = async () => {
      const response = await login(email.value, password.value)
      if(!error.value){
        console.log("USER LOGGED SUCCESS")
        emit('login')
      }else {
        console.log("USER NOT LOGGED")
      }

  }
  </script>
  
<style>
</style>