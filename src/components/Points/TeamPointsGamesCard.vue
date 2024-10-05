<template>
  <div class="player-game-points">
    <!-- Display points for the selected game using PlayerCard component -->
    <div class="game-points" v-if="selectedGame != null">
      <div class="game-tabs ms-2">
      <div
        v-for="(game, index) in gamesPointsDetails.sort((a,b) => a.gameId > b.gameId ? 1 : -1)"
        :key="index"
        @click="selectGame(index)"
        :class="{ active: selectedGameIndex === index }"
      >
        <!-- Game {{ index + 1 }} -->
        {{this.getGameHeader(game.gameId)}}
      </div>
    </div>
      <TeamPointsCard :teamDetails="selectedGame" :totalPoints="totalPointsA" v-if="selectedGame" />
    </div>
  </div>
</template>
  
  <script>
  import TeamPointsCard from '@/components/Points/TeamPointsCard.vue';
  export default {
    name: "TeamPointsGamesCard",
    props:{
      gamesList: Array,
      gamesPointsDetails: Array,
      totalPointsA: Number,
    },
    components: {
      TeamPointsCard
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
  max-width: 500px;
  margin: 0 auto;
}

.game-tabs {
  display: flex;
  margin-bottom: 20px;
  overflow-x: scroll;
}

.game-tabs div {
  cursor: pointer;
  padding: 10px 20px;
  border: 1px solid #ccc;
  min-width: 150px;
  border-radius: 4px;
  margin-right: 10px;
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