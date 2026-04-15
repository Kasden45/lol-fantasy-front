<template>
  <div class="games-card">
    <!-- <TeamPointsDetails
      class="player-summary"
      v-if="gamesPointsDetails != null"
      :role="'team'"
      :teamTeam="gamesPointsDetails[0]"
      :leagues_icons="$func_global.leagues_icons"
      :points="totalPointsA"
      :isCaptain="false"
      :img_url="null"
      :details="true"
      :roles_img_url="$func_global.role_images"
    /> -->
    <div class="player-tile-container">
      <div class="tile-header row" v-if="gamesPointsDetails[0]">
        <div class="col-2 inline-text-flag">
          <img class="flag" :src="gamesPointsDetails[0]?.imageUrl" alt="flag" />
        </div>
        <div class="col-8 align-content-center">
          <span class="player-name">{{ gamesPointsDetails[0]?.name }}</span>
        </div>
        <div class="col-2 inline-text-flag role-sub">
          <span class="match-points">
            {{
              totalPointsA
                ? totalPointsA.toFixed(2)
                : playerPoints?.totalPoints?.toFixed(2) ?? 0
            }} pts
          </span>
        </div>
      </div>
    </div>
    <div class="accordion" v-if="gamesPointsDetails != null">
      <div
        v-for="(matchGroup, matchId) in groupedByMatch"
        :key="matchId"
        class="accordion-item"
      >
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
            <TeamPointsCardV2
              :playerDetails="game"
              :isCaptain="false"
              :totalPoints="totalPointsA"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TeamPointsCardV2 from "@/components/Points/TeamPointsCardV2.vue";
import TeamPointsDetails from "@/components/Points/TeamPointsDetails.vue";
export default {
  name: "TeamPointsGamesCardV2",
  props: {
    gamesList: Array,
    gamesPointsDetails: Array,
    totalPointsA: Number,
  },
  components: { TeamPointsCardV2, TeamPointsDetails },
  data() {
    return { expandedMatch: null };
  },
  computed: {
    groupedByMatch() {
      if (!this.gamesPointsDetails) return {};
      return this.gamesPointsDetails
        .slice()
        .sort((a, b) => (a.gameId > b.gameId ? 1 : -1))
        .reduce((acc, game) => {
          const key = game.matchId || game.gameId;
          if (key === undefined) return acc; // Skip if no matchId or gameId
          if (!acc[key]) acc[key] = [];
          acc[key].push(game);
          return acc;
        }, {});
    },
  },
  methods: {
    getOpponent(gameId) {
      const game = this.gamesList?.find((g) => g.gameId === gameId);
      if (!game) return "?";
      const teamCode = this.gamesPointsDetails[0]?.code;
      return game.gameTeam1 === teamCode ? game.gameTeam2 : game.gameTeam1;
    },
    getGameHeader(gameId) {
      const game = this.gamesList?.find((g) => g.gameId === gameId);
      if (!game) return "";
      const teamCode = this.gamesPointsDetails[0]?.code;
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
  mounted() {
    const keys = Object.keys(this.groupedByMatch);
    // if (keys.length > 0) this.expandedMatch = keys[0];
  },
};
</script>

<style scoped>
/* identical to PlayerPointsGamesCardV2 styles */
.player-tile-container {
  background: var(--SECONDARY);
  color: white;
  padding: 0px 10px;
  border-radius: 8px;
}
.games-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
  width: 50%;
  justify-content: center;
  justify-self: center;
}
.tile-header {
  font-weight: bold;
  font-size: 1.8rem;
  display: flex;
  flex-wrap: nowrap;
}
@media (max-width: 768px) {
  .games-card {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .tile-header {
    font-weight: bold;
    font-size: 1.2rem;
    display: flex;
    flex-wrap: nowrap;
  }
  .player-tile-container {
    width: 100% !important;
  }
}
.accordion {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
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
  padding-right: 5px;
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

.inline-text-flag {
  display: flex;
  align-items: center;
  justify-content: start;
  /* gap: 0.5rem; */
  /* font-weight: 600; */
  font-size: 0.4rem;
}
.captain-player {
  /* background-color: rgb(250, 212, 44) !important; */
  color: var(--GOLDEN-CAPTAIN) !important;
}
.role-sub {
  justify-content: end !important;
}
.player-name {
  display: flex;
  justify-content: center;
}
.flag {
  width: 2rem;
  /* height: stretch; */
  /* height: min-content; */
  object-fit: cover;
  border-radius: 2px;
}
</style>
