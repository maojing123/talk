// 此代码为用户登录和注册的表单项验证的通用代码

// 1.创建构造函数，检验一个表单，
class FieldValidator {
    // 1.创建构造器
    /**
     * 构造器
     * @param {string} txtId 文本框的Id
     * @param {function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，就会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
     */
  constructor(txtId,validatorFunc){
    // 1-1-1.拿到需要检验的文本框
    this.input = $('#' + txtId);
    // 1-1-2.拿到文本框的兄弟元素p
    this.p = this.input.nextElementSibling;
    // 1-1-3.检验方法的传入
    this.validatorFunc = validatorFunc;
    // 1-1-4.失去焦点时检验，onblur为失去焦点事件
    this.input.onblur = () => {
        // 1-1-4-1.验证函数
        this.validate();
    };
  }

    // 2.验证结果
    /**
     * 验证方法
     */
    async validate() {
    // 1-2-1.保存输出错误值
    const err = await this.validatorFunc(this.input.value);
    // 1-2-2.判断是否错误
    if(err){
        // 1-2-2-1.有错误
        this.p.innerText = err;
        return false;
    }else{
         // 1-2-2-2.没有错误
         this.p.innerText = '';
         return true;
     }
    }
    
    /**
     * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
     * @param  {FieldValidator[]} validators 
     */
    // 3.对传入的所有验证器进行统一的验证
    static async validate(...validators) {
        // 1-3-1.传入验证每一个
        const proms = validators.map((v) => v.validate());
        // 1-3-2.验证结果
        const results = await Promise.all(proms);
        // 1-3-3.每个结果依次验证
        return results.every((r) => r);
    }
}