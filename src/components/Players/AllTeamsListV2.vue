<template>
  <div class="player-list-wrapper container">
    <div class="search-bar d-flex align-items-center mb-2">
      <input type="text" class="form-control search-input" v-model="searchQuery" placeholder="Search team" v-on:input="searchTeams"/>
      <button class="btn btn-outline-secondary filter-button" @click="toggleFilters">
        <i class="fas fa-filter"></i> 
      </button>
    </div>
    <div v-if="showFilters" class="row mb-2">
        <div class="row"> 
          <div class="filter-div  col-4 my-1">
            <label class="me-1" for="filter-method">Filter by:</label>
            <br><select id="filter-method" v-model="selectedFilter" @change="filterTeams(selectedFilter)">
              <option value="any">All</option>
              <optgroup label="Region">
                  <option v-for="uniqueTeamCode in uniqueLeagues" :key="uniqueTeamCode" :value="uniqueTeamCode">{{ uniqueTeamCode }}</option>
              </optgroup>
            </select>
          </div>
          <div class="sorting-div col-4 my-1">
            <label class="me-1"  for="sorting-method">Sort by: </label>
            <br><select id="sorting-method" v-model="selectedSorting" @change="orderTeams(selectedSorting)">
              <option value="points">Points</option>
              <option value="pointsGame">Pts/match</option>
              <option value="pointsGamePrice">Pts/match/$</option>
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
        <div class="sorting-div my-1 justify-content-start" v-if="currentFixture != null && currentFixture.fixture != null">
            <label class="me-1"  for="range">Last </label>
            <select id="range" v-model="selectedForm" @change="rangeChanged(selectedForm)" onhov="as">
              <option v-for="fixtureOrder in Array.from(Array(currentFixture.fixture.order).keys())" :key="order" :value="fixtureOrder">{{ fixtureOrder == 0 ? "All" : fixtureOrder }}</option>
              
            </select>
            <label class="mx-1"  for="range"> fixtures form</label>
          </div>
    </div>
    <div class="players-list players-list-container-a d-flex row">
      <table class="table table-striped table-hover text-center align-middle">
        <thead>
          <tr>
            <th></th>
            <th></th> <!-- Role icon -->
            <th >Team</th>
            <!-- <th >Code</th> -->
            <th >League</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='priceAsc' || this.selectedSorting=='priceDesc'}">Price</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='points'}" >Points</th>
            <th class="text-center">Matches</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGame'}">Pts/Match</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGamePrice'}">Pts/Match/$</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="team in sortedTeams.filter(
                  (p) => p.price > 0 && (!hideInactive || (hideInactive && this.teamsPlayingNextFixture.includes(p.code)))
                )"
                :key="team.esportsTeamId" 
                :class="{
                  'team-inactive' : !this.teamsPlayingNextFixture.includes(team.code), 
                  'already-owned': this.userTeam.includes(team.slug)
                  }"
                  class=" h-auto"
          >

          <td class="action">
            <!-- <button class="btn">
              <i class="fas fa-plus-circle"></i>
            </button> -->
            <button 
              @click="selectTeam(team)"  
              class=" action-icon" 
              :disabled="!this.teamsPlayingNextFixture.includes(team.code) || (selectedRole != 'team')"
            >
              <i
                :class="[
                  '',
                  this.teamsPlayingNextFixture.includes(team.code) && !userTeam.includes(team.slug) && (selectedRole == 'team' )
                  ? 'fas fa-plus-circle text-primary fa-xl'
                  : 'fas fa-plus-circle fa-xl inactive'
                ]"
                
              ></i>
            </button>
            
          </td>
            <!-- Role Icon -->
            <td>
              <img :src="team.imageUrl" class="player-avatar" />
            </td>

            <!-- Name -->
            <td>
              <strong class="team-name">{{ team.name }}</strong>
            </td>
            <!-- <td>
              <strong>{{ team.code }}</strong>
            </td> -->
            <td>
              <strong>{{ team.league }}</strong>
            </td>

            <!-- Price -->
            <td class="text-start">${{ team.price }}</td>

            <!-- Total Points -->
            <td class="text-center" >{{ team.points.toFixed(1) }} pts</td>
            <td class="text-center">{{ team.matchesPlayed }}</td>

            <!-- Pts/Game -->
            <td class="text-center">
              {{ team.matchesPlayed ? (team.points / team.matchesPlayed).toFixed(2) : '-' }}
            </td>
            <td class="text-center">
              {{ team.matchesPlayed == 0 ? "-" :   (team.points/team.matchesPlayed/team.price).toFixed(2) }}
            </td>

            <!-- Action -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </template>

<script>
export default {
    props: {
      currentFixture: Object,
      nextFixture: Object,
      userTeam: String,
      teamsPlayingNextFixture: Array,
      selectedRole: String,
      teams: Array
    },
    name: "TeamsList",
  data() {
    return {
      showFilters: true,
      searchQuery: '',
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
    rangeChanged(numberOfFixtures) {
      this.$emit("rangeChange", numberOfFixtures);
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    searchTeams() {
      console.log('what')
      this.sortedTeams = this.teams.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.orderTeams(this.selectedSorting);
    },
    orderTeams(option) {
      if (option == "pointsGame") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => (a.matchesPlayed == 0 && b.matchesPlayed == 0) ? 0 : (a.matchesPlayed == 0 || (a.points/a.matchesPlayed) < (b.points/b.matchesPlayed)) ? 1 : b.matchesPlayed == 0 || ((a.points/a.matchesPlayed) > (b.points/b.matchesPlayed)) ? -1 : 0)
      }
      if (option == "points") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => (a.points < b.points) ? 1 : (a.points > b.points) ? -1 : 0)
      }
      if (option == "pointsGamePrice") {
        this.sortedTeams = this.sortedTeams.sort((a,b) => (a.matchesPlayed == 0 && b.matchesPlayed == 0) ? 0 : (a.matchesPlayed == 0 || (a.points/a.matchesPlayed/a.price) < (b.points/b.matchesPlayed/b.price)) ? 1 : b.matchesPlayed == 0 || ((a.points/a.matchesPlayed/a.price) > (b.points/b.matchesPlayed/b.price)) ? -1 : 0)
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
    changeRange(numberOfFixtures) {
      // Emit an event to notify the parent component (App) about the selected player
      this.$emit("rangeChange", numberOfFixtures);
    },
    fetchTeams() {
      this.sortedTeams = this.teams;
      this.orderTeams("points");
      console.log("acd", this.sortedTeams)
      console.log("dsa teams", this.teams)
    }
  },
  created() {
    // Call the method to extract unique team codes when the component is created
    this.fetchTeams();
    this.extractUniqueLeagues();
  },
  watch: {
    teams: {
      // the callback will be called immediately after the start of the observation
      immediate: true, 
      handler (val, oldVal) {
        this.fetchTeams();
        this.filterTeams(this.selectedFilter);
        this.orderTeams(this.selectedSorting);
        // do your stuff
      }
    }
  }
};
</script>

<style scoped>
td {
  text-wrap: nowrap;
}
.inactive {
  opacity: 0.5;
  color: var(--GREY-DARK);
  cursor: auto !important;
}
.players-list-container-a {
  background: #efefef;
  max-height: 50vh;
  min-width: 100%;
  overflow-y: scroll;
  overflow-x: scroll;
  padding-left: 0%;
  padding-right: 0%;
  border: 1px solid #ddd;
}
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
    height: fit-content !important;
}

tr {
    vertical-align: middle;
    height: fit-content !important;
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
    
    /* padding: 1px 1px 1px 1px ; */
}

.player-inactive {
  --bs-table-bg: #f85a6746 !important;
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
.player-list-wrapper {
  padding: 1rem;
  border-radius: 10px;
  min-width: 100%;
  max-height: 70vh;
}

.players-list {
  max-width: none !important;
  width: auto !important;
}
.search-bar {
  gap: 0.5rem;
  /* margin-bottom: 1rem; */
}

.search-input {
  flex-grow: 1;
  border-radius: 20px;
  padding: 0.5rem 1rem;
}

.filter-button {
  border-radius: 20px;
  font-weight: bold;
  color: #555;
  border-color: #ccc;
}

.player-entry {
  background: white;
  border-radius: 10px;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.player-avatar {
  width: 2rem;
  /* height: 10%; */
  /* border-radius: 50%; */
  object-fit: cover;
}

.player-details {
  flex-grow: 1;
}

.name-row {
  display: flex;
  align-items: center;
  /* gap: 0.5rem; */
}

.flag-icon {
  width: 18px;
  height: 12px;
  object-fit: contain;
  border-radius: 2px;
}

.player-stats {
  /* width: 70px; */
  text-align: right;
  font-weight: bold;
}
button.action-icon {
  all: unset;
  cursor: pointer;
}
.action-icon {
  /* font-size: 20px; */
  font-weight: bold;
  cursor: pointer;
}

.filters-panel {
  background-color: #f8f8f8;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 0px 8px rgba(0,0,0,0.05);
}

.filters-btn {
  background-color: white;
  border: 1px solid #ccc;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
.player-row {
  height: 1px !important;
}
/* Add any other styling you need */
</style>
