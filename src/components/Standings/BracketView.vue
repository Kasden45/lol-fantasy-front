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
  scrollbar-width: none;
}

.bracket-scroll::-webkit-scrollbar {
  display: none;
}

.bracket-container {
  display: flex;
  gap: 12px;
  padding: 4px 2px 12px;
  min-width: max-content;
}

.bracket-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
}

.bracket-cell {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
}

.cell-name {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--PRIMARY-LIGHTER);
  border-bottom: 1px solid var(--GREY-DARKER);
  padding-bottom: 6px;
  margin-bottom: 8px;
}

.bracket-match {
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
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
  gap: 7px;
  padding: 6px 9px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.bracket-team:last-child {
  border-bottom: none;
}

.team-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.team-code {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: var(--GREY);
}

.game-wins {
  font-size: 12px;
  font-weight: 700;
  min-width: 16px;
  text-align: right;
  color: var(--GREY-DARKER);
}

.team-winner .team-code {
  color: var(--GREEN-LIGHT);
}

.team-winner .game-wins {
  color: var(--GREEN-LIGHT);
}

.team-loser {
  opacity: 0.45;
}

.team-tbd .team-code {
  color: var(--GREY-DARKER);
}
</style>
