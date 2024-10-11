<template>
  <img :src="player.imageUrl" class="player-photo " alt="Player Photo" /> 
  <div class="container">
    <div class="row">
      <div class="pe-2 col-2 text-start"><strong>{{ player.summonerName }}  </strong></div>
      <div class="px-1 col-3 text-end ">{{ player.role }}</div>
      <div class="px-1 col-2">{{ player.team.code }}</div>
      <div class="px-1 col-2">{{ player.points.toFixed(0) }}pts</div>
      <div class="px-1 col-2 fw-bold">{{ (player.points/player.gamesPlayed).toFixed(0) }}pts/g</div>
      <div class="px-1 col-1">{{ player.price }}$</div>
    </div>
  </div>
    
</template>

<script>
export default {
    name: "PlayerTile",
    props:{
        player: Object
    },
    data() {
      return {
      };
    },
    methods: {
    },
    // created() {
    //   // Listen for the "player-selected" event emitted by the PlayersList component
    //   this.$root.$on("player-selected", (player) => {
    //     this.fillTeamTile(player);
    //   });
    // },
  };
</script>