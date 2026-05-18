<template>
  <div class="bracket-scroll">
    <div class="bracket-container">
      <div v-for="(column, ci) in columns" :key="ci" class="bracket-column">
        <div v-for="(cell, ki) in column.cells" :key="ki" class="bracket-cell">
          <div class="cell-name">{{ cell.name }}</div>
          <div
            v-for="match in cell.matches"
            :key="match.id"
            class="bracket-match"
          >
            <div
              v-for="team in match.teams"
              :key="team.id"
              class="bracket-team"
              :class="{
                'team-winner': team.result && team.result.outcome === 'win',
                'team-loser': team.result && team.result.outcome === 'loss',
                'team-tbd': team.slug === 'tbd',
              }"
            >
              <img :src="team.image" :alt="team.code" class="team-logo" />
              <span class="team-code">{{ team.code }}</span>
              <span v-if="team.result" class="game-wins">{{ team.result.gameWins }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BracketView",
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.bracket-scroll {
  overflow-x: auto;
}
.bracket-container {
  display: flex;
  gap: 12px;
  padding: 8px 4px;
  min-width: max-content;
}
.bracket-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 190px;
}
.bracket-cell {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 8px;
}
.cell-name {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #888;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
  margin-bottom: 6px;
}
.bracket-match {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}
.bracket-match:last-child {
  margin-bottom: 0;
}
.bracket-team {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.bracket-team:last-child {
  border-bottom: none;
}
.team-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}
.team-code {
  flex: 1;
  font-size: 0.85rem;
  font-weight: 600;
}
.game-wins {
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 16px;
  text-align: right;
}
.team-winner .team-code,
.team-winner .game-wins {
  color: #4caf50;
}
.team-loser {
  opacity: 0.5;
}
.team-tbd .team-code {
  color: #555;
}
</style>
