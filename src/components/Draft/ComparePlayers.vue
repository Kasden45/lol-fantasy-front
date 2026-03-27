<template>
  <div class="comparison-container">
    <div class="players" v-if="swap.playerInitiator">
      <div class="player-card">
        <div class="name">{{ swap.tradeInitiatorUserTeam.userLogin }}</div>
        <img :src="swap.playerInitiator.imageUrl" />
        <div class="name">{{ swap.playerInitiator.summonerName }}</div>
        <div class="team">{{ swap.playerInitiator.team.code }}</div>
      </div>
      <div class="player-card"><div class="vs">VS</div></div>

      <div class="player-card">
        <div class="name">{{ swap.tradeReceiverUserTeam.userLogin }}</div>
        <img :src="swap.playerReceiver.imageUrl" />
        <div class="name">{{ swap.playerReceiver.summonerName }}</div>
        <div class="team">{{ swap.playerReceiver.team.code }}</div>
      </div>
    </div>
    <div class="players" v-if="swap.teamInitiator">
      <div class="player-card">
        <div class="name">{{ swap.tradeInitiatorUserTeam.userLogin }}</div>
        <img :src="swap.teamInitiator.imageUrl" />
        <div class="name">{{ swap.teamInitiator.name }}</div>
        <div class="team">{{ swap.teamInitiator.code }}</div>
      </div>
      <div class="player-card"><div class="vs">VS</div></div>

      <div class="player-card">
        <div class="name">{{ swap.tradeReceiverUserTeam.userLogin }}</div>
        <img :src="swap.teamReceiver.imageUrl" />
        <div class="name">{{ swap.teamReceiver.name }}</div>
        <div class="team">{{ swap.teamReceiver.code }}</div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat-row">
        <div class="stat" :class="getClass(stat.left, stat.right)">
          {{ stat.left }}
        </div>

        <div class="stat label">{{ stat.label }}</div>
        <div class="stat" :class="getClass(stat.right, stat.left)">
          {{ stat.right }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DraftComparePlayers",
  components: {},
  props: {
    swap: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    stats() {
      const p1 = this.swap.playerInitiator ?? this.swap.teamInitiator;
      const p2 = this.swap.playerReceiver ?? this.swap.teamReceiver;
      // p1.points = 12.5;
      // p2.points = 15.0;

      // p1.matchesPlayed = 10;
      // p2.matchesPlayed = 12;

      // p1.price = 5.0;
      // p2.price = 6.0;
      return [
        {
          label: "Points",
          left: p1.points.toFixed(1),
          right: p2.points.toFixed(1),
        },
        {
          label: "Price",
          left: p1.price.toFixed(1),
          right: p2.price.toFixed(1),
        },
        {
          label: "Games",
          left: p1.gamesPlayed,
          right: p2.gamesPlayed,
        },
        {
          label: "Pts/Match",
          left: p1.matchesPlayed
            ? (p1.points / p1.matchesPlayed).toFixed(2)
            : "-",
          right: p2.matchesPlayed
            ? (p2.points / p2.matchesPlayed).toFixed(2)
            : "-",
        },
        {
          label: "Pts/Match/$",
          left:
            p1.matchesPlayed == 0
              ? "-"
              : (p1.points / p1.matchesPlayed / p1.price).toFixed(2),
          right:
            p2.matchesPlayed == 0
              ? "-"
              : (p2.points / p2.matchesPlayed / p2.price).toFixed(2),
        },
        {
          label: "Matches",
          left: p1.matchesPlayed,
          right: p2.matchesPlayed,
        },
      ];
    },
  },
  methods: {
    getClass(val, opponent) {
      if (val > opponent) return "better";
      if (val < opponent) return "worse";
      return "equal";
    },
  },
};
</script>
<style scoped>
.comparison-container {
  color: white;
  padding: 16px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 16px;
  color: var(--PRIMARY);
}

.vs {
  opacity: 0.6;
  height: 100%;
  font-size: x-large;
  align-content: center;
}

/* Players */
.players {
  color: var(--PRIMARY);
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.player-card {
  text-align: center;
  width: 45%;
}

.player-card img {
  width: auto;
  height: 10vh;
  border-radius: 10%;
}

.name {
  margin-top: 6px;
  font-weight: bold;
}

.team {
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Stats */
.stats {
  font-size: x-large;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  text-align: center;
}
.stat {
  text-align: center;
  min-width: 10vw;
}
.label {
  opacity: 0.6;
  color: var(--PRIMARY);
}

/* Highlighting */
.better {
  color: var(--GREEN-DARK);
  font-weight: bold;
}

.worse {
  color: var(--ERROR);
}

.equal {
  opacity: 0.7;
  color: var(--WARNING);
}
</style>
