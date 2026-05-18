<template>
  <div class="standings-back">
    <div class="container py-4">
      <h4 class="text-white mb-4">Standings</h4>
      <StandingsComponent />
    </div>
  </div>
</template>

<script>
import StandingsComponent from "@/components/Standings/StandingsComponent.vue";

export default {
  name: "StandingsView",
  components: { StandingsComponent },
};
</script>

<style scoped>
.standings-back {
  background-color: #0a0a0a;
  min-height: 100vh;
  color: white;
}
</style>
