<!-- TeamSelection.vue -->
<template>
  <div class="w-50 mx-auto">
    
    <div class="game-tabs ms-2 justify-content-md-center">
      <div
        v-for="(fixture, index) in tabs"
        :key="fixture.order"
        @click="selectTab(fixture.order, fixture.id)"
        :class="{ active: selectedTabIndex === fixture.order }"
      >
        {{ fixture.title }}
      </div>
    </div>
    <div v-if="'isTotal' in playersSummary">
      <h1>Players stats</h1>
      <div class="stats-tables-row" style="display: flex; flex-wrap: wrap; gap: 16px;">
        <div
          v-for="(stat, idx) in ['kills','deaths','assists','cs','fb','tripleKills','quadraKills','pentaKills','pointsMatch','pointsMatchMoney']"
          :key="stat"
          class="mb-2 stats-table"
          style="flex: 1 1 30%; min-width: 260px; max-width: 32%;"
        >
          <h3 class="mt-1 text-capitalize" style="font-size: 1.1rem;">{{ displayName[stat] }}</h3>
          <table class="table table-sm table-striped table-bordered" style="font-size: 0.85rem;">
            <thead>
              <tr>
                <th>Player</th>
                <th>Role</th>
                <th>Team</th>
                <th>Price</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in playersSummary.players[stat]?.filter(player => player.player.matchesPlayed > 0).slice(0,10)" :key="entry.player?.esportsPlayerId || entry.esportsPlayerId">
                <td>
                  {{ entry.player?.summonerName || 'Unknown' }}
                </td>
                <td>
                  {{ entry.player?.role || 'Unknown' }}
                </td>
                <td>
                  <img :src="entry.player?.team?.imageUrl" alt="team" width="18" height="18" style="border-radius:50%;margin-right:4px;">
                  {{ entry.player?.team?.code || 'Unknown' }}
                </td>
                <td>${{ entry.player?.price.toFixed(1) }}</td>
                <td>{{ formatNumber(stat, entry.value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
        <!-- Team Stats -->
      <div v-if="'isTotal' in teamsSummary">
        <h1>Teams stats</h1>
        <div class="stats-tables-row" style="display: flex; flex-wrap: wrap; gap: 16px;">
          <div
            v-for="(stat, idx) in ['dragons', 'nashors', 'towers',
              'fb', 'voidgrubs', 'win', 'fastWin',
              'pointsMatch', 'pointsMatchMoney']"
            :key="stat"
            class="mb-4 stats-table"
            style="flex: 1 1 30%; min-width: 260px; max-width: 32%;"
          >
            <h3 class="mt-1 text-capitalize" style="font-size: 1.1rem;">{{ displayTeamName[stat] }}</h3>
            <table class="table table-sm table-striped table-bordered" style="font-size: 0.85rem;">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>League</th>
                  <th>Price</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in teamsSummary.teams[stat]?.filter(team => team.team.matchesPlayed > 0).slice(0,10)" :key="entry.team?.slug || entry.slug">
                  <td>
                    <img :src="entry.team?.imageUrl" alt="player" width="24" height="24" style="border-radius:50%;margin-right:6px;">
                    {{ entry.team?.code || 'Unknown' }}
                  </td>
                  <td>
                    <img :src="this.$func_global.leagues_icons[entry.team?.league]" alt="team" width="18" height="18" style="border-radius:50%;margin-right:4px;">
                    {{ entry.team?.league || 'Unknown' }}
                  </td>
                  <td>${{ entry.team?.price.toFixed(1) }}</td>
                  <td>{{ formatNumberTeam(stat, entry.value) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        selectedTabIndex: 0,
        playersSummary: {},
        teamsSummary: {},
        tabs: [],
        matchesByFixture: [],
        displayName: {
          'kills': 'Kills/game',
          'deaths': 'Deaths/game',
          'assists': 'Assists/game',
          'cs': 'CS/game',
          'fb': 'First Bloods',
          'tripleKills': 'Triple Kills',
          'quadraKills': 'Quadra Kills',
          'pentaKills': 'Penta Kills',
          'pointsMatch': 'Points/Match',
          'pointsMatchMoney': 'Points/Match/$'
        },
        displayTeamName: {
          'voidgrubs': 'Voidgrubs/game',
          'fastWin': 'Fast Wins',
          'win': 'Wins %',
          'fb': 'First Bloods %',
          'dragons': 'Dragons/game',
          'nashors': 'Nashors/game',
          'towers': 'Towers/game',
          'pointsMatch': 'Points/Match',
          'pointsMatchMoney': 'Points/Match/$'
        },
      };
    },
    methods: {
      formatNumber(stat, value) {
        if (stat === 'fb' || stat === 'tripleKills' || stat === 'quadraKills' || stat === 'pentaKills') {
          return value;
        }
        
        return value.toFixed(2);
      },
      formatNumberTeam(stat, value) {
        if (stat === 'win' || stat === 'fb') {
          return (value * 100).toFixed(2) + '%'
        }
        if (stat === 'fastWin') {
          return value;
        }
        return value.toFixed(2);
      },
      selectTab(index, f){
        var fixture = f != 0 ? f : null;
        this.selectedTabIndex = index;
        console.log(this.selectedTabIndex);
        this.currentFixture = this.newRulesData.find((element) => element.fixture.id == fixture);
        this.getFixturePlayerSummaryStats(this.currentFixture == null ? null : this.currentFixture.fixture.id);
        this.getFixtureTeamSummaryStats(this.currentFixture == null ? null : this.currentFixture.fixture.id);
      },
      getCurrentFixture() {
            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixture`

            this.axios.get(url).then((response) => {
                this.$store.commit('setFixtureId', response.data);
                console.log("Current fixture: ", this.$store.getters.getFixtureId)
                
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
        async fetchRulesData() {
      
          try {
            const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/rules`);
            this.newRulesData = response.data;
            this.tabs = response.data.map(function(fix) {
              var newFix = {
                    id: fix.fixture.id,
                    title: fix.fixture.name,
                    order: fix.fixture.order,
                  } 
                  return newFix;
                  
                }).sort((a, b) => a.order - b.order);
                console.log('tabs', this.tabs);
            this.tabs.unshift({
              id: 0,
              title: 'Total',
              order: -1
            });      
            this.selectTab(this.tabs.find((element) => element.id == this.$store.getters.getFixtureId).order,this.$store.getters.getFixtureId);
            console.log("Fixture ID:", this.$store.getters.getFixtureId);
            this.getFixturePlayerSummaryStats(this.$store.getters.getFixtureId);
            this.getFixtureTeamSummaryStats(this.$store.getters.getFixtureId);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
      },
      getFixtures() {
            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`

            this.axios.get(url).then((response) => {
            this.matchesByFixture = response.data.fixturesWithMatches.sort((a, b) => a.fixture.order - b.fixture.order);
            this.selectTab(this.tabs.find((element) => element.id == this.$store.getters.getFixtureId).order,this.$store.getters.getFixtureId);
            this.getFixturePlayerSummaryStats(this.$store.getters.getFixtureId);
            this.getFixtureTeamSummaryStats(this.$store.getters.getFixtureId);
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
      getTotalSummaryStats(){
        this.axios.get(`${this.apiURL}Stats/${this.$store.getters.getCurrentTournamentId}/summary`)
        .then((response) => {
          console.log("Summary:", response.data);
          this.playersSummary = response.data;
        })
        .catch((error) => {
          console.error("Error fetching stats:", error);
        });
      },
      getFixturePlayerSummaryStats(fixtureId) {
        console.log("Fetch stats ");

        this.axios.get(`${this.apiURL}Stats/${this.$store.getters.getCurrentTournamentId}/summary/players${fixtureId == null ? '' : '/' + fixtureId}`)
        .then((response) => {
          console.log("Summary:", response.data);
          this.playersSummary = response.data;
        })
        .catch((error) => {
          console.error("Error fetching stats:", error);
        });
      },
      getFixtureTeamSummaryStats(fixtureId) {
        console.log("Fetch stats ");

        this.axios.get(`${this.apiURL}Stats/${this.$store.getters.getCurrentTournamentId}/summary/teams${fixtureId == null ? '' : '/'+fixtureId}`)
        .then((response) => {
          console.log("Summary:", response.data);
          this.teamsSummary = response.data;
        })
        .catch((error) => {
          console.error("Error fetching stats:", error);
        });
      }
    },
    mounted() {
    // Fetch team players when the component is mounted
    this.getCurrentFixture();
    // this.getFixtures();
    this.fetchRulesData();
  },
  };
  </script>

<style scoped>
/* Add custom styles for team and player cards as needed */
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

.summoners-rift {
  position: relative;
  width: 960px; 
  height: 720px;
  background-image: url('https://2.bp.blogspot.com/--A1wNZhS868/U7L4xKhbQTI/AAAAAAAAS04/rfzak1JCZFY/s1600/srdb3-1.jpg'); /* Replace with your Summoner's Rift map image */
  background-size: cover;
  image-rendering: -webkit-optimize-contrast;
}

.player-card {
  /* background-color: #fde9a8d0; */
  background-color: #faf3dd75;
  position: absolute;
  transform: translate(-50%, -50%);
}

.player-image {
  width: 100px; /* Adjust the size of the player image */
  height: 85px;
  border-radius: 50%;
}

.player-info {
  text-align: center;
}

.player-name {
  font-weight: bold;
  color: white;
}

.player-points {
  font-weight: bold;
  color: white;
}

.player-role {
  font-style: italic;
  color: white;
  text-transform: capitalize;
}
/* Alternate row striping for tables */
.table-striped tbody tr:nth-of-type(odd) td{
  background-color: var(--TABLE-ROW-SECONDARY) !important;
}
.table-striped tbody tr:nth-of-type(1) td{
  background-color: var(--GOLDEN-CAPTAIN) !important;
}
.table-striped tbody tr:nth-of-type(even) td{
  background-color: var(--TABLE-ROW-MAIN) !important;
}
</style>