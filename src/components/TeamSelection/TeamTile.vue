<template>
    <img :src="team.imageUrl" class="player-photo " alt="Player Photo" /> 
    <span class="pe-2"><strong>{{ team.name }}  </strong></span>
    <span class="px-1">{{ team.code }}</span>
    <span class="px-1">{{ team.league   }}</span>
    <span class="px-1">{{ team.points }}pts</span>
    <span class="px-1">{{ team.price }}$</span>
</template>

<script>
export default {
    name: "TeamTile",
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