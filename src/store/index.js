import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
    state() {
        return {
            // SOCIAL
            profileId: "",
            fixtureId: "",
            email: "",
            token: "",
            roles: [],
            selectedRequest: null
            // NUTRITION

            // TELEMEDICINE
        }
    },
    mutations: {
        setProfileId(state, value) {
            state.profileId = value;
        },
        setFixtureId(state, value) {
            state.fixtureId = value;
        },
        setEmail(state, value) {
            state.email = value;
        },
        setToken(state, value) {
            state.token = value;
        },
        addRole(state, value) {
            state.roles.push(value);
        },
        setRoles(state, value) {
            state.roles = value;
        },
        setSelectedRequest(state, value) {
            state.selectedRequest = value;
        }
    },
    getters: {
        getProfileId(state) {
            return state.profileId;
        },
        getFixtureId(state) {
            return state.fixtureId;
        },
        getEmail(state) {
            return state.email;
        },
        getToken(state) {
            return state.token;
        },
        getRoles(state) {
            return state.roles;
        },
        getSelectedRequest(state) {
            return state.selectedRequest;
        }
    },
    plugins: [createPersistedState()],
});