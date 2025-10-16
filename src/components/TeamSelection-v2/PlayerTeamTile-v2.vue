<template>

  <div
    class="player-tile-container"
    :class="{
      'picked-position': currentlyPicked === role && !teamPlayer,
      'captain-player-tile': isCaptain,
      'sub': role =='sub'
    }"
  >
    <!-- Team and Player Name -->
    <div class="tile-header row" v-if="teamPlayer">
      <div class="col-2 inline-text-flag">
        <img
          
          class="flag"
          :src="getLeagueFlag(teamPlayer?.team?.league)"
          alt="flag"
        />
      </div>
      <div class="col-8 align-content-center">
        <div class="team-name">{{ teamPlayer?.team.code || ' ' }}</div>
      </div>
      <div class="col-2 inline-text-flag role-sub">
        <div
          v-if="teamPlayer"
          class="action-button remove-button"
          @click="removePlayerFromRole(role)"
        >
          <i class="flag fas fa-circle-minus fa-xl"></i>
        </div>
        
      </div>
    </div>
    <div class="tile-header row mt-1" v-if="teamPlayer">
      <div class="col-2 inline-text-flag">
        <img
          
          class="flag"
          :src="getFlag(teamPlayer?.nationality)"
          alt="flag"
        />
      </div>
      <div class="col-8 align-content-center">
        <span class="player-name" 
        :class="{
          'captain-player': isCaptain
        }"
        >{{ teamPlayer?.summonerName }}</span>
      </div>
      <div v-if="teamPlayer" class="col-2 inline-text-flag role-sub" >
           <img
          
          class="flag "
          :src="roles_img_url[teamPlayer?.role]"
          alt="flag"
        />
      </div>
    </div>

    <!-- Player Photo -->
    <div class="image-layer-container mb-1">
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
          v-if="!teamPlayer"
          class="action-button add-button player-image-overlay"
          @click="addPlayerToRole(role)"
        >
        <i class="fas fa-circle-plus fa-xl"></i>
      </div>
      <div
          v-if="teamPlayer && role != 'sub'"
          class="captain-button player-image-overlay"
          @click="setCaptain(role)"
        >
        <i class="fa-sharp fa-solid fa-star fa-xl captain-letter"></i>
      </div>
    </div>
    
    <!-- Bottom Info: Price and Points -->
    <div class="tile-footer" v-if="teamPlayer">
      <div class="price ps-2">${{ teamPlayer?.price?.toFixed(1) }}</div>
      <div class="points pe-2">{{ teamPlayer?.points?.toFixed(1) }} Pts</div>
    </div>
    <div class="tile-footer second" v-if="teamPlayer">
      <div></div>
      <!-- <div class="points pe-2">{{ (teamPlayer?.points/teamPlayer?.gamesPlayed).toFixed(0) }}pts/g</div> -->
    </div>

    <!-- Add/Remove Button -->
    <div class="tile-actions" >
      
    </div>
    
  </div>
</template>

<script>
import PlayerTileV2 from "@/components/TeamSelection-v2/PlayerTile-v2.vue"
export default {
    name: "PlayerTeamTileV2",
    props:{
        img_url: String,
        roles_img_url: Object,
        teamPlayer: Object,
        role: String,
        currentlyPicked: String,
        isCaptain: Boolean
    },
    components: {
      PlayerTileV2
    },
    data() {
      return {

        }
    },
    methods:{
      setCaptain(role) {
        this.$emit("captainPick", role);
      },
      getLeagueFlag(league) {
        // Placeholder for region flag logic
        return this.$func_global.leagues_icons[league];
      },
      getFlag(countryCode) {
        if (countryCode == null)
          return this.$func_global.nation_flag['Default']
        else {
          if (countryCode in this.$func_global.nation_flag)
            return this.$func_global.nation_flag[countryCode]
          else
            return this.$func_global.nation_flag['Default']
        }
        return `/flags/${countryCode.toLowerCase()}.png`; // or use CDN
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

.captain-player {
  color: var(--GOLDEN-CAPTAIN) !important;
}
.captain-player-tile {
  box-shadow:  -8px -8px 8px var(--GOLDEN-CAPTAIN) !important;
}
.picked-position {
  box-shadow: 8px 8px 8px rgb(52, 118, 194) !important;
}
.picked-position.captain-player-tile {
  box-shadow: 8px 8px 8px rgb(52, 118, 194), -8px -8px 8px var(--GOLDEN-CAPTAIN) !important;
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
  font-size: 0.8rem;
  display: flex;
  flex-wrap: nowrap;
}

.flags {
  opacity: 0.8;
  display: flex;
  justify-content: center;
  gap: 0.2rem;
  /* margin-bottom: 0.2rem; */
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
  width: 1.0rem;
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
  font-size: 0.7rem;
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
  color: var(--GOLDEN-CAPTAIN);
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