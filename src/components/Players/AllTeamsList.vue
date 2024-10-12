<template>
  <div class="row">
      <div class="filter-div col-4 my-1">
        <label class="me-1" for="filter-method">Filter by: </label>
        <br><select id="filter-method" v-model="selectedFilter" @change="filterTeams(selectedFilter)">
          <option value="any">All</option>
          <optgroup label="Region">
              <option v-for="uniqueTeamCode in uniqueLeagues" :key="uniqueTeamCode" :value="uniqueTeamCode">{{ uniqueTeamCode }}</option>
          </optgroup>
        </select>
      </div>
      <div class="sorting-div col-5 my-1">
        <label class="me-1" for="sorting-method">Sort by: </label>
        <br><select id="sorting-method" v-model="selectedSorting" @change="orderTeams(selectedSorting)">
          <option value="points">Points</option>
          <option value="pointsGame">Pts/game</option>
          <option value="pointsGamePrice">Pts/game/$</option>
          <option value="priceAsc">Price ASC</option>
          <option value="priceDesc">Price DESC</option>
          <option value="name">Team name</option>
          <option value="league">League</option>
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
            <th>Name</th>
            <th>Code</th>
            <th>League</th>
            <th>Games</th>
            <th>Pts</th>
            <th>Pts/g</th>
            <th>Pts/g/$</th>
            <th>Price</th>
            <th></th>
        </thead>
        <tbody>
            <tr v-for="team in sortedTeams.filter(
              (t) => t.price > 0 && (!hideInactive || (hideInactive && this.teamsPlayingNextFixture.includes(t.code)))
            )" :key="team.esportsTeamId" :class="{'team-inactive' : !this.teamsPlayingNextFixture.includes(team.code), 'already-owned': this.userTeam.includes(team.slug)}">
                <td><img :src="team.imageUrl" class="player-photo" alt="Player Photo" /></td>
                <!-- <div class="player-info row"> -->
                    
                <td><strong>{{ team.name }}</strong></td>
                <td>{{ team.code }}</td>
                <td>{{ team.league }}</td>
                <td>{{ team.gamesPlayed }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='points'}">{{ team.points.toFixed(0) }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGame'}">{{ (team.points/team.gamesPlayed).toFixed(0) }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGamePrice'}">{{ (team.points/team.gamesPlayed/team.price).toFixed(2) }}</td>
                <td class="text-center" :class="{'higlighted':this.selectedSorting=='priceAsc' || this.selectedSorting=='priceDesc'}">{{ team.price }}</td>
                <td ><button :class="{ 'btn-secondary' : selectedRole != 'team', 'btn-info' : selectedRole == 'team' && this.teamsPlayingNextFixture.includes(team.code)}" class="btn btn-secondary" @click="selectTeam(team)" :disabled="!this.teamsPlayingNextFixture.includes(team.code) || selectedRole != 'team'">+</button></td>
                <!-- </div> -->
            </tr>
        </tbody>
</table>
  </template>

<script>
export default {
    props: {
        userTeam: String,
        teamsPlayingNextFixture: Array,
        selectedRole: String,
        teams: Array
    },
    name: "TeamsList",
  data() {
    return {
      hideInactive: true,
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
      if (option == "pointsGame") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => ((a.points/a.gamesPlayed) < (b.points/b.gamesPlayed)) ? 1 : ((a.points/a.gamesPlayed) > (b.points/b.gamesPlayed)) ? -1 : 0)
      }
      if (option == "points") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => (a.points < b.points) ? 1 : (a.points > b.points) ? -1 : 0)
      }
      if (option == "pointsGamePrice") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => ((a.points/a.gamesPlayed/a.price) < (b.points/b.gamesPlayed/b.price)) ? 1 : ((a.points/a.gamesPlayed/a.price) > (b.points/b.gamesPlayed/b.price)) ? -1 : 0)
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
      this.orderTeams("points");
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

.team-inactive {
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
