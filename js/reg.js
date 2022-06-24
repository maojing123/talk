// 此代码为注册页面
// 1.账号验证
const loginIdValidator = new FieldValidator('txtLoginId',async function (val) {
    // 1-1.没有账号，填写账号
    if(!val) {
        return '请填写账号';
    }
    // 1-2.请求验证账号接口
    const resp = await API.exists(val);
    // 1-3.账号已经存在的情况
    if(resp.data) {
        return '该账号已被占用，请重新选择一个账号名';
    }
});

// 2.昵称验证
const nicknameValidator = new FieldValidator('txtNickname',function (val) {
    // 2-1.没有昵称，请填写昵称
    if(!val){
        return '请填写昵称';
    }
});

// 3.密码验证
const loginPwdValidator = new FieldValidator('txtLoginPwd',function(val){
   // 3-1.没有密码，请设置密码
   if(!val){
    return '请填写密码';
   }
});

// 4.确认密码验证
const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm',function(val){
// 4-1.请确认密码
if(!val){
    return '请填写确认密码';
}
// 4-2两次密码情况不一致
if(val !== loginPwdValidator.input.value){
    return '两次密码不一致';
}
})

// 5.获取整个注册表单
const form = $('.user-form');

// 6.提交事件
form.onsubmit = async function (e) {
    // 6-1.清除form默认行为
    e.preventDefault();
    // 6-2.传入验证内容
    const result = await FieldValidator.validate(
        loginIdValidator,
        nicknameValidator,
        loginPwdValidator,
        loginPwdConfirmValidator
    );
    // 6-3.验证未通过，直接返回
    if(!result){
        return;
    }
    // 6-4.传入表单dom【此时为文本框】
    const formData = new FormData(form); 
    // 6-5.得到一个表单数据对象，6-4到6-5为了拿到数据
    const data = Object.fromEntries(formData.entries());
    // 6-6.将数据发送到注册接口中
    const resp = await API.reg(data);
    // 6-7.注册成功后
    if(resp.code === 0) {
        alert('注册成功，点击确定，跳转到登录页面');
        location.href = './login.html';
    }
}