<template>
    <nav class="navbar navbar-expand-md  bg-white sticky-top">
      <div class="container">
        <a class="navbar-brand">{{ this.tournaments[this.$store.getters.getCurrentTournamentId] }} Fantasy2KPI</a>
        <img
          
          class="flag"
          :src="this.$func_global.leagues_icons[this.tournaments_icons[this.$store.getters.getCurrentTournamentId]]"
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
            <!--          <li class="nav-item pe-3">-->
            <!--            <router-link-->
            <!--              class="nav-link"-->
            <!--              :class="{ active: this.$route.name === 'Dashboard' }"-->
            <!--              :to="{ name: 'Dashboard' }"-->
            <!--              >HOME</router-link-->
            <!--            >-->
            <!--          </li>-->
            <li class="nav-item pe-3">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'Home' }"
                :to="{ name: 'Home' }"
                >Home</router-link
              >
            </li>
            <li class="nav-item pe-3" v-if="(this.$store.getters.getProfileId != null && this.$store.getters.getProfileId != '')">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'TeamSelection' || this.$route.name === 'TeamSelectionV2' }"
                :to="{ name: 'TeamSelection' }"
                >Team Selection</router-link
              >
            </li>
            <li class="nav-item pe-3" v-if="(this.$store.getters.getProfileId != null && this.$store.getters.getProfileId != '')">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'CurrentPointsView' }"
                :to="{ name: 'CurrentPointsView', params: {userId: (this.$store.getters.getProfileId != null && this.$store.getters.getProfileId != '') ? this.$store.getters.getProfileId : 0} }"
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
            <li class="nav-item pe-3" v-if="(this.$store.getters.getProfileId != null && this.$store.getters.getProfileId != '')">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'LeaguesView' }"
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
            <!-- <li class="nav-item pe-3">
              <router-link
                class="nav-link"
                :class="{ active: this.$route.name === 'StatsView' }"
                :to="{ name: 'StatsView' }"
                >Stats<span class="inform"> NEW</span></router-link
              >
            </li> -->
            <li class="nav-item pe-3">
              <div class="dropdown">
                <button
                  class="nav-link"
                  id="dropdownMenuStats"
                  :class="{ active: this.$route.name === 'StatsView' || this.$route.name === 'DreamTeamView' }"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Stats<span class="inform"> NEW</span>
                </button>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuStats"
                >
                  <li>
                    <a @click="this.$router.push({ name: 'DreamTeamView' })"
                    class="dropdown-item"
                    href="#">
                      <span>Dream teams</span>
                      <span class="inform"> NEW</span>
                  </a>
                  </li>
                  <li>
                    <a @click="this.$router.push({ name: 'StatsView' })"
                    class="dropdown-item"
                    href="#">
                      <span>Player stats</span>
                      <span class="inform"> NEW</span>
                  </a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="nav-item pe-3">
              <div class="dropdown">
                <button
                  class="nav-link"
                  id="dropdownMenuLeagues"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Leagues
                </button>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuLeagues"
                >
                  <li>
                    <a @click="this.$router.push({ name: 'LeaguesView' })"
                    class="dropdown-item"
                    href="#">
                      <span>Regular</span>
                      <span class="inform"> NEW</span>
                  </a>
                  </li>
                  <li>
                    <a @click="this.$router.push({ name: 'DraftView' })"
                    class="dropdown-item"
                    href="#">
                      <span>Draft</span>
                      <span class="inform"> NEW</span>
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
                  <span v-if="this.$store.getters.getLogin.length > 0" class="">{{ this.$store.getters.getLogin[0] }}</span>
                </button>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuAccount"
                >
                  <li>
                    <a @click="this.$router.push({ name: 'SettingsView' })"
                    class="dropdown-item"
                    href="#">
                      <span>Settings</span>
                      <span class="inform"> NEW</span>
                  </a>
                  </li>
                  <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.worlds_2023 }" class="dropdown-item" href="#" @click="switchTournament(this.worlds_2023)">
                      WORLDS 2023
                    </a>
                  </li>
                  <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.msi_2024 }" class="dropdown-item" href="#" @click="switchTournament(this.msi_2024)">
                      MSI 2024
                    </a>
                  </li>
                  <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.worlds_2024 }" class="dropdown-item" href="#" @click="switchTournament(this.worlds_2024)">
                      WORLDS 2024
                    </a>
                  </li>
                  <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.msi_2025 }" class="dropdown-item" href="#" @click="switchTournament(this.msi_2025)">
                      MSI 2025
                    </a>
                  </li>
                  <li>
                    <a :class="{ 'active-tournament': this.$store.getters.getCurrentTournamentId === this.worlds_2025 }" class="dropdown-item" href="#" @click="switchTournament(this.worlds_2025)">
                      WORLDS 2025
                    </a>
                  </li>
                  <li v-if="(this.$store.getters.getProfileId != null && this.$store.getters.getProfileId != '')">
                    <a @click="logout" class="dropdown-item" href="#"
                      >Wyloguj się</a
                    >
                  </li> 
                  
                </ul>
              </div>
            </li>
            <!-- <li class="nav-item pe-3">
              <router-link class="nav-link cart px-3" :to="{ name: 'Cart' }">
                <font-awesome-icon :icon="['fa', 'cart-shopping']" />
                <span class="cart-money ms-3 align-self-center"
                  >{{
                    this.$func_global.formatPrice(
                      this.$store.getters.getTotalCost
                    )
                  }}
                  zł</span
                >
              </router-link>
            </li> -->
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: "NavbarAll",
    methods: {
      logout() {
        this.$store.commit("setProfileId", "");
            this.$router.push({ name: "Home" });
      },
      switchTournament(tournamentId){
        this.$store.commit("setCurrentTournamentId", tournamentId);
        this.$router.go();
      }
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

.inform{
  color: var(--PRIMARY);
  font-size:  x-small;
}

.flag {
  height: 5vh;
  /* height: min-content; */
  object-fit: cover;
  border-radius: 2px;
  color: VAR(--PRIMARY);
  filter: invert(100%) opacity(0.8) drop-shadow(0 0 0 VAR(--PRIMARY)) ;
  /* filter: invert(100%); */
}
  </style>