<template>
  <div class="stat-card">
    <table class="stat-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>W</th>
          <th>L</th>
          <template v-if="enrichment">
            <th class="maps-header">MW</th>
            <th class="maps-header">ML</th>
            <th class="form-header">Form</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="ranking in rankings" :key="ranking.ordinal">
          <tr v-for="team in ranking.teams" :key="team.id">
            <td class="rank-cell">{{ ranking.ordinal }}</td>
            <td class="team-cell">
              <img :src="team.image" :alt="team.code" class="team-logo" />
              <span class="team-name">{{ team.name }}</span>
              <span class="team-code">{{ team.code }}</span>
            </td>
            <td class="wins-cell">{{ team.record.wins }}</td>
            <td class="losses-cell">{{ team.record.losses }}</td>
            <template v-if="enrichment">
              <td class="maps-won-cell">
                {{ teamEnrichment(team.slug)?.mapsWon ?? '—' }}
              </td>
              <td class="maps-lost-cell">
                {{ teamEnrichment(team.slug)?.mapsLost ?? '—' }}
              </td>
              <td class="form-cell">
                <div class="form-inner" v-if="teamEnrichment(team.slug)">
                  <span
                    v-for="(result, i) in (teamEnrichment(team.slug).recentForm || [])"
                    :key="i"
                    class="form-pill"
                    :class="result === 'W' ? 'form-pill--win' : 'form-pill--loss'"
                    :title="result === 'W' ? 'Win' : 'Loss'"
                  ></span>
                  <span
                    class="streak-label"
                    :class="(teamEnrichment(team.slug).streak || '').endsWith('W') ? 'streak--win' : 'streak--loss'"
                  >
                    {{ teamEnrichment(team.slug).streak }}
                  </span>
                </div>
                <span v-else class="no-data">—</span>
              </td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "GroupStandingsTable",
  props: {
    rankings: {
      type: Array,
      required: true,
    },
    enrichment: {
      type: Object,
      default: null,
    },
  },
  methods: {
    teamEnrichment(teamSlug) {
      if (!this.enrichment || !teamSlug) return null;
      return this.enrichment[teamSlug] ?? null;
    },
  },
};
</script>

<style scoped>
.stat-card {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 10px;
  overflow: hidden;
  max-width: 780px;
  display: inline-block;
  justify-content: center;
}

.stat-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.stat-table thead tr {
  background: var(--BACKGROUND-DARK);
}

.stat-table th {
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--GREY-DARKER);
  text-align: left;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.stat-table tbody tr {
  border-bottom: 1px solid var(--GREY-DARKER);
  transition: background 0.15s;
}

.stat-table tbody tr:last-child {
  border-bottom: none;
}

.stat-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.stat-table td {
  padding: 9px 12px;
  color: var(--GREY);
}

.rank-cell {
  font-size: 12px;
  font-weight: 700;
  color: var(--GREY-DARKER);
  width: 32px;
}

.team-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}

.team-name {
  font-weight: 600;
  color: var(--GREY-LIGHT);
}

.team-code {
  font-size: 11px;
  color: var(--GREY-DARKER);
}

@media (max-width: 500px) {
  .team-name {
    display: none;
  }
  .team-code {
    font-size: 11px;
    color: var(--GREY);
  }
}

.wins-cell {
  font-weight: 700;
  color: var(--GREEN-LIGHT) !important;
}

.losses-cell {
  font-weight: 700;
  color: var(--RED-LIGHT) !important;
}

/* Maps record */
.maps-header {
  color: var(--GREY-DARKER);
}

.maps-won-cell {
  font-weight: 600;
  color: var(--GREEN-LIGHT);
  font-size: 12px;
}

.maps-lost-cell {
  font-weight: 600;
  color: var(--RED-LIGHT);
  font-size: 12px;
}

/* Form column */
.form-header {
  color: var(--GREY-DARKER);
  white-space: nowrap;
}

.form-cell {
  white-space: nowrap;
}

.form-inner {
  display: flex;
  align-items: center;
  gap: 3px;
}

.form-pill {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.form-pill--win {
  background-color: var(--GREEN-LIGHT);
}

.form-pill--loss {
  background-color: var(--RED-LIGHT);
  opacity: 0.7;
}

.streak-label {
  font-size: 11px;
  font-weight: 700;
  margin-left: 4px;
}

.streak--win {
  color: var(--GREEN-LIGHT);
}

.streak--loss {
  color: var(--RED-LIGHT);
}

.no-data {
  color: var(--GREY-DARKER);
  font-size: 12px;
}

/* Hide form column on very small screens */
@media (max-width: 500px) {
  .form-header,
  .form-cell {
    display: none;
  }
}
</style>
