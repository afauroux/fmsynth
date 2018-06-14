import Vuex from 'vuex'


const createStore = () => {
  return new Vuex.Store({
    state: {
      audioCtx: undefined,
      gridnodeNB: 12,
      nodes: []

    },
    getters: {
      audioCtx(state) {
        if (process.browser && !state.audioCtx) {
          state.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        }
        return state.audioCtx
      }
    },
    getters: {
      getNode: (state) => (index) => {
        return state.nodes[index]
      }
    },
    mutations: {
      initializeCtx(state) {
        if (process.browser) {
          state.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        }
      },
      initializeNodes(state) {
        for (let i = 0; i < state.gridnodeNB; i++) {
          state.nodes[i] = {
            component: 'Empty',
            data: {}
          }
        }
      },
      addComponent(state, c) {
        state.nodes[+c.index] = {
          component: c.component,
          data: c.data
        }
      },
      swapComponent(state, i1, i2) {
        let comp = state.nodes[i1].component;
        let data = state.nodes[i1].data;

        state.nodes[i1].component = state.nodes[i2].component
        state.nodes[i1].data = state.nodes[i2].data

        state.nodes[i2].component = comp;
        state.nodes[i2].data = data;
      },
      setNodes(state, newList) {
        state.nodes = newList;
      }
    }
  }); //end of store
}

export default createStore;
