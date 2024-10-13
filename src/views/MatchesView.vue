<template>
  <div class="button-container m-auto row" v-if="this.oneFixtureId == null">
    <div class="col-6 d-flex justify-self-start">
      <button class="btn btn-info btn-purple" @click="scrollLeft">&lt;</button>
    </div>
    <div class="col-6 d-flex justify-content-end sticky-end">
      <button class="btn btn-info btn-purple" @click="scrollRight">></button>
    </div>
    </div>
  <div class="fixtures-container m-auto">
  <div class="fixtures" ref="fixturesContainer">
        <FixtureCard
          v-for="fixture in this.matchesByFixture"
          :key="fixture.id"
          :fixture="fixture"
        />
    </div>
  </div>
</template>

<script>
import FixtureCard from '@/components/Matches/FixtureCard.vue';  
export default {
  props:{
    oneFixtureId: Number
  },
name: 'MatchesView',
  components: {
    FixtureCard
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
  updated() {
    // this.getFixtures();
    this.positionScroll();
  },
  methods: {
    scrollRight() {
      const cardWidth = this.$refs.fixturesContainer.children[0].offsetWidth; // get width of the first card
      const scrollAmount = cardWidth; // scroll width for 4 cards
      this.$refs.fixturesContainer.scrollLeft += scrollAmount; // scroll right
    },
    scrollLeft() {
      const cardWidth = this.$refs.fixturesContainer.children[0].offsetWidth; // get width of the first card
      const scrollAmount = cardWidth; // scroll width for 4 cards
      this.$refs.fixturesContainer.scrollLeft -= scrollAmount; // scroll left
    },
    positionScroll() {
      var continueCheck = true;
      this.matchesByFixture.forEach(element => {
        console.log(new Date(element.fixture.deadlineDate), "vs", Date.now());
        if(continueCheck && element.fixture.fixtureId != this.$store.getters.getFixtureId) {
          console.log("scrolling right");
          console.log(element.fixture.fixtureId);
          console.log(this.$store.getters.getFixtureId);
          this.scrollRight();
        } else {
          console.log("not scrolling right");
          continueCheck = false;
        }
      }); 
    },
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
                this.matchesByFixture = response.data.fixturesWithMatches.sort((a, b) => a.fixture.order - b.fixture.order);
              }
              else{
                this.matchesByFixture = response.data.fixturesWithMatches.filter((f) => f.fixture.fixtureId == this.oneFixtureId)
              }
              this.positionScroll();
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
.fixtures-container {
  width: 80vw;
  padding: 20px;
  /* display: flex; */
}

.button-container {
  width: 80vw;
  padding-left: 50px;
  padding-right: 0px;
}

.fixtures {
  display: flex;
  justify-content: space-between;
  width: 80vw;
  overflow-x: auto;
  white-space: nowrap;
  /* background-color: rgb(252, 240, 255) */
  /* border: 1px solid #ddd; */
}

::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background-color: var(--DARK-YELLOW);
}

.btn-purple {
  background-color: var(--PRIMARY-LIGHTER);
  font-weight: 800;
  color: white;
  border: none;
}
</style>
