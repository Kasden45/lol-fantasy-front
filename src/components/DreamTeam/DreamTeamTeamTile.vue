<template>
  <div class="dt-team-tile">
    <img
      v-if="team.imageUrl"
      :src="team.imageUrl"
      :alt="team.name"
      class="dt-team-tile__logo"
    />
    <div class="dt-team-tile__name">{{ team.name }}</div>
    <div class="dt-team-tile__points">{{ team.points.toFixed(1) }} pts</div>
  </div>
</template>

<script>
export default {
  name: "DreamTeamTeamTile",
  props: {
    team: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.dt-team-tile {
  width: clamp(90px, 10vw, 140px);
  background: var(--SECONDARY);
  border-radius: 1rem;
  padding: 0.5rem;
  color: white;
  text-align: center;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.25);
}

.dt-team-tile__logo {
  width: clamp(48px, 6vw, 76px);
  height: clamp(48px, 6vw, 76px);
  object-fit: contain;
  margin: 0 auto 0.3rem;
  display: block;
}

.dt-team-tile__name {
  font-size: clamp(0.6rem, 1.1vw, 0.8rem);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-team-tile__points {
  font-size: clamp(0.55rem, 1vw, 0.75rem);
  font-weight: 700;
  color: var(--PRIMARY-LIGHTER);
  margin-top: 0.15rem;
}
</style>
