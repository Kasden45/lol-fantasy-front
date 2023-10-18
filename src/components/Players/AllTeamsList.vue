<template>
    <div class="filter-div">
      <label for="filter-method">Filter by: </label>
      <select id="filter-method" v-model="selectedFilter" @change="filterTeams(selectedFilter)">
        <option value="any">All</option>
        <optgroup label="Region">
            <option v-for="uniqueTeamCode in uniqueLeagues" :key="uniqueTeamCode" :value="uniqueTeamCode">{{ uniqueTeamCode }}</option>
        </optgroup>
      </select>
    </div>
    <div class="sorting-div">
      <label for="sorting-method">Sort by: </label>
      <select id="sorting-method" v-model="selectedSorting" @change="orderTeams(selectedSorting)">
        <option value="points">Points</option>
        <option value="priceAsc">Price ASC</option>
        <option value="priceDesc">Price DESC</option>
        <option value="name">Team name</option>
        <option value="league">League</option>
      </select>
    </div>
    <table class="table table-striped list-scrollable">
        <thead>
            <th></th>
            <th>Name</th>
            <th>Code</th>
            <th>League</th>
            <th>Points</th>
            <th>Price</th>
            <th></th>
        </thead>
        <tbody>
            <tr v-for="team in sortedTeams" :key="team.esportsTeamId" >
                <td><img :src="team.imageUrl" class="player-photo" alt="Player Photo" /></td>
                <!-- <div class="player-info row"> -->
                    
                <td><strong>{{ team.name }}</strong></td>
                <td>{{ team.code }}</td>
                <td>{{ team.league }}</td>
                <td>{{ team.points }}</td>
                <td>{{ team.price }}</td>
                <td ><button class="btn-info" @click="selectTeam(team)" :disabled="selectedRole != 'team'">+</button></td>
                <!-- </div> -->
            </tr>
        </tbody>
</table>
  </template>

<script>
export default {
    props: {
        selectedRole: String,
        teams: Array
    },
    name: "TeamsList",
  data() {
    return {
      selectedSorting: 'points',
      selectedFilter: 'any',
        sorting: "",
        sortedTeams:[],
        uniqueLeagues: [], // Array to store unique team codes
      // players: []
    };
  },
  methods: {
    orderTeams(option) {
      if (option == "points") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => (a.points < b.points) ? 1 : (a.points > b.points) ? -1 : 0)
      }
      if (option == "name") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        })
      }
      if (option == "priceAsc") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => (a.price > b.price) ? 1 : (a.price < b.price) ? -1 : 0)
      }
      if (option == "priceDesc") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => (a.price < b.price) ? 1 : (a.price > b.price) ? -1 : 0)
      }
      if (option == "league") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => {
        if (a.league.toLowerCase() === b.league.toLowerCase()) return 0;
        return a.league.toLowerCase() > b.league.toLowerCase() ? 1 : -1;
        })
      }
    },
    extractUniqueLeagues() {
      // Extract unique team codes from the players array
      this.uniqueLeagues = Array.from(new Set(this.teams.map((team) => team.league)));
    },
    filterTeams(option) {
        console.log(option);
        
        this.sortedTeams = this.teams.filter((t) => t.league == option || option =='any')
        console.log(this.sortedTeams)
        
      this.orderTeams(this.selectedSorting);
    },
    selectTeam(team) {
      // Emit an event to notify the parent component (App) about the selected player
      console.log("leci", team)
      this.$emit("teamSelect", team);
    },
    fetchTeams() {
      this.sortedTeams = this.teams;
      console.log("acd", this.sortedTeams)
      console.log("dsa", this.teams)
    }
  },
  created() {
    // Call the method to extract unique team codes when the component is created
    this.fetchTeams();
    this.extractUniqueLeagues();
  },
};
</script>

<style scoped>
.player-card {
  display: flex;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.player-photo {
    background-color: bisque;
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
