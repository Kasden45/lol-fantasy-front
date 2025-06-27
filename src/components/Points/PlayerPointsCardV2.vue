<template>
    <div class="player-card" :class="{'captain' : this.isCaptain, 'sub' : this.isSub} " v-if="playerDetails != null">
      <div class=" row">
        <h2 class="text-center">{{ title }}</h2>
        
        <div class="col-md-12">
            <div class="">
                <table class="points-table px-2">
                    <thead>
                    <tr>
                        <th>Event</th>
                        <th></th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(points, event) in playerDetails.pointsDetails" :key="event">
                        <td class="points-event">{{ eventDisplay[event] }}</td>
                        <td class="points-value">{{ points.value != null ? points.value : '-' }}</td>
                        <td class="points" :class="{'negative-points': points.points<0}">{{ points.points }}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="total-points pe-2">
                    <span >Game points: </span>
                    <span :class="{'crossed':this.isCaptain}">{{ playerDetails.points.toFixed(2) }} </span>
                    <span v-if="this.isCaptain">  => {{ (playerDetails.points*2).toFixed(2) }}</span>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>

  export default {
    name: "PlayerPointsCardV2",
    props:{
        playerDetails: Object,
        totalPoints: Number,
        isCaptain: Boolean,
        isSub: Boolean,
        title: String
    },
    
    data() {
        return {
            eventDisplay:{
              kills: 'Kills',
              assists: 'Assists',
              deaths: 'Deaths',
              trippleKills: 'Triples',
              quardaKills: 'Quadras',
              pentaKills: 'Pentas',
              nashorSteals: 'Nashor steals',
              drakeSteals: 'Drake steals',
              creepScore: 'CS',
              firstBlood: 'FB',
              over10KillsAssists: 'K + A > 10',
            }
        }
    },
    methods: {
    calculateTotalPoints(pointsDetails) {
      return Object.values(pointsDetails).reduce((total, points) => total + points.points, 0);
    },
  },
  watch: {
    // Watch for changes in the 'playerDetails' prop
    playerDetails: {
      handler(newPlayerDetails, oldPlayerDetails) {
        // React to prop changes here
        // playerDetails = 
        console.log(newPlayerDetails, oldPlayerDetails);
      },
      immediate: true, // This will trigger the handler immediately when the component is created
    },
  },
};
  </script>
  
  <style scoped>
  .role:first-letter {
    text-transform: capitalize;
  }
table, tr, td {
    border: none;
}

@media (max-width: 1000px) {
  .player-card {
    width: auto;
    display: flex;
    border: 1px solid #ddd;
    margin: 3px;
    padding: 3px;
    /* max-width: 400px; */
    /* max-height: 250px; */
}
}
.player-details {
  display: flex;
  width: 100%;
  height: inherit;
}

.left-section {
  padding: 10px;
  text-align: center;
  /* height: 800px; */
}

.right-section {
  flex: 2;
  overflow-y: scroll;
  /* height: 800px; */
}

.player-info img {
  max-width: 100px;
}

.player-info p{
  font-size: small;
  margin-bottom: 5px;
}
.points-table {
  width: 100%;
  border-collapse: collapse;
  border: none;
}

.points-table th, .points-table td {
  border-bottom: 1px solid #ddd;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
  text-align: left;
}

.total-points {
  text-align: right;
  margin-top: 20px;
  font-weight: bold;
}

.player-points-scrollable {
  flex: 1; /* Make this part expand to fill available space */
  overflow-y: visible;
  /* Adjust the height and other styles as needed */
}
.negative-points {
  color: red;
}
.points-event {
    font-weight: 500;
}
.points-value {
    font-weight: 300;
}
.points {
    font-weight: 500;
}

::-webkit-scrollbar {
    width: 5px;
    height: 15px !important;
    background-color: var(--DARK-YELLOW);
}

.section-bg ::-webkit-scrollbar {
    background-color: gray;
}

::-webkit-scrollbar-track {
    --webkit-box-shadow: inset 0 0 6px rgba(200, 200, 200, 1);
    border-radius: 3px;
}

.sport ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: var(--SPORT);
    --webkit-box-shadow: inset 0 0 6px rgba(90, 90, 90, 0.7);
}

::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: rgb(150, 79, 150);
    --webkit-box-shadow: inset 0 0 6px rgba(90, 90, 90, 0.7);
}

.captain {
  background-color: rgba(224, 191, 3, 0.747);
}
.sub {
  background-color: rgba(114, 106, 106, 0.432);
}
.crossed {
  text-decoration: line-through;
}
</style>