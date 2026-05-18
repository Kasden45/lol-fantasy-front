<template>
  <div class="group-standings">
    <table class="table table-dark table-hover mb-0">
      <thead>
        <tr>
          <th class="rank-col">#</th>
          <th>Team</th>
          <th class="text-center">W</th>
          <th class="text-center">L</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="ranking in rankings" :key="ranking.ordinal">
          <tr v-for="team in ranking.teams" :key="team.id">
            <td class="rank-col text-muted">{{ ranking.ordinal }}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <img :src="team.image" :alt="team.code" class="team-logo" />
                <span class="team-name d-none d-sm-inline">{{ team.name }}</span>
                <span class="team-code">{{ team.code }}</span>
              </div>
            </td>
            <td class="text-center text-success fw-bold">{{ team.record.wins }}</td>
            <td class="text-center text-danger fw-bold">{{ team.record.losses }}</td>
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
.team-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.rank-col {
  width: 40px;
}
.team-code {
  color: #888;
  font-size: 0.85em;
}
</style>
