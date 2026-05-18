<template>
  <div class="standings-component">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-light" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger m-3">{{ error }}</div>

    <div v-else>
      <div v-if="stages.length > 1" class="stage-tabs d-flex gap-2 flex-wrap p-3">
        <button
          v-for="(stage, i) in stages"
          :key="stage.id"
          class="btn btn-sm"
          :class="selectedStageIndex === i ? 'btn-warning' : 'btn-outline-secondary'"
          @click="selectedStageIndex = i"
        >
          {{ stage.name }}
        </button>
      </div>

      <div v-if="currentStage">
        <div
          v-for="section in currentStage.sections"
          :key="section.id"
          class="standings-section p-3"
        >
          <h6
            v-if="currentStage.sections.length > 1"
            class="text-muted mb-3 text-uppercase small"
          >
            {{ section.name }}
          </h6>
          <GroupStandingsTable
            v-if="section.type === 'group'"
            :rankings="section.rankings"
          />
          <BracketView
            v-else-if="section.type === 'bracket'"
            :columns="section.columns"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GroupStandingsTable from "./GroupStandingsTable.vue";
import BracketView from "./BracketView.vue";

export default {
  name: "StandingsComponent",
  components: { GroupStandingsTable, BracketView },
  data() {
    return {
      stages: [],
      selectedStageIndex: 0,
      loading: false,
      error: null,
    };
  },
  computed: {
    currentStage() {
      return this.stages[this.selectedStageIndex] || null;
    },
  },
  mounted() {
    this.fetchStandings();
  },
  methods: {
    async fetchStandings() {
      this.loading = true;
      this.error = null;
      try {
        const tournamentId = this.$store.state.currentTournamentId;
        const response = await this.axios.get(`/Matches/${tournamentId}/standings`);
        const standing = response.data.data.standings[0];
        this.stages = standing.stages;
      } catch {
        this.error = "Failed to load standings.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.standings-section + .standings-section {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 8px;
}
</style>
