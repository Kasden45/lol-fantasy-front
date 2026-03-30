<template>
  <div class="tab-navigation">
    <button
      class="tab-btn"
      :class="{ active: activeTab === 'results' }"
      @click="activeTab = 'results'"
    >
      Standings
    </button>
    <button
      v-if="this.currentLeague?.isDrafted == false"
      class="tab-btn"
      :class="{ active: activeTab === 'draft' }"
      @click="activeTab = 'draft'"
    >
      Draft teams
    </button>
    <button
      v-if="this.currentLeague?.isDrafted == true"
      class="tab-btn"
      :class="{ active: activeTab === 'swaps' }"
      @click="activeTab = 'swaps'"
    >
      Swap players
    </button>
  </div>
  <DraftSwapMain
    v-if="activeTab == 'swaps' && selectedUserTeam && realLeagueId"
    :selected-team="selectedUserTeam"
    :other-teams="otherFinishedTeams"
    :draft-participants="draftParticipants"
    :profile-id="$store.getters.getProfileId"
    :next-fixture="nextFixture"
    :league-id="leagueId"
    :real-league-id="realLeagueId"
    :selectedFromUnusedPlayers="selectedFromUnusedPlayers"
    :fixtures="fixtures"
    @refetch-teams="refetchTeams"
    @choose-role="choseRole"
  >
    <PlayersListDraft
      :userTeam="pickedPlayersIdsSwaps"
      :userTeamsPicked="pickedPlayersIdsAllSwaps"
      :nextFixture="nextFixture"
      :teamsPlayingNextFixture="teamsPlayingInNextFixture"
      @rangeChange="() => {}"
      @playerSelect="playerSelectedDraft"
      @playerSelectDraft="playerSelectedDraft"
      @teamSelect="teamSelectedDraft"
      :swapMode="true"
      :selectedRole="roleToAddPlayer"
      @choose-role="choseRole"
      :players="availablePlayers"
      :teams="availableTeams"
      :selectedForSwap="selectedFromUnusedPlayers"
      v-if="availablePlayers.length > 0 && availableTeams.length > 0"
    />
  </DraftSwapMain>
  <!-- Draft and league -->
  <div v-if="activeTab == 'draft'" class="container">
    <button
      class="cta-btn"
      @click="joinDraft"
      v-if="
        !this.draftStarted &&
        !this.draftParticipants
          .map((p) => p.id)
          .includes(this.$store.getters.getProfileId)
      "
    >
      Join Draft
    </button>
    <button
      class="cta-btn"
      @click="startDraft"
      v-if="
        !this.draftStarted &&
        this.draftParticipants
          .map((p) => p.id)
          .includes(this.$store.getters.getProfileId)
      "
    >
      Start Draft
    </button>
    <div>
      <a
        v-if="
          !this.draftStarted &&
          this.draftParticipants
            .map((p) => p.id)
            .includes(this.$store.getters.getProfileId)
        "
        >Players waiting for draft:
        {{ this.draftParticipants.map((p) => p.username) }}</a
      >
    </div>
    <!-- <div v-if="isCurrentDrafter">
        <h3>It's your turn to pick!</h3>
      </div>
      <div v-else>
        <h3>Waiting for other players to pick...</h3>
      </div> -->
    <div class="draft-container justify-content-md-center m-auto row">
      <DraftOrderBar
        :draftTitle="'Fantasy Draft'"
        :totalRounds="7"
        :currentPick="this.draftQueue.findIndex((pick) => !pick.player)"
        :participants="this.draftParticipants.length"
        :draftQueue="this.draftQueue"
        :timeRemaining="60"
        :isYourTurn="this.isCurrentDrafter"
        :isAutoDrafting="false"
      />
      <!-- <div class="team-list col-3">
          <h3>Your Team</h3>
          <h4>Team {{ this.$store.getters.getProfileId }}</h4>
          <ul>
            <li v-for="(position, key) in selectedTeam" :key="key" @click="position.player ? null : choseRole(position.role)">
              {{ position.role }}: {{ position.player ? position.player.summonerName : 'None' }}
            </li>
          </ul>
        </div> -->
      <TeamRoster
        class="players-list-container user-team col-6"
        :selected-team="selectedTeam"
        :profile-id="$store.getters.getProfileId"
        :own-team="true"
        :nextFixture="nextFixture"
        :your-turn="isCurrentDrafter"
        @choose-role="choseRole"
        :selectedRole="roleToAddPlayer"
        @remove-player="handleRemovePlayer"
        :swapMode="false"
      />
      <div class="players-list-container col-6">
        <PlayersListDraft
          :userTeam="pickedPlayersIds"
          :userTeamsPicked="pickedPlayersIdsAll"
          :nextFixture="nextFixture"
          :teamsPlayingNextFixture="teamsPlayingInNextFixture"
          @rangeChange="() => {}"
          @playerSelect="playerSelected"
          @teamSelect="teamSelected"
          :selectedRole="roleToAddPlayer"
          :players="availablePlayers"
          :teams="availableTeams"
          v-if="availablePlayers.length > 0 && availableTeams.length > 0"
        />
        <!-- <PlayersList :userTeam="pickedPlayersIds" :nextFixture="null" :teamsPlayingNextFixture="teamsPlayingInNextFixture" @rangeChange="()=>{}" @playerSelect="playerSelected" :selectedRole='roleToAddPlayer' :players="availablePlayers" v-if="availablePlayers.length > 0"/> -->
      </div>
      <h3>Other Teams</h3>
      <div class="accordion" id="otherTeamsAccordion">
        <div
          class="accordion-item"
          v-for="(team, clientId) in otherTeams"
          :key="clientId"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#collapse${clientId}`"
            >
              Team
              {{
                draftParticipants.find((p) => p.id == clientId)
                  ? `${
                      draftParticipants.find((p) => p.id == clientId).username
                    }`
                  : ""
              }}
            </button>
          </h2>
          <div
            :id="`collapse${clientId}`"
            class="accordion-collapse collapse"
            data-bs-parent="#otherTeamsAccordion"
          >
            <div class="accordion-body">
              <TeamRoster
                class="players-list-container rival-team col-12"
                :selected-team="team"
                :profile-id="clientId"
                :nextFixture="nextFixture"
                :own-team="false"
                :rivalName="
                  draftParticipants.find((p) => p.id == clientId)
                    ? `${
                        draftParticipants.find((p) => p.id == clientId).username
                      }`
                    : 'Unknown'
                "
                :selectedRole="roleToAddPlayer"
                @choose-role=""
                @remove-player=""
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-for="(team, clientId) in otherTeams" :key="clientId">
            <TeamRoster class="players-list-container rival-team col-12"
              :selected-team="team"
              :profile-id="clientId"
              :own-team="false"
              @choose-role=""
              @remove-player=""
            />
          </div> -->
    </div>
    <div>
      <button class="btn btn-success" @click="finishDraft()">
        Finish draft
      </button>
    </div>
  </div>
</template>

<script>
import socket from "@/socket.js";
import DraftOrderBar from "@/components/Draft/DraftOrderBar.vue";
import PlayersList from "@/components/Players/AllPlayersList.vue";
import PlayersListDraft from "@/components/Draft/PlayersListDraft.vue";
import TeamRoster from "@/components/Draft/TeamDisplayDraft.vue";
import DraftSwapMain from "@/components/Draft/DraftSwapMain.vue";
export default {
  props: {
    leagueId: String,
    // realLeagueId: Number,
  },
  components: {
    DraftOrderBar,
    PlayersList,
    PlayersListDraft,
    TeamRoster,
    DraftSwapMain,
  },
  data() {
    return {
      name: "DraftLeagueViewManager",
      activeTab: "results",
      realLeagueId: null,
      showSwap: null,
      currentLeague: null,
      roleToAddPlayer: "",
      availablePlayers: [],
      availableTeams: [
        // Add more teams as needed
      ],
      selectedUserTeam: {
        topPlayer: { role: "top", player: null },
        junglePlayer: { role: "jungle", player: null },
        midPlayer: { role: "mid", player: null },
        bottomPlayer: { role: "bottom", player: null },
        supportPlayer: { role: "support", player: null },
        subPlayer: { role: "sub", player: null },
        team: { role: "team", team: null },
        captain: null,
        transfersMade: 0,
      },
      selectedTeam: {
        topPlayer: { role: "top", player: null },
        junglePlayer: { role: "jungle", player: null },
        midPlayer: {
          role: "mid",
          player: {
            esportsPlayerId: "99871276342168416",
            firstName: "Jihun",
            lastName: "Jung",
            summonerName: "Chovy",
            role: "mid",
            imageUrl:
              "http://static.lolesports.com/players/1686474439543_GEN_Chovy.png",
            nationality: "South Korea",
            price: 100,
            points: 0,
            gamesPlayed: 0,
            matchesPlayed: 0,
            team: {
              esportsTeamId: "100205573495116443",
              slug: "geng",
              name: "Gen.G Esports",
              region: "KOREA",
              league: "LCK",
              code: "GEN",
              imageUrl:
                "http://static.lolesports.com/teams/1655210113163_GenG_logo_200407-05.png",
              backgroundImageUrl:
                "https://lolstatic-a.akamaihd.net/esports-assets/production/team/geng-bnm75bf5.png",
              price: 15,
              gamesPlayed: 0,
              matchesPlayed: 0,
              points: 0,
            },
          },
        },
        bottomPlayer: { role: "bottom", player: null },
        supportPlayer: { role: "support", player: null },
        subPlayer: { role: "sub", player: null },
        team: { role: "team", team: null },
      },
      // selectedPlayers: [],
      draftQueue: [],
      otherFinishedTeams: {},
      otherTeams: {
        // "Sly Marb0": {
        //   topPlayer: {
        //     role: "top",
        //     player: {
        //       esportsPlayerId: "99871276342168416",
        //       firstName: "Jihun",
        //       lastName: "Jung",
        //       summonerName: "Chovy",
        //       role: "mid",
        //       imageUrl:
        //         "http://static.lolesports.com/players/1686474439543_GEN_Chovy.png",
        //       nationality: "South Korea",
        //       price: 100,
        //       points: 0,
        //       gamesPlayed: 0,
        //       matchesPlayed: 0,
        //       team: {
        //         esportsTeamId: "100205573495116443",
        //         slug: "geng",
        //         name: "Gen.G Esports",
        //         region: "KOREA",
        //         league: "LCK",
        //         code: "GEN",
        //         imageUrl:
        //           "http://static.lolesports.com/teams/1655210113163_GenG_logo_200407-05.png",
        //         backgroundImageUrl:
        //           "https://lolstatic-a.akamaihd.net/esports-assets/production/team/geng-bnm75bf5.png",
        //         price: 15,
        //         gamesPlayed: 0,
        //         matchesPlayed: 0,
        //         points: 0,
        //       },
        //     },
        //   },
        //   junglePlayer: { role: "jungle", player: null },
        //   midPlayer: { role: "mid", player: null },
        //   bottomPlayer: { role: "bottom", player: null },
        //   supportPlayer: { role: "support", player: null },
        //   subPlayer: { role: "sub", player: null },
        //   team: { role: "team", team: null },
        // },
        // Hakkene: {
        //   topPlayer: {
        //     role: "top",
        //     player: {
        //       esportsPlayerId: "99871276342168416",
        //       firstName: "Jihun",
        //       lastName: "Jung",
        //       summonerName: "Chovy",
        //       role: "mid",
        //       imageUrl:
        //         "http://static.lolesports.com/players/1686474439543_GEN_Chovy.png",
        //       nationality: "South Korea",
        //       price: 100,
        //       points: 0,
        //       gamesPlayed: 0,
        //       matchesPlayed: 0,
        //       team: {
        //         esportsTeamId: "100205573495116443",
        //         slug: "geng",
        //         name: "Gen.G Esports",
        //         region: "KOREA",
        //         league: "LCK",
        //         code: "GEN",
        //         imageUrl:
        //           "http://static.lolesports.com/teams/1655210113163_GenG_logo_200407-05.png",
        //         backgroundImageUrl:
        //           "https://lolstatic-a.akamaihd.net/esports-assets/production/team/geng-bnm75bf5.png",
        //         price: 15,
        //         gamesPlayed: 0,
        //         matchesPlayed: 0,
        //         points: 0,
        //       },
        //     },
        //   },
        //   junglePlayer: { role: "jungle", player: null },
        //   midPlayer: {
        //     role: "mid",
        //     player: {
        //       esportsPlayerId: "99871276342168416",
        //       firstName: "Jihun",
        //       lastName: "Jung",
        //       summonerName: "Faker",
        //       role: "mid",
        //       imageUrl:
        //         "http://static.lolesports.com/players/1686475867148_T1_Faker.png",
        //       nationality: "South Korea",
        //       price: 100,
        //       points: 0,
        //       gamesPlayed: 0,
        //       matchesPlayed: 0,
        //       team: {
        //         esportsTeamId: "100205573495116443",
        //         slug: "t1",
        //         name: "T1",
        //         region: "KOREA",
        //         league: "LCK",
        //         code: "T1",
        //         imageUrl:
        //           "http://static.lolesports.com/teams/1726801573959_539px-T1_2019_full_allmode.png",
        //         backgroundImageUrl:
        //           "http://static.lolesports.com/teams/1596305556675_T1T1.png",
        //         price: 15,
        //         gamesPlayed: 0,
        //         matchesPlayed: 0,
        //         points: 0,
        //       },
        //     },
        //   },
        //   bottomPlayer: { role: "bottom", player: null },
        //   supportPlayer: { role: "support", player: null },
        //   subPlayer: { role: "sub", player: null },
        //   team: { role: "team", team: null },
        // },
      },
      teamsPlayingInNextFixture: [],
      matchesByFixture: null,
      nextFixture: null,
      currentDrafter: null,
      draftStarted: false,
      draftParticipants: [],
      selectedFromUnusedPlayers: null,
    };
  },
  computed: {
    fixtures() {
      if (this.matchesByFixture == null) return [];
      console.log("matches by fixture to computed", this.matchesByFixture);

      return this.matchesByFixture.map((f) => f.fixture);
    },
    isCurrentDrafter() {
      var userId = this.$store.getters.getProfileId;
      return userId === this.currentDrafter;
    },
    pickedPlayersIds() {
      let pickedPlayers = [];
      for (const role in this.selectedTeam) {
        // eslint-disable-next-line
        if (this.selectedTeam.hasOwnProperty(role)) {
          const player = this.selectedTeam[role].player;
          const team = this.selectedTeam[role].team;
          // eslint-disable-next-line
          if (player != null && player.hasOwnProperty("price")) {
            pickedPlayers.push(player.esportsPlayerId);
          } else if (team != null && team.hasOwnProperty("price")) {
            pickedPlayers.push(team.esportsTeamId);
          }
        }
      }
      // eslint-disable-next-line
      return pickedPlayers;
    },
    pickedPlayersIdsSwaps() {
      let pickedPlayers = [];
      if (this.selectedUserTeam) {
        Object.values(this.selectedUserTeam)
          .filter((u) => u != null && (u.player != null || u.team != null))
          .forEach((u) => {
            if (u.player) {
              pickedPlayers.push(u.player.esportsPlayerId);
            }
            if (u.team) {
              pickedPlayers.push(u.team.esportsTeamId);
            }
          });
      }
      // eslint-disable-next-line
      return pickedPlayers;
    },
    pickedPlayersIdsAllSwaps() {
      let pickedPlayers = {}; // Object dictionary playerId : ownedBy {id, name}
      Object.values(this.otherFinishedTeams).forEach((userTeam) => {
        if (userTeam.team) {
          Object.values(userTeam.team)
            .filter((u) => u != null && (u.player != null || u.team != null))
            .forEach((u) => {
              if (u.player) {
                pickedPlayers[u.player.esportsPlayerId] = userTeam.user;
              }
              if (u.team) {
                pickedPlayers[u.team.esportsTeamId] = userTeam.user;
              }
            });
        }
      });

      return pickedPlayers;
    },
    pickedPlayersIdsAll() {
      let pickedPlayers = {}; // Object dictionary playerId : ownedBy {id, name}
      this.draftQueue.forEach((pick) => {
        if (pick.player && pick.player.esportsPlayerId) {
          pickedPlayers[pick.player.esportsPlayerId] = pick.user;
        }
        if (pick.player && pick.player.esportsTeamId) {
          pickedPlayers[pick.player.esportsTeamId] = pick.user;
        }
      });
      return pickedPlayers;
    },
  },
  mounted() {
    var leagueId = this.leagueId;
    // socket.emit('startDraft', leagueId)
    socket.emit("getCurrentState", {
      message: "get players",
      invitationCode: this.leagueId,
    });
  },
  async created() {
    await this.fetchPlayers();
    await this.fetchTeams();
    await this.getFixtures();
    await this.getLeagueDetails(this.leagueId);
    await this.fetchUserTeam();
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    var leagueId = this.leagueId;
    // socket.emit('startDraft', leagueId)
    socket.emit("getCurrentState", {
      message: "get players",
      invitationCode: this.leagueId,
    });

    socket.on(
      "currentState",
      ({
        pickedPlayers,
        draftParticipants,
        currentDrafter,
        draftQueue,
        draftStarted,
      }) => {
        this.otherTeams = { ...pickedPlayers };
        this.draftParticipants = draftParticipants;
        this.draftQueue = draftQueue;
        this.draftStarted = draftStarted;
        console.log(
          "got current state",
          pickedPlayers,
          draftParticipants,
          currentDrafter,
          draftQueue,
        );
        console.log("profile id", this.$store.getters.getProfileId);
        this.selectedTeam = !this.otherTeams[this.$store.getters.getProfileId]
          ? {
              topPlayer: { role: "top", player: null },
              junglePlayer: { role: "jungle", player: null },
              midPlayer: { role: "mid", player: null },
              bottomPlayer: { role: "bottom", player: null },
              supportPlayer: { role: "support", player: null },
              subPlayer: { role: "sub", player: null },
              team: { role: "team", team: null },
            }
          : this.otherTeams[this.$store.getters.getProfileId];
        this.currentDrafter = currentDrafter;
        // Remove already picked players from availablePlayers
        // Object.values(pickedPlayers).forEach(team => {
        //     team.forEach(player => {
        //     this.availablePlayers = this.availablePlayers.filter(p => p.id !== player.id);
        //     });
        // });
        Object.values(pickedPlayers)
          .flatMap((team) => Object.values(team))
          .forEach((position) => {
            if (position.player) {
              // this.availablePlayers = this.availablePlayers.filter(p => p.esportsPlayerId !== position.player.esportsPlayerId);
            }
            if (position.team) {
              // this.availableTeams = this.availableTeams.filter(t => t.esportsTeamId !== position.team.esportsTeamId);
            }
          });
        delete this.otherTeams[this.$store.getters.getProfileId];
      },
    );

    var userId = this.$store.getters.getProfileId;
    socket.on("playerSelected", ({ clientId, player }) => {
      if (clientId !== userId) {
        if (!this.otherTeams[clientId]) {
          this.otherTeams[clientId] = {
            topPlayer: { role: "top", player: null },
            junglePlayer: { role: "jungle", player: null },
            midPlayer: { role: "mid", player: null },
            bottomPlayer: { role: "bottom", player: null },
            supportPlayer: { role: "support", player: null },
            subPlayer: { role: "sub", player: null },
            team: { role: "team", team: null },
          };
        }
        const roleKey = `${player.role}Player`;
        if (this.otherTeams[clientId][roleKey]) {
          this.otherTeams[clientId][roleKey].player = player;
        }
        // this.availablePlayers = this.availablePlayers.filter(p => p.esportsPlayerId !== player.esportsPlayerId);
      }
    });

    socket.on("teamSelected", ({ clientId, team }) => {
      if (clientId !== userId) {
        if (!this.otherTeams[clientId]) {
          this.otherTeams[clientId] = {
            topPlayer: { role: "top", player: null },
            junglePlayer: { role: "jungle", player: null },
            midPlayer: { role: "mid", player: null },
            bottomPlayer: { role: "bottom", player: null },
            supportPlayer: { role: "support", player: null },
            subPlayer: { role: "sub", player: null },
            team: { role: "team", team: null },
          };
        }
        const roleKey = `team`;
        if (this.otherTeams[clientId][roleKey]) {
          this.otherTeams[clientId][roleKey].team = team;
        }
        // this.availableTeams = this.availableTeams.filter(t => t.slug !== team.slug);
      }
    });

    socket.on("currentDrafter", (currentDrafter) => {
      this.currentDrafter = currentDrafter;
    });

    socket.on("draftFinished", (draft) => {
      this.refetchTeams();
      this.activeTab = "swaps";
    });

    socket.on("draftOrderUpdated", ({ draftParticipants, currentDrafter }) => {
      this.draftParticipants = draftParticipants;
      this.currentDrafter = currentDrafter;
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on(
      "finishedDraft",
      ({ pickedPlayers, draftParticipants, currentDrafter }) => {
        console.log("Finishing the draft");
        for (const [key, value] of Object.entries(pickedPlayers)) {
          console.log(key, value);
          this.axios.post(
            `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/user_team`,
            {
              OwnerId: parseInt(key), // Set the user's ID
              TopPlayerId:
                pickedPlayers[key]["topPlayer"].player.esportsPlayerId,
              JunglePlayerId:
                pickedPlayers[key]["junglePlayer"].player.esportsPlayerId,
              MidPlayerId:
                pickedPlayers[key]["midPlayer"].player.esportsPlayerId,
              BottomPlayerId:
                pickedPlayers[key]["bottomPlayer"].player.esportsPlayerId,
              SupportPlayerId:
                pickedPlayers[key]["supportPlayer"].player.esportsPlayerId,
              SubPlayerId:
                pickedPlayers[key]["subPlayer"].player.esportsPlayerId,
              TeamSlug: pickedPlayers[key]["team"].team.slug,
              LeagueId: this.realLeagueId,
              Captain: 3,
            },
          );
        }

        this.axios
          .post(
            `${this.apiURL}Draft/league/${this.leagueId}/finishDraft/${this.$store.getters.getProfileId}`,
          )
          .then((response) => {
            this.currentLeague = response.data;
            this.fillLeagueDetails(this.currentLeague);
          })
          .catch((error) => {
            console.log(error.response);
          });
        console.log("Finishing the draft - end");
        // Create all teams
      },
    );
  },
  methods: {
    async refetchTeams() {
      await this.getLeagueDetails(this.leagueId);
      await this.fetchUserTeam();
    },
    async fetchUserTeam() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/user_team/${this.$store.getters.getProfileId}/${this.realLeagueId}`,
        );
        var userTeam = response.data;
        this.selectedUserTeam.topPlayer.player = this.availablePlayers.find(
          (element) =>
            element.esportsPlayerId == userTeam.topPlayer.esportsPlayerId,
        );
        this.selectedUserTeam.junglePlayer.player = this.availablePlayers.find(
          (element) =>
            element.esportsPlayerId == userTeam.junglePlayer.esportsPlayerId,
        );
        this.selectedUserTeam.midPlayer.player = this.availablePlayers.find(
          (element) =>
            element.esportsPlayerId == userTeam.midPlayer.esportsPlayerId,
        );
        this.selectedUserTeam.bottomPlayer.player = this.availablePlayers.find(
          (element) =>
            element.esportsPlayerId == userTeam.bottomPlayer.esportsPlayerId,
        );
        this.selectedUserTeam.supportPlayer.player = this.availablePlayers.find(
          (element) =>
            element.esportsPlayerId == userTeam.supportPlayer.esportsPlayerId,
        );
        this.selectedUserTeam.subPlayer.player = this.availablePlayers.find(
          (element) =>
            element.esportsPlayerId == userTeam.subPlayer.esportsPlayerId,
        );
        this.selectedUserTeam.team.team = this.availableTeams.find(
          (element) => element.esportsTeamId == userTeam.team.esportsTeamId,
        );
        this.selectedUserTeam.captain = userTeam.captain;
        this.selectedUserTeam.transfersMade = userTeam.transfersMade;
        this.selectedUserTeam.transfersAvailable = userTeam.transfersAvailable;
        this.selectedUserTeam.chipActivated = userTeam.chipUsed ?? 0;
        this.selectedUserTeam.userTeamId = userTeam.userTeamId ?? null;
        // this.selectedUserTeam.chipUsed = userTeam.chipUsed
        this.selectedUserTeam.chips = userTeam.extraChips;

        this.loadedPlayers = [
          userTeam.topPlayer.esportsPlayerId,
          userTeam.junglePlayer.esportsPlayerId,
          userTeam.midPlayer.esportsPlayerId,
          userTeam.bottomPlayer.esportsPlayerId,
          userTeam.supportPlayer.esportsPlayerId,
          userTeam.subPlayer.esportsPlayerId,
          userTeam.team.esportsTeamId,
        ];

        console.log("loaded players", this.loadedPlayers);
        this.showSwap = true;
        // this.sortedPlayers = this.players;
      } catch (error) {
        this.showSwap = false;
        console.error("Error fetching player team:", error);
      }
    },
    finishDraft() {
      console.log(this.leagueId);
      return;
      socket.emit("finishDraft", this.leagueId);
    },
    choseRole(role) {
      console.log(role);
      this.roleToAddPlayer = role;
    },
    async getFixtures() {
      const url = `${this.apiURL}Matches/${this.$store.getters.getCurrentTournamentId}/fixtures`;
      // const url = `${this.apiURL}Matches/${113475452383887518}/fixtures`; // hardcoded tournament id for testing

      this.axios
        .get(url)
        .then((response) => {
          this.matchesByFixture =
            // [
            //   {
            //     fixture: {
            //       fixtureId: 26,
            //       order: 1,
            //       name: "Round 1",
            //       isFinished: false,
            //       opensAtDate: "2026-03-05T15:00:00Z",
            //       deadlineDate: "2026-03-10T04:40:00Z",
            //       transfersLimit: 100,
            //       teamValueLimit: 72,
            //     },
            //     matches: [
            //       {
            //         id: "113475798006599034",
            //         state: null,
            //         startTime: "2026-03-10T05:00:00Z",
            //         maxGames: 1,
            //         team1: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1767340467921_DN_SOOPerslogo_profile.webp",
            //           name: "DN FREECS",
            //           code: "DNS",
            //         },
            //         team2: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1726801573959_539px-T1_2019_full_allmode.png",
            //           name: "T1",
            //           code: "T1",
            //         },
            //       },
            //       {
            //         id: "113475798006664572",
            //         state: null,
            //         startTime: "2026-03-10T06:00:00Z",
            //         maxGames: 1,
            //         team1: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1655210113163_GenG_logo_200407-05.png",
            //           name: "Gen.G Esports",
            //           code: "GEN",
            //         },
            //         team2: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1631819564399_hle-2021-worlds.png",
            //           name: "Hanwha Life Esports",
            //           code: "HLE",
            //         },
            //       },
            //       {
            //         id: "113475798006730110",
            //         state: null,
            //         startTime: "2026-03-10T07:00:00Z",
            //         maxGames: 1,
            //         team1: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1672910733664_01.Basic_W.png",
            //           name: "DRX",
            //           code: "DRX",
            //         },
            //         team2: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/NSFullonDark.png",
            //           name: "NONGSHIM RED FORCE",
            //           code: "NS",
            //         },
            //       },
            //       {
            //         id: "113475798006795648",
            //         state: null,
            //         startTime: "2026-03-10T08:00:00Z",
            //         maxGames: 1,
            //         team1: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/kt_darkbackground.png",
            //           name: "kt Rolster",
            //           code: "KT",
            //         },
            //         team2: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1673260049703_DPlusKIALOGO11.png",
            //           name: "Dplus KIA",
            //           code: "DK",
            //         },
            //       },
            //       {
            //         id: "113475798006861186",
            //         state: null,
            //         startTime: "2026-03-10T09:00:00Z",
            //         maxGames: 1,
            //         team1: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1716454325887_Nowyprojekt.png",
            //           name: "OKSavingsBank BRION",
            //           code: "BRO",
            //         },
            //         team2: {
            //           wins: 0,
            //           imageUrl:
            //             "http://static.lolesports.com/teams/1734691810721_BFXfullcolorfordarkbg.png",
            //           name: "BNK FEARX",
            //           code: "BFX",
            //         },
            //       },
            //     ],
            //   },
            // ];
            response.data.fixturesWithMatches;
          this.nextFixture = this.matchesByFixture
            .filter((m) => new Date(m.fixture.deadlineDate) > new Date())
            .sort(function (a, b) {
              return (
                new Date(a.fixture.deadlineDate) -
                new Date(b.fixture.deadlineDate)
              );
            })[0];

          if (this.nextFixture != null) {
            console.log("pre teams", this.teamsPlayingInNextFixture);
            this.teamsPlayingInNextFixture = this.nextFixture.matches
              .filter((m) => m.team1 != null && m.team2 != null)
              .map((m) => m.team1)
              .concat(
                this.nextFixture.matches
                  .filter((m) => m.team1 != null && m.team2 != null)
                  .map((m) => m.team2),
              )
              .map((m) => m.code);
            console.log(
              "teams playing in next fixture",
              this.teamsPlayingInNextFixture,
            );
          }

          this.lastPlayedFixture = this.matchesByFixture
            .filter((m) => new Date(m.fixture.deadlineDate) <= new Date())
            .sort(function (a, b) {
              return (
                new Date(b.fixture.deadlineDate) -
                new Date(a.fixture.deadlineDate)
              );
            })[0];
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    async fetchPlayers() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/players`,
        );
        this.availablePlayers = response.data;
        // this.sortedPlayers = this.players;
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    },
    async fetchTeams() {
      try {
        const response = await this.axios.get(
          `${this.apiURL}FantasyPoints/${this.$store.getters.getCurrentTournamentId}/teams`,
        );
        this.availableTeams = response.data;
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    },
    joinDraft() {
      var userId = this.$store.getters.getProfileId;
      var login = this.$store.getters.getLogin;
      socket.emit("joinDraft", {
        userId: userId,
        login: login,
        invitationCode: this.leagueId,
      });
    },
    startDraft() {
      socket.emit(
        "startDraft",
        this.leagueId,
        this.realLeagueId,
        this.$store.getters.getCurrentTournamentId,
      );
    },
    selectPlayer(player) {
      // if (!this.isCurrentDrafter) {
      //     console.log('It is not your turn to pick');
      //     return;
      // }
      var userId = this.$store.getters.getProfileId;
      // const roleKey = `${this.roleToAddPlayer}Player`;
      // if (this.selectedTeam[roleKey]) {
      //     this.selectedTeam[roleKey].player = player;
      // }

      // this.availablePlayers = this.availablePlayers.filter(p => p.esportsPlayerId !== player.esportsPlayerId);
      socket.emit("playerSelected", {
        clientId: userId,
        player: player,
        invitationCode: this.leagueId,
        role: this.roleToAddPlayer,
      });
    },
    selectTeam(team) {
      var userId = this.$store.getters.getProfileId;

      // this.availablePlayers = this.availablePlayers.filter(p => p.esportsPlayerId !== player.esportsPlayerId);
      socket.emit("teamSelected", {
        clientId: userId,
        team: team,
        invitationCode: this.leagueId,
        role: this.roleToAddPlayer,
      });
    },
    playerSelected(player) {
      console.log(
        "trying to add ",
        player.summonerName,
        " to ",
        this.roleToAddPlayer,
      );

      if (
        player.role == this.roleToAddPlayer ||
        this.roleToAddPlayer == "sub"
      ) {
        // this.addToRole(player, this.roleToAddPlayer);
        this.selectPlayer(player);
        this.roleToAddPlayer = ""; // Reset the selected role after adding the player
      } else console.log("WRONG ROLE");
    },
    playerSelectedDraft(player) {
      console.log(
        "trying to add ",
        player.summonerName,
        " to ",
        this.roleToAddPlayer,
      );

      if (
        player.role == this.roleToAddPlayer ||
        this.roleToAddPlayer == "sub"
      ) {
        // this.addToRole(player, this.roleToAddPlayer);
        this.selectedFromUnusedPlayers = player;
        // this.roleToAddPlayer = "";
      } else console.log("WRONG ROLE");
    },
    teamSelected(team) {
      console.log(
        "trying to add team ",
        team.name,
        " to ",
        this.roleToAddPlayer,
      );

      if (this.roleToAddPlayer == "team") {
        // this.addToRole(player, this.roleToAddPlayer);
        this.selectTeam(team);
        this.roleToAddPlayer = ""; // Reset the selected role after adding the player
      } else console.log("WRONG ROLE");
    },
    teamSelectedDraft(team) {
      console.log(
        "trying to add team ",
        team.name,
        " to ",
        this.roleToAddPlayer,
      );

      if (this.roleToAddPlayer == "team") {
        // this.addToRole(player, this.roleToAddPlayer);
        this.selectedFromUnusedPlayers = team;
      } else console.log("WRONG ROLE");
    },
    addToRole(player, role) {
      var teamPlayer = this.selectPlayerByRole(role);
      if (teamPlayer != null) {
        console.log("mamy to, dodaje", player, "do", teamPlayer);
        this.selectedUserTeam[teamPlayer].player = player;
        this.roleToAddPlayer = "";
      }
    },
    selectPlayerByRole(role) {
      console.log("rola", role);
      for (const key in this.selectedUserTeam) {
        if (
          this.selectedUserTeam[key].role === role &&
          this.selectedUserTeam[key].player === null
        ) {
          console.log("taki player", this.selectedUserTeam[key].player);
          return key;
        }
      }
      console.log("nope");
      return null; // Return null if no player with the specified role is found
    },
    fillLeagueDetails(league) {
      console.log("get league details", this.currentLeague);
      this.otherFinishedTeams = this.currentLeague.participants
        .filter((p) => p.userId != this.$store.getters.getProfileId)
        .reduce((acc, participant) => {
          if (participant.userTeam) {
            acc[participant.userId] = {};
            acc[participant.userId].team = participant.userTeam;
            acc[participant.userId].user = {
              id: participant.userId,
              username: participant.userLogin,
            };
          }
          return acc;
        }, {});
    },
    async getLeagueDetails(invitationCode) {
      try {
        const response = await this.axios.get(
          `${this.apiURL}Draft/${this.$store.getters.getCurrentTournamentId}/league/${invitationCode}`,
        );
        this.currentLeague = response.data;
        this.realLeagueId = this.currentLeague.participants[0].fantasyLeagueId;
        console.log("Real League Id", this.realLeagueId);
        this.fillLeagueDetails(this.currentLeague);
        console.log("other finished teams", this.otherFinishedTeams);
      } catch (error) {
        console.error("Error fetching league details:", error);
      }
    },
  },
  beforeDestroy() {
    if (socket) {
      socket.disconnect();
    }
  },
};
</script>

<style scoped>
.draft-container {
  width: 85vw;
  display: flex;
  justify-content: space-between;
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

.players-list-container {
  height: 80vh;
  border-radius: 5px;
  /* overflow-y: scroll; */
  /* overflow-x: scroll; */
  padding-left: 0%;
  padding-right: 0%;
  border: 1px solid #ddd;
}

.players-list-container.user-team {
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 0%;
  padding-right: 1rem;
  border: 1px solid #ddd;
}

.players-list-container.rival-team {
  height: 40vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 0%;
  padding-right: 1rem;
  border: none;
}

.cta-btn {
  margin-top: 1rem;
  margin-bottom: 1rem;
  /* width: 0.7vw; */
  padding: 0.75rem 2rem;
  background: var(--LIGHT-BLUE);
  color: #000;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  text-decoration: none;
}

.cta-btn:hover {
  background: #00aacc;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
  justify-content: center;
}

.tab-btn {
  background: none;
  color: #94a3b8;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;
  bottom: -1px;
}

.tab-btn:hover {
  color: var(--PRIMARY);
}

.tab-btn.active {
  color: var(--PRIMARY-DARKER, #00d9ff);
  border-radius: 10%;
  border-color: var(--PRIMARY-DARKER, #00d9ff);
}
</style>
