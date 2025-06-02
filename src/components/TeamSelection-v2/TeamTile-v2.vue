<template>
    <img :src="team.imageUrl" class="player-photo " alt="Player Photo" /> 
    <!-- <span class="pe-2"><strong>{{ team.name }}  </strong></span>
    <span class="px-1">{{ team.code }}</span>
    <span class="px-1">{{ team.league   }}</span>
    <span class="px-1">{{ team.points }}pts</span>
    <span class="px-1">{{ team.price }}$</span> -->
    <div class="container">
    <div class="row align-items-center">
      <div class="pe-2 col-3 text-start fw-bold">{{ team.name }}</div>
      <div class="px-1 col-2 text-end">{{ team.code }}</div>
      <div class="px-1 col-2">{{ team.league }}</div>
      <div class="px-1 col-2">{{ team.points.toFixed(0) }}pts</div>
      <div class="px-1 col-2 fw-bold">{{ (team.points/team.gamesPlayed).toFixed(0) }}pts/g</div>
      <div class="px-1 col-1 text-end">{{ team.price }}$</div>
    </div>
  </div>
</template>

<script>
export default {
    name: "TeamTileV2",
    props:{
        team: Object
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