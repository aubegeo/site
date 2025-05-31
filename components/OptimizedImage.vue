<template>
  <div class="optimized-image">
    <NuxtImg
      :src="src"
      :alt="alt"
      :preset="preset"
      :width="width"
      :height="height"
      :loading="loading"
      :class="classes"
      placeholder
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string;
  alt: string;
  preset?: 'blog' | 'thumbnail';
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  classes?: string;
}

withDefaults(defineProps<Props>(), {
  preset: 'blog',
  loading: 'lazy',
  classes: ''
})
</script>

<style scoped>
.optimized-image {
  position: relative;
  width: 100%;
}

.optimized-image img {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 0.5rem;
}
</style>