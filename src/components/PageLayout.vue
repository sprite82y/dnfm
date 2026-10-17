<template>
  <div class="min-vh-100 bg-gradient">
    <header class="glass-card border-bottom border-secondary-subtle shadow-sm">
      <div class="container px-4 py-4">
        <div v-if="showBack" class="d-flex align-items-center justify-content-between">
          <router-link to="/" class="d-flex align-items-center gap-2 text-muted hover-text-dark text-decoration-none">
            <span>← 返回</span>
          </router-link>
          <div class="d-flex align-items-center gap-3">
            <span v-if="icon" class="fs-3">{{ icon }}</span>
            <h1 class="fs-2 fw-bold text-dark">{{ title }}</h1>
            <span v-if="icon" class="fs-3">{{ icon }}</span>
          </div>
          <div style="width: 4rem;"></div>
        </div>
        <div v-else class="text-center">
          <h1 class="fs-3 fw-bold text-dark">{{ title }}</h1>
        </div>
        <p v-if="subtitle" class="text-center text-muted mt-1">{{ subtitle }}</p>
      </div>
    </header>

    <main class="container px-4 py-5">
      <slot />
    </main>

    <slot name="overlay" />

    <footer class="glass-card border-top border-secondary-subtle mt-auto">
      <div class="container px-4 py-4">
        <p class="text-center text-muted small">工具集 © 2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  }
})
</script>
