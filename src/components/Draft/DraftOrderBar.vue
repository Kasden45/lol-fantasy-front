<template>
  <div class="draft-order-section">
    <div class="header">
      <div class="title">
        {{
          this.tournaments[this.$store.getters.getCurrentTournamentId]
        }}
        Fantasy2KPI - Draft League
      </div>
      <div class="draft-info">
        <div class="info-item">
          <div class="info-label">Round</div>
          <div class="info-value">{{ currentRound }} of {{ totalRounds }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Pick</div>
          <div class="info-value">
            {{ currentPick + 1 }} of {{ totalPicks }}
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">Time Remaining</div>
          <div class="timer">1:45</div>
        </div>
      </div>
    </div>

    <!-- Draft Order -->
    <div class="draft-order-section">
      <div class="draft-order">
        <div
          class="drafter"
          v-for="(user, index) in totalPicks"
          :key="index"
          :class="{
            completed: index < currentPick,
            'your-turn': isYourTurn && index === currentPick,
            active: index === currentPick,
            'drafter-separator':
              (index + 1) % participants === 0 && index !== totalPicks - 1,
          }"
        >
          <div class="drafter-name">
            {{ draftQueue[index]?.user?.username }}
            {{ this.isYourTurn && index === currentPick ? "(Your Turn)" : "" }}
          </div>
          <div
            v-if="
              draftQueue[index]?.player?.summonerName == null &&
              draftQueue[index]?.player?.name == null
            "
            class="drafter-pick"
          >
            Pick {{ index + 1 }}
          </div>
          <div
            v-if="draftQueue[index]?.player?.summonerName !== null"
            class="drafter-pick"
          >
            {{ draftQueue[index]?.player?.team?.code }}
            {{ draftQueue[index]?.player?.summonerName }}
          </div>
          <div
            v-if="draftQueue[index]?.player?.name !== null"
            class="drafter-pick"
          >
            {{ draftQueue[index]?.player?.code }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DraftOrderBar",
  props: {
    draftQueue: {
      type: Object,
      default: {
        0: {
          user: { id: 5, username: "Cond1tion" },
          player: { team: "T1", summonerName: "Faker" },
        },
        1: {
          user: { id: 6, username: "SlyMarb0" },
          player: { team: "GEN", summonerName: "Ruler" },
        },
        2: {
          user: { id: 7, username: "Konjix" },
          player: { team: "GEN", summonerName: "Chovy" },
        },
        3: {
          user: { id: 8, username: "Hakkene" },
          player: { team: "GEN", summonerName: "Canyon" },
        },
        4: {
          user: { id: 8, username: "Hakkene" },
          player: { team: "T1", summonerName: "Faker" },
        },
        5: {
          user: { id: 7, username: "Konjix" },
          player: { team: "GEN", summonerName: "Ruler" },
        },
        6: { user: { id: 5, username: "SlyMarb0" }, player: null },
        7: { user: { id: 5, username: "Cond1tion" }, player: null },
        8: { user: { id: 5, username: "Cond1tion" }, player: null },
        9: { user: { id: 5, username: "SlyMarb0" }, player: null },
        10: { user: { id: 5, username: "Konjix" }, player: null },
        11: { user: { id: 5, username: "Hakkene" }, player: null },
        12: { user: { id: 5, username: "Hakkene" }, player: null },
        13: { user: { id: 5, username: "Konjix" }, player: null },
        14: { user: { id: 5, username: "SlyMarb0" }, player: null },
        15: { user: { id: 5, username: "Cond1tion" }, player: null },
        16: { user: { id: 5, username: "Cond1tion" }, player: null },
        17: { user: { id: 5, username: "SlyMarb0" }, player: null },
        18: { user: { id: 5, username: "Konjix" }, player: null },
        19: { user: { id: 5, username: "Hakkene" }, player: null },
        20: { user: { id: 5, username: "Hakkene" }, player: null },
        21: { user: { id: 5, username: "Player3" }, player: null },
        22: { user: { id: 5, username: "Player2" }, player: null },
        23: { user: { id: 5, username: "Cond1tion" }, player: null },
      },
    },
    participants: {
      type: Number,
      required: true,
    },
    draftTitle: {
      type: String,
      default: "Fantasy Draft",
    },
    totalRounds: {
      type: Number,
      required: true,
    },
    currentPick: {
      type: Number,
      required: true,
    },
    timeRemaining: {
      type: Number,
      required: true,
    },
    isYourTurn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      teamSize: 7,
    };
  },
  computed: {
    currentRound() {
      return Math.floor(this.currentPick / this.participants) + 1;
    },
    totalPicks() {
      return this.totalRounds * this.participants;
    },
    statusMessage() {
      if (this.isYourTurn) return "Your turn!";
      return "Waiting for others";
    },
    statusClass() {
      return {
        "your-turn": this.isYourTurn,
      };
    },
    timerClass() {
      return {
        critical: this.timeRemaining < 10,
        warning: this.timeRemaining < 30 && this.timeRemaining >= 10,
      };
    },
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },
  },
  watch: {
    currentPick() {
      this.$nextTick(() => {
        const draftOrder = document.querySelector(".draft-order");
        const activeDrafter = document.querySelector(".drafter.active");
        if (draftOrder && activeDrafter) {
          const scrollLeft =
            activeDrafter.offsetLeft -
            draftOrder.offsetWidth / 2 +
            activeDrafter.offsetWidth / 2;
          draftOrder.scrollLeft = scrollLeft;
        }
      });
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--SECONDARY);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: var(--PRIMARY);
}

.draft-info {
  display: flex;
  gap: 30px;
  align-items: center;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: var(--GREY-LIGHT);
  margin-bottom: 4px;
}

.info-value {
  font-size: 18px;
  font-weight: bold;
  color: var(--PRIMARY);
}

.timer {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
  min-width: 80px;
  text-align: center;
}

/* Draft Order Bar */
.draft-order-section {
  margin-bottom: 25px;
  border-radius: 12px;
  background: var(--SECONDARY);
}

.section-title {
  font-size: 14px;
  color: var(--PRIMARY);
  margin-bottom: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.draft-order {
  display: flex;
  gap: 12px;
  background: var(--SECONDARY);
  padding: 20px;
  border-radius: 12px;
  overflow-x: auto;
}

.drafter-separator {
  /* width: 1px; */
  /* height: 40px; */
  background: rgba(255, 255, 255, 0.2);
  margin: 0 12px 0 0;
}

.drafter {
  flex-shrink: 0;
  text-align: center;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  min-width: 120px;
  transition: all 0.3s ease;
}

.drafter.active {
  background: linear-gradient(
    135deg,
    var(--PRIMARY) 0%,
    var(--PRIMARY-LIGHTER) 100%
  );
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--PRIMARY);
}

.drafter.your-turn {
  background: linear-gradient(
    135deg,
    var(--GREEN-DARK) 100%,
    var(--GREEN-LIGHT) 10%
  );
}

.drafter.completed {
  opacity: 0.5;
}

.drafter-name {
  font-weight: bold;
  margin-bottom: 4px;
  color: var(--GREY-LIGHT);
}

.drafter-pick {
  font-size: 12px;
  color: var(--GREY);
}

.drafter.active .drafter-pick {
  color: #fff;
}

/* Main Content Grid */
.main-grid {
  display: grid;
  grid-template-columns: 350px 1fr 300px;
  gap: 20px;
  margin-bottom: 20px;
}

/* Left Sidebar - Team Rosters */
.team-rosters {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.roster-team {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.roster-team.current-turn {
  border: 2px solid #00d9ff;
  background: rgba(0, 217, 255, 0.1);
}

.roster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.roster-name {
  font-weight: bold;
  font-size: 14px;
}

.roster-count {
  font-size: 12px;
  color: #94a3b8;
}

.roster-picks {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.roster-pick {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
}

.position-badge {
  background: #a855f7;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  min-width: 35px;
  text-align: center;
}

/* Center - Player Pool */
.player-pool {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.pool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.filter-btn.active {
  background: #a855f7;
  border-color: #a855f7;
}

.search-box {
  flex: 1;
  max-width: 300px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
}

.search-box::placeholder {
  color: #94a3b8;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 15px;
  max-height: calc(100vh - 450px);
  overflow-y: auto;
  padding-right: 10px;
}

.player-card {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.player-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  border-color: #00d9ff;
}

.player-card.drafted {
  opacity: 0.4;
  pointer-events: none;
}

.player-card.drafted::after {
  content: "DRAFTED";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  color: #ef4444;
}

.player-team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.team-badge {
  font-size: 11px;
  font-weight: bold;
  color: #00d9ff;
}

.player-role {
  background: rgba(168, 85, 247, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}

.player-image {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.player-name {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
}

.player-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-weight: bold;
  color: #00d9ff;
}

.stat-label {
  color: #94a3b8;
}

/* Right Sidebar - Draft History & Actions */
.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.draft-actions {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.selected-player {
  text-align: center;
  padding: 20px;
  background: rgba(168, 85, 247, 0.1);
  border: 2px dashed #a855f7;
  border-radius: 8px;
  margin-bottom: 15px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.selected-player.has-selection {
  border-style: solid;
  background: rgba(168, 85, 247, 0.2);
}

.draft-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00d9ff 0%, #0099ff 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.draft-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 217, 255, 0.4);
}

.draft-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.draft-history {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 12px;
}

.pick-number {
  background: #a855f7;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.7);
}

/* Responsive */
@media (max-width: 1400px) {
  .main-grid {
    grid-template-columns: 300px 1fr 280px;
  }
}

@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .team-rosters,
  .right-sidebar {
    max-height: none;
  }
}

.auto-draft-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
}

.toggle-switch {
  width: 40px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: #00d9ff;
}

.toggle-slider {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: left 0.3s;
}

.toggle-switch.active .toggle-slider {
  left: 22px;
}
</style>
