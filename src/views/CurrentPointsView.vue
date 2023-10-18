<template>
    <div>
        <h1>Points in fixture no. {{ this.tabs[this.selectedTabIndex] }}</h1>
    </div>
    <div class="game-points col-md-12" >
          <div class="game-tabs ms-2 justify-content-md-center">
          <div
            v-for="(fixture, index) in tabs"
            :key="index"
            @click="selectTab(index, fixture)"
            :class="{ active: selectedTabIndex === index }"
          >
            {{ fixture }}
          </div>
        </div>
        <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-auto">
          <div v-if="teamPlayers != null">
        <PlayerPointsGamesCard :key="teamPlayers" :gamesPointsDetails="teamPlayers.topPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.topPlayerPoints.totalPoints"/>
        <PlayerPointsGamesCard :key="teamPlayers" :gamesPointsDetails="teamPlayers.junglePlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.junglePlayerPoints.totalPoints"/>
        <PlayerPointsGamesCard :key="teamPlayers" :gamesPointsDetails="teamPlayers.midPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.midPlayerPoints.totalPoints"/>
        <PlayerPointsGamesCard :key="teamPlayers" :gamesPointsDetails="teamPlayers.bottomPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.bottomPlayerPoints.totalPoints"/>
        <PlayerPointsGamesCard :key="teamPlayers" :gamesPointsDetails="teamPlayers.supportPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.supportPlayerPoints.totalPoints"/>
        <PlayerPointsGamesCard :key="teamPlayers" :gamesPointsDetails="teamPlayers.subPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.subPlayerPoints.totalPoints"/>
        <TeamPointsGamesCard :key="teamPlayers" :gamesPointsDetails="teamPlayers.teamPoints.gamesPointsDetails" :totalPointsA="teamPlayers.teamPoints.totalPoints"/>
        </div>
        <div v-else>
          Loading
        </div>
        </div>
        
      </div>
    </div>
    </div>
    
    
</template>

<script>
      import PlayerPointsGamesCard from '@/components/PlayerPointsGamesCard.vue';
  import TeamPointsGamesCard from '@/components/Points/TeamPointsGamesCard.vue'; 
  export default {
    components: {
        PlayerPointsGamesCard, 
        TeamPointsGamesCard
    },
    data() {
      return {
        selectedTabIndex: 0,
        tabs: [],
        teamPlayers: null,
        selectedUserTeam: {
          topPlayer: {
            role: "top",
            player: null
          },
          junglePlayer: {
            role: "jungle",
            player: null
          },
          midPlayer: {
            role: "mid",
            player: null
          },
          botPlayer: {
            role: "bottom",
            player: null
          },
          supportPlayer: {
            role: "support",
            player: null
          },
          subPlayer: {
            role: "sub",
            player: null
          },
          team: {
            role: "team",
            team: null
          },
          captain: 1
        },
      };
    },
    methods: {
      selectTab(index, fixture){
        this.selectedTabIndex = index;
        console.log(this.selectedTabIndex);
        this.teamPlayers = null;
        this.fetchUserTeamFixture(fixture)
        // this.currentLeague = this.fixturesData.fixtures.find((element) => element.fixture == fixture);
      },
      fetchUserTeamFixture(fixtureId) {
      // Axios GET request to populate the 'teamPlayers' data
      // Replace the URL with your actual API endpoint
        this.axios.get(`${this.apiURL}FantasyPoints/user_team/${this.$store.getters.getProfileId}/fixture/${fixtureId}`)
            .then((response) => {
            this.teamPlayers = response.data;
            this.correctEmptyPlayers();
            })
            .catch((error) => {
            console.error("Error fetching team players:", error);
            });
        },
        fetchUserTeam() {
      // Axios GET request to populate the 'teamPlayers' data
      // Replace the URL with your actual API endpoint
        this.axios.get(`${this.apiURL}FantasyPoints/user_team/${this.$store.getters.getProfileId}/fixture/${this.$store.getters.getFixtureId}`)
            .then((response) => {
            this.teamPlayers = response.data;
            this.correctEmptyPlayers();
            })
            .catch((error) => {
            console.error("Error fetching team players:", error);
            });
        },
        correctEmptyPlayers() {
            if(this.teamPlayers.topPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.teamPlayers.topPlayerPoints.gamesPointsDetails = [this.teamPlayers.topPlayerPoints.player]
            }
            if(this.teamPlayers.junglePlayerPoints.gamesPointsDetails.length == 0)
            {
                this.teamPlayers.junglePlayerPoints.gamesPointsDetails = [this.teamPlayers.junglePlayerPoints.player]
            }
            if(this.teamPlayers.midPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.teamPlayers.midPlayerPoints.gamesPointsDetails = [this.teamPlayers.midPlayerPoints.player]
            }
            if(this.teamPlayers.bottomPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.teamPlayers.bottomPlayerPoints.gamesPointsDetails = [this.teamPlayers.bottomPlayerPoints.player]
            }
            if(this.teamPlayers.supportPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.teamPlayers.supportPlayerPoints.gamesPointsDetails = [this.teamPlayers.supportPlayerPoints.player]
            }
            if(this.teamPlayers.subPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.teamPlayers.subPlayerPoints.gamesPointsDetails = [this.teamPlayers.subPlayerPoints.player]
            }
            if(this.teamPlayers.teamPoints.gamesPointsDetails.length == 0)
            {
                this.teamPlayers.teamPoints.gamesPointsDetails = [this.teamPlayers.teamPoints.team]
            }
        }
    },
    mounted() {
        this.fetchUserTeam()
        this.tabs = Array.from({length: this.$store.getters.getFixtureId}, (_, i) => i + 1)
        this.selectedTabIndex = this.$store.getters.getFixtureId-1;
    }
}
</script>

<style scoped>
.game-tabs {
  display: flex;
  margin-bottom: 20px;
}

.game-tabs div {
  cursor: pointer;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.game-tabs .active {
  background-color: #007BFF;
  color: #fff;
}
</style>