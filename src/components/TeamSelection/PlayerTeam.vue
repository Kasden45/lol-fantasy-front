<template>


    <PlayerTeamTile :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'top'" :teamPlayer="userTeam.topPlayer.player" :img_url="top_img"/>
    <PlayerTeamTile :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'jungle'" :teamPlayer="userTeam.junglePlayer.player" :img_url="jng_img"/>
    <PlayerTeamTile :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'mid'" :teamPlayer="userTeam.midPlayer.player" :img_url="mid_img"/>
    <PlayerTeamTile :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'bottom'" :teamPlayer="userTeam.botPlayer.player" :img_url="bot_img"/>
    <PlayerTeamTile :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'support'" :teamPlayer="userTeam.supportPlayer.player" :img_url="supp_img"/>
    <PlayerTeamTile :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'sub'" :teamPlayer="userTeam.subPlayer.player" :img_url="sub_img"/>
    <TeamTeamTile :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'team'" :teamTeam="userTeam.team.team" :img_url="sub_img"/>
    
  </template>
  
  <script>
  import PlayerTeamTile from "@/components/TeamSelection/PlayerTeamTile.vue"
  import TeamTeamTile from "@/components/TeamSelection/TeamTeamTile.vue"
  export default {
    components: {
      PlayerTeamTile,
      TeamTeamTile,
    },
    props:{
        userTeam: Object,
        readOnly: Boolean,
        currentlyPicked: String
    },
    data() {
      return {
        top_img: "https://cdn3.emoji.gg/emojis/7990-lol-role-top.png",
        jng_img: "https://cdn3.emoji.gg/emojis/1152-lol-role-jungle.png",
        mid_img: "https://cdn3.emoji.gg/emojis/6934-lol-role-mid.png",
        bot_img: "https://cdn3.emoji.gg/emojis/9366-lol-role-bot.png",
        supp_img: "https://cdn3.emoji.gg/emojis/7990-lol-role-support.png",
        sub_img: "https://cdn3.emoji.gg/emojis/2724-lol-role-fill.png",
        team: {
          topPlayer: {},
          junglePlayer: {},
          midPlayer: {},
          botPlayer: {},
          supportPlayer: {},
          subPlayer: {},
          team: {},
        },
      };
    },
    methods: {
      fillTeamTile(player) {
        console.log(player);
        // Fill the corresponding tile in the team display when a player is selected
        // You can add logic to determine which tile to fill based on the player's role
      },
      playerRemoved(role) {
      // Emit an event to notify the parent component (App) about the selected player
        console.log("usuwam z ", role)
        this.$emit("playerRemove", role);
      },
      rolePicked(role) {
      // Emit an event to notify the parent component (App) about the selected player
        console.log("chce dodac do ", role)
        this.$emit("rolePick", role);
      },
    },
    // created() {
    //   // Listen for the "player-selected" event emitted by the PlayersList component
    //   this.$root.$on("player-selected", (player) => {
    //     this.fillTeamTile(player);
    //   });
    // },
  };
  </script>

  <style scoped>

  .team-player {
    cursor: pointer;
    padding: 1px 2px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
  }
  </style>