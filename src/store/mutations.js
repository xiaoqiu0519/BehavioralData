/**
 * Created by hp on 2017/9/18.
 */
import getters from './getters';

const state = {
    isFlag: true, //应用选择是否显示
    //url: 'https://server-bdc.bqjr.cn',
    //url: "https://server-sit-bdc.bqjr.cn/",
    url: 'http://10.80.12.68:8088',

    IndexactiveLink: 1,
    loading2: false,
    boxshadow: false,
    ActualTimedata: [],
    ErrorMes: {
        key: '',
        value: ''
    },
    loadingbac: false
}
const mutations = {
    ddd(state) {
        state.comn++
    },
    Indexactivebac(state) {
        console.log(state)
    },
    loading(state) {
        state.loading2 = false;
    },
    changeisFlagfalse(state) {
        state.isFlag = false;
    },
    changeisFlagtrue(state) {
        state.isFlag = true;
    },
    changeisboxshadowtrue(state) {
        state.boxshadow = true;
    },
    changeisboxshadowfalse(state) {
        state.boxshadow = false;
    },
    changeErrorMes(state, item) {
        state.ErrorMes.key = item.key;
        state.ErrorMes.value = item.value;
    },
    changeloadingtrue(state) {
        state.loadingbac = true;
    },
    changeloadingfalse(state) {
        state.loadingbac = false;
    }
}
export default {
    mutations,
    getters,
    state,
}