import {createStore} from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
    state() {
        return {
            // SOCIAL
            profileId: "",
            login: "",
            fixtureId: "",
            currentTournamentId: '112966669920590211',
            email: "",
            token: "",
            roles: [],
            selectedRequest: null,
            nextFixture: null
            // NUTRITION

            // TELEMEDICINE
        }
    },
    mutations: {
        setProfileId(state, value) {
            state.profileId = value;
        },
        setLogin(state, value) {
            state.login = value;
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
        },
        setCurrentTournamentId(state, value) {
            state.currentTournamentId = value;
        },
        setNextFixture(state, value) {
            state.nextFixture = value;
        }
    },
    getters: {
        getProfileId(state) {
            return state.profileId;
        },
        getLogin(state) {
            return state.login;
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
        },
        getCurrentTournamentId(state) {
            return state.currentTournamentId;
        },
        getNextFixture(state) {
            return state.nextFixture;
        }
    },
    plugins: [createPersistedState()],
});