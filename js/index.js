// 此代码为首页功能
// 1.立即执行函数，防止污染全局
(async function () {
// 1-1.验证登录信息，通过传入登录信息接口进行检验
const resp = await API.profile();

// 1-2.存储拿到的信息
const user = resp.data;

// 1-3.判断信息情况，若信息不对
if(!user) {
    // 1-3-1.返回错误信息
    alert('未登录或登录已过期，请重新登录');
    // 1-3-2.跳转到登录页面
    location.href = './login.html';
    return;
}

// 1-4.以下是信息正确的情况
// 1-4-1.封装需要获得的参数
const doms = {
    aside: {
        nickname: $('#nickname'),
        loginId:$('#loginId'),
    },
    close:$('.close'),
    chatContainer:$('.chat-container'),
    txtMsg:$('#txtMsg'),
    msgContainer:$('.msg-container'),
};

// 1-4-2.下面的代码环境为登录状态
setUserInfo();

// 1-4-3.注销事件
doms.close.onclick = function () {
    // 1-4-3-1.使用退出登录接口
    API.loginOut();
    // 1-4-3-2.跳转到登录页面
    location.href = './login.html';
}

// 1-4-4.加载历史记录
// 1-4-4-1.等待历史记录返回结果
await loadHistory();
// 1-4-4-2.发送历史记录请求函数
async function loadHistory() {
    // 1-4-4-2-1.发送请求历史记录接口
    const resp = await API.getHistory();
    // 1-4-4-2-2.循环得到每一次聊天信息
    for (const item of resp.data) {
        addChat(item);
    }
    // 1-4-4-2-3.让滚动条滚到底部
    scrollBottom();
}

// 1-4-5.发送消息
doms.msgContainer.onsubmit = function(e) {
    // 1-4-5-1.取消表单自带样式
   e.preventDefault();
   //  1-4-5-2.调用发送信息函数
   sendChat();  
}

// 1-4-6.设置用户信息
function setUserInfo(){
    // 1-4-6-1.显示账号
    doms.aside.loginId.innerText = user.loginId;
    // 1-4-6-2.显示昵称
    doms.aside.nickname.innerText = user.nickname;
}


// 1-4-7.设置聊天函数
function addChat(chatInfo) {
// 1-4-7-1.创建聊天项目div盒子
const div = $$$('div');
// 1-4-7-2.添加聊天项目盒子样式
div.classList.add('chat-item');
// 1-4-7-3.发送信息来源
if(chatInfo.from){
    // 1-4-7-3-1.如果有消息，则应该是登入的账号
    div.classList.add('me');
}

// 1-4-7-4.创建图片盒子
const img = $$$('img');
// 1-4-7-5.添加图片样式
img.className = 'chat-avatar';
// 1-4-7-6.判断图片来源
img.src = chatInfo.form ? './asset/avatar.png':'./asset/robot-avatar.jpg';

// 1-4-7-7.创建聊天内容盒子
const content = $$$('div');
// 1-4-7-8.添加聊天内容样式
content.className = 'chat-content';
// 1-4-7-9.显示聊天文本
content.innerText = chatInfo.content;

// 1-4-7-10.创建聊天日期盒子
const date = $$$('div');
// 1-4-7-11.添加日期样式
date.className = 'chat-date';
// 1-4-7-12.显示日期文本
date.innerText = formatDate(chatInfo.createdAt);

// 1-4-7-13.将其创建的元素放入聊天项目的盒子
div.appendChild(img);
div.appendChild(content);
div.appendChild(date);
// 1-4-7-14.将聊天项目盒子放入整个盒子中
doms.chatContainer.appendChild(div);
}

// 1-4-8.让聊天区域的滚动条滚动到底
function scrollBottom() {
    // 让其滚动条顶部位于滚动条高度位置即可
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
}

// 1-4-9.设置时间戳函数
function formatDate(timestamp) {
    // 1-4-9-1.当前日期
    const date = new Date(timestamp);
    // 1-4-9-2.年设置
    const year = date.getFullYear();
    // 1-4-9-3.月设置
    const month = (date.getMonth() + 1).toString().padStart(2,'0');
    // 1-4-9-4.天设置
    const day = date.getDay().toString().padStart(2,'0');
    // 1-4-9-5.小时设置
    const hour = date.getHours().toString().padStart(2,'0');
    // 1-4-9-6.分钟设置
    const minute = date.getMinutes().toString().padStart(2,'0');
    // 1-4-9-7.秒设置
    const second = date.getSeconds().toString().padStart(2,'0');
    // 1-4-9-8.拼凑显示
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 1-4-10.设置发送信息函数
async function sendChat(){
// 1-4-10-1.拿到去掉首尾空格的信息
const content = doms.txtMsg.value.trim();
// 1-4-10-2.判断·是否有内容，无内容直接返回
if(!content) {
    return;
}
// 1-4-10-3.添加聊天信息
addChat({
    from: user.loginId,
    to:null,
    createdAt:Date.now(),
    content,
});
// 1-4-10-4.清除文本框的信息
doms.txtMsg.value = '';
// 1-4-10-5.让滚动条滑到底
scrollBottom();
// 1-4-10-6.请求发送信息接口
const resp = await API.sendChat(content);
// 1-4-10-7.添加信息内容
addChat({
    from:null,
    to:user.loginId,
    ...resp.data,
});
// 1-4-10-8.让滚动条滑到底
scrollBottom();
}
// 1-4-10-9.往window里添加
window.sendChat = sendChat;

// 1-4-11.设置关闭事件
doms.close.onclick = function () {
    // 1-4-11-1.退出登录
    API.loginOut();
    // 1-4-11-2.跳转到登录页面中
    location.href = './login.html';
};
})();