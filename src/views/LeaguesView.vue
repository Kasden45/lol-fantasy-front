<template>
  <div class="leagues-page">
    <LazyLoader v-if="loader" />

    <div class="page-header">
      <div class="header-accent" />
      <div>
        <p class="eyebrow">LOL Fantasy</p>
        <h1 class="page-title">Leagues</h1>
      </div>
    </div>

    <div class="leagues-layout">
      <!-- Left Column: Actions -->
      <div class="actions-column">
        <!-- Create League -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Create a League</h2>
          </div>
          <div class="field-group">
            <label class="field-label">Mode</label>
            <select v-model="selectedMode" class="field-select">
              <option value="Normal">Regular Mode</option>
              <option value="Draft">Draft Mode</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">League Name</label>
            <input
              v-model="newLeagueName"
              data-testid="league-name-input"
              class="field-input"
              placeholder="Enter league name"
            />
          </div>
          <button class="btn-primary" data-testid="league-create-btn" @click="createLeague">
            Create League
          </button>
        </div>

        <!-- Join League -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Join a League</h2>
          </div>
          <div class="field-group">
            <label class="field-label">Invitation Code</label>
            <input
              v-model="invitationCode"
              data-testid="league-join-code-input"
              class="field-input"
              placeholder="Enter invitation code"
            />
          </div>
          <button class="btn-secondary" data-testid="league-join-btn" @click="joinLeague">Join League</button>
        </div>
      </div>

      <!-- Right Column: League List -->
      <div class="leagues-column">
        <div class="leagues-list-header">
          <h2 class="section-title">Your Leagues</h2>
          <span class="league-count">{{ userLeagues.length }}</span>
        </div>

        <div v-if="userLeagues.length === 0" class="empty-state">
          <p class="empty-text">No leagues yet</p>
          <p class="empty-sub">Create or join one to get started</p>
        </div>

        <div
          v-for="(league, index) in userLeagues"
          :key="league.invitationCode"
          :data-testid="'league-row-' + league.invitationCode"
          class="league-row"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <div class="league-row-left">
            <span
              class="mode-badge"
              :class="`mode-${league.mode.toLowerCase()}`"
            >
              {{ league.mode }}
            </span>
            <span class="league-row-name">{{ league.name }}</span>
          </div>
          <router-link
            class="btn-details"
            :to="{
              name: 'SingleLeagueView',
              params: {
                leagueCode: league.invitationCode,
                leagueMode: league.mode,
              },
            }"
          >
            Details →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LazyLoader from "@/components/LazyLoader.vue";
export default {
  components: {
    LazyLoader,
  },
  data() {
    return {
      loader: false,
      newLeagueName: "",
      selectedMode: "Normal",
      invitationCode: "",
      userLeagues: [],
      currentLeague: null,
    };
  },
  methods: {
    async createLeague() {
      this.loader = true;
      try {
        const response = await this.axios.post(
          `${this.apiURL}User/${this.$store.getters.getCurrentTournamentId}/league/create`,
          {
            idOwner: this.$store.getters.getProfileId, // Set the user's ID
            name: this.newLeagueName,
            mode: this.selectedMode,
          },
        );
        // Add the created league to the list of user leagues
        this.userLeagues.push(response.data);
        this.newLeagueName = ""; // Clear the input field
        this.loader = false;
      } catch (error) {
        this.loader = false;
      }
    },
    async joinLeague() {
      this.loader = true;
      try {
        const response = await this.axios.post(
          `${this.apiURL}User/league/join`,
          {
            userId: this.$store.getters.getProfileId, // Set the user's ID
            invitationCode: this.invitationCode,
          },
        );
        // Add the joined league to the list of user leagues
        this.userLeagues.push(response.data);
        this.invitationCode = ""; // Clear the input field
        this.loader = false;
      } catch (error) {
        this.loader = false;
      }
    },
    async getLeagueDetails(invitationCode) {
      try {
        const response = await this.axios.get(
          `${this.apiURL}User/league/${invitationCode}`,
        );
        this.currentLeague = response.data;
      } catch (error) {
      }
    },
    async fetchUserLeagues() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}User/${this.$store.getters.getCurrentTournamentId}/leagues/${this.$store.getters.getProfileId}`,
        ); // Replace with the correct endpoint
        this.userLeagues = response.data;
      } catch (error) {
      }
    },
  },
  mounted() {
    // Fetch the list of leagues the user is in when the component is mounted
    this.fetchUserLeagues();
  },
};
</script>

<style scoped>
.leagues-page {
  min-height: 100vh;
  background-color: var(--BACKGROUND-DARK);
  padding: 48px 32px;
  font-family: "DM Sans", sans-serif;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto 40px;
}

.header-accent {
  width: 4px;
  height: 52px;
  border-radius: 4px;
  background: linear-gradient(180deg, var(--PRIMARY), var(--PRIMARY-LIGHTER));
  flex-shrink: 0;
}

.eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--PRIMARY);
}

.page-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--GREY-LIGHT);
  line-height: 1;
}

/* Layout */
.leagues-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}

@media (max-width: 768px) {
  .leagues-layout {
    grid-template-columns: 1fr;
  }
}

/* Actions Column */
.actions-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon {
  font-size: 18px;
}

.card-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
}

.field-input,
.field-select {
  background: var(--BACKGROUND-DARK);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--GREY);
  font-size: 14px;
  font-family: "DM Sans", sans-serif;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.field-input:focus,
.field-select:focus {
  border-color: var(--PRIMARY);
}

.field-input::placeholder {
  color: var(--GREY-DARKER);
}

.field-select option {
  background: var(--SECONDARY);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, var(--PRIMARY), var(--PRIMARY-DARKER));
  border: none;
  border-radius: 8px;
  color: var(--GREY-LIGHT);
  font-size: 14px;
  font-weight: 700;
  font-family: "DM Sans", sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid var(--PRIMARY);
  border-radius: 8px;
  color: var(--PRIMARY-LIGHTER);
  font-size: 14px;
  font-weight: 700;
  font-family: "DM Sans", sans-serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-secondary:hover {
  background: var(--BACKGROUND-LIGHTER);
  transform: translateY(-1px);
}

/* Leagues Column */
.leagues-column {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.leagues-list-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.league-count {
  background: var(--BACKGROUND-LIGHTER);
  color: var(--PRIMARY-LIGHTER);
  font-size: 12px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid var(--GREY-DARKER);
}

.league-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 10px;
  margin-bottom: 8px;
  transition: border-color 0.2s, background 0.2s;
  animation: fadeSlideIn 0.4s ease both;
}

.league-row:hover {
  border-color: var(--PRIMARY-DARKER);
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.league-row-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
}

.mode-draft {
  background: var(--BACKGROUND-LIGHTER);
  color: var(--PRIMARY-LIGHTER);
  border: 1px solid var(--PRIMARY-DARKER);
}

.mode-normal {
  background: var(--BACKGROUND-LIGHTER);
  color: var(--BLUE);
  border: 1px solid var(--BLUE);
}

.league-row-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--GREY-LIGHT);
}

.btn-details {
  font-size: 13px;
  font-weight: 700;
  color: var(--PRIMARY);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid var(--PRIMARY-DARKER);
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}

.btn-details:hover {
  background: var(--BACKGROUND-LIGHTER);
  color: var(--PRIMARY-LIGHTER);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--BACKGROUND-LIGHTER);
  border: 1px dashed var(--GREY-DARKER);
  border-radius: 12px;
}

.empty-icon {
  font-size: 40px;
  margin: 0 0 12px;
}

.empty-text {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--GREY-LIGHT);
}

.empty-sub {
  margin: 0;
  font-size: 13px;
  color: var(--GREY-DARKER);
}
</style>
