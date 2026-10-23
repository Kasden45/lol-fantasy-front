<template>
  <div class="stats-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-accent" />
      <div>
        <p class="eyebrow">
          {{
            this.tournaments_icons[this.$store.getters.getCurrentTournamentId]
          }}
          Fantasy
        </p>
        <h1 class="page-title">Dream Teams</h1>
      </div>
    </div>
    <div class="tabs-wrapper">
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
    </div>
    <div v-if="playersForSummonersRiftView != null">
      <div class="summoners-rift-scroll">
        <div class="summoners-rift mx-auto">
          <div
            class="tile-anchor"
            v-for="player in playersForSummonersRiftView"
            :key="player.id"
            :style="getPlayerPosition(player)"
          >
            <DreamTeamPlayerTile
              :player="player"
              :highlighted="player.highlighted"
            />
          </div>
          <div
            class="tile-anchor"
            :style="getTeamPosition()"
            v-if="dreamTeam.dreamTeamTeam != null"
          >
            <DreamTeamTeamTile :team="dreamTeam.dreamTeamTeam" />
          </div>
          <div
            class="total-points-pill"
            :style="getTotalPosition()"
            v-if="dreamTeam.totalPoints != null"
          >
            {{ dreamTeam.totalPoints.toFixed(2) }} pts
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DreamTeamPlayerTile from "@/components/DreamTeam/DreamTeamPlayerTile.vue";
import DreamTeamTeamTile from "@/components/DreamTeam/DreamTeamTeamTile.vue";

export default {
  components: {
    DreamTeamPlayerTile,
    DreamTeamTeamTile,
  },
  data() {
    return {
      selectedTabIndex: 0,
      playersForSummonersRiftView: [],
      tabs: [],
      matchesByFixture: [],
      dreamTeam: {},
    };
  },
  methods: {
    getTotalPosition() {
      return { top: "8%", left: "88%" };
    },
    getTeamPosition() {
      return { top: "88%", left: "15%" };
    },
    getPlayerPosition(player) {
      switch (player.role) {
        case "top":
          return { top: "12%", left: "20%" };
        case "jungle":
          return { top: "32%", left: "34%" };
        case "mid":
          return { top: "50%", left: "50%" };
        case "bottom":
          return { top: "68%", left: "66%" };
        case "support":
          return { top: "85%", left: "80%" };
        default:
          return { top: "50%", left: "50%" };
      }
    },
    teamPlayerToMapPlayer(teamPlayer) {
      return {
        points: teamPlayer.points,
        id: teamPlayer.esportsPlayerId,
        summonerName: teamPlayer.summonerName,
        role: teamPlayer.role,
        imageUrl: teamPlayer.imageUrl,
        team: teamPlayer.team,
        nationality: teamPlayer.nationality,
        highlighted: false,
      };
    },
    fillMapPlayers() {
      this.playersForSummonersRiftView = [
        this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.top),
        this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.jungle),
        this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.mid),
        this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.bottom),
        this.teamPlayerToMapPlayer(this.dreamTeam.dreamTeamPlayers.support),
      ];
      const maxPoints = Math.max(
        ...this.playersForSummonersRiftView.map((p) => p.points),
      );
      this.playersForSummonersRiftView.forEach((p) => {
        p.highlighted = p.points === maxPoints;
      });
    },
    selectTab(index, f) {
      var fixture = f != 0 ? f : null;
      this.selectedTabIndex = index;
      this.currentFixture = this.newRulesData.find(
        (element) => element.fixture.id == fixture,
      );
      this.getDreamTeam(this.currentFixture.fixture.id);
    },
    getCurrentFixture() {
      const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixture`;

      this.axios
        .get(url)
        .then((response) => {
          this.$store.commit("setFixtureId", response.data);

          // this.$router.push({name: 'LeaguesView'})
        })
        .catch((error) => {});
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

        this.selectTab(
          this.tabs.find(
            (element) => element.id == this.$store.getters.getFixtureId,
          ).order,
          this.$store.getters.getFixtureId,
        );
        this.getDreamTeam(this.$store.getters.getFixtureId);
      } catch (error) {}
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
          this.getDreamTeam(this.$store.getters.getFixtureId);
          // this.$router.push({name: 'LeaguesView'})
        })
        .catch((error) => {});
    },
    getDreamTeam(fixtureId) {
      this.axios
        .get(
          `${this.apiURL}Stats/${this.$store.getters.getCurrentTournamentId}/dream_team/${fixtureId}`,
        )
        .then((response) => {
          this.dreamTeam = response.data;
          this.fillMapPlayers();
        })
        .catch((error) => {});
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

.game-tabs {
  display: flex;
  margin-bottom: 20px;
  color: #fff;
}

.game-tabs div {
  cursor: pointer;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.game-tabs .active {
  background-color: #007bff;
  color: #fff;
}

.summoners-rift-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 12px;
}

.summoners-rift {
  position: relative;
  width: 1200px;
  min-width: 900px;
  height: 1000px;
  border-radius: 24px;
  overflow: hidden;
  background-image: url("https://2.bp.blogspot.com/--A1wNZhS868/U7L4xKhbQTI/AAAAAAAAS04/rfzak1JCZFY/s1600/srdb3-1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: -webkit-optimize-contrast;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.tile-anchor {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.total-points-pill {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 3;
  background: var(--PRIMARY);
  color: white;
  font-weight: 700;
  font-size: clamp(0.6rem, 1vw, 0.85rem);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}

@media (max-width: 1000px) {
  .game-tabs {
    display: block;
    margin-bottom: 20px;
  }

  .summoners-rift {
    width: 900px;
    min-width: 900px;
    height: 750px;
  }
}
</style>
