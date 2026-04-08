/**
 * @module socket
 * @description Ably Real-time integration for Fantasy LoL Draft system
 * Replaces Socket.io with enterprise-grade pub/sub messaging
 * Compatible with Vue CLI Babel configuration
 * @version 2.0.1 - Babel Fix
 */

import * as Ably from "ably";

// ============================================================================
// EVENT NAME CONSTANTS
// ============================================================================

export const DRAFT_EVENTS = {
  CONNECTION_STATUS: "connection-status",
  JOIN_DRAFT: "join-draft",
  LEAVE_DRAFT: "leave-draft",
  START_DRAFT: "start-draft",
  FINISH_DRAFT: "finish-draft",
  DRAFT_FINISHED: "draft-finished",
  CURRENT_STATE: "current-state",
  REQUEST_STATE: "request-state",
  DRAFT_ORDER_UPDATED: "draft-order-updated",
  PLAYER_SELECTED: "player-selected",
  TEAM_SELECTED: "team-selected",
  CURRENT_DRAFTER: "current-drafter",
  SWAP_PROPOSED: "swap-proposed",
  MESSAGE: "message",
};

// ============================================================================
// PRIVATE STATE (Module-level)
// ============================================================================

var ablyInstance = null;
var activeChannel = null;
var currentInvitationCode = null;
var isInitialized = false;

var debugLog = [];

function logDebug(msg) {
  return;
  var timestamp = new Date().toISOString().substr(11, 12);
  console.log("[" + timestamp + "] [SOCKET-DEBUG] " + msg);
  debugLog.push({ time: Date.now(), msg: msg });
}
// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Initialize Ably connection for real-time draft communication
 */
export async function initAbly(apiKey, invitationCode) {
  logDebug("=== initAbly() CALLED ===");
  logDebug("API Key provided: " + !!apiKey);
  logDebug("Key length: " + (apiKey ? apiKey.length : 0));
  logDebug("Invitation code: " + invitationCode);

  try {
    // Cleanup old connection
    if (ablyInstance) {
      logDebug("Closing existing connection...");
      await disconnectAbly();
    }

    logDebug("Creating new Ably.Realtime instance...");

    ablyInstance = new Ably.Realtime({
      key: apiKey,
      clientId: "user-" + Date.now(),
      logLevel: 4,
      echoMessages: false, // Don't receive own messages back
    });

    logDebug("Ably instance created");

    // Create channel
    currentInvitationCode = invitationCode;
    var channelName = "draft:" + invitationCode;

    logDebug("Getting channel: " + channelName);
    activeChannel = ablyInstance.channels.get(channelName);
    logDebug("Channel object created, state=" + activeChannel.state);

    // STEP 1: Wait for CONNECTION to be ready (not channel!)
    logDebug("Step 1: Waiting for connection...");

    await new Promise(function (resolve, reject) {
      var timeoutId;
      var done = false;

      // Timeout after 10 seconds
      timeoutId = setTimeout(function () {
        if (!done) {
          done = true;
          clearTimeout(timeoutId);
          reject(new Error("Connection timeout"));
        }
      }, 10000);

      // If already connected, resolve immediately
      if (ablyInstance.connection.state === "connected") {
        logDebug("Already connected!");
        done = true;
        clearTimeout(timeoutId);
        resolve();
        return;
      }

      // Otherwise wait for connected event
      function onConnected() {
        if (!done) {
          done = true;
          clearTimeout(timeoutId);
          logDebug("✅ Connection established!");
          ablyInstance.connection.off("connected", onConnected);
          resolve();
        }
      }

      function onFailed(err) {
        if (!done) {
          done = true;
          clearTimeout(timeoutId);
          ablyInstance.connection.off("failed", onFailed);
          reject(err || new Error("Connection failed"));
        }
      }

      ablyInstance.connection.on("connected", onConnected);
      ablyInstance.connection.on("failed", onFailed);
    });

    logDebug("Step 2: Initiating channel attach (fire and forget)...");

    // STEP 2: Initiate attach but DON'T WAIT FOR CALLBACK!
    // Just trigger it - we'll check state ourselves
    activeChannel.attach(function (err) {
      // This callback MAY or MAY NOT fire (Ably bug!)
      if (err) {
        logDebug("⚠️  Attach callback error (ignoring): " + err.message);
      } else {
        logDebug("✅ Attach callback fired (unexpected but good!)");
      }
    });

    // STEP 3: Poll for channel to reach "attached" state (reliable!)
    logDebug("Step 3: Polling for channel attached state...");

    await new Promise(function (resolve) {
      var checks = 0;
      var maxChecks = 50; // 5 seconds max (100ms intervals)

      function checkState() {
        checks++;
        var state = activeChannel ? activeChannel.state : "null";

        logDebug("   Poll #" + checks + ": channel state = " + state);

        if (state === "attached" || state === "suspended") {
          // Attached or suspended (both are usable)
          logDebug("✅ Channel ready! State: " + state);
          resolve();
          return;
        }

        if (checks >= maxChecks) {
          logDebug("⚠️  Polling timeout, using channel anyway...");
          resolve(); // Try to use it anyway
          return;
        }

        // Check again in 100ms
        setTimeout(checkState, 100);
      }

      // Start polling after brief delay
      setTimeout(checkState, 100);
    });

    // WE'RE NOW READY!
    isInitialized = true;

    var finalConnState = ablyInstance
      ? ablyInstance.connection.state
      : "unknown";
    var finalChanState = activeChannel ? activeChannel.state : "unknown";

    logDebug("=== initAbly() COMPLETE - SUCCESS ===");
    logDebug("Final connection state: " + finalConnState);
    logDebug("Final channel state: " + finalChanState);
    logDebug("Ready to publish and subscribe!");

    return true;
  } catch (error) {
    logDebug("❌ initAbly() ERROR: " + error.message);
    cleanup();
    return false;
  }
}

/**
 * Setup connection state change handlers
 */
function setupConnectionMonitoring() {
  if (!ablyInstance) return;

  var connection = ablyInstance.connection;

  connection.on("connected", function () {
    console.log("[Ably] Connection established");
  });

  connection.on("disconnected", function () {
    console.warn("[Ably] Disconnected - will auto-reconnect...");
  });

  connection.on("suspended", function () {
    console.warn("[Ably] Connection suspended (network issue?)");
  });

  // Note: Using string 'failed' to avoid any reserved word issues
  connection.on("failed", function (err) {
    console.error("[Ably] Connection failed permanently:", err);
    isInitialized = false;
  });

  connection.on("closed", function () {
    console.log("[Ably] Connection closed");
    isInitialized = false;
  });
}

/**
 * Generate unique client ID
 */
function generateClientId() {
  return (
    "user-" + Date.now() + "-" + Math.random().toString(36).substring(2, 11)
  );
}

// ============================================================================
// PUB/SUB FUNCTIONS
// ============================================================================

/**
 * Subscribe to a specific draft event
 */
export function onDraftEvent(eventName, callback) {
  if (!activeChannel || !isInitialized) {
    console.error("[Ably] Not initialized. Call initAbly() first.");
    return function () {};
  }

  if (!eventName || typeof eventName !== "string") {
    console.error("[Ably] Invalid event name:", eventName);
    return function () {};
  }

  activeChannel.subscribe(eventName, function (message) {
    try {
      callback(message.data, message);
    } catch (error) {
      console.error("[Ably] Error in handler for " + eventName + ":", error);
    }
  });

  console.log("[Ably] Subscribed to: " + eventName);

  return function () {
    offDraftEvent(eventName, callback);
  };
}

/**
 * Unsubscribe from a specific event
 */
export function offDraftEvent(eventName, callback) {
  if (!activeChannel) return;

  if (callback) {
    activeChannel.unsubscribe(eventName, callback);
    console.log("[Ably] Unsubscribed handler from: " + eventName);
  } else {
    activeChannel.unsubscribe(eventName);
    console.log("[Ably] Unsubscribed all from: " + eventName);
  }
}

/**
 * Publish an event to all draft participants
 */
export function emitDraftEvent(eventName, data) {
  if (!activeChannel || !isInitialized) {
    console.warn('[Ably] ⚠️  Cannot emit "' + eventName + '" - not ready yet');
    console.warn("   State:", getConnectionState());
    console.warn("   Initialized:", isInitialized);
    console.warn("   Channel:", activeChannel ? "exists" : "null");
    return false;
  }

  if (!eventName) {
    console.error("[Ably] Cannot emit - missing event name");
    return false;
  }

  var enrichedData = Object.assign({}, data, {
    _meta: {
      publishedAt: Date.now(),
      publisherId: ablyInstance ? ablyInstance.auth.clientId : null,
    },
  });

  activeChannel.publish(eventName, enrichedData, function (err) {
    if (err) {
      console.error("[Ably] Publish failed for " + eventName + ":", err);
    } else {
      console.log("[Ably] Published: " + eventName);
    }
  });

  return true;
}

// ============================================================================
// DRAFT-SPECIFIC FUNCTIONS
// ============================================================================

/**
 * Join a draft room
 */
export function joinDraft(userId, username, invitationCode) {
  console.log("[Ably] Joining draft: " + invitationCode + " as " + username);

  emitDraftEvent(DRAFT_EVENTS.JOIN_DRAFT, {
    userId: userId,
    username: username,
    invitationCode: invitationCode,
    timestamp: Date.now(),
  });

  if (activeChannel) {
    activeChannel.presence.enter(
      { userId: userId, username: username, joinedAt: Date.now() },
      function (err) {
        if (err) {
          console.error("[Ably] Presence enter failed:", err);
        } else {
          console.log("[Ably] " + username + " entered presence");
        }
      },
    );
  }
}

/**
 * Leave draft room gracefully
 */
export function leaveDraft() {
  if (!activeChannel || !isInitialized) {
    console.log("[Ably] Skipping leaveDraft - not connected");
    return;
  }

  // Only enter presence if channel state is 'attached'
  if (activeChannel.state === "attached") {
    activeChannel.presence.leave(null, function (err) {
      if (err)
        console.log(
          "[Ably] Presence leave warning (non-critical):",
          err.message,
        );
      // Don't throw - this is non-critical cleanup
    });
  }

  // Still emit event even if presence fails
  emitDraftEvent(DRAFT_EVENTS.LEAVE_DRAFT, {
    leftAt: Date.now(),
  });
}

/**
 * Notify that a player was selected during draft
 */
export function playerSelected(clientId, player, invitationCode, role) {
  emitDraftEvent(DRAFT_EVENTS.PLAYER_SELECTED, {
    clientId: clientId,
    player: player,
    invitationCode: invitationCode,
    role: role,
    timestamp: Date.now(),
  });
}

/**
 * Notify that a team was selected during draft
 */
export function teamSelected(clientId, team, invitationCode) {
  emitDraftEvent(DRAFT_EVENTS.TEAM_SELECTED, {
    clientId: clientId,
    team: team,
    invitationCode: invitationCode,
    timestamp: Date.now(),
  });
}

/**
 * Request current draft state from other participants
 */
export function requestCurrentState(invitationCode) {
  emitDraftEvent(DRAFT_EVENTS.REQUEST_STATE, {
    message: "Requesting current draft state",
    invitationCode: invitationCode,
    timestamp: Date.now(),
  });
}

/**
 * Broadcast complete draft state to all participants
 */
export function broadcastCurrentState(draftState, invitationCode) {
  emitDraftEvent(
    DRAFT_EVENTS.CURRENT_STATE,
    Object.assign({}, draftState, {
      invitationCode: invitationCode,
      broadcastAt: Date.now(),
    }),
  );
}

/**
 * Signal that draft has started
 */
export function startDraft(invitationCode, leagueId, tournamentId) {
  emitDraftEvent(DRAFT_EVENTS.START_DRAFT, {
    invitationCode: invitationCode,
    leagueId: leagueId,
    tournamentId: tournamentId,
    startedAt: Date.now(),
  });
}

/**
 * Signal draft completion
 */
export function finishDraft(invitationCode) {
  emitDraftEvent(DRAFT_EVENTS.FINISH_DRAFT, {
    invitationCode: invitationCode,
    finishedAt: Date.now(),
  });
}

/**
 * Propose a swap/trade to another user
 */
export function proposeSwap(leagueId, receiverUserId) {
  emitDraftEvent(DRAFT_EVENTS.SWAP_PROPOSED, {
    leagueId: leagueId,
    receiverUserId: receiverUserId,
    proposedAt: Date.now(),
  });
}

/**
 * Update whose turn it is
 */
export function updateCurrentDrafter(userId) {
  emitDraftEvent(DRAFT_EVENTS.CURRENT_DRAFTER, {
    currentDrafter: userId,
    updatedAt: Date.now(),
  });
}

/**
 * Notify that participant list changed
 */
export function updateDraftOrder(participants, currentDrafter) {
  emitDraftEvent(DRAFT_EVENTS.DRAFT_ORDER_UPDATED, {
    draftParticipants: participants,
    currentDrafter: currentDrafter,
    updatedAt: Date.now(),
  });
}

// ============================================================================
// PRESENCE FEATURES
// ============================================================================

/**
 * Get list of currently online participants
 */
export function getOnlineParticipants(callback) {
  if (!activeChannel || !isInitialized) {
    callback([]);
    return;
  }

  activeChannel.presence.get(function (err, members) {
    if (err) {
      console.error("[Ably] Failed to get presence:", err);
      callback([]);
    } else {
      var participants = members.map(function (member) {
        return {
          userId: member.data ? member.data.userId : null,
          username: member.data ? member.data.username : null,
          connectedSince: member.connectedSince,
        };
      });
      callback(participants);
    }
  });
}

/**
 * Subscribe to presence changes
 */
export function onPresenceChange(callback) {
  if (!activeChannel) return function () {};

  activeChannel.presence.subscribe("enter", function (member) {
    callback(member, "enter");
  });

  activeChannel.presence.subscribe("leave", function (member) {
    callback(member, "leave");
  });

  activeChannel.presence.subscribe("update", function (member) {
    callback(member, "update");
  });

  console.log("[Ably] Subscribed to presence changes");

  return function () {
    if (activeChannel) {
      activeChannel.presence.unsubscribe("enter");
      activeChannel.presence.unsubscribe("leave");
      activeChannel.presence.unsubscribe("update");
    }
  };
}

// ============================================================================
// UTILITY & STATUS FUNCTIONS
// ============================================================================

/**
 * Gracefully disconnect from Ably
 */
export async function disconnectAbly() {
  console.log("[Ably] Disconnecting...");

  // SAFETY: Skip presence if already detached
  if (activeChannel && activeChannel.state === "attached") {
    try {
      await new Promise(function (resolve) {
        activeChannel.presence.leave(null, function () {
          resolve();
        });
      });
    } catch (e) {
      console.log(
        "[Ably] Presence leave failed during disconnect (ok):",
        e.message,
      );
    }
  }

  // SAFETY: Only close if connection exists and isn't already closed
  if (ablyInstance) {
    var currentState = ablyInstance.connection.state;

    if (currentState !== "closed" && currentState !== "failed") {
      await new Promise(function (resolve) {
        ablyInstance.close(function () {
          resolve();
        });
      });
    } else {
      console.log(
        "[Ably] Connection already " + currentState + ", skipping close",
      );
    }
  }
}

/**
 * Internal cleanup helper
 */
function cleanup() {
  ablyInstance = null;
  activeChannel = null;
  currentInvitationCode = null;
  isInitialized = false;
}

/**
 * Check if Ably is currently connected and ready
 */
export function isAblyConnected() {
  return (
    isInitialized &&
    ablyInstance &&
    ablyInstance.connection.state === "connected"
  );
}

/**
 * Get current connection state string
 */
export function getConnectionState() {
  return ablyInstance ? ablyInstance.connection.state : "not-initialized";
}

/**
 * Get current channel name (for debugging)
 */
export function getCurrentChannel() {
  return currentInvitationCode ? "draft:" + currentInvitationCode : null;
}

/**
 * Get detailed connection info (for debugging UI)
 */
export function getConnectionInfo() {
  return {
    isConnected: isAblyConnected(),
    state: getConnectionState(),
    channel: getCurrentChannel(),
    clientId:
      ablyInstance && ablyInstance.auth ? ablyInstance.auth.clientId : null,
    initialized: isInitialized,
  };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  EVENTS: DRAFT_EVENTS,

  // Core
  initAbly: initAbly,
  disconnectAbly: disconnectAbly,
  isAblyConnected: isAblyConnected,
  getConnectionState: getConnectionState,
  getConnectionInfo: getConnectionInfo,
  getCurrentChannel: getCurrentChannel,

  // Pub/Sub
  onDraftEvent: onDraftEvent,
  offDraftEvent: offDraftEvent,
  emitDraftEvent: emitDraftEvent,

  // Draft Actions
  joinDraft: joinDraft,
  leaveDraft: leaveDraft,
  startDraft: startDraft,
  finishDraft: finishDraft,
  playerSelected: playerSelected,
  teamSelected: teamSelected,
  requestCurrentState: requestCurrentState,
  broadcastCurrentState: broadcastCurrentState,
  proposeSwap: proposeSwap,
  updateCurrentDrafter: updateCurrentDrafter,
  updateDraftOrder: updateDraftOrder,

  // Presence
  getOnlineParticipants: getOnlineParticipants,
  onPresenceChange: onPresenceChange,
};
