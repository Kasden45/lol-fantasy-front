<script>
export default {
  props: {
    openModal: Boolean,
    title: String
  },
  watch: {
    // Watch for changes in the 'playerDetails' prop
    openModal: {
      handler(newopenModal, oldopenModal) {
        // React to prop changes here
        // playerDetails = 
        console.log(newopenModal, oldopenModal);
        this.open = this.openModal;
      },
      immediate: true, // This will trigger the handler immediately when the component is created
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal', 'details')
    }
  },
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <!-- <button @click="open = true">Open Modal</button> -->

 <Teleport to="body">
  <div v-if="open" class="modal modal-details ">
    <div class="modal-header">{{ title ? title : 'Modal' }}</div>
    <button class="btn-close" @click="closeModal()"></button>
    <slot></slot>
  </div>
</Teleport>
</template>

<style scoped>
.modal-header {
  width: 100%;
  text-align: center;
  font-weight: 700;
  border-bottom: 3px solid var(--PRIMARY);
  margin-bottom: 10px;
}
.modal {
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 10%;
  
  width: 80vw;
  max-height: 75%;
  display: block;
}
.modal-details {
  background-color: white;
  opacity: 100%;
  border-radius: 10px;
  border: 5px solid var(--PRIMARY);
  /* border-color: var(--PRIMARY); */
}
</style>