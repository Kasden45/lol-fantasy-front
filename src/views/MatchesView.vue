<template>
  <div class="matches-back">
    <button
      v-if="$store.getters.getProfileId == 5"
      class="admin-btn"
      @click="fetchMatches()"
    >
      Fetch matches
    </button>

    <div class="fixtures-wrapper" v-if="oneFixtureId == null">
      <button class="scroll-btn" @click="scrollLeft">‹</button>

      <div class="fixtures-container">
        <div class="fixtures" ref="fixturesContainer">
          <FixtureCard
            v-for="fixture in matchesByFixture"
            :key="fixture.id"
            :fixture="fixture"
          />
        </div>
      </div>

      <button class="scroll-btn" @click="scrollRight">›</button>
    </div>

    <div v-else class="fixtures-single">
      <FixtureCard
        v-for="fixture in matchesByFixture"
        :key="fixture.id"
        :fixture="fixture"
      />
    </div>
  </div>
</template>

<script>
import FixtureCard from "@/components/Matches/FixtureCard.vue";
export default {
  props: {
    oneFixtureId: Number,
  },
  name: "MatchesView",
  components: {
    FixtureCard,
  },
  data() {
    return {
      fixtureId: null,
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
      this.matchesByFixture.forEach((element) => {
        if (
          continueCheck &&
          element.fixture.fixtureId != this.$store.getters.getFixtureId
        ) {
          this.scrollRight();
        } else {
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
    parseDate(datetime) {
      var jsDate = new Date(datetime);
      return `${jsDate.getDay()}-${jsDate.getUTCMonth()}-${jsDate.getUTCFullYear()} ${jsDate.getUTCHours()}:${jsDate.getUTCMinutes()}`;
    },
    getCurrentFixture() {
      const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixture`;

      this.axios
        .get(url)
        .then((response) => {
          this.$store.commit("setFixtureId", response.data);

          // this.$router.push({name: 'LeaguesView'})
        })
        .catch((error) => {
        });
    },
    getFixtures() {
      const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`;

      this.axios
        .get(url)
        .then((response) => {
          if (this.oneFixtureId == null) {
            this.matchesByFixture = response.data.fixturesWithMatches.sort(
              (a, b) => a.fixture.order - b.fixture.order,
            );
          } else {
            this.matchesByFixture = response.data.fixturesWithMatches.filter(
              (f) => f.fixture.fixtureId == this.oneFixtureId,
            );
          }
          this.positionScroll();
          // this.$router.push({name: 'LeaguesView'})
        })
        .catch((error) => {
        });
    },
    fetchMatches() {
      const url = `${this.apiURL}Config/${this.$store.getters.getCurrentTournamentId}/fetchMatches`;

      this.axios
        .post(url)
        .then((response) => {
          this.$router.push({ name: "MatchesView" });
        })
        .catch((error) => {
        });
    },
  },
  computed: {
    profile() {
      return this.$store.getters.getProfileId;
    },
  },
};
</script>

<style scoped>
.matches-back {
  background-color: var(--BACKGROUND-DARK);
  min-height: 100vh;
  padding: 24px;
}

.admin-btn {
  margin-bottom: 16px;
  padding: 8px 16px;
  background: var(--PRIMARY);
  border: none;
  border-radius: 8px;
  color: var(--GREY-LIGHT);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.admin-btn:hover {
  opacity: 0.85;
}

.fixtures-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 90vw;
  margin: 0 auto;
}

.fixtures-container {
  flex: 1;
  overflow: hidden;
}

.fixtures {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 12px;
  scrollbar-width: thin;
  scrollbar-color: var(--PRIMARY-DARKER) var(--SECONDARY);
}

.fixtures::-webkit-scrollbar {
  height: 6px;
}

.fixtures::-webkit-scrollbar-track {
  background: var(--SECONDARY);
  border-radius: 4px;
}

.fixtures::-webkit-scrollbar-thumb {
  background: var(--PRIMARY-DARKER);
  border-radius: 4px;
}

/* Make each fixture card a fixed width so scrolling works predictably */
.fixtures > :deep(.fixture-card) {
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;
  white-space: normal;
}

.scroll-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  margin-top: 16px;
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 8px;
  color: var(--PRIMARY-LIGHTER);
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-btn:hover {
  border-color: var(--PRIMARY);
  color: var(--PRIMARY);
}

.fixtures-single {
  max-width: 400px;
  margin: 0 auto;
}
</style>
