<template>
    <div class="filter-div">
      <label for="filter-method">Filter by: </label>
      <select id="filter-method" v-model="selectedFilter" @change="filterPlayers(selectedFilter)">
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
    <div class="sorting-div">
      <label for="sorting-method">Sort by: </label>
      <select id="sorting-method" v-model="selectedSorting" @change="orderPlayers(selectedSorting)">
        <option value="points">Points</option>
        <option value="priceAsc">Price ASC</option>
        <option value="priceDesc">Price DESC</option>
        <option value="summonerName">Summoner Name</option>
        <option value="team">Team</option>
      </select>
    </div>
    <table class="table table-striped list-scrollable">
        <thead>
            <th></th>
            <th>Player</th>
            <th>Role</th>
            <th>Team</th>
            <th>Points</th>
            <th>Price</th>
            <th></th>
        </thead>
        <tbody>
            <tr v-for="player in sortedPlayers" :key="player.esportsPlayerId" >
                <td><img :src="player.imageUrl" class="player-photo" alt="Player Photo" /></td>
                <!-- <div class="player-info row"> -->
                    
                <td><strong>{{ player.summonerName }}</strong></td>
                <td>{{ player.role }}</td>
                <td>{{ player.team.code }}</td>
                <td>{{ player.points }}</td>
                <td>{{ player.price }}</td>
                <td ><button class="btn-info" @click="selectPlayer(player)" :disabled="selectedRole != player.role && selectedRole != 'sub'">+</button></td>
                <!-- </div> -->
            </tr>
        </tbody>
</table>
  </template>

<script>
export default {
    props: {
        selectedRole: String,
        players: Array
    },
    name: "PlayersList",
  data() {
    return {
      selectedSorting: 'points',
      selectedFilter: 'any',
        sorting: "",
        sortedPlayers:[],
        uniqueTeamCodes: [], // Array to store unique team codes
      // players: []
    };
  },
  methods: {
    orderPlayers(option) {
      if (option == "points") {
        this.sortedPlayers = this.sortedPlayers.sort((a,b) => (a.points < b.points) ? 1 : (a.points > b.points) ? -1 : 0)
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
    selectPlayer(player) {
      // Emit an event to notify the parent component (App) about the selected player
      console.log("leci", player)
      this.$emit("playerSelect", player);
    },
    fetchPlayers() {
      this.sortedPlayers = this.players;
      console.log("acd", this.sortedPlayers)
      console.log("dsa", this.players)
    }
  },
  created() {
    // Call the method to extract unique team codes when the component is created
    this.fetchPlayers();
    this.extractUniqueTeamCodes();
  },
};
</script>

<style>
.player-card {
  display: flex;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.player-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 20px;
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

.list-scrollable {
  height: 50px;
    
  flex: 1; /* Make this part expand to fill available space */
  overflow-y: scroll;
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
/* Add any other styling you need */
</style>
