// 保存数据的属性state
// 如果不函数使用的方式会报警告
export const state = () => {
    return {
        userInfo: {
            token: "",
            user: {}
        }
    }
}
// 同步修改数据
export const mutations = {
    // state这个参数是固定默认的
    // data使用调用该方法时候传入的数据
    setUserInfo(state, data) {
        state.userInfo = data;
    },
    // 清楚用户数据
    clearUserInfo(state) {
        state.userInfo = {
            token: "",
            user: {}
        }
    }
}
// 异步修改数据actions
export const actions = {

}