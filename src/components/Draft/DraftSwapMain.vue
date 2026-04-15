<template>
  <div class="swap-container">
    <div class="swap-content">
      <div></div>
      <div></div>
      <div class="tab-navigation">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'unused' }"
          @click="activeTab = 'unused'"
        >
          Swap with player pool
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'others' }"
          @click="activeTab = 'others'"
        >
          Swap with Others
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
          :swap-mode="true"
          @choose-role="selectFromYourTeam"
          @choose-player="selectPlayerFromYourTeam"
        />
      </div>

      <!-- Middle Panel: Swap Direction & Submit -->
      <div class="swap-middle">
        <div class="swap-arrow">
          <span>⇄</span>
        </div>

        <div
          class="swap-target-info"
          v-if="
            selectedFromYourTeam &&
            (selectedFromTargetTeam ||
              (selectedFromUnusedPlayers && activeTab === 'unused'))
          "
        >
          <!-- Loader overlay -->
          <!-- <div v-if="swapLoading" class="swap-loading-overlay">
            <div class="swap-spinner"></div>
          </div> -->
          <LazyLoader v-if="swapLoading" />
          <div class="target-team-name">
            {{ getTeamName(selectedTeamId) }}
          </div>
          <SwapCard :swap="proposedSwapData"> </SwapCard>
          <button
            :title="!canSwap ? errorMessage : 'Propose this swap'"
            class="propose-swap-btn"
            @click="proposeSwap"
            :disabled="
              !selectedFromYourTeam ||
              (!selectedFromTargetTeam &&
                !(selectedFromUnusedPlayers && activeTab === 'unused')) ||
              canSwap === false ||
              swapLoading
            "
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

            <slot @playerSelect="selectPlayerFromYourTeam"></slot>
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
              v-for="(userTeam, clientId) in otherTeams"
              :key="clientId"
              class="team-selector-btn"
              :class="{ active: selectedTeamId === clientId }"
              @click="selectTeamToSwapWith(clientId)"
            >
              <span class="team-selector-name">
                {{
                  draftParticipants.find((p) => p.id === clientId)?.username ||
                  "Team " + userTeam.user.username
                }}
              </span>
              <!-- <span class="team-selector-count">
                {{
                  Object.values(userTeam.team).filter(
                    (pos) => pos != null && (pos.player || pos.team),
                  ).length
                }}/{{ Object.keys(userTeam.team).length }}
              </span> -->
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
              :swap-mode="true"
              :rival-name="
                this.otherTeams[this.selectedTeamId]?.user?.username ||
                'Unknown'
              "
              :selected-role="selectedTargetRole"
              @choose-role="selectFromTargetTeam"
              @choose-player="selectPlayerFromYourTeam"
            />
          </div>

          <div v-else class="no-team-selected">
            <p>Select a team to view their roster</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Swap History / Pending Swaps -->
    <SwapsHistory
      :fixtures="fixtures"
      :pending-swaps="pendingSwaps"
      @refresh-swaps="fetchSwaps"
      @refresh-teams="refreshTeams"
      @open-details="openDetailsModal"
    />
  </div>
</template>

<script>
import {
  proposeSwap as ablyProposeSwap,
  onDraftEvent,
  offDraftEvent,
  DRAFT_EVENTS,
} from "@/socket.js";
import TeamRoster from "@/components/Draft/TeamDisplayDraft.vue";
import MyModal from "../MyModal.vue";
import ComparePlayers from "./ComparePlayers.vue";
import SwapsHistory from "./SwapsHistory.vue";
import SwapCard from "./SwapCard.vue";
import LazyLoader from "../LazyLoader.vue";
export default {
  name: "DraftSwapMain",
  components: {
    TeamRoster,
    MyModal,
    ComparePlayers,
    SwapsHistory,
    SwapCard,
    LazyLoader,
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
    realLeagueId: {
      type: Number,
      required: true,
    },
    selectedFromUnusedPlayers: {
      type: Object,
      default: null,
    },
    fixtures: {
      type: Object,
    },
    pendingSwaps: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      swapLoading: false,
      openModal: false,
      activeTab: "unused",
      selectedFromYourTeam: null,
      selectedFromTargetTeam: null,
      selectedTeamId: null,
      selectedYourRole: null,
      selectedTargetRole: null,
      rivalUserTeamId: null,
      timeToDeadline: "",
      currentSwap: null,
      errorMessage: "",
      _unsubscribeFunctions: [],
    };
  },
  emits: ["refetch-teams", "refetch-swaps", "choose-role"],
  computed: {
    proposedSwapData() {
      if (!this.selectedFromYourTeam) return null;

      return {
        tradeInitiatorUserTeam: {
          userId: this.profileId,
          userLogin: "You",
        },
        tradeReceiverUserTeam: {
          userId: this.rivalUserTeamId,
          userLogin: this.getTeamName(),
        },
        playerInitiator: this.selectedFromYourTeam,
        playerReceiver:
          this.activeTab === "unused"
            ? this.selectedFromUnusedPlayers
            : this.selectedFromTargetTeam,
        status: -1,
      };
    },
    canSwap() {
      if (this.activeTab === "unused") {
        if (!(!!this.selectedFromYourTeam && !!this.selectedFromUnusedPlayers))
          return false;

        const fromPlayer = this.selectedFromYourTeam;
        const toPlayer = this.selectedFromUnusedPlayers;

        // Check if both are players or both are teams
        const fromIsPlayer = !!fromPlayer.summonerName;
        const toIsPlayer = !!toPlayer.summonerName;

        if (fromIsPlayer !== toIsPlayer) {
          this.errorMessage =
            "You can only swap players with players and teams with teams.";
          return false; // Can't swap a player for a team or vice versa
        }
        if (
          this.selectedFromYourTeam.role !=
            this.selectedFromUnusedPlayers.role &&
          !(this.selectedYourRole == "sub")
        ) {
          this.errorMessage =
            "You can only swap players of the same role, unless swapping with a substitute.";
          return false;
        }
        return true;
      } else {
        if (
          !this.selectedFromYourTeam ||
          !this.selectedFromTargetTeam ||
          (!(
            this.selectedYourRole == "sub" && this.selectedTargetRole == "sub"
          ) &&
            this.selectedFromYourTeam.role != this.selectedFromTargetTeam.role)
        ) {
          this.errorMessage =
            "You can only swap players of the same role, unless both are substitutes.";
          return false;
        }
        const fromPlayer = this.selectedFromYourTeam;
        const toPlayer = this.selectedFromTargetTeam;

        // Check if both are players or both are teams
        const fromIsPlayer = !!fromPlayer.summonerName;
        const toIsPlayer = !!toPlayer.summonerName;

        if (fromIsPlayer !== toIsPlayer) {
          this.errorMessage =
            "You can only swap players with players and teams with teams.";
          return false; // Can't swap a player for a team or vice versa
        }

        return true; // Valid swap
      }
    },
    selectedTeamData() {
      console.log(
        "Selected Team ID:",
        this.otherTeams[this.selectedTeamId].team,
      );
      return this.selectedTeamId
        ? this.transformTeamData(this.otherTeams[this.selectedTeamId]).result
        : null;
    },
  },
  methods: {
    setupAblyListeners() {
      console.log("🔔 [SwapComponent] Setting up Ably listeners...");
      var self = this;

      // Listen for swap proposals FROM OTHER USERS
      var unsubSwap = onDraftEvent(DRAFT_EVENTS.SWAP_PROPOSED, function (data) {
        self.handleIncomingSwapProposal(data);
      });

      this._unsubscribeFunctions.push(unsubSwap);
      console.log("✅ [SwapComponent] Listening for swap proposals");
    },
    refreshTeams() {
      console.log("forcing refetch");
      this.$emit("refetch-teams");
    },
    openDetailsModal(swap) {
      this.currentSwap = swap;
      this.openModal = true;
    },
    closeDetailsModal(name) {
      this.openModal = false;
    },
    async fetchSwaps() {
      this.$emit("refetch-swaps");
    },
    transformTeamData(data) {
      const team = data.team;
      const user = data.user;

      if (!team || !user) return null;

      const roleMap = {
        topPlayerPoints: "top",
        junglePlayerPoints: "jungle",
        midPlayerPoints: "mid",
        bottomPlayerPoints: "bottom",
        supportPlayerPoints: "support",
        subPlayerPoints: "sub",
      };

      const result = {};

      for (const [key, role] of Object.entries(roleMap)) {
        const playerData = team?.[key]?.player || null;

        result[key.replace("Points", "")] = {
          role,
          player: playerData,
        };
      }

      result.team = {
        role: "team",
        team: team.teamPoints?.team || null,
      };

      return {
        result,
      };
    },
    selectFromYourTeam(role) {
      console.log("Selected from your team:", role);
      this.selectedYourRole = role;
      this.$emit("choose-role", role);
      // In actual implementation, emit event to parent to select player from pool
    },
    selectPlayerFromYourTeam(player, ownTeam, profileId) {
      console.log(
        "Selected player from your team:",
        player,
        ownTeam,
        profileId,
      );
      if (ownTeam && profileId === this.profileId) {
        this.selectedFromYourTeam = player;
      } else {
        this.selectedFromTargetTeam = player;
        console.warn("Attempted to select player from another team");
      }
    },
    selectFromTargetTeam(role) {
      this.selectedTargetRole = role;
    },
    selectTeamToSwapWith(clientId) {
      this.selectedTeamId = this.selectedTeamId === clientId ? null : clientId;
      this.rivalUserTeamId =
        this.otherTeams[this.selectedTeamId]?.team?.userTeamId || null;
      this.selectedFromTargetTeam = null;
      this.selectedTargetRole = null;
    },
    getTeamName(team) {
      if (this.activeTab === "unused") return "Player Pool";

      return this.otherTeams[this.selectedTeamId]?.user?.username || "Unknown";
    },
    async proposeSwapFromPlayerPool() {
      // Similar to proposeSwap but for players from the pool
      const swapRequest = {
        LeagueId: this.realLeagueId,
        PlayerInitiatorId: this.selectedFromYourTeam.esportsPlayerId,
        PlayerReceiverId: this.selectedFromUnusedPlayers.esportsPlayerId,
        TeamInitiatorId: this.selectedFromYourTeam.slug,
        TeamReceiverId: this.selectedFromUnusedPlayers.slug,
        TradeInitiatorUserTeamId: this.selectedTeam.userTeamId,
        TradeReceiverUserTeamId: 0,
      };

      console.log("Proposing from player pool swap with data:", swapRequest);
      try {
        const response = await this.axios.post(
          `${this.apiURL}Draft/${this.$store.getters.getCurrentTournamentId}/trades/${this.$store.getters.getProfileId}`,
          swapRequest,
        );
        console.log("Swap created", response.data);
        await this.fetchSwaps();
        console.log("to refetch");
        this.$emit("refetch-teams");
        console.log("refetched?");
        this.selectedFromYourTeam = null;
        this.selectedTeamId = null;
        this.swapLoading = false;
      } catch (error) {
        console.error("Error swapping", error);
        this.swapLoading = false;
      }
    },
    async proposeSwap() {
      if (!this.canSwap) {
        console.log("Missing swap data");
        return;
      }
      this.swapLoading = true;
      if (this.activeTab === "unused" && this.selectedFromUnusedPlayers) {
        console.log("Proposing swap with player pool");
        this.proposeSwapFromPlayerPool();
        return;
      }

      const swapRequest = {
        LeagueId: this.realLeagueId,
        PlayerInitiatorId: this.selectedFromYourTeam.esportsPlayerId,
        PlayerReceiverId: this.selectedFromTargetTeam.esportsPlayerId,
        TeamInitiatorId: this.selectedFromYourTeam.slug,
        TeamReceiverId: this.selectedFromTargetTeam.slug,
        TradeInitiatorUserTeamId: this.selectedTeam.userTeamId,
        TradeReceiverUserTeamId: this.rivalUserTeamId,
      };

      console.log("Proposing swap with data:", swapRequest);
      try {
        const response = await this.axios.post(
          `${this.apiURL}Draft/${this.$store.getters.getCurrentTournamentId}/trades/${this.$store.getters.getProfileId}`,
          swapRequest,
        );
        console.log("Swap created", response.data);
        await this.fetchSwaps();
        ablyProposeSwap(this.leagueId, this.rivalUserTeamId);
        this.selectedFromYourTeam = null;
        this.selectedFromTargetTeam = null;
        this.selectedTeamId = null;
        this.swapLoading = false;
      } catch (error) {
        this.swapLoading = false;
        console.error("Error swapping", error);
      }
    },
  },
  created() {
    this.setupAblyListeners();
  },
  beforeDestroy() {
    console.log("🗑️  [SwapComponent] Destroying - cleaning up...");

    // CRITICAL: Cleanup Ably listeners to prevent memory leaks!
    this.cleanupAblyListeners();
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
  position: relative;
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
.error-text {
  color: var(--ERROR);
  font-size: 11px;
  word-break: break-all;
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
