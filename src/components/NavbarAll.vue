<template>
  <MyModal
    v-if="
      this.$store.getters.getProfileId == null ||
      this.$store.getters.getProfileId == ''
    "
    :bg-color="'var(--PRIMARY)'"
    :openModal="this.openModal"
    @closeModal="closeDetailsModal"
    :title="'Login'"
  >
    <login-panel />
  </MyModal>
  <div class="navbar-expand-md bg-white sticky-top">
    <nav class="navbar navbar-expand-md py-0">
      <h4
        v-if="
          this.nextFixture != null &&
          new Date(this.nextFixture.fixture.deadlineDate) > new Date()
        "
        class="w-100"
        :class="{
          'deadline-banner-danger':
            (new Date(this.nextFixture.fixture.deadlineDate) - new Date()) /
              36e5 <
            24,
          'deadline-banner-warning':
            (new Date(this.nextFixture.fixture.deadlineDate) - new Date()) /
              36e5 >
              24 &&
            (new Date(this.nextFixture.fixture.deadlineDate) - new Date()) /
              36e5 <
              26,
          'deadline-banner':
            (new Date(this.nextFixture.fixture.deadlineDate) - new Date()) /
              36e5 >
            26,
        }"
      >
        {{ this.nextFixture.fixture.name }} starts in {{ this.timeToDeadline }}
      </h4>
    </nav>
    <nav class="navbar navbar-expand-md pt-0 bg-white">
      <div class="container">
        <a class="navbar-brand"
          >{{
            this.tournaments[this.$store.getters.getCurrentTournamentId]
          }}
          Fantasy2KPI</a
        >
        <img
          class="flag"
          :src="
            this.$func_global.leagues_icons[
              this.tournaments_icons[this.$store.getters.getCurrentTournamentId]
            ]
          "
          alt="flag"
        />
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarClientContent"
          aria-controls="navbarClientContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarClientContent">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item pe-3">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'Home' }"
                :to="{ name: 'Home' }"
                >Home</router-link
              >
            </li>
            <li
              class="nav-item pe-3"
              v-if="
                this.$store.getters.getProfileId != null &&
                this.$store.getters.getProfileId != ''
              "
            >
              <router-link
                class="nav-link"
                :class="{
                  active:
                    this.$route.name === 'TeamSelection' ||
                    this.$route.name === 'TeamSelectionV2',
                }"
                :to="{ name: 'TeamSelectionV2' }"
                >Team Selection</router-link
              >
            </li>
            <li
              class="nav-item pe-3"
              v-if="
                this.$store.getters.getProfileId != null &&
                this.$store.getters.getProfileId != ''
              "
            >
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'CurrentPointsView' }"
                :to="{
                  name: 'CurrentPointsView',
                  params: {
                    userId:
                      this.$store.getters.getProfileId != null &&
                      this.$store.getters.getProfileId != ''
                        ? this.$store.getters.getProfileId
                        : 0,
                  },
                }"
                >Current points</router-link
              >
            </li>
            <li class="nav-item pe-3">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'PlayersView' }"
                :to="{ name: 'PlayersView' }"
                >Players</router-link
              >
            </li>
            <li
              class="nav-item pe-3"
              v-if="
                this.$store.getters.getProfileId != null &&
                this.$store.getters.getProfileId != ''
              "
            >
              <router-link
                class="nav-link"
                :class="{
                  active:
                    this.$route.name === 'LeaguesView' ||
                    this.$route.name === 'SingleLeagueView',
                }"
                :to="{ name: 'LeaguesView' }"
                >Leagues</router-link
              >
            </li>
            <li class="nav-item pe-3">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'MatchesView' }"
                :to="{ name: 'MatchesView' }"
                >Matches</router-link
              >
            </li>
            <li class="nav-item pe-3">
              <div class="dropdown">
                <button
                  class="nav-link"
                  id="dropdownMenuStats"
                  :class="{
                    active:
                      this.$route.name === 'StatsView' ||
                      this.$route.name === 'DreamTeamView',
                  }"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Stats
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuStats">
                  <li>
                    <a
                      @click="this.$router.push({ name: 'DreamTeamView' })"
                      class="dropdown-item"
                      href="#"
                    >
                      <span>Dream teams</span>
                    </a>
                  </li>
                  <li>
                    <a
                      @click="this.$router.push({ name: 'StatsView' })"
                      class="dropdown-item"
                      href="#"
                    >
                      <span>Player stats</span>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="nav-item pe-3">
              <div class="dropdown">
                <button
                  class="btn first-letter"
                  type="button"
                  id="dropdownMenuAccount"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    v-if="this.$store.getters.getLogin.length > 0"
                    class=""
                    >{{ this.$store.getters.getLogin[0] }}</span
                  >
                  <span
                    v-if="
                      this.$store.getters.getLogin == null ||
                      this.$store.getters.getLogin.length == 0
                    "
                    class=""
                    ><i class="fa-solid fa-user-gear"></i
                  ></span>
                </button>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuAccount"
                >
                  <li
                    v-if="
                      this.$store.getters.getProfileId == null ||
                      this.$store.getters.getProfileId == ''
                    "
                  >
                    <a @click="openDetailsModal" class="dropdown-item" href="#">
                      <span>Login</span>
                    </a>
                  </li>
                  <li>
                    <a
                      @click="this.$router.push({ name: 'SettingsView' })"
                      class="dropdown-item"
                      href="#"
                    >
                      <span>Settings</span>
                    </a>
                  </li>
                  <!-- <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.worlds_2023 }" class="dropdown-item" href="#" @click="switchTournament(this.worlds_2023)">
                      WORLDS 2023
                    </a>
                  </li>
                  <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.msi_2024 }" class="dropdown-item" href="#" @click="switchTournament(this.msi_2024)">
                      MSI 2024
                    </a>
                  </li> -->
                  <li>
                    <a
                      :class="{
                        'active-tournament':
                          this.$store.getters.getCurrentTournamentId ===
                          this.lck_split_2_2026,
                      }"
                      class="dropdown-item"
                      href="#"
                      @click="switchTournament(this.lck_split_2_2026)"
                    >
                      LCK Split 2 2026
                    </a>
                  </li>
                  <li>
                    <a
                      :class="{
                        'active-tournament':
                          this.$store.getters.getCurrentTournamentId ===
                          this.lec_split_1_2026,
                      }"
                      class="dropdown-item"
                      href="#"
                      @click="switchTournament(this.lec_split_1_2026)"
                    >
                      LEC Split 1 2026
                    </a>
                  </li>
                  <li>
                    <a
                      :class="{
                        'active-tournament':
                          this.$store.getters.getCurrentTournamentId ===
                          this.worlds_2025,
                      }"
                      class="dropdown-item"
                      href="#"
                      @click="switchTournament(this.worlds_2025)"
                    >
                      WORLDS 2025
                    </a>
                  </li>
                  <li>
                    <a
                      :class="{
                        'active-tournament':
                          this.$store.getters.getCurrentTournamentId ===
                          this.msi_2025,
                      }"
                      class="dropdown-item"
                      href="#"
                      @click="switchTournament(this.msi_2025)"
                    >
                      MSI 2025
                    </a>
                  </li>
                  <!-- <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.worlds_2024 }" class="dropdown-item" href="#" @click="switchTournament(this.worlds_2024)">
                      WORLDS 2024
                    </a>
                  </li> -->
                  <li
                    v-if="
                      this.$store.getters.getProfileId != null &&
                      this.$store.getters.getProfileId != ''
                    "
                  >
                    <a @click="logout" class="dropdown-item" href="#">Logout</a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import MyModal from "@/components/MyModal.vue";
import LoginPanel from "@/views/LoginView.vue";
export default {
  name: "NavbarAll",
  components: {
    MyModal,
    LoginPanel,
  },
  data() {
    return {
      openModal: false,
      timeToDeadline: "",
      nextFixture: null,
    };
  },
  mounted: function () {
    this.getFixtures();
    this.timer = setInterval(() => {
      this.deadlineCountdown();
    }, 1000);
  },

  methods: {
    async deadlineCountdown() {
      if (this.$store.getters.getNextFixture != null) {
        const deadline = new Date(
          this.$store.getters.getNextFixture.fixture.deadlineDate,
        );
        const now = new Date();
        const diff = deadline - now;
        const days = Math.floor(diff / 864e5);
        const hours = Math.floor((diff % 864e5) / 36e5);
        const minutes = Math.floor((diff % 36e5) / 6e4);
        const seconds = Math.floor((diff % 6e4) / 1000);
        // console.log(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        this.timeToDeadline = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    },
    logout() {
      this.$store.commit("setProfileId", "");
      this.$store.commit("setLogin", "");
      this.$router.push({ name: "Home" });
    },
    switchTournament(tournamentId) {
      this.$store.commit("setCurrentTournamentId", tournamentId);
      this.$router.go();
    },
    closeDetailsModal(name) {
      // console.log(detailsData)
      this.openModal = false;
      // this.detailsData = detailsData
    },
    openDetailsModal() {
      this.openModal = true;
    },
    async getFixtures() {
      if (
        this.$store.getters.getNextFixture != null &&
        Date(this.$store.getters.getNextFixture.fixture.deadlineDate) >
          new Date()
      ) {
        this.nextFixture = this.$store.getters.getNextFixture;
        return;
      }
      this.$store.commit("setNextFixture", null);
      const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`;

      this.axios
        .get(url)
        .then((response) => {
          this.matchesByFixture = response.data.fixturesWithMatches;
          this.nextFixture = this.matchesByFixture
            .filter((m) => new Date(m.fixture.deadlineDate) > new Date())
            .sort(function (a, b) {
              return (
                new Date(a.fixture.deadlineDate) -
                new Date(b.fixture.deadlineDate)
              );
            })[0];
          this.$store.commit("setNextFixture", this.nextFixture);
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>

<style scoped>
.nav-link {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.navbar-nav .cart {
  background-color: var(--PRIMARY) !important;
  color: white;
  border-radius: 10px;
}

.navbar-nav .cart:hover,
.navbar-nav .cart:focus {
  background-color: var(--PRIMARY-DARKER) !important;
  color: white;
}

.cart-money {
  font-size: smaller;
}

.first-letter {
  border: 2px solid var(--PRIMARY);
  border-radius: 50%;
  /*color: var(--PRIMARY);*/
}

.first-letter:hover,
.first-letter:focus {
  box-shadow: none;
  color: white;
  background-color: var(--PRIMARY);
}

.dropdown-menu {
  padding: 0;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  border: none;
  overflow: hidden;
}
.navbar {
  overflow: visible !important; /* override any Bootstrap overflow hiding */
}

.dropdown-menu {
  position: absolute !important;
  z-index: 9999;
  margin-top: 0;
}
.dropdown-item {
  padding: 0.75rem 1rem;
}

.dropdown-item:hover,
.dropdown-item:focus,
.dropdown-item.active,
.dropdown-item:active {
  background-color: var(--GREY-LIGHT);
}

.btn-no-style:focus {
  box-shadow: none;
}
.active-tournament {
  background-color: var(--GREY-LIGHT);
  color: var(--PRIMARY);
}

.inform {
  color: var(--PRIMARY);
  font-size: x-small;
}

.flag {
  height: 5vh;
  /* height: min-content; */
  object-fit: cover;
  border-radius: 2px;
  color: VAR(--PRIMARY);
  filter: invert(100%) opacity(0.8) drop-shadow(0 0 0 VAR(--PRIMARY));
  /* filter: invert(100%); */
}
.deadline-banner {
  background-color: var(--PRIMARY);
}

.deadline-banner-danger {
  background-color: var(--ERROR);
}

.deadline-banner-warning {
  background-color: var(--WARNING);
}

/* Add to scoped styles */

/* Prevent the whole navbar from overflowing */
.navbar-expand-md {
  max-width: 100vw;
  position: relative;
}

/* Constrain the deadline banner */
.deadline-banner,
.deadline-banner-danger,
.deadline-banner-warning {
  color: white;
  text-align: center;
  font-size: 14px;
  padding: 6px 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  box-sizing: border-box;
}

/* Prevent brand from pushing nav off screen */
.navbar-brand {
  font-size: clamp(12px, 3vw, 18px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 45vw;
}

/* Constrain flag size on mobile */
.flag {
  height: 4vh;
  max-height: 30px;
}

@media (max-width: 768px) {
  .navbar-brand {
    max-width: 60vw;
    font-size: 13px;
  }

  .flag {
    height: 24px;
  }

  /* Collapsed menu should not overflow */
  .navbar-collapse {
    max-width: 100%;
    /* overflow-x: hidden; */
  }

  .navbar-nav {
    width: 100%;
  }

  .nav-item {
    width: 100%;
  }
  .dropdown-menu-end {
    right: auto;
    left: auto;
  }
}
</style>
