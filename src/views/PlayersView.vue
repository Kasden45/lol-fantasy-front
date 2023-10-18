<!-- TeamSelection.vue -->
<template>
  <div>
    <h1>Team Players</h1>
    <div class="row justify-content-center">

    <div class="col-md-8">
      <div class="row">
        <!-- Iterate through teams -->
        <div v-for="team in teamPlayers" :key="team.esportsTeamId" class="col-md-12 mb-12">
          <div class="card team-image-container">
            <div class="row">
              <div class="col-md-3 " >
                <img :src="team.imageUrl" class="card-img-top team-image" alt="Team Image" />
              </div>
              <div class="col-md-6 flex">
                  <div class="card-body flex my-auto">
                    <h2 class="card-title py-auto">{{ team.name }}</h2>
                    <!-- Add more player details as needed -->
                  </div>
                </div>
                <div class="col-md-3">

                </div>
            </div>
            
          </div> 
          <!-- Player cards in a row -->
          <div class="row">
            <div
              v-for="player in team.players"
              :key="player.esportsPlayerId"
              class="col-md-4 mb-4"
            >
              <div class="card player-card p-0"  >
                <div class="row">
                  <div class="col-md-3 card-body justify-content-center" >
                      <img :src="player.imageUrl" class="player-image" alt="Player Image"/>
                      <img :src="team.imageUrl" class="player-image" alt="Team Image"/>
                  </div>
                  <div class="col-md-6">
                      <div class="card-body player-body">
                        <p class="summoner-role">{{ player.role }}</p>
                        <p class="summoner-name">{{ player.summonerName }}</p>
                        <p class="summoner-first-name">{{ player.firstName }} {{ player.lastName }}</p>
                        <!-- Add more player details as needed -->
                      </div>
                    </div>
                  <div class="col-md-3 card-body player-body summoner-role">
                    <p >${{ player.price }}</p>
                    <p >{{ player.points }} pts</p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        teamPlayers: [],
        selectedPlayers: [],
      };
    },
    methods: {
      submitTeam() {
        // Handle the submission of the selected team
        console.log('Selected Players:', this.selectedPlayers);
        // You can send the selected team to your backend here
      },
      fetchTeamPlayers() {
      // Axios GET request to populate the 'teamPlayers' data
      // Replace the URL with your actual API endpoint
      this.axios.get(`${this.apiURL}FantasyPoints/teams_players`)
        .then((response) => {
          this.teamPlayers = response.data;
        })
        .catch((error) => {
          console.error("Error fetching team players:", error);
        });
    },
    },
    mounted() {
    // Fetch team players when the component is mounted
    this.fetchTeamPlayers();
  },
  };
  </script>

<style scoped>
/* Add custom styles for team and player cards as needed */
.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  justify-content: center;
}

.card-title {
  font-size: 2rem;
  top: 50%;
  
}

.card-body {
  padding: 10px;
  justify-content: center;
}

.player-body {
  text-align: left
}

.team-image {
  max-height: 100px; /* Set the maximum height to 50 pixels */
  width: auto;
}

.player-image {
  max-height: 50px; /* Set the maximum height to 50 pixels */
  max-width: 100px; /* Allow the width to adjust proportionally */
}

.player-card {
  background-color: rgb(71, 71, 71);
}

.team-image-container {
  display: flex;
  
  color: white;
  font-size: larger;
  background-color: rgb(94, 91, 91);
  width: auto; /* Allow the width to adjust proportionally */
}

.summoner-role {
  font-size: small;
  color: white;
  margin: 0;
}

.summoner-name {
  font-size: 18px;
  color: white;
  font-weight: 500;
  margin: 0;

}

.summoner-first-name {
  font-size: 12px;
  margin: 0;
  color: white;
}
</style>