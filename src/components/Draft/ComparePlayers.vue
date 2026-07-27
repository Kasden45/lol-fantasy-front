<template>
  <div class="comparison-container">
    <div
      v-for="(pair, idx) in comparisonPairs"
      :key="idx"
      class="comparison-pair"
    >
      <!-- Player/Team Header -->
      <div class="players" v-if="pair.left.player || pair.left.team">
        <!-- Left -->
        <div class="player-card">
          <p class="owner-name">{{ swap.tradeInitiatorUserTeam.userLogin }}</p>
          <img
            :src="
              pair.left.player
                ? pair.left.player.imageUrl
                : pair.left.team.imageUrl
            "
            class="player-img"
          />
          <p class="summoner-name">
            {{
              pair.left.player
                ? pair.left.player.summonerName
                : pair.left.team.name
            }}
          </p>
          <span class="team-badge">{{
            pair.left.player ? pair.left.player.team.code : pair.left.team.code
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
              pair.right.player
                ? pair.right.player.imageUrl
                : pair.right.team.imageUrl
            "
            class="player-img"
          />
          <p class="summoner-name">
            {{
              pair.right.player
                ? pair.right.player.summonerName
                : pair.right.team.name
            }}
          </p>
          <span class="team-badge">{{
            pair.right.player
              ? pair.right.player.team.code
              : pair.right.team.code
          }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-block">
        <div v-for="stat in getStats(pair)" :key="stat.label" class="stat-row">
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
    comparisonPairs() {
      if (this.swap.initiatorItems && this.swap.receiverItems) {
        return this.swap.initiatorItems.map((item, i) => ({
          left: item,
          right: this.swap.receiverItems[i],
        }));
      }
      return [
        {
          left: {
            player: this.swap.playerInitiator,
            team: this.swap.teamInitiator,
          },
          right: {
            player: this.swap.playerReceiver,
            team: this.swap.teamReceiver,
          },
        },
      ];
    },
  },
  methods: {
    getStats(pair) {
      const p1 = pair.left.player ?? pair.left.team;
      const p2 = pair.right.player ?? pair.right.team;
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

.comparison-pair {
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
