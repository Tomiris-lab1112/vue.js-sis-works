<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn, logoutUser } from './auth'

const router = useRouter()
const loggedIn = ref(isLoggedIn())

function updateAuth() {
  loggedIn.value = isLoggedIn()
}

function logout() {
  logoutUser()
  updateAuth()
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('auth-change', updateAuth)
})

onUnmounted(() => {
  window.removeEventListener('auth-change', updateAuth)
})
</script>

<template>
  <div>
    <header class="header">
      <router-link to="/" class="logo">Mini Store</router-link>

      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/products">Products</router-link>
        <router-link v-if="loggedIn" to="/manage">Manage</router-link>
        <router-link v-if="!loggedIn" to="/login">Login</router-link>
        <button v-else type="button" @click="logout">Logout</button>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>
