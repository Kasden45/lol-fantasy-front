<template>
  <div class="swap-request-card">
    <div class="trade-header">
      <!-- <span
              :style="{
                color: this.$func_global.draftTradeStatus[swap.status]?.color,
              }"
            >
              At {{ this.$func_global.formatDate(swap.dateOpened) }}
            </span> -->
      <span
        v-if="swap.status == 0"
        :style="{
          color: this.$func_global.draftTradeStatus[swap.status]?.color,
        }"
      >
        Expires in {{ this.timeToDeadline }}
        <!-- {{
                this.$func_global.formatDate(
                  this.nextFixture.fixture.deadlineDate,
                )
              }} -->
      </span>
      <span
        v-if="swap.status != 0"
        :style="{
          color: this.$func_global.draftTradeStatus[swap.status]?.color,
        }"
      >
        {{ this.$func_global.draftTradeStatus[swap.status]?.text }}
      </span>
      <span class="compare-btn" @click="openDetailsModal(swap)">
        <i class="fa-solid fa-scale-unbalanced" title="Compare players"></i>
      </span>
    </div>
    <div class="trade-header deadline-info"></div>
    <div class="swap-request-header">
      <span class="swap-from"
        >From: {{ swap.tradeInitiatorUserTeam.userLogin }}</span
      >
      <span class="swap-arrow-small">→</span>
      <span class="swap-to"
        >To: {{ swap.tradeReceiverUserTeam.userLogin }}</span
      >
    </div>

    <div class="swap-request-body">
      <div class="swap-player">
        <img
          v-if="swap.playerInitiator"
          :src="swap.playerInitiator.imageUrl"
          :alt="swap.playerInitiator.summonerName"
        />
        <span v-if="swap.playerInitiator">{{
          swap.playerInitiator.summonerName
        }}</span>
        <img
          v-if="swap.teamInitiator"
          :src="swap.teamInitiator.imageUrl"
          :alt="swap.teamInitiator.name"
        />
        <span v-if="swap.teamInitiator">{{ swap.teamInitiator.name }}</span>
      </div>
      <span class="for-text">for</span>
      <div class="swap-player">
        <img
          v-if="swap.playerReceiver"
          :src="swap.playerReceiver.imageUrl"
          :alt="swap.playerReceiver.summonerName"
        />
        <span v-if="swap.playerReceiver">{{
          swap.playerReceiver.summonerName
        }}</span>
        <img
          v-if="swap.teamReceiver"
          :src="swap.teamReceiver.imageUrl"
          :alt="swap.teamReceiver.name"
        />
        <span v-if="swap.teamReceiver">{{ swap.teamReceiver.name }}</span>
      </div>
    </div>

    <div class="swap-request-actions">
      <button
        v-if="
          swap.status == 0 &&
          swap.tradeReceiverUserTeam.userId == this.$store.getters.getProfileId
        "
        class="action-btn accept-btn"
        @click="acceptSwap(swap)"
      >
        Accept
      </button>
      <button
        v-if="
          swap.status == 0 &&
          swap.tradeReceiverUserTeam.userId == this.$store.getters.getProfileId
        "
        class="action-btn cancel-btn"
        @click="cancelSwap(swap)"
      >
        Decline
      </button>
      <button
        v-if="
          swap.status == 0 &&
          swap.tradeInitiatorUserTeam.userId == this.$store.getters.getProfileId
        "
        class="action-btn cancel-btn"
        @click="withdrawSwap(swap)"
      >
        Withdraw
      </button>
    </div>
  </div>
  <MyModal
    v-if="currentSwap"
    :openModal="this.openModal"
    @closeModal="closeDetailsModal"
    :title="''"
  >
    <ComparePlayers class="modal-compare" :swap="currentSwap" />
  </MyModal>
</template>
<script>
import ComparePlayers from "@/components/Draft/ComparePlayers.vue";
import MyModal from "../MyModal.vue";
export default {
  props: {
    swap: Object,
    timeToDeadline: String,
    // realLeagueId: Number,
  },
  components: { ComparePlayers, MyModal },
  data() {
    return {
      openModal: false,
      myOnlyFilter: false,
      selectedFilter: "all",
      currentSwap: null,
    };
  },
  computed: {},
  methods: {
    openDetailsModal(swap) {
      this.currentSwap = swap;
      this.openModal = true;
    },
    closeDetailsModal() {
      this.openModal = false;
      this.currentSwap = null;
    },
    acceptSwap(swap) {
      this.$emit("accept-swap", swap);
    },
    cancelSwap(swap) {
      this.$emit("cancel-swap", swap);
    },
    withdrawSwap(swap) {
      this.$emit("withdraw-swap", swap);
    },
  },
};
</script>
<style scoped>
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
  font-weight: 800;
}

.swap-request-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.fa-scale-unbalanced {
  color: var(--GREY);
}
.fa-scale-unbalanced:hover {
  color: var(--PRIMARY, #00d9ff) !important;
}
.compare-btn {
  cursor: pointer;
  transition: color 0.2s;
}
.compare-btn:hover {
  color: var(--PRIMARY, #00d9ff) !important;
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

.accept-btn {
  background: var(--GREEN-DARK);
  color: var(--GREY);
  border: 1px solid var(--GREEN-LIGHT);
}

.accept-btn:hover {
  background: var(--GREEN-LIGHT);
  border-color: var(--GREEN-DARK);
}
.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deadline-info {
  font-size: smaller;
  justify-content: end !important;
}
</style>
<style>
.modal-details {
  background-color: none;
  background: linear-gradient(
    135deg,
    var(--TABLE-ROW-SECONDARY),
    var(--TABLE-ROW-MAIN)
  );
}
</style>
