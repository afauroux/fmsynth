import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      audioCtx: undefined,

    },
    getters: {
      audioCtx(state) {
        if (process.browser && !state.audioCtx) {
          state.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        }
        return state.audioCtx
      },
      msg(state) {
        return state.msg;
      }
    }
  })
}

export default createStore
