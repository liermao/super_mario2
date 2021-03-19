import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const state = {   //要设置的全局访问的state对象
  openid: "",
  avatarUrl: "",
  nickName: ""
  //要设置的初始属性值
};
const getters = {   //实时监听state值的变化(最新状态)
  getOpenID(state) {  //承载变化的showFooter的值
    return state.openid
  },
  getAvatar(state) {  //承载变化的showFooter的值
    return state.avatarUrl
  },
  getNickName() {  //承载变化的changebleNum的值
    return state.nickName
  }
};
const mutations = {
  setOpenID(state, val) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
     state.openid = val;
  },
  setAvatar(state, val) {  //同上
    state.avatarUrl = val;
  },
  setNickName(state, val) { //同上，这里面的参数除了state之外还传了需要增加的值sum
    state.nickName = val;
  }
};
const actions = {
  OpenID(context,val) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
    context.commit('setOpenID',val);
  },
  Avatar(context,val) {  //同上注释
    context.commit('setAvatar',val);
  },
  NickName(context,val){   //同上注释，num为要变化的形参
    context.commit('setNickName',val)
  }
};
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
export default store;
