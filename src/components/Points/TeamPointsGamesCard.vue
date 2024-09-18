<template>
  <div class="player-game-points">
    <!-- Display points for the selected game using PlayerCard component -->
    <div class="game-points" v-if="selectedGame != null">
      <div class="game-tabs ms-2">
      <div
        v-for="(game, index) in gamesPointsDetails"
        :key="index"
        @click="selectGame(index)"
        :class="{ active: selectedGameIndex === index }"
      >
        Game {{ index + 1 }}
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
}

.game-tabs div {
  cursor: pointer;
  padding: 10px 20px;
  border: 1px solid #ccc;
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
</style>