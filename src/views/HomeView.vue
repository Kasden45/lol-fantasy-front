<!-- TeamSelection.vue -->
<template>
  <div>
    <h1>General Info</h1>
    <div id="login-page" class="justify-content-center h-auto" >
        <div class="row h-auto justify-content-center" id="content">
            <div class="col-md-5 col-sm-11" v-if="profile == null || profile == ''">  
                <login-panel/>
            </div>
        </div>
        <div class="row justify-content-center">
      <div class="col-md-6 ">
        <h2>What is Fantasy LOL?</h2>
        <div class="row pb-4 pt-3">
          <span>Introducing the <b>"2KPI LoL Worlds 2023 Fantasy Game"</b> – where esports enthusiasts get to step into the shoes of a team manager and put their strategic prowess to the test. Just like traditional Fantasy Premier League (FPL) games in the realm of football, our Fantasy format takes the excitement of competitive gaming to a <b>whole new level</b>.
          </span></div>
        <div class="row pb-4">
          <span>
            In this virtual world, participants assemble their <b>dream teams</b> of professional League of Legends players, each with their unique skills and talents. Your mission? To draft the ultimate roster that will accumulate the most points based on <b>real-world performance during the LoL Worlds 2023 tournament</b>.
          </span>
        </div>
        <div class="row pb-4">
          <span>
          You'll need to make <b>strategic decisions</b> on player selection, taking into account their past performance, roles, and game statistics. Points are awarded for various in-game achievements such as <b>kills, assists, and objectives taken</b> – much like in traditional fantasy sports.
        </span>
        </div>
        <div class="row pb-4">
          <span>
          But it's not just about individual player performance. As a Fantasy manager, you'll also need to consider <b>team dynamics</b>. Choosing the right mix of players from the same team can yield additional team synergy points, making team composition a crucial part of your strategy.
        </span>
        </div>
        <div class="row pb-4">
          <span>
          So, whether you're a League of Legends fanatic or simply a strategic mastermind, the <b>2KPI LoL Worlds 2023 Fantasy Game</b> provides an opportunity to immerse yourself in the world of professional esports, compete against friends, and experience the thrill of managing your very own championship-winning team. It's time to unleash your inner coach and <b>claim the title of Fantasy League of Legends champion</b>!
        </span>
        </div>




      </div>
      
      <div class="col-md-3">
        <div class="info-section">
          <h2 class=" pb-4">Rules</h2>
          <table >
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in rules" :key="rule.name">
                <td>{{ rule.name }}</td>
                <td>{{ rule.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PlayerPoints Section -->
        <div class="info-section">
          <h2>Player Points</h2>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in playerPointsRules" :key="rule.name">
                <td>{{ rule.name }}</td>
                <td>{{ rule.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TeamPoints Section -->
        <div class="info-section">
          <h2>Team Points</h2>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in teamPointsRules" :key="rule.name">
                <td>{{ rule.name }}</td>
                <td>{{ rule.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    <!-- Rule Section -->
    
  </div>
</template>

<script>
import LoginPanel from "@/views/LoginView.vue"
export default {
  components: {
    LoginPanel
  },  
  data() {
    return {
      rulesData: [
        // Your rules data here
      ],
    };
  },
  mounted() {
    // Fetch data when the component is mounted
    this.fetchRulesData();
    this.getCurrentFixture();
    // this.profile = 
    console.log(this.profile)
  },
  methods: {
    async fetchRulesData() {
      try {
        const response = await this.axios.get(`${this.apiURL}FantasyPoints/rules`);
        this.rulesData = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    getCurrentFixture() {
            const url = `${this.apiURL}Matches/fixture`

            this.axios.get(url).then((response) => {
                this.$store.commit('setFixtureId', response.data);
                // this.$store.commit('setLastName', response.data['lastName']);
                // this.$store.commit('setProfileId', response.data['id']);
                // this.$store.commit('setProfileImageSrc', response.data['profileImgPath']);
                // this.$store.commit('setDoctorProfile', response.data['doctorProfile']);
                // this.$store.commit('setDieticianProfile', response.data['dieticianProfile']);
                // this.$store.commit('setTrainerProfile', response.data['trainerProfile']);
                // this.$store.commit('setSex', response.data['esex']);
                console.log("Current fixture: ", this.$store.getters.getFixtureId)
                
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
  },
  computed: {
    playerPointsRules() {
      return this.rulesData.filter((rule) => rule.type === 'PlayerPoints');
    },
    teamPointsRules() {
      return this.rulesData.filter((rule) => rule.type === 'TeamPoints');
    },
    rules() {
      return this.rulesData.filter((rule) => rule.type === 'Rule');
    },
    profile() {
    return this.$store.getters.getProfileId;
    }
  },
};
</script>

<style scoped>
.info-section {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

h2 {
  margin: 0;
}

#login-page {
    width: 100%;
    height: 20vh;
    background-image: linear-gradient(to right, var(--DARK-YELLOW) 50%, var(--LIGHT-YELLOW));
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
    font-family: Mistral,serif;
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
</style>