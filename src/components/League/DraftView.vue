<!-- TeamSelection.vue -->
<template>
  <DraftLeagueViewManager :leagueId="this.leagueId" />
  <!-- <Chat /> -->
</template>

<script>
import DraftLeagueViewManager from "@/components/Draft/DraftLeagueViewManager.vue";
export default {
  props: {
    leagueId: String,
    realLeagueId: Number,
  },
  components: {
    DraftLeagueViewManager,
  },
  data() {},
  mounted() {
    // this.getFixtures();
  },
  computed: {},
};
</script>

<style scoped></style>
