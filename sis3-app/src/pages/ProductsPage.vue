<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const products = ref([])
const loading = ref(true)
const error = ref('')

const router = useRouter()

onMounted(async () => {
  try {
    const response = await api.get('/products')
    products.value = response.data
  } catch (err) {
    error.value = 'Failed to load products. Please try again.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <h1>Our Products</h1>

    <p v-if="loading">Loading products...</p>

    <p v-else-if="error" class="error">
      {{ error }}
      <button @click="$router.go(0)">Try Again</button>
    </p>

    <div v-else class="product-grid">
      <article
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.image" :alt="product.title" />

        <h2>{{ product.title }}</h2>

        <p class="price">${{ product.price }}</p>

        <button @click="router.push(`/products/${product.id}`)">
          View Details
        </button>
      </article>
    </div>
  </section>
</template>
