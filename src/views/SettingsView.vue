<!-- TeamSelection.vue -->
<template>
  <div>
    <h1>Settings</h1>
    <div class="row justify-content-center">

      <div class="col-md-8">
        <table >
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr class="justify-content-center" v-for="setting in this.userSettings.settings" :key="setting.userSettingId">
              <td class="justify-content-center">
                {{this.$func_global.mapSettings(setting.name)}}
              </td>
              <td></td>
              <td>
                <div class="form-check form-switch" >
                  <input v-if="setting.type === 'Boolean'" class="form-check-input" v-on:change="updateSetting(setting.userSettingId)" v-model="setting.value" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                  <!-- <label class="form-check-label" v-bind="setting.value"></label> -->
                </div>
              </td>
              
          
              </tr>
            </tbody>
          </table>
        
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
        // Change the setting for email notifications
        this.axios.get(`${this.apiURL}User/${this.$store.getters.getProfileId}/settings`)
        .then((response) => {
          this.userSettings = response.data;
        })
        .catch((error) => {
          console.error("Error fetching team players:", error);
        });
      },
      updateSetting(userSettingId) {
        // Change the setting for email notifications
        const data = this.userSettings.settings.find((setting) => setting.userSettingId === userSettingId);
        data.value = data.value == true ? 1 : 0;
        console.log('updated data: ',data)
        const url = `${this.apiURL}User/${this.$store.getters.getProfileId}/settings`
        this.axios.put(url, data).then((response) => {
            console.log(response.data)
            data.value = data.value == 1 ? true : false;
            
            // this.clearInputs()
        }).catch(() => {
          this.errorSavingsettings = true

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
/* Add custom styles for team and player cards as needed */
.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  justify-content: center;
}

.card-title {
  font-size: 2rem;
  top: 50%;
  
}

.card-body {
  padding: 10px;
  justify-content: center;
}

.player-body {
  text-align: left
}

.team-image {
  max-height: 100px; /* Set the maximum height to 50 pixels */
  width: auto;
}

.player-image {
  max-height: 50px; /* Set the maximum height to 50 pixels */
  max-width: 100px; /* Allow the width to adjust proportionally */
}

.player-card {
  background-color: rgb(71, 71, 71);
}

.team-image-container {
  display: flex;
  
  color: white;
  font-size: larger;
  background-color: rgb(94, 91, 91);
  width: auto; /* Allow the width to adjust proportionally */
}

.summoner-role {
  font-size: small;
  color: white;
  margin: 0;
}

.summoner-name {
  font-size: 18px;
  color: white;
  font-weight: 500;
  margin: 0;

}

.summoner-first-name {
  font-size: 12px;
  margin: 0;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  padding: 8px;
  text-align: left;
  font-weight: 700;
}
</style>