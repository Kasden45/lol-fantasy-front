<template>
  <div v-if="currentLeague != null" class="league-view">
    <div class="page-header">
      <div class="header-accent" />
      <div>
        <p class="eyebrow">{{ fixturesData.mode }} mode</p>
        <h1 class="page-title">{{ currentLeague.name }}</h1>
      </div>
    </div>
    <div class="row w-80 m-auto">
      <DraftView
        v-if="fixturesData && fixturesData.mode == 'Draft'"
        :leagueId="this.currentLeague.invitationCode"
        :realLeagueId="this.realLeagueId"
      />
    </div>
    <!-- List of Leagues the User Is In -->
    <!-- Chart -->
    <button class="btn btn-primary" @click="openModal = !openModal">
      <i class="fa-solid fa-chart-line"></i> See league race Chart
    </button>
    <MyModal
      v-if="openModal"
      :openModal="this.openModal"
      @closeModal="closeChartModal"
      :title="'League race chart'"
    >
      <LeagueTableChart
        v-if="fixturesData.fixtures.length > 0 && this.tabs.length > 0"
        :fixturesData="this.fixturesData.fixtures"
        :rules="this.tabs"
      />
    </MyModal>
    <!-- Start -->
    <div class="navbar navbar-expand-md navbar-light">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#gameTabs"
        aria-controls="gameTabs"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="justify-content-center game-points collapse navbar-collapse"
        id="gameTabs"
      >
        <div class="game-tabs navbar-nav ms-2 justify-content-md-center">
          <div
            v-for="(fixture, index) in tabs"
            :key="fixture.order"
            @click="selectTab(fixture.order, fixture.id)"
            :class="{ active: selectedTabIndex === fixture.order }"
            class="navbar-item"
          >
            {{ fixture.title }}
            <!-- {{ fixture != 0 ? fixture : 'General' }} -->
          </div>
        </div>
      </div>
    </div>
    <div class="container game-points">
      <div
        class="row league-row justify-content-md-center"
        :class="{
          'fixture-view': this.selectedTabIndex > 0,
        }"
        v-if="currentLeague"
      >
        <div
          :class="{
            'fixture-view': this.selectedTabIndex > 0,
            'col-md-9': this.selectedTabIndex === 0,
            'col-md-4': this.selectedTabIndex > 0,
          }"
        >
          <table class="participants-table px-2">
            <tbody>
              <tr
                class="table-row-participants"
                v-for="(participant, index) in currentLeague.participants.sort(
                  calculatePosition,
                )"
                :key="participant.userId"
              >
                <td>{{ index + 1 }}.</td>
                <ParticipantDetails
                  @setActive="setActiveUserTeam"
                  :matchStatuses="matchStatuses[participant.userId]"
                  :participant="participant"
                  :fixtureGames="this.fixtureGames"
                />
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md-8" v-if="this.selectedTabIndex > 0">
          <div
            ref="scrollContainer"
            class="container participants-container"
            @wheel.prevent="onWheel"
            @mousedown="startDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            @mousemove="onDrag"
          >
            <ParticipantDetailsV2
              v-for="(participant, index) in currentLeague.participants.sort(
                calculatePosition,
              )"
              :key="participant.userId"
              @match-status-update="onMatchStatusUpdate"
              v-if="tabs.length > 0"
              :participant="participant"
              :fixtureGames="this.fixtureGames"
              :fixture="
                tabs.find((element) => element.order == selectedTabIndex)
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import PlayerPointsCard from '@/components/PlayerPointsCard.vue';
// import PlayerPointsGamesCard from '@/components/PlayerPointsGamesCard.vue';
import DraftView from "@/components/League/DraftView.vue";
import ParticipantDetails from "@/components/League/ParticipantDetails.vue";
import ParticipantDetailsV2 from "@/components/League/ParticipantDetailsV2.vue";
import LeagueTableChart from "@/components/Charts/LeagueTableChart.vue";
import MyModal from "@/components/MyModal.vue";
export default {
  components: {
    LeagueTableChart,
    // PlayerPointsCard,
    ParticipantDetailsV2,
    ParticipantDetails,
    DraftView,
    MyModal,
  },
  data() {
    return {
      activeUserTeam: {},
      fixturesData: {},
      selectedTabIndex: 0,
      tabs: [],
      newLeagueName: "",
      invitationCode: "",
      userLeagues: [],
      currentLeague: null,
      realLeagueId: null,
      fixtureGames: [],
      openModal: false,
      matchStatuses: {}, // userId -> { planned, playing, finished }
    };
  },
  methods: {
    onMatchStatusUpdate({ userId, planned, playing, finished }) {
      this.matchStatuses[userId] = { planned, playing, finished };
    },
    onWheel(event) {
      const el = this.$refs.scrollContainer;
      el.scrollLeft += event.deltaY;
    },
    closeChartModal(name) {
      this.openModal = false;
    },
    openChartModal() {
      this.openModal = true;
    },
    setActiveUserTeam(activeUserTeam) {
      this.activeUserTeam = activeUserTeam;
    },
    calculatePosition(a, b) {
      var aPoints =
        a.points != null
          ? a.points
          : a.userTeam != null
          ? a.userTeam.totalPoints
          : 0;
      var bPoints =
        b.points != null
          ? b.points
          : b.userTeam != null
          ? b.userTeam.totalPoints
          : 0;
      return aPoints < bPoints ? 1 : aPoints > bPoints ? -1 : 0;
    },
    selectTab(index, fixture) {
      this.selectedTabIndex = index;
      console.log(this.selectedTabIndex);
      this.currentLeague = this.fixturesData.fixtures.find(
        (element) => element.fixture == fixture,
      );

      // this.currentLeague = this.fixturesData.fixtures.find((element) => element.fixture == fixture);
    },
    async getLeagueDetails(invitationCode) {
      try {
        const response = await this.axios.get(
          `${this.apiURL}User/league/${invitationCode}`,
        );
        this.currentLeague = response.data;
        this.realLeagueId = this.currentLeague.participants[0].fantasyLeagueId;
        console.log("get league details", this.currentLeague);
      } catch (error) {
        console.error("Error fetching league details:", error);
      }
    },
    async getLeagueDetailsWithFixtures(invitationCode) {
      try {
        const response = await this.axios.get(
          `${this.apiURL}User/league/${invitationCode}/fixtures`,
        );
        this.currentLeague = response.data.fixtures.find(
          (element) => element.fixture == null,
        );
        this.fixturesData = response.data;
        this.FetchRules();
        // this.tabs = response.data.fixtures.map(function(fix) {
        //     return fix.fixture != null ? fix.fixture : 0;
        //   }).sort();
        console.log("get league details", this.currentLeague);
      } catch (error) {
        console.error("Error fetching league details:", error);
      }
    },
    async fetchUserLeagues() {
      try {
        const response = await this.axios.get(`${this.apiURL}User/leagues`); // Replace with the correct endpoint
        this.userLeagues = response.data;
      } catch (error) {
        console.error("Error fetching user leagues:", error);
      }
    },
    FetchFixtureGames() {
      this.axios
        .get(
          `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/matches`,
        )
        .then((response) => {
          this.fixtureGames = response.data;
        })
        .catch((error) => {
          console.error("Error fetching fixture games:", error);
        });
    },
    FetchRules() {
      this.axios
        .get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/rules`,
        )
        .then((response) => {
          var generalTab = [
            {
              id: this.fixturesData.fixtures.find(
                (element) => element.fixture == null,
              ).fixture,
              title: "General",
              order: 0,
            },
          ];

          this.tabs = generalTab
            .concat(
              response.data.map(function (fix) {
                var newFix = {
                  id: fix.fixture.id,
                  title: fix.fixture.name,
                  order: fix.fixture.order,
                };
                return newFix;
              }),
            )
            .filter((tab) =>
              this.fixturesData.fixtures.map((f) => f.fixture).includes(tab.id),
            )
            .sort((a, b) => a.order - b.order);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
  mounted() {
    this.invitationCode = this.$route.params.leagueCode;
    // Fetch the list of leagues the user is in when the component is mounted
    // this.getLeagueDetails(this.invitationCode);
    this.getLeagueDetailsWithFixtures(this.invitationCode);
    this.FetchFixtureGames();
  },
};
</script>

<style scoped>
.header-name {
  color: var(--PRIMARY);
  font-weight: 800;
  font-size: large;
}
.navbar-brand {
  background: -webkit-linear-gradient(
    0deg,
    var(--PRIMARY) 0%,
    var(--PRIMARY-LIGHTER) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 2rem;
}

.league-row {
  padding-bottom: 20px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.league-row.fixture-view {
  padding-bottom: 0px;
  overflow-x: scroll;
}
.participants-table {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--GREY-DARKER);
  background: var(--BACKGROUND-LIGHTER);
}
.table-row-participants {
  height: 10vh !important;
}
.participants-table tr {
  /* background-color: var(--BACKGROUND-DARK); */
  color: white;
}
.table-row-participants {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 20px;
  border-bottom: 1px solid var(--GREY-DARKER);
  transition: background 0.15s;
}

.table-row-participants:last-child {
  border-bottom: none;
}

.table-row-participants:hover {
  background: var(--SECONDARY);
}
.participants-container {
  flex-wrap: nowrap;
  overflow-x: scroll;
  scroll-behavior: smooth;
}
.game-tabs {
  color: var(--TABLE-ROW-SECONDARY);
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
  background-color: #007bff;
  color: #fff;
}
.inform {
  color: var(--ERROR);
  font-size: x-small;
}
.league-view {
  /* background-color: var(--BACKGROUND-DARK); */
  background: var(--BACKGROUND-DARK);
  padding: 40px 32px;
  font-family: "DM Sans", sans-serif;
}
</style>
