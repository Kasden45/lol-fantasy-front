<template>
    <div v-if="currentLeague != null">
       
      <!-- List of Leagues the User Is In -->
      <h2>{{currentLeague.name}} - {{currentLeague.invitationCode}}</h2>
<!-- Start -->
      <div class="game-points col-md-12" >
          <div class="game-tabs ms-2 justify-content-md-center">
          <div
            v-for="(fixture, index) in tabs"
            :key="fixture.order"
            @click="selectTab(fixture.order, fixture.id)"
            :class="{ active: selectedTabIndex === fixture.order }"
          >
          {{ fixture.title }}
            <!-- {{ fixture != 0 ? fixture : 'General' }} -->
          </div>
        </div>
        <div class="container">
          <div class="row justify-content-md-center" v-if="currentLeague ">
            <div class="col-md-auto">
              <table class="table table-striped px-2">
                <thead>
                <tr>
                    <th>Lp</th>
                    <th>UserId</th>
                    <th>User</th>
                    <th>Points</th>
                    <!-- <th>Joined at</th> -->
                    <th></th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="(participant, index) in currentLeague.participants.sort(calculatePosition)" :key="participant.userId">
                  <td>{{ index+1 }}.</td>  
                  <ParticipantDetails :participant="participant" :fixtureGames="this.fixtureGames"/>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>      
    </div>
  </template>
  
  <script>
  // import PlayerPointsCard from '@/components/PlayerPointsCard.vue';
  // import PlayerPointsGamesCard from '@/components/PlayerPointsGamesCard.vue';
  import ParticipantDetails from '@/components/League/ParticipantDetails.vue';
  export default {
    components: {
      // PlayerPointsCard,
      ParticipantDetails
  },
    data() {
      return {
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
      // selectTab(index, f){
      //   var fixture = f != 0 ? f : null;
      //   this.selectedTabIndex = index;
      //   console.log(this.selectedTabIndex);
      //   this.currentLeague = this.fixturesData.fixtures.find((element) => element.fixture == fixture);
      // },
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