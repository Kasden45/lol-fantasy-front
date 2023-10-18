<template>
    <div class="player-card" v-if="teamDetails != null">
      <div class="player-details row">
        <div class="left-section col-md-3">
          <div class="player-info">
            <img :src="teamDetails.imageUrl" alt="Player Image" />
            <p>{{ teamDetails.name }}</p>
            <p class="role">{{ teamDetails.code }}</p>
            <p>{{ teamDetails.league }}</p>
            <p class="points" v-if="totalPoints != null">{{ totalPoints }} pts</p>
          </div>
        </div>
        <div class="col-md-9">
            <div class="right-section player-points-scrollable ">
                <table class="points-table px-2">
                    <thead>
                    <tr>
                        <th>Event</th>
                        <th>Value</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(points, event) in teamDetails.pointsDetails" :key="event">
                        <td class="points-event">{{ event }}</td>
                        <td class="points-value">{{ points.value }}</td>
                        <td class="points">{{ points.points }}</td>
                    </tr>
                    </tbody>
                </table>
                <div class="total-points pe-2">
                    <p>Game points: {{ teamDetails.points }}</p>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TeamPointsCard",
    props:{
        teamDetails: Object,
        totalPoints: Number
    },
    
    data() {
        return {
            
        }
    },
    methods: {
    calculateTotalPoints(pointsDetails) {
      return Object.values(pointsDetails).reduce((total, points) => total + points.points, 0);
    },
  },
  watch: {
    // Watch for changes in the 'playerDetails' prop
    teamDetails: {
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
.player-card {
    width: auto;
  display: flex;
  border: 1px solid #ddd;
  margin: 10px;
  padding: 10px;
  /* max-width: 400px; */
  max-height: 250px;
}

.player-details {
  display: flex;
  width: 100%;
  height: inherit;
}

.left-section {
  padding: 10px;
  text-align: center;
  height: 200px;
}

.right-section {
  flex: 2;
  overflow-y: scroll;
  height: 200px;
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
}

.points-table th, .points-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.total-points {
  text-align: right;
  margin-top: 20px;
  font-weight: bold;
}

.player-points-scrollable {
  flex: 1; /* Make this part expand to fill available space */
  overflow-y: scroll;
  /* Adjust the height and other styles as needed */
}

.points-event {
    font-weight: 400;
}
.points-value {
    font-weight: 300;
}
.points {
    font-weight: 500;
}

::-webkit-scrollbar {
    width: 5px;
    height: 15px;
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
</style>