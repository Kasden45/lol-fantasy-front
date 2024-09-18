<template>
  <div class="fixture-card col-4 mx-2">
    <div class="card-header">
      <h4>{{ fixture.fixture.name }} - {{ this.$func_global.formatDate(fixture.fixture.deadlineDate) }}</h4>
    </div>
    <div class="match-list">
      <div v-for="(time, index) in 
        fixture.matches.map(m => this.$func_global.formatDateOnly(m.startTime)).filter((value, index, self) => self.indexOf(value) === index)" 
        :key="index" class=" row">
        <div>
          <div class="col-12 fixture-headline">
            {{this.$func_global.getDayOfWeek(time)}} {{ time}}
          </div>
        </div>
        <div v-for="(match, index) in fixture.matches.filter(m => this.$func_global.formatDateOnly(m.startTime) == time)" 
          :key="index" 
          class="match-item"
          >
          <div class="col-2">{{ match.team1 != null ? match.team1.code : "TBD"}}</div>
          <div class="col-2"><img v-if="match.team1 != null" :src="match.team1.imageUrl" class="team-photo" alt="Player Photo" /> </div>
          <div class="col-2" v-if="match.team1 != null && match.team1.wins != null && match.team2 != null && match.team2.wins != null">
            {{ match.team1.wins }} - {{ match.team2.wins }}
          </div>
          <div class="col-2" 
            v-if="!((match.team1 != null && match.team1.wins != null) && (match.team2 != null && match.team2.wins != null))"
          >
            {{ this.$func_global.formatTime(match.startTime) }}
          </div>
          <div class="col-2"><img v-if="match.team2 != null" :src="match.team2.imageUrl" class="team-photo" alt="Player Photo" /> </div>
          <div class="col-2">{{ match.team2 != null ? match.team2.code : "TBD" }}</div>
        </div>
      </div>
      
    </div>
  </div>
</template>
  
  <script>
  export default {
    name: "FixtureCard",
    props: {
      fixture: {
        fixture: Object,
        matches: Array,
        required: true,
      },
    },
    data() {
        return {
          selectedGameIndex: 0,
        }
    },
    methods: {
    calculateTotalPoints(pointsDetails) {
      return Object.values(pointsDetails).reduce((total, points) => total + points.points, 0);
    },
    selectGame(index) {
      this.selectedGameIndex = index;
      console.log(this.selectedGame.pointsDetails);
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
    }
  }
};
  </script>
  
<style scoped>
.fixture-card {
  /* border: 1px solid pink; */
  /* padding: 10px; */
  /* margin: 1px; */
  /* width: 30%; */
}

.card-header {
  background-color: VAR(--TEXT-SECONDARY);
  color: white;
  padding: 10px;
  text-align: center;
  border-radius: 10px 10px 0 0;
}

.match-list {
  /* margin-top: 10px; */
  background-color: VAR(--PRIMARY-LIGHTER);
  border-radius: 0 0 10px 10px;         /* Round the edges */
}

.fixture-headline {
  /* padding: 5px 5px; */
  /* margin-top: 10px; */
  color: VAR(--TEXT-SECONDARY);
  padding: 0px;
  background-color: VAR(--TABLE-ROW-MAIN);
}

.match-item {
  padding: 3px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.team-photo {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 20px;
}

</style>