<template>
    <div v-if="currentLeague != null">
       
      <!-- List of Leagues the User Is In -->
      <h2>{{currentLeague.name}} - {{currentLeague.invitationCode}}</h2>
<!-- Start -->
      <div class="game-points col-md-12" >
          <div class="game-tabs ms-2 justify-content-md-center">
          <div
            v-for="(fixture, index) in tabs"
            :key="index"
            @click="selectTab(index, fixture)"
            :class="{ active: selectedTabIndex === index }"
          >
            {{ fixture != 0 ? fixture : 'General' }}
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
              <ParticipantDetails :participant="participant" />
                  <!-- {{ participant.userId }}
                  {{ participant.joinedAt }}
                  {{ participant.totalPoints }}
                  <div v-if="participant.userTeam != null && showDetails" >
                    <PlayerPointsGamesCard :gamesPointsDetails="participant.userTeam.topPlayerPoints.gamesPointsDetails" :totalPointsA="participant.userTeam.topPlayerPoints.totalPoints"/>
                    <PlayerPointsGamesCard :gamesPointsDetails="participant.userTeam.junglePlayerPoints.gamesPointsDetails" :totalPointsA="participant.userTeam.junglePlayerPoints.totalPoints"/>
                    <PlayerPointsGamesCard :gamesPointsDetails="participant.userTeam.midPlayerPoints.gamesPointsDetails" :totalPointsA="participant.userTeam.midPlayerPoints.totalPoints"/>
                    <PlayerPointsGamesCard :gamesPointsDetails="participant.userTeam.bottomPlayerPoints.gamesPointsDetails" :totalPointsA="participant.userTeam.bottomPlayerPoints.totalPoints"/>
                    <PlayerPointsGamesCard :gamesPointsDetails="participant.userTeam.supportPlayerPoints.gamesPointsDetails" :totalPointsA="participant.userTeam.supportPlayerPoints.totalPoints"/>
                    <PlayerPointsGamesCard :gamesPointsDetails="participant.userTeam.subPlayerPoints.gamesPointsDetails" :totalPointsA="participant.userTeam.subPlayerPoints.totalPoints"/>
                    <TeamPointsGamesCard :gamesPointsDetails="participant.userTeam.teamPoints.gamesPointsDetails" :totalPointsA="participant.userTeam.teamPoints.totalPoints"/>
                  </div> -->
                </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
          <!-- <div class="players-list-container" v-if="selectedTabIndex == 0">
            <PlayersList @playerSelect="playerSelected" :selectedRole="roleToAddPlayer" :players="allPlayers" v-if="allPlayers.length > 0"/>
          </div>
          <div class="players-list-container" v-if="selectedTabIndex == 1">
            Tu teamki
          </div> -->
          <!-- <PlayerPointsCard :playerDetails="selectedGame" :totalPoints="totalPointsA" v-if="selectedGame" /> -->
        </div>
        
<!-- End -->
      
    </div>
    <!-- <div id="sda" aria-hidden="true" aria-labelledby="infoExerciseModalLabel" class="modal fade show"
             tabindex="-1" style="display:block">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="infoExerciseModalLabel" class="modal-title ms-2">Szczegóły ćwiczenia</h5>
                        
                        <button ref="closeModal" aria-label="Close" class="btn-close" data-dismiss="modal"
                                type="button" ></button>
                    </div>
                    <div class="modal-body">
                        Cos tu jest
                    </div>
                </div>
            </div>
        </div> -->
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
      };
    },
    methods: {
      calculatePosition(a, b) {
        var aPoints = a.points != null ? a.points : (a.userTeam != null ? a.userTeam.totalPoints : 0)
        var bPoints = b.points != null ? b.points : (b.userTeam != null ? b.userTeam.totalPoints : 0)
        return (aPoints < bPoints) ? 1 : (aPoints > bPoints) ? -1 : 0
      },
      selectTab(index, f){
        var fixture = f != 0 ? f : null;
        this.selectedTabIndex = index;
        console.log(this.selectedTabIndex);
        this.currentLeague = this.fixturesData.fixtures.find((element) => element.fixture == fixture);
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
          this.tabs = response.data.fixtures.map(function(fix) {
              return fix.fixture != null ? fix.fixture : 0;
            }).sort();
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
    },
    mounted() {
        this.invitationCode = this.$route.params.leagueCode;
      // Fetch the list of leagues the user is in when the component is mounted
        // this.getLeagueDetails(this.invitationCode);
        this.getLeagueDetailsWithFixtures(this.invitationCode);
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