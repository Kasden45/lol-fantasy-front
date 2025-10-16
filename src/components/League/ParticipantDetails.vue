<template>
    <!-- <td v-if="participantData != null">
        <div v-if="participantData != null && participantData.userTeam != null && showDetails" class="team-points vh-80 align-content-center py-auto fill-height d-flex align-items-center">
            <div class="col-6 d-flex justify-self-start">
                <button class="btn btn-info btn-purple" @click="scrollLeft">&lt;</button>
            </div>
        </div>
    </td> -->
    <td  v-if="participantData != null"><p class="mb-0">{{ participantData.userLogin }}</p>
        <p v-if="participantData.userChips !== null"><span v-for="chip in participantData.userChips" :key="chip.id">
            <i class="fa-solid"
            :class="{
                'fa-star': chip.id == 1,
                'fa-dollar-sign': chip.id == 2,
                'fa-infinity': chip.id == 3,
                'fa-chair': chip.id == 4,
                'chip-used': chip.userStatus == 3 ,
                'chip-active': chip.userStatus == 2,
                'chip-available': chip.userStatus == 0 || chip.userStatus == 1,
            }"
            ></i>
            
        </span></p>
        
        <span v-if="participantData.userTeam != null && participantData.userTeam.chipUsed != null">
            <i class="fa-solid chip-active"
            :class="{
                'fa-star': participantData.userTeam.chipUsed == 1,
                'fa-dollar-sign': participantData.userTeam.chipUsed == 2,
                'fa-infinity': participantData.userTeam.chipUsed == 3,
                'fa-chair': participantData.userTeam.chipUsed == 4
            }"
            ></i>
        </span>
        <!-- <div v-if="participantData != null && participantData.userTeam != null && showDetails" class="team-points" ref="pointsContainer">
            <PlayerPointsGamesCard class="team-points-details" :gamesList="fixtureGames" :isCaptain="participantData.userTeam.captain == 1" :gamesPointsDetails="participantData.userTeam.topPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.topPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard class="team-points-details" :gamesList="fixtureGames" :isCaptain="participantData.userTeam.captain == 2" :gamesPointsDetails="participantData.userTeam.junglePlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.junglePlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard class="team-points-details" :gamesList="fixtureGames" :isCaptain="participantData.userTeam.captain == 3" :gamesPointsDetails="participantData.userTeam.midPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.midPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard class="team-points-details" :gamesList="fixtureGames" :isCaptain="participantData.userTeam.captain == 4" :gamesPointsDetails="participantData.userTeam.bottomPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.bottomPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard class="team-points-details" :gamesList="fixtureGames" :isCaptain="participantData.userTeam.captain == 5" :gamesPointsDetails="participantData.userTeam.supportPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.supportPlayerPoints.totalPoints"/>
            <PlayerPointsGamesCard class="team-points-details" :gamesList="fixtureGames" :isSub="true" :gamesPointsDetails="participantData.userTeam.subPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.subPlayerPoints.totalPoints"/>
            <TeamPointsGamesCard  class="team-points-details" :gamesList="fixtureGames" :gamesPointsDetails="participantData.userTeam.teamPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.teamPoints.totalPoints"/>
        </div> -->

    </td>
    <td :class="{'showing-details' : showDetails}" v-if="participantData != null">
        <div v-if="!showDetails">
            {{ participantData.userTeam ? participantData.userTeam.totalPoints : (participantData.points != null ? participantData.points : 0) }} pts        
        </div>
    </td>  
       
        
</template>

<script>
    import PlayerPointsGamesCard from '@/components/PlayerPointsGamesCard.vue';
  import TeamPointsGamesCard from '@/components/Points/TeamPointsGamesCard.vue';
  export default {
    name: "ParticipantDetails",
    components: {
      PlayerPointsGamesCard,
      TeamPointsGamesCard
  },
  props: {
    participant: Object, // Pass the participant data as a prop
    fixtureGames: Array
  },
    data() {
      return {
        participantData: null,
        newLeagueName: "",
        invitationCode: "",
        showDetails : false,
        showTeamDetailsModal: false,
      }
    },
    mounted () {
        console.log(this.participantData)
        console.log(this.participant)
        this.participantData = this.participant;
        console.log(this.participantData)
        console.log(this.participant)
        this.correctEmptyPlayers();
    },
    watch: {
    // Watch for changes in the 'playerDetails' prop
    participant: {
      handler(newparticipant, oldparticipant) {
        // React to prop changes here
        // playerDetails = 
        console.log(newparticipant, oldparticipant);
        this.participantData = this.participant;
        this.correctEmptyPlayers();
      },
      immediate: true, // This will trigger the handler immediately when the component is created
    },
  },
    methods: {
    setActiveUser(user) {
        this.$emit('setActive', user);
    },
    scrollRight() {
      const cardWidth = this.$refs.pointsContainer.children[0].offsetWidth; // get width of the first card
      const scrollAmount = cardWidth; // scroll width for 4 cards
      this.$refs.pointsContainer.scrollLeft += scrollAmount; // scroll right
    },
    scrollLeft() {
      const cardWidth = this.$refs.pointsContainer.children[0].offsetWidth; // get width of the first card
      const scrollAmount = cardWidth; // scroll width for 4 cards
      this.$refs.pointsContainer.scrollLeft -= scrollAmount; // scroll left
    },
    toggleDetailsVisibility() {
    //   this.showDetails = !this.showDetails;
      this.setActiveUser(this.participantData);
    //   if(this.showDetails) 
    //     this.openModal();
    },
    // openModal() {
    //   this.showTeamDetailsModal = true;
    // },
    // closeModal() {
    //   this.showTeamDetailsModal = false;
    // },
    // Other methods
    correctEmptyPlayers() {
            if(this.participantData.userTeam == null)
                return;

            if(this.participantData.userTeam.topPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.participantData.userTeam.topPlayerPoints.gamesPointsDetails = [this.participantData.userTeam.topPlayerPoints.player]
            }
            if(this.participantData.userTeam.junglePlayerPoints.gamesPointsDetails.length == 0)
            {
                this.participantData.userTeam.junglePlayerPoints.gamesPointsDetails = [this.participantData.userTeam.junglePlayerPoints.player]
            }
            if(this.participantData.userTeam.midPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.participantData.userTeam.midPlayerPoints.gamesPointsDetails = [this.participantData.userTeam.midPlayerPoints.player]
            }
            if(this.participantData.userTeam.bottomPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.participantData.userTeam.bottomPlayerPoints.gamesPointsDetails = [this.participantData.userTeam.bottomPlayerPoints.player]
            }
            if(this.participantData.userTeam.supportPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.participantData.userTeam.supportPlayerPoints.gamesPointsDetails = [this.participantData.userTeam.supportPlayerPoints.player]
            }
            if(this.participantData.userTeam.subPlayerPoints.gamesPointsDetails.length == 0)
            {
                this.participantData.userTeam.subPlayerPoints.gamesPointsDetails = [this.participantData.userTeam.subPlayerPoints.player]
            }
            if(this.participantData.userTeam.teamPoints.gamesPointsDetails.length == 0)
            {
                this.participantData.userTeam.teamPoints.gamesPointsDetails = [this.participantData.userTeam.teamPoints.team]
            }
        }
  },
}

</script>
<style scoped>
.fill-height {
  height: 100%;
  display: flex;
  align-items: center;
}
.team-points {
  display: flex;
  max-width: 700px;
  overflow-x: auto;
}

.team-points-details {
  flex: 0 0 auto; /* Optional: Add some space between cards */
  height: 100%;
  min-width: 500px;
}

::-webkit-scrollbar {
    width: 10px;
    height: 20px;
}
#panel {
    height: 100%;
}

.w-80 {
    width: 80%;
}

.login-input, .account-btn {
    border-radius: 15px;
    border: none;

}

.login-input {
    box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.15) !important;
    padding: 15px 10px;
}

.register-input {
    border-radius: 25px;
    border-color: grey;
}
.chip-used {
    color: var(--RED-USED-CHIP);
    margin-right: 5px;
}
.chip-active {
    color: var(--GOLDEN-CAPTAIN);
    margin-right: 5px;
}
.chip-available {
    color: var(--BENCH-BOOST);
    margin-right: 5px;
}
.account-btn {
    color: white;
    font-size: 2vw;
    font-weight: bold;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    padding: 5px;
}

.pink-btn {
    background: pink;
}

.grey-btn {
    background: gray;
}

input.has-error {
    border: 1px solid pink;
}

p.has-error {
    color: pink;
    /*font-weight: bold;*/
}
.register-btn {
    color: white;
    font-size: 120%;
    font-weight: bold;
    border-radius: 15px;
    border: none;
    width: 100%;
}

.btn-purple {
  background-color: var(--PRIMARY-LIGHTER);
  font-weight: 800;
  color: white;
  border: none;
}
</style>