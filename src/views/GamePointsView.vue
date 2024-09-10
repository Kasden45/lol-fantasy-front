<template>
    <div>
      <div v-if="teamPoints" class="justify-content-center">
        <h2>Team Points</h2>
        <div>
          <img :src="teamPoints.imageUrl" :alt="teamPoints.name" />
          <h3>{{ teamPoints.name }}</h3>
          <p>Region: {{ teamPoints.region }}</p>
          <p>League: {{ teamPoints.league }}</p>
          <p>Price: {{ teamPoints.price }}</p>
          <p>Points: {{ teamPoints.points }}</p>
        </div>
  
        <h3>Team Points Details</h3>
        <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Value</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kills</td>
                <td>{{ teamPoints.pointsDetails.kills.value }}</td>
                <td>{{ teamPoints.pointsDetails.kills.points }}</td>
              </tr>
              <tr>
                <td>Assists</td>
                <td>{{ teamPoints.pointsDetails.assists.value }}</td>
                <td>{{ teamPoints.pointsDetails.assists.points }}</td>
              </tr>
              <tr>
                <td>Deaths</td>
                <td>{{ teamPoints.pointsDetails.deaths.value }}</td>
                <td>{{ teamPoints.pointsDetails.deaths.points }}</td>
              </tr>
              
              <tr>
                <td>Nashors</td>
                <td>{{ teamPoints.pointsDetails.nashors.value }}</td>
                <td>{{ teamPoints.pointsDetails.nashors.points }}</td>
              </tr>
              <tr>
                <td>Drakes</td>
                <td>{{ teamPoints.pointsDetails.drakes.value }}</td>
                <td>{{ teamPoints.pointsDetails.drakes.points }}</td>
              </tr>
              <tr>
                <td>Towers</td>
                <td>{{ teamPoints.pointsDetails.towers.value }}</td>
                <td>{{ teamPoints.pointsDetails.towers.points }}</td>
              </tr>
              <tr>
                <td>Win under 30 min</td>
                <td>{{ teamPoints.pointsDetails.under30Win.value }}</td>
                <td>{{ teamPoints.pointsDetails.under30Win.points }}</td>
              </tr>
              <tr>
                <td>Lose over 30 min</td>
                <td>{{ teamPoints.pointsDetails.over30Lose.value }}</td>
                <td>{{ teamPoints.pointsDetails.over30Lose.points }}</td>
              </tr>
              <tr>
                <td>Game won</td>
                <td>{{ teamPoints.pointsDetails.win.value }}</td>
                <td>{{ teamPoints.pointsDetails.win.points }}</td>
              </tr>
              <tr>
                <td>FB</td>
                <td>{{ teamPoints.pointsDetails.firstBlood.value }}</td>
                <td>{{ teamPoints.pointsDetails.firstBlood.points }}</td>
              </tr>
            </tbody>
          </table>
      </div>
  
      <div v-for="player in playersWithPoints" :key="player.esportsPlayerId">
        <h2>Player Points</h2>
        <div>
          <img :src="player.imageUrl" :alt="player.summonerName" />
          <h3>{{ player.firstName }} {{ player.lastName }}</h3>
          <p>Summoner Name: {{ player.summonerName }}</p>
          <p>Role: {{ player.role }}</p>
          <p>Price: {{ player.price }}</p>
          <p>Points: {{ player.points }}</p>
        </div>
  
        <h3>Player Points Details</h3>
        <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Value</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kills</td>
                <td>{{ player.pointsDetails.kills.value }}</td>
                <td>{{ player.pointsDetails.kills.points }}</td>
              </tr>
              <tr>
                <td>Assists</td>
                <td>{{ player.pointsDetails.assists.value }}</td>
                <td>{{ player.pointsDetails.assists.points }}</td>
              </tr>
              <tr>
                <td>Deaths</td>
                <td>{{ player.pointsDetails.deaths.value }}</td>
                <td>{{ player.pointsDetails.deaths.points }}</td>
              </tr>
              
              <tr>
                <td>Tripple kills</td>
                <td>{{ player.pointsDetails.trippleKills.value }}</td>
                <td>{{ player.pointsDetails.trippleKills.points }}</td>
              </tr>
              <tr>
                <td>Quadra kills</td>
                <td>{{ player.pointsDetails.quardaKills.value }}</td>
                <td>{{ player.pointsDetails.quardaKills.points }}</td>
              </tr>
              <tr>
                <td>Penta kills</td>
                <td>{{ player.pointsDetails.pentaKills.value }}</td>
                <td>{{ player.pointsDetails.pentaKills.points }}</td>
              </tr>
              <tr>
                <td>Nashor steals</td>
                <td>{{ player.pointsDetails.nashorSteals.value }}</td>
                <td>{{ player.pointsDetails.nashorSteals.points }}</td>
              </tr>
              <tr>
                <td>Drake steals</td>
                <td>{{ player.pointsDetails.drakeSteals.value }}</td>
                <td>{{ player.pointsDetails.drakeSteals.points }}</td>
              </tr>
              <tr>
                <td>CS</td>
                <td>{{ player.pointsDetails.creepScore.value }}</td>
                <td>{{ player.pointsDetails.creepScore.points }}</td>
              </tr>
              <tr>
                <td>FB</td>
                <td>{{ player.pointsDetails.firstBlood.value }}</td>
                <td>{{ player.pointsDetails.firstBlood.points }}</td>
              </tr>
              <tr>
                <td>10+ K/A</td>
                <td>{{ player.pointsDetails.over10KillsAssists.value }}</td>
                <td>{{ player.pointsDetails.over10KillsAssists.points }}</td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  </template>
  

  <script>
  
  export default {
    data() {
      return {
        teamPoints: null,
        playersWithPoints: [],
      };
    },
    mounted() {
      // Fetch team and player points for the game based on the game ID
    //   const gameId = 110852960170020344;// Get the game ID from your route parameters or store state
    //   const teamSlug = "psg-talon" // Get the team slug from your route parameters or store state
      const gameId = this.$route.params.gameId;
    const teamSlug = this.$route.params.teamSlug;
      this.fetchGamePoints(gameId, teamSlug);
    },
    methods: {
      async fetchGamePoints(gameId, teamSlug) {
        try {
          const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/points/team/${teamSlug}/game/${gameId}/details`);
          this.teamPoints = response.data;
          this.playersWithPoints = response.data.playersWithPoints;
        } catch (error) {
          console.error("Error fetching game points:", error);
        }
      },
    },
  };
  </script>
  