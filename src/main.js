// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
Vue.use(VueResource);
import router from './router'
import store from './store/index'
import $ from 'jquery'
Vue.config.productionTip = false
Vue.http.interceptors.push(function(request, next) {
    let TOKEN = getCookie("token");
    let timeout;
    if (request._timeout) {
        timeout = setTimeout(() => {　　　　　　　　 //自定义响应体 status:408,statustext:"请求超时"，并返回给下下边的next
            next(request.respondWith(request.body, {
                status: 408,
                statusText: '网络异常'
            }));

        }, request._timeout);
    }
    setCookie('token', getCookie("token"), 30)
    if (TOKEN) {
        request.headers.set('token', TOKEN);
    }
    next(function(response) {
        return response
    });
});
new Vue({
    el: '#app',
    store,
    router,
    computed: {
        url() {

        }
    },
    data() {
        return {
            hhh: 111
        }
    },
    template: '<App/>',
    components: { App }
})
Vue.filter('formatDate', function(now) {
    if (now) {
        var d = new Date(parseInt(now))
        var year = d.getFullYear();
        var month = d.getMonth() < 9 ? ("0" + (d.getMonth() + 1)) : ((d.getMonth() + 1));
        var date = d.getDate() < 10 ? ("0" + d.getDate()) : (d.getDate());
        var hour = d.getHours() < 10 ? ("0" + d.getHours()) : (d.getHours());;
        var minute = d.getMinutes() < 10 ? ("0" + d.getMinutes()) : (d.getMinutes());;
        var second = d.getSeconds() < 10 ? ("0" + d.getSeconds()) : (d.getSeconds());;
        return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
    } else {
        return "";
    }
})
Vue.filter('formatDate12', function(now) {
    if (now) {
        var d = new Date(parseInt(now))
        var year = d.getFullYear();
        var month = d.getMonth() < 9 ? ("0" + (d.getMonth() + 1)) : ((d.getMonth() + 1));
        var date = d.getDate() < 10 ? ("0" + d.getDate()) : (d.getDate());
        var hour = d.getHours() < 10 ? ("0" + d.getHours()) : (d.getHours());;
        var minute = d.getMinutes() < 10 ? ("0" + d.getMinutes()) : (d.getMinutes());;
        var second = d.getSeconds() < 10 ? ("0" + d.getSeconds()) : (d.getSeconds());;
        return month + "-" + date;
    } else {
        return "";
    }
})

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expiredays * 60 * 1000);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};
//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return (arr[2]);
    else
        return null;
}