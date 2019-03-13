/**
 * Created by Luby on 2018/11/21.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let store = new Vuex.Store({
  // 1. state
  state:{
    common:{
      allowBack: true // 控制是否允许后退
    },
    activityDetails:{},
    activityList:{},
    activitySignup:{},
    binding:{},
    editInformation:{},
    editName:{},
    editPhone:{},
    hobby:{},
    home:{},
    IntegralBill:{},
    integralChange:{},
    IntegralEarn:{},
    login:{
      hobby:"", // 兴趣爱好
      family:"", // 家庭结构
      hasChildNumber:"", //小孩数量
      childsAge:"", // 小孩年龄段
      isKnowMember:"",// 知道其他新中会成员
      memberPhone:"", // 新中会电话号码
      relationship:"", //会员关系
      isTenant:"", // 是否写字楼租户
      work :"", // 职业
      haveCar : "", // 是否有车
      workArea:"", // 工作区域
      workAddr:"", // 工作单位
      OfficeBuilding : "",// 办公楼宇
    },
    login6:{},
    login7:{},
    login8:{},
    login9:{},
    memberEquity:{},
    mineInformation:{},
    myPoints:{},
    perfectInformation:{},
    personalInformation:{},
    validateNewPhone:{},
  },

  // // 2. getters
  getters:{
    // 参数列表state指的是state数据
    // 获取是否可跳转的参数
    getAllowBack(state){
      return state.common.allowBack;
    }
  },
  // 3. actions
  // 通常跟api接口打交道
  actions:{

    // 参数列表：{commit, state}
    // state指的是state数据
    // commit调用mutations的方法
    // name就是调用此方法时要传的参数
    setCityName({commit,state}, array){
      console.log("setCityName",array);
      commit("setData", array);
    },
    updateAppSetting({commit,state}, array){
      commit("setData", array);
    }
  },
  // 4. mutations
  mutations:{
    // state指的是state的数据
    // name传递过来的数据 数组接口，1为页面名，2为页面下的对象名，3为赋值参数
    updateAppSetting(state, result){
      console.log("updateAppSetting",result);
      state.common.allowBack = result;
    },
    setData(state, array){
      console.log('setDate',array);
      state[array[0]][array[1]] = array[2];
    }
  }
});

export default store;
