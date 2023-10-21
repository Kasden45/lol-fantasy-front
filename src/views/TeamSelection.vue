<!-- TeamSelection.vue -->
<template>
    <div class="container">
      <h1>Team Selection</h1>
      <h4 v-if="this.nextFixture != null">Next deadline: {{ this.formatDate(this.nextFixture.fixture.deadlineDate) }}</h4>
      <h3 :class="{'error-text' : this.teamValue > 78}">Price total {{ this.teamValue }}/78$</h3>
      <h3>Transfers made: {{ this.transfersMade }}</h3>
      <h3 :class="{'error-text' : this.selectedUserTeam.transfersAvailable - this.selectedUserTeam.transfersMade < 0}">Transfers available: {{ this.selectedUserTeam.transfersAvailable > 10 ? '∞' : this.selectedUserTeam.transfersAvailable - this.transfersMade }}/2</h3>
      <div class="row w-100 justify-content-md-center m-auto">
        <div class="col-md-7">
          <PlayerTeam :currently-picked="this.roleToAddPlayer" @playerRemove="playerRemoved" @rolePick="(r) => roleToAddPlayer = r" :userTeam="selectedUserTeam"/>
            <div class="row justify-content-md-center m-auto py-2">
              <label class="w-auto" for="captain">Captain: </label>
            <select class="w-auto" id="captain" v-model="selectedUserTeam.captain">
              <option value=1>Top</option>
              <option value=2>Jungle</option>
              <option value=3>Mid</option>
              <option value=4>Bottom</option>
              <option value=5>Support</option>
            </select>  
            </div>
            
      <button :class="{ disabled : this.teamValue > 75 || this.selectedUserTeam.transfersAvailable < this.selectedUserTeam.transfersMade}" @click="submitTeam">Submit Team</button>
      <div v-if="this.submittingTeam">
        Saving your team . . .
      </div>
      <div v-if="this.successSubmittingTeam">
        Team saved!
      </div>
      <div v-if="this.errorSubmittingTeam">
        You can't make such team!
      </div>
    </div>
        
        <div class="game-points col-md-5" >
          <div class="game-tabs ms-2">
          <div
            v-for="(game, index) in tabs"
            :key="index"
            @click="selectTab(index)"
            :class="{ active: selectedTabIndex === index }"
          >
            {{ game }}
          </div>
        </div>
          <div class="players-list-container" v-if="selectedTabIndex == 0">
            <PlayersList @playerSelect="playerSelected" :selectedRole="roleToAddPlayer" :players="allPlayers" v-if="allPlayers.length > 0"/>
          </div>
          <div class="players-list-container" v-if="selectedTabIndex == 1">
            <TeamsList @teamSelect="teamSelected" :selectedRole="roleToAddPlayer" :teams="allTeams" v-if="allTeams.length > 0"/>
          </div>
          <!-- <PlayerPointsCard :playerDetails="selectedGame" :totalPoints="totalPointsA" v-if="selectedGame" /> -->
        </div>
        
      </div>
      
    </div>
  </template>
  
  <script>
  import PlayersList from "@/components/Players/AllPlayersList.vue" 
  import TeamsList from "@/components/Players/AllTeamsList.vue" 
  import PlayerTeam from "@/components/TeamSelection/PlayerTeam.vue" 
  export default {
    components: {
      PlayersList,
      TeamsList,
      PlayerTeam
    },
    data() {
      return {
        errorSubmittingTeam:false,
        submittingTeam:false,
        successSubmittingTeam: false,
        allPlayers: [],
        allTeams: [],
        selectedTabIndex: 0,
        tabs: ["Players", "Teams"],
        roleToAddPlayer: "jungle",
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
          captain: 1,
          transfersMade: 0,
          transfersAvailable: 100
        },
        selectedPlayers: [],
        loadedPlayers: [],
        matchesByFixture: [],
        nextFixture: null
      };
    },
    mounted(){
      this.fetchPlayers();
      this.fetchTeams();
      this.getCurrentFixture();
      // this.getFixtures();
    },
    computed: {
      teamValue() {
        
        let totalValue = 0;
    // Iterate through the player roles and team
        for (const role in this.selectedUserTeam) {
          // eslint-disable-next-line
          if (this.selectedUserTeam.hasOwnProperty(role)) {
            const player = this.selectedUserTeam[role].player;
// eslint-disable-next-line
            if (player != null && player.hasOwnProperty("price")) {
              totalValue += player.price;
            }
          }
        }

        // Add the team price
        // eslint-disable-next-line
        if (this.selectedUserTeam.hasOwnProperty("team") && this.selectedUserTeam.team.team != null) {
          totalValue += this.selectedUserTeam.team.team.price;
        }

        // You can store or display the totalValue as needed
        console.log("Total Selected Team Value: " + totalValue);

        return totalValue;
      },
      
      transfersMade() {
          // this.loadedPlayers
          var currentLineup = [];
          for (const key in this.selectedUserTeam) {
            if (this.selectedUserTeam[key].player != null) {
              console.log("taki jest", this.selectedUserTeam[key].player.esportsPlayerId)
              currentLineup.push(this.selectedUserTeam[key].player.esportsPlayerId);
            }
            if (this.selectedUserTeam[key].team != null) {
              console.log("taki jest team", this.selectedUserTeam[key].team.esportsTeamId)
              currentLineup.push(this.selectedUserTeam[key].team.esportsTeamId);
            }
          }

          console.log('current',currentLineup)
          console.log('loaded',this.loadedPlayers)
          return this.loadedPlayers.filter(n => !currentLineup.includes(n)).length
      },
    },
    methods: {
      formatDate(inputDate) {
    // Create a Date object from the input string
        const date = new Date(inputDate);
        
        // Get the individual date and time components
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // Months are zero-based
        const year = date.getUTCFullYear() % 100; // Get the last two digits of the year
        const hours = date.getUTCHours() + 2;
        const minutes = date.getUTCMinutes();

        // Ensure single digits have leading zeros
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedYear = year < 10 ? `0${year}` : year;
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        // Construct the formatted date and time string
        const formattedDate = `${formattedDay}.${formattedMonth}.${formattedYear} ${formattedHours}:${formattedMinutes}`;

        return formattedDate;
    },
      async getCurrentFixture() {
            const url = `${this.apiURL}Matches/fixture`

            this.axios.get(url).then((response) => {
                this.$store.commit('setFixtureId', response.data);
                console.log("Current fixture: ", this.$store.getters.getFixtureId)
                this.getFixtures();
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
        async getFixtures() {
            const url = `${this.apiURL}Matches/fixtures`

            this.axios.get(url).then((response) => {
                this.matchesByFixture = response.data.fixturesWithMatches;
                this.nextFixture = this.matchesByFixture.find((fix => fix.fixture.fixtureId == this.$store.getters.getFixtureId+1))
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
      async fetchUserTeam() {
        try {
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/user_team/${this.$store.getters.getProfileId}`);
            var userTeam = response.data;
            this.selectedUserTeam.topPlayer.player = this.allPlayers.find((element) => element.esportsPlayerId == userTeam.topPlayer.esportsPlayerId);
            this.selectedUserTeam.junglePlayer.player = this.allPlayers.find((element) => element.esportsPlayerId == userTeam.junglePlayer.esportsPlayerId);
            this.selectedUserTeam.midPlayer.player = this.allPlayers.find((element) => element.esportsPlayerId == userTeam.midPlayer.esportsPlayerId);
            this.selectedUserTeam.botPlayer.player = this.allPlayers.find((element) => element.esportsPlayerId == userTeam.bottomPlayer.esportsPlayerId);
            this.selectedUserTeam.supportPlayer.player = this.allPlayers.find((element) => element.esportsPlayerId == userTeam.supportPlayer.esportsPlayerId);
            this.selectedUserTeam.subPlayer.player = this.allPlayers.find((element) => element.esportsPlayerId == userTeam.subPlayer.esportsPlayerId);
            this.selectedUserTeam.team.team = this.allTeams.find((element) => element.esportsTeamId == userTeam.team.esportsTeamId);
            this.selectedUserTeam.captain = userTeam.captain;
            this.selectedUserTeam.transfersMade = userTeam.transfersMade;
            this.selectedUserTeam.transfersAvailable = userTeam.transfersAvailable;
            
            this.loadedPlayers = [
              userTeam.topPlayer.esportsPlayerId,
              userTeam.junglePlayer.esportsPlayerId,
              userTeam.midPlayer.esportsPlayerId,
              userTeam.bottomPlayer.esportsPlayerId,
              userTeam.supportPlayer.esportsPlayerId,
              userTeam.subPlayer.esportsPlayerId,
              userTeam.team.esportsTeamId,
            ]

            console.log('loaded first',this.loadedPlayers)
            // this.sortedPlayers = this.players;
          } catch (error) {
            console.error("Error fetching players:", error);
          }
        
      },
      async fetchPlayers() {
        try {
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/players`);
            this.allPlayers = response.data;
            // this.sortedPlayers = this.players;
          } catch (error) {
            console.error("Error fetching players:", error);
          }
        
      },
      async fetchTeams() {
        try {
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/teams`);
            this.allTeams = response.data;
            this.fetchUserTeam();
            // this.sortedPlayers = this.players;
          } catch (error) {
            console.error("Error fetching teams:", error);
          }
        
      },
      selectTab(index){
        this.selectedTabIndex = index;
        console.log(this.selectedTabIndex);
      },
      submitTeam() {
        if (this.loadedPlayers.length == 0)
          this.submitTeamPost();
        else
          this.submitTeamPut();

      },
      submitTeamPost() {
        // Handle the submission of the selected team
        this.submittingTeam = true
            this.clearStatus()
            if(!this.validateTeam())
            return;

            const data = {
              "ownerId": this.$store.getters.getProfileId,
              "topPlayerId": this.selectedUserTeam.topPlayer.player.esportsPlayerId,
              "junglePlayerId": this.selectedUserTeam.junglePlayer.player.esportsPlayerId,
              "midPlayerId": this.selectedUserTeam.midPlayer.player.esportsPlayerId,
              "bottomPlayerId": this.selectedUserTeam.botPlayer.player.esportsPlayerId,
              "supportPlayerId": this.selectedUserTeam.supportPlayer.player.esportsPlayerId,
              "subPlayerId": this.selectedUserTeam.subPlayer.player.esportsPlayerId,
              "teamSlug": this.selectedUserTeam.team.team.slug,
              "captain": this.selectedUserTeam.captain,
            }
            const url = `${this.apiURL}FantasyPoints/user_team`
            this.axios.post(url, data).then((response) => {
                console.log(response.data)
                this.successSubmittingTeam = true
            this.submittingTeam = false
                // this.clearInputs()
            }).catch(() => {
              this.errorSubmittingTeam = true
            this.submittingTeam = false

                // if (error.response.status === 409) {
                // }
            });

        console.log('Selected Players:', this.selectedPlayers);
        // You can send the selected team to your backend here
      },
      submitTeamPut() {
        // Handle the submission of the selected team
        this.submittingTeam = true
            this.clearStatus()
            if(!this.validateTeam())
            return;

            const data = {
              "ownerId": this.$store.getters.getProfileId,
              "topPlayerId": this.selectedUserTeam.topPlayer.player.esportsPlayerId,
              "junglePlayerId": this.selectedUserTeam.junglePlayer.player.esportsPlayerId,
              "midPlayerId": this.selectedUserTeam.midPlayer.player.esportsPlayerId,
              "bottomPlayerId": this.selectedUserTeam.botPlayer.player.esportsPlayerId,
              "supportPlayerId": this.selectedUserTeam.supportPlayer.player.esportsPlayerId,
              "subPlayerId": this.selectedUserTeam.subPlayer.player.esportsPlayerId,
              "teamSlug": this.selectedUserTeam.team.team.slug,
              "captain": this.selectedUserTeam.captain,
            }
            const url = `${this.apiURL}FantasyPoints/user_team`
            this.axios.put(url, data).then((response) => {
                console.log(response.data)
                this.successSubmittingTeam = true
            this.submittingTeam = false
                
                // this.clearInputs()
            }).catch(() => {
              this.errorSubmittingTeam = true
            this.submittingTeam = false

                // if (error.response.status === 409) {
                // }
            });

            // this.submittingTeam = false
        console.log('Selected Players:', this.selectedPlayers);
        // You can send the selected team to your backend here
      },
      clearStatus() {
        this.successSubmittingTeam = false;
        this.errorSubmittingTeam = false;
      },
      validateTeam(){
        
        return this.selectedUserTeam.topPlayer.player != null &&
          this.selectedUserTeam.junglePlayer.player != null &&
          this.selectedUserTeam.midPlayer.player != null &&
          this.selectedUserTeam.botPlayer.player != null &&
          this.selectedUserTeam.supportPlayer.player != null &&
          this.selectedUserTeam.subPlayer.player != null 
          // && this.selectedUserTeam.team.team != null
      },
      playerSelected (player){
        
        console.log("trying to add ",player.summonerName, ' to ', player.role);
        if (player.role == this.roleToAddPlayer || this.roleToAddPlayer == "sub")
          this.addToRole(player, this.roleToAddPlayer)
        else 
          console.log("WRONG ROLE");
      },
      teamSelected (team){
        console.log(this.roleToAddPlayer)
        console.log("trying to add ",team.name, ' to ', 'team');
        if ('team' == this.roleToAddPlayer)
          this.addTeamToRole(team, this.roleToAddPlayer)
        else 
          console.log("WRONG ROLE");
      },
      playerRemoved (role){
        console.log("trying to remove a player from ", role);
        if (role == 'team')
        {
          this.selectedUserTeam.team.team = null;
          return;
        }

        for (const key in this.selectedUserTeam) {
          if (this.selectedUserTeam[key].role === role) {
            console.log("removing player from ", role);
            this.selectedUserTeam[key].player = null;
          }
        }
      },
      addToRole(player, role){
        var teamPlayer = this.selectPlayerByRole(role);
        if( teamPlayer != null) {
          console.log("mamy to, dodaje", player, "do", teamPlayer)
          this.selectedUserTeam[teamPlayer].player = player;
          this.roleToAddPlayer = ''
        }
      },
      addTeamToRole(team, role){
          console.log("mamy to, dodaje", team, "do", role)
          this.selectedUserTeam.team.team = team;
          this.roleToAddPlayer = ''
      },
      selectPlayerByRole(role) {
        console.log("rola",role);
        for (const key in this.selectedUserTeam) {
          if (this.selectedUserTeam[key].role === role && this.selectedUserTeam[key].player === null) {
            console.log("taki player", this.selectedUserTeam[key].player)
            return key;
          }
        }
        console.log("nope");
        return null; // Return null if no player with the specified role is found
      },
      selectTeamByRole(role) {
        console.log("rola",role);
        for (const key in this.selectedUserTeam) {
          if (this.selectedUserTeam[key].role === role && this.selectedUserTeam[key].player === null) {
            console.log("taki player", this.selectedUserTeam[key].player)
            return key;
          }
        }
        console.log("nope");
        return null; // Return null if no player with the specified role is found
      }
    },
  };
  </script>

  <style scoped>
.players-list-container {
  height: 40vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 0%;
  padding-right: 0%;
  border: 1px solid #ddd;
}

::-webkit-scrollbar {
    width: 5px;
    height: 15px;
    background-color: var(--DARK-YELLOW);
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

.game-points {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}

.error-text {
  color: red;
}
</style>