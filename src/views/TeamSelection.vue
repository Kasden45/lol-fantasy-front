<!-- TeamSelection.vue -->
<template>
    <div class="container">
      
      <button class="btn btn-info mb-2">
          <router-link
          class="nav-link"
          :class="{ active: this.$route.name === 'TeamSelectionV2' }"
          :to="{ name: 'TeamSelectionV2' }"
          >Team Selection v2</router-link
        >
    </button>

      <div class="row">
      <div class="progress-ring col-3 offset-1 d-flex align-content-start" v-if="this.nextFixture != null">
          <svg
            class="progress-ring__svg"
            :width="radius * 2"
            :height="radius * 2"
            viewBox="0 0 500 500"
          >
            <!-- Background Circle -->
            <circle
              class="progress-ring__background"
              :r="normalizedRadius"
              :cx="center"
              :cy="center"
              fill="transparent"
              :stroke-width="strokeWidth"
            />
            <!-- Foreground Progress Circle -->
            <circle
              class="progress-ring__progress"
              :r="normalizedRadius"
              :cx="center"
              :cy="center"
              fill="transparent"
              :stroke-width="strokeWidth"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              stroke-linecap="round"
            />
            <g transform="rotate(90, 270, 270)">
            <text
              class="progress-ring__text"
              :x="center"
              :y="center"
              fill="#000"
              font-size="26"
              font-weight="bold"
              text-anchor="middle"
              dominant-baseline="middle"
            >
             REMAINING BUDGET
            </text>
            </g>
            <g transform="rotate(90, 165, 165)">
            <text
              :style="{fill: this.teamValue > this.nextFixture.fixture.teamValueLimit ? 'red' : black}"
              :class="{'fill-primary' : this.teamValue <= this.nextFixture.fixture.teamValueLimit, 'fill-error' : this.teamValue > this.nextFixture.fixture.teamValueLimit}"
              class="progress-ring__text"
              :x="center"
              :y="center"
              font-size="34"
              font-weight="bold"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ this.nextFixture.fixture.teamValueLimit - teamValue }}$ / {{this.nextFixture.fixture.teamValueLimit}}$
            </text>
            </g>
          </svg>
          <!--  -->
        </div>
        <div class="progress-ring col-4 d-flex align-content-start" v-if="this.nextFixture != null">
          <svg
            class="progress-ring__svg"
            :width="radius * 2"
            :height="radius * 2"
            viewBox="0 0 500 500"
          >
            <!-- Background Circle -->
            <circle
              class="progress-ring__background"
              :r="normalizedRadius"
              :cx="center"
              :cy="center"
              fill="transparent"
              :stroke-width="strokeWidth"
            />
            <!-- Foreground Progress Circle -->
            <circle
              class="progress-ring__progress"
              :r="normalizedRadius"
              :cx="center"
              :cy="center"
              fill="transparent"
              :stroke-width="strokeWidth"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffsetTransfer"
              stroke-linecap="round"
            />
            <g transform="rotate(90, 270, 270)">
            <text
              class="progress-ring__text"
              :x="center"
              :y="center"
              fill="#000"
              font-size="26"
              font-weight="bold"
              text-anchor="middle"
              dominant-baseline="middle"
            >
             REMAINING TRANSFERS
            </text>
            </g>
            <g transform="rotate(90, 165, 165)">
            <text
              :class="{'fill-primary' : this.selectedUserTeam.transfersAvailable - this.transfersMade >= 0, 'fill-error' : this.selectedUserTeam.transfersAvailable - this.transfersMade < 0}"
              class="progress-ring__text"
              :x="center"
              :y="center"
              font-size="34"
              font-weight="bold"
              text-anchor="middle"
              dominant-baseline="middle"
            >
            {{ this.selectedUserTeam.transfersAvailable > 10 ? '∞' : this.selectedUserTeam.transfersAvailable - this.transfersMade }} / {{this.nextFixture.fixture.transfersLimit}}
            </text>
            </g>
          </svg>
          <!--  -->
        </div>
        <div class="col-4 d-flex align-items-end">
          <h4 
          v-if="this.nextFixture != null"
          :class="{
            'text-danger' : ((new Date(this.nextFixture.fixture.deadlineDate) - new Date())/ 36e5) < 48, 
            'text-warning': ((new Date(this.nextFixture.fixture.deadlineDate) - new Date())/ 36e5) > 48 && ((new Date(this.nextFixture.fixture.deadlineDate) - new Date())/ 36e5) < 24*7}"
          >Next deadline: {{ this.$func_global.formatDate(this.nextFixture.fixture.deadlineDate) }}</h4>
          <!-- <h3 v-if="this.nextFixture != null" :class="{'error-text' : this.teamValue > this.nextFixture.fixture.teamValueLimit}">Price total {{ this.teamValue }}/{{ this.nextFixture.fixture.teamValueLimit }}$</h3>
          <h3 >Transfers made: {{ this.transfersMade }}</h3>
          <h3 v-if="this.nextFixture != null" :class="{'error-text' : this.selectedUserTeam.transfersAvailable - this.transfersMade < 0}">Transfers available: {{ this.selectedUserTeam.transfersAvailable > 10 ? '∞' : this.selectedUserTeam.transfersAvailable - this.transfersMade }}/{{ this.selectedUserTeam.transfersAvailable > 10 ? '∞' : this.nextFixture.fixture.transfersLimit }}</h3> -->
        </div>
      </div>
      <div class="row w-100 justify-content-md-center m-auto">
        <div class="col-md-7">
          <PlayerTeam :captain="selectedUserTeam.captain" :currently-picked="this.roleToAddPlayer" @playerRemove="playerRemoved" @rolePick="(r) => roleToAddPlayer = r" :userTeam="selectedUserTeam"/>
            <div class="row justify-content-md-center m-auto py-2">
              <div class="col-3 d-flex justify-content-start ps-0">
                <label class="w-auto d-flex align-self-center me-1" for="captain">Captain: </label>
                <select class="w-auto" id="captain" v-model="selectedUserTeam.captain">
                  <option value=1>Top</option>
                  <option value=2>Jungle</option>
                  <option value=3>Mid</option>
                  <option value=4>Bottom</option>
                  <option value=5>Support</option>
                </select>  
              </div>
              <div class="col-3 offset-6 d-flex justify-content-end px-0">
                <button v-if="this.nextFixture != null" class="btn sticky-end" :class="{ 'btn-warning': !teamIsCorrect, 'btn-success': teamIsCorrect, disabled : !teamIsCorrect}" @click="submitTeam">Submit Team</button>

              </div>
              
            </div>
            
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
            class="game-tab"
          >
            {{ game }}
          </div>
          <div class="sorting-div my-1 sticky-right" v-if="nextFixture != null">
            <label class="me-1"  for="range">Last </label>
            <select id="range" v-model="selectedForm" @change="rangeChanged(selectedForm)" onhov="as">
              <option v-for="fixtureOrder in Array.from(Array(nextFixture.fixture.order-1).keys())" :key="order" :value="fixtureOrder">{{ fixtureOrder == 0 ? "All" : fixtureOrder }}</option>
              
            </select>
            <label class="mx-1"  for="range"> fixtures form</label>
          </div>
        </div>
        
          <div class="players-list-container" v-if="selectedTabIndex == 0">
            <PlayersList :userTeam="pickedPlayersIds" :nextFixture="nextFixture" :teamsPlayingNextFixture="teamsPlayingInNextFixture" @rangeChange="rangeChanged" @playerSelect="playerSelected" :selectedRole="roleToAddPlayer" :players="allPlayers" v-if="allPlayers.length > 0"/>
          </div>
          <div class="players-list-container" v-if="selectedTabIndex == 1">
            <TeamsList :userTeam="selectedUserTeam.team.team != null ? selectedUserTeam.team.team.slug : ''" :nextFixture="nextFixture" :teamsPlayingNextFixture="teamsPlayingInNextFixture" @rangeChange="rangeChanged" @teamSelect="teamSelected" :selectedRole="roleToAddPlayer" :teams="allTeams" v-if="allTeams.length > 0"/>
          </div>
          <!-- <PlayerPointsCard :playerDetails="selectedGame" :totalPoints="totalPointsA" v-if="selectedGame" /> -->
        </div>
      </div>

      <button  class='btn btn-info my-2 col-6 w-100' @click="this.showMatches = !this.showMatches">{{ this.showMatches ? 'Hide matches':'Show matches' }}</button>
      <div v-if="this.showMatches && this.nextFixture != null" class="col-4 offset-4">
        <MatchesView :oneFixtureId="this.nextFixture.fixture.fixtureId"/>
      </div>
    </div>
    
  </template>
  
  <script>
  import PlayersList from "@/components/Players/AllPlayersList.vue" 
  import TeamsList from "@/components/Players/AllTeamsList.vue" 
  import PlayerTeam from "@/components/TeamSelection/PlayerTeam.vue" 
  import MatchesView from "./MatchesView.vue";
  export default {
    components: {
      PlayersList,
      TeamsList,
      PlayerTeam,
      MatchesView
    },
    data() {
      return {
        selectedForm: 0,
        formNumberOfGames: 0,
        teamsPlayingInNextFixture: [],
        showMatches:false,
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
        nextFixture: null,
        value: 50, // Example value
      maxValue: 100, // Example max value
      radius: 150, // Radius of the ring
      strokeWidth: 30, // Thickness of the ring
      };
    },
    mounted(){
      this.fetchPlayers();
      this.fetchTeams();
      this.getCurrentFixture();
      // this.getFixtures();
    },
    computed: {
      center() {
      return this.radius + this.strokeWidth / 2;
      },
      normalizedRadius() {
        return this.radius - this.strokeWidth / 2;
      },
      circumference() {
        return 2 * Math.PI * this.normalizedRadius;
      },
      strokeDashoffset() {
        const percent = Math.min(this.teamValue / this.nextFixture.fixture.teamValueLimit, 1);
        return this.circumference - percent * this.circumference;
      },
      strokeDashoffsetTransfer() {
        const percent = (this.selectedUserTeam.transfersAvailable - this.transfersMade) / this.nextFixture.fixture.transfersLimit;
        return this.circumference - percent * this.circumference;
      },
      teamIsCorrect() {
        return !(this.teamValue > this.nextFixture.fixture.teamValueLimit || this.selectedUserTeam.transfersAvailable < this.selectedUserTeam.transfersMade || this.pickedPlayersNumber < 7)
      },
      pickedPlayersIds() {
        
        let pickedPlayers = [];
    // Iterate through the player roles and team
        for (const role in this.selectedUserTeam) {
          // eslint-disable-next-line
          if (this.selectedUserTeam.hasOwnProperty(role)) {
            const player = this.selectedUserTeam[role].player;
// eslint-disable-next-line
            if (player != null && player.hasOwnProperty("price")) {
              pickedPlayers.push(player.esportsPlayerId);
            }
          }
        }

        // Add the team price
        // eslint-disable-next-line
        return pickedPlayers;
      },
      pickedPlayersNumber() {
        
        let pickedPlayers = 0;
    // Iterate through the player roles and team
        for (const role in this.selectedUserTeam) {
          // eslint-disable-next-line
          if (this.selectedUserTeam.hasOwnProperty(role)) {
            const player = this.selectedUserTeam[role].player;
// eslint-disable-next-line
            if (player != null && player.hasOwnProperty("price")) {
              pickedPlayers += 1;
            }
          }
        }

        // Add the team price
        // eslint-disable-next-line
        if (this.selectedUserTeam.hasOwnProperty("team") && this.selectedUserTeam.team.team != null) {
          pickedPlayers += 1;
        }

        // You can store or display the totalValue as needed
        console.log("Selected: " + pickedPlayers);

        return pickedPlayers;
      },
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
      rangeChanged(numberOfGames) {
        console.log(numberOfGames);
        this.numberOfGames = numberOfGames;
        this.fetchPlayers();
        this.fetchTeams();
      },
      formatDate(inputDate) {
    // Create a Date object from the input string
        const date = new Date(inputDate);
        
        // Get the individual date and time components
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // Months are zero-based
        const year = date.getUTCFullYear() % 100; // Get the last two digits of the year
        const hours = date.getUTCHours() + 1;
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
            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixture`

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
            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`

            this.axios.get(url).then((response) => {
                this.matchesByFixture = response.data.fixturesWithMatches;
                this.nextFixture = this.matchesByFixture
                .filter(m => new Date(m.fixture.deadlineDate) > new Date())
                        .sort(function(a,b){
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(a.fixture.deadlineDate) - new Date(b.fixture.deadlineDate);
                      })[0]

            this.teamsPlayingInNextFixture = this.nextFixture.matches
              .filter(m => m.team1 != null && m.team2 != null).map(m => m.team1).concat(this.nextFixture.matches.filter(m => m.team1 != null && m.team2 != null).map(m => m.team2))
              .map(m => m.code);
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
      async fetchUserTeam() {
        try {
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/user_team/${this.$store.getters.getProfileId}`);
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
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/players${this.numberOfGames > 0 ? `/form/${this.numberOfGames}` : ''}`);
            this.allPlayers = response.data;
            // this.sortedPlayers = this.players;
          } catch (error) {
            console.error("Error fetching players:", error);
          }
        
      },
      async fetchTeams() {
        try {
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/teams${this.numberOfGames > 0 ? `/form/${this.numberOfGames}`: ''}`);
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
            const url = `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/user_team`
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
            const url = `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/user_team`
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
  overflow-x: scroll;
  padding-left: 0%;
  padding-right: 0%;
  border: 1px solid #ddd;
}

::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: var(--DARK-YELLOW);
}

.game-tabs {
  display: flex;
  margin-bottom: 20px;
}

.game-tabs, .game-tab {
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
.progress-ring__svg {
  transform: rotate(-90deg); /* Rotates the ring to start at the top */
}

.progress-ring__text {
  font-family: 'Arial', sans-serif;
}

.progress-ring__background {
  stroke: var(--GREY-DARKER); /* Background color */
}

.progress-ring__progress {
  stroke: var(--PRIMARY); /* Progress bar color */
  transition: stroke-dashoffset 0.35s; /* Smooth animation */
  transform: rotate(0deg);
  transform-origin: 50% 50%;
}

.fill-primary {
  fill: var(--PRIMARY);
}


.fill-error {
  fill: red;
}


</style>