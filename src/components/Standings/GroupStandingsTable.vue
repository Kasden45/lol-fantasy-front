<template>
  <div class="stat-card">
    <table class="stat-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>W</th>
          <th>L</th>
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
  },
};
</script>

<style scoped>
.stat-card {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 10px;
  overflow: hidden;
  max-width: 560px;
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
</style>
