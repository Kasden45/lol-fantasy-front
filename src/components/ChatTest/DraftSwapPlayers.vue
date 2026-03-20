<template>
  <div class="swap-container">
    <div class="swap-content">
      <div></div>
      <div></div>
      <div class="tab-navigation">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'others' }"
          @click="activeTab = 'others'"
        >
          Swap with Others
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'unused' }"
          @click="activeTab = 'unused'"
        >
          Swap with player pool
        </button>
      </div>
      <!-- Left Panel: Your Team Selection -->
      <div class="swap-panel your-team-panel">
        <div class="panel-header">
          <h3>Your Team</h3>
          <span class="panel-subtitle">Select a player to trade</span>
        </div>

        <TeamRoster
          class="swap-team-roster"
          :selected-team="selectedTeam"
          :profile-id="profileId"
          :own-team="true"
          :next-fixture="nextFixture"
          :your-turn="false"
          :selected-role="selectedYourRole"
          @choose-role="selectFromYourTeam"
        />

        <div v-if="selectedFromYourTeam" class="selected-badge">
          <span class="badge-text"
            >Selected:
            {{
              selectedFromYourTeam.summonerName || selectedFromYourTeam.name
            }}</span
          >
          <button class="badge-clear" @click="selectedFromYourTeam = null">
            ✕
          </button>
        </div>
      </div>

      <!-- Middle Panel: Swap Direction & Submit -->
      <div class="swap-middle">
        <div class="swap-arrow">
          <span>⇄</span>
        </div>

        <div
          class="swap-target-info"
          v-if="selectedFromYourTeam && selectedTargetTeam"
        >
          <div class="target-team-name">
            {{ getTeamName(selectedTargetTeam) }}
          </div>
          <button
            class="propose-swap-btn"
            @click="proposeSwap"
            :disabled="!selectedFromYourTeam || !selectedFromTargetTeam"
          >
            Propose Swap
          </button>
        </div>

        <div v-else class="swap-placeholder">
          <p>Select players to propose a swap</p>
        </div>
      </div>
      <!-- Tab Navigation -->

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Others Tab -->
        <div v-if="activeTab === 'unused'" class="tab-panel">
          <!-- Middle Panel: Swap Direction & Submit -->
          <!-- Unused Players Panel -->
          <div class="swap-panel unused-players-panel">
            <div class="panel-header">
              <h3>Available Players</h3>
              <span class="panel-subtitle"
                >Select unused players to swap in</span
              >
            </div>

            <slot></slot>

            <div v-if="selectedFromUnusedPlayers" class="selected-badge">
              <span class="badge-text"
                >Selected: {{ selectedFromUnusedPlayers.summonerName }}</span
              >
              <button
                class="badge-clear"
                @click="selectedFromUnusedPlayers = null"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Right Panel: Other Teams Selection -->
        </div>
        <!-- Right Panel: Other Teams Selection -->
        <div v-if="activeTab === 'others'" class="swap-panel other-teams-panel">
          <div class="panel-header">
            <h3>Other Teams</h3>
            <span class="panel-subtitle">Choose who to swap with</span>
          </div>

          <div class="teams-selector">
            <div
              v-for="(team, clientId) in otherTeams"
              :key="clientId"
              class="team-selector-btn"
              :class="{ active: selectedTeamId === clientId }"
              @click="selectTeamToSwapWith(clientId)"
            >
              <span class="team-selector-name">
                {{
                  draftParticipants.find((p) => p.id === clientId)?.username ||
                  "Team " + clientId
                }}
              </span>
              <span class="team-selector-count">
                {{
                  Object.values(team).filter((pos) => pos.player || pos.team)
                    .length
                }}/{{ Object.keys(team).length }}
              </span>
            </div>
          </div>

          <div v-if="selectedTeamId" class="selected-team-roster">
            <TeamRoster
              class="swap-team-roster"
              :selected-team="selectedTeamData"
              :profile-id="selectedTeamId"
              :own-team="false"
              :next-fixture="nextFixture"
              :your-turn="false"
              :rival-name="
                draftParticipants.find((p) => p.id === selectedTeamId)
                  ?.username || 'Unknown'
              "
              :selected-role="selectedTargetRole"
              @choose-role="selectFromTargetTeam"
            />

            <div v-if="selectedFromTargetTeam" class="selected-badge">
              <span class="badge-text"
                >Selected:
                {{
                  selectedFromTargetTeam.summonerName ||
                  selectedFromTargetTeam.name
                }}</span
              >
              <button
                class="badge-clear"
                @click="selectedFromTargetTeam = null"
              >
                ✕
              </button>
            </div>
          </div>

          <div v-else class="no-team-selected">
            <p>Select a team to view their roster</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Swap History / Pending Swaps -->
    <div class="swap-history-section">
      <div class="history-header">
        <h3>Pending Swap Requests</h3>
        <span v-if="pendingSwaps.length" class="swap-count">{{
          pendingSwaps.length
        }}</span>
      </div>

      <div v-if="pendingSwaps.length > 0" class="swap-requests-list">
        <div
          v-for="(swap, index) in pendingSwaps"
          :key="index"
          class="swap-request-card"
        >
          <div class="swap-request-header">
            <span class="swap-from">From: {{ swap.fromTeam }}</span>
            <span class="swap-arrow-small">→</span>
            <span class="swap-to">To: {{ swap.toTeam }}</span>
          </div>

          <div class="swap-request-body">
            <div class="swap-player">
              <img
                :src="swap.fromPlayer.imageUrl"
                :alt="swap.fromPlayer.summonerName"
              />
              <span>{{ swap.fromPlayer.summonerName }}</span>
            </div>
            <span class="for-text">for</span>
            <div class="swap-player">
              <img
                :src="swap.toPlayer.imageUrl"
                :alt="swap.toPlayer.summonerName"
              />
              <span>{{ swap.toPlayer.summonerName }}</span>
            </div>
          </div>

          <div class="swap-request-actions">
            <button class="action-btn cancel-btn" @click="cancelSwap(index)">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-swaps">
        <p>No pending swap requests</p>
      </div>
    </div>
  </div>
</template>

<script>
import socket from "@/socket.js";
import TeamRoster from "@/components/ChatTest/TeamDisplayDraft.vue";

export default {
  name: "DraftSwapPlayers",
  components: {
    TeamRoster,
  },
  props: {
    selectedTeam: {
      type: Object,
      required: true,
    },
    otherTeams: {
      type: Object,
      required: true,
    },
    draftParticipants: {
      type: Array,
      required: true,
    },
    profileId: {
      type: [String, Number],
      required: true,
    },
    nextFixture: {
      type: Object,
      default: null,
    },
    leagueId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeTab: "others",
      selectedFromYourTeam: null,
      selectedFromTargetTeam: null,
      selectedTeamId: null,
      selectedYourRole: null,
      selectedTargetRole: null,
      pendingSwaps: [],
    };
  },
  computed: {
    selectedTeamData() {
      return this.selectedTeamId ? this.otherTeams[this.selectedTeamId] : null;
    },
  },
  methods: {
    selectFromYourTeam(role) {
      this.selectedYourRole = role;
      // In actual implementation, emit event to parent to select player from pool
    },
    selectFromTargetTeam(role) {
      this.selectedTargetRole = role;
    },
    selectTeamToSwapWith(clientId) {
      this.selectedTeamId = this.selectedTeamId === clientId ? null : clientId;
      this.selectedFromTargetTeam = null;
      this.selectedTargetRole = null;
    },
    getTeamName(team) {
      const participant = this.draftParticipants.find(
        (p) => p.id === this.selectedTeamId,
      );
      return participant ? participant.username : "Unknown Team";
    },
    proposeSwap() {
      if (
        !this.selectedFromYourTeam ||
        !this.selectedFromTargetTeam ||
        !this.selectedTeamId
      ) {
        console.log("Missing swap data");
        return;
      }

      const swapRequest = {
        fromTeamId: this.profileId,
        fromTeamName: "Your Team",
        fromPlayer: this.selectedFromYourTeam,
        toTeamId: this.selectedTeamId,
        toTeamName: this.getTeamName(),
        toPlayer: this.selectedFromTargetTeam,
        leagueId: this.leagueId,
      };

      // Emit swap proposal via socket
      socket.emit("proposeSwap", swapRequest);

      // Add to pending swaps locally
      this.pendingSwaps.push({
        ...swapRequest,
        fromTeam: swapRequest.fromTeamName,
        toTeam: swapRequest.toTeamName,
        fromPlayer: swapRequest.fromPlayer,
        toPlayer: swapRequest.toPlayer,
      });

      // Reset selections
      this.selectedFromYourTeam = null;
      this.selectedFromTargetTeam = null;
      this.selectedTeamId = null;
    },
    cancelSwap(index) {
      const swap = this.pendingSwaps[index];
      socket.emit("cancelSwap", {
        swapId: index,
        leagueId: this.leagueId,
      });
      this.pendingSwaps.splice(index, 1);
    },
  },
  mounted() {
    socket.on("swapProposed", (swap) => {
      // Handle incoming swap proposals from other players
      console.log("Swap proposal received:", swap);
    });

    socket.on("swapCancelled", (swapId) => {
      this.pendingSwaps.splice(swapId, 1);
    });
  },
  beforeDestroy() {
    socket.off("swapProposed");
    socket.off("swapCancelled");
  },
};
</script>

<style scoped>
.swap-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header */
.swap-header {
  margin-bottom: 10px;
}

.swap-header h2 {
  margin: 0 0 5px 0;
  color: #fff;
  font-size: 24px;
}

.subtitle {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
}

/* Swap Content */
.swap-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  flex: 1;
  /* min-height: 400px; */
}

/* Panels */
.swap-panel {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

.your-team-panel {
  /* Custom styles for your team panel */
  height: auto !important;
}

.panel-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.panel-header h3 {
  margin: 0 0 5px 0;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.panel-subtitle {
  color: #94a3b8;
  font-size: 11px;
  display: block;
}

/* Team Roster in Swap */
.swap-team-roster {
  flex: 1;
  /* max-height: 300px; */

  overflow-y: auto;
}

/* Selected Badge */
.selected-badge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.5);
  padding: 10px 12px;
  border-radius: 6px;
  margin-top: 10px;
}

.badge-text {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.badge-clear {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  transition: color 0.2s;
}

.badge-clear:hover {
  color: #fff;
}

/* Middle Panel */
.swap-middle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  min-width: 120px;
}

.swap-arrow {
  font-size: 48px;
  color: var(--PRIMARY, #00d9ff);
  animation: pulse-arrow 2s infinite;
}

@keyframes pulse-arrow {
  0%,
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
  50% {
    opacity: 0.6;
    transform: scaleX(1.2);
  }
}

.swap-target-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.target-team-name {
  color: var(--PRIMARY, #00d9ff);
  font-weight: 600;
  font-size: 13px;
  text-align: center;
}

.propose-swap-btn {
  background: var(--PRIMARY, #00d9ff);
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.propose-swap-btn:hover:not(:disabled) {
  background: #00aacc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
}

.propose-swap-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.swap-placeholder {
  color: #64748b;
  font-size: 12px;
  text-align: center;
}

/* Other Teams Panel */
.teams-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
}

.team-selector-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-selector-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--PRIMARY, #00d9ff);
}

.team-selector-btn.active {
  background: rgba(168, 85, 247, 0.2);
  border-color: rgba(168, 85, 247, 0.5);
}

.team-selector-name {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}

.team-selector-count {
  color: #94a3b8;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
}

.selected-team-roster {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.no-team-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #64748b;
  font-size: 12px;
}

/* Swap History */
.swap-history-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.history-header h3 {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.swap-count {
  background: var(--PRIMARY, #00d9ff);
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.swap-requests-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.swap-request-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.swap-request-header {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #94a3b8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.swap-from,
.swap-to {
  flex: 1;
}

.swap-arrow-small {
  color: var(--PRIMARY, #00d9ff);
  font-weight: 600;
}

.swap-request-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.swap-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.swap-player img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}

.swap-player span {
  font-size: 11px;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.for-text {
  color: #64748b;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.swap-request-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #f85a67;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.cancel-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

.no-swaps {
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-size: 12px;
}

/* Responsive */
@media (max-width: 1400px) {
  .swap-content {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .swap-middle {
    flex-direction: row;
    min-width: auto;
  }
}

.swap-panel::-webkit-scrollbar {
  width: 6px;
}

.swap-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.swap-panel::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.4);
  border-radius: 3px;
}

.swap-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.6);
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
}

.tab-btn {
  background: none;
  border: none;
  color: #94a3b8;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
  position: relative;
  bottom: -1px;
}

.tab-btn:hover {
  color: var(--PRIMARY);
}

.tab-btn.active {
  color: var(--PRIMARY, #00d9ff);
  border-bottom-color: var(--PRIMARY, #00d9ff);
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.tab-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}
</style>
