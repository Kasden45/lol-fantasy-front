<template>
    <div  class="row m-auto  team-player" :class="{'picked-position' : currentlyPicked == role}">
      <div class="col-md-2">
        <img :src="img_url" class="player-photo" alt="Player Photo" /> 
      </div>
      <div class="col-md-10 ">
        <div  class="row ">
          <div  class="col-md-8 team-tile d-flex align-items-center ">
            <TeamTile :team="teamTeam" v-if="teamTeam != null"/>
          </div>
          <div class="col-md-4">
            <button v-if="teamTeam != null" class="btn btn-danger align-items-end" @click="removePlayerFromRole(role)">-</button>
            <button class="btn btn-success align-items-end" v-else @click="addPlayerToRole(role)">+</button>
          </div>
        </div>
        
        <!-- <div v-if="teamTeam != null" class="team-tile d-flex align-items-center">
        <TeamTile :team="teamTeam"/>
        <button class="btn btn-danger" @click="removePlayerFromRole(role)">-</button>
        </div>
        <button class="btn btn-success " v-else @click="addPlayerToRole(role)">+</button> -->
      </div>
    </div>
</template>

<script>
import TeamTile from "@/components/TeamSelection/TeamTile.vue"
export default {
    name: "TeamTeamTile",
    props:{
        img_url: String,
        teamTeam: Object,
        role: String,
        currentlyPicked: String 
    },
    components: {
      TeamTile
    },
    data() {
      return {
        
        }
    },
    methods:{
        removePlayerFromRole(role) {
      // Emit an event to notify the parent component (App) about the selected player
        console.log("usuwam z ", role)
        this.$emit("playerRemove", role);
      },
      addPlayerToRole(role) {
      // Emit an event to notify the parent component (App) about the selected player
        console.log("chce dodac do ", role)
        this.$emit("rolePick", role);
      },
    }
}

</script>
<style scoped>
.picked-position {
  background-color: rgb(52, 118, 194);
}
</style>