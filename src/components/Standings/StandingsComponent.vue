<template>
  <div class="standings-component">
    <div v-if="loading" class="loading-state">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else>
      <div v-if="stages.length > 1" class="tabs-wrapper">
        <div class="tabs">
          <div
            v-for="(stage, i) in stages"
            :key="stage.id"
            class="tab"
            :class="{ active: selectedStageIndex === i }"
            @click="selectedStageIndex = i"
          >
            {{ stage.name }}
          </div>
        </div>
      </div>

      <div v-if="currentStage">
        <div
          v-for="section in currentStage.sections"
          :key="section.id"
          class="section"
        >
          <div v-if="currentStage.sections.length > 1" class="section-header">
            <div class="section-accent" />
            <h2 class="section-title">{{ section.name }}</h2>
          </div>
          <GroupStandingsTable
            v-if="section.type === 'group'"
            :rankings="section.rankings"
            :enrichment="enrichment"
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
      enrichment: null,
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
        const [standingsRes, enrichmentRes] = await Promise.all([
          this.axios.get(`${this.apiURL}Matches/${tournamentId}/standings`),
          this.axios.get(`${this.apiURL}Matches/${tournamentId}/standings-enrichment`).catch(() => null),
        ]);
        const standing = standingsRes.data.data.standings[0];
        this.stages = standing.stages;
        this.enrichment = enrichmentRes?.data?.enrichment ?? null;
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
.loading-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
  color: var(--PRIMARY-LIGHTER);
}

.error-state {
  color: var(--ERROR);
  padding: 24px 0;
  font-size: 14px;
}

/* Tabs — matches StatsView pattern */
.tabs-wrapper {
  margin-bottom: 32px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--GREY-DARKER);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}

.tab:hover {
  color: var(--GREY);
}

.tab.active {
  color: var(--PRIMARY-LIGHTER);
  border-bottom-color: var(--PRIMARY);
}

/* Sections */
.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-accent {
  width: 3px;
  height: 22px;
  border-radius: 4px;
  background: var(--PRIMARY);
  flex-shrink: 0;
}

.section-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}
</style>
