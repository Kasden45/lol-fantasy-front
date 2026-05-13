<template>
  <div class="match-points-page">
    <div v-if="loading" class="state-msg">Loading...</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <template v-else-if="matchData">
      <!-- Match header -->
      <div class="match-header">
        <div class="header-team">
          <img
            v-if="matchData.team1ImageUrl"
            :src="matchData.team1ImageUrl"
            class="team-logo"
          />
          <span class="team-code">{{ matchData.team1Code }}</span>
        </div>
        <div class="header-score">
          {{ matchData.team1GamesWon ?? 0 }} –
          {{ matchData.team2GamesWon ?? 0 }}
        </div>
        <div class="header-team header-team-right">
          <span class="team-code">{{ matchData.team2Code }}</span>
          <img
            v-if="matchData.team2ImageUrl"
            :src="matchData.team2ImageUrl"
            class="team-logo"
          />
        </div>
      </div>

      <!-- Game sections — only played games -->
      <div v-for="game in playedGames" :key="game.gameId" class="game-section">
        <div class="game-header">
          <span class="game-label">Game {{ game.gameNumber }}</span>
          <span v-if="game.winner" class="winner-badge">
            {{ teamCodeFromSlug(game.winner) }} wins
          </span>
          <span v-if="game.duration" class="duration-badge">
            {{ formatDuration(game.duration) }}
          </span>
        </div>

        <!-- Mirrored two-column player tables -->
        <div class="players-grid">
          <!-- Team 1: Player | metrics → | Total -->
          <div class="team-players-section team-left">
            <div class="team-players-label">{{ matchData.team1Code }}</div>
            <div class="player-table-wrap">
              <table class="player-table">
                <thead>
                  <tr>
                    <th class="pt-player">Player</th>
                    <th
                      v-for="metric in playerMetrics"
                      :key="metric.key"
                      class="pt-metric-col"
                      :title="metric.label"
                    >
                      {{ metric.short }}
                    </th>
                    <th class="pt-total">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-for="player in game.team1Players"
                    :key="player.esportsPlayerId"
                  >
                    <tr class="pt-values-row">
                      <td class="pt-player-cell" rowspan="2">
                        <div class="pt-player-inner">
                          <img
                            v-if="player.imageUrl"
                            :src="player.imageUrl"
                            class="pt-avatar"
                          />
                          <div class="pt-player-info">
                            <span class="pt-name">{{
                              player.summonerName
                            }}</span>
                            <span class="pt-role">{{ player.role }}</span>
                          </div>
                        </div>
                      </td>
                      <td
                        v-for="metric in playerMetrics"
                        :key="metric.key"
                        class="pt-val"
                        :class="{ 'pt-val-kda': metric.isKda }"
                      >
                        {{
                          metric.isKda
                            ? kdaValue(player)
                            : formatMetricValue(
                                player.pointsDetails[metric.key],
                              )
                        }}
                      </td>
                      <td class="pt-total-cell" rowspan="2">
                        {{ Number(player.points).toFixed(1) }}
                      </td>
                    </tr>
                    <tr class="pt-points-row">
                      <td
                        v-for="metric in playerMetrics"
                        :key="metric.key"
                        class="pt-pts-cell"
                        :class="{
                          positive: metricPts(metric, player) > 0,
                          negative: metricPts(metric, player) < 0,
                        }"
                      >
                        {{ formatPts(metricPts(metric, player)) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Team 2: Total | ← metrics reversed | Player -->
          <div class="team-players-section team-right">
            <div class="team-players-label team-players-label-right">
              {{ matchData.team2Code }}
            </div>
            <div class="player-table-wrap">
              <table class="player-table">
                <thead>
                  <tr>
                    <th class="pt-total">Pts</th>
                    <th
                      v-for="metric in playerMetricsReversed"
                      :key="metric.key"
                      class="pt-metric-col"
                      :title="metric.label"
                    >
                      {{ metric.short }}
                    </th>
                    <th class="pt-player pt-player-right">Player</th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-for="player in game.team2Players"
                    :key="player.esportsPlayerId"
                  >
                    <tr class="pt-values-row">
                      <td class="pt-total-cell pt-total-left" rowspan="2">
                        {{ Number(player.points).toFixed(1) }}
                      </td>
                      <td
                        v-for="metric in playerMetricsReversed"
                        :key="metric.key"
                        class="pt-val"
                        :class="{ 'pt-val-kda': metric.isKda }"
                      >
                        {{
                          metric.isKda
                            ? kdaValue(player)
                            : formatMetricValue(
                                player.pointsDetails[metric.key],
                              )
                        }}
                      </td>
                      <td
                        class="pt-player-cell pt-player-cell-right"
                        rowspan="2"
                      >
                        <div class="pt-player-inner pt-player-inner-right">
                          <img
                            v-if="player.imageUrl"
                            :src="player.imageUrl"
                            class="pt-avatar"
                          />
                          <div class="pt-player-info pt-player-info-right">
                            <span class="pt-name">{{
                              player.summonerName
                            }}</span>
                            <span class="pt-role">{{ player.role }}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr class="pt-points-row">
                      <td
                        v-for="metric in playerMetricsReversed"
                        :key="metric.key"
                        class="pt-pts-cell"
                        :class="{
                          positive: metricPts(metric, player) > 0,
                          negative: metricPts(metric, player) < 0,
                        }"
                      >
                        {{ formatPts(metricPts(metric, player)) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Team stats — mirrored column layout -->
        <div class="players-grid">
          <!-- Team 1 stats -->
          <div class="team-players-section team-left">
            <div class="team-players-label">{{ matchData.team1Code }} team</div>
            <div class="player-table-wrap">
              <table class="player-table">
                <thead>
                  <tr>
                    <th class="pt-player">Team</th>
                    <th
                      v-for="metric in teamMetrics"
                      :key="metric.key"
                      class="pt-metric-col"
                      :title="metric.label"
                    >
                      <img
                        v-if="metric.icon"
                        :src="metric.icon"
                        :alt="metric.short"
                        class="metric-icon"
                      />
                      <span v-else>{{ metric.short }}</span>
                    </th>
                    <th class="pt-total">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="game.team1Stats">
                    <tr class="pt-values-row">
                      <td class="pt-player-cell" rowspan="2">
                        <div class="pt-player-inner">
                          <img
                            v-if="matchData.team1ImageUrl"
                            :src="matchData.team1ImageUrl"
                            class="pt-avatar"
                          />
                          <div class="pt-player-info">
                            <span class="pt-name">{{
                              matchData.team1Code
                            }}</span>
                          </div>
                        </div>
                      </td>
                      <td
                        v-for="metric in teamMetrics"
                        :key="metric.key"
                        class="pt-val"
                      >
                        {{
                          formatMetricValue(
                            game.team1Stats.pointsDetails[metric.key],
                          )
                        }}
                      </td>
                      <td class="pt-total-cell" rowspan="2">
                        {{ Number(game.team1Stats.points).toFixed(1) }}
                      </td>
                    </tr>
                    <tr class="pt-points-row">
                      <td
                        v-for="metric in teamMetrics"
                        :key="metric.key"
                        class="pt-pts-cell"
                        :class="{
                          positive:
                            game.team1Stats.pointsDetails[metric.key]?.points >
                            0,
                          negative:
                            game.team1Stats.pointsDetails[metric.key]?.points <
                            0,
                        }"
                      >
                        {{
                          formatPts(
                            game.team1Stats.pointsDetails[metric.key]?.points,
                          )
                        }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Team 2 stats -->
          <div class="team-players-section team-right">
            <div class="team-players-label team-players-label-right">
              {{ matchData.team2Code }} team
            </div>
            <div class="player-table-wrap">
              <table class="player-table">
                <thead>
                  <tr>
                    <th class="pt-total">Pts</th>
                    <th
                      v-for="metric in teamMetricsReversed"
                      :key="metric.key"
                      class="pt-metric-col"
                      :title="metric.label"
                    >
                      <img
                        v-if="metric.icon"
                        :src="metric.icon"
                        :alt="metric.short"
                        class="metric-icon"
                      />
                      <span v-else>{{ metric.short }}</span>
                    </th>
                    <th class="pt-player pt-player-right">Team</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="game.team2Stats">
                    <tr class="pt-values-row">
                      <td class="pt-total-cell pt-total-left" rowspan="2">
                        {{ Number(game.team2Stats.points).toFixed(1) }}
                      </td>
                      <td
                        v-for="metric in teamMetricsReversed"
                        :key="metric.key"
                        class="pt-val"
                      >
                        {{
                          formatMetricValue(
                            game.team2Stats.pointsDetails[metric.key],
                          )
                        }}
                      </td>
                      <td
                        class="pt-player-cell pt-player-cell-right"
                        rowspan="2"
                      >
                        <div class="pt-player-inner pt-player-inner-right">
                          <img
                            v-if="matchData.team2ImageUrl"
                            :src="matchData.team2ImageUrl"
                            class="pt-avatar"
                          />
                          <div class="pt-player-info pt-player-info-right">
                            <span class="pt-name">{{
                              matchData.team2Code
                            }}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr class="pt-points-row">
                      <td
                        v-for="metric in teamMetricsReversed"
                        :key="metric.key"
                        class="pt-pts-cell"
                        :class="{
                          positive:
                            game.team2Stats.pointsDetails[metric.key]?.points >
                            0,
                          negative:
                            game.team2Stats.pointsDetails[metric.key]?.points <
                            0,
                        }"
                      >
                        {{
                          formatPts(
                            game.team2Stats.pointsDetails[metric.key]?.points,
                          )
                        }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Totals section -->
      <div class="totals-section" v-if="matchData.totals">
        <div class="tab-toggle">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'leaderboard' }"
            @click="activeTab = 'leaderboard'"
          >
            Leaderboard <span class="tab-sub">avg/game</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'byTeam' }"
            @click="activeTab = 'byTeam'"
          >
            By Team <span class="tab-sub">avg/game</span>
          </button>
        </div>

        <!-- Leaderboard tab -->
        <div v-if="activeTab === 'leaderboard'" class="leaderboard">
          <div
            v-for="(player, index) in matchData.totals.playerLeaderboard"
            :key="player.playerId"
            class="leaderboard-row"
          >
            <span class="lb-rank">{{ index + 1 }}</span>
            <img
              v-if="player.imageUrl"
              :src="player.imageUrl"
              class="player-avatar"
            />
            <span class="lb-name">{{ player.summonerName }}</span>
            <span class="lb-role">{{ player.role }}</span>
            <span class="lb-team">{{ player.teamCode }}</span>
            <span class="lb-pts">{{ avgPts(player.totalPoints) }}</span>
          </div>
        </div>

        <!-- By Team tab -->
        <div v-if="activeTab === 'byTeam'" class="by-team-grid">
          <div
            v-for="(teamTotal, tIdx) in [
              matchData.totals.team1Total,
              matchData.totals.team2Total,
            ]"
            :key="tIdx"
            class="by-team-column"
          >
            <div class="by-team-header">
              <img
                v-if="teamTotal?.imageUrl"
                :src="teamTotal.imageUrl"
                class="team-logo-sm"
              />
              <span class="by-team-code">{{ teamTotal?.teamCode }}</span>
            </div>
            <div
              v-for="player in teamTotal?.players ?? []"
              :key="player.playerId"
              class="by-team-row"
            >
              <template v-if="tIdx === 0">
                <span class="bt-name">{{ player.summonerName }}</span>
                <span class="bt-role">{{ player.role }}</span>
                <span class="bt-pts">{{ avgPts(player.totalPoints) }}</span>
              </template>
              <template v-else>
                <span class="bt-pts">{{ avgPts(player.totalPoints) }}</span>
                <span class="bt-role bt-role-center">{{ player.role }}</span>
                <span class="bt-name bt-name-right">{{ player.summonerName }}</span>
              </template>
            </div>
            <div class="by-team-row">
              <template v-if="tIdx === 0">
                <span class="bt-name">{{ teamTotal?.teamName }}</span>
                <span class="bt-role"></span>
                <span class="bt-pts">{{ avgPts(teamTotal?.totalPoints ?? 0) }}</span>
              </template>
              <template v-else>
                <span class="bt-pts">{{ avgPts(teamTotal?.totalPoints ?? 0) }}</span>
                <span class="bt-role"></span>
                <span class="bt-name bt-name-right">{{ teamTotal?.teamName }}</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "MatchPointsView",
  data() {
    return {
      matchData: null,
      loading: true,
      error: null,
      activeTab: "leaderboard",
    };
  },
  mounted() {
    this.fetchMatchPoints();
  },
  methods: {
    async fetchMatchPoints() {
      try {
        const matchId = this.$route.params.matchId;
        const tournamentCode = this.$store.getters.getCurrentTournamentId;
        const response = await this.axios.get(
          `${this.apiURL}Matches/${tournamentCode}/points/${matchId}`,
        );
        this.matchData = response.data;
      } catch (e) {
        this.error = "Failed to load match points.";
      } finally {
        this.loading = false;
      }
    },
    formatDuration(duration) {
      if (!duration) return "";
      const parts = duration.split(":");
      const mins = parseInt(parts[1], 10);
      const secs = parts[2] ? parts[2].substring(0, 2) : "00";
      return `${mins}:${secs}`;
    },
    teamCodeFromSlug(slug) {
      if (!slug || !this.matchData) return slug;
      if (slug === this.matchData.team1Slug) return this.matchData.team1Code;
      if (slug === this.matchData.team2Slug) return this.matchData.team2Code;
      return slug;
    },
    formatMetricValue(detail) {
      if (!detail) return "-";
      if (detail.value === true) return "✓";
      if (detail.value === false) return "✗";
      if (detail.value === null || detail.value === undefined) return "-";
      return detail.value;
    },
    formatPts(pts) {
      if (pts === null || pts === undefined) return "-";
      const n = Number(pts);
      return n > 0 ? `+${n.toFixed(1)}` : n.toFixed(1);
    },
    kdaValue(player) {
      const d = player.pointsDetails;
      const k = d?.kills?.value ?? "-";
      const de = d?.deaths?.value ?? "-";
      const a = d?.assists?.value ?? "-";
      return `${k}/${de}/${a}`;
    },
    kdaPoints(player) {
      const d = player.pointsDetails;
      return (
        (d?.kills?.points ?? 0) +
        (d?.deaths?.points ?? 0) +
        (d?.assists?.points ?? 0)
      );
    },
    metricPts(metric, player) {
      if (metric.isKda) return this.kdaPoints(player);
      return player.pointsDetails[metric.key]?.points;
    },
    avgPts(totalPoints) {
      const count = this.playedGames.length || 1;
      return Number(totalPoints / count).toFixed(1);
    },
  },
  computed: {
    playedGames() {
      return (
        this.matchData?.games?.filter(
          (g) => g.team1Players?.length > 0 || g.winner != null,
        ) ?? []
      );
    },
    playerMetrics() {
      return [
        { key: "drakeSteals", label: "Drake steals", short: "DS" },
        { key: "nashorSteals", label: "Nashor steals", short: "NS" },
        { key: "pentaKills", label: "Penta kills", short: "5K" },
        { key: "quardaKills", label: "Quadra kills", short: "4K" },
        { key: "trippleKills", label: "Triple kills", short: "3K" },
        { key: "over10KillsAssists", label: "K/A > 10", short: "KA" },
        { key: "firstBlood", label: "First Blood", short: "FB" },
        { key: "creepScore", label: "CS", short: "CS" },
        { key: "kda", label: "K/D/A", short: "K/D/A", isKda: true },
      ];
    },
    playerMetricsReversed() {
      return [...this.playerMetrics].reverse();
    },
    teamMetrics() {
      const cdn = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default";
      return [
        { key: "win",         short: "W",    label: "Win" },
        { key: "under30Win",  short: "<30W", label: "Win under 30 min" },
        { key: "over30Lose",  short: ">30L", label: "Lose over 30 min" },
        { key: "firstBlood",  short: "FB",   label: "First Blood" },
        { key: "kills",       short: "K",    label: "Kills" },
        { key: "deaths",      short: "D",    label: "Deaths" },
        { key: "assists",     short: "A",    label: "Assists" },
        { key: "drakes",      short: "DR",   label: "Dragons",   icon: `${cdn}/dragon-100.png` },
        { key: "nashors",     short: "NS",   label: "Nashors",   icon: `${cdn}/baron-100.png` },
        { key: "towers",      short: "TWR",  label: "Towers",    icon: `${cdn}/tower-100.png` },
        { key: "voidgrubs",   short: "VG",   label: "Voidgrubs", icon: `${cdn}/herald-100.png` },
      ];
    },
    teamMetricsReversed() {
      return [...this.teamMetrics].reverse();
    },
  },
};
</script>

<style scoped>
.match-points-page {
  min-height: 100vh;
  width: fit-content;
  justify-self: center;
  background: var(--BACKGROUND-DARK);
  padding: 24px 20px;
  font-family: "DM Sans", sans-serif;
}

.state-msg {
  padding: 40px;
  text-align: center;
  color: var(--GREY);
  font-size: 14px;
}

.state-msg.error {
  color: var(--ERROR);
}

/* Match header */
.match-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 20px;
}

.header-team {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.header-team-right {
  justify-content: flex-end;
}

.team-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 50%;
}

.team-code {
  font-size: 16px;
  font-weight: 800;
  color: var(--GREY-LIGHT);
  text-transform: uppercase;
}

.header-score {
  font-size: 22px;
  font-weight: 800;
  color: var(--PRIMARY-LIGHTER);
  min-width: 80px;
  text-align: center;
}

/* Game section */
.game-section {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--SECONDARY);
  border-bottom: 1px solid var(--GREY-DARKER);
}

.game-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.winner-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--GREEN-LIGHT);
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 4px;
  padding: 2px 8px;
}

.duration-badge {
  font-size: 11px;
  color: var(--GREY-DARKER);
  margin-left: auto;
}

/* Mirrored two-column grid — shared by players and team stats */
.players-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.players-grid:last-child {
  border-bottom: none;
}

.team-players-section {
  overflow: hidden;
}

.team-left {
  border-right: 1px solid var(--GREY-DARKER);
}

.team-players-label {
  padding: 5px 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
  background: var(--BACKGROUND-DARK);
  border-bottom: 1px solid var(--GREY-DARKER);
}

.player-table-wrap {
  overflow-x: auto;
}

.player-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.player-table thead th {
  padding: 5px 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  background: var(--SECONDARY);
  border-bottom: 1px solid var(--GREY-DARKER);
  white-space: nowrap;
}

.pt-player {
  text-align: left !important;
  min-width: 100px;
}

.pt-player-right {
  text-align: right !important;
}

.metric-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  filter: brightness(0.85);
}

.pt-metric-col {
  width: 30px;
  min-width: 26px;
}

.pt-total {
  min-width: 38px;
  text-align: center !important;
}

/* Player name cell (rowspan 2) — Team 1 left side */
.pt-player-cell {
  padding: 4px 8px 4px 6px;
  vertical-align: middle;
  border-bottom: 1px solid var(--GREY-DARKER);
  border-right: 1px solid var(--GREY-DARKER);
}

/* Player name cell — Team 2 right side */
.pt-player-cell-right {
  padding: 4px 6px 4px 8px;
  border-right: none;
  border-left: 1px solid var(--GREY-DARKER);
  text-align: right !important;
}

.pt-player-inner {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Team 2: avatar on right, text on left — avatar flush to outer edge */
.pt-player-inner-right {
  flex-direction: row-reverse;
}

.pt-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.pt-player-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.pt-player-info-right {
  align-items: flex-end;
}

.pt-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  white-space: nowrap;
}

.pt-role {
  font-size: 11px;
  color: var(--GREY-DARKER);
  text-transform: capitalize;
}

/* Values row */
.pt-values-row td {
  border-bottom: none;
}

.pt-val {
  padding: 4px 2px 1px;
  text-align: center;
  color: var(--GREY);
  font-size: 13px;
  font-weight: 600;
}

.pt-val-kda {
  font-size: 12px;
  white-space: nowrap;
}

/* Points row */
.pt-points-row td {
  border-bottom: 1px solid var(--GREY-DARKER);
}

.pt-pts-cell {
  padding: 1px 2px 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--GREY-DARKER);
}

.pt-pts-cell.positive {
  color: var(--GREEN-LIGHT);
}

.pt-pts-cell.negative {
  color: var(--ERROR);
}

/* Total cell (rowspan 2) — Team 1 right edge */
.pt-total-cell {
  padding: 4px 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;
  color: var(--PRIMARY-LIGHTER);
  border-bottom: 1px solid var(--GREY-DARKER);
  border-left: 1px solid var(--GREY-DARKER);
  vertical-align: middle;
  white-space: nowrap;
}

/* Total cell — Team 2 left edge */
.pt-total-left {
  border-left: none;
  border-right: 1px solid var(--GREY-DARKER);
}

/* Totals section */
.totals-section {
  background: var(--BACKGROUND-LIGHTER);
  border: 1px solid var(--GREY-DARKER);
  border-radius: 12px;
  margin-top: 20px;
  overflow: hidden;
}

.tab-toggle {
  display: flex;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.tab-btn {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: var(--GREY-DARKER);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.15s, background 0.15s;
}

.tab-btn.active {
  color: var(--PRIMARY-LIGHTER);
  background: var(--SECONDARY);
  border-bottom: 2px solid var(--PRIMARY);
}

/* Leaderboard */
.leaderboard {
  padding: 8px 0;
}

.leaderboard-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.lb-rank {
  font-size: 11px;
  font-weight: 700;
  color: var(--GREY-DARKER);
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}

.lb-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--GREY-LIGHT);
  flex: 1;
}

.lb-role {
  font-size: 10px;
  color: var(--GREY-DARKER);
  text-transform: capitalize;
  width: 60px;
}

.lb-team {
  font-size: 11px;
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
  width: 40px;
  text-align: center;
}

.lb-pts {
  font-size: 13px;
  font-weight: 800;
  color: var(--PRIMARY-LIGHTER);
  width: 48px;
  text-align: right;
}

/* By Team */
.by-team-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.by-team-column {
  border-right: 1px solid var(--GREY-DARKER);
  padding: 12px 0;
}

.by-team-column:last-child {
  border-right: none;
}

.by-team-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 16px 10px;
  border-bottom: 1px solid var(--GREY-DARKER);
  margin-bottom: 4px;
}

.team-logo-sm {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: contain;
}

.by-team-code {
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  color: var(--GREY-LIGHT);
  text-transform: uppercase;
}

.by-team-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px;
  border-bottom: 1px solid var(--GREY-DARKER);
}

.by-team-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 16px;
  background: var(--SECONDARY);
  margin-top: 2px;
}

.bt-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--GREY-LIGHT);
  flex: 1;
}

.bt-name-right {
  text-align: right;
}

.bt-role {
  font-size: 10px;
  color: var(--GREY-DARKER);
  text-transform: capitalize;
  width: 55px;
}

.bt-role-center {
  text-align: center;
}

.bt-pts {
  font-size: 12px;
  font-weight: 800;
  color: var(--PRIMARY-LIGHTER);
  width: 44px;
  text-align: right;
}
</style>
