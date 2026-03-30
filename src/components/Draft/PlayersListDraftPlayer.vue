<template>
  <div class="player-card" :class="cardClasses" @click="handleClick">
    <!-- Header -->
    <div class="player-header">
      <div class="team-badges">
        <template v-if="Array.isArray(matchups[player.team.code])">
          <span
            v-for="code in matchups[player.team.code]"
            :key="code"
            class="team-badge"
          >
            vs {{ code }}
          </span>
        </template>
        <span v-else class="team-badge">
          vs {{ matchups[player.team.code] }}
        </span>
      </div>

      <span class="role-badge" :class="`role-${player.role.toLowerCase()}`">
        {{ player.role.toUpperCase() }}
      </span>
    </div>

    <!-- Image -->
    <div class="player-image-container">
      <img
        :src="player.imageUrl"
        :alt="player.summonerName"
        class="player-image"
        @error="handleImageError"
      />

      <div v-if="isOwnedByUser" class="owned-overlay">YOURS</div>

      <div v-else-if="isOwnedByOther" class="owned-rival-overlay">
        {{ userTeamsPicked[player.esportsPlayerId].username }}
      </div>

      <div v-else-if="!isActive" class="inactive-overlay">INACTIVE</div>
    </div>

    <!-- Name -->
    <div class="player-name">
      {{ player.team.code }} {{ player.summonerName }}
    </div>

    <!-- Stats -->
    <div class="player-stats">
      <div class="stat">
        <div class="stat-value">{{ player.price }}</div>
        <div class="stat-label">Price</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ player.points.toFixed(0) }}</div>
        <div class="stat-label">Pts</div>
      </div>
      <div class="stat">
        <div class="stat-value">
          {{
            player.gamesPlayed === 0
              ? "-"
              : (player.points / player.gamesPlayed).toFixed(1)
          }}
        </div>
        <div class="stat-label">Pts/G</div>
      </div>
    </div>

    <!-- Button -->
    <button
      class="add-player-btn"
      :class="buttonClasses"
      :disabled="!isSelectable"
      @click.stop="select"
    >
      <span v-if="isOwnedByUser">✓</span>
      <span v-else>+</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "PlayerDraftCard",
  props: {
    swapMode: Boolean,
    player: Object,
    selectedRole: String,
    teamsPlayingNextFixture: Array,
    userTeam: Array,
    userTeamsPicked: Object,
    matchups: Object,
    selectedForSwap: Boolean,
  },
  computed: {
    isActive() {
      return this.teamsPlayingNextFixture.includes(this.player.team.code);
    },
    isOwnedByUser() {
      return this.userTeam.includes(this.player.esportsPlayerId);
    },
    isOwnedByOther() {
      return Object.keys(this.userTeamsPicked).includes(
        this.player.esportsPlayerId,
      );
    },
    isSelectable() {
      return (
        this.isActive &&
        (this.selectedRole === this.player.role ||
          this.selectedRole === "sub") &&
        !this.isOwnedByOther &&
        !this.isOwnedByUser
      );
    },
    cardClasses() {
      return {
        "player-selected-for-swap": this.selectedForSwap,
        "player-inactive": !this.isActive,
        "already-owned": this.isOwnedByOther,
        disabled: !this.isSelectable,
      };
    },
    buttonClasses() {
      return {
        "btn-available": this.isSelectable,
        "btn-unavailable": !this.isSelectable,
      };
    },
  },
  methods: {
    handleClick() {
      if (this.isSelectable) {
        this.select();
      }
    },
    select() {
      this.$emit("select", this.player);
      console.log("Selected player:", this.player);
    },
    handleImageError(e) {
      e.target.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50" y="50" font-size="40" text-anchor="middle" dy=".3em" fill="%23fff">?</text></svg>';
    },
  },
};
</script>

<style scoped>
.player-pool-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header and Filters */

.filters-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  gap: 6px;
}

.filter-btn {
  padding: 6px 12px;
  background: var(--PRIMARY-LIGHTER, #a855f7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  white-space: nowrap;
}

.filter-btn:hover {
  background: var(--PRIMARY, #a855f7);
  transform: translateY(-1px);
}

.filter-btn.active {
  background: var(--PRIMARY, #a855f7);
  border-color: var(--PRIMARY, #a855f7);
  font-weight: 600;
}

.filter-select {
  padding: 6px 12px;
  /* background: rgba(255, 255, 255, 0.08); */
  background: var(--PRIMARY, #a855f7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--PRIMARY, #a855f7);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin: 0;
}

.toggle-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.toggle-text {
  font-size: 13px;
  color: var(--PRIMARY);
}

/* Players Grid */
.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  padding: 5px;
  overflow-y: auto;
  max-height: calc(90vh);
}

/* Player Card */
.player-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  display: flex;
  flex-direction: column;
}

.player-card:hover:not(.disabled) {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  border-color: var(--PRIMARY, #00d9ff);
}

.player-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.player-card.already-owned {
  border-color: #007bff;
  background: linear-gradient(135deg, #1e3a5f 0%, #152a47 100%);
}
.player-card.player-selected-for-swap {
  border-color: var(--GREEN-DARK);
  box-shadow: 0 0 20px var(--GREEN-DARK, #00d9ff) !important;
}
.player-card.player-inactive:not(.already-owned) {
  border-color: #f85a67;
  background: linear-gradient(135deg, #3d2428 0%, #2a1a1d 100%);
}

/* Player Header */
.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.team-badge {
  font-size: 11px;
  font-weight: bold;
  text-align: left;
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
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 85, 247, 0.3);
  color: #fff;
}

.role-badge.role-top {
  background: rgba(59, 130, 246, 0.3);
}

.role-badge.role-jungle {
  background: rgba(34, 197, 94, 0.3);
}

.role-badge.role-mid {
  background: rgba(249, 115, 22, 0.3);
}

.role-badge.role-bottom {
  background: rgba(239, 68, 68, 0.3);
}

.role-badge.role-support {
  background: rgba(168, 85, 247, 0.3);
}

/* Player Image */
.player-image-container {
  position: relative;
  width: 100%;
  height: 10vh;
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

.owned-overlay,
.inactive-overlay,
.owned-rival-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.owned-overlay {
  color: #276b00;
  border: 1px solid #276b00;
}

.owned-rival-overlay {
  color: #007bff;
  border: 1px solid #007bff;
}

.inactive-overlay {
  color: #f85a67;
  border: 1px solid #f85a67;
}

/* Player Name */
.player-name {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Player Stats */
.player-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-weight: bold;
  color: var(--PRIMARY, #00d9ff);
  font-size: 13px;
}

.stat-label {
  color: #94a3b8;
  font-size: 10px;
  margin-top: 2px;
}

/* Player Details (shown on hover) */
.player-details {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  padding: 10px;
  border-radius: 0 0 12px 12px;
  z-index: 10;
  font-size: 12px;
}

.player-card:hover:not(.disabled) .player-details {
  display: block;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: #94a3b8;
}

.detail-row span:last-child {
  color: #fff;
  font-weight: 600;
}

/* Action Button */
.add-player-btn {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-available {
  background: var(--PRIMARY, #00d9ff);
  color: #fff;
}

.btn-available:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 217, 255, 0.4);
}

.btn-unavailable {
  background: rgba(255, 255, 255, 0.1);
  color: #64748b;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}

.empty-subtext {
  font-size: 14px;
}

/* Scrollbar Styling */
.players-grid::-webkit-scrollbar {
  width: 10px;
}

.players-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.players-grid::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 4px;
}

.players-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.7);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .players-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    flex-wrap: wrap;
  }

  .players-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }

  .player-image-container {
    height: 100px;
  }
}
</style>
