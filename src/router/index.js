import Vue from 'vue'
import ElementUi from 'element-ui'
import Layer from 'vue-layer'
import Router from 'vue-router'
import Echarts from 'echarts'
import BaiduMap from 'vue-baidu-map'
import NotLoggedIn from '../components/NotLoggedIn/NotLoggedIn.vue' //未登录状态首页
import LoggedIn from '../components/LoggedIn/LoggedIn.vue' //登录状态首页
import ContactUs from '../components/ContactUs/ContactUs.vue' //联系我们组件
import DeveloperCenter from '../components/DeveloperCenter/DeveloperCenter.vue' //开发者中心
import ProdectServe from '../components/ProdectServe/ProdectServe.vue' //首页组件
import LoginRegister from '../components/LoginRegister/LoginRegister.vue' //登录注册组件
import Login from '../components/LoginRegister/Login/Login.vue' //登录组件
import Register from '../components/LoginRegister/Register/Register.vue' //注册组件
import ForgotPass from '../components/LoginRegister/ForgotPass/ForgotPass.vue' //注册组件
import ActualTime from '../components/ActualTime/ActualTime.vue' //实时组件
import Retention from '../components/Retention/Retention.vue' //留存分析组件
import ErrorAnalysis from '../components/ErrorAnalysis/ErrorAnalysis.vue' //错误信息组件
import Event from '../components/Event/Event.vue' //事件分析组件
import EventAnalyse from '../components/EventAnalyse/EventAnalyse.vue' //事件分析组件
import EventConfig from '../components/EventConfig/EventConfig.vue' //事件配置组件
import Funnel from '../components/Funnel/Funnel.vue' //漏斗组件
import FunnelMes from '../components/FunnelMes/FunnelMes.vue' //漏斗详情组件
import FunnelDetail from '../components/FunnelDetail/FunnelDetail.vue' //漏斗详情明细组件
import ErrorList from '../components/ErrorList/ErrorList.vue' //错误列表组件
import ErrorMes from '../components/ErrorMes/ErrorMes.vue' //错误详情组件
import Examines from '../components/Examines/Examines.vue' //用户细查组件
import Survey from '../components/Survey/Survey.vue' //概况组件
import Pageviews from '../components/Pageviews/Pageviews.vue' //页面访问组件
import Activedetail from '../components/Activedetail/Activedetail.vue' //活跃明细组件
import Versiondetail from '../components/Versiondetail/Versiondetail.vue' //版本明细组件
import Citydetail from '../components/Citydetail/Citydetail.vue' //城市明细组件
import Insert from '../components/Insert/Insert.vue' //接入组件
import Channelsetting from '../components/Channelsetting/Channelsetting.vue' //渠道设置组件
import Eam from '../components/Eam/Eam.vue' //接入管理组件
import Personal from '../components/Personal/Personal.vue' //个人中心组件
import Information from '../components/Information/Information.vue' //个人信息组件
import Securityset from '../components/Securityset/Securityset.vue' //安全设置组件
import '../../node_modules/element-ui/lib/theme-chalk/index.css'

Vue.use(Router)
Vue.prototype.$layer = Layer(Vue);
Vue.use(ElementUi)
Vue.use(Echarts)
export default new Router({
    module: history,
    routes: [{
            path: '/',
            name: 'Hello',
            component: NotLoggedIn,
            children: [{
                    path: '/LoginRegister',
                    name: 'LoginRegister',
                    component: LoginRegister,
                    children: [
                        { path: '/Login', name: 'Login', component: Login },
                        { path: '/Register', name: 'Register', component: Register },
                        { path: '/ForgotPass', name: 'ForgotPass', component: ForgotPass },
                        { path: '/', redirect: "/Login" }
                    ],
                },
                { path: '/ContactUs', name: 'ContactUs', component: ContactUs, },
                { path: '/DeveloperCenter', name: 'DeveloperCenter', component: DeveloperCenter, },
                { path: '/ProdectServe', name: 'ProdectServe', component: ProdectServe, },
                { path: '/', redirect: '/ProdectServe' },
            ]
        },
        {
            path: '/LoggedIn',
            name: 'LoggedIn',
            component: LoggedIn,
            children: [
                { 'path': '/ActualTime/channelId/:channelId', component: ActualTime },
                { 'path': '/Survey/channelId/:channelId', component: Survey },
                { 'path': '/Activedetail', component: Activedetail },
                { 'path': '/Versiondetail', component: Versiondetail },
                { 'path': '/Citydetail', component: Citydetail },
                { 'path': '/Pageviews/channelId/:channelId', component: Pageviews },
                { 'path': '/Retention/channelId/:channelId', component: Retention },
                { 'path': '/Examines/channelId/:channelId', component: Examines },
                {
                    path: '/ErrorAnalysis',
                    component: ErrorAnalysis,
                    children: [
                        { 'path': '/ErrorList/channelId/:channelId', component: ErrorList },
                        { 'path': '/ErrorMes/:crashId', component: ErrorMes },
                        { 'path': '/', redirect: "/ErrorList" },
                    ]
                },
                { 'path': '/ErrorMes', component: ErrorMes },
                {
                    path: '/Event',
                    component: Event,
                    children: [
                        { path: '/EventAnalyse/channelId/:channelId', component: EventAnalyse },
                        { path: '/EventConfig/channelId/:channelId', component: EventConfig },
                        { 'path': '/', redirect: "/EventAnalyse" },
                    ]
                },
                { 'path': '/Funnel/channelId/:channelId', 'component': Funnel },
                { 'path': '/FunnelMes/name/:name/id/:id/channelId/:channelId', component: FunnelMes },
                { 'path': '/FunnelDetail/eventCode/:eventCode/FunnelName/:FunnelName/channelId/:channelId', component: FunnelDetail },
                {
                    'path': '/Insert',
                    component: Insert,
                    children: [
                        { 'path': "/Eam", component: Eam },
                        { 'path': "/Channelsetting", component: Channelsetting },
                        { 'path': '/', component: Eam },
                    ]
                },
                {
                    'path': '/Personal',
                    component: Personal,
                    children: [
                        { 'path': "/Information", name: "Information", component: Information },
                        {
                            'path': "/Securityset",
                            name: "Securityset",
                            component: Securityset,
                        },
                        { 'path': '/', component: Information },
                    ]
                },
                { path: '/', redirect: '/Login' },
            ]
        }
    ]
})