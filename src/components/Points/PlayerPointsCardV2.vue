<template>
  <div
    class="points-card"
    v-if="playerDetails != null"
    :class="{ 'card-captain': isCaptain, 'card-sub': isSub }"
  >
    <table class="points-table">
      <tbody>
        <tr
          v-for="(points, event) in playerDetails.pointsDetails"
          :key="event"
          v-show="points.value > 0 || points.value === true"
        >
          <td class="event-name">{{ eventDisplay[event] }}</td>
          <td class="event-value">
            {{
              points.value === true
                ? "✓"
                : points.value !== null
                ? points.value
                : "-"
            }}
          </td>
          <td
            class="event-points"
            :class="{
              negative: points.points < 0,
              positive: points.points > 0,
            }"
          >
            {{ points.points > 0 ? "+" : "" }}{{ points.points }}
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

  data() {
    return {
      eventDisplay: {
        kills: "Kills",
        assists: "Assists",
        deaths: "Deaths",
        trippleKills: "Triple kills",
        quardaKills: "Quadra kills",
        pentaKills: "Penta kills",
        nashorSteals: "Nashor steals",
        drakeSteals: "Drake steals",
        creepScore: "CS",
        firstBlood: "FB",
        over10KillsAssists: "K/A > 10",
      },
    };
  },
  methods: {
    calculateTotalPoints(pointsDetails) {
      return Object.values(pointsDetails).reduce(
        (total, points) => total + points.points,
        0,
      );
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
