<!-- TeamSelection.vue -->
<template>
  <PickTest :leagueId="this.leagueId"/>
  <Chat/>
    
  </template>
  
  <script>
  import PickTest from '@/components/ChatTest/PickTest.vue';
  import Chat from '@/components/ChatTest/Chat.vue';
  export default {
    props:{
      leagueId: String
    },
    components: {
      PickTest,
      Chat
    },
    data() {
    },
    mounted(){
      // this.getFixtures();
    },
    computed: {
      
    }        
  };
  </script>

  <style scoped>
.players-list-container {
  height: 40vh;
  overflow-y: scroll;
  overflow-x: scroll;
  padding-left: 0%;
  padding-right: 0%;
  border: 1px solid #ddd;
}

::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: var(--DARK-YELLOW);
}

.game-tabs {
  display: flex;
  margin-bottom: 20px;
}

.game-tabs, .game-tab {
  cursor: pointer;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.game-tabs .active {
  background-color: #007BFF;
  color: #fff;
}

.game-points {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}

.error-text {
  color: red;
}
.progress-ring__svg {
  transform: rotate(-90deg); /* Rotates the ring to start at the top */
}

.progress-ring__text {
  font-family: 'Arial', sans-serif;
}

.progress-ring__background {
  stroke: var(--GREY-DARKER); /* Background color */
}

.progress-ring__progress {
  stroke: var(--PRIMARY); /* Progress bar color */
  transition: stroke-dashoffset 0.35s; /* Smooth animation */
  transform: rotate(0deg);
  transform-origin: 50% 50%;
}

.fill-primary {
  fill: var(--PRIMARY);
}


.fill-error {
  fill: red;
}

.draft-container {
  display: flex;
  justify-content: space-between;
}

.player-list, .team-list, .other-teams {
  width: 30%;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  margin: 5px 0;
}

li:hover {
  background-color: #f0f0f0;
}
</style>