<template>
    <button class="btn tooltips chip-details justify-content-center align-items-center py-1 mx-1"
        :class="{
            'active-chip': isActive,
            'disabled-chip': isDisabled,
        }"
        :disabled="isDisabled"
        @click="activateChip()"
    >
            <div class="price">{{ name }}</div>
            <!-- <div class="points pe-2">
                <img
          
                class="flag"
                :src="iconUrl"
                alt="flag"
                />
            </div> -->
            <span class="tooltiptext">{{ description }}</span>
        </button>
</template>

<script>
export default {
name: "Chip",
components: {
},
props:{
    id: Number,
    description: String,
    name: String,
    iconUrl: String,
    isActive: Boolean,
    isDisabled: Boolean
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
        chipActivated: {},
    },
    };
},
methods: {
    activateChip() {
        this.$emit("useChip", this.id)
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
.chip-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid var(--GREY);
  border-radius: 0.3rem;
}
button.chip-details {
  background-color: var(--GREY);
}
button.active-chip {
    background-color: var(--PRIMARY);
    color: white;
    border: 2px solid var(--PRIMARY);
}
button.disabled-chip {
    /* background-color: var(--SECONDARY); */
    /* color: var(--GREY); */
    border: 2px solid var(--GREY);
    cursor: not-allowed;
}
.flag {
  width: 1.0rem;
  /* height: 12px; */
  object-fit: cover;
  border-radius: 2px;
}
.tooltips {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltips .tooltiptext {
  visibility: hidden;
  width: 15rem;
  background-color: VAR(--GREY-DARKER);
  color: white;
  opacity: 0.9;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 999;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltips:hover .tooltiptext {
  visibility: visible;
}
</style>