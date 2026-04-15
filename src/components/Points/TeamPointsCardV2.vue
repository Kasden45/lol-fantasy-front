<template>
  <div class="points-card" v-if="playerDetails != null">
    <table class="points-table">
      <tbody>
        <tr
          v-for="(points, event) in playerDetails.pointsDetails"
          :key="event"
          v-show="points.value > 0 || points.value === true"
        >
          <td class="event-name">{{ eventDisplay[event] }}</td>
          <td class="event-value">
            {{ points.value !== null ? points.value : "-" }}
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
      <span class="game-total-value">{{
        playerDetails.points.toFixed(2)
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeamPointsCardV2",
  props: {
    playerDetails: Object,
    totalPoints: Number,
    isCaptain: Boolean,
    isSub: Boolean,
    title: String,
  },
  data() {
    return {
      eventDisplay: {
        kills: "Kills",
        assists: "Assists",
        deaths: "Deaths",
        firstBlood: "First blood",
        drakes: "Drakes",
        nashors: "Nashors",
        towers: "Towers",
        over30Lose: "Over 30 min lose",
        under30Win: "Under 30 min win",
        voidgrubs: "Voidgrubs",
        win: "Win",
      },
    };
  },
};
</script>

<style scoped>
/* same as PlayerPointsCardV2 styles above */
.points-card {
  padding: 12px 0 8px;
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
</style>
