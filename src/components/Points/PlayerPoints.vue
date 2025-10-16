<template>
  <div
    class="player-tile-container align-content-center"
    :class="{
      'picked-position': currentlyPicked === role,
      'captain-player-tile': isCaptain,
      'bench-boost-tile': isbenchboost,
      'sub': role =='sub',
      'triple-captain-player-tile': isTriple && isCaptain,
    }"
    @click="showDetails(playerPoints)"
  >
    <!-- Team and Player Name -->
    <div class="tile-header row " v-if="teamPlayer">
      <div class="col-2 inline-text-flag">
        <img
          
          class="flag"
          :src="teamPlayer?.team?.imageUrl"
          alt="flag"
        />
      </div>
      <div class="col-8 align-content-center" >
        <span class="player-name" 
        :class="{
          'captain-player': isCaptain
        }"
        >{{ teamPlayer?.team.code + ' ' +teamPlayer?.summonerName}}</span>
      </div>
      <div class="col-2 inline-text-flag role-sub">
           <img
          
          class="flag "
          :src="roles_img_url[role]"
          alt="flag"
        />
      </div>
    </div>
    <div class="tile-header row mt-1" v-if="teamPlayer">
      <div class="col-2 inline-text-flag">
        
      </div>
      <div v-if="teamPlayer" class="col-2 inline-text-flag role-sub" >
      </div>
    </div>

    <!-- Player Photo -->
    <div class="image-layer-container mb-1" v-if="false">
      <img
        v-if="role && !teamPlayer"
        :src="img_url"
        class="role-icon"
        alt="role icon"
      />
      <img
        v-if="role && teamPlayer"
        :src="teamPlayer?.team?.imageUrl"
        class="role-icon"
        alt="role icon"
      />
      <!-- Player Image Overlay -->
      <img
        v-if="teamPlayer?.imageUrl"
        :src="teamPlayer.imageUrl"
        class="player-image-overlay"
        alt="player image"
      />
      <div
          v-if="teamPlayer && !details"
          class="captain-button player-image-overlay"
          @click="showDetails(playerPoints)"
        >
        <i class="fa-sharp fa-solid fa-info fa-xl captain-letter"></i>
      </div>
    </div>
    
    <!-- Bottom Info: Price and Points -->
    <div class="tile-footer" v-if="teamPlayer && !details">
      <div class="price ps-2">{{ teamPlayer?.price?.toFixed(1) }}$</div>
      <div class="points pe-2" :class="{
        'captain-points': isCaptain,
        'triple-points': isTriple && isCaptain,
        'bench-points': isbenchboost,
        }">
        {{ displayedPoints.toFixed(1) }}pts
      </div>
    </div>
    <div class="tile-footer second justify-content-center" v-if="teamPlayer && details">
        <div class="points details pe-2">{{ points ? points.toFixed(1) : playerPoints?.totalPoints?.toFixed(1) }}pts</div>
        <div v-if="isCaptain" class="points details pe-2">{{ points ? points.toFixed(1) : playerPoints?.totalPoints?.toFixed(1) }}pts</div>
    </div>    
  </div>
</template>

<script>
import PlayerTileV2 from "@/components/TeamSelection-v2/PlayerTile-v2.vue"
export default {
    name: "PlayerPoints",
    props:{
        img_url: String,
        roles_img_url: Object,
        teamPlayer: Object,
        points: Number,
        playerPoints: Object,
        role: String,
        isCaptain: Boolean,
        details: Boolean,
        isTriple: Boolean,
        isbenchboost: {
          type: Boolean,
          default: false
        },
    },
    components: {
      PlayerTileV2
    },
    data() {
      return {

        }
    },
    methods:{
      showDetails (playerDetails) {
        this.$emit('showDetails', playerDetails)
      },
      getFlag(countryCode) {
        return 'https://cdn-icons-png.flaticon.com/512/323/323363.png'
        return `/flags/${countryCode.toLowerCase()}.png`; // or use CDN
      }
    },
    computed:{
      displayedPoints() {
        if (this.isTriple && this.isCaptain) {
          return this.points ? this.points * 3 : this.playerPoints?.totalPoints * 3;
        }
        if (this.isCaptain) {
          return this.points ? this.points * 2 : this.playerPoints?.totalPoints * 2;
        }
        else {
          return this.points ? this.points : this.playerPoints?.totalPoints;
        }
      },
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

.player-tile-container.sub {
  background: var(--GREY-DARKER) !important;

}
.player-tile-container.bench-boost-tile {
  background: var(--SECONDARY) !important;

}
.captain-player {
  color: var(--GOLDEN-CAPTAIN) !important;
}
.captain-player-tile {
  box-shadow:  8px 8px 8px var(--GOLDEN-CAPTAIN) !important;
}
.triple-captain-player-tile {
  box-shadow:  8px 8px 8px var(--PRIMARY) !important;
}
.bench-boost-tile {
  box-shadow:  8px 8px 8px var(--BENCH-BOOST) !important;
  background: var(--SECONDARY) !important;
}
.picked-position {
  box-shadow: 8px 8px 8px rgb(52, 118, 194) !important;
}
.team-name {
  color: var(--GREY);
  align-content: center;
}
.player-tile-container {
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
  font-size: 0.8rem;
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
  font-size: 0.7rem;
}

.flag {
  width: 1.0rem;
  object-fit: cover;
  border-radius: 2px;
}
.image-layer-container {
  position: relative;
  aspect-ratio: 1 / 1;
}


.role-icon {
  width: 100%;
  object-fit: cover;
  opacity: 0.50;
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
  padding-top: 0.3rem;
}

.tile-footer.second {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  border-top: none;
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

.captain-points {
  color: var(--GOLDEN-CAPTAIN);
  font-weight: bold;
}
.triple-points {
  color: var(--PRIMARY);
  font-weight: bold;
}
.bench-points {
  color: var(--BENCH-BOOST);
  font-weight: bold;
}
</style>