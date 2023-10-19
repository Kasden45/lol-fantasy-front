<template>
    <td v-if="participantData != null">{{ participantData.userId }}</td>
    <td v-if="participantData != null">{{ participantData.userLogin }}

        <div v-if="participantData != null && participantData.userTeam != null && showDetails" >
                            <PlayerPointsGamesCard :gamesPointsDetails="participantData.userTeam.topPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.topPlayerPoints.totalPoints"/>
                            <PlayerPointsGamesCard :gamesPointsDetails="participantData.userTeam.junglePlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.junglePlayerPoints.totalPoints"/>
                            <PlayerPointsGamesCard :gamesPointsDetails="participantData.userTeam.midPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.midPlayerPoints.totalPoints"/>
                            <PlayerPointsGamesCard :gamesPointsDetails="participantData.userTeam.bottomPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.bottomPlayerPoints.totalPoints"/>
                            <PlayerPointsGamesCard :gamesPointsDetails="participantData.userTeam.supportPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.supportPlayerPoints.totalPoints"/>
                            <PlayerPointsGamesCard :gamesPointsDetails="participantData.userTeam.subPlayerPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.subPlayerPoints.totalPoints"/>
                            <TeamPointsGamesCard :gamesPointsDetails="participantData.userTeam.teamPoints.gamesPointsDetails" :totalPointsA="participantData.userTeam.teamPoints.totalPoints"/>
                </div>

    </td>
    <td v-if="participantData != null">{{ participantData.userTeam ? participantData.userTeam.totalPoints : (participantData.points != null ? participantData.points : 0) }} pts</td>
    <!-- <td>{{ participant.joinedAt }}</td> -->
    <td v-if="participantData != null && participantData.userTeam != null">
        <button @click="toggleDetailsVisibility" data-toggle="modal" data-target="#sda">
            {{ showDetails ? 'Hide team' : 'Show team' }}
        </button>
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
    toggleDetailsVisibility() {
      this.showDetails = !this.showDetails;
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

</style>