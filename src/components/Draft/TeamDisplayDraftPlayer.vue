<template>
  <div
    class="position-card"
    :class="{
      filled: position.player || position.team,
      empty: !position.player && !position.team,
      rival: !ownTeam,
      swap: swapMode,
      clickable:
        (!position.player && !position.team && ownTeam && yourTurn) ||
        ((position.player || position.team) && swapMode),
      'currently-picked':
        (yourTurn &&
          ownTeam &&
          position.role == selectedRole &&
          !position.player &&
          !position.team) ||
        (swapMode && position.role == selectedRole),
    }"
    @click="
      ownTeam && yourTurn
        ? handlePositionClick(position)
        : swapMode
        ? handlePositionClickSwap(position)
        : null
    "
  >
    <!-- Filled Position -->
    <template v-if="position.player">
      <div class="card-header">
        <div class="team-badges">
          <template v-if="Array.isArray(matchups[position.player.team?.code])">
            <span
              v-for="matchup in matchups[position.player.team?.code]"
              :key="matchup.code"
              class="team-badge"
              :style="{
                backgroundColor: $func_global.difficultyMap(
                  matchup?.difficulty,
                ),
              }"
            >
              vs {{ matchup?.code }}
            </span>
          </template>
          <span
            v-else
            class="team-badge"
            :style="{
              backgroundColor: $func_global.difficultyMap(
                matchups[position.player.team?.code]?.difficulty,
              ),
            }"
          >
            vs {{ matchups[position.player.team?.code]?.code }}
          </span>
        </div>
        <span class="role-badge" :class="`role-${position.role.toLowerCase()}`">
          {{ position.role.toUpperCase() }}
        </span>
      </div>

      <div class="player-image-container">
        <img
          :src="position.player.imageUrl"
          :alt="position.player.summonerName"
          class="player-image"
          @error="handleImageError"
        />
      </div>

      <div class="player-name">
        {{ position.player.team.code }} {{ position.player.summonerName }}
      </div>

      <div class="player-stats-mini">
        <div class="stat-mini">
          <span class="stat-value">${{ position.player.price }}</span>
          <span class="stat-label">Price</span>
        </div>
        <div class="stat-mini">
          <span class="stat-value">{{
            position.player.points?.toFixed(0) || 0
          }}</span>
          <span class="stat-label">Pts</span>
        </div>
        <div class="stat-mini">
          <span class="stat-value">{{
            position.player.matchesPlayed === 0
              ? "-"
              : (
                  position.player.points / position.player.matchesPlayed
                ).toFixed(1)
          }}</span>
          <span class="stat-label">Pts/M</span>
        </div>
      </div>
    </template>
    <template v-if="position.team">
      <div class="card-header">
        <div class="team-badges">
          <template v-if="Array.isArray(matchups[position.team?.code])">
            <span
              v-for="matchup in matchups[position.team?.code]"
              :key="matchup.code"
              class="team-badge"
              :style="{
                backgroundColor: $func_global.difficultyMap(matchup.difficulty),
              }"
            >
              vs {{ matchup.code }}
            </span>
          </template>
          <span
            v-else
            class="team-badge"
            :style="{
              backgroundColor: $func_global.difficultyMap(
                matchups[position.team?.code].difficulty,
              ),
            }"
          >
            vs {{ matchups[position.team?.code].code }}
          </span>
        </div>
        <span class="role-badge" :class="`role-team`"> TEAM </span>
      </div>

      <div class="player-image-container">
        <img
          :src="position.team.imageUrl"
          :alt="position.team.name"
          class="player-image"
          @error="handleImageError"
        />
      </div>

      <div class="player-name">{{ position.team.name }}</div>

      <div class="player-stats-mini">
        <div class="stat-mini">
          <span class="stat-value">${{ position.team.price }}</span>
          <span class="stat-label">Price</span>
        </div>
        <div class="stat-mini">
          <span class="stat-value">{{
            position.team.points?.toFixed(0) || 0
          }}</span>
          <span class="stat-label">Pts</span>
        </div>
        <div class="stat-mini">
          <span class="stat-value">{{
            position.team.matchesPlayed === 0
              ? "-"
              : (position.team.points / position.team.matchesPlayed).toFixed(1)
          }}</span>
          <span class="stat-label">Pts/M</span>
        </div>
      </div>
    </template>

    <!-- Empty Position -->
    <template v-if="!position.player && !position.team">
      <div class="empty-card-content">
        <div
          class="role-badge-large"
          :class="`role-${position.role.toLowerCase()}`"
        >
          {{ position.role.toUpperCase() }}
        </div>
        <div v-if="ownTeam" class="plus-icon">
          <i class="fas fa-plus"></i>
        </div>
        <div v-if="ownTeam" class="empty-text">Add {{ position.role }}</div>
        <div v-if="!ownTeam" class="empty-text">{{ position.role }}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "TeamDisplayDraftPlayer",
  props: {
    matchups: Object,
    position: {
      type: Object,
    },
    key: Object,
    ownTeam: {
      type: Boolean,
      default: false,
    },
    yourTurn: {
      type: Boolean,
      default: false,
    },
    swapMode: {
      type: Boolean,
      default: false,
    },
    // rivalName: {
    //   type: String,
    //   default: "Hakkene",
    // },
    // selectedTeam: {
    //   type: Object,
    //   required: true,
    // },
    // profileId: {
    //   type: [String, Number],
    //   required: true,
    // },
    selectedRole: {
      type: String,
      default: null,
    },
    // nextFixture: {
    //   type: Object,
    //   default: null,
    // },
  },
  methods: {
    handlePositionClick(position) {
      console.log("handlePositionClick: position, player:", position);

      if (!position.player) {
        console.log("handlePositionClick: role", position.role);

        this.$emit("handle-position-click", position);
      }
    },
    handlePositionClickSwap(position) {
      console.log("Swap click on position:", position.role);
      this.$emit("handle-position-swap-click", position.role);
      if (position.player)
        this.$emit("handle-position-swap-player", position.player);
      if (position.team)
        this.$emit("handle-position-swap-player", position.team);
    },
  },
};
</script>

<style scoped>
.team-roster-container {
  background: rgba(255, 255, 255, 0.05);
  /* border-radius: 5px; */
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header */
.roster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.roster-title h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #fff;
  font-weight: 700;
}

.team-id {
  font-size: 14px;
  padding-left: 1vw;
  color: var(--PRIMARY, #00d9ff);
  font-weight: 600;
}

.roster-info {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.roster-count {
  font-size: 24px;
  font-weight: bold;
  color: var(--PRIMARY, #00d9ff);
  line-height: 1;
}

.roster-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Team Cards Grid */
.team-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 25px;
  margin-bottom: 20px;
  align-items: start;
}

/* Position Card */
.position-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 12px;
  padding: 12px;
  border: 2px solid transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  /* min-height: 220px; */
  height: stretch;
}

.position-card.filled {
  border-color: rgba(168, 85, 247, 0.3);
}

.position-card.empty {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
  justify-content: center;
  align-items: center;
}

.position-card.rival {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-color: rgba(168, 85, 247, 0.3);
}

.position-card.clickable {
  cursor: pointer;
}

.position-card.clickable:hover {
  border-color: var(--PRIMARY, #00d9ff);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.position-card.clickable.swap:hover {
  border-color: var(--RED-USED-CHIP, #00d9ff) !important;
}

.position-card.clickable.swap.rival:hover {
  border-color: var(--GREEN-DARK, #00d9ff) !important;
}

.position-card.filled:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.2);
}

.currently-picked {
  transform: translateY(-3px);
  animation: pulse 2s infinite;
  box-shadow: 0 0 20px var(--PRIMARY, #00d9ff);
}

.currently-picked.swap {
  box-shadow: 0 0 20px var(--RED-USED-CHIP, #00d9ff) !important;
}

.currently-picked.swap.rival {
  box-shadow: 0 0 20px var(--GREEN-DARK, #00d9ff) !important;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.team-badge {
  font-size: 10px;
  text-align: left;
  font-weight: bold;
  color: #fff;
  background: rgba(0, 217, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
.team-badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.role-badge {
  font-size: 9px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  color: #fff;
  text-transform: uppercase;
}

.role-badge.role-top {
  background: var(--ROLE-TOP);
}

.role-badge.role-jungle {
  background: var(--ROLE-JUNGLE);
}

.role-badge.role-mid {
  background: var(--ROLE-MID);
}

.role-badge.role-bottom,
.role-badge.role-bot,
.role-badge.role-adc {
  background: var(--ROLE-BOTTOM);
}

.role-badge.role-support,
.role-badge.role-sup {
  background: var(--ROLE-SUPPORT);
}

.role-badge.role-sub {
  background: var(--ROLE-SUB);
}

.role-badge.role-team {
  background: var(--ROLE-TEAM);
}

/* Player Image */
.player-image-container {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

.player-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Player Name */
.player-name {
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  color: #fff;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Player Stats Mini */
.player-stats-mini {
  display: flex;
  justify-content: space-around;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-mini .stat-value {
  font-weight: bold;
  color: var(--PRIMARY, #00d9ff);
  font-size: 12px;
}

.stat-mini .stat-label {
  color: #94a3b8;
  font-size: 9px;
  text-transform: uppercase;
}

/* Remove Button */
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: none;
  color: white;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s;
  z-index: 5;
}

.position-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

/* Empty Card Content */
.empty-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 10px;
  border-radius: 5px;
}

.role-badge-large {
  font-size: 11px;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 6px;
  color: #fff;
  text-transform: uppercase;
}

.plus-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 217, 255, 0.1);
  border: 2px dashed var(--PRIMARY, #00d9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--PRIMARY, #00d9ff);
  transition: all 0.3s;
}

.position-card.clickable:hover .plus-icon {
  background: var(--PRIMARY, #00d9ff);
  color: #fff;
  border-style: solid;
  transform: rotate(90deg);
}

.empty-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

/* Team Summary */
.team-summary {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 16px;
  font-weight: bold;
  color: var(--PRIMARY, #00d9ff);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .team-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .player-image-container {
    height: 60px;
  }
}

@media (max-width: 768px) {
  .team-cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .roster-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .roster-info {
    align-items: flex-start;
  }

  .team-summary {
    flex-direction: column;
    gap: 10px;
  }

  .summary-item {
    flex-direction: row;
    justify-content: space-between;
  }
}

/* Horizontal Layout Alternative (for wider screens) */
.team-roster-container.horizontal .team-cards-grid {
  grid-template-columns: repeat(7, 1fr);
  /* min-height: 250px; */
}

@media (max-width: 1600px) {
  .team-roster-container.horizontal .team-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .team-roster-container.horizontal .team-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.team-roster-container::-webkit-scrollbar {
  width: 10px;
}

.team-roster-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.team-roster-container::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 4px;
}

.team-roster-container::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.7);
}
</style>
