<template>
  <div class="summoners-rift">
    <div class="player-card" v-for="player in players" :key="player.id" :style="getPlayerPosition(player)">
      <img :src="player.imageUrl" :alt="player.summonerName" class="player-image" />
      <div class="player-info">
        <div class="player-name">{{ player.summonerName }}</div>
        <div class="player-role">{{ player.role }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "RiftMapPlayer",
  data() {
    return {
      players: [
        { id: 1, summonerName: 'Player1', role: 'top', imageUrl: 'player1.jpg' },
        { id: 2, summonerName: 'Player2', role: 'jungle', imageUrl: 'player2.jpg' },
        { id: 3, summonerName: 'Player3', role: 'mid', imageUrl: 'player1.jpg' },
        { id: 4, summonerName: 'Player4', role: 'bottom', imageUrl: 'player2.jpg' },
        { id: 5, summonerName: 'Player5', role: 'support', imageUrl: 'player1.jpg' }
        // Add more players as needed
      ],
    };
  },
  methods: {
    getPlayerPosition(player) {
      // Implement logic to calculate the position based on player's role
      // Adjust the positioning according to your needs
      switch (player.role) {
        case 'top':
          return { top: '10%', left: '30%' }; // Adjust the values accordingly
        case 'jungle':
          return { top: '40%', left: '40%' };
        case 'mid':
          return { top: '50%', left: '50%' }; // Adjust the values accordingly
        case 'bottom':
          return { top: '80%', left: '60%' };
        case 'support':
          return { top: '90%', left: '70%' }; // Adjust the values accordingly
        // Add more cases for other roles
        default:
          return { top: '50%', left: '50%' }; // Default position
      }
    },
  },
};
</script>

<style scoped>
.summoners-rift {
  position: relative;
  width: 1290px; /* Adjust the width and height of the map */
  height: 927px;
  background-image: url('https://static.wikia.nocookie.net/leagueoflegends/images/5/53/Summoner%27s_Rift_Update_Map.png'); /* Replace with your Summoner's Rift map image */
  background-size: cover;
}

.player-card {
  position: absolute;
  transform: translate(-50%, -50%);
}

.player-image {
  width: 50px; /* Adjust the size of the player image */
  height: 50px;
  border-radius: 50%;
}

.player-info {
  text-align: center;
}

.player-name {
  font-weight: bold;
}

.player-role {
  font-style: italic;
}
</style>