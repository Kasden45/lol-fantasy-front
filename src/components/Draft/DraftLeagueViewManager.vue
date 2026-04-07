<template>
  <div v-if="swapNotification" class="swap-notification">
    <span>You have a new swap request!</span>
    <button class="notification-dismiss" @click="swapNotification = false">
      ✕
    </button>
  </div>
  <div class="tab-navigation">
    <button
      class="tab-btn"
      :class="{ active: activeTab === 'results' }"
      @click="activeTab = 'results'"
    >
      Standings
    </button>
    <button
      v-if="this.currentLeague?.isDrafted == false"
      class="tab-btn"
      :class="{ active: activeTab === 'draft' }"
      @click="activeTab = 'draft'"
    >
      Draft teams
    </button>
    <button
      v-if="this.currentLeague?.isDrafted == true"
      class="tab-btn"
      :class="{ active: activeTab === 'swaps' }"
      @click="activeTab = 'swaps'"
    >
      Swap players
    </button>
  </div>
  <DraftSwapMain
    ref="swapMain"
    v-if="activeTab == 'swaps' && selectedUserTeam && realLeagueId"
    :selected-team="selectedUserTeam"
    :other-teams="otherFinishedTeams"
    :draft-participants="draftParticipants"
    :profile-id="$store.getters.getProfileId"
    :next-fixture="nextFixture"
    :league-id="leagueId"
    :real-league-id="realLeagueId"
    :selectedFromUnusedPlayers="selectedFromUnusedPlayers"
    :fixtures="fixtures"
    @refetch-teams="refetchTeams"
    @choose-role="choseRole"
  >
    <PlayersListDraft
      :userTeam="pickedPlayersIdsSwaps"
      :userTeamsPicked="pickedPlayersIdsAllSwaps"
      :nextFixture="nextFixture"
      :teamsPlayingNextFixture="teamsPlayingInNextFixture"
      @rangeChange="() => {}"
      @playerSelect="playerSelectedDraft"
      @playerSelectDraft="playerSelectedDraft"
      @teamSelect="teamSelectedDraft"
      :swapMode="true"
      :selectedRole="roleToAddPlayer"
      @choose-role="choseRole"
      :players="availablePlayers"
      :teams="availableTeams"
      :selectedForSwap="selectedFromUnusedPlayers"
      v-if="availablePlayers.length > 0 && availableTeams.length > 0"
    />
  </DraftSwapMain>
  <!-- Draft and league -->
  <div v-if="activeTab == 'draft'" class="container">
    <LazyLoader v-if="loader" />
    <button
      class="cta-btn"
      @click="joinDraft"
      v-if="
        !this.draftStarted &&
        !this.draftParticipants
          .map((p) => p.id)
          .includes(this.$store.getters.getProfileId)
      "
    >
      Join Draft
    </button>
    <button
      class="cta-btn"
      @click="startDraft"
      v-if="
        !this.draftStarted &&
        this.draftParticipants
          .map((p) => p.id)
          .includes(this.$store.getters.getProfileId)
      "
    >
      Start Draft
    </button>
    <div
      v-if="
        !draftStarted &&
        draftParticipants.map((p) => p.id).includes($store.getters.getProfileId)
      "
    >
      <p class="waiting-label">Players waiting for draft:</p>
      <ul class="waiting-list">
        <li v-for="participant in draftParticipants" :key="participant.id">
          {{ participant.username }}
        </li>
      </ul>
    </div>
    <!-- <div v-if="isCurrentDrafter">
        <h3>It's your turn to pick!</h3>
      </div>
      <div v-else>
        <h3>Waiting for other players to pick...</h3>
      </div> -->
    <div class="draft-container justify-content-md-center m-auto row">
      <DraftOrderBar
        :draftTitle="'Fantasy Draft'"
        :totalRounds="7"
        :currentPick="this.draftQueue.findIndex((pick) => !pick.player)"
        :participants="this.draftParticipants.length"
        :draftQueue="this.draftQueue"
        :timeRemaining="60"
        :isYourTurn="this.isCurrentDrafter"
        :isAutoDrafting="false"
      />
      <!-- <div class="team-list col-3">
          <h3>Your Team</h3>
          <h4>Team {{ this.$store.getters.getProfileId }}</h4>
          <ul>
            <li v-for="(position, key) in selectedTeam" :key="key" @click="position.player ? null : choseRole(position.role)">
              {{ position.role }}: {{ position.player ? position.player.summonerName : 'None' }}
            </li>
          </ul>
        </div> -->
      <TeamRoster
        class="players-list-container user-team col-6"
        :selected-team="selectedTeam"
        :profile-id="$store.getters.getProfileId"
        :own-team="true"
        :nextFixture="nextFixture"
        :your-turn="isCurrentDrafter"
        @choose-role="choseRole"
        :selectedRole="roleToAddPlayer"
        @remove-player="handleRemovePlayer"
        :swapMode="false"
      />
      <div class="players-list-container col-6">
        <PlayersListDraft
          :userTeam="pickedPlayersIds"
          :userTeamsPicked="pickedPlayersIdsAll"
          :nextFixture="nextFixture"
          :teamsPlayingNextFixture="teamsPlayingInNextFixture"
          @rangeChange="() => {}"
          @playerSelect="playerSelected"
          @teamSelect="teamSelected"
          :selectedRole="roleToAddPlayer"
          :players="availablePlayers"
          :teams="availableTeams"
          v-if="availablePlayers.length > 0 && availableTeams.length > 0"
        />
      </div>
      <h3>Other Teams</h3>
      <div class="accordion" id="otherTeamsAccordion">
        <div
          class="accordion-item"
          v-for="(team, clientId) in otherTeams"
          :key="clientId"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse${clientId}`"
            >
              Team
              {{
                draftParticipants.find((p) => p.id == clientId)
                  ? `${
                      draftParticipants.find((p) => p.id == clientId).username
                    }`
                  : ""
              }}
            </button>
          </h2>
          <div
            :id="`collapse${clientId}`"
            class="accordion-collapse collapse"
            data-bs-parent="#otherTeamsAccordion"
          >
            <div class="accordion-body">
              <TeamRoster
                class="players-list-container rival-team col-12"
                :selected-team="team"
                :profile-id="clientId"
                :nextFixture="nextFixture"
                :own-team="false"
                :rivalName="
                  draftParticipants.find((p) => p.id == clientId)
                    ? `${
                        draftParticipants.find((p) => p.id == clientId).username
                      }`
                    : 'Unknown'
                "
                :selectedRole="roleToAddPlayer"
                @choose-role=""
                @remove-player=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DraftOrderBar from "@/components/Draft/DraftOrderBar.vue";
import PlayersListDraft from "@/components/Draft/PlayersListDraft.vue";
import TeamRoster from "@/components/Draft/TeamDisplayDraft.vue";
import DraftSwapMain from "@/components/Draft/DraftSwapMain.vue";
import LazyLoader from "../LazyLoader.vue";

import {
  initAbly,
  disconnectAbly,
  isAblyConnected,
  onDraftEvent,
  offDraftEvent,
  emitDraftEvent,
  joinDraft,
  startDraft,
  finishDraft,
  playerSelected,
  teamSelected,
  requestCurrentState,
  broadcastCurrentState,
  proposeSwap,
  updateCurrentDrafter,
  updateDraftOrder,
  DRAFT_EVENTS,
  getConnectionInfo,
} from "@/socket.js";
import DraftLogic from "@/draft-logic.js";

export default {
  props: {
    leagueId: String,
    // realLeagueId: Number,
  },
  components: {
    DraftOrderBar,
    PlayersListDraft,
    TeamRoster,
    DraftSwapMain,
    LazyLoader,
  },
  data() {
    return {
      ablyReady: false,
      // UI State
      swapNotification: false,
      loader: false,
      activeTab: "results",
      roleToAddPlayer: "",

      // League Data
      realLeagueId: null,
      currentLeague: null,

      // Available entities
      availablePlayers: [],
      availableTeams: [],

      // User's team (managed locally)
      selectedUserTeam: {
        topPlayer: { role: "top", player: null },
        junglePlayer: { role: "jungle", player: null },
        midPlayer: { role: "mid", player: null },
        bottomPlayer: { role: "bottom", player: null },
        supportPlayer: { role: "support", player: null },
        subPlayer: { role: "sub", player: null },
        team: { role: "team", team: null },
        captain: null,
        transfersMade: 0,
      },

      // Current draft selection (during active draft)
      selectedTeam: DraftLogic.getEmptyTeam(),

      // Draft State (synced via Ably)
      draftQueue: [],
      otherTeams: {},
      otherFinishedTeams: {},
      currentDrafter: null,
      draftStarted: false,
      draftParticipants: [],
      currentPick: 0, // Track our position in queue

      // Swap mode
      selectedFromUnusedPlayers: null,

      // Fixture data
      teamsPlayingInNextFixture: [],
      matchesByFixture: null,
      nextFixture: null,

      // Ably subscription handles (for cleanup)
      _unsubscribeFunctions: [],
    };
  },
  computed: {
    /** Current user's ID from Vuex store */
    userId() {
      return this.$store.getters.getProfileId;
    },

    /** Current user's login/username */
    userLogin() {
      return this.$store.getters.getLogin;
    },

    /** Is it this user's turn to pick? */
    isCurrentDrafter() {
      return this.userId === this.currentDrafter;
    },

    /** Fixtures array for template */
    fixtures() {
      if (this.matchesByFixture == null) return [];
      return this.matchesByFixture.map((f) => f.fixture);
    },

    /** IDs of players on user's current team */
    pickedPlayersIds() {
      let pickedPlayers = [];
      for (const role in this.selectedTeam) {
        if (this.selectedTeam.hasOwnProperty(role)) {
          const player = this.selectedTeam[role].player;
          const team = this.selectedTeam[role].team;

          if (player != null && player.hasOwnProperty("price")) {
            pickedPlayers.push(player.esportsPlayerId);
          } else if (team != null && team.hasOwnProperty("price")) {
            pickedPlayers.push(team.esportsTeamId);
          }
        }
      }
      return pickedPlayers;
    },

    /** For swap mode - user's current team IDs */
    pickedPlayersIdsSwaps() {
      let pickedPlayers = [];
      if (this.selectedUserTeam) {
        Object.values(this.selectedUserTeam)
          .filter((u) => u != null && (u.player != null || u.team != null))
          .forEach((u) => {
            if (u.player) pickedPlayers.push(u.player.esportsPlayerId);
            if (u.team) pickedPlayers.push(u.team.esportsTeamId);
          });
      }
      return pickedPlayers;
    },

    /** For swap mode - all other teams' player IDs */
    pickedPlayersIdsAllSwaps() {
      let pickedPlayers = {};
      Object.values(this.otherFinishedTeams).forEach((userTeam) => {
        if (userTeam.team) {
          Object.values(userTeam.team)
            .filter((u) => u != null && (u.player != null || u.team != null))
            .forEach((u) => {
              if (u.player)
                pickedPlayers[u.player.esportsPlayerId] = userTeam.user;
              if (u.team) pickedPlayers[u.team.esportsTeamId] = userTeam.user;
            });
        }
      });
      return pickedPlayers;
    },

    /** All picked players in current draft (from queue) */
    pickedPlayersIdsAll() {
      let pickedPlayers = {};
      this.draftQueue.forEach((pick) => {
        if (pick.player && pick.player.esportsPlayerId) {
          pickedPlayers[pick.player.esportsPlayerId] = pick.user;
        }
        if (pick.player && pick.player.esportsTeamId) {
          pickedPlayers[pick.player.esportsTeamId] = pick.user;
        }
      });
      return pickedPlayers;
    },
  },
  async mounted() {
    console.log("📱 [DraftComponent] Mounted, waiting for Ably...");

    // DON'T request state here - initializeRealtime will do it when ready

    // Optional: Poll for readiness (safety net)
    const maxWait = 5000; // 5 seconds max
    const start = Date.now();

    while (!this.ablyReady && Date.now() - start < maxWait) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (this.ablyReady) {
      console.log("✅ [DraftComponent] Mounted & Ably ready!");
    } else {
      console.warn("⚠️  [DraftComponent] Mounted but Ably not ready after 5s");
    }
  },
  async created() {
    console.log("🎮 [DraftComponent] Created, fetching data...");

    try {
      await this.fetchPlayers();
      await this.fetchTeams();
      await this.getFixtures();
      await this.getLeagueDetails(this.leagueId);
      await this.fetchUserTeam();

      // Initialize Ably AFTER data loaded
      await this.initializeRealtime();
    } catch (error) {
      console.error("❌ [DraftComponent] Initialization failed:", error);
    }
  },
  methods: {
    /**
     * Initialize Ably real-time connection and subscribe to all events
     */
    async initializeRealtime() {
      var apiKey = process.env.VUE_APP_ABLY_API_KEY || "";

      if (!apiKey) {
        console.warn("⚠️  No Ably key");
        this.ablyReady = false;
        return;
      }

      try {
        var success = await initAbly(apiKey, this.leagueId);

        if (success) {
          console.log("✅ [DraftComponent] Ably connected!");
          this.setupEventListeners();

          // Small delay to ensure listeners are registered
          await new Promise(function (resolve) {
            setTimeout(resolve, 200);
          });

          this.ablyReady = true;
          console.log("🚀 [DraftComponent] Real-time READY!");

          // CRITICAL: Request current state from others
          console.log("📡 [DraftComponent] Requesting current draft state...");
          requestCurrentState(this.leagueId);

          // Set a timeout to check if we received state
          setTimeout(
            function () {
              if (!this.draftStarted && this.draftParticipants.length === 0) {
                console.log(
                  "⏳ [DraftComponent] No state received - may be first to join or draft not started",
                );
                // Don't auto-start - let user manually join/start
              }
            }.bind(this),
            3000,
          );
        }
      } catch (error) {
        console.error("❌ Init error:", error);
        this.ablyReady = false;
      }
    },

    /**
     * Setup all Ably event listeners for draft coordination
     */
    /**
     * Setup all Ably event listeners for real-time coordination
     * Called after successful Ably initialization
     */
    setupEventListeners() {
      console.log("🎧 [Listeners] Starting setup...");

      var self = this;

      // Reset subscription tracking
      this._unsubscribeFunctions = [];

      // Helper to track subscriptions for cleanup
      function track(unsubFn) {
        if (typeof unsubFn === "function") {
          self._unsubscribeFunctions.push(unsubFn);
        }
      }

      // ========================================
      // 1. CURRENT STATE SYNC (when joining/reconnecting)
      // ========================================
      console.log("🎧 [Listeners] Setting up: current-state");
      track(
        onDraftEvent(DRAFT_EVENTS.CURRENT_STATE, function (data) {
          console.log("📥 [Listeners] RECEIVED: current-state");
          self.handleCurrentStateUpdate(data);
        }),
      );

      // ========================================
      // 2. PLAYER SELECTED BY OTHER USER
      // ========================================
      console.log("🎧 [Listeners] Setting up: player-selected");
      track(
        onDraftEvent(DRAFT_EVENTS.PLAYER_SELECTED, function (data) {
          console.log(
            "📥 [Listeners] RECEIVED: player-selected from user",
            data.clientId,
          );
          self.handlePlayerSelectedEvent(data);
        }),
      );

      // ========================================
      // 3. TEAM SELECTED BY OTHER USER
      // ========================================
      console.log("🎧 [Listeners] Setting up: team-selected");
      track(
        onDraftEvent(DRAFT_EVENTS.TEAM_SELECTED, function (data) {
          console.log(
            "📥 [Listeners] RECEIVED: team-selected from user",
            data.clientId,
          );
          self.handleTeamSelectedEvent(data);
        }),
      );

      // ========================================
      // 4. TURN CHANGES (whose pick is it?)
      // ========================================
      console.log("🎧 [Listeners] Setting up: current-drafter");
      track(
        onDraftEvent(DRAFT_EVENTS.CURRENT_DRAFTER, function (data) {
          console.log(
            "📥 [Listeners] RECEIVED: current-drafter:",
            data.currentDrafter,
          );
          self.currentDrafter = data.currentDrafter;
        }),
      );

      // ========================================
      // 5. DRAFT ORDER UPDATED (participants joined/left)
      // ========================================
      console.log("🎧 [Listeners] Setting up: draft-order-updated");
      track(
        onDraftEvent(DRAFT_EVENTS.DRAFT_ORDER_UPDATED, function (data) {
          console.log("📥 [Listeners] RECEIVED: draft-order-updated");
          console.log("   Participants:", data.draftParticipants);
          self.draftParticipants = data.draftParticipants || [];
          self.currentDrafter = data.currentDrafter;

          // Show notification to user
          var newParticipant =
            data.draftParticipants[data.draftParticipants.length - 1];
          if (newParticipant && newParticipant.id !== self.userId) {
            console.log("👋 " + newParticipant.username + " joined the draft!");
          }
        }),
      );

      // ========================================
      // 6. ⭐ JOIN DRAFT (OTHER USER JOINED!) ⭐
      // ========================================
      console.log("🎧 [Listeners] Setting up: join-draft ← THIS WAS MISSING!");
      track(
        onDraftEvent(DRAFT_EVENTS.JOIN_DRAFT, function (data) {
          console.log("📥 [Listeners] RECEIVED: join-draft!");
          console.log(
            "   User joined:",
            data.username,
            "(ID:",
            data.userId + ")",
          );

          // Ignore own joins (we already handle locally)
          if (data.userId === self.userId) {
            console.log("   (Ignoring own join)");
            return;
          }

          // Add to participants list if not already there
          var exists = self.draftParticipants.find(function (p) {
            return p.id === data.userId;
          });

          if (!exists) {
            console.log("✅ Adding " + data.username + " to participant list!");
            self.draftParticipants.push({
              id: data.userId,
              username: data.username,
            });

            // Vue reactivity trigger
            self.draftParticipants = [...self.draftParticipants];

            // Optional: Show browser notification
            if (Notification.permission === "granted") {
              new Notification("Fantasy Draft", {
                body: data.username + " joined the draft!",
                icon: "/logo.png",
              });
            }
          } else {
            console.log("   (Already in list)");
          }
        }),
      );

      // ========================================
      // 7. LEAVE DRAFT (user left)
      // ========================================
      console.log("🎧 [Listeners] Setting up: leave-draft");
      track(
        onDraftEvent(DRAFT_EVENTS.LEAVE_DRAFT, function (data) {
          console.log("📥 [Listeners] RECEIVED: leave-draft");
          self.draftParticipants = self.draftParticipants.filter(function (p) {
            return p.id !== data.userId;
          });
        }),
      );

      // ========================================
      // 8. DRAFT STARTED
      // ========================================
      console.log("🎧 [Listeners] Setting up: start-draft");
      track(
        onDraftEvent(DRAFT_EVENTS.START_DRAFT, function (data) {
          console.log("📥 [Listeners] RECEIVED: start-draft");
          self.draftStarted = true;
          self.handleDraftStart(data);
        }),
      );

      // ========================================
      // 9. DRAFT FINISHED
      // ========================================
      console.log("🎧 [Listeners] Setting up: draft-finished");
      track(
        onDraftEvent(DRAFT_EVENTS.DRAFT_FINISHED, async function (data) {
          console.log("📥 [Listeners] RECEIVED: draft-finished");
          await self.handleDraftFinished(data);
        }),
      );

      // ========================================
      // 10. SWAP PROPOSAL
      // ========================================
      console.log("🎧 [Listeners] Setting up: swap-proposed");
      track(
        onDraftEvent(DRAFT_EVENTS.SWAP_PROPOSED, function (data) {
          console.log("📥 [Listeners] RECEIVED: swap-proposed");
          self.handleSwapProposal(data);
        }),
      );
      console.log("🎧 [Listeners] Setting up: request-state");
      track(
        onDraftEvent(DRAFT_EVENTS.REQUEST_STATE, function (data) {
          console.log(
            "📥 [Listeners] Someone requested current state! Sending ours...",
          );

          // If we have valid state, broadcast it
          if (self.draftStarted && self.draftQueue.length > 0) {
            console.log("   Responding with our state...");

            var allTeams = {};
            allTeams[self.userId] = self.selectedTeam;
            Object.keys(self.otherTeams).forEach(function (key) {
              allTeams[key] = self.otherTeams[key];
            });

            // Delay slightly to ensure requester is listening
            setTimeout(function () {
              broadcastCurrentState(
                {
                  pickedPlayers: allTeams,
                  draftParticipants: self.draftParticipants,
                  currentDrafter: self.currentDrafter,
                  draftQueue: self.draftQueue,
                  currentPick: self.currentPick,
                  draftStarted: self.draftStarted,
                },
                self.leagueId,
              );
            }, 500);
          } else {
            console.log("   No state to send (draft not started or empty)");
          }
        }),
      );
      // ========================================
      // SUMMARY
      // ========================================
      console.log("✅ [Listeners] All listeners configured!");
      console.log("   Total subscriptions:", self._unsubscribeFunctions.length);
      console.log("");
      console.log("🎯 Now listening for events from other users...");
    },

    // =========================================================================
    // EVENT HANDLERS
    // =========================================================================

    /**
     * Handle incoming current state (full sync)
     */
    handleCurrentStateUpdate({
      pickedPlayers,
      draftParticipants,
      currentDrafter,
      draftQueue,
      draftStarted,
    }) {
      console.log("📦 [DraftComponent] Received current state");

      // Update local state
      this.otherTeams = { ...pickedPlayers };
      this.draftParticipants = draftParticipants || [];
      this.draftQueue = draftQueue || [];
      this.draftStarted = draftStarted || false;
      this.currentDrafter = currentDrafter;

      // Restore user's own team from synced state
      if (this.otherTeams[this.userId]) {
        this.selectedTeam = { ...this.otherTeams[this.userId] };
      } else {
        this.selectedTeam = DraftLogic.getEmptyTeam();
      }

      // Remove self from "other teams" view
      delete this.otherTeams[this.userId];

      // Calculate current pick index
      this.currentPick = this.draftQueue.findIndex((pick) => !pick.player);
      if (this.currentPick === -1) this.currentPick = this.draftQueue.length;
    },

    /**
     * Handle player selected by another user
     */
    handlePlayerSelectedEvent({ clientId, player, role }) {
      // Ignore own events (we already updated locally)
      if (clientId === this.userId) return;

      console.log(
        `👤 [DraftComponent] ${clientUsername || clientId} selected ${
          player?.summonerName
        }`,
      );

      // Initialize opponent team slot if needed
      if (!this.otherTeams[clientId]) {
        this.otherTeams[clientId] = DraftLogic.getEmptyTeam();
      }

      // Update their roster
      const roleKey = `${role}Player`;
      if (this.otherTeams[clientId][roleKey]) {
        this.otherTeams[clientId][roleKey].player = player;
      }
    },

    /**
     * Handle team selected by another user
     */
    handleTeamSelectedEvent({ clientId, team }) {
      if (clientId === this.userId) return;

      console.log(
        `🏆 [DraftComponent] ${clientId} selected team ${team?.name}`,
      );

      if (!this.otherTeams[clientId]) {
        this.otherTeams[clientId] = DraftLogic.getEmptyTeam();
      }

      if (this.otherTeams[clientId]["team"]) {
        this.otherTeams[clientId]["team"].team = team;
      }
    },

    /**
     * Handle draft completion
     */
    async handleDraftFinished(data) {
      console.log(
        "🏁 [DraftComponent] Received draft-finished event from someone else!",
      );

      // Prevent double-processing if we already handled it locally
      if (this.loader && this.activeTab === "swaps") {
        console.log(
          "⚠️  [DraftComponent] Already processing finish, skipping duplicate",
        );
        return;
      }

      this.loader = true;

      try {
        // Refresh data
        await this.refetchTeams();
      } catch (error) {
        console.error("❌ Error in remote finish handler:", error);
      } finally {
        this.loader = false;
        this.activeTab = "swaps";
        console.log(
          "✅ [DraftComponent] Remote finish processed, now on swaps tab",
        );
      }
    },

    /**
     * Handle swap proposal notification
     */
    handleSwapProposal({ leagueId, receiverUserId }) {
      const myTeamId = this.selectedUserTeam.userTeamId;

      if (receiverUserId == myTeamId) {
        console.log("🔄 [DraftComponent] Received swap proposal");

        // Trigger child component refresh
        this.$refs.swapMain?.fetchSwaps();

        // Show notification
        this.swapNotification = true;
        setTimeout(() => {
          this.swapNotification = false;
        }, 6000);
      }
    },

    /**
     * Handle draft start event
     */
    handleDraftStart(data) {
      console.log("▶️  [DraftComponent] Draft started event received");

      this.draftStarted = true;

      if (this.draftQueue.length === 0 && this.draftParticipants.length >= 2) {
        var totalPicks = 7 * this.draftParticipants.length;
        this.draftQueue = this.createDraftQueue(
          this.draftParticipants,
          totalPicks,
        );
        this.currentPick = 0;

        if (this.draftQueue[0]?.user?.id) {
          this.currentDrafter = this.draftQueue[0].user.id;

          // Broadcast state so everyone gets queue
          setTimeout(() => this.broadcastFullState(), 100);
        }
      }

      // Show notification to user
      this.showNotification("Draft has started!", "info");
    },
    showNotification(message, type) {
      console.log("🔔 " + message);

      // Try browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Fantasy LoL", { body: message });
      }

      // Could also add a toast/snackbar here
    },
    createDraftQueue(participants, totalPicks) {
      var draftQueue = [];
      var rounds = Math.ceil(totalPicks / participants.length);

      // Shuffle participants for random order
      var shuffled = participants.slice().sort(function () {
        return Math.random() - 0.5;
      });

      console.log(
        "[DraftComponent] Shuffle order:",
        shuffled.map(function (p) {
          return p.username;
        }),
      );

      for (var round = 0; round < rounds; round++) {
        if (round % 2 === 0) {
          // Forward order
          for (var i = 0; i < shuffled.length; i++) {
            draftQueue.push({ user: shuffled[i], player: null });
          }
        } else {
          // Reverse order (snake effect)
          for (var j = shuffled.length - 1; j >= 0; j--) {
            draftQueue.push({ user: shuffled[j], player: null });
          }
        }
      }

      return draftQueue;
    },
    broadcastFullState() {
      console.log("📡 [DraftComponent] Broadcasting full state...");

      var allTeams = {};
      allTeams[this.userId] = this.selectedTeam;
      // Merge other teams we know about
      Object.keys(this.otherTeams).forEach(
        function (key) {
          allTeams[key] = this.otherTeams[key];
        }.bind(this),
      );

      broadcastCurrentState(
        {
          pickedPlayers: allTeams,
          draftParticipants: this.draftParticipants,
          currentDrafter: this.currentDrafter,
          draftQueue: this.draftQueue,
          currentPick: this.currentPick,
          draftStarted: this.draftStarted,
        },
        this.leagueId,
      );
    },
    // =========================================================================
    // USER ACTIONS
    // =========================================================================

    /**
     * Join the draft room
     */
    joinDraft(event) {
      console.log("🚪 [DraftComponent] Join draft clicked");

      var self = this;

      // Try immediately first
      var success = this.tryJoinNow();

      if (!success) {
        // If failed, show retry UI
        console.log("⏳ [DraftComponent] Will retry in 2 seconds...");

        var btn = event.target;
        var originalText = btn.innerText;
        btn.innerText = "Connecting...";
        btn.disabled = true;

        // Auto-retry after 2 seconds (gives Ably time to finish)
        setTimeout(function () {
          btn.innerText = originalText;
          btn.disabled = false;

          var retrySuccess = self.tryJoinNow();
          if (!retrySuccess) {
            btn.innerText = "Retry Join";
            btn.onclick = function () {
              self.joinDraft(event);
            };
          }
        }, 2000);
      }
    },

    /** Attempt the actual join operation */
    tryJoinNow() {
      try {
        // Optimistic attempt - just try it!
        console.log("🔄 [DraftComponent] Attempting join...");

        joinDraft(this.userId, this.userLogin, this.leagueId);

        // Update local state immediately (optimistic UI)
        if (
          !this.draftParticipants.find(
            function (p) {
              return p.id === this.userId;
            }.bind(this),
          )
        ) {
          this.draftParticipants.push({
            id: this.userId,
            username: this.userLogin,
          });
        }

        updateDraftOrder(this.draftParticipants, this.userId);

        console.log("✅ [DraftComponent] Join emitted!");
        return true;
      } catch (error) {
        console.warn(
          "⚠️  [DraftComponent] Join failed (will retry):",
          error.message,
        );
        return false;
      }
    },

    /**
     * Start the draft (only works if you're in participants)
     */
    startDraft() {
      if (!this.ablyReady) {
        alert("Still connecting... please wait.");
        return;
      }
      console.log("▶️  [DraftComponent] Starting draft...");

      startDraft(
        this.leagueId,
        this.realLeagueId,
        this.$store.getters.getCurrentTournamentId,
      );
    },

    /**
     * Select a player for current user's team
     */
    selectPlayer(player) {
      console.log("👤 [DraftComponent] selectPlayer() called");
      console.log("  Player:", player.summonerName);
      console.log("  Role:", this.roleToAddPlayer);
      console.log("  Is my turn?", this.isCurrentDrafter);
      console.log("  Current drafter ID:", this.currentDrafter);
      console.log("  My user ID:", this.userId);
      console.log("  Draft started?", this.draftStarted);
      console.log("  Queue length:", this.draftQueue.length);
      console.log("  Current pick index:", this.currentPick);

      // TEMPORARILY DISABLE TURN VALIDATION FOR TESTING
      // (Remove this block once drafts work!)
      /*
  var validation = DraftLogic.validateTurn(this.userId, this.draftQueue, this.currentPick);
  if (!validation.valid) {
    alert(validation.reason);
    console.warn('❌ Turn validation failed:', validation.reason);
    return;
  }
  */

      // Check if draft has actually started
      if (!this.draftStarted) {
        alert(
          "Draft has not started yet! Please wait for the commissioner to start the draft.",
        );
        console.warn("❌ Draft not started");
        return;
      }

      // Check if we have a queue
      if (!this.draftQueue || this.draftQueue.length === 0) {
        alert("Draft queue not initialized. Try refreshing.");
        console.warn("❌ No draft queue");
        return;
      }

      console.log("✅ Proceeding with selection...");

      // Process selection
      var roleKey = this.roleToAddPlayer + "Player";
      if (this.selectedTeam[roleKey]) {
        this.selectedTeam[roleKey].player = player;
      }

      // Update queue
      if (this.draftQueue[this.currentPick]) {
        this.draftQueue[this.currentPick].player = player;
      }

      // Advance pick
      this.currentPick++;

      // Emit to others
      playerSelected(this.userId, player, this.leagueId, this.roleToAddPlayer);

      // Broadcast updated state
      this.broadcastStateUpdate();

      // Check if draft complete
      if (this.currentPick >= this.draftQueue.length) {
        console.log("🏁 Draft complete!");
        this.completeDraft();
      }

      // Reset role
      this.roleToAddPlayer = "";
    },

    /**
     * Select a team for current user's roster
     */
    selectTeam(team) {
      const validation = DraftLogic.validateTurn(
        this.userId,
        this.draftQueue,
        this.currentPick,
      );

      if (!validation.valid) {
        alert(validation.reason);
        return;
      }

      console.log(`🏆 [DraftComponent] Selecting team: ${team.name}`);

      const result = DraftLogic.processTeamSelection({
        clientId: this.userId,
        team: team,
        pickedPlayers: {},
        draftQueue: this.draftQueue,
        currentPick: this.currentPick,
      });

      if (!result) return;

      // Update local state
      if (this.selectedTeam["team"]) {
        this.selectedTeam["team"].team = team;
      }

      this.draftQueue = result.updatedQueue;
      this.currentPick = result.newCurrentPick;

      // Emit to others
      teamSelected(this.userId, team, this.leagueId);

      // Broadcast state
      this.broadcastStateUpdate();

      // Check completion
      if (result.isComplete) {
        this.completeDraft();
      }

      this.roleToAddPlayer = "";
    },

    /**
     * Broadcast current state to all participants
     */
    broadcastStateUpdate() {
      // Build pickedPlayers from local state + other teams
      const allPickedPlayers = {
        [this.userId]: this.selectedTeam,
        ...this.otherTeams,
      };

      broadcastCurrentState(
        {
          pickedPlayers: allPickedPlayers,
          draftParticipants: this.draftParticipants,
          currentDrafter: DraftLogic.getCurrentDrafter(
            this.draftQueue,
            this.currentPick,
          )?.id,
          draftQueue: this.draftQueue,
          draftStarted: this.draftStarted,
        },
        this.leagueId,
      );

      // Update current drafter
      const nextDrafter = DraftLogic.getCurrentDrafter(
        this.draftQueue,
        this.currentPick,
      );
      if (nextDrafter) {
        updateCurrentDrafter(nextDrafter.id);
        this.currentDrafter = nextDrafter.id;
      }
    },

    /**
     * Complete the draft and save to API
     */
    async completeDraft() {
      console.log("🏁 [DraftComponent] Completing draft...");

      this.loader = true;

      try {
        // Build full state
        var allPickedPlayers = {};
        allPickedPlayers[this.userId] = this.selectedTeam;
        Object.keys(this.otherTeams).forEach(function (key) {
          allPickedPlayers[key] = this.otherTeams[key];
        });

        var draftData = {
          tournamentId: this.$store.getters.getCurrentTournamentId,
          leagueId: this.realLeagueId,
          invitationCode: this.leagueId,
          pickedPlayers: allPickedPlayers,
          draftParticipants: this.draftParticipants,
        };

        console.log("📤 [DraftComponent] Saving to API...");
        var result = await DraftLogic.saveDraftToAPI(draftData, this.apiURL);

        if (result.success) {
          console.log("✅ [DraftComponent] Draft saved to API!");

          // Notify everyone ELSE (they'll handle their own UI update)
          finishDraft(this.leagueId);

          // Emit finished event with full data (for others)
          emitDraftEvent(DRAFT_EVENTS.DRAFT_FINISHED, {
            pickedPlayers: allPickedPlayers,
            draftParticipants: this.draftParticipants,
            invitationCode: this.leagueId,
            finishedAt: Date.now(),
          });

          console.log("📡 [DraftComponent] Events emitted to others");

          // ⭐ CRITICAL FIX: Update OUR OWN UI too!
          // Don't wait for echo - we won't receive it
          console.log("🔄 [DraftComponent] Updating local UI...");

          // Simulate what the event handler would do
          await this.handleDraftFinishedLocally();
        } else {
          alert("Error saving draft: " + result.errors.join(", "));
          this.loader = false;
        }
      } catch (error) {
        console.error("❌ Error completing draft:", error);
        alert("Failed to save draft: " + error.message);
        this.loader = false;
      }
    },
    async handleDraftFinishedLocally() {
      console.log(
        "🏁 [DraftComponent] Handling finish locally (self-triggered)",
      );

      try {
        // Refresh team data from backend
        console.log("📥 [DraftComponent] Refetching teams...");
        await this.refetchTeams();

        console.log("✅ [DraftComponent] Teams refetched");

        // Switch to swaps tab
        console.log("🔄 [DraftComponent] Switching to swaps tab...");
        this.activeTab = "swaps";

        console.log("✅ [DraftComponent] Draft complete! Now on swaps view.");
      } catch (error) {
        console.error("❌ Error in local finish handler:", error);
      } finally {
        this.loader = false;
      }
    },
    // =========================================================================
    // UI EVENT HANDLERS (Template bindings)
    // =========================================================================

    choseRole(role) {
      console.log("📍 [DraftComponent] Role selected:", role);
      this.roleToAddPlayer = role;
    },

    playerSelected(player) {
      console.log(
        `Attempting to add ${player.summonerName} to ${this.roleToAddPlayer}`,
      );

      if (
        player.role == this.roleToAddPlayer ||
        this.roleToAddPlayer == "sub"
      ) {
        this.selectPlayer(player);
        this.roleToAddPlayer = "";
      } else {
        console.log("WRONG ROLE");
        // Optionally show user feedback
      }
    },

    playerSelectedDraft(player) {
      console.log(
        `Draft mode: ${player.summonerName} → ${this.roleToAddPlayer}`,
      );

      if (
        player.role == this.roleToAddPlayer ||
        this.roleToAddPlayer == "sub"
      ) {
        this.selectedFromUnusedPlayers = player;
      } else {
        console.log("WRONG ROLE");
      }
    },

    teamSelected(team) {
      console.log(`Adding team ${team.name} to ${this.roleToAddPlayer}`);

      if (this.roleToAddPlayer == "team") {
        this.selectTeam(team);
        this.roleToAddPlayer = "";
      } else {
        console.log("WRONG ROLE");
      }
    },

    teamSelectedDraft(team) {
      console.log(`Draft mode team: ${team.name}`);

      if (this.roleToAddPlayer == "team") {
        this.selectedFromUnusedPlayers = team;
      } else {
        console.log("WRONG ROLE");
      }
    },

    handleRemovePlayer(role) {
      console.log("Remove player from role:", role);
      // Implementation depends on whether removal is allowed during draft
      // Usually not allowed in live draft, only in swap phase
    },

    // =========================================================================
    // DATA FETCHING
    // =========================================================================

    async refetchTeams() {
      await this.getLeagueDetails(this.leagueId);
      await this.fetchUserTeam();
    },

    async fetchUserTeam() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/user_team/${this.userId}/${this.realLeagueId}`,
        );

        const userTeam = response.data;

        // Map API response to local structure
        const playerFields = [
          "topPlayer",
          "junglePlayer",
          "midPlayer",
          "bottomPlayer",
          "supportPlayer",
          "subPlayer",
        ];

        playerFields.forEach((field) => {
          if (userTeam[field]?.esportsPlayerId) {
            const found = this.availablePlayers.find(
              (p) => p.esportsPlayerId == userTeam[field].esportsPlayerId,
            );
            this.selectedUserTeam[field].player = found || null;
          }
        });

        if (userTeam.team?.esportsTeamId) {
          const found = this.availableTeams.find(
            (t) => t.esportsTeamId == userTeam.team.esportsTeamId,
          );
          this.selectedUserTeam.team.team = found || null;
        }

        // Copy metadata
        this.selectedUserTeam.captain = userTeam.captain;
        this.selectedUserTeam.transfersMade = userTeam.transfersMade;
        this.selectedUserTeam.transfersAvailable = userTeam.transfersAvailable;
        this.selectedUserTeam.chipActivated = userTeam.chipUsed ?? 0;
        this.selectedUserTeam.chips = userTeam.extraChips;
        this.selectedUserTeam.userTeamId = userTeam.userTeamId ?? null;
      } catch (error) {
        console.error("Error fetching user team:", error);
      }
    },

    async getFixtures() {
      try {
        const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`;
        const response = await this.axios.get(url);

        this.matchesByFixture = response.data.fixturesWithMatches;

        // Find next upcoming fixture
        const upcomingFixtures = this.matchesByFixture
          .filter((m) => new Date(m.fixture.deadlineDate) > new Date())
          .sort(
            (a, b) =>
              new Date(a.fixture.deadlineDate) -
              new Date(b.fixture.deadlineDate),
          );

        this.nextFixture = upcomingFixtures[0] || null;

        if (this.nextFixture) {
          this.teamsPlayingInNextFixture = this.nextFixture.matches
            .filter((m) => m.team1 != null && m.team2 != null)
            .flatMap((m) => [m.team1, m.team2])
            .map((m) => m.code);
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    async fetchPlayers() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/players`,
        );
        this.availablePlayers = response.data;
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    },

    async fetchTeams() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/teams`,
        );
        this.availableTeams = response.data;
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    },

    async getLeagueDetails(invitationCode) {
      try {
        const response = await this.axios.get(
          `${this.apiURL}Draft/${this.$store.getters.getCurrentTournamentId}/league/${invitationCode}`,
        );

        this.currentLeague = response.data;
        this.realLeagueId = this.currentLeague.participants[0].fantasyLeagueId;

        this.fillLeagueDetails(this.currentLeague);
      } catch (error) {
        console.error("Error fetching league details:", error);
      }
    },

    fillLeagueDetails(league) {
      this.otherFinishedTeams = league.participants
        .filter((p) => p.userId != this.userId)
        .reduce((acc, participant) => {
          if (participant.userTeam) {
            acc[participant.userId] = {
              team: participant.userTeam,
              user: {
                id: participant.userId,
                username: participant.userLogin,
              },
            };
            Object.values(acc[participant.userId].team)
              .filter((entry) => entry && (entry.player || entry.team))
              .forEach((playerEntry) => {
                const player = playerEntry.player;
                const team = playerEntry.team;
                if (player?.esportsPlayerId) {
                  const found = this.availablePlayers.find(
                    (p) => p.esportsPlayerId == player.esportsPlayerId,
                  );
                  if (found) {
                    player.points = found.points;
                    player.gamesPlayed = found.gamesPlayed;
                    player.matchesPlayed = found.matchesPlayed;
                  }
                }
                if (team?.esportsTeamId) {
                  const found = this.availableTeams.find(
                    (t) => t.esportsTeamId == team.esportsTeamId,
                  );
                  if (found) {
                    team.points = found.points;
                    team.gamesPlayed = found.gamesPlayed;
                    team.matchesPlayed = found.matchesPlayed;
                  }
                }
              });
          }
          return acc;
        }, {});
    },
  },
  beforeDestroy() {
    console.log("🧹 [DraftComponent] Cleaning up...");

    // Run all unsubscribe functions
    this._unsubscribeFunctions.forEach((unsub) => {
      if (typeof unsub === "function") unsub();
    });
    this._unsubscribeFunctions = [];

    // Disconnect from Ably
    disconnectAbly();
  },
};
</script>

<style scoped>
.draft-container {
  width: 85vw;
  display: flex;
  justify-content: space-between;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  margin: 5px 0;
}

li:hover {
  background-color: #f0f0f0;
}

.players-list-container {
  height: 80vh;
  border-radius: 5px;
  /* overflow-y: scroll; */
  /* overflow-x: scroll; */
  padding-left: 0%;
  padding-right: 0%;
  border: 1px solid #ddd;
}

.players-list-container.user-team {
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 0%;
  padding-right: 1rem;
  border: 1px solid #ddd;
}

.players-list-container.rival-team {
  height: 40vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 0%;
  padding-right: 1rem;
  border: none;
}

.cta-btn {
  margin-top: 1rem;
  margin-bottom: 1rem;
  /* width: 0.7vw; */
  padding: 0.75rem 2rem;
  background: var(--LIGHT-BLUE);
  color: #000;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  text-decoration: none;
}

.cta-btn:hover {
  background: #00aacc;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 10px;
  /* border: 1px solid rgba(255, 255, 255, 0.1); */
  margin-bottom: 15px;
  justify-content: center;
}

.tab-btn {
  background: none;
  color: #94a3b8;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;
  bottom: -1px;
}

.tab-btn:hover {
  color: var(--PRIMARY);
}

.tab-btn.active {
  color: var(--PRIMARY-DARKER, #00d9ff);
  border-radius: 10%;
  border-color: var(--PRIMARY-DARKER, #00d9ff);
}
.waiting-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--PRIMARY);
  margin-bottom: 6px;
}

.waiting-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 4px;
}

.waiting-list li {
  font-size: 14px;
  color: var(--PRIMARY);
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.swap-notification {
  position: relative;
  left: 50%;
  width: 50vw;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  background: var(--SECONDARY);
  border: 1px solid var(--PRIMARY);
  border-radius: 10px;
  color: var(--GREY-LIGHT);
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 24px rgba(166, 58, 159, 0.3);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.notification-dismiss {
  background: none;
  border: none;
  color: var(--ERROR);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  transition: color 0.2s;
}

.notification-dismiss:hover {
  color: var(--GREY-LIGHT);
}
</style>
