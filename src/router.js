import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import TeamSelection from "./views/TeamSelection.vue";
import TeamSelectionV2 from "./views/TeamSelection-v2.vue";
import PlayersView from "./views/PlayersView.vue"; // Import your component
import LeaguesView from "./views/LeaguesView.vue"; // Import your component
import GamePointsView from "./views/GamePointsView.vue"; // Import your component
import CurrentPointsView from "./views/CurrentPointsView.vue"; // Import your component
import SingleLeagueView from "./views/SingleLeagueView.vue"; // Import your component
import MatchesView from "./views/MatchesView.vue"; // Import your component
import MatchDetailsView from "./views/MatchDetailsView.vue";
import SettingsView from "./views/SettingsView.vue"; // Import your component
import StatsView from "./views/StatsView.vue"; // Import your component
import DraftView from "./components/League/DraftView.vue"; // Import your component

const routes = [
  { name: "Home", path: "/", component: HomeView },
  { name: "TeamSelection", path: "/team-selection", component: TeamSelection },
  { name: "TeamSelectionV2", path: "/team-selection-v2", component: TeamSelectionV2 },
  { name: "PlayersView", path: "/players", component: PlayersView },
  { name: "LeaguesView", path: "/leagues", component: LeaguesView },
  { name: "MatchesView", path: "/matches", component: MatchesView },
  { name: "SettingsView", path: "/settings", component: SettingsView },
  { name: "StatsView", path: "/stats", component: StatsView },
  { name: "SingleLeagueView", path: "/leagues/:leagueCode", component: SingleLeagueView },
  { name: "DraftView", path: "/draft", component: DraftView },
  { name: "CurrentPointsView", path: "/current-points/:userId", component: CurrentPointsView },
  { name: "MatchDetailsView", path: "/match-details/:matchId", component: MatchDetailsView },
  { name: "GamePointsView", path: "/points/team/:teamSlug/game/:gameId", component: GamePointsView },
  // Define more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;