/**
 * @module draft-logic
 * @description Client-side draft business logic for Fantasy LoL
 * Handles snake draft order, turn validation, pick management, and API calls
 * Migrated from server-side Socket.io implementation
 * @version 2.0.0
 */

import axios from "axios";

// ============================================================================
// CONSTANTS
// ============================================================================

/** Number of roster slots per team (5 players + 1 sub + 1 team) */
const TEAM_SIZE = 7;

/** Empty team template for initialization */
const EMPTY_TEAM_TEMPLATE = {
  topPlayer: { role: "top", player: null },
  junglePlayer: { role: "jungle", player: null },
  midPlayer: { role: "mid", player: null },
  bottomPlayer: { role: "bottom", player: null },
  supportPlayer: { role: "support", player: null },
  subPlayer: { role: "sub", player: null },
  team: { role: "team", team: null },
};

// ============================================================================
// DRAFT QUEUE GENERATION (Snake Draft Algorithm)
// ============================================================================

/**
 * Generate snake (serpentine) draft order
 * Alternates direction each round to ensure fairness
 *
 * @param {Array<{id: number|string, username: string}>} participants - Draft participants
 * @param {number} totalPicks - Total picks needed (participants.length * TEAM_SIZE)
 * @returns {Array<{user: object, player: object|null}>} Ordered draft queue
 *
 * @example
 * const participants = [
 *   { id: 1, username: 'Alice' },
 *   { id: 2, username: 'Bob' },
 * ];
 * const queue = createDraftQueue(participants, 14); // 7 slots × 2 players
 * // Result: [Alice, Bob, Bob, Alice, Alice, Bob, ...]
 */
export function createDraftQueue(participants, totalPicks) {
  if (!participants || participants.length === 0) {
    console.error("[DraftLogic] No participants provided");
    return [];
  }

  const draftQueue = [];
  const rounds = Math.ceil(totalPicks / participants.length);

  // Shuffle participants for random starting order (only shuffle once!)
  const shuffledParticipants = [...participants].sort(
    () => Math.random() - 0.5,
  );

  console.log("[DraftLogic] Creating snake draft queue:");
  console.log(
    "  Participants:",
    shuffledParticipants.map((p) => p.username),
  );
  console.log("  Total rounds:", rounds);
  console.log("  Total picks:", totalPicks);

  for (let round = 0; round < rounds; round++) {
    if (round % 2 === 0) {
      // Even rounds: forward order (first → last)
      for (let i = 0; i < shuffledParticipants.length; i++) {
        draftQueue.push({ user: shuffledParticipants[i], player: null });
      }
    } else {
      // Odd rounds: reverse order (last → first) - "snake" effect
      for (let i = shuffledParticipants.length - 1; i >= 0; i--) {
        draftQueue.push({ user: shuffledParticipants[i], player: null });
      }
    }
  }

  console.log("[DraftLogic] Queue created with", draftQueue.length, "picks");
  return draftQueue;
}

// ============================================================================
// TURN VALIDATION
// ============================================================================

/**
 * Validate if it's a specific user's turn to pick
 *
 * @param {number|string} userId - User attempting to pick
 * @param {Array} draftQueue - Current draft queue
 * @param {number} currentPickIndex - Current position in queue
 * @returns {{valid: boolean, reason?: string}}
 *
 * @example
 * const result = validateTurn(123, draftQueue, 5);
 * if (!result.valid) {
 *   alert(result.reason); // "It's not your turn!"
 * }
 */
export function validateTurn(userId, draftQueue, currentPickIndex) {
  // Check bounds
  if (!draftQueue || currentPickIndex >= draftQueue.length) {
    return { valid: false, reason: "Draft is complete or invalid state" };
  }

  const expectedPicker = draftQueue[currentPickIndex]?.user?.id;

  if (!expectedPicker) {
    return { valid: false, reason: "Cannot determine current drafter" };
  }

  // Validate turn
  if (userId !== expectedPicker) {
    const expectedUsername =
      draftQueue[currentPickIndex]?.user?.username || "Unknown";
    return {
      valid: false,
      reason: `It's ${expectedUsername}'s turn to pick!`,
    };
  }

  return { valid: true };
}

// ============================================================================
// PLAYER SELECTION MANAGEMENT
// ============================================================================

/**
 * Process a player selection during draft
 * Updates local state and returns updated objects
 *
 * @param {object} params
 * @param {number|string} params.clientId - Selecting user's ID
 * @param {object} params.player - Selected player object
 * @param {string} params.role - Position being filled ('top', 'jungle', etc.)
 * @param {object} params.pickedPlayers - All players picked so far {userId: teamObject}
 * @param {Array} params.draftQueue - Current draft queue
 * @param {number} params.currentPick - Current pick index
 * @returns {{updatedPickedPlayers: object, updatedQueue: Array, newCurrentPick: number, isComplete: boolean}}
 */
export function processPlayerSelection({
  clientId,
  player,
  role,
  pickedPlayers,
  draftQueue,
  currentPick,
}) {
  // Initialize user's team if not exists
  if (!pickedPlayers[clientId]) {
    pickedPlayers[clientId] = JSON.parse(JSON.stringify(EMPTY_TEAM_TEMPLATE));
  }

  // Map role to team key
  const roleKey = `${role}Player`;

  // Validate role key exists
  if (!pickedPlayers[clientId][roleKey]) {
    console.error(`[DraftLogic] Invalid role key: ${roleKey}`);
    return null;
  }

  // Assign player to position
  pickedPlayers[clientId][roleKey].player = player;

  // Also mark in queue who was picked
  if (draftQueue[currentPick]) {
    draftQueue[currentPick].player = player;
  }

  // Advance to next pick
  const newCurrentPick = currentPick + 1;
  const isComplete = newCurrentPick >= draftQueue.length;

  console.log(
    `[DraftLogic] Player selected: ${player.summonerName} (${role}) by user ${clientId}`,
  );
  console.log(
    `[DraftLogic] Pick ${newCurrentPick}/${draftQueue.length}, Complete: ${isComplete}`,
  );

  return {
    updatedPickedPlayers: pickedPlayers,
    updatedQueue: draftQueue,
    newCurrentPick,
    isComplete,
  };
}

/**
 * Process a team selection during draft
 * Same as processPlayerSelection but for esports teams
 *
 * @param {object} params
 * @param {number|string} params.clientId - Selecting user's ID
 * @param {object} params.team - Selected team object
 * @param {object} params.pickedPlayers - All players picked so far
 * @param {Array} params.draftQueue - Current draft queue
 * @param {number} params.currentPick - Current pick index
 * @returns {object} Updated state object or null if error
 */
export function processTeamSelection({
  clientId,
  team,
  pickedPlayers,
  draftQueue,
  currentPick,
}) {
  // Initialize user's team if not exists
  if (!pickedPlayers[clientId]) {
    pickedPlayers[clientId] = JSON.parse(JSON.stringify(EMPTY_TEAM_TEMPLATE));
  }

  // Team goes into 'team' slot (not 'teamPlayer')
  const roleKey = "team";

  if (!pickedPlayers[clientId][roleKey]) {
    console.error("[DraftLogic] Invalid team slot");
    return null;
  }

  // Assign team
  pickedPlayers[clientId][roleKey].team = team;

  // Mark in queue
  if (draftQueue[currentPick]) {
    draftQueue[currentPick].player = team;
  }

  // Advance pick
  const newCurrentPick = currentPick + 1;
  const isComplete = newCurrentPick >= draftQueue.length;

  console.log(`[DraftLogic] Team selected: ${team.name} by user ${clientId}`);
  console.log(
    `[DraftLogic] Pick ${newCurrentPick}/${draftQueue.length}, Complete: ${isComplete}`,
  );

  return {
    updatedPickedPlayers: pickedPlayers,
    updatedQueue: draftQueue,
    newCurrentPick,
    isComplete,
  };
}

// ============================================================================
// DRAFT COMPLETION & API INTEGRATION
// ============================================================================

/**
 * Validate that all teams are complete before finishing
 * Checks every participant has filled all roster slots
 *
 * @param {object} pickedPlayers - {userId: teamObject}
 * @returns {{valid: boolean, incompleteUsers: Array}}
 */
export function validateDraftCompletion(pickedPlayers) {
  const incompleteUsers = [];

  for (const [userId, team] of Object.entries(pickedPlayers)) {
    for (const [slotKey, slotValue] of Object.entries(team)) {
      const isEmpty =
        (slotKey.endsWith("Player") && !slotValue.player) ||
        (slotKey === "team" && !slotValue.team);

      if (isEmpty) {
        incompleteUsers.push({
          userId,
          missingSlot: slotKey,
        });
        break; // Only report one missing slot per user
      }
    }
  }

  return {
    valid: incompleteUsers.length === 0,
    incompleteUsers,
  };
}

/**
 * Save completed draft to backend API
 * Makes HTTP calls to persist all user teams
 *
 * @async
 * @param {object} draft - Complete draft object
 * @param {string} apiURL - Base URL for API
 * @returns {Promise<{success: boolean, errors: Array}>}
 *
 * @example
 * const result = await saveDraftToAPI(draft, 'https://api.lolfantasy.pl');
 * if (result.success) {
 *   console.log('Draft saved! Redirecting to swaps...');
 * }
 */
export async function saveDraftToAPI(draft, apiURL) {
  const errors = [];

  console.log("[DraftLogic] Saving draft to API...");
  console.log("  Tournament:", draft.tournamentId);
  console.log("  League:", draft.leagueId);
  console.log("  Participants:", Object.keys(draft.pickedPlayers).length);

  // Validate first
  const validation = validateDraftCompletion(draft.pickedPlayers);
  if (!validation.valid) {
    console.error(
      "[DraftLogic] Cannot save - incomplete teams:",
      validation.incompleteUsers,
    );
    return {
      success: false,
      errors: [
        `Incomplete teams: ${validation.incompleteUsers
          .map((u) => u.userId)
          .join(", ")}`,
      ],
    };
  }

  // Save each user's team
  for (const [userId, team] of Object.entries(draft.pickedPlayers)) {
    try {
      const payload = {
        OwnerId: parseInt(userId),
        TopPlayerId: team.topPlayer?.player?.esportsPlayerId,
        JunglePlayerId: team.junglePlayer?.player?.esportsPlayerId,
        MidPlayerId: team.midPlayer?.player?.esportsPlayerId,
        BottomPlayerId: team.bottomPlayer?.player?.esportsPlayerId,
        SupportPlayerId: team.supportPlayer?.player?.esportsPlayerId,
        SubPlayerId: team.subPlayer?.player?.esportsPlayerId,
        TeamSlug: team.team?.team?.slug,
        LeagueId: draft.leagueId,
        Captain: 3, // Default captain (could be configurable later)
      };

      console.log(`[DraftLogic] Saving team for user ${userId}:`, payload);

      const response = await axios.post(
        `${apiURL}FantasyPoints/${draft.tournamentId}/user_team`,
        payload,
      );

      console.log(`[DraftLogic] ✓ User ${userId} team saved`);
    } catch (error) {
      console.error(
        `[DraftLogic] ✗ Failed to save user ${userId}:`,
        error.response || error,
      );
      errors.push(`User ${userId}: ${error.message}`);
    }
  }

  // Mark draft as finished in backend
  if (errors.length === 0 && draft.draftParticipants?.length > 0) {
    try {
      const firstParticipantId = draft.draftParticipants[0].id;

      await axios.post(
        `${apiURL}Draft/${draft.tournamentId}/league/${draft.invitationCode}/finishDraft/${firstParticipantId}`,
      );

      console.log("[DraftLogic] ✓ Draft marked as finished");
    } catch (error) {
      console.error(
        "[DraftLogic] ✗ Failed to finish draft:",
        error.response || error,
      );
      errors.push(`Finish draft: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================

/**
 * Get empty team template (for initializing new user's roster)
 * @returns {object} Deep-copied empty team template
 */
export function getEmptyTeam() {
  return JSON.parse(JSON.stringify(EMPTY_TEAM_TEMPLATE));
}

/**
 * Get current drafter from queue
 *
 * @param {Array} draftQueue
 * @param {number} currentPick
 * @returns {object|null} {userId, username} or null if draft complete
 */
export function getCurrentDrafter(draftQueue, currentPick) {
  if (!draftQueue || currentPick >= draftQueue.length) {
    return null; // Draft complete
  }

  const currentSlot = draftQueue[currentPick];
  return currentSlot?.user || null;
}

/**
 * Calculate draft progress percentage
 *
 * @param {number} currentPick
 * @param {number} totalPicks
 * @returns {number} 0-100
 */
export function getDraftProgress(currentPick, totalPicks) {
  if (!totalPicks) return 0;
  return Math.min(100, Math.round((currentPick / totalPicks) * 100));
}

/**
 * Deep clone draft state (for immutability in Vue reactivity)
 *
 * @param {object} state
 * @returns {object}
 */
export function cloneDraftState(state) {
  return JSON.parse(JSON.stringify(state));
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Queue generation
  createDraftQueue,

  // Turn management
  validateTurn,
  getCurrentDrafter,
  getDraftProgress,

  // Selection processing
  processPlayerSelection,
  processTeamSelection,

  // Completion
  validateDraftCompletion,
  saveDraftToAPI,

  // Utilities
  getEmptyTeam,
  cloneDraftState,
};
