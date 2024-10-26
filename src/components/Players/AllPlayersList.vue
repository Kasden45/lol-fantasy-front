<template>
  <div class="row">
    <div class="filter-div  col-4 my-1">
      <label class="me-1" for="filter-method">Filter by:</label>
      <br><select id="filter-method" v-model="selectedFilter" @change="filterPlayers(selectedFilter)">
        <option value="any">All</option>
        <optgroup label="Role">
            <option value="top">Top</option>
            <option value="jungle">Jungle</option>
            <option value="mid">Mid</option>
            <option value="bottom">Bot</option>
            <option value="support">Support</option>
        </optgroup>
        <optgroup label="Team">
            <option v-for="uniqueTeamCode in uniqueTeamCodes" :key="uniqueTeamCode" :value="uniqueTeamCode">{{ uniqueTeamCode }}</option>
        </optgroup>
      </select>
    </div>
    <div class="sorting-div col-4 my-1">
      <label class="me-1"  for="sorting-method">Sort by: </label>
      <br><select id="sorting-method" v-model="selectedSorting" @change="orderPlayers(selectedSorting)">
        <option value="points">Points</option>
        <option value="pointsGame">Pts/game</option>
        <option value="pointsGamePrice">Pts/game/$</option>
        <option value="priceAsc">Price ASC</option>
        <option value="priceDesc">Price DESC</option>
        <option value="summonerName">Name</option>
        <option value="team">Team</option>
      </select>
    </div>
    <div class="sorting-div col-3 my-1">
      <label class="me-1"  for="sorting-method">Active only: </label>
      <br><input type="checkbox" v-model="hideInactive" />
    </div>
  </div>
    <table class="table table-striped list-scrollable">
        <thead>
            <th></th>
            <th>Player</th>
            <th>Role</th>
            <th>Team</th>
            <th>Games</th>
            <th>Pts</th>
            <th>Pts/g</th>
            <th>Pts/g/$</th>
            <th>Price</th>
            <th></th>
        </thead>
        <tbody>
            <tr v-for="player in sortedPlayers.filter(
                  (p) => p.price > 0 && (!hideInactive || (hideInactive && this.teamsPlayingNextFixture.includes(p.team.code)))
                )"
                :key="player.esportsPlayerId" 
                :class="{
                  'player-inactive' : !this.teamsPlayingNextFixture.includes(player.team.code), 
                  'already-owned': this.userTeam.includes(player.esportsPlayerId)
                  }"
                >
                <td><img :src="player.imageUrl" class="player-photo-list" alt="" /></td>
                <!-- <div class="player-info row"> -->
                    
                <td><strong>{{ player.summonerName }}</strong></td>
                <td>{{ player.role }}</td>
                <td>{{ player.team.code }}</td>
                <td class="text-center">{{ player.gamesPlayed }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='points'}">{{ player.points.toFixed(0) }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGame'}">{{ player.gamesPlayed == 0 ? "-" :   (player.points/player.gamesPlayed).toFixed(0) }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGamePrice'}">{{ player.gamesPlayed == 0 ? "-" :   (player.points/player.gamesPlayed/player.price).toFixed(2) }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='priceAsc' || this.selectedSorting=='priceDesc'}">{{ player.price }}</td>
                <td ><button :class="{ 'btn-secondary' : selectedRole != player.role && selectedRole != 'sub', 'btn-info' : (selectedRole == player.role || selectedRole == 'sub') && this.teamsPlayingNextFixture.includes(player.team.code)}" class="btn btn-secondary" @click="selectPlayer(player)" :disabled="(!this.teamsPlayingNextFixture.includes(player.team.code)) || (selectedRole != player.role && selectedRole != 'sub')">+</button></td>
                <!-- </div> -->
            </tr>
        </tbody>
</table>
  </template>

<script>
export default {
    props: {
        nextFixture: Object,
        userTeam: Array,
        teamsPlayingNextFixture: Array,
        selectedRole: String,
        players: Array
    },
    name: "PlayersList",
  data() {
    return {
      hideInactive: true,
      selectedForm: 0,
      selectedSorting: 'points',
      selectedFilter: 'any',
        sorting: "",
        sortedPlayers:[],
        uniqueTeamCodes: [], // Array to store unique team codes
      // players: []
    };
  },
  methods: {
    checkIfPlayerIsInTeam(player) {
      return this.userTeam.players.some((p) => p.esportsPlayerId == player.esportsPlayerId);
    },
    orderPlayers(option) {
      if (option == "points") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) => (a.points < b.points) ? 1 : (a.points > b.points) ? -1 : 0)
      }
      if (option == "pointsGame") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) =>(a.gamesPlayed == 0 && b.gamesPlayed == 0) ? 0 : (a.gamesPlayed == 0 || (a.points/(a.gamesPlayed) < (b.points/b.gamesPlayed))) ? 1 : b.gamesPlayed == 0 ||((a.points/a.gamesPlayed) > (b.points/b.gamesPlayed)) ? -1 : 0)
      }
      if (option == "pointsGamePrice") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) => (a.gamesPlayed == 0 && b.gamesPlayed == 0) ? 0 : (a.gamesPlayed == 0 || (a.points/a.gamesPlayed/a.price) < (b.points/b.gamesPlayed/b.price)) ? 1 : b.gamesPlayed == 0 || ((a.points/a.gamesPlayed/a.price) > (b.points/b.gamesPlayed/b.price)) ? -1 : 0)
      }
      
      if (option == "summonerName") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) => {
        if (a.summonerName.toLowerCase() === b.summonerName.toLowerCase()) return 0;
        return a.summonerName.toLowerCase() > b.summonerName.toLowerCase() ? 1 : -1;
        })
      }
      if (option == "priceAsc") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) => (a.price > b.price) ? 1 : (a.price < b.price) ? -1 : 0)
      }
      if (option == "priceDesc") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) => (a.price < b.price) ? 1 : (a.price > b.price) ? -1 : 0)
      }
      if (option == "team") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) => {
        if (a.team.name.toLowerCase() === b.team.name.toLowerCase()) return 0;
        return a.team.name.toLowerCase() > b.team.name.toLowerCase() ? 1 : -1;
        })
      }
    },
    extractUniqueTeamCodes() {
      // Extract unique team codes from the players array
      this.uniqueTeamCodes = Array.from(new Set(this.players.map((player) => player.team.code)));
    },
    filterPlayers(option) {
        console.log(option);
      if (["top", "jungle", "mid", "bottom", "support", "any"].includes(option)) {
        this.sortedPlayers = this.players.filter((p) => p.role == option || option =='any')
        console.log(this.sortedPlayers)
      }
      else {
        this.sortedPlayers = this.players.filter((p) => p.team.code == option)
        console.log(this.sortedPlayers)
      }
      this.orderPlayers(this.selectedSorting);
    },
    changeRange(numberOfFixtures) {
      // Emit an event to notify the parent component (App) about the selected player
      this.$emit("rangeChange", numberOfFixtures);
    },
    selectPlayer(player) {
      // Emit an event to notify the parent component (App) about the selected player
      console.log("leci", player)
      this.$emit("playerSelect", player);
    },
    fetchPlayers() {
      this.sortedPlayers = this.players.filter((p) => p.price > 0);
      this.orderPlayers("points");
      console.log("acd", this.sortedPlayers)
      console.log("dsa", this.players)
    }
  },
  created() {
    // Call the method to extract unique team codes when the component is created
    this.fetchPlayers();
    this.extractUniqueTeamCodes();
  },
  watch: {
    players: {
      // the callback will be called immediately after the start of the observation
      immediate: true, 
      handler (val, oldVal) {
        this.fetchPlayers();
        this.filterPlayers(this.selectedFilter);
        this.orderPlayers(this.selectedSorting);
        // do your stuff
      }
    }
  }
};
</script>

<style>

.player-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  /* margin-right: 20px; */
}

.player-photo-list {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  /* margin-right: 20px; */
}

.player-info {
  flex: 1;
}

td,th {
    text-align: left;
}

tr {
    vertical-align: middle;
}

th {
    font-size: small;
    font-weight: 300;
}


.section-bg ::-webkit-scrollbar {
    background-color: gray;
}

::-webkit-scrollbar-track {
    --webkit-box-shadow: inset 0 0 6px rgba(200, 200, 200, 1);
    border-radius: 3px;
}

.sport ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: var(--SPORT);
    --webkit-box-shadow: inset 0 0 6px rgba(90, 90, 90, 0.7);
}

::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgb(150, 79, 150);
    --webkit-box-shadow: inset 0 0 6px rgba(90, 90, 90, 0.7);
}

.list-scrollable td, th {
    
    padding: 1px 1px 1px 1px ;
}
.player-inactive {
  --bs-table-bg: #f85a6746 !important;
}

.already-owned {
  --bs-table-bg: #007BFF46 !important;
}

.higlighted {
  color: VAR(--PRIMARY) !important;
  font-weight: 800 !important;
  font-style: italic;
}
/* Add any other styling you need */
</style>
