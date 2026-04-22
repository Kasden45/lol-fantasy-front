<template>
  <div class="fixture-card">
    <div class="card-header">
      <div class="header-top">
        <div>
          <p class="fixture-eyebrow">Fixture</p>
          <h4 class="fixture-title">{{ fixture.fixture.name }}</h4>
        </div>
        <span class="deadline-badge">
          {{ $func_global.formatDate(fixture.fixture.deadlineDate) }}
        </span>
      </div>
      <button
        v-if="$store.getters.getProfileId == 5"
        class="update-btn"
        @click="calculatePoints(fixture.fixture.fixtureId)"
      >
        Update points
      </button>
    </div>

    <div class="match-list">
      <div
        v-for="(time, index) in fixture.matches
          .map((m) => $func_global.formatDateOnly(m.startTime))
          .filter((value, index, self) => self.indexOf(value) === index)"
        :key="index"
      >
        <div class="day-header">
          {{ $func_global.getDayOfWeek(time) }} {{ time }}
        </div>

        <div
          v-for="(match, mIndex) in fixture.matches.filter(
            (m) => $func_global.formatDateOnly(m.startTime) == time,
          )"
          :key="mIndex"
          class="match-item"
          :class="{ 'match-live': isInPlay(match) }"
        >
          <!-- Team 1 -->
          <div class="team-side">
            <img
              v-if="match.team1"
              :src="match.team1.imageUrl"
              class="team-logo"
            />
            <span class="team-code">{{
              match.team1 ? match.team1.code : "TBD"
            }}</span>
          </div>

          <!-- Score / Time -->
          <div class="match-center">
            <template
              v-if="match.team1?.wins != null && match.team2?.wins != null"
            >
              <router-link
                :to="{ name: 'MatchPointsView', params: { matchId: match.id } }"
                class="score"
              >
                {{ match.team1.wins }} - {{ match.team2.wins }}
              </router-link>
              <span v-if="isInPlay(match)" class="live-dot">🔴</span>
            </template>
            <template v-else>
              <span class="bo-label">Bo{{ match.maxGames }}</span>
              <span class="match-time">{{
                $func_global.formatTime(match.startTime)
              }}</span>
              <span v-if="isInPlay(match)" class="live-dot">🔴</span>
            </template>
          </div>

          <!-- Team 2 -->
          <div class="team-side team-side-right">
            <span class="team-code">{{
              match.team2 ? match.team2.code : "TBD"
            }}</span>
            <img
              v-if="match.team2"
              :src="match.team2.imageUrl"
              class="team-logo"
            />
          </div>
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
    };
  },
  methods: {
    isInPlay(match, addHours) {
      var date = Date.now();
      if (addHours != null) date += 3600 * 1000 * addHours;
      return (
        date - 3600 * 1000 * match.maxGames < new Date(match.startTime) &&
        new Date(match.startTime) < date
      );
    },
    calculateTotalPoints(pointsDetails) {
      return Object.values(pointsDetails).reduce(
        (total, points) => total + points.points,
        0,
      );
    },
    selectGame(index) {
      this.selectedGameIndex = index;
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
    calculatePoints(fixtureId) {
      const url = `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/update_points/fixture/${fixtureId}`;

      this.axios
        .get(url)
        .then((response) => {
          alert(`Points updated successfully: fixture ${fixtureId}`);
        })
        .catch((error) => {
        });
    },
  },
};
</script>

<style scoped>
.fixture-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--GREY-DARKER);
  background: var(--BACKGROUND-LIGHTER);
}

.card-header {
  background: var(--SECONDARY);
  padding: 16px 20px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.fixture-eyebrow {
  margin: 0 0 2px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
}

.fixture-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.deadline-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--PRIMARY-LIGHTER);
  background: var(--BACKGROUND-DARK);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 6px;
  padding: 4px 10px;
  white-space: nowrap;
}

.update-btn {
  margin-top: 12px;
  padding: 6px 14px;
  background: var(--PRIMARY);
  border: none;
  border-radius: 6px;
  color: var(--GREY-LIGHT);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.update-btn:hover {
  opacity: 0.85;
}

.match-list {
  padding: 8px 0;
}

.day-header {
  padding: 6px 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
  background: var(--BACKGROUND-DARK);
  border-top: 1px solid var(--GREY-DARKER);
  border-bottom: 1px solid var(--GREY-DARKER);
}

.match-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 20px;
  border-bottom: 1px solid var(--GREY-DARKER);
  transition: background 0.15s;
}

.match-item:last-child {
  border-bottom: none;
}

.match-item:hover {
  background: var(--SECONDARY);
}

.match-live {
  background: rgba(244, 67, 54, 0.08);
}

.team-side {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 80px;
}

.team-side-right {
  justify-content: flex-end;
}

.team-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  border-radius: 50%;
}

.team-code {
  font-size: 11px;
  font-weight: 700;
  color: var(--GREY);
}

.match-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.score {
  font-size: 13px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  text-decoration: none;
}

.bo-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--GREY-DARKER);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.match-time {
  font-size: 12px;
  font-weight: 600;
  color: var(--GREY);
}

.live-dot {
  font-size: 10px;
}
</style>
