<template>
  <div class="player-game-points row">
    <TeamPointsDetails
      class="col-5"
      v-if="gamesPointsDetails != null" 
      :role="'top'" 
      :teamTeam="gamesPointsDetails[0]"
      :leagues_icons="this.$func_global.leagues_icons"
      :points="totalPointsA"
      :isCaptain="false"
      :img_url="null" 
      :details="true"
      :roles_img_url="this.$func_global.role_images"
    />

    <div class="game-points col-6 offset-1" v-if="selectedGame != null">
      <div class="game-tabs ms-2">
      <div class="mx-3" v-for="(game, index) in gamesPointsDetails.sort((a,b) => a.gameId > b.gameId ? 1 : -1)">

      <TeamPointsCardV2 
        :title="this.getGameHeader(game.gameId)"
        :isSub="false"
        :playerDetails="this.gamesPointsDetails[index]"
        :isCaptain="false"
        :totalPoints="totalPointsA"
        v-if="selectedGame" 
      />
    </div>
    </div>
    </div>
  </div>
</template>
  
  <script>
  import TeamPointsCardV2 from '@/components/Points/TeamPointsCardV2.vue';
  import TeamPointsDetails from '@/components/Points/TeamPointsDetails.vue';
  export default {
    name: "TeamPointsGamesCardV2",
    props:{
      gamesList: Array,
      gamesPointsDetails: Array,
      totalPointsA: Number,
    },
    components: {
      TeamPointsCardV2,
      TeamPointsDetails
    },
    computed: {
    selectedGame() {
        return this.gamesPointsDetails[this.selectedGameIndex];
      },
    },
    data() {
        return {
          selectedGameIndex: 0,
        }
    },
    methods: {
    getGameHeader(gameId) {
        console.log(gameId);
        console.log(this.gamesList);
        var game = this.gamesList.find(game => game.gameId === gameId);
        if(!game) return '';
        var teamCode = this.gamesPointsDetails[0].code;
        return `Game ${game.gameNumber} vs ${game.gameTeam1 == teamCode ? game.gameTeam2 : game.gameTeam1}`;
      },
    calculateTotalPoints(pointsDetails) {
      return Object.values(pointsDetails).reduce((total, points) => total + points.points, 0);
    },
    selectGame(index) {
      this.selectedGameIndex = index;
      console.log(this.selectedGame.pointsDetails);
    }
  }
};
  </script>
  
  <style scoped>
.player-game-points {
  /* max-width: 500px; */
  flex-wrap: nowrap;
  margin: 0 auto;
}

.game-tabs {
  display: flex;
  margin-bottom: 20px;
  overflow-x: scroll;
}

.game-tabs div {
  display: flex;
  width: max-content;
  
}

.game-tabs .active {
  background-color: #007BFF;
  color: #fff;
}

.game-points {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}


::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
</style>