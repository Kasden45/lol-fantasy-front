<template>
  <div class="games-card">
    <!-- Player summary header -->
    <PlayerPointsDetails
      class="player-summary"
      v-if="gamesPointsDetails != null"
      :role="'top'"
      :teamPlayer="gamesPointsDetails[0]"
      :points="totalPointsA"
      :isCaptain="isCaptain"
      :img_url="null"
      :details="true"
      :roles_img_url="$func_global.role_images"
    />

    <!-- Accordion grouped by match -->
    <div class="accordion" v-if="gamesPointsDetails != null">
      <div
        v-for="(matchGroup, matchId) in groupedByMatch"
        :key="matchId"
        class="accordion-item"
      >
        <!-- Match header -->
        <div
          class="accordion-header"
          :class="{ open: expandedMatch === matchId }"
          @click="expandedMatch = expandedMatch === matchId ? null : matchId"
        >
          <div class="accordion-header-left">
            <span class="match-versus"
              >vs {{ getOpponent(matchGroup[0].gameId) }}</span
            >
            <span class="match-game-count"
              >{{ matchGroup.length }} game{{
                matchGroup.length > 1 ? "s" : ""
              }}</span
            >
          </div>
          <div class="accordion-header-right">
            <span class="match-points"
              >{{ matchTotal(matchGroup).toFixed(2) }} pts</span
            >
            <span class="accordion-chevron">{{
              expandedMatch === matchId ? "▲" : "▼"
            }}</span>
          </div>
        </div>

        <!-- Games inside match -->
        <div class="accordion-body" v-show="expandedMatch === matchId">
          <div
            v-for="(game, index) in matchGroup"
            :key="game.gameId"
            class="game-entry"
            :class="{ 'game-entry-bordered': index < matchGroup.length - 1 }"
          >
            <div class="game-entry-header">
              <span class="game-number">{{ getGameHeader(game.gameId) }}</span>
              <span class="game-pts" :class="{ negative: game.points < 0 }">
                {{ game.points.toFixed(2) }} pts
              </span>
            </div>
            <PlayerPointsCardV2
              :playerDetails="game"
              :isCaptain="isCaptain"
              :isSub="isSub"
              :totalPoints="totalPointsA"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerPointsCardV2 from "@/components/Points/PlayerPointsCardV2.vue";
import PlayerPointsDetails from "@/components/Points/PlayerPointsDetails.vue";
export default {
  name: "PlayerPointsGamesCardV2",
  props: {
    gamesList: Array,
    gamesPointsDetails: Array,
    totalPointsA: Number,
    isCaptain: Boolean,
    isSub: Boolean,
  },
  components: {
    PlayerPointsDetails,
    PlayerPointsCardV2,
  },
  mounted() {
    // Auto-expand the first match
    const keys = Object.keys(this.groupedByMatch);
    if (keys.length > 0) this.expandedMatch = keys[0];
  },
  computed: {
    groupedByMatch() {
      if (!this.gamesPointsDetails) return {};
      return this.gamesPointsDetails
        .slice()
        .sort((a, b) => (a.gameId > b.gameId ? 1 : -1))
        .reduce((acc, game) => {
          const key = game.matchId || game.gameId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(game);
          return acc;
        }, {});
    },
  },
  data() {
    return {
      expandedMatch: null,
      selectedGameIndex: 0,
    };
  },
  methods: {
    getOpponent(gameId) {
      const game = this.gamesList?.find((g) => g.gameId === gameId);
      if (!game) return "?";
      const teamCode = this.gamesPointsDetails[0]?.team?.code;
      return game.gameTeam1 === teamCode ? game.gameTeam2 : game.gameTeam1;
    },
    getGameHeader(gameId) {
      const game = this.gamesList?.find((g) => g.gameId === gameId);
      if (!game) return "";
      const teamCode = this.gamesPointsDetails[0]?.team?.code;
      const opponent =
        game.gameTeam1 === teamCode ? game.gameTeam2 : game.gameTeam1;
      return `Game ${game.gameNumber} vs ${opponent}`;
    },
    matchTotal(matchGroup) {
      return (
        matchGroup.reduce((sum, g) => sum + (g.points || 0), 0) /
        matchGroup.length
      );
    },
  },
};
</script>

<style scoped>
.games-card {
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 8px;
  width: 100%;
  justify-content: center;
}
@media (max-width: 768px) {
  .games-card {
    flex-direction: column;
    align-items: center;
  }
}
.accordion {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: inherit;
}

.accordion-item {
  border: 1px solid var(--GREY-DARKER);
  border-radius: 8px;
  overflow: hidden;
  background: var(--SECONDARY);
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
  background: var(--BACKGROUND-DARK);
}

.accordion-header:hover,
.accordion-header.open {
  background: var(--SECONDARY);
}

.accordion-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.match-versus {
  font-size: 18px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.match-game-count {
  font-size: 11px;
  color: var(--PRIMARY-LIGHTER);
}

.accordion-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.match-points {
  font-size: 13px;
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
}

.accordion-chevron {
  font-size: 10px;
  color: var(--GREY-DARKER);
}

.accordion-body {
  padding: 0 14px;
}

.game-entry {
  padding: 4px 0;
}

.game-entry-bordered {
  border-bottom: 1px solid var(--GREY-DARKER);
}

.game-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 4px;
}

.game-number {
  font-size: 11px;
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.game-pts {
  font-size: 12px;
  font-weight: 600;
  color: var(--GREEN-LIGHT);
}

.game-pts.negative {
  color: var(--ERROR);
}
.player-summary {
  width: inherit;
}
</style>
