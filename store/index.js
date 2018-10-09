import Vuex from 'vuex'
import Empty from '~/components/Empty.vue';

const createStore = () => {
  return new Vuex.Store({
    state: {
      audioCtx: undefined,
      gridnodeNB: 24,
      nodes: []

    },
    getters: {
      getNodes: (state) => {
        return state.nodes;
      },
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
      getNodePlugs: (state) => (index) => {
        return state.nodes[index] ? state.nodes[index].plugs : {}
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
            component: component ? component : Empty,
            data: {},
            audioNode: undefined,
            dest: undefined,
            plugs: []
          }
        }
      },
      addComponent(state, c) {
        state.nodes[+c.index] = {
          component: c.component,
          data: c.data,
          audioNode: c.audioNode,
          dest: c.dest,
          plugs: c.plugs
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
      },
      setNodePlugs(state, {
        index,
        plugs
      }) {
        state.nodes[index].plugs = plugs;
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
      },
      setNodePlugs({
        commit
      }, payload) {
        commit('setNodePlugs', payload)
      }
    }
  }); //end of store
}

export default createStore;
