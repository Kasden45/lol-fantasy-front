<template>
    <div class="container">
      <div class="row chips justify-content-center mb-3">
        <Chip v-if="userTeam != null" v-for="(chip, index) in userTeam.chips.sort((a,b) => a.id > b.id ? 1 : -1)"
        :id="chip.id"
        class="col-2"
        :isActive="userTeam.chipActivated == chip.id"
        :userStatus="chip.userStatus"
        :type="chip.type"
        :isDisabled="chip.userStatus == 4"
        :name="chip.name"
        :description="chip.description"
        :iconUrl="role_images['team']"
        @useChip="chipUsed"
        />
        <!-- <Chip v-if="userTeam != null"
        :id="1"
        class="col-2"
        :isActive="userTeam.chipActivated == 3"
        :isDisabled="true"
        :name="'Triple Captain'"
        :description="'Triple the points of your captain for this fixture.'"
        :iconUrl="role_images['team']"
        @useChip="chipUsed"
        />
        <Chip v-if="userTeam != null"
        :id="2"
        class="col-2"
        :isActive="userTeam.chipActivated == 2"
        :isDisabled="true"
        :name="'Bench Boost'"
        :description="'Add points from your bench player for this fixture.'"
        :iconUrl="role_images['top']"
        @useChip="chipUsed"
        />
        <Chip v-if="userTeam != null"
        :id="3"
        class="col-2"
        :isActive="userTeam.chipActivated == 3"
        :isDisabled="false"
        :name="'Limitless'"
        :description="'Make unlimited transfers for a single fixture, without any budget restrictions. After the fixture, your team will revert to its original state.'"
        :iconUrl="role_images['top']"
        @useChip="chipUsed"
        />
        <Chip v-if="userTeam != null"
        :id="4"
        class="col-2"
        :isActive="userTeam.chipActivated == 4"
        :isDisabled="false"
        :name="'Wildcard'"
        :description="'Make unlimited transfers for this fixture.'"
        :iconUrl="role_images['top']"
        @useChip="chipUsed"
        /> -->
      </div>
      <div class="row  justify-content-center mb-3">
        <div class="col-xl-3 col-sm-4 col-sm-4 align-content-center">
          <PlayerTeamTileV2 :is-captain="captain==1" 
          :currently-picked="this.currentlyPicked" 
          @playerRemove="playerRemoved" 
          @rolePick="rolePicked"
          @captainPick="pickCaptain" 
          v-if="userTeam != null" 
          :role="'top'" 
          :teamPlayer="userTeam.topPlayer.player" 
          :img_url="role_images['top']" 
          :roles_img_url="role_images"/>
        </div>
        <div class="col-xl-3 col-sm-4 col-sm-4 align-content-center">
          <PlayerTeamTileV2 
          :is-captain="captain==2" 
          :currently-picked="this.currentlyPicked" 
          @playerRemove="playerRemoved" 
          @rolePick="rolePicked" 
          @captainPick="pickCaptain"
          v-if="userTeam != null" 
          :role="'jungle'" 
          :teamPlayer="userTeam.junglePlayer.player" 
          :img_url="role_images['jungle']"
          :roles_img_url="role_images"
        />
        </div>
        <div class="col-xl-3 col-sm-4 align-content-center">
          <PlayerTeamTileV2 
          :is-captain="captain==3" 
          :currently-picked="this.currentlyPicked" 
          @playerRemove="playerRemoved" 
          @rolePick="rolePicked" 
          v-if="userTeam != null" 
          :role="'mid'" 
          :teamPlayer="userTeam.midPlayer.player" 
          :img_url="role_images['mid']" 
          :roles_img_url="role_images"
          @captainPick="pickCaptain"
        />
        </div>
      </div>
      <div class="row justify-content-center mb-3">
        <div class="col-xl-3  col-sm-4 align-content-center">
                <PlayerTeamTileV2 
                :is-captain="captain==4" 
                :currently-picked="this.currentlyPicked" 
                @playerRemove="playerRemoved" 
                @rolePick="rolePicked" 
                v-if="userTeam != null" 
                :role="'bottom'" 
                :teamPlayer="userTeam.botPlayer.player" 
                :img_url="role_images['bottom']" 
                :roles_img_url="role_images"
                @captainPick="pickCaptain"
                />
        </div>
        <div class="col-xl-3 col-sm-4 align-content-center">
                <PlayerTeamTileV2 
                :is-captain="captain==5" 
                :currently-picked="this.currentlyPicked" 
                @playerRemove="playerRemoved" 
                @rolePick="rolePicked" 
                v-if="userTeam != null" 
                :role="'support'" 
                :teamPlayer="userTeam.supportPlayer.player" 
                :img_url="role_images['support']" 
                :roles_img_url="role_images"
                @captainPick="pickCaptain"
                />
        </div>
      </div>
      <div class="row justify-content-center mb-3">
        <div class="col-xl-3 col-sm-4 align-content-center">
          <PlayerTeamTileV2 :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'sub'" :teamPlayer="userTeam.subPlayer.player" :img_url="role_images['sub']" :roles_img_url="role_images"/>
        </div>
        
        <div class="col-xl-3 col-sm-4 align-content-center">
                <TeamTeamTileV2 :currently-picked="this.currentlyPicked" @playerRemove="playerRemoved" @rolePick="rolePicked" v-if="userTeam != null" :role="'team'" :teamTeam="userTeam.team.team" :img_url="role_images['team']" :roles_img_url="role_images"/>
        </div>
        <div class="col-xl-3 col-sm-4 align-content-center">
          
        </div>
      </div>
      <div class="row justify-content-center">
        
      </div>
    </div>
 
    
  </template>
  
  <script>
  import Chip from "@/components/TeamSelection-v2/Chip.vue";
  import PlayerTeamTileV2 from "@/components/TeamSelection-v2/PlayerTeamTile-v2.vue"
  import TeamTeamTileV2 from "@/components/TeamSelection-v2/TeamTeamTile-v2.vue"
  export default {
    name: "PlayerTeamV2",
    components: {
      Chip,
      PlayerTeamTileV2,
      TeamTeamTileV2,
    },
    props:{
        userTeam: Object,
        readOnly: Boolean,
        currentlyPicked: String,
        captain: Number
    },
    data() {
      return {
        role_images:{
          top: "https://cdn3.emoji.gg/emojis/7990-lol-role-top.png",
          jungle: "https://cdn3.emoji.gg/emojis/1152-lol-role-jungle.png",
          mid: "https://cdn3.emoji.gg/emojis/6934-lol-role-mid.png",
          bottom: "https://cdn3.emoji.gg/emojis/9366-lol-role-bot.png",
          support: "https://cdn3.emoji.gg/emojis/7990-lol-role-support.png",
          sub: "https://cdn3.emoji.gg/emojis/2724-lol-role-fill.png",
          team: "https://i.imgur.com/bLArMp2.png"
        },
        team: {
          topPlayer: {},
          junglePlayer: {},
          midPlayer: {},
          botPlayer: {},
          supportPlayer: {},
          subPlayer: {},
          team: {},
          chipActivated: 0,
        },
      };
    },
    methods: {
      chipUsed(id) {
        // Emit an event to notify the parent component (App) about the chip usage
        console.log("Chip used with id:", id);
        this.userTeam.chipActivated = id;
        this.$emit("chipUsed", id);
      },
      pickCaptain(role) {
        this.$emit("captainPick", role)
      },
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
 

.chips {
  justify-content: center;
  padding-bottom: 1rem;
  padding-top: 1rem;
  border-bottom: 2px solid var(--GREY);
}

.placeholder {
  width: 120px;
  height: 120px;
  background-color: #333;
  border-radius: 10px;
  opacity: 0.2;
}
  </style>