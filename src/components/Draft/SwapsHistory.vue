<template>
  <div class="swap-history-section">
    <div class="history-header">
      <h3>Swap history</h3>
      <span v-if="pendingSwaps.length" class="swap-count">{{
        pendingSwaps.length
      }}</span>
    </div>
    <div class="filters-row">
      <!-- Role Filters -->
      <div class="filter-group">
        <div class="filter-buttons">
          <button
            class="filter-btn"
            :class="{ active: selectedFilter === 'any' }"
            @click="filterSwaps('any')"
          >
            All
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedFilter === 'pending' }"
            @click="filterSwaps('pending')"
          >
            Pending
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedFilter === 'completed' }"
            @click="filterSwaps('completed')"
          >
            Completed
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedFilter === 'unsuccesful' }"
            @click="filterSwaps('unsuccesful')"
          >
            Unsuccesful
          </button>
        </div>
      </div>

      <!-- Sort Dropdown -->
      <div class="filter-group">
        <!-- Active Only Toggle -->
        <div class="filter-group">
          <label class="toggle-label">
            <input
              type="checkbox"
              v-model="myOnlyFilter"
              class="toggle-input"
            />
            <span class="toggle-text">My only</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="pendingSwaps.length > 0">
      <template v-for="fixture in fixturesSwaps" :key="fixtureId">
        <div class="fixture-group">
          <div class="fixture-header">
            <div class="fixture-id">{{ fixture.name }}</div>
          </div>
          <div class="swap-requests-list">
            <div
              v-for="swap in groupedSwaps[fixture.fixtureId]"
              :key="swap.lolDraftTradeId"
            >
              <SwapCard
                :swap="swap"
                :time-to-deadline="timeToDeadline"
                @accept-swap="acceptSwap"
                @cancel-swap="cancelSwap"
                @withdraw-swap="withdrawSwap"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else class="no-swaps">
      <p>No pending swap requests</p>
    </div>
  </div>
</template>
<script>
import SwapCard from "./SwapCard.vue";
export default {
  props: {
    pendingSwaps: Array,
    fixtures: Array,
    // realLeagueId: Number,
  },
  components: { SwapCard },
  data() {
    return {
      openModal: false,
      myOnlyFilter: false,
      selectedFilter: "any",
      timeToDeadline: "",
      currentSwap: null,
    };
  },
  computed: {
    fixturesSwaps() {
      return this.fixtures
        .filter((f) => new Date(f.opensAtDate) < new Date())
        .sort(function (a, b) {
          return new Date(b.order) - new Date(a.order);
        });
    },
    groupedSwaps() {
      return this.filteredSwaps.reduce((groups, swap) => {
        const key = swap.fixtureId;
        if (!groups[key]) groups[key] = [];
        groups[key].push(swap);
        return groups;
      }, {});
    },
    filteredSwaps() {
      var swapsToReturn = this.pendingSwaps.filter((swap) => {
        if (this.selectedFilter === "pending") {
          return swap.status === 0;
        } else if (this.selectedFilter === "completed") {
          return swap.status === 1;
        } else if (this.selectedFilter === "unsuccesful") {
          return swap.status === 2 || swap.status === 3 || swap.status === 4;
        }
        return "all"; // 'all' or any other filter
      });

      return swapsToReturn
        .filter((swap) => {
          if (this.myOnlyFilter) {
            return (
              swap.tradeInitiatorUserTeam.userId ===
                this.$store.getters.getProfileId ||
              swap.tradeReceiverUserTeam.userId ===
                this.$store.getters.getProfileId
            );
          } else {
            return true; // No filtering, return all
          }
        })
        .sort(function (a, b) {
          return new Date(b.dateOpened) - new Date(a.dateOpened);
        });
    },
  },
  methods: {
    filterSwaps(filter) {
      this.selectedFilter = filter;
    },
    async acceptSwap(swap) {
      var swapRequest = {
        LolDraftTradeId: swap.lolDraftTradeId,
        UpdateStatus: 1,
      };
      try {
        const response = await this.axios.put(
          `${this.apiURL}Draft/${this.$store.getters.getCurrentTournamentId}/trades/${this.$store.getters.getProfileId}`,
          swapRequest,
        );
        console.log("Swap accepted", response.data);
        this.$emit("refresh-swaps");
      } catch (error) {
        console.error("Error swapping", error);
      }
    },
    async cancelSwap(swap) {
      var swapRequest = {
        LolDraftTradeId: swap.lolDraftTradeId,
        UpdateStatus: 2,
      };
      try {
        const response = await this.axios.put(
          `${this.apiURL}Draft/${this.$store.getters.getCurrentTournamentId}/trades/${this.$store.getters.getProfileId}`,
          swapRequest,
        );
        console.log("Swap canceled", response.data);
        this.$emit("refresh-swaps");
      } catch (error) {
        console.error("Error canceling swap", error);
      }
    },
    async withdrawSwap(swap) {
      var swapRequest = {
        LolDraftTradeId: swap.lolDraftTradeId,
        UpdateStatus: 4,
      };
      try {
        const response = await this.axios.put(
          `${this.apiURL}Draft/${this.$store.getters.getCurrentTournamentId}/trades/${this.$store.getters.getProfileId}`,
          swapRequest,
        );
        console.log("Swap withdrawn", response.data);
        this.$emit("refresh-swaps");
      } catch (error) {
        console.error("Error withdrawing swap", error);
      }
    },
    openDetailsModal(swap) {
      this.currentSwap = swap;
      this.openModal = true;
    },
    closeDetailsModal(name) {
      // console.log(detailsData)
      this.openModal = false;
      // this.detailsData = detailsData
    },
    async deadlineCountdown() {
      if (this.$store.getters.getNextFixture != null) {
        const deadline = new Date(
          this.$store.getters.getNextFixture.fixture.deadlineDate,
        );
        const now = new Date();
        const diff = deadline - now;
        const days = Math.floor(diff / 864e5);
        const hours = Math.floor((diff % 864e5) / 36e5);
        const minutes = Math.floor((diff % 36e5) / 6e4);
        const seconds = Math.floor((diff % 6e4) / 1000);
        // console.log(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        this.timeToDeadline = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    },
  },
  created() {
    this.timer = setInterval(() => {
      this.deadlineCountdown();
    }, 1000);
  },
};
</script>

<style scoped>
/* Swap History */
.swap-history-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
  color: var(--PRIMARY);
}

.history-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.history-header h3 {
  margin: 0;
  color: var(--PRIMARY);
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 2fr));
  gap: 12px;
}

.no-swaps {
  text-align: center;
  padding: 20px;
  color: #64748b;
  font-size: 12px;
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
.fixture-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 4px;
  margin: 20px 0 8px;
  border-bottom: 2px solid #e2e8f0;
}
.fixture-id {
  font-size: large;
  font-weight: 900;
  color: var(--PRIMARY);
  white-space: nowrap;
}

.fixture-divider {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}
.fixture-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
