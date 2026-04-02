<template>
  <div style="padding: 20px; font-family: monospace">
    <h2>Ably Diagnostic Test</h2>

    <div style="margin-bottom: 20px">
      <strong>League Code:</strong>
      <input
        v-model="leagueCode"
        placeholder="L94O-16OI"
        style="width: 200px"
      />
      <button @click="connect" :disabled="connecting">Connect</button>
      <span v-if="status">{{ status }}</span>
    </div>

    <div style="margin-bottom: 20px">
      <strong>Send Test Message:</strong>
      <input v-model="testMessage" placeholder="Hello!" style="width: 200px" />
      <button @click="sendTest" :disabled="!connected">Send</button>
    </div>

    <div style="margin-bottom: 20px">
      <strong>Actions:</strong>
      <button @click="joinDraftTest" :disabled="!connected">Join Draft</button>
      <button @click="getState" :disabled="!connected">Get State</button>
      <button @click="clearLog">Clear Log</button>
    </div>

    <div
      style="
        background: #1e1e1e;
        color: #0f0;
        padding: 15px;
        height: 400px;
        overflow-y: scroll;
        font-size: 12px;
      "
    >
      <pre>{{ logText }}</pre>
    </div>
  </div>
</template>

<script>
import {
  initAbly,
  disconnectAbly,
  emitDraftEvent,
  onDraftEvent,
  DRAFT_EVENTS,
  getConnectionState,
  getDebugLog,
} from "@/socket.js";

export default {
  name: "TestAbly",

  data() {
    return {
      leagueCode: "L94O-16OI",
      testMessage: "Test message",
      connected: false,
      connecting: false,
      status: "",
      logs: [],
      unsubs: [],
    };
  },

  computed: {
    logText() {
      return this.logs.join("\n");
    },
  },

  methods: {
    async connect() {
      this.connecting = true;
      this.status = "Connecting...";
      this.addLog("=== MANUAL CONNECT STARTED ===");

      var apiKey = process.env.VUE_APP_ABLY_API_KEY || "";
      this.addLog(
        "API Key: " + (apiKey ? apiKey.substring(0, 10) + "..." : "MISSING!"),
      );

      var success = await initAbly(apiKey, this.leagueCode);

      this.connected = success;
      this.connecting = false;
      this.status = success ? "✅ Connected!" : "❌ Failed";

      this.addLog("Connect result: " + success);
      this.addLog(
        "Connection state: " + JSON.stringify(getConnectionState(), null, 2),
      );

      if (success) {
        this.setupListeners();
      }
    },

    setupListeners() {
      this.addLog("Setting up listeners...");

      // Listen for join-draft events
      var unsub1 = onDraftEvent(DRAFT_EVENTS.JOIN_DRAFT, (data) => {
        this.addLog("🎉 RECEIVED join-draft: " + JSON.stringify(data));
      });
      this.unsubs.push(unsub1);
      this.addLog("Subscribed to: join-draft");

      // Listen for test messages
      var unsub2 = onDraftEvent("test-message", (data) => {
        this.addLog("🎉 RECEIVED test-message: " + JSON.stringify(data));
      });
      this.unsubs.push(unsub2);
      this.addLog("Subscribed to: test-message");

      // Listen to EVERYTHING (wildcard - Ably feature?)
      this.addLog("Total subscriptions active: " + this.unsubs.length);
    },

    sendTest() {
      this.addLog("Sending test message: " + this.testMessage);
      emitDraftEvent("test-message", {
        text: this.testMessage,
        time: Date.now(),
      });
    },

    joinDraftTest() {
      this.addLog("Sending join-draft event...");
      emitDraftEvent(DRAFT_EVENTS.JOIN_DRAFT, {
        userId: 123,
        username: "TestUser",
        invitationCode: this.leagueCode,
        time: Date.now(),
      });
    },

    getState() {
      this.addLog(
        "Current state: " + JSON.stringify(getConnectionState(), null, 2),
      );
      this.addLog("Debug log entries: " + getDebugLog().length);
    },

    clearLog() {
      this.logs = [];
    },

    addLog(msg) {
      var ts = new Date().toLocaleTimeString();
      this.logs.push("[" + ts + "] " + msg);

      // Auto-scroll to bottom
      this.$nextTick(() => {
        var pre = this.$el.querySelector("pre");
        if (pre) pre.scrollTop = pre.scrollHeight;
      });
    },
  },

  beforeDestroy() {
    this.unsubs.forEach((fn) => fn());
    disconnectAbly();
  },
};
</script>
