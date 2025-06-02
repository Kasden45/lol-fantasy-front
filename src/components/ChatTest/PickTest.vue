  <template>
    <div class="container">
      <button @click="joinDraft" v-if="!this.draftOrder.includes(this.$store.getters.getProfileId)">Join Draft</button>
      <a v-if="this.draftOrder.includes(this.$store.getters.getProfileId)">Current players in draft: {{ this.draftOrder }}</a>
      <div v-if="isCurrentDrafter">
        <h3>It's your turn to pick!</h3>
      </div>
      <div v-else>
        <h3>Waiting for other players to pick...</h3>
      </div>
      <div class="draft-container justify-content-md-center m-auto row">
        <div class="players-list-container col-5" >
            <PlayersList :userTeam="pickedPlayersIds" :nextFixture="null" :teamsPlayingNextFixture="teamsPlayingInNextFixture" @rangeChange="()=>{}" @playerSelect="playerSelected" :selectedRole='roleToAddPlayer' :players="availablePlayers" v-if="availablePlayers.length > 0"/>
        </div>
        <div class="team-list col-3">
          <h3>Your Team</h3>
          <h4>Team {{ this.$store.getters.getProfileId }}</h4>
          <ul>
            <li v-for="(position, key) in selectedTeam" :key="key" @click="position.player ? null : choseRole(position.role)">
              {{ position.role }}: {{ position.player ? position.player.summonerName : 'None' }}
            </li>
          </ul>
        </div>
        <div class="other-teams col-3">
          <h3>Other Teams</h3>
          <div v-for="(team, clientId) in otherTeams" :key="clientId">
            <h4>Team {{ clientId }}</h4>
            <ul>
              <li v-for="(position, key) in team" :key="key">
                {{ position.role }}: {{ position.player ? position.player.summonerName : 'None' }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <button
        class="btn btn-success"
        @click="finishDraft()"
        >
          Finish draft
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import socket from '@/socket.js';
  import PlayersList from "@/components/Players/AllPlayersList.vue" 
  
  export default {
    props: {
      leagueId: String
    },
    components: {
      PlayersList,
    },
    data() {
      return {
        roleToAddPlayer: 'jungle',
        availablePlayers: [
        { points: 18, gamesPlayed: 2, role: 'jungle', imageUrl: '', summonerName: 'Faker', esportsPlayerId: 123, price: 12, team: { code: 'BLG' } },
        { points: 18, gamesPlayed: 2, role: 'jungle', imageUrl: '', summonerName: 'Faker2', esportsPlayerId: 124, price: 12, team: { code: 'T1' } },
        { points: 18, gamesPlayed: 2, role: 'top', imageUrl: '', summonerName: 'Faker3', esportsPlayerId: 125, price: 12, team: { code: 'T1' } },
        { points: 18, gamesPlayed: 2, role: 'bottom', imageUrl: '', summonerName: 'Faker4', esportsPlayerId: 126, price: 12, team: { code: 'GENG' } },
        { points: 18, gamesPlayed: 2, role: 'mid', imageUrl: '', summonerName: 'Faker5', esportsPlayerId: 127, price: 12, team: { code: 'GENG' } },
        { points: 18, gamesPlayed: 2, role: 'support', imageUrl: '', summonerName: 'Faker6', esportsPlayerId: 128, price: 12, team: { code: 'GENG' } },
        { points: 18, gamesPlayed: 2, role: 'support', imageUrl: '', summonerName: 'Faker7', esportsPlayerId: 129, price: 12, team: { code: 'BLG' } },
        { points: 18, gamesPlayed: 2, role: 'top', imageUrl: '', summonerName: 'Faker8', esportsPlayerId: 133, price: 12, team: { code: 'DK' } },
        { points: 18, gamesPlayed: 2, role: 'jungle', imageUrl: '', summonerName: 'Faker9', esportsPlayerId: 133, price: 12, team: { code: 'DK' } },
        // Add more players as needed
      ],
      selectedTeam: {
        topPlayer: { role: "top", player: null },
        junglePlayer: { role: "jungle", player: null },
        midPlayer: { role: "mid", player: null },
        bottomPlayer: { role: "bottom", player: null },
        supportPlayer: { role: "support", player: null },
        subPlayer: { role: "sub", player: null },
        team: { role: "team", team: null }
      },
        // selectedPlayers: [],
        otherTeams: {},
        teamsPlayingInNextFixture: ['BLG','T1','DK','GEN', 'FNC', 'FLY', 'G2'],
        currentDrafter: null,
        draftOrder: [],
      };
    },
    computed: {
        isCurrentDrafter() {
            var userId = this.$store.getters.getProfileId;
            return userId === this.currentDrafter;
        },
        pickedPlayersIds() {
        
        let pickedPlayers = [];
    // Iterate through the player roles and team
        for (const role in this.selectedTeam) {
          // eslint-disable-next-line
          if (this.selectedTeam.hasOwnProperty(role)) {
            const player = this.selectedTeam[role].player;
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
    },
    mounted() {
      var leagueId = this.leagueId;
      socket.emit('startDraft', leagueId)
      socket.emit('getCurrentState', ({message:'get players', invitationCode: this.leagueId}));
    },
    async created() {
        await this.fetchPlayers();
        
      socket.on('connect', () => {
        console.log('Connected to server');
      });
      var leagueId = this.leagueId;
      socket.emit('startDraft', leagueId)
      socket.emit('getCurrentState', ({message:'get players', invitationCode: this.leagueId}));

      socket.on('currentState', ({pickedPlayers, draftOrder, currentDrafter}) => {
        this.otherTeams = {...pickedPlayers};
        this.draftOrder = draftOrder;
        console.log('got current state', pickedPlayers, draftOrder, currentDrafter);
        console.log('profile id', this.$store.getters.getProfileId);
        this.selectedTeam = !this.otherTeams[this.$store.getters.getProfileId] ? 
        {
            topPlayer: { role: "top", player: null },
            junglePlayer: { role: "jungle", player: null },
            midPlayer: { role: "mid", player: null },
            bottomPlayer: { role: "bottom", player: null },
            supportPlayer: { role: "support", player: null },
            subPlayer: { role: "sub", player: null },
            team: { role: "team", team: null }
        }
        : this.otherTeams[this.$store.getters.getProfileId];
        this.currentDrafter = currentDrafter;
        // Remove already picked players from availablePlayers
        // Object.values(pickedPlayers).forEach(team => {
        //     team.forEach(player => {
        //     this.availablePlayers = this.availablePlayers.filter(p => p.id !== player.id);
        //     });
        // });
        Object.values(pickedPlayers).flatMap(team => Object.values(team)).forEach(position => {
            if (position.player) {
                this.availablePlayers = this.availablePlayers.filter(p => p.esportsPlayerId !== position.player.esportsPlayerId);
            }
        });
        delete this.otherTeams[this.$store.getters.getProfileId];
    });

      var userId = this.$store.getters.getProfileId;
      socket.on('playerSelected', ({ clientId, player }) => {
        if (clientId !== userId) {
          if (!this.otherTeams[clientId]) {
            this.otherTeams[clientId] = {
                topPlayer: { role: "top", player: null },
                junglePlayer: { role: "jungle", player: null },
                midPlayer: { role: "mid", player: null },
                bottomPlayer: { role: "bottom", player: null },
                supportPlayer: { role: "support", player: null },
                subPlayer: { role: "sub", player: null },
                team: { role: "team", team: null }
            };
          }
          const roleKey = `${player.role}Player`;
            if (this.otherTeams[clientId][roleKey]) {
                this.otherTeams[clientId][roleKey].player = player;
            }
          this.availablePlayers = this.availablePlayers.filter(p => p.esportsPlayerId !== player.esportsPlayerId);
        }
      });
  
      socket.on('currentDrafter', (currentDrafter) => {
        this.currentDrafter = currentDrafter;
    });

    socket.on('draftOrderUpdated', ({ draftOrder, currentDrafter }) => {
      this.draftOrder = draftOrder;
      this.currentDrafter = currentDrafter;
    });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socket.on('finishedDraft', ({pickedPlayers, draftOrder, currentDrafter}) => {
        console.log('Finishing the draft');
        for (const [key, value] of Object.entries(pickedPlayers)) {
          console.log(key, value);
          this.axios.post(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/user_team`,{
            OwnerId: this.$store.getters.getProfileId, // Set the user's ID
            TopPlayerId: pickedPlayers[key]["topPlayer"].player.esportsPlayerId,
            JunglePlayerId : pickedPlayers[key]["junglePlayer"].player.esportsPlayerId,
            MidPlayerId : pickedPlayers[key]["midPlayer"].player.esportsPlayerId,
            BottomPlayerId : pickedPlayers[key]["bottomPlayer"].player.esportsPlayerId,
            SupportPlayerId :pickedPlayers[key]["supportPlayer"].player.esportsPlayerId,
            SubPlayerId : pickedPlayers[key]["subPlayer"].player.esportsPlayerId,
            TeamSlug : "weibo-gaming",
            LeagueId : 11,
            Captain : 1
          }
        );
        }
        
        console.log('Finishing the draft - end');
        // Create all teams
      });
    },
    methods: {
      finishDraft() {
        console.log(this.leagueId)
        socket.emit('finishDraft', this.leagueId);
      },
      choseRole(role) {
        console.log(role)
        this.roleToAddPlayer = role
      },
      async fetchPlayers() {
          try {
              const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/players${this.numberOfGames > 0 ? `/form/${this.numberOfGames}` : ''}`);
              this.availablePlayers = response.data;
              // this.sortedPlayers = this.players;
            } catch (error) {
              console.error("Error fetching players:", error);
            }
          
        },
      joinDraft() {
          var userId = this.$store.getters.getProfileId;
          socket.emit('joinDraft', ({userId: userId, invitationCode: this.leagueId}));
      },
      selectPlayer(player) {
          if (!this.isCurrentDrafter) {
              console.log('It is not your turn to pick');
              return;
          }
          var userId = this.$store.getters.getProfileId;
          const roleKey = `${this.roleToAddPlayer}Player`;
          if (this.selectedTeam[roleKey]) {
              this.selectedTeam[roleKey].player = player;
          }

          this.availablePlayers = this.availablePlayers.filter(p => p.esportsPlayerId !== player.esportsPlayerId);
          socket.emit('playerSelected', { clientId: userId, player: player, invitationCode: this.leagueId, role: this.roleToAddPlayer });
      },
      playerSelected (player){
          
          console.log("trying to add ",player.summonerName, ' to ', this.roleToAddPlayer);
          if (player.role == this.roleToAddPlayer || this.roleToAddPlayer == "sub")
          {
              // this.addToRole(player, this.roleToAddPlayer);
              this.selectPlayer(player);
          }            
          else 
              console.log("WRONG ROLE");
      },
      addToRole(player, role){
          var teamPlayer = this.selectPlayerByRole(role);
          if( teamPlayer != null) {
            console.log("mamy to, dodaje", player, "do", teamPlayer)
            this.selectedUserTeam[teamPlayer].player = player;
            this.roleToAddPlayer = ''
          }
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
    },
    beforeDestroy() {
      if (socket) {
        socket.disconnect();
      }
    },
  };
  </script>
  
  <style scoped>
.draft-container {
  width: 85vw;
  display: flex;
  justify-content: space-between;
}


ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  margin: 5px 0;
}

li:hover {
  background-color: #f0f0f0;
}

.players-list-container {
  height: 60vh;
  overflow-y: scroll;
  overflow-x: scroll;
  padding-left: 0%;
  padding-right: 0%;
  border: 1px solid #ddd;
}
</style>