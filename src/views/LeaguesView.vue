<template>
    <div>
      <!-- Create League Section -->
      <div>
        <h2>Create a League</h2>
        <input v-model="newLeagueName" placeholder="Enter league name" />
        <button @click="createLeague">Create League</button>
      </div>
  
      <!-- Join League Section -->
      <div>
        <h2>Join a League</h2>
        <input v-model="invitationCode" placeholder="Enter invitation code" />
        <button @click="joinLeague">Join League</button>
      </div>
  
      <!-- List of Leagues the User Is In -->
      <h2>Your Leagues</h2>
      <div class="container">

        <div class="row w-50 justify-content-md-center m-auto my-2" v-for="league in userLeagues" :key="league.invitationCode">
          <div class="col-md-6 league-name ">
            {{ league.name }}
          </div>
          <div class="col-md-6">
            <router-link
              class="btn details btn-info"
              :class="{ active: this.$route.name === 'Offer' }"
              :to="{ name: 'SingleLeagueView', params: {leagueCode: league.invitationCode} }"
              >Details</router-link>
          </div>
        </div>
      </div>
          
          <!-- <button @click="getLeagueDetails(league.invitationCode)">View Details</button> -->
          
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        newLeagueName: "",
        invitationCode: "",
        userLeagues: [],
        currentLeague: null,
      };
    },
    methods: {
      async createLeague() {
        try {
          const response = await this.axios.post(`${this.apiURL}User/league/create`, {
            idOwner: this.$store.getters.getProfileId, // Set the user's ID
            name: this.newLeagueName,
          });
          // Add the created league to the list of user leagues
          this.userLeagues.push(response.data);
          this.newLeagueName = ""; // Clear the input field
        } catch (error) {
          console.error("Error creating league:", error);
        }
      },
      async joinLeague() {
        try {
          const response = await this.axios.post(`${this.apiURL}User/league/join`, {
            userId: this.$store.getters.getProfileId, // Set the user's ID
            invitationCode: this.invitationCode,
          });
          // Add the joined league to the list of user leagues
          this.userLeagues.push(response.data);
          this.invitationCode = ""; // Clear the input field
        } catch (error) {
          console.error("Error joining league:", error);
        }
      },
      async getLeagueDetails(invitationCode) {
        try {
          const response = await this.axios.get(`${this.apiURL}User/league/${invitationCode}`);
          this.currentLeague = response.data;
        } catch (error) {
          console.error("Error fetching league details:", error);
        }
      },
      async fetchUserLeagues() {
      try {
        const response = await this.axios.get(`${this.apiURL}User/leagues/${this.$store.getters.getProfileId}`); // Replace with the correct endpoint
        this.userLeagues = response.data;
      } catch (error) {
        console.error("Error fetching user leagues:", error);
      }
    },
    },
    mounted() {
      // Fetch the list of leagues the user is in when the component is mounted
      this.fetchUserLeagues();
    },
    
  };
  </script>

<style scoped>
.league-name {
  font-size: medium;
  font-weight: 500;
  text-align: end;
  align-self: center;
}
.details {
  display: flex;
    align-items: flex-start;
    width: fit-content;
}
</style>
  