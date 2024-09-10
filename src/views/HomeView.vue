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
      <div class="col-md-5 ">
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
      
      <div class="col-md-4" v-if="this.currentFixture != null">
        <div class="text-danger">
          <h3 v-if="new Date() < new Date('2023-11-02')"> NEW LIMITS FOR UPCOMING FIXTURES </h3>
        </div>
        <div class="game-tabs ms-2 justify-content-md-center fs-6">
          <div
            v-for="(fixture, index) in tabs"
            :key="fixture.order"
            @click="selectTab(fixture.order, fixture.id)"
            :class="{ active: selectedTabIndex === fixture.order }"
          >
            <!-- {{ fixture != 0 ? fixture : 'General' }}  -->
            {{fixture.title}}
          </div>
        </div>
        <!--  -->
        <div class="info-section" v-if="this.currentFixture != null && this.currentFixture.fixture.id != null">
          <h2 class=" pb-4">Fixture {{ this.currentFixture.fixture.id }}</h2>
          <h4 class=" pb-2">{{this.currentFixture.fixture.name}}</h4>
          <h4 :class="{
            'text-danger' : ((new Date(this.currentFixture.fixture.deadlineDateTime) - new Date())/ 36e5) < 48, 
            'text-warning': ((new Date(this.currentFixture.fixture.deadlineDateTime) - new Date())/ 36e5) > 48}">
            Deadline: {{ this.$func_global.formatDate(this.currentFixture.fixture.deadlineDateTime) }}
          </h4>
        {{  }}
        </div>
        
        <div class="info-section" v-if="this.currentFixture != null">
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
        <div class="info-section" v-if="this.currentFixture != null">
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
import LoginPanel from "@/views/LoginView.vue";
export default {
  components: {
    LoginPanel
  },  
  data() {
    return {
      currentFixture: {
        rules: [],
        fixture: {}
      },
        tabs: [], // {id, name, order}
      rulesData: [
        // Your rules data here
      ],
      newRulesData: [
        // Your rules data here
      ],
        selectedTabIndex: 0,
    };
  },
  async mounted() {
    // Fetch data when the component is mounted
    this.getCurrentFixture()
    while ( this.currentFixture.rules.length == 0) {
      await this.fetchRulesData();
    }
    // this.fetchRulesData();
    // this.profile = 
    console.log(this.profile)
  },
  methods: {
      selectTab(index, f){
        var fixture = f != 0 ? f : null;
        this.selectedTabIndex = index;
        console.log(this.selectedTabIndex);
        this.currentFixture = this.newRulesData.find((element) => element.fixture.id == fixture);
      },
    async fetchRulesData() {
      
      try {
        const response = await this.axios.get(`${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/rules`);
        this.newRulesData = response.data;
        this.tabs = response.data.map(function(fix) {
          var newFix = {
                id: fix.fixture.id,
                title: fix.fixture.name,
                order: fix.fixture.id,
              } 
              return newFix;
              
            }).sort((a, b) => a.order - b.order);
            console.log('tabs', this.tabs);

        this.selectTab(this.tabs.find((element) => element.id == this.$store.getters.getFixtureId).order,this.$store.getters.getFixtureId);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    getCurrentFixture() {

            const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixture`

            this.axios.get(url).then((response) => {
                this.$store.commit('setFixtureId', response.data);
                console.log("Current fixture: ", this.$store.getters.getFixtureId)
                
                // this.$router.push({name: 'LeaguesView'})
            }).catch(error => {
                console.log(error.response);
            });
        },
  },
  computed: {
    playerPointsRules() {
      return this.currentFixture.rules.filter((rule) => rule.type === 'PlayerPoints');
    },
    teamPointsRules() {
      return this.currentFixture.rules.filter((rule) => rule.type === 'TeamPoints');
    },
    rules() {
      return this.currentFixture.rules.filter((rule) => rule.type === 'Rule');
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

.game-tabs {
  display: flex;
  margin-bottom: 20px;
}

.game-tabs div {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-right: 7px;
}

.game-tabs .active {
  background-color: #007BFF;
  color: #fff;
}
</style>