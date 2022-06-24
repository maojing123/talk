// 此代码为登录页面
// 1.验证账号
const loginIdValidator = new FieldValidator('txtLoginId',function(val){
// 1-1.判断是否有账号
if(!val){
    return '请填写账号';
}
});

// 2.验证密码
const loginPwdValidator = new FieldValidator('txtLoginPwd',function(val){
// 2-1.判断是否有密码
if(!val){
    return '请填写密码';
}
});

// 3.获取整个注册表单
const form = $('.user-form');

// 4.提交事件
form.onsubmit = async function (e) {
    // 4-1.清除form默认行为
    e.preventDefault();
    // 4-2.传入验证内容
    const result = await FieldValidator.validate(
        loginIdValidator,
        loginPwdValidator
    );
    // 4-3.验证未通过，直接返回
    if(!result){
        return;
    }
    // 4-4.传入表单dom【此时为文本框】
    const formData = new FormData(form);
    // 4-5.得到一个表单数据对象，6-4到6-5为了拿到数据得到一个表单数据对象，6-4到6-5为了拿到数据
    const data = Object.fromEntries(formData.entries());
    // 4-6.将数据发送到登录接口中
    const resp = await API.login(data);
    // 4-7.登录成功后
    if(resp.code === 0){
        alert('登录成功，点击确定，跳转到首页');
        location.href = './index.html';
    }
    // 4-8.登录失败后
    else{
        loginIdValidator.p.innerText = '账号或密码错误';
        loginIdValidator.input.value = '';
    }
}
