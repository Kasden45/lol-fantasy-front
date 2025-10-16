<template>
    <div
    class="player-tile-container  align-content-center"
    :class="{
      'picked-position': currentlyPicked === role
    }"
    @click="showDetails(teamPoints)"
  >
    <div class="tile-header row" v-if="teamTeam">
      <div class="col-2 inline-text-flag">
        <img
          
          class="flag"
          :src="teamTeam.imageUrl"
          alt="flag"
        />
      </div>
      <div class="col-8 align-content-center">
        <span class="player-name">{{ teamTeam?.code }}</span>
      </div>
      <div class="col-2 inline-text-flag role-sub">
        <img
          
          class="flag "
          :src="roles_img_url['team']"
          alt="flag"
        />
      </div>
    </div>
    <div class="tile-footer" v-if="teamTeam">
      <div class="price ps-2">{{ teamTeam?.price?.toFixed(1) }}$</div>
      <div class="points pe-2">{{ teamTeam?.points ? teamTeam?.points.toFixed(1) : teamPoints?.totalPoints?.toFixed(1) }} Pts</div>
    </div>
    <div class="tile-footer second" v-if="teamTeam">
      <div></div>
      
    </div>
   
  </div>
</template>

<script>
import TeamTileV2 from "@/components/TeamSelection-v2/TeamTile-v2.vue";
export default {
    name: "TeamPoints",
    props:{
        teamPoints: Object,
        roles_img_url: Object,
        img_url: String,
        teamTeam: Object,
        role: String,
        currentlyPicked: String 
    },
    components: {
      TeamTileV2
    },
    data() {
      return {
        
        }
    },
    methods:{
      showDetails (teamDetails) {
        this.$emit('showDetails', teamDetails)
      },
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
.role-sub {
  justify-content: end !important;
}
.picked-position {
  background-color: rgb(52, 118, 194);
}
.team-name {
  color: var(--GREY);
}
.player-tile-container {
  /* height: 30vh; */
  height: 8vh !important;
  background: var(--SECONDARY);
  border-radius: 1rem;
  padding: 0.5rem;
  color: white;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.tile-header {
  font-weight: bold;
  font-size: 0.9rem;
}

.flags {
  display: flex;
  justify-content: center;
  gap: 0.2rem;
  margin-bottom: 0.2rem;
}

.inline-text-flag {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.3rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.flag {
  opacity: 0.8;
  width: 1.5vw;
  /* height: 12px; */
  object-fit: cover;
  border-radius: 2px;
}
.image-layer-container {
  position: relative;
  aspect-ratio: 1 / 1;
}


.role-icon {
  width: 100%;
  /* height: 100%; */
  object-fit: cover;
  opacity: 0.25;
  z-index: 1;
  border-radius: 0.5rem;
}

.player-image-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.tile-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  /* border-top: 2px solid var(--GREY); */
  /* margin-top: 0.4rem; */
  padding-top: 0.3rem;
}

.tile-footer.second {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  border-top: none;
  /* margin-top: 0.4rem; */
  padding-top: 0rem;
}

.tile-actions {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}

.action-button {
  font-weight: bold;
  cursor: pointer;
}
.add-button {
  color: var(--BLUE);
  height: 40%;
  font-size: xx-large;
}
.remove-button {
  color: #ff4d4f;
}
.border-bot {
  border-right: 2px solid black;
}
</style>