<template>
  <div class="standings-page">
    <div class="page-header">
      <div class="header-accent" />
      <div>
        <p class="eyebrow">
          {{
            this.tournaments_icons[this.$store.getters.getCurrentTournamentId]
          }}
          Fantasy
        </p>
        <h1 class="page-title">Standings</h1>
      </div>
    </div>
    <StandingsComponent />
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
.standings-page {
  min-height: 100vh;
  background: var(--BACKGROUND-DARK);
  padding: 40px 32px;
  font-family: "DM Sans", sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.header-accent {
  width: 4px;
  height: 52px;
  border-radius: 4px;
  background: linear-gradient(180deg, var(--PRIMARY), var(--PRIMARY-LIGHTER));
  flex-shrink: 0;
}

.eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--PRIMARY);
}

.page-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--GREY-LIGHT);
  line-height: 1;
}
</style>
