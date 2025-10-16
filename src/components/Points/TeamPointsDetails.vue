<template>
  <div
    class="player-tile-container"
  >
    <div class="tile-header row mt-1" v-if="teamTeam">
      <div class="col-2 inline-text-flag">
        
      </div>
      <div class="col-8 align-content-center">
        <p class="player-name" 
        
        >{{ teamTeam?.league }} </p>
        <span class="player-name" 
        
        >{{ teamTeam?.name }}</span>
      </div>
    </div>

    <!-- Player Photo -->
    <div class="image-layer-container mb-1">
      <img
        v-if="!teamTeam"
        :src="img_url"
        class="role-icon"
        alt="role icon"
      />
      <img
        v-if="teamTeam"
        :src="teamTeam?.imageUrl"
        class="role-icon"
        alt="role icon"
      />
      <div
          v-if="teamTeam && !details"
          class="captain-button player-image-overlay"
          @click="showDetails(teamPoints)"
        >
        <i class="fa-sharp fa-solid fa-info fa-xl captain-letter"></i>
      </div>
    </div>
    
    <!-- Bottom Info: Price and Points -->
    <div class="tile-footer" v-if="teamTeam && !details">
      <div class="price ps-2">{{ teamTeam?.price?.toFixed(1) }}$</div>
      <div class="points pe-2">{{ points ? points.toFixed(1) : teamPoints?.totalPoints?.toFixed(1) }}pts</div>
    </div>
    <div class="tile-footer second justify-content-center" v-if="teamTeam && details">
        <div class="points details pe-2">{{ points ? points.toFixed(1) : teamPoints?.totalPoints?.toFixed(1) }}pts</div>
      </div>    
  </div>
</template>

<script>
export default {
    name: "TeamPointsDetails",
    props:{
        img_url: String,
        leagues_icons: Object,
        teamTeam: Object,
        points: Number,
        teamPoints: Object,
        details: Boolean
    },
    data() {
      return {

        }
    },
    methods:{
      showDetails (playerDetails) {
        this.$emit('showDetails', playerDetails)
      }
    }
}

</script>

<style scoped>

.details {
  font-size: x-large;
  justify-content: center;
}
.role-sub {
  justify-content: end !important;
}

.captain-player {
  /* background-color: rgb(250, 212, 44) !important; */
  color: var(--GOLDEN-CAPTAIN) !important;
}
.captain-player-tile {
  /* background-color: rgb(250, 212, 44) !important; */
  /* border: 2px solid var(--GOLDEN-CAPTAIN) !important; */
  box-shadow:  8px 8px 8px var(--GOLDEN-CAPTAIN) !important;
}
.picked-position {
  /* background-color: rgb(52, 118, 194) !important; */
  box-shadow: 8px 8px 8px rgb(52, 118, 194) !important;
}
.team-name {
  color: var(--GREY);
  align-content: center;
}
.player-tile-container {
  /* height: 30vh; */
  background: var(--SECONDARY);
  border-radius: 1rem;
  padding: 0.5rem;
  color: white;
  text-align: center;
  position: relative;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.2);
}

.tile-header {
  font-weight: bold;
  font-size: 1.8rem;
  display: flex;
  flex-wrap: nowrap;
}

.flags {
  opacity: 0.8;
  display: flex;
  justify-content: center;
  gap: 0.2rem;
  margin-bottom: 0.2rem;
}

.inline-text-flag {
display: flex;
  align-items: center;
  justify-content: start;
  /* gap: 0.5rem; */
  /* font-weight: 600; */
  font-size: 0.7rem;
}

.flag {
  width: 1.8rem;
  /* height: 12px; */
  object-fit: cover;
  border-radius: 2px;
}
.image-layer-container {
  position: relative;
  aspect-ratio: 1 / 1;
}
.player-tile-container.sub {
  background: var(--GREY-DARKER) !important;

}


.role-icon {
  width: 100%;
  /* height: 100%; */
  object-fit: cover;
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
  border-top: 2px solid var(--GREY);
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
  opacity: 0.8;
  height: 100%;
  /* font-weight: bold; */
  
  cursor: pointer;
}
.add-button {
  color: var(--BLUE);
  height: 40%;
  font-size: xx-large;
}
.captain-button{
  opacity: 0%;
}
.image-layer-container:hover .captain-button{
  opacity: 90%;
  color: var(--BLUE);
  height: 40%;
  font-size: xx-large;
  cursor: pointer;
}
.remove-button {
  color: #ff4d4f;
}
.border-bot {
  border-right: 2px solid black;
}
</style>