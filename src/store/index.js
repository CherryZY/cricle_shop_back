
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
import urls from './url';

Vue.use(Vuex)

export default new Vuex.Store({
  urls,
	state,
	getters,
	mutations,
	actions
})


