<template>
  <div class="comparison-container">
    <!-- Player/Team Header -->
    <div class="players" v-if="swap.playerInitiator || swap.teamInitiator">
      <!-- Left -->
      <div class="player-card">
        <p class="owner-name">{{ swap.tradeInitiatorUserTeam.userLogin }}</p>
        <img
          :src="
            swap.playerInitiator
              ? swap.playerInitiator.imageUrl
              : swap.teamInitiator.imageUrl
          "
          class="player-img"
        />
        <p class="summoner-name">
          {{
            swap.playerInitiator
              ? swap.playerInitiator.summonerName
              : swap.teamInitiator.name
          }}
        </p>
        <span class="team-badge">{{
          swap.playerInitiator
            ? swap.playerInitiator.team.code
            : swap.teamInitiator.code
        }}</span>
      </div>

      <!-- VS -->
      <div class="vs-col">
        <span class="vs-text">VS</span>
      </div>

      <!-- Right -->
      <div class="player-card">
        <p class="owner-name">{{ swap.tradeReceiverUserTeam.userLogin }}</p>
        <img
          :src="
            swap.playerReceiver
              ? swap.playerReceiver.imageUrl
              : swap.teamReceiver.imageUrl
          "
          class="player-img"
        />
        <p class="summoner-name">
          {{
            swap.playerReceiver
              ? swap.playerReceiver.summonerName
              : swap.teamReceiver.name
          }}
        </p>
        <span class="team-badge">{{
          swap.playerReceiver
            ? swap.playerReceiver.team.code
            : swap.teamReceiver.code
        }}</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-block">
      <div v-for="stat in stats" :key="stat.label" class="stat-row">
        <span class="stat-value" :class="getClass(stat.left, stat.right)">
          {{ stat.left }}
        </span>
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value" :class="getClass(stat.right, stat.left)">
          {{ stat.right }}
        </span>
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
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Players */
.players {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.player-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.owner-name {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
}

.player-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid var(--GREY-DARKER);
}

.summoner-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.team-badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--GREY-DARKER);
  background: var(--BACKGROUND-DARK);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 4px;
  padding: 2px 8px;
}

/* VS */
.vs-col {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vs-text {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--GREY-LIGHT);
}

/* Stats */
.stats-block {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--GREY-DARKER);
  border-radius: 10px;
  overflow: hidden;
}

.stat-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid var(--GREY-DARKER);
  background: var(--SECONDARY);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-row:nth-child(even) {
  background: var(--BACKGROUND-DARK);
}

.stat-value {
  font-size: 16px;
  font-weight: 800;
  text-align: center;
}

.stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--GREY-LIGHT);
  text-align: center;
  min-width: 90px;
}

/* Highlighting */
.better {
  color: var(--GREEN-LIGHT);
}

.worse {
  color: var(--ERROR);
}

.equal {
  color: var(--WARNING);
}
</style>
