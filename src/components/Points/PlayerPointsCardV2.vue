<template>
  <div
    class="points-card"
    v-if="playerDetails != null"
    :class="{ 'card-captain': isCaptain, 'card-sub': isSub }"
  >
    <table class="points-table">
      <tbody>
        <tr
          v-for="item in playerDetails.breakdown"
          :key="item.key"
          v-show="item.rawValue !== 0"
        >
          <td class="event-name">{{ item.name }}</td>
          <td class="event-value">{{ formatRaw(item) }}</td>
          <td
            class="event-points"
            :class="{
              negative: item.points < 0,
              positive: item.points > 0,
            }"
          >
            {{ item.points > 0 ? "+" : "" }}{{ item.points }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="game-total">
      <span class="game-total-label">Game total</span>
      <span class="game-total-value" :class="{ crossed: isCaptain }">{{
        playerDetails.points.toFixed(2)
      }}</span>
      <span v-if="isCaptain && !isTriple" class="game-total-captain"
        >→ {{ (playerDetails.points * 2).toFixed(2) }}</span
      >
      <span v-if="isCaptain && isTriple" class="game-total-triple"
        >→ {{ (playerDetails.points * 3).toFixed(2) }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerPointsCardV2",
  props: {
    playerDetails: Object,
    totalPoints: Number,
    isCaptain: Boolean,
    isTriple: Boolean,
    isSub: Boolean,
    title: String,
  },

  methods: {
    formatRaw(item) {
      const v = item.rawValue;
      const boolKeys = ["first_blood", "ten_ka", "team_first_blood", "team_win", "team_win_under_30", "team_lose_over_30", "team_four_drakes"];
      if (boolKeys.includes(item.key)) return v ? "✓" : "✗";
      if (v === null || v === undefined) return "-";
      return Number.isInteger(v) ? v : Number(v).toFixed(2);
    },
  },
  // watch: {
  //   playerDetails: {
  //     handler(newPlayerDetails, oldPlayerDetails) {},
  //     immediate: true, // This will trigger the handler immediately when the component is created
  //   },
  // },
};
</script>

<style scoped>
.points-card {
  padding: 12px 0 8px;
}

.card-captain {
  background: rgba(248, 194, 32, 0.06);
  border-radius: 6px;
  padding: 12px 8px 8px;
}

.card-sub {
  opacity: 0.7;
}

.points-table {
  width: 100%;
  border-collapse: collapse;
}

.points-table tr {
  border-bottom: 1px solid var(--GREY-DARKER);
}

.points-table tr:last-child {
  border-bottom: none;
}

.points-table td {
  padding: 5px 8px;
  font-size: 13px;
  color: var(--GREY);
}

.event-name {
  font-weight: 500;
  color: var(--GREY-LIGHT);
  width: 50%;
}

.event-value {
  color: var(--GREY-DARKER);
  font-size: 12px;
  width: 25%;
}

.event-points {
  text-align: right;
  font-weight: 700;
  width: 25%;
}

.positive {
  color: var(--GREEN-LIGHT);
}
.negative {
  color: var(--ERROR);
}

.game-total {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  padding: 8px 8px 0;
  margin-top: 6px;
  border-top: 1px solid var(--GREY-DARKER);
  font-size: 13px;
}

.game-total-label {
  color: var(--PRIMARY-LIGHTER);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  flex: 1;
}

.game-total-value {
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
}

.game-total-captain {
  font-weight: 700;
  color: var(--GOLDEN-CAPTAIN);
}
.game-total-triple {
  font-weight: 700;
  color: var(--PRIMARY);
}

.crossed {
  text-decoration: line-through;
  opacity: 0.5;
}
</style>
