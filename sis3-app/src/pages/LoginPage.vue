<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function login() {
  error.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    error.value = 'Please enter your email and password.'
    return
  }

  loginUser(email.value.trim())

  window.dispatchEvent(new Event('auth-change'))

  router.push('/manage')
}
</script>

<template>
  <section class="page">
    <form class="product-form" @submit.prevent="login">
      <h1>Login</h1>
      <p>Sign in to Mini Product Store.</p>

      <label>
        Email
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </label>

      <label>
        Password
        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">Login</button>
    </form>
  </section>
</template>
