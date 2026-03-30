<template>
  <div class="swap-loading-overlay">
    <div class="swap-spinner"></div>
  </div>
</template>

<script>
export default {
  name: "LazyLoader",
  props: {
    swapLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.swap-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: inherit;
}

.swap-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
