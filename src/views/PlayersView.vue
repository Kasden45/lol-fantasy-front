<!-- TeamSelection.vue -->
<template>
  <div class="teams-page">
    <div class="page-header">
      <div class="header-accent" />
      <div>
        <p class="eyebrow">LCK Fantasy</p>
        <h1 class="page-title">Team Players</h1>
      </div>
    </div>

    <div class="teams-list">
      <div
        v-for="team in teamPlayers"
        :key="team.esportsTeamId"
        class="team-block"
      >
        <!-- Team Header -->
        <div class="team-header">
          <img :src="team.imageUrl" class="team-logo" :alt="team.name" />
          <div class="team-info">
            <span class="team-league">{{ team.league }}</span>
            <h2 class="team-name">{{ team.name }}</h2>
          </div>
          <span class="team-code">{{ team.code }}</span>
        </div>

        <!-- Player Strips -->
        <div class="players-row">
          <div
            v-for="player in team.players.filter((p) => p.price > 0)"
            :key="player.esportsPlayerId"
            class="player-strip"
            :class="{
              expanded: expandedPlayer === player.esportsPlayerId,
              dimmed:
                expandedPlayer && expandedPlayer !== player.esportsPlayerId,
            }"
            :style="{ '--team-bg': `url(${team.backgroundImageUrl})` }"
            @mouseenter="expandedPlayer = player.esportsPlayerId"
            @mouseleave="expandedPlayer = null"
          >
            <div class="strip-collapsed">
              <div class="strip-face-wrapper">
                <img
                  :src="player.imageUrl"
                  class="strip-face"
                  :alt="player.summonerName"
                />
              </div>
              <img
                :src="$func_global.role_images[player.role]"
                class="role-icon"
                :alt="player.role"
              />
              <span class="strip-name">{{ player.summonerName }}</span>
            </div>

            <div class="strip-expanded">
              <div class="photo-wrapper">
                <img
                  :src="player.imageUrl"
                  class="player-photo"
                  :alt="player.summonerName"
                />
              </div>
              <div class="player-details">
                <span class="player-role-badge" :class="`role-${player.role}`">
                  {{ player.role.toUpperCase() }}
                </span>
                <p class="player-summoner">{{ player.summonerName }}</p>
                <p class="player-fullname">
                  {{ player.firstName }} {{ player.lastName }}
                </p>
              </div>
              <div class="player-stats">
                <div class="stat-item">
                  <span class="stat-label">Price</span>
                  <span class="stat-value">${{ player.price }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Points</span>
                  <span class="stat-value">{{ player.points }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Games</span>
                  <span class="stat-value">{{ player.gamesPlayed }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Pts/game</span>
                  <span class="stat-value">
                    {{
                      player.gamesPlayed > 0
                        ? (player.points / player.gamesPlayed).toFixed(1)
                        : "-"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamPlayers: [],
      expandedPlayer: null,
    };
  },
  methods: {
    fetchTeamPlayers() {
      this.axios
        .get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/teams_players`,
        )
        .then((response) => {
          const roleOrder = [
            "top",
            "jungle",
            "mid",
            "bottom",
            "support",
            "sub",
          ];

          this.teamPlayers = response.data.map((team) => ({
            ...team,
            players: [
              ...new Map(
                team.players.map((p) => [p.esportsPlayerId, p]),
              ).values(),
            ].sort(
              (a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role),
            ),
          }));
        })
        .catch((error) => {
          console.error("Error fetching team players:", error);
        });
    },
  },
  mounted() {
    this.fetchTeamPlayers();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap");
.teams-page {
  min-height: 100vh;
  background: var(--BACKGROUND-DARK);
  padding: 40px 32px;
  font-family: "DM Sans", sans-serif;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
}

.header-accent {
  width: 4px;
  height: 52px;
  border-radius: 4px;
  background: linear-gradient(180deg, var(--PRIMARY), var(--PRIMARY-LIGHTER));
  flex-shrink: 0;
}

.eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--PRIMARY);
}

.page-title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  color: var(--GREY-LIGHT);
  line-height: 1;
}

.team-block {
  border: 1px solid var(--GREY-DARKER);
  border-radius: 12px;
  overflow: visible;
  background: var(--BACKGROUND-LIGHTER);
}

/* Team header */
.team-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: var(--SECONDARY);
  border-bottom: 1px solid var(--GREY-DARKER);
  border-radius: 12px 12px 0 0;
}

.teams-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1100px) {
  .teams-list {
    grid-template-columns: 1fr;
  }
}

.team-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.team-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.team-league {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--PRIMARY-LIGHTER);
}

.team-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.team-code {
  font-size: 13px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  letter-spacing: 1px;
}

.players-row {
  display: flex;
  padding: 12px;
  gap: 0;
  min-height: 360px;
  align-items: stretch;
  position: relative;
}

.player-strip {
  position: relative;
  width: 100px; /* was 64px */
  flex-shrink: 0;
  border-radius: 0;
  background: var(--SECONDARY);
  border: 1px solid var(--GREY-DARKER);
  border-right: none;
  cursor: pointer;
  transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s,
    opacity 0.2s;
  overflow: hidden;
}

/* Restore rounding on first and last */
.player-strip:first-child {
  border-radius: 8px 0 0 8px;
}

.player-strip:last-child {
  border-radius: 0 8px 8px 0;
  border-right: 1px solid var(--GREY-DARKER);
}

.player-strip.expanded {
  width: 220px;
  border-color: var(--PRIMARY);
  border-right: 1px solid var(--PRIMARY);
  z-index: 10;
}

.player-strip.dimmed {
  opacity: 0.4;
}

/* Collapsed view */
.strip-collapsed {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* was center */
  justify-content: flex-end;
  height: 100%;
  padding: 0 0 14px 10px; /* left padding for name */
  gap: 8px;
  z-index: 1;
}
.strip-face-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.strip-face {
  width: 120px;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  /* transform: translateX(50%); */
  opacity: 0.5;
}
.player-strip.expanded .strip-collapsed {
  display: none;
}

.strip-name {
  font-size: 30px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
  white-space: nowrap;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  letter-spacing: 2px;
  font-family: "Bebas Neue", sans-serif;
  text-transform: uppercase;
}

.role-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 0px;
}

/* Expanded view */
.strip-expanded {
  display: none;
  flex-direction: column;
  height: 100%;
  width: 200px;
}

.player-strip.expanded .strip-expanded {
  display: flex;
}

.player-photo {
  width: 100%;
  height: 140px;
  object-fit: cover;
  object-position: top;
  flex-shrink: 0;
}

.player-details {
  padding: 10px 12px 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.player-role-badge {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 2px 7px;
  border-radius: 999px;
  width: fit-content;
  margin: 0 auto; /* add this */
}

.player-summoner {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--GREY-LIGHT);
}

.player-fullname {
  margin: 0;
  font-size: 11px;
  color: var(--GREY-DARKER);
}

/* Stats */
.player-stats {
  margin-top: auto;
  padding: 8px 12px 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  border-top: 1px solid var(--GREY-DARKER);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stat-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--GREY-DARKER);
}

.stat-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
}

/* Role colors */
.role-top,
.role-dot.role-top {
  background: var(--ROLE-TOP);
  color: var(--GREY-LIGHT);
}
.role-jungle,
.role-dot.role-jungle {
  background: var(--ROLE-JUNGLE);
  color: var(--GREY-LIGHT);
}
.role-mid,
.role-dot.role-mid {
  background: var(--ROLE-MID);
  color: var(--GREY-LIGHT);
}
.role-bottom,
.role-dot.role-bottom {
  background: var(--ROLE-BOTTOM);
  color: var(--GREY-LIGHT);
}
.role-support,
.role-dot.role-support {
  background: var(--ROLE-SUPPORT);
  color: var(--GREY-LIGHT);
}
.role-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  margin-left: 10px;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}
@media (max-width: 1250px) {
  .players-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0;
    min-height: unset;
    padding: 8px;
  }

  .player-strip {
    width: 100% !important;
    height: 160px;
    border-radius: 0 !important;
    border-right: none !important;
    border-bottom: none !important;
  }

  /* Restore borders on edges */
  .player-strip:last-child {
    border-right: none !important;
  }

  .player-strip.expanded {
    width: 100% !important;
    height: 320px;
    grid-column: span 2;
    border-color: var(--PRIMARY) !important;
    border: 1px solid var(--PRIMARY) !important;
  }

  .strip-face-wrapper {
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
  }

  .strip-face {
    width: 100%;
    height: 100%;
    transform: none;
    object-position: top;
    opacity: 0.5;
  }

  .strip-collapsed {
    padding: 0 0 10px 8px;
  }

  .strip-name {
    writing-mode: horizontal-tb;
    transform: none;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .role-icon {
    width: 16px;
    height: 16px;
    margin-left: 6px;
  }

  /* Expanded card takes full row */
  .strip-expanded {
    width: 100%;
  }

  .player-photo {
    height: 180px;
  }
}
</style>
