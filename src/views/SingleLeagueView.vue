<template>
    <div v-if="currentLeague != null">
      <h2>{{ fixturesData.mode }} mode</h2>
      <div class="row w-80 m-auto">
        <DraftView v-if="fixturesData && fixturesData.mode == 'Draft'" :leagueId='this.currentLeague.invitationCode'/>
      </div>
      <!-- List of Leagues the User Is In -->
      <h2>{{currentLeague.name}} - {{currentLeague.invitationCode}}</h2>
<!-- Start -->
        <div class="navbar navbar-expand-md navbar-light">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#gameTabs"
            aria-controls="gameTabs"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="justify-content-center game-points collapse navbar-collapse" id="gameTabs" >
              <div class="game-tabs navbar-nav ms-2 justify-content-md-center">
                <div
                  v-for="(fixture, index) in tabs"
                  :key="fixture.order"
                  @click="selectTab(fixture.order, fixture.id)"
                  :class="{ active: selectedTabIndex === fixture.order }"
                  class="navbar-item"
                >
                {{ fixture.title }}
                  <!-- {{ fixture != 0 ? fixture : 'General' }} -->
                </div>
              </div>
          </div>
        </div>
        <div class="container game-points">
          <div class="row league-row justify-content-md-start" v-if="currentLeague ">
            <div class="col-md-3">
              <table class="table table-striped px-2">
                <!-- <thead>
                <tr>
                    <th>Lp</th>
                    <th>User</th>
                    <th>Points</th>
                </tr>
                </thead> -->
                <tbody>
                  <tr class='table-row-participants' v-for="(participant, index) in currentLeague.participants.sort(calculatePosition)" :key="participant.userId">
                    <td>{{ index+1 }}.</td>  
                    <ParticipantDetails @setActive="setActiveUserTeam" :participant="participant" :fixtureGames="this.fixtureGames"/>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-9">
              <div class="container participants-container">
                
                <ParticipantDetailsV2 
                  v-for="(participant, index) in currentLeague.participants.sort(calculatePosition)" :key="participant.userId"
                  v-if="tabs.length > 0" 
                  :participant="participant" 
                  :fixtureGames="this.fixtureGames" 
                  :fixture="tabs.find((element) => element.order == selectedTabIndex)
                "/>
              </div>
            </div>
        </div>
      </div>      
    </div>
  </template>
  
  <script>
  // import PlayerPointsCard from '@/components/PlayerPointsCard.vue';
  // import PlayerPointsGamesCard from '@/components/PlayerPointsGamesCard.vue';
  import DraftView from '@/components/League/DraftView.vue';
import ParticipantDetails from '@/components/League/ParticipantDetails.vue';
import ParticipantDetailsV2 from '@/components/League/ParticipantDetailsV2.vue';
  export default {
    components: {
      // PlayerPointsCard,
      ParticipantDetailsV2,
      ParticipantDetails,
      DraftView
  },
    data() {
      return {
        activeUserTeam:{},
        fixturesData: {},
        selectedTabIndex: 0,
        tabs: [],
        newLeagueName: "",
        invitationCode: "",
        userLeagues: [],
        currentLeague: null,
        fixtureGames: [],
      };
    },
    methods: {
      setActiveUserTeam(activeUserTeam) {
          this.activeUserTeam = activeUserTeam
      },
      calculatePosition(a, b) {
        var aPoints = a.points != null ? a.points : (a.userTeam != null ? a.userTeam.totalPoints : 0)
        var bPoints = b.points != null ? b.points : (b.userTeam != null ? b.userTeam.totalPoints : 0)
        return (aPoints < bPoints) ? 1 : (aPoints > bPoints) ? -1 : 0
      },
      selectTab(index, fixture){
        this.selectedTabIndex = index;
        console.log(this.selectedTabIndex);
        this.currentLeague = this.fixturesData.fixtures.find((element) => element.fixture == fixture);

        // this.currentLeague = this.fixturesData.fixtures.find((element) => element.fixture == fixture);
      },
      async getLeagueDetails(invitationCode) {
        try {
          const response = await this.axios.get(`${this.apiURL}User/league/${invitationCode}`);
          this.currentLeague = response.data;
          console.log("get league details", this.currentLeague)
        } catch (error) {
          console.error("Error fetching league details:", error);
        }
      },
      async getLeagueDetailsWithFixtures(invitationCode) {
        try {
          const response = await this.axios.get(`${this.apiURL}User/league/${invitationCode}/fixtures`);
          this.currentLeague = response.data.fixtures.find((element) => element.fixture == null);
          this.fixturesData = response.data;
          this.FetchRules();
          // this.tabs = response.data.fixtures.map(function(fix) {
          //     return fix.fixture != null ? fix.fixture : 0;
          //   }).sort();
          console.log("get league details", this.currentLeague)
        } catch (error) {
          console.error("Error fetching league details:", error);
        }
      },
      async fetchUserLeagues() {
      try {
        const response = await this.axios.get(`${this.apiURL}User/leagues`); // Replace with the correct endpoint
        this.userLeagues = response.data;
      } catch (error) {
        console.error("Error fetching user leagues:", error);
      }
    },
    FetchFixtureGames() {
        this.axios.get(`${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/matches`)
        .then(response => {
            this.fixtureGames = response.data;
        })
        .catch(error => {
            console.error("Error fetching fixture games:", error);
        });
      },
      FetchRules() {
        this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/rules`).then((response) => {
          var generalTab = [{
            id: this.fixturesData.fixtures.find((element) => element.fixture == null).fixture,
            title: 'General',
            order: 0,
          }];
          
          this.tabs = generalTab.concat(response.data.map(function(fix) {
          var newFix = {
                id: fix.fixture.id,
                title: fix.fixture.name,
                order: fix.fixture.order,
              } 
              return newFix;
              
            }))
            .filter(
              (tab) => this.fixturesData.fixtures.map(f => f.fixture).includes(tab.id)
            )
            .sort((a, b) => a.order - b.order);
          }).catch(error => {
              console.log(error.response);
          });
      }
    },
    mounted() {
        this.invitationCode = this.$route.params.leagueCode;
      // Fetch the list of leagues the user is in when the component is mounted
        // this.getLeagueDetails(this.invitationCode);
        this.getLeagueDetailsWithFixtures(this.invitationCode);
        this.FetchFixtureGames();
        
    },
    
  };
  </script>
  
  <style scoped>

.navbar-brand {
  background: -webkit-linear-gradient(
    0deg,
    var(--PRIMARY) 0%,
    var(--PRIMARY-LIGHTER) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 2rem;
}



.league-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  justify-content: space-between;
}
.table-row-participants{
  height: 10vh !important;
}
.participants-container {
  flex-wrap: nowrap;
  overflow-x: scroll;
}
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