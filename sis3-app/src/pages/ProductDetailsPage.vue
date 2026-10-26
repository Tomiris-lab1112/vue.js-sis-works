<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const response = await api.get(`/products/${route.params.id}`)
    product.value = response.data
  } catch (err) {
    error.value = 'Failed to load product details.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="page">
    <p v-if="loading">Loading product details...</p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <article v-else-if="product" class="product-details">
      <img :src="product.image" :alt="product.title" />

      <div>
        <h1>{{ product.title }}</h1>
        <p>{{ product.description }}</p>
        <h2 class="price">${{ product.price }}</h2>
        <p>Category: {{ product.category }}</p>

        <router-link to="/products" class="button">
          Back to Products
        </router-link>
      </div>
    </article>
  </section>
</template>
