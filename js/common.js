// 此代码为了简化代码

// 1.单选简化
function $(selector){
    return document.querySelector(selector);
}

// 2.全选简化
function $$(selector){
    return document.querySelectorAll(selector);
}

// 3.创建简化
function $$$(tagName){
    return document.createElement(tagName);
}