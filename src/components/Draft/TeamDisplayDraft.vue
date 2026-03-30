<template>
  <div class="team-roster-container">
    <!-- Header -->
    <div class="roster-header">
      <div class="roster-title">
        <span v-if="ownTeam" class="team-id">My team</span>
        <span v-if="!ownTeam" class="team-id">Team {{ rivalName }}</span>
      </div>
      <div v-if="ownTeam" class="roster-info">
        <span class="roster-count"
          >{{ filledPositions }}/{{ totalPositions }}</span
        >
        <span class="roster-label">Positions</span>
      </div>
    </div>

    <!-- Team Cards Grid -->
    <div class="team-cards-grid">
      <TeamDisplayDraftPlayer
        v-for="(position, key) in swapMode ? filteredTeam : selectedTeam"
        :own-team="ownTeam"
        :your-turn="yourTurn"
        :selected-role="selectedRole"
        @handle-position-click="handlePositionClick"
        @handle-position-swap-click="handlePositionClickSwap"
        @handle-position-swap-player="handlePositionSwapPlayer"
        @handle-position-swap-team="handlePositionSwapTeam"
        :position="position"
        :key="key"
        :matchups="matchups"
        :swap-mode="swapMode"
      ></TeamDisplayDraftPlayer>
    </div>
  </div>
</template>

<script>
import TeamDisplayDraftPlayer from "./TeamDisplayDraftPlayer.vue";

export default {
  name: "TeamRoster",
  components: {
    TeamDisplayDraftPlayer,
  },
  props: {
    swapMode: {
      type: Boolean,
      default: false,
    },
    ownTeam: {
      type: Boolean,
      default: false,
    },
    yourTurn: {
      type: Boolean,
      default: false,
    },
    rivalName: {
      type: String,
      default: "Hakkene",
    },
    selectedTeam: {
      type: Object,
      required: true,
    },
    profileId: {
      type: [String, Number],
      required: true,
    },
    selectedRole: {
      type: String,
      default: null,
    },
    nextFixture: {
      type: Object,
      default: null,
    },
  },
  computed: {
    filteredTeam() {
      return Object.fromEntries(
        Object.entries(this.selectedTeam).filter(
          ([key, position]) =>
            position != null &&
            (position.player != null || position.team != null),
        ),
      );
    },
    matchups() {
      if (!this.nextFixture) return [];

      return this.nextFixture.matches.reduce((acc, match) => {
        if (!acc[match.team1.code]) acc[match.team1.code] = [];
        if (!acc[match.team2.code]) acc[match.team2.code] = [];

        acc[match.team1.code].push(match.team2.code);
        acc[match.team2.code].push(match.team1.code);
        return acc;
      }, {});
    },
    filledPositions() {
      return Object.values(this.selectedTeam).filter(
        (pos) => pos != null && (pos.player || pos.team),
      ).length;
    },
    totalPositions() {
      return Object.keys(this.selectedTeam).filter(
        (pos) => pos.endsWith("Player") || pos === "team",
      ).length;
    },
    totalCost() {
      return Object.values(this.selectedTeam)
        .filter((pos) => pos != null && pos.player)
        .reduce((sum, pos) => sum + (pos.player.price || 0), 0);
    },
    totalPoints() {
      return Object.values(this.selectedTeam)
        .filter((pos) => pos != null && pos.player)
        .reduce((sum, pos) => sum + (pos.player.points || 0), 0);
    },
    averagePointsPerGame() {
      const players = Object.values(this.selectedTeam).filter(
        (pos) => pos != null && pos.player,
      );
      if (players.length === 0) return "-";

      const totalGames = players.reduce(
        (sum, pos) => sum + (pos.player.gamesPlayed || 0),
        0,
      );
      const totalPts = players.reduce(
        (sum, pos) => sum + (pos.player.points || 0),
        0,
      );

      return totalGames > 0 ? (totalPts / totalGames).toFixed(1) : "-";
    },
  },
  methods: {
    handlePositionClickSwap(role) {
      console.log("Swap click on position:", role);
      this.$emit("choose-role", role);
    },
    handlePositionSwapPlayer(player) {
      console.log("Swap click on player:", player);
      this.$emit("choose-player", player, this.ownTeam, this.profileId);
    },
    handlePositionClick(position) {
      if (!position.player) {
        this.$emit("choose-role", position.role);
      }
    },
    handleImageError(event) {
      event.target.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50" y="50" font-size="40" text-anchor="middle" dy=".3em" fill="%23fff">?</text></svg>';
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

.position-card.filled:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.2);
}

.currently-picked {
  transform: translateY(-3px);
  animation: pulse 2s infinite;
  box-shadow: 0 0 20px var(--PRIMARY, #00d9ff);
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
  font-weight: bold;
  color: #fff;
  background: rgba(0, 217, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
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
