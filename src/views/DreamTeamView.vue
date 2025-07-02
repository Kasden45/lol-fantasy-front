<!-- TeamSelection.vue -->
<template>
  <div>
    <h1>Dream teams</h1>
    <!-- <div class="row justify-content-center">

    </div> -->
    <div class="game-tabs ms-2 justify-content-md-center">
      <div
        v-for="(fixture, index) in tabs"
        :key="fixture.order"
        @click="selectTab(fixture.order, fixture.id)"
        :class="{ active: selectedTabIndex === fixture.order }"
      >
        {{ fixture.title }}
      </div>
    </div>
    <div v-if="playersForSummonersRiftView != null">
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
        <div class="player-card" :style="getTeamPosition()" v-if="dreamTeam.dreamTeamTeam != null">
          <img :src="dreamTeam.dreamTeamTeam.imageUrl" :alt="dreamTeam.dreamTeamTeam.name" class="player-image" />
          <div class="player-info">
            <div class="player-name">{{ dreamTeam.dreamTeamTeam.name }}</div>
            <div class="player-points">{{ dreamTeam.dreamTeamTeam.points.toFixed(2) }}</div>
          </div>
        </div>
        <div class="player-card" :style="getTotalPosition()" v-if="dreamTeam.totalPoints != null">
          Total Points: {{ dreamTeam.totalPoints.toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        selectedTabIndex: 0,
        playersForSummonersRiftView: [],
        tabs: [],
        matchesByFixture: [],
        dreamTeam: {},
      };
    },
    methods: {
      getTotalPosition() {
        return { top: '25%', left: '75%' };
      },
      getTeamPosition() {
        return { top: '70%', left: '30%' };
      },
      getPlayerPosition(player) {
      // Implement logic to calculate the position based on player's role
      // Adjust the positioning according to your needs
        
        var backgroundColor = player.captain ? '#fde9a8d0' : '#faf3dd75'; 

        switch (player.role) {
          case 'top':
            return { top: '15%', left: '25%', 'background-color': backgroundColor }; // Adjust the values accordingly
          case 'jungle':
            return { top: '33%', left: '35%', 'background-color': backgroundColor };
          case 'mid':
            return { top: '50%', left: '50%', 'background-color': backgroundColor }; // Adjust the values accordingly
          case 'bottom':
            return { top: '68%', left: '65%', 'background-color': backgroundColor };
          case 'support':
            return { top: '85%', left: '75%', 'background-color': backgroundColor }; // Adjust the values accordingly
          // Add more cases for other roles
          default:
            return { top: '50%', left: '50%', 'background-color': backgroundColor }; // Default position
        }
      },
      teamPlayerToMapPlayer(teamPlayer, isCaptain) {
          return {
            points: teamPlayer.points,
            id: teamPlayer.esportsPlayerId,
            summonerName: teamPlayer.summonerName,
            role: teamPlayer.role,
            imageUrl: teamPlayer.imageUrl,
            captain: isCaptain
          }
        },
      fillMapPlayers() {
          console.log('filling')
          this.playersForSummonersRiftView = []
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.top, false))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.jungle, false))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.mid, false))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.bottom, false))
          this.playersForSummonersRiftView.push(this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.support, false))
        },
      selectTab(index, f){
        var fixture = f != 0 ? f : null;
        this.selectedTabIndex = index;
        console.log(this.selectedTabIndex);
        this.currentFixture = this.newRulesData.find((element) => element.fixture.id == fixture);
        this.getDreamTeam(this.currentFixture.fixture.id);
      },
      getCurrentFixture() {
            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixture`

            this.axios.get(url).then((response) => {
                this.$store.commit('setFixtureId', response.data);
                console.log("Current fixture: ", this.$store.getters.getFixtureId)
                
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
        async fetchRulesData() {
      
          try {
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/rules`);
            this.newRulesData = response.data;
            this.tabs = response.data.map(function(fix) {
              var newFix = {
                    id: fix.fixture.id,
                    title: fix.fixture.name,
                    order: fix.fixture.order,
                  } 
                  return newFix;
                  
                }).sort((a, b) => a.order - b.order);
                console.log('tabs', this.tabs);

            this.selectTab(this.tabs.find((element) => element.id == this.$store.getters.getFixtureId).order,this.$store.getters.getFixtureId);
            this.getDreamTeam(this.$store.getters.getFixtureId);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
      },
      getFixtures() {
            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`

            this.axios.get(url).then((response) => {
            this.matchesByFixture = response.data.fixturesWithMatches.sort((a, b) => a.fixture.order - b.fixture.order);
            this.selectTab(this.tabs.find((element) => element.id == this.$store.getters.getFixtureId).order,this.$store.getters.getFixtureId);
            this.getDreamTeam(this.$store.getters.getFixtureId);
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
      getDreamTeam(fixtureId) {
        this.axios.get(`${this.apiURL}Stats/${this.$store.getters.getCurrentTournamentId}/dream_team/${fixtureId}`)
        .then((response) => {
          console.log("Dream team:", response.data);
          this.dreamTeam = response.data;
          this.fillMapPlayers();
        })
        .catch((error) => {
          console.error("Error fetching team players:", error);
        });
      }
    },
    mounted() {
    // Fetch team players when the component is mounted
    this.getCurrentFixture();
    // this.getFixtures();
    this.fetchRulesData();
  },
  };
  </script>

<style scoped>
/* Add custom styles for team and player cards as needed */
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

.player-image {
  width: 100px; /* Adjust the size of the player image */
  height: 85px;
  border-radius: 50%;
}

.player-card {
  display: flex;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1000px) {
  .game-tabs {
    display: block;
    margin-bottom: 20px;
  }
  
  .summoners-rift {
    position: relative;
    width: 90vw;
    height: 80vw;
    /* width: 400px;  */
    /* height: 333px; */
    background-image: url('https://2.bp.blogspot.com/--A1wNZhS868/U7L4xKhbQTI/AAAAAAAAS04/rfzak1JCZFY/s1600/srdb3-1.jpg'); /* Replace with your Summoner's Rift map image */
    background-size: cover;
    image-rendering: -webkit-optimize-contrast;
  }

  .player-card {
    display: flex;
    border: 1px solid #ccc;
    margin: 3px;
    padding: 3px;
    border-radius: 1px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
    font-size: x-small;
    width: min-content;
  }
  .player-image {
    width: 33px; /* Adjust the size of the player image */
    height: 28px;
    border-radius: 50%;
  }
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