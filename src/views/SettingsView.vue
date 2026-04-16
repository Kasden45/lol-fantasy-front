<!-- TeamSelection.vue -->
<template>
  <div class="settings-page">
    <div class="settings-header">
      <div class="header-accent" />
      <div>
        <p class="settings-eyebrow">Configuration</p>
        <h1 class="settings-title">Settings</h1>
      </div>
    </div>

    <div class="settings-container">
      <div
        v-for="(setting, index) in userSettings.settings"
        :key="setting.userSettingId"
        class="setting-row"
        :style="{ animationDelay: `${index * 60}ms` }"
      >
        <div class="setting-info">
          <span class="setting-name">{{
            $func_global.mapSettings(setting.name)
          }}</span>
        </div>

        <label v-if="setting.type === 'Boolean'" class="toggle-switch">
          <input
            type="checkbox"
            v-model="setting.value"
            @change="updateSetting(setting.userSettingId)"
          />
          <span class="toggle-track">
            <span class="toggle-thumb" />
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userSettings: {},
      errorSavingsettings: false,
    };
  },
  methods: {
    getSettings() {
      this.axios
        .get(`${this.apiURL}User/${this.$store.getters.getProfileId}/settings`)
        .then((response) => {
          this.userSettings = response.data;
          this.userSettings.settings = this.userSettings.settings.map(
            (setting) => ({
              ...setting,
              value:
                setting.type === "Boolean" ? setting.value == 1 : setting.value,
            }),
          );
        })
        .catch((error) => {
        });
    },
    updateSetting(userSettingId) {
      // Change the setting for email notifications
      const data = this.userSettings.settings.find(
        (setting) => setting.userSettingId === userSettingId,
      );
      data.value = data.value == true ? 1 : 0;
      const url = `${this.apiURL}User/${this.$store.getters.getProfileId}/settings`;
      this.axios
        .put(url, data)
        .then((response) => {
          data.value = data.value == 1 ? true : false;

          // this.clearInputs()
        })
        .catch(() => {
          this.errorSavingsettings = true;

          // if (error.response.status === 409) {
          // }
        });
    },
  },
  mounted() {
    // Fetch team players when the component is mounted
    this.getSettings();
  },
};
</script>

<style scoped>
/* @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"); */

.settings-page {
  min-height: 100vh;
  padding: 48px 24px;
  background-color: var(--BACKGROUND-DARK);
  font-family: "DM Sans", sans-serif;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 640px;
  margin: 0 auto 40px;
}

.header-accent {
  width: 4px;
  height: 52px;
  border-radius: 4px;
  background: linear-gradient(180deg, #a63a9f, #c276bd);
  flex-shrink: 0;
}

.settings-eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #a63a9f;
}

.settings-title {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.settings-container {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 10px;
  transition: border-color 0.2s, background 0.2s;
  animation: fadeSlideIn 0.4s ease both;
}

.setting-row:hover {
  background: #1e1e35;
  border-color: #a63a9f44;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-name {
  font-size: 15px;
  font-weight: 500;
  color: #e2e2f0;
}

.setting-type {
  font-size: 11px;
  font-weight: 500;
  color: #4a4a6a;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Custom Toggle */
.toggle-switch {
  position: relative;
  display: inline-block;
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  display: flex;
  align-items: center;
  width: 48px;
  height: 26px;
  background: #2a2a3e;
  border-radius: 999px;
  border: 1px solid #3a3a5e;
  transition: background 0.25s, border-color 0.25s;
  padding: 0 3px;
}

.toggle-thumb {
  width: 18px;
  height: 18px;
  background: #4a4a6a;
  border-radius: 50%;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    background 0.25s;
  flex-shrink: 0;
}

.toggle-switch input:checked + .toggle-track {
  background: linear-gradient(135deg, var(--PRIMARY), var(--PRIMARY-LIGHTER));
  border-color: var(--PRIMARY);
}

.toggle-switch input:checked + .toggle-track .toggle-thumb {
  transform: translateX(22px);
  background: #ffffff;
}
</style>
