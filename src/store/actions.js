/**
 * Created by hp on 2017/9/18.
 */
export default {
    ddd: ({ commit }) => {
        commit('ddd')
    },
    Indexactivebac: ({ commit }) => {
        commit('Indexactivebac')
    },
    loading: ({ commit }) => {
        commit('loading')
    },
    changeisFlagfalse: ({ commit }) => {
        commit('changeisFlagfalse')
    },
    changeisFlagtrue: ({ commit }) => {
        commit('changeisFlagtrue')
    },
    changeisboxshadowtrue: ({ commit }) => {
        commit('changeisboxshadowtrue')
    },
    changeisboxshadowfalse: ({ commit }) => {
        commit('changeisboxshadowfalse')
    },
    changeErrorMes: ({ commit }, item) => {
        commit('changeErrorMes', item)
    },
    changeloadingtrue: ({ commit }) => {
        commit('changeloadingtrue')
    },
    changeloadingfalse: ({ commit }) => {
        commit('changeloadingfalse')
    }
}