<template>
  <div class="match-update">
    <h1>Update Match Details</h1>
    <div v-for="game in gameDetails" :key="game.gameId">
      <h2>Game ID: {{ game.gameId }} - Game no.{{ game.gameNumber }}</h2>
      <label>
        Duration:
        <input type="time" v-model="game.duration" />
      </label>
      <!-- Teams  -->
      <div v-for="team in game.lolGameTeamsDetails" :key="team.id">
        <h3>Team: {{ team.teamSlug }}</h3>
        <div class="player-details row">
          <label>
            First Blood:
            <input type="checkbox" v-model="team.firstBlood" />
          </label>
          <label>
            Win:
            <input type="checkbox" v-model="team.win" />
          </label>
          <label>
            Voidgrubs:
            <input type="number" v-model.number="team.voidgrubs" />
          </label>
        </div>
      </div>
      <!-- Players -->
      <div v-for="player in game.lolGamePlayersDetails" :key="player.id">
        <h3>Player: {{ player.teamSlug }} {{ player.summonerName }} - {{ player.role }}</h3>
        <div class="player-details row">
          <label>
            Triple Kills:
            <input type="number" v-model.number="player.trippleKills" />
          </label>
          <label>
            Quadra Kills:
            <input type="number" v-model.number="player.quardaKills" />
          </label>
          <label>
            Penta Kills:
            <input type="number" v-model.number="player.pentaKills" />
          </label>
          <label>
            Nashor Steals:
            <input type="number" v-model.number="player.nashorSteals" />
          </label>
          <label>
            Drake Steals:
            <input type="number" v-model.number="player.drakeSteals" />
          </label>
          <label>
            First Blood:
            <input type="checkbox" v-model="player.firstBlood" />
          </label>
        </div>
      </div>
      
    </div>
    <button @click="updateMatchDetails">Update Match Details</button>
  </div>
</template>

<script>
export default {
  name: 'MatchDetailsView',
  data() {
    return {
      matchId: null,
      gameDetails: []
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
        const response = await fetch(`${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/${matchId}`);
        const data = await response.json();
        this.matchId = data.matchId;
        this.gameDetails = data.gameDetails;
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    },
    async updateMatchDetails() {
      try {
        const response = await fetch(`${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/${this.matchId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            matchId: this.matchId,
            gameDetails: this.gameDetails
          })
        });
        if (!response.ok) {
          throw new Error('Failed to update match details');
        }
        alert('Match details updated successfully');
      } catch (error) {
        console.error('Error updating match details:', error);
        alert('Failed to update match details');
      }
    }
  }
};
</script>

<style scoped>
.player-details {
  margin-bottom: 1em;
}
</style>
