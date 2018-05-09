import * as types from './mutation-types'

const mutations = {
  [types.SET_PLAYING](state, flag) {
    state.playing = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_ISOAUTH](state, flag) {
    state.isOauth = flag
  }
}
export default mutations
