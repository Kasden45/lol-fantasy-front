<template>
    <div v-for="fixture in this.matchesByFixture" :key="fixture.id" class="w-75 m-auto matches-back">
        
        <div class="row justify-content-md-center m-auto fixture-header">
            <h2>{{ fixture.fixture.name }}</h2>
            <h2>Deadline: {{ this.$func_global.formatDate(fixture.fixture.deadlineDate) }}</h2>
        </div>
        
        <div class="row d-flex align-items-center justify-content-md-center m-auto" v-for="match in fixture.matches" :key="match.id">
            <div class="col-md-2">
                {{ match.team1 != null ? match.team1.name : "TBD" }}
                <!-- {{ match.team1 != null ? match.team1.code : "TBD" }} -->
            </div>
            <div class="col-md-1" >
                <img v-if="match.team1 != null" :src="match.team1.imageUrl" class="player-photo" alt="Player Photo" /> 
            </div>
            <div class="col-md-1">
                {{ match.team1 != null ? match.team1.wins : "0" }}
            </div>
            <div class="col-md-2">
                Bo{{ match.maxGames }}
                <h5>{{ this.$func_global.formatDate(match.startTime) }}</h5>
            </div>
            <div class="col-md-1 d-flex align-items-center">
                {{ match.team2 != null ? match.team2.wins : "0" }}
            </div>
            <div class="col-md-1" >
                <img v-if="match.team2 != null" :src="match.team2.imageUrl" class="player-photo" alt="Player Photo" /> 
            </div>
            <div class="col-md-2 d-flex align-items-center">
                <!-- {{ match.team2 != null ? match.team2.code : "TBD" }} -->
                {{ match.team2 != null ? match.team2.name : "TBD" }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props:{
    oneFixtureId: Number
  },
name: 'MatchesView',
  components: {
    
  },  
  data() {
    return {
      matchesByFixture: [
        // Your matches data here
      ],
    };
  },
  mounted() {
    // Fetch data when the component is mounted
    // this.fetchRulesData();
    this.getCurrentFixture();
    this.getFixtures();
    // this.profile = 
    console.log(this.profile)
  },
  methods: {
    formatDate(inputDate) {
    // Create a Date object from the input string
        const date = new Date(inputDate);
        
        // Get the individual date and time components
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1; // Months are zero-based
        const year = date.getUTCFullYear() % 100; // Get the last two digits of the year
        const hours = date.getHours();
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
    parseDate (datetime) {
       var jsDate = new Date(datetime);
       return `${jsDate.getDay()}-${jsDate.getUTCMonth()}-${jsDate.getUTCFullYear()} ${jsDate.getUTCHours()}:${jsDate.getUTCMinutes()}`
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
        getFixtures() {
            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`

            this.axios.get(url).then((response) => {
              if(this.oneFixtureId == null) {
                this.matchesByFixture = response.data.fixturesWithMatches;
              }
              else{
                this.matchesByFixture = response.data.fixturesWithMatches.filter((f) => f.fixture.fixtureId == this.oneFixtureId)
              }
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
  },
  computed: {
    profile() {
    return this.$store.getters.getProfileId;
    }
  },
};
</script>

<style scoped>
.player-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 20px;
}

.matches-back {
    background-color: var(--PRIMARY-LIGHTER);
}
</style>
