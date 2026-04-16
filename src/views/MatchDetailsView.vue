<template>
  <div class="match-update-page">
    <div class="page-header">
      <div class="header-accent" />
      <div>
        <p class="eyebrow">Admin Panel</p>
        <h1 class="page-title">Update Match Details</h1>
      </div>
    </div>

    <div class="actions-bar">
      <button class="btn-primary" @click="fetchMatchDetailsGOL">
        ↓ Fetch from gol.gg
      </button>
      <button class="btn-save" @click="updateMatchDetails">
        ✓ Save Changes
      </button>
    </div>

    <div class="games-list">
      <div v-for="game in gameDetails" :key="game.gameId" class="game-block">
        <div class="game-header">
          <span class="game-label">Game {{ game.gameNumber }}</span>
          <span class="game-id">ID: {{ game.gameId }}</span>
          <label class="duration-field">
            <span class="field-label">Duration</span>
            <input
              type="time"
              v-model="game.duration"
              class="field-input duration-input"
            />
          </label>
        </div>

        <!-- Teams -->
        <div class="section-title">Teams</div>
        <div class="teams-row">
          <div
            v-for="team in game.lolGameTeamsDetails"
            :key="team.id"
            class="team-card"
          >
            <p class="team-name">{{ team.teamSlug }}</p>
            <div class="fields-row">
              <label class="toggle-field">
                <span class="field-label">First Blood</span>
                <input
                  type="checkbox"
                  v-model="team.firstBlood"
                  class="toggle-input"
                />
              </label>
              <label class="toggle-field">
                <span class="field-label">Win</span>
                <input
                  type="checkbox"
                  v-model="team.win"
                  class="toggle-input"
                />
              </label>
              <label class="number-field">
                <span class="field-label">Voidgrubs</span>
                <input
                  type="number"
                  v-model.number="team.voidgrubs"
                  class="field-input number-input"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Players -->
        <div class="section-title">Players</div>
        <div class="players-list">
          <div
            v-for="player in game.lolGamePlayersDetails"
            :key="player.id"
            class="player-row-table"
          >
            <div class="player-info">
              <span class="player-name">{{ player.summonerName }}</span>
              <span class="player-meta"
                >{{ player.teamSlug }} · {{ player.role }}</span
              >
            </div>
            <div class="player-fields">
              <label class="number-field">
                <span class="field-label">Triple</span>
                <input
                  type="number"
                  v-model.number="player.trippleKills"
                  class="field-input number-input"
                />
              </label>
              <label class="number-field">
                <span class="field-label">Quadra</span>
                <input
                  type="number"
                  v-model.number="player.quardaKills"
                  class="field-input number-input"
                />
              </label>
              <label class="number-field">
                <span class="field-label">Penta</span>
                <input
                  type="number"
                  v-model.number="player.pentaKills"
                  class="field-input number-input"
                />
              </label>
              <label class="number-field">
                <span class="field-label">Nash. Steal</span>
                <input
                  type="number"
                  v-model.number="player.nashorSteals"
                  class="field-input number-input"
                />
              </label>
              <label class="number-field">
                <span class="field-label">Drake Steal</span>
                <input
                  type="number"
                  v-model.number="player.drakeSteals"
                  class="field-input number-input"
                />
              </label>
              <label class="toggle-field">
                <span class="field-label">First Blood</span>
                <input
                  type="checkbox"
                  v-model="player.firstBlood"
                  class="toggle-input"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MatchDetailsView",
  data() {
    return {
      matchId: null,
      gameDetails: [],
    };
  },
  mounted() {
    this.matchId = this.$route.params.matchId;
    this.fetchMatchDetails(this.matchId);
  },
  created() {
    // Replace with your actual fetch URL and tournament code
    // const matchId = '112966697102367347';
  },
  methods: {
    async fetchMatchDetails(matchId) {
      try {
        const response = await fetch(
          `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/${matchId}`,
        );
        const data = await response.json();
        this.matchId = data.matchId;
        this.gameDetails = data.gameDetails;
      } catch (error) {
      }
    },
    async updateMatchDetails() {
      try {
        const response = await fetch(
          `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/${this.matchId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              matchId: this.matchId,
              gameDetails: this.gameDetails,
            }),
          },
        );
        if (!response.ok) {
          throw new Error("Failed to update match details");
        }
        alert("Match details updated successfully");
      } catch (error) {
        alert("Failed to update match details");
      }
    },
    async fetchMatchDetailsGOL() {
      try {
        const response = await fetch(
          `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fetch_stats/${this.matchId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to update match details");
        }
        const data = await response.json();
        alert(
          `Match details updated successfully ${data.gameDetails[0].duration}`,
        );
      } catch (error) {
        alert("Failed to update match details");
      }
    },
  },
};
</script>

<style scoped>
.match-update-page {
  min-height: 100vh;
  background: var(--BACKGROUND-DARK);
  padding: 40px 32px;
  font-family: "DM Sans", sans-serif;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
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
  font-size: 28px;
  font-weight: 800;
  color: var(--GREY-LIGHT);
  line-height: 1;
}

/* Actions bar */
.actions-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.btn-primary {
  padding: 10px 20px;
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 8px;
  color: var(--PRIMARY-LIGHTER);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s;
}

.btn-primary:hover {
  border-color: var(--PRIMARY);
}

.btn-save {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--PRIMARY), var(--PRIMARY-DARKER));
  border: none;
  border-radius: 8px;
  color: var(--GREY-LIGHT);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-save:hover {
  opacity: 0.88;
}

/* Game block */
.games-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-block {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 12px;
  overflow: hidden;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: var(--SECONDARY);
  border-bottom: 1px solid var(--GREY-DARKER);
}

.game-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.game-id {
  font-size: 11px;
  color: var(--GREY-DARKER);
  flex: 1;
}

.duration-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  padding: 8px 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
  background: var(--BACKGROUND-DARK);
  border-bottom: 1px solid var(--GREY-DARKER);
}

/* Teams */
.teams-row {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.team-card {
  flex: 1;
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 8px;
  padding: 14px 16px;
}

.team-name {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.fields-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}

/* Players */
.players-list {
  display: flex;
  flex-direction: column;
}

.player-row-table {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-bottom: 1px solid var(--GREY-DARKER);
  flex-wrap: wrap;
}

.player-row-table:last-child {
  border-bottom: none;
}

.player-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 130px;
  flex-shrink: 0;
}

.player-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.player-meta {
  font-size: 11px;
  color: var(--GREY-DARKER);
  text-transform: capitalize;
}

.player-fields {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  flex: 1;
}

/* Field components */
.field-label {
  display: block;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field-input {
  background: var(--BACKGROUND-DARK);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--GREY);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: var(--PRIMARY);
}

.number-input {
  width: 100%;
}

.duration-input {
  width: 120px;
}

.number-field,
.toggle-field {
  display: flex;
  flex-direction: column;
}

.toggle-input {
  width: 16px;
  height: 16px;
  margin-top: 4px;
  cursor: pointer;
  accent-color: var(--PRIMARY);
}
</style>
