<template>
  <div class="player-list-wrapper container">
    <div class="search-bar d-flex align-items-center mb-2">
      <input type="text" class="form-control search-input" v-model="searchQuery" placeholder="Search player" v-on:input="searchPlayers"/>
      <button class="btn btn-outline-secondary filter-button" @click="toggleFilters">
        <i class="fas fa-filter"></i> 
      </button>
    </div>
    <div v-if="showFilters" class="row mb-2">
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
        <div class="sorting-div my-1 justify-content-start" v-if="nextFixture != null">
            <label class="me-1"  for="range">Last </label>
            <select id="range" v-model="selectedForm" @change="rangeChanged(selectedForm)" onhov="as">
              <option v-for="fixtureOrder in Array.from(Array(nextFixture.fixture.order-1).keys())" :key="order" :value="fixtureOrder">{{ fixtureOrder == 0 ? "All" : fixtureOrder }}</option>
              
            </select>
            <label class="mx-1"  for="range"> fixtures form</label>
          </div>
    </div>
    <div class="players-list players-list-container-a d-flex row">
      <table class="table table-hover text-center align-middle">
        <thead>
          <tr>
            <th></th>
            <th></th> <!-- Role icon -->
            <th>Player</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='priceAsc' || this.selectedSorting=='priceDesc'}">Price</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='points'}" >Points</th>
            <th class="text-center">Games</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGame'}">Pts/Game</th>
            <th class="text-center" :class="{'higlighted':this.selectedSorting=='pointsGamePrice'}">Pts/Game/$</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="player in sortedPlayers.filter(
                  (p) => p.price > 0 && (!hideInactive || (hideInactive && this.teamsPlayingNextFixture.includes(p.team.code)))
                )"
                :key="player.esportsPlayerId" 
                :class="{
                  'player-inactive' : !this.teamsPlayingNextFixture.includes(player.team.code), 
                  'already-owned': this.userTeam.includes(player.esportsPlayerId)
                  }"
                  class=" h-auto"
          >

          <td class="action">
            <!-- <button class="btn">
              <i class="fas fa-plus-circle"></i>
            </button> -->
            <button 
              @click="selectPlayer(player)"  
              class=" action-icon" 
              :disabled=" (selectedRole != player.role && selectedRole != 'sub')"
            >
              <i
                :class="[
                  '',
                  !userTeam.includes(player.esportsPlayerId) && (selectedRole == player.role || selectedRole == 'sub')
                  ? 'fas fa-plus-circle text-primary fa-xl'
                  : 'fas fa-plus-circle fa-xl inactive'
                ]"
                
              ></i>
            </button>
            
          </td>
            <!-- Role Icon -->
            <td>
              <img :src="role_images[player.role]" class="player-avatar" />
            </td>

            <!-- Name -->
            <td>
              <strong>{{ player.team.code }} {{ player.summonerName }}</strong>
            </td>

            <!-- Price -->
            <td class="text-start">${{ player.price }}</td>

            <!-- Total Points -->
            <td class="text-center" >{{ player.points.toFixed(1) }} pts</td>
            <td class="text-center">{{ player.gamesPlayed }}</td>

            <!-- Pts/Game -->
            <td class="text-center">
              {{ player.gamesPlayed ? (player.points / player.gamesPlayed).toFixed(2) : '-' }}
            </td>
            <td class="text-center">
              {{ player.gamesPlayed == 0 ? "-" :   (player.points/player.gamesPlayed/player.price).toFixed(2) }}
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
        nextFixture: Object,
        userTeam: Array,
        teamsPlayingNextFixture: Array,
        selectedRole: String,
        players: Array
    },
    name: "PlayersList",
  data() {
    return {
      role_images:{
          top: "https://cdn3.emoji.gg/emojis/7990-lol-role-top.png",
          jungle: "https://cdn3.emoji.gg/emojis/1152-lol-role-jungle.png",
          mid: "https://cdn3.emoji.gg/emojis/6934-lol-role-mid.png",
          bottom: "https://cdn3.emoji.gg/emojis/9366-lol-role-bot.png",
          support: "https://cdn3.emoji.gg/emojis/7990-lol-role-support.png",
          sub: "https://cdn3.emoji.gg/emojis/2724-lol-role-fill.png",
          team: "https://i.imgur.com/bLArMp2.png"
        },
      showFilters: false,
      searchQuery: '',
      hideInactive: false,
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
    rangeChanged(numberOfFixtures) {
      this.$emit("rangeChange", numberOfFixtures);
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    checkIfPlayerIsInTeam(player) {
      return this.userTeam.players.some((p) => p.esportsPlayerId == player.esportsPlayerId);
    },
    searchPlayers() {
      this.sortedPlayers = this.players.filter(p =>
        p.summonerName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.orderPlayers(this.selectedSorting);
    },
    orderPlayers(option) {
      this.sortedPlayers = this.sortedPlayers.filter(p =>
        p.summonerName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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
    selectedRole: {
      handler(newselectedRole, oldselectedRole) {
        // React to prop changes here
        // playerDetails = 
        console.log(newselectedRole, oldselectedRole);
        if(newselectedRole != 'sub' && newselectedRole != '' && newselectedRole != null) {
          this.selectedFilter = newselectedRole;
          this.showFilters = true;
          this.filterPlayers(newselectedRole);
        }
      },
      immediate: true, // This will trigger the handler immediately when the component is created
    },
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


.game-points ::-webkit-scrollbar {
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

</style>
