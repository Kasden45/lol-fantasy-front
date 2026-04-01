<template>
  <div class="stats-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-accent" />
      <div>
        <p class="eyebrow">LCK Fantasy</p>
        <h1 class="page-title">Statistics</h1>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-wrapper">
      <div class="tabs">
        <div
          v-for="fixture in tabs"
          :key="fixture.order"
          class="tab"
          :class="{ active: selectedTabIndex === fixture.order }"
          @click="selectTab(fixture.order, fixture.id)"
        >
          {{ fixture.title }}
        </div>
      </div>
    </div>

    <!-- Player Stats -->
    <div v-if="'isTotal' in playersSummary" class="section">
      <div class="section-header">
        <div class="section-accent" />
        <h2 class="section-title">Player Stats</h2>
      </div>

      <div class="tables-grid">
        <div
          v-for="stat in [
            'kills',
            'deaths',
            'assists',
            'cs',
            'fb',
            'tripleKills',
            'quadraKills',
            'pentaKills',
            'pointsMatch',
            'pointsMatchMoney',
          ]"
          :key="stat"
          class="stat-card"
        >
          <div class="role-filters">
            <button
              class="role-filter-btn"
              :class="{ active: selectedRole[stat] === 'all' }"
              @click="selectedRole[stat] = 'all'"
            >
              All
            </button>
            <button
              v-for="role in ['top', 'jungle', 'mid', 'bottom', 'support']"
              :key="role"
              class="role-filter-btn"
              :class="{ active: selectedRole[stat] === role }"
              @click="selectedRole[stat] = role"
            >
              <img
                :src="$func_global.role_images[role]"
                class="role-filter-icon"
              />
              {{ role }}
            </button>
          </div>
          <div class="stat-card-header">
            {{ displayName[stat] }}
          </div>
          <table class="stat-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Role</th>
                <th>Team</th>
                <th>$</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, index) in playersSummary.players[stat]
                  ?.filter((p) => p.player.matchesPlayed > 0)
                  .filter(
                    (p) =>
                      selectedRole[stat] === 'all' ||
                      p.player.role === selectedRole[stat],
                  )
                  .slice(0, 10)"
                :key="entry.player?.esportsPlayerId"
                :class="{
                  'rank-first': index === 0,
                  'rank-second': index === 1,
                  'rank-third': index === 2,
                }"
              >
                <td class="rank-cell">{{ index + 1 }}</td>
                <td class="player-cell">
                  {{ entry.player?.summonerName || "Unknown" }}
                </td>
                <td>
                  <span class="role-pill" :class="`role-${entry.player?.role}`">
                    {{ entry.player?.role?.slice(0, 3).toUpperCase() || "?" }}
                  </span>
                </td>
                <td class="team-cell">
                  <img :src="entry.player?.team?.imageUrl" class="team-logo" />
                  {{ entry.player?.team?.code || "?" }}
                </td>
                <td class="price-cell">
                  ${{ entry.player?.price.toFixed(1) }}
                </td>
                <td class="value-cell">
                  {{ formatNumber(stat, entry.value) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Team Stats -->
    <div v-if="'isTotal' in teamsSummary" class="section">
      <div class="section-header">
        <div class="section-accent" />
        <h2 class="section-title">Team Stats</h2>
      </div>

      <div class="tables-grid">
        <div
          v-for="stat in [
            'dragons',
            'nashors',
            'towers',
            'fb',
            'voidgrubs',
            'win',
            'fastWin',
            'pointsMatch',
            'pointsMatchMoney',
          ]"
          :key="stat"
          class="stat-card"
        >
          <div class="stat-card-header">
            {{ displayTeamName[stat] }}
          </div>
          <table class="stat-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>League</th>
                <th>$</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, index) in teamsSummary.teams[stat]
                  ?.filter((t) => t.team.matchesPlayed > 0)
                  .slice(0, 10)"
                :key="entry.team?.slug"
                :class="{
                  'rank-first': index === 0,
                  'rank-second': index === 1,
                  'rank-third': index === 2,
                }"
              >
                <td class="rank-cell">{{ index + 1 }}</td>
                <td class="team-cell">
                  <img :src="entry.team?.imageUrl" class="team-logo" />
                  {{ entry.team?.code || "?" }}
                </td>
                <td class="team-cell">
                  <img
                    :src="$func_global.leagues_icons[entry.team?.league]"
                    class="team-logo"
                  />
                  {{ entry.team?.league || "?" }}
                </td>
                <td class="price-cell">${{ entry.team?.price.toFixed(1) }}</td>
                <td class="value-cell">
                  {{ formatNumberTeam(stat, entry.value) }}
                </td>
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
      selectedRole: {
        kills: "all",
        deaths: "all",
        assists: "all",
        cs: "all",
        fb: "all",
        tripleKills: "all",
        quadraKills: "all",
        pentaKills: "all",
        pointsMatch: "all",
        pointsMatchMoney: "all",
      },
      selectedTabIndex: 0,
      playersSummary: {},
      teamsSummary: {},
      tabs: [],
      matchesByFixture: [],
      displayName: {
        kills: "Kills/game",
        deaths: "Deaths/game",
        assists: "Assists/game",
        cs: "CS/game",
        fb: "First Bloods",
        tripleKills: "Triple Kills",
        quadraKills: "Quadra Kills",
        pentaKills: "Penta Kills",
        pointsMatch: "Points/Match",
        pointsMatchMoney: "Points/Match/$",
      },
      displayTeamName: {
        voidgrubs: "Voidgrubs/game",
        fastWin: "Fast Wins",
        win: "Wins %",
        fb: "First Bloods %",
        dragons: "Dragons/game",
        nashors: "Nashors/game",
        towers: "Towers/game",
        pointsMatch: "Points/Match",
        pointsMatchMoney: "Points/Match/$",
      },
    };
  },
  methods: {
    formatNumber(stat, value) {
      if (
        stat === "fb" ||
        stat === "tripleKills" ||
        stat === "quadraKills" ||
        stat === "pentaKills"
      ) {
        return value;
      }

      return value.toFixed(2);
    },
    formatNumberTeam(stat, value) {
      if (stat === "win" || stat === "fb") {
        return (value * 100).toFixed(2) + "%";
      }
      if (stat === "fastWin") {
        return value;
      }
      return value.toFixed(2);
    },
    selectTab(index, f) {
      var fixture = f != 0 ? f : null;
      this.selectedTabIndex = index;
      console.log(this.selectedTabIndex);
      this.currentFixture = this.newRulesData.find(
        (element) => element.fixture.id == fixture,
      );
      this.getFixturePlayerSummaryStats(
        this.currentFixture == null ? null : this.currentFixture.fixture.id,
      );
      this.getFixtureTeamSummaryStats(
        this.currentFixture == null ? null : this.currentFixture.fixture.id,
      );
    },
    getCurrentFixture() {
      const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixture`;

      this.axios
        .get(url)
        .then((response) => {
          this.$store.commit("setFixtureId", response.data);
          console.log("Current fixture: ", this.$store.getters.getFixtureId);

          // this.$router.push({name: 'LeaguesView'})
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    async fetchRulesData() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/rules`,
        );
        this.newRulesData = response.data;
        this.tabs = response.data
          .map(function (fix) {
            var newFix = {
              id: fix.fixture.id,
              title: fix.fixture.name,
              order: fix.fixture.order,
            };
            return newFix;
          })
          .sort((a, b) => a.order - b.order);
        console.log("tabs", this.tabs);
        this.tabs.unshift({
          id: 0,
          title: "Total",
          order: -1,
        });
        this.selectTab(
          this.tabs.find(
            (element) => element.id == this.$store.getters.getFixtureId,
          ).order,
          this.$store.getters.getFixtureId,
        );
        console.log("Fixture ID:", this.$store.getters.getFixtureId);
        this.getFixturePlayerSummaryStats(this.$store.getters.getFixtureId);
        this.getFixtureTeamSummaryStats(this.$store.getters.getFixtureId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    getFixtures() {
      const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`;

      this.axios
        .get(url)
        .then((response) => {
          this.matchesByFixture = response.data.fixturesWithMatches.sort(
            (a, b) => a.fixture.order - b.fixture.order,
          );
          this.selectTab(
            this.tabs.find(
              (element) => element.id == this.$store.getters.getFixtureId,
            ).order,
            this.$store.getters.getFixtureId,
          );
          this.getFixturePlayerSummaryStats(this.$store.getters.getFixtureId);
          this.getFixtureTeamSummaryStats(this.$store.getters.getFixtureId);
          // this.$router.push({name: 'LeaguesView'})
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    getTotalSummaryStats() {
      this.axios
        .get(
          `${this.apiURL}Stats/${this.$store.getters.getCurrentTournamentId}/summary`,
        )
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

      this.axios
        .get(
          `${this.apiURL}Stats/${
            this.$store.getters.getCurrentTournamentId
          }/summary/players${fixtureId == null ? "" : "/" + fixtureId}`,
        )
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

      this.axios
        .get(
          `${this.apiURL}Stats/${
            this.$store.getters.getCurrentTournamentId
          }/summary/teams${fixtureId == null ? "" : "/" + fixtureId}`,
        )
        .then((response) => {
          console.log("Summary:", response.data);
          this.teamsSummary = response.data;
        })
        .catch((error) => {
          console.error("Error fetching stats:", error);
        });
    },
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
.stats-page {
  min-height: 100vh;
  background: var(--BACKGROUND-DARK);
  padding: 40px 32px;
  font-family: "DM Sans", sans-serif;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.header-accent {
  width: 4px;
  height: 52px;
  border-radius: 4px;
  background: linear-gradient(180deg, var(--PRIMARY), var(--PRIMARY-LIGHTER));
  flex-shrink: 0;
}

.eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--PRIMARY);
}

.page-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--GREY-LIGHT);
  line-height: 1;
}

/* Tabs */
.tabs-wrapper {
  margin-bottom: 32px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--GREY-DARKER);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}

.tab:hover {
  color: var(--GREY);
}

.tab.active {
  color: var(--PRIMARY-LIGHTER);
  border-bottom-color: var(--PRIMARY);
}

/* Section */
.section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-accent {
  width: 3px;
  height: 22px;
  border-radius: 4px;
  background: var(--PRIMARY);
  flex-shrink: 0;
}

.section-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

/* Grid */
.tables-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 1100px) {
  .tables-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .tables-grid {
    grid-template-columns: 1fr;
  }
}

/* Stat Card */
.stat-card {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 10px;
  overflow: hidden;
}

.stat-card-header {
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
  background: var(--SECONDARY);
  border-bottom: 1px solid var(--GREY-DARKER);
}

/* Table */
.stat-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.stat-table thead tr {
  background: var(--BACKGROUND-DARK);
}

.stat-table th {
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--GREY-DARKER);
  text-align: left;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.stat-table tbody tr {
  border-bottom: 1px solid var(--GREY-DARKER);
  transition: background 0.15s;
}

.stat-table tbody tr:last-child {
  border-bottom: none;
}

.stat-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.stat-table td {
  padding: 8px 10px;
  font-size: 13px;
  color: var(--GREY);
}

/* Rank highlights */
.rank-first td {
  background: rgba(248, 194, 32, 0.12) !important;
}

.rank-first .value-cell {
  color: var(--GOLDEN-CAPTAIN);
  font-weight: 800;
}

.rank-first .rank-cell {
  color: var(--GOLDEN-CAPTAIN);
  font-weight: 800;
}

.rank-second td {
  background: rgba(192, 192, 192, 0.07) !important;
}

.rank-third td {
  background: rgba(205, 127, 50, 0.07) !important;
}

/* Cell types */
.rank-cell {
  font-size: 12px;
  font-weight: 700;
  color: var(--GREY-DARKER);
  width: 24px;
}

.player-cell {
  font-weight: 600;
  color: var(--GREY-LIGHT);
}

.team-cell {
  align-items: center;
  gap: 5px;
}

.team-logo {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
}

.price-cell {
  color: var(--GREY-DARKER);
  font-size: 12px;
}

.value-cell {
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
  text-align: right;
}

/* Role pills */
.role-pill {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.role-top {
  background: var(--ROLE-TOP);
  color: var(--GREY-LIGHT);
}
.role-jungle {
  background: var(--ROLE-JUNGLE);
  color: var(--GREY-LIGHT);
}
.role-mid {
  background: var(--ROLE-MID);
  color: var(--GREY-LIGHT);
}
.role-bottom {
  background: var(--ROLE-BOTTOM);
  color: var(--GREY-LIGHT);
}
.role-support {
  background: var(--ROLE-SUPPORT);
  color: var(--GREY-LIGHT);
}
.role-filters {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}

.role-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 8px;
  color: var(--GREY);
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.role-filter-btn:hover {
  border-color: var(--PRIMARY-DARKER);
  color: var(--GREY-LIGHT);
}

.role-filter-btn.active {
  border-color: var(--PRIMARY);
  color: var(--PRIMARY-LIGHTER);
  background: rgba(166, 58, 159, 0.08);
}

.role-filter-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.role-filter-btn.active .role-filter-icon {
  filter: none;
  opacity: 1;
}
</style>
