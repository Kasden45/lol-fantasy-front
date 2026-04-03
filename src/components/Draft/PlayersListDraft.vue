<template>
  <div class="player-pool-container">
    <div class="pool-header">
      <div class="filters-row">
        <!-- Role Filters -->
        <div class="filter-group">
          <label class="filter-label">Role:</label>
          <div class="filter-buttons">
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === 'any' }"
              @click="filterPlayers('any')"
            >
              All
            </button>
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === 'top' }"
              @click="filterPlayers('top')"
            >
              Top
            </button>
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === 'jungle' }"
              @click="filterPlayers('jungle')"
            >
              Jungle
            </button>
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === 'mid' }"
              @click="filterPlayers('mid')"
            >
              Mid
            </button>
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === 'bottom' }"
              @click="filterPlayers('bottom')"
            >
              Bot
            </button>
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === 'support' }"
              @click="filterPlayers('support')"
            >
              Support
            </button>
            <button
              class="filter-btn"
              :class="{ active: selectedFilter === 'team' }"
              @click="filterTeams('team')"
            >
              Team
            </button>
          </div>
        </div>

        <!-- Team Filter Dropdown -->
        <div class="filter-group" v-if="selectedFilter !== 'team'">
          <label class="filter-label">Team:</label>
          <select
            class="filter-select"
            v-model="selectedTeamFilter"
            @change="filterByTeam"
          >
            <option value="all">All Teams</option>
            <option
              v-for="teamCode in uniqueTeamCodes"
              :key="teamCode"
              :value="teamCode"
            >
              {{ teamCode }}
            </option>
          </select>
        </div>

        <!-- Sort Dropdown -->
        <div class="filter-group">
          <label class="filter-label">Sort:</label>
          <select
            class="filter-select"
            v-model="selectedSorting"
            @change="
              selectedFilter !== 'team'
                ? orderPlayers(selectedSorting)
                : orderTeams(selectedSorting)
            "
          >
            <option value="points">Points</option>
            <option value="pointsMatch">Pts/match</option>
            <option value="pointsMatchPrice">Pts/match/$</option>
            <option value="priceAsc">Price (Low)</option>
            <option value="priceDesc">Price (High)</option>
            <option v-if="selectedFilter !== 'team'" value="summonerName">
              Name
            </option>
            <option v-if="selectedFilter === 'team'" value="name">Name</option>
            <option v-if="selectedFilter !== 'team'" value="team">Team</option>
          </select>
        </div>

        <!-- Active Only Toggle -->
        <div class="filter-group">
          <label class="toggle-label">
            <input
              type="checkbox"
              v-model="hideInactive"
              class="toggle-input"
            />
            <span class="toggle-text">Active only</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Players Grid -->
    <div class="players-grid" ref="playersGrid">
      <PlayerDraftCard
        v-if="selectedFilter !== 'team'"
        v-for="player in filteredAndSortedPlayers"
        :key="player.esportsPlayerId"
        :player="player"
        :selectedRole="selectedRole"
        :teamsPlayingNextFixture="teamsPlayingNextFixture"
        :userTeam="userTeam"
        :userTeamsPicked="userTeamsPicked"
        :matchups="matchups"
        :swapMode="swapMode"
        :selectedForSwap="
          selectedForSwap?.esportsPlayerId === player.esportsPlayerId
            ? true
            : false
        "
        @select="selectPlayer"
      />
      <!-- Teams -->
      <TeamDraftCard
        v-if="selectedFilter === 'team'"
        v-for="team in filteredAndSortedTeams"
        :key="team.code"
        :team="team"
        :selectedRole="selectedRole"
        :teamsPlayingNextFixture="teamsPlayingNextFixture"
        :userTeam="userTeam"
        :userTeamsPicked="userTeamsPicked"
        :matchups="matchups"
        :swapMode="swapMode"
        :selectedForSwap="
          selectedForSwap?.esportsTeamId === team.esportsTeamId ? true : false
        "
        @select="selectTeam"
      />
    </div>
  </div>
</template>

<script>
import PlayerDraftCard from "@/components/Draft/PlayersListDraftPlayer.vue";
import TeamDraftCard from "@/components/Draft/PlayersListDraftTeam.vue";
export default {
  components: {
    PlayerDraftCard,
    TeamDraftCard,
  },
  props: {
    swapMode: Boolean,
    selectedForSwap: Object,
    nextFixture: Object,
    userTeam: Array,
    userTeamsPicked: Object,
    teamsPlayingNextFixture: Array,
    selectedRole: String,
    players: Array,
    teams: Array,
  },
  name: "PlayersListDraft",
  data() {
    return {
      hideInactive: true,
      selectedSorting: "pointsMatch",
      selectedFilter: "any",
      selectedTeamFilter: "all",
      sortedPlayers: [],
      sortedTeams: [],
      uniqueTeamCodes: [],
    };
  },
  computed: {
    matchups() {
      if (!this.nextFixture) return [];

      return this.nextFixture.matches.reduce((acc, match) => {
        if (!acc[match.team1.code]) acc[match.team1.code] = [];
        if (!acc[match.team2.code]) acc[match.team2.code] = [];

        acc[match.team1.code].push({
          code: match.team2.code,
          difficulty: match.team2.difficulty,
        });
        acc[match.team2.code].push({
          code: match.team1.code,
          difficulty: match.team1.difficulty,
        });
        return acc;
      }, {});
    },
    uniqueTeamCodes() {
      return Array.from(
        new Set(this.players.map((player) => player.team.code)),
      ).sort();
    },
    filteredAndSortedPlayers() {
      return this.sortedPlayers.filter(
        (p) =>
          p.price > 0 &&
          (!this.hideInactive ||
            this.teamsPlayingNextFixture.includes(p.team.code)),
      );
    },
    filteredAndSortedTeams() {
      return this.sortedTeams.filter(
        (t) =>
          t.price > 0 &&
          (!this.hideInactive || this.teamsPlayingNextFixture.includes(t.code)),
      );
    },
  },
  methods: {
    handlePlayerClick(player) {
      const isAvailable =
        this.teamsPlayingNextFixture.includes(player.team.code) &&
        (this.selectedRole === player.role || this.selectedRole === "sub") &&
        !Object.keys(this.userTeamsPicked).includes(player.esportsPlayerId);
      if (isAvailable) {
        this.selectPlayer(player);
      }
    },
    handleTeamClick(team) {
      const isAvailable =
        this.teamsPlayingNextFixture.includes(team.code) &&
        this.selectedRole === "team" &&
        !Object.keys(this.userTeamsPicked).includes(team.esportsTeamId);
      if (isAvailable) {
        this.selectTeam(team);
      }
    },
    handleImageError(event) {
      // Fallback to placeholder if image fails to load
      event.target.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50" y="50" font-size="40" text-anchor="middle" dy=".3em" fill="%23fff">?</text></svg>';
    },
    orderPlayers(option) {
      if (option === "points") {
        this.sortedPlayers.sort((a, b) => b.points - a.points);
      }
      if (option === "pointsMatch") {
        this.sortedPlayers.sort((a, b) => {
          if (a.matchesPlayed === 0 && b.matchesPlayed === 0) return 0;
          if (a.matchesPlayed === 0) return 1;
          if (b.matchesPlayed === 0) return -1;
          return b.points / b.matchesPlayed - a.points / a.matchesPlayed;
        });
      }
      if (option === "pointsMatchPrice") {
        this.sortedPlayers.sort((a, b) => {
          if (a.matchesPlayed === 0 && b.matchesPlayed === 0) return 0;
          if (a.matchesPlayed === 0) return 1;
          if (b.matchesPlayed === 0) return -1;
          return (
            b.points / b.matchesPlayed / b.price -
            a.points / a.matchesPlayed / a.price
          );
        });
      }
      if (option === "summonerName") {
        this.sortedPlayers.sort((a, b) =>
          a.summonerName
            .toLowerCase()
            .localeCompare(b.summonerName.toLowerCase()),
        );
      }
      if (option === "priceAsc") {
        this.sortedPlayers.sort((a, b) => a.price - b.price);
      }
      if (option === "priceDesc") {
        this.sortedPlayers.sort((a, b) => b.price - a.price);
      }
      if (option === "team") {
        this.sortedPlayers.sort((a, b) =>
          a.team.name.toLowerCase().localeCompare(b.team.name.toLowerCase()),
        );
      }
      this.scrollGridToTop();
    },
    orderTeams(option) {
      if (option === "points") {
        this.sortedTeams.sort((a, b) => b.points - a.points);
      }
      if (option === "pointsMatch") {
        this.sortedTeams.sort((a, b) => {
          if (a.matchesPlayed === 0 && b.matchesPlayed === 0) return 0;
          if (a.matchesPlayed === 0) return 1;
          if (b.matchesPlayed === 0) return -1;
          return b.points / b.matchesPlayed - a.points / a.matchesPlayed;
        });
      }
      if (option === "pointsMatchPrice") {
        this.sortedTeams.sort((a, b) => {
          if (a.matchesPlayed === 0 && b.matchesPlayed === 0) return 0;
          if (a.matchesPlayed === 0) return 1;
          if (b.matchesPlayed === 0) return -1;
          return (
            b.points / b.matchesPlayed / b.price -
            a.points / a.matchesPlayed / a.price
          );
        });
      }
      if (option === "name") {
        this.sortedTeams.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );
      }
      if (option === "priceAsc") {
        this.sortedTeams.sort((a, b) => a.price - b.price);
      }
      if (option === "priceDesc") {
        this.sortedTeams.sort((a, b) => b.price - a.price);
      }
      this.scrollGridToTop();
    },
    extractUniqueTeamCodes() {
      this.uniqueTeamCodes = Array.from(
        new Set(this.players.map((player) => player.team.code)),
      ).sort();
    },
    filterPlayers(option) {
      this.selectedFilter = option;
      this.applyFilters();
    },
    filterTeams(option) {
      this.selectedFilter = option;
      this.applyFiltersTeams();
    },
    filterByTeam() {
      this.applyFilters();
    },
    applyFiltersTeams() {
      let filtered = [...this.teams];

      // Apply team filter
      this.sortedTeams = filtered;
      this.orderTeams(this.selectedSorting);
    },
    applyFilters() {
      let filtered = [...this.players];

      // Apply role filter
      if (
        ["top", "jungle", "mid", "bottom", "support", "team"].includes(
          this.selectedFilter,
        )
      ) {
        filtered = filtered.filter((p) => p.role === this.selectedFilter);
      }

      // Apply team filter
      if (
        this.selectedTeamFilter !== "all" &&
        this.selectedTeamFilter !== "team"
      ) {
        filtered = filtered.filter(
          (p) => p.team.code === this.selectedTeamFilter,
        );
      }

      this.sortedPlayers = filtered;
      this.orderPlayers(this.selectedSorting);
    },
    selectPlayer(player) {
      console.log("Player selected:", player);
      this.$emit("playerSelect", player);
    },
    selectTeam(team) {
      console.log("Team selected:", team);
      this.$emit("teamSelect", team);
    },
    fetchPlayers() {
      this.sortedPlayers = this.players.filter((p) => p.price > 0);
      this.orderPlayers("points");
    },
    fetchTeams() {
      this.sortedTeams = this.teams.filter((p) => p.price > 0);
      this.orderTeams("points");
    },
    scrollGridToTop() {
      this.$refs.playersGrid?.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  created() {
    this.fetchPlayers();
    this.extractUniqueTeamCodes();
  },
  watch: {
    players: {
      immediate: true,
      handler() {
        this.fetchPlayers();
        this.applyFilters();
      },
    },
    teams: {
      immediate: true,
      handler() {
        this.fetchTeams();
        this.applyFiltersTeams();
      },
    },
    selectedRole: {
      handler() {
        this.selectedFilter =
          this.selectedRole === "sub" ? "any" : this.selectedRole;
        console.log(
          "Selected role changed to:",
          this.selectedRole,
          " - applying filters with filter:",
          this.selectedFilter,
        );
        if (this.selectedRole === "team") {
          this.applyFiltersTeams();
        } else {
          this.applyFilters();
        }
      },
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
  color: #fff;
  background: rgba(0, 217, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
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
