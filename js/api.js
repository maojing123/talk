// 第一步：创建立即执行函数，避免污染全局
var API = (function () {
// 1-1.封装变量，减少代码书写
// 1-1-1.请求体
const BASE_URL = 'https://study.duyiedu.com';
// 1-1-2.token函数
const TOKEN_KEY = 'token';
// 1-2.封装方法函数，减少代码书写
// 1-2-1.get请求方法
/**
 * get方法请求
 * @param {*} path 传递的地址
 */
function get(path){
// 1-2-1-1.配置请求头
const headers = {};
// 1-2-1-2.配置token
const token = localStorage.getItem(TOKEN_KEY);
// 1-2-1-3.判断有无token
if(token){
    headers.authorization = `Bearer ${token}`;
}
// 1-2-1-4.返回结果：路径，请求头
return fetch (BASE_URL + path,{ headers });
}

// 1-2-2.post请求方法
/**
 * post请求方法
 * @param {*} path 请求地址
 * @param {*} bodyObj 请求体
 * @returns 
 */
function post(path,bodyObj) {
    // 1-2-2-1.配置请求头
    const headers = {
        'Content-Type':'application/json',
    };
    // 1-2-2-2.配置token
    const token = localStorage.getItem(TOKEN_KEY);
    // 1-2-2-3.判断有无token
    if(token){
        headers.authorization = `Bearer ${token}`;
    }
    // 1-2-2-4.返回结果：路径，请求头+方法+请求体
    return fetch(BASE_URL + path,{
      headers,
      method:'POST',
      body:JSON.stringify(bodyObj),  
    });
}

// 1-3.封装各个接口函数
// 1-3-1.封装注册接口
async function reg(userInfo) {
    // 1-3-1-1.配置post请求方法
    const resp = await post('/api/user/reg',userInfo);
    // 1-3-1-2.返回响应的形式
    return await resp.json();
}

// 1-3-2.封装登录接口
async function login(loginInfo) {
    // 1-3-2-1.配置post请求方法
    const resp = await post('/api/user/login',loginInfo);
    // 1-3-2-2.返回响应格式
    const result = await resp.json();
    // 1-3-2-3.判断是否登录成功
    if(result.code === 0){
        // 1-3-2-3-1.登录成功后，获取authorization
        const token = resp.headers.get('authorization');
        // 1-3-2-3-2.然后将其保存在localStorage中
        localStorage.setItem(TOKEN_KEY,token);
    }
    // 1-3-2-4.返回响应结果
    return result;
}

// 1-3-3.封装验证账号接口
async function exists(loginId) {
    // 1-3-3-1.配置get请求方法
    const resp =await get('/api/user/exists?loginId=' + loginId);
    // 1-3-3-2.返回响应格式
    return await resp.json();
}

// 1-3-4.封装当前登录的用户信息接口
async function profile() {
    // 1-3-4-1.配置get请求方法
    const resp = await get('/api/user/profile');
    // 1-3-4-2.返回响应格式
    return await resp.json();
}

// 1-3-5.封装发送聊天信息接口
async function sendChat(content){
    // 1-3-5-1.配置post请求方法
    const resp = await post('/api/chat',{
        content,
    });
   // 1-3-5-2.返回响应格式
   return await resp.json(); 
}

// 1-3-6.封装获取聊天记录接口
async function getHistory() {
    // 1-3-6-1.配置get请求方法
    const resp = await get('/api/chat/history');
    // 1-3-6-2.返回响应格式
    return await resp.json();
}
// 1-3-7.封装退出登录接口
function loginOut() {
    // 1-3-7-1.根据http协议定义部分，设置移除token部分，重新登录，
    localStorage.removeItem(TOKEN_KEY);
}


// 第二步：返回需要的值，可以使用
return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
};
})();
