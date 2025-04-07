<template>
  <form @submit.prevent="handleSignUP">
    <input type="text" required placeholder="Display name" v-model="displayName">
    <input type="email" required placeholder="Your email" v-model="email">
    <input type="password" required placeholder="Your password" v-model="password">
    <button>Sign up</button>
    <div class="error">{{ error }}</div>
  </form>
  
</template>

<script setup>
import useSignup from '@/composables/useSignup';
import { ref } from 'vue';

const emit = defineEmits(['customEvent']);

const displayName = ref('')
const email = ref('')
const password = ref('')


const {error, signup} = useSignup()

const handleSignUP = async () => {
    await signup(email.value, password.value,displayName.value)
    if(!error.value){
      emit('singup')
    }
}


</script>

<style>

</style>