<template>
  <div class="card">
    <!-- Именованный слот для заголовка[cite: 57, 63, 64] -->
    <div class="card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <!-- Основной слот[cite: 57, 63, 64] -->
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard'
}
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.card-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
  margin-bottom: 12px;
}
</style>