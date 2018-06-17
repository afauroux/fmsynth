import Vuex from 'vuex'


const createStore = () => {
  return new Vuex.Store({
    state: {
      audioCtx: undefined,
      gridnodeNB: 12,
      nodes: []

    },
    getters: {
      getNode: (state) => (index) => {
        return state.nodes[index]
      },
      getNodeData: (state) => (index) => {
        return state.nodes[index] ? state.nodes[index].data : {}
      },
      getNodeDest: (state) => (index) => {
        return state.nodes[index] ? state.nodes[index].dest : {}
      },
      getNodeAudioN: (state) => (index) => {
        return state.nodes[index] ? state.nodes[index].audioNode : {}
      },

    },
    mutations: {
      initializeCtx(state) {
        if (process.browser) {
          state.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        }
      },
      initializeNodes(state, component) {
        for (let i = 0; i < state.gridnodeNB; i++) {
          state.nodes[i] = {
            component: component,
            data: {},
            audioNode: undefined,
            dest: undefined
          }
        }
      },
      addComponent(state, c) {
        state.nodes[+c.index] = {
          component: c.component,
          data: c.data,
          audioNode: c.audioNode,
          dest: c.dest
        }
      },
      setNodeData(state, {
        index,
        data
      }) {
        state.nodes[index].data = data;
      },
      setNodeDest(state, {
        index,
        dest
      }) {
        state.nodes[index].dest = dest;
      },
      setNodeAudioN(state, {
        index,
        audioNode
      }) {
        state.nodes[index].audioNode = audioNode;
        console.log('trying')
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
    },
    actions: {
      setNodeData({
        commit
      }, payload) {
        commit('setNodeData', payload)
      },
      setNodeDest({
        commit
      }, payload) {
        commit('setNodeDest', payload)
      },
      setNodeAudioN({
        commit
      }, payload) {
        commit('setNodeAudioN', payload)
      }
    }
  }); //end of store
}

export default createStore;
