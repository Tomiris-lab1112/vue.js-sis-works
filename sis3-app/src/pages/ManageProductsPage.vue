<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const products = ref([])
const loading = ref(true)
const error = ref('')
const message = ref('')

const form = ref({
  title: '',
  price: '',
  description: '',
  category: "electronics",
  image: 'https://placehold.co/200x200?text=Product',
})

const editingId = ref(null)

async function loadProducts() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/products')
    products.value = response.data
  } catch {
    error.value = 'Could not load products. Please try again.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  editingId.value = null
  form.value = {
    title: '',
    price: '',
    description: '',
    category: 'electronics',
    image: 'https://placehold.co/200x200?text=Product',
  }
}

async function saveProduct() {
  error.value = ''
  message.value = ''

  if (!form.value.title.trim() || Number(form.value.price) <= 0) {
    error.value = 'Enter a title and a price greater than zero.'
    return
  }

  const data = {
    ...form.value,
    price: Number(form.value.price),
  }

  try {
    if (editingId.value !== null) {
      const response = await api.put(
        `/products/${editingId.value}`,
        data,
      )

      products.value = products.value.map((product) =>
        product.id === editingId.value
          ? { ...product, ...response.data, ...data }
          : product,
      )

      message.value = 'Product updated successfully!'
    } else {
      const response = await api.post('/products', data)

      products.value.unshift({
        ...data,
        ...response.data,
        id: response.data.id ?? Date.now(),
      })

      message.value = 'Product added successfully!'
    }

    resetForm()
  } catch {
    error.value = 'Could not save the product. Please try again.'
  }
}

function editProduct(product) {
  editingId.value = product.id
  form.value = {
    title: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
  }

  message.value = ''
  error.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteProduct(id) {
  error.value = ''
  message.value = ''

  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }

  try {
    await api.delete(`/products/${id}`)
    products.value = products.value.filter(
      (product) => product.id !== id,
    )
    message.value = 'Product deleted successfully!'
  } catch {
    error.value = 'Could not delete the product. Please try again.'
  }
}

onMounted(loadProducts)
</script>

<template>
  <section class="page">
    <h1>Manage Products</h1>
    <p>Add new products, edit existing products, or delete them.</p>

    <form class="product-form" @submit.prevent="saveProduct">
      <h2>{{ editingId !== null ? 'Edit Product' : 'Add Product' }}</h2>

      <label>
        Product name
        <input v-model="form.title" required />
      </label>

      <label>
        Price ($)
        <input
          v-model="form.price"
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </label>

      <label>
        Description
        <textarea v-model="form.description" required />
      </label>

      <label>
        Category
        <select v-model="form.category">
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelry</option>
          <option value="men's clothing">Men's clothing</option>
          <option value="women's clothing">Women's clothing</option>
        </select>
      </label>

      <div class="form-actions">
        <button type="submit">
          {{ editingId !== null ? 'Save Changes' : 'Add Product' }}
        </button>

        <button
          v-if="editingId !== null"
          type="button"
          class="secondary-button"
          @click="resetForm"
        >
          Cancel
        </button>
      </div>
    </form>

    <p v-if="loading">Loading products...</p>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="message" class="success">{{ message }}</p>

    <div v-if="!loading" class="manage-list">
      <article
        v-for="product in products"
        :key="product.id"
        class="manage-card"
      >
        <img :src="product.image" :alt="product.title" />

        <div class="manage-info">
          <h3>{{ product.title }}</h3>
          <p>${{ product.price }}</p>
          <button type="button" @click="editProduct(product)">
            Edit
          </button>
          <button
            type="button"
            class="delete-button"
            @click="deleteProduct(product.id)"
          >
            Delete
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
