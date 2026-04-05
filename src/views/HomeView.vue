<!-- TeamSelection.vue -->
<template>
  <div>
    <div id="login-page" class="justify-content-center h-auto">
      <div class="row h-auto justify-content-center" id="content">
        <div class="col-md-5 col-sm-11" v-if="profile == null || profile == ''">
          <MyModal
            :bg-color="'var(--PRIMARY)'"
            :openModal="this.openModal"
            @closeModal="closeDetailsModal"
            :title="'Login'"
          >
            <login-panel />
          </MyModal>
        </div>
      </div>
      <div class="row m-0">
        <div id="intro" class="home">
          <div class="mask p-0" id="bg">
            <div class="container">
              <div class="row step pt-4">
                <p id="photo-text">
                  Welcome to<br />
                  <span class="highlight">2KPI LoL Fantasy Game</span>
                </p>
              </div>
              <div class="row step pb-4">
                <div class="col-md-3 line">
                  <img
                    src="../assets/number1.png"
                    alt="one"
                    height="50px"
                    width="auto"
                    class="mx-auto d-block my-3"
                  />
                  <p class="step-title">Assemble</p>
                  <p>
                    <b>Create your dream team</b> from your favourite,
                    top-performing League of Legends players
                  </p>
                </div>
                <div class="col-md-3 line mx-2">
                  <img
                    src="../assets/number2.png"
                    alt="two"
                    height="50px"
                    width="auto"
                    class="mx-auto d-block my-3"
                  />
                  <p class="step-title">Compete</p>
                  <p>
                    <b>Create or join a league</b> to prove your skills and show
                    your friends you’re the ultimate game expert
                  </p>
                </div>
                <div class="col-md-3 mx-2">
                  <img
                    src="../assets/number3.png"
                    alt="three"
                    height="50px"
                    width="auto"
                    class="mx-auto d-block my-3"
                  />
                  <p class="step-title">Manage</p>
                  <p>
                    Make smart moves with transfers and extra chips to
                    <b>rack up maximum points</b> throughout the tournament
                  </p>
                </div>
                <button
                  v-if="profile == null || profile == ''"
                  class="cta-btn col-md-4"
                  @click="openDetailsModal"
                >
                  Start Building Your Team
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Replace the entire rules/points section inside the overlay div -->
        <div v-if="currentFixture != null" class="rules-section">
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
              <span class="navbar-toggler-icon button-rules"></span>
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

          <!-- Fixture Info -->
          <div class="fixture-info" v-if="currentFixture.fixture.id != null">
            <div class="fixture-info-left">
              <p class="eyebrow">Current Fixture</p>
              <h2 class="fixture-name">{{ currentFixture.fixture.name }}</h2>
            </div>
            <div class="deadline-block" :class="deadlineClass">
              <p class="deadline-label">Deadline</p>
              <p class="deadline-value">
                {{
                  $func_global.formatDate(
                    currentFixture.fixture.deadlineDateTime,
                  )
                }}
              </p>
            </div>
          </div>

          <!-- Quick Rules -->
          <div class="quick-rules">
            <div class="quick-rule-item" v-for="rule in rules" :key="rule.name">
              <span class="quick-rule-name">{{ rule.name }}</span>
              <span class="quick-rule-value">{{ rule.value }}</span>
            </div>
          </div>

          <!-- Points Grid -->
          <div class="points-grid">
            <!-- Player Points -->
            <div class="points-card">
              <div class="points-card-header">
                <h3 class="points-card-title">Player Points</h3>
              </div>
              <div class="points-list">
                <div
                  v-for="rule in playerPointsRules"
                  :key="rule.name"
                  class="points-row"
                  :class="{ 'points-negative': rule.value < 0 }"
                >
                  <span class="points-event">{{ rule.name }}</span>
                  <span
                    class="points-value"
                    :class="
                      rule.value < 0 ? 'value-negative' : 'value-positive'
                    "
                  >
                    {{ rule.value > 0 ? "+" : "" }}{{ rule.value }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Team Points -->
            <div class="points-card">
              <div class="points-card-header">
                <h3 class="points-card-title">Team Points</h3>
              </div>
              <div class="points-list">
                <div
                  v-for="rule in teamPointsRules"
                  :key="rule.name"
                  class="points-row"
                  :class="{ 'points-negative': rule.value < 0 }"
                >
                  <span class="points-event">{{ rule.name }}</span>
                  <span
                    class="points-value"
                    :class="
                      rule.value < 0 ? 'value-negative' : 'value-positive'
                    "
                  >
                    {{ rule.value > 0 ? "+" : "" }}{{ rule.value }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Rule Section -->
  </div>
</template>

<script>
import MyModal from "@/components/MyModal.vue";
import LoginPanel from "@/views/LoginView.vue";
export default {
  components: {
    LoginPanel,
    MyModal,
  },
  data() {
    return {
      currentFixture: {
        rules: [],
        fixture: {},
      },
      openModal: false,
      tabs: [], // {id, name, order}
      newRulesData: [],
      selectedTabIndex: 0,
    };
  },
  async mounted() {
    // Fetch data when the component is mounted
    this.getCurrentFixture();
    while (this.currentFixture.rules.length == 0) {
      await this.fetchRulesData();
    }
    // this.fetchRulesData();
    // this.profile =
    console.log(this.profile);
  },
  methods: {
    closeDetailsModal(name) {
      // console.log(detailsData)
      this.openModal = false;
      // this.detailsData = detailsData
    },
    openDetailsModal() {
      this.openModal = true;
    },
    selectTab(index, f) {
      var fixture = f != 0 ? f : null;
      this.selectedTabIndex = index;
      console.log(this.selectedTabIndex);
      this.currentFixture = this.newRulesData.find(
        (element) => element.fixture.id == fixture,
      );
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

        this.selectTab(
          this.tabs.find(
            (element) => element.id == this.$store.getters.getFixtureId,
          ).order,
          this.$store.getters.getFixtureId,
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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
  },
  computed: {
    deadlineClass() {
      const hoursLeft =
        (new Date(this.currentFixture.fixture.deadlineDateTime) - new Date()) /
        36e5;
      if (hoursLeft < 48) return "text-danger";
      if (hoursLeft < 96) return "text-warning";
      return "";
    },
    playerPointsRules() {
      return this.currentFixture.rules.filter(
        (rule) => rule.type === "PlayerPoints",
      );
    },
    teamPointsRules() {
      return this.currentFixture.rules.filter(
        (rule) => rule.type === "TeamPoints",
      );
    },
    rules() {
      return this.currentFixture.rules.filter((rule) => rule.type === "Rule");
    },
    profile() {
      return this.$store.getters.getProfileId;
    },
  },
};
</script>

<style scoped>
.info-section {
  margin-bottom: 20px;
  color: white;
}

#intro {
  color: #ffffff;
}

#intro {
  height: inherit;
  padding: 0%;
  width: 100%;
  background: url("../assets/lolevent.jpg") no-repeat center center fixed;
  background-color: rgba(143, 2, 2, 0.8);
  background-blend-mode: lighten;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

#bg {
  height: inherit;
  width: 100%;
  background: linear-gradient(150deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5) 50%);
}

h2 {
  margin: 0;
}

#login-page {
  width: 100%;
  height: 20vh;
  background-image: linear-gradient(
    to right,
    var(--BACKGROUND-DARK) 50%,
    var(--BACKGROUND-LIGHTER)
  );
}

#logo {
  text-align: left;
  color: var(--BLACK);
}

#logo-rel {
  position: relative;
  height: 20vh;
}

#bee-img {
  z-index: 2;
  position: absolute;
  top: 20px;
  left: 50px;
  height: 70px;
}

#logo-text {
  position: absolute;
  top: 15px;
  left: 110px;
  font-family: Mistral, serif;
  font-size: 400%;
  z-index: 1;
}

#content {
  height: 80vh;
}

#info {
  position: relative;
}

#info-text {
  position: absolute;
  top: 25%;
  left: 20%;
  font-weight: bold;
  font-size: 4vw;
  color: white;
  text-align: left;
  font-style: italic;
  z-index: 2;
}
#photo-text {
  left: 10%;
  padding: 10px;
  font-weight: bold;
  font-size: 30px;
  /* font-size: 400%; */
}
.step {
  height: inherit;
  text-align: center;
  align-content: center;
  justify-content: center;
}

.step-title {
  font-size: 24px;
  font-weight: bold;
}
.game-tabs {
  padding-top: 10px;
  display: flex;
  margin-bottom: 20px;
  color: white;
}

.game-tabs div {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-right: 7px;
}

.game-tabs .active {
  background-color: #007bff;
  color: #fff;
}
.hero {
  justify-content: top;
  color: white;
}
.container {
  height: inherit;
}
.overlay {
  background: var(--SECONDARY);
  padding: 3rem;
  border-radius: 1rem;
  margin: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.content {
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.highlight {
  color: var(--LIGHT-BLUE);
  font-weight: bold;
}

p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}
.cta-btn {
  margin-top: 2rem;
  /* width: 0.7vw; */
  padding: 0.75rem 2rem;
  background: var(--LIGHT-BLUE);
  color: #000;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  text-decoration: none;
}

.cta-btn:hover {
  background: #00aacc;
}

.rules-table {
  width: 100%;
  border-collapse: collapse;
  border: none;
}

.rules-table th,
.rules-table td {
  border-bottom: 1px solid #ddd;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
  text-align: left;
  color: white;
}
/* Fixture Info */
.rules-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
  margin-bottom: 20px;
}

.fixture-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--PRIMARY);
}

.fixture-name {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: var(--GREY-LIGHT);
}

.deadline-block {
  text-align: right;
  padding: 10px 16px;
  border-radius: 8px;
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
}

.deadline-block.text-danger {
  border-color: var(--ERROR);
  background: rgba(244, 67, 54, 0.08);
}

.deadline-block.text-warning {
  border-color: var(--WARNING);
  background: rgba(255, 152, 0, 0.08);
}

.deadline-label {
  margin: 0 0 2px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--GREY-DARKER);
}

.deadline-value {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.deadline-block.text-danger .deadline-value {
  color: var(--ERROR);
}
.deadline-block.text-warning .deadline-value {
  color: var(--WARNING);
}

/* Quick Rules */
.quick-rules {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 8px;
}

.quick-rule-name {
  font-size: 12px;
  color: var(--GREY-LIGHT);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.quick-rule-value {
  font-size: 14px;
  font-weight: 800;
  color: var(--PRIMARY-LIGHTER);
}

/* Points Grid */
.points-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 768px) {
  .points-grid {
    grid-template-columns: 1fr;
  }
}

.points-card {
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 12px;
  overflow: hidden;
}

.points-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--BACKGROUND-DARK);
  border-bottom: 1px solid var(--GREY-DARKER);
}

.points-card-icon {
  font-size: 16px;
}

.points-card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.points-list {
  display: flex;
  flex-direction: column;
}

.points-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid var(--GREY-DARKER);
  transition: background 0.15s;
}

.points-row:last-child {
  border-bottom: none;
}

.points-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.points-negative {
  opacity: 0.75;
}

.points-event {
  font-size: 13px;
  color: var(--GREY);
  font-weight: 500;
}

.points-value {
  font-size: 14px;
  font-weight: 800;
  min-width: 40px;
  text-align: right;
}

.value-positive {
  color: var(--GREEN-LIGHT);
}

.value-negative {
  color: var(--ERROR);
}
.navbar-toggler-icon.button-rules {
  filter: invert(100%) sepia(100%) grayscale(100%) brightness(200%);
}
</style>
