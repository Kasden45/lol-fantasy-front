<template>
  <div class="dt-tile" :class="{ 'dt-tile--highlighted': highlighted }">
    <div class="dt-tile__photo-wrap">
      <img :src="player.imageUrl" :alt="player.summonerName" class="dt-tile__photo" />
      <img
        v-if="roleIcon"
        :src="roleIcon"
        :alt="player.role"
        class="dt-tile__role-badge"
      />
      <img
        v-if="flagUrl"
        :src="flagUrl"
        alt="nationality flag"
        class="dt-tile__flag"
      />
    </div>
    <div class="dt-tile__name">{{ player.summonerName }}</div>
    <div class="dt-tile__meta" v-if="player.team">
      <img
        v-if="player.team.imageUrl"
        :src="player.team.imageUrl"
        alt="team logo"
        class="dt-tile__team-logo"
      />
      <span class="dt-tile__team-code">{{ player.team.code }}</span>
    </div>
    <div class="dt-tile__points">{{ player.points.toFixed(1) }} pts</div>
  </div>
</template>

<script>
export default {
  name: "DreamTeamPlayerTile",
  props: {
    player: {
      type: Object,
      required: true,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    roleIcon() {
      return this.$func_global.role_images[this.player.role] || null;
    },
    flagUrl() {
      const nationality = this.player.nationality;
      if (!nationality) return this.$func_global.nation_flag["Default"];
      return (
        this.$func_global.nation_flag[nationality] ||
        this.$func_global.nation_flag["Default"]
      );
    },
  },
};
</script>

<style scoped>
.dt-tile {
  width: clamp(84px, 9vw, 130px);
  background: var(--SECONDARY);
  border-radius: 1rem;
  padding: 0.4rem;
  color: white;
  text-align: center;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.25);
}

.dt-tile--highlighted {
  box-shadow:
    0 0 0 3px var(--GOLDEN-CAPTAIN),
    0 8px 8px rgba(0, 0, 0, 0.25);
}

.dt-tile__photo-wrap {
  position: relative;
  width: clamp(52px, 6vw, 84px);
  aspect-ratio: 1 / 1;
  margin: 0 auto 0.3rem;
}

.dt-tile__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--GREY-DARKER);
}

.dt-tile--highlighted .dt-tile__photo {
  border-color: var(--GOLDEN-CAPTAIN);
}

.dt-tile__role-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: clamp(16px, 2vw, 24px);
  height: clamp(16px, 2vw, 24px);
  border-radius: 50%;
  background: var(--BACKGROUND-DARK);
  padding: 2px;
  object-fit: contain;
}

.dt-tile__flag {
  position: absolute;
  top: -2px;
  left: -2px;
  width: clamp(14px, 1.6vw, 18px);
  height: clamp(14px, 1.6vw, 18px);
  border-radius: 2px;
  object-fit: cover;
}

.dt-tile__name {
  font-size: clamp(0.55rem, 1vw, 0.75rem);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-tile__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: clamp(0.5rem, 0.9vw, 0.65rem);
  color: var(--GREY);
  margin: 0.1rem 0;
}

.dt-tile__team-logo {
  width: 12px;
  height: 12px;
  object-fit: contain;
}

.dt-tile__points {
  font-size: clamp(0.55rem, 1vw, 0.75rem);
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
}
</style>
