<template>
    <img :src="player.imageUrl" class="player-photo " alt="Player Photo" /> 
    <span class="pe-2"><strong>{{ player.summonerName }}  </strong></span>
    <span class="px-1">{{ player.role }}</span>
    <span class="px-1">{{ player.team.code }}</span>
    <span class="px-1">{{ player.points }}pts</span>
    <span class="px-1">{{ player.price }}$</span>
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