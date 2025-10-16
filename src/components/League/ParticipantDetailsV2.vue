<template>
      <div class="row team-row justify-content-start align-content-center">
        <div class="col-xl-3 col-lg-4  col-md-5  col-sm-6 col-8 align-content-center">
          <PlayerPoints 
          :is-triple="participantData.userTeam.chipUsed == 1"
          :is-captain="participantData.userTeam.captain==1" 
          @showDetails="showDetailsModal"
          :playerPoints="participantData.userTeam.topPlayerPoints"
          @captainPick="pickCaptain" 
          v-if="participantData.userTeam != null" 
          :role="'top'" 
          :teamPlayer="participantData.userTeam.topPlayerPoints.player" 
          :img_url="role_images['top']" 
          :roles_img_url="role_images"/>
        </div>
        <div class="col-xl-3 col-lg-4  col-md-5  col-sm-6 col-8 align-content-center">
          <PlayerPoints 
          :is-triple="participantData.userTeam.chipUsed == 1"
          :is-captain="participantData.userTeam.captain==2" 
          @showDetails="showDetailsModal"
          :playerPoints="participantData.userTeam.junglePlayerPoints"
          @captainPick="pickCaptain"
          v-if="participantData.userTeam != null" 
          :role="'jungle'" 
          :teamPlayer="participantData.userTeam.junglePlayerPoints.player" 
          :img_url="role_images['jungle']"
          :roles_img_url="role_images"
        />
        </div>
        <div class="col-xl-3 col-lg-4  col-md-5  col-sm-6 col-8 align-content-center">
          <PlayerPoints 
          :is-triple="participantData.userTeam.chipUsed == 1"
          :is-captain="participantData.userTeam.captain==3" 
          @showDetails="showDetailsModal"
          :playerPoints="participantData.userTeam.midPlayerPoints"
          v-if="participantData.userTeam != null" 
          :role="'mid'" 
          :teamPlayer="participantData.userTeam.midPlayerPoints.player" 
          :img_url="role_images['mid']" 
          :roles_img_url="role_images"
          @captainPick="pickCaptain"
        />
        </div>
        <div class="col-xl-3 col-lg-4  col-md-5  col-sm-6 col-8 col-offset-2 align-content-center">
                <PlayerPoints 
                :is-triple="participantData.userTeam.chipUsed == 1"
                :is-captain="participantData.userTeam.captain==4" 
                @showDetails="showDetailsModal"
                :playerPoints="participantData.userTeam.bottomPlayerPoints"
                v-if="participantData.userTeam != null" 
                :role="'bottom'" 
                :teamPlayer="participantData.userTeam.bottomPlayerPoints.player" 
                :img_url="role_images['bottom']" 
                :roles_img_url="role_images"
                @captainPick="pickCaptain"
                />
        </div>
        <div class="col-xl-3 col-lg-4  col-md-5  col-sm-6 col-8 align-content-center">
                <PlayerPoints 
                :is-triple="participantData.userTeam.chipUsed == 1"
                :is-captain="participantData.userTeam.captain==5"
                @showDetails="showDetailsModal"
                :playerPoints="participantData.userTeam.supportPlayerPoints"
                v-if="participantData.userTeam != null" 
                :role="'support'" 
                :teamPlayer="participantData.userTeam.supportPlayerPoints.player" 
                :img_url="role_images['support']" 
                :roles_img_url="role_images"
                @captainPick="pickCaptain"
                />
        </div>
        <div class="col-xl-3 col-lg-4  col-md-5  col-sm-6 col-8 align-content-center">
                <TeamPoints 
                v-if="participantData.userTeam != null" 
                :role="'team'" 
                @showDetails="showDetailsModal"
                :teamTeam="participantData.userTeam.teamPoints.team" 
                :teamPoints="participantData.userTeam.teamPoints"
                :img_url="role_images['team']" 
                :roles_img_url="role_images"
                />
        </div>
        <div class="col-xl-3 col-lg-4  col-md-5  col-sm-6 col-8 align-content-center">
          <PlayerPoints 
          @showDetails="showDetailsModal"
          :playerPoints="participantData.userTeam.subPlayerPoints"
          :isbenchboost="participantData.userTeam.chipUsed == 4"
          v-if="participantData.userTeam != null" 
          :role="'sub'" 
          :teamPlayer="participantData.userTeam.subPlayerPoints.player" 
          :img_url="role_images['sub']" 
          :roles_img_url="role_images"
          />
        </div>
      </div>
      <div class="row justify-content-center">
        
      </div>
    <div>
        <MyModal :openModal="this.openModal" @closeModal="closeDetailsModal" :title="`${participant.userLogin}'s ${fixture.title} points details`">
            <div v-if="participantData != null && participantData.userTeam != null && detailsData.team == null" class="team-points " ref="pointsContainer">
                <PlayerPointsGamesCardV2 class="team-points-details align-content-center" :gamesList="fixtureGames" :isCaptain="participantData.userTeam.captain == 1" :gamesPointsDetails="detailsData.gamesPointsDetails" :totalPointsA="detailsData.totalPoints"/>
            </div>
            <div v-if="participantData != null && participantData.userTeam != null && detailsData.team != null" class="team-points " ref="pointsContainer">
                <TeamPointsGamesCardV2 class="team-points-details align-content-center" :gamesList="fixtureGames" :isCaptain="false" :gamesPointsDetails="detailsData.gamesPointsDetails" :totalPointsA="detailsData.totalPoints"/>
            </div>
        </MyModal>
    </div>
        
</template>

<script>
    import MyModal from '@/components/MyModal.vue';
    import PlayerPointsGamesCardV2 from '@/components/Points/PlayerPointsGamesCardV2.vue';
  import TeamPointsGamesCardV2 from '@/components/Points/TeamPointsGamesCardV2.vue';
  import PlayerPoints from '@/components/Points/PlayerPoints.vue';
  import TeamPoints from '@/components/Points/TeamPoints.vue';
  export default {
    name: "ParticipantDetails",
    components: {
      MyModal,
      PlayerPointsGamesCardV2,
      TeamPointsGamesCardV2,
      PlayerPoints,
      TeamPoints
  },
  props: {
    participant: Object,
    fixtureGames: Array,
    fixture: Object
  },
    data() {
      return {
        role_images:{
          top: "https://cdn3.emoji.gg/emojis/7990-lol-role-top.png",
          jungle: "https://cdn3.emoji.gg/emojis/1152-lol-role-jungle.png",
          mid: "https://cdn3.emoji.gg/emojis/6934-lol-role-mid.png",
          bottom: "https://cdn3.emoji.gg/emojis/9366-lol-role-bot.png",
          support: "https://cdn3.emoji.gg/emojis/7990-lol-role-support.png",
          sub: "https://cdn3.emoji.gg/emojis/2724-lol-role-fill.png",
          team: "https://i.imgur.com/bLArMp2.png"
        },
        participantData: null,
        openModal: false,
        detailsData: null,
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
        console.log(newparticipant, oldparticipant);
        this.participantData = this.participant;
        this.correctEmptyPlayers();
      },
      immediate: true,
    },
  },
    methods: {
    showDetailsModal(detailsData) {
        console.log("details")
        console.log(detailsData)
        this.openModal = true
        this.detailsData = detailsData
    },
    closeDetailsModal(name) {
        console.log("details close")
        this.openModal = false
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
      this.showDetails = !this.showDetails;
    },
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
.team-row {
  flex-wrap: nowrap;
  height: 10vh !important;
  /* overflow-x: scroll; */
}
.fill-height {
  height: 100%;
  display: flex;
  align-items: center;
}
.team-points {
  display: flex;
  overflow-x: auto;
}

.team-points-details {
  flex: 0 0 auto; /* Optional: Add some space between cards */
  height: 50%;
  max-width: 70vw;
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