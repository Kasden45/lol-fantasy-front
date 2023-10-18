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
            // playerPointsDetails : {
        //   gamesPointsDetails: [
        //     {
        //       "pointsDetails": {
        //         "kills": {
        //           "value": 1,
        //           "points": 3
        //         },
        //         "assists": {
        //           "value": 10,
        //           "points": 20
        //         },
        //         "deaths": {
        //           "value": 0,
        //           "points": 0
        //         },
        //         "trippleKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "quardaKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "pentaKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "nashorSteals": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "drakeSteals": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "creepScore": {
        //           "value": 131,
        //           "points": 3.9299999999999997
        //         },
        //         "firstBlood": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "over10KillsAssists": {
        //           "value": false,
        //           "points": 0
        //         }
        //       },
        //       "esportsPlayerId": "105830645287286396",
        //       "firstName": "Théo",
        //       "lastName": "Borile",
        //       "summonerName": "Sheo",
        //       "role": "jungle",
        //       "imageUrl": "http://static.lolesports.com/players/1693406244105_sheo.png",
        //       "price": 6,
        //       "points": 26.93,
        //       "team": {
        //         "esportsTeamId": "107563714667537640",
        //         "slug": "team-bds",
        //         "name": "Team BDS",
        //         "region": "EMEA",
        //         "league": "LEC",
        //         "code": "BDS",
        //         "imageUrl": "http://static.lolesports.com/teams/1641292031788_Team_BDSlogo_square.png",
        //         "backgroundImageUrl": null,
        //         "price": 8,
        //         "points": 0
        //       }
        //     },
        //     {
        //       "pointsDetails": {
        //         "kills": {
        //           "value": 0,
        //           "points": 0
        //         },
        //         "assists": {
        //           "value": 4,
        //           "points": 8
        //         },
        //         "deaths": {
        //           "value": 1,
        //           "points": -1
        //         },
        //         "trippleKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "quardaKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "pentaKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "nashorSteals": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "drakeSteals": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "creepScore": {
        //           "value": 173,
        //           "points": 5.1899999999999995
        //         },
        //         "firstBlood": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "over10KillsAssists": {
        //           "value": false,
        //           "points": 0
        //         }
        //       },
        //       "esportsPlayerId": "105830645287286396",
        //       "firstName": "Théo",
        //       "lastName": "Borile",
        //       "summonerName": "Sheo",
        //       "role": "jungle",
        //       "imageUrl": "http://static.lolesports.com/players/1693406244105_sheo.png",
        //       "price": 6,
        //       "points": 12.19,
        //       "team": {
        //         "esportsTeamId": "107563714667537640",
        //         "slug": "team-bds",
        //         "name": "Team BDS",
        //         "region": "EMEA",
        //         "league": "LEC",
        //         "code": "BDS",
        //         "imageUrl": "http://static.lolesports.com/teams/1641292031788_Team_BDSlogo_square.png",
        //         "backgroundImageUrl": null,
        //         "price": 8,
        //         "points": 0
        //       }
        //     },
        //     {
        //       "pointsDetails": {
        //         "kills": {
        //           "value": 0,
        //           "points": 0
        //         },
        //         "assists": {
        //           "value": 6,
        //           "points": 12
        //         },
        //         "deaths": {
        //           "value": 4,
        //           "points": -4
        //         },
        //         "trippleKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "quardaKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "pentaKills": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "nashorSteals": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "drakeSteals": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "creepScore": {
        //           "value": 177,
        //           "points": 5.31
        //         },
        //         "firstBlood": {
        //           "value": null,
        //           "points": 0
        //         },
        //         "over10KillsAssists": {
        //           "value": false,
        //           "points": 0
        //         }
        //       },
        //       "esportsPlayerId": "105830645287286396",
        //       "firstName": "Théo",
        //       "lastName": "Borile",
        //       "summonerName": "Sheo",
        //       "role": "jungle",
        //       "imageUrl": "http://static.lolesports.com/players/1693406244105_sheo.png",
        //       "price": 6,
        //       "points": 13.309999999999999,
        //       "team": {
        //         "esportsTeamId": "107563714667537640",
        //         "slug": "team-bds",
        //         "name": "Team BDS",
        //         "region": "EMEA",
        //         "league": "LEC",
        //         "code": "BDS",
        //         "imageUrl": "http://static.lolesports.com/teams/1641292031788_Team_BDSlogo_square.png",
        //         "backgroundImageUrl": null,
        //         "price": 8,
        //         "points": 0
        //       }
        //     }
        //   ]
        // //   ,
        // //   "playerId": "105830645287286396",
        // //   "fixtureId": 1,
        // //   "totalPoints": 52.42999999999999
        // // }
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