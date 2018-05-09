export const playing = state => state.playing

export const playlist = state => state.playlist

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const isOauth = state => state.isOauth
