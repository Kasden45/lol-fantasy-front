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
    <!-- NEW COMPONENT TEST -->
    <div v-if="teamPlayers != null">
      <div class="summoners-rift mx-auto">
        <div class="player-card" v-for="player in playersForSummonersRiftView" :key="player.id" :style="getPlayerPosition(player)">
          <img :src="player.imageUrl" :alt="player.summonerName" class="player-image" />
          <div class="player-info">
            <div class="player-name">{{ player.summonerName }}</div>
            <div class="player-role">{{ player.role }}</div>
            <div class="player-points">{{ player.points.toFixed(2) }}</div>
          </div>
          <!-- <PlayerPointsGamesCard :isCaptain="teamPlayers.captain == 1" :key="teamPlayers" :gamesPointsDetails="teamPlayers.topPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.topPlayerPoints.totalPoints"/> -->
        </div>
        <div class="player-card" :style="getTeamPosition()">
          <img :src="teamPlayers.teamPoints.team.imageUrl" :alt="teamPlayers.teamPoints.team.name" class="player-image" />
          <div class="player-info">
            <div class="player-name">{{ teamPlayers.teamPoints.team.name }}</div> <!-- or code-->
            <div class="player-points">{{ teamPlayers.teamPoints.totalPoints.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- OLD -->
    <div class="container">
      <h1 v-if="teamPlayers != null">POINTS DETAILS</h1>
      <div class="row justify-content-md-center">
        <div class="col-md-auto">
          <div v-if="teamPlayers != null">
            <PlayerPointsGamesCard :isCaptain="teamPlayers.captain == 1" :key="teamPlayers" :gamesPointsDetails="teamPlayers.topPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.topPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard :isCaptain="teamPlayers.captain == 2" :key="teamPlayers" :gamesPointsDetails="teamPlayers.junglePlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.junglePlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard :isCaptain="teamPlayers.captain == 3" :key="teamPlayers" :gamesPointsDetails="teamPlayers.midPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.midPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard :isCaptain="teamPlayers.captain == 4" :key="teamPlayers" :gamesPointsDetails="teamPlayers.bottomPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.bottomPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard :isCaptain="teamPlayers.captain == 5" :key="teamPlayers" :gamesPointsDetails="teamPlayers.supportPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.supportPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard :isSub="true" :key="teamPlayers" :gamesPointsDetails="teamPlayers.subPlayerPoints.gamesPointsDetails" :totalPointsA="teamPlayers.subPlayerPoints.totalPoints"/>
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
        playersForSummonersRiftView: [
          // { id: 1, summonerName: '369', points: 0, role: 'top', imageUrl: 'https://static.lolesports.com/players/1695889560278_12.2814317-369.png' },
          // { id: 1, summonerName: '368', points: 0, role: 'jungle', imageUrl: 'https://static.lolesports.com/players/1695889560278_12.2814317-369.png' },
          // { id: 1, summonerName: '367', points: 0, role: 'mid', imageUrl: 'https://static.lolesports.com/players/1695889560278_12.2814317-369.png' },
          // { id: 1, summonerName: '366', points: 0, role: 'bottom', imageUrl: 'https://static.lolesports.com/players/1695889560278_12.2814317-369.png' },
          // { id: 1, summonerName: '365', points: 0, role: 'support', imageUrl: 'https://static.lolesports.com/players/1695889560278_12.2814317-369.png' },
        ],
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
      getTeamPosition() {
        return { top: '70%', left: '30%' };
      },
      getPlayerPosition(player) {
      // Implement logic to calculate the position based on player's role
      // Adjust the positioning according to your needs
        
        var backgroundColor = player.captain ? '#fde9a8d0' : '#faf3dd75'; 

        switch (player.role) {
          case 'top':
            return { top: '20%', left: '25%', 'background-color': backgroundColor }; // Adjust the values accordingly
          case 'jungle':
            return { top: '35%', left: '35%', 'background-color': backgroundColor };
          case 'mid':
            return { top: '50%', left: '50%', 'background-color': backgroundColor }; // Adjust the values accordingly
          case 'bottom':
            return { top: '70%', left: '65%', 'background-color': backgroundColor };
          case 'support':
            return { top: '85%', left: '75%', 'background-color': backgroundColor }; // Adjust the values accordingly
          // Add more cases for other roles
          default:
            return { top: '50%', left: '50%', 'background-color': backgroundColor }; // Default position
        }
      },
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
            this.fillMapPlayers();
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
            this.fillMapPlayers();
            })
            .catch((error) => {
            console.error("Error fetching team players:", error);
            });
        },
        teamPlayerToMapPlayer(teamPlayer, isCaptain) {
          return {
            points: teamPlayer.totalPoints,
            id: teamPlayer.playerId,
            summonerName: teamPlayer.player.summonerName,
            role: teamPlayer.player.role,
            imageUrl: teamPlayer.player.imageUrl,
            captain: isCaptain
          }
        },
        fillMapPlayers() {
          console.log('filling')
          this.playersForSummonersRiftView = []
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.teamPlayers.topPlayerPoints, this.teamPlayers.captain == 1))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.teamPlayers.junglePlayerPoints, this.teamPlayers.captain == 2))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.teamPlayers.midPlayerPoints, this.teamPlayers.captain == 3))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.teamPlayers.bottomPlayerPoints, this.teamPlayers.captain == 4))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.teamPlayers.supportPlayerPoints, this.teamPlayers.captain == 5))
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

.summoners-rift {
  position: relative;
  width: 1200px; 
  height: 1000px;
  background-image: url('https://2.bp.blogspot.com/--A1wNZhS868/U7L4xKhbQTI/AAAAAAAAS04/rfzak1JCZFY/s1600/srdb3-1.jpg'); /* Replace with your Summoner's Rift map image */
  background-size: cover;
  image-rendering: -webkit-optimize-contrast;
}

.player-card {
  /* background-color: #fde9a8d0; */
  background-color: #faf3dd75;
  position: absolute;
  transform: translate(-50%, -50%);
}

.player-image {
  width: 100px; /* Adjust the size of the player image */
  height: 85px;
  border-radius: 50%;
}

.player-info {
  text-align: center;
}

.player-name {
  font-weight: bold;
  color: white;
}

.player-points {
  font-weight: bold;
  color: white;
}

.player-role {
  font-style: italic;
  color: white;
  text-transform: capitalize;
}
</style>