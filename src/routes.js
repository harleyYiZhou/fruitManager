import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import UserTable from './views/nav2/UserTable.vue'
import Page5 from './views/nav2/Page5.vue'
import ShopTable from './views/nav3/shopTable.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import NoticeTable from './views/nav4/noticeTable.vue'
import Manager from './views/ShopManager.vue'
import Stock from './views/nav5/Stock.vue'
import AllOrder from './views/nav6/AllOrder.vue'
import DeliverOrder from './views/nav6/DeliverOrder.vue'
import ConfirmOrder from './views/nav6/ConfirmOrder.vue'
import CompleteOrder from './views/nav6/CompleteOrder.vue'
import CancelOrder from './views/nav6/CancelOrder.vue'
import RefundOrder from './views/nav6/RefundOrder.vue'
import AcceptOrder from './views/nav6/AcceptOrder.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    
    //{ path: '/main', component: Main },
    {
        path: '/home',
        component: Home,
        name: '商品管理',
        iconCls: 'el-icon-message',//图标样式class
        show: true,
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '商品列表' },
            { path: '/form', component: Form, name: '添加商品分类' },
            // { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/home',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-id-card-o',
        show: true,
        children: [
            {path:'/userTable',component: UserTable,name:'用户列表'}
            // { path: '/table', component: Table, name: '用户列表' },
            // { path: '/form', component: Form, name: '添加用户' }
        ]
    },
    {
        path: '/home',
        component: Home,
        name: '连锁店管理员管理',
        iconCls: 'fa fa-address-card',
        show: true,
        // leaf: true,//只有一个节点
        children: [
            {path:'/shopTable',component: ShopTable,name:'连锁店管理员列表'}
            // { path: '/table', component: Table, name: '连锁店管理员列表' },
            // { path: '/form', component: Form, name: '添加连锁店管理员' }
        ]
    },
    {
        path: '/home',
        component: Home,
        name: '公告管理',
        iconCls: 'fa fa-address-card',
        show: true,
        // leaf: true,//只有一个节点
        children: [
            {path:'/noticeTable',component: NoticeTable,name:'公告列表'}
            // { path: '/table', component: Table, name: '连锁店管理员列表' },
            // { path: '/form', component: Form, name: '添加连锁店管理员' }
        ]
    },
    {
        path:'/manager',
        component: Manager,
        name: '商品库存量',
        iconCls: 'fa fa-address-card',
        show: false,
        children:[
            {path:'/stock',component:Stock,name:'商品列表'}
        ]
    },
    {
        path:'/manager',
        component: Manager,
        name: '订单管理',
        iconCls: 'fa fa-address-card',
        show: false,
        children:[
            {path:'/manager/allOrder',component:AllOrder,name:'全部订单'},
            {path:'/manager/acceptOrder',component:AcceptOrder,name:'待接单订单'},
            {path:'/manager/deliverOrder',component:DeliverOrder,name:'待发货订单'},
            {path:'/manager/confirmOrder',component:ConfirmOrder,name:'待收货订单'},
            {path:'/manager/completeOrder',component:CompleteOrder,name:'已完成订单'},
            {path:'/manager/cancelOrder',component:CancelOrder,name:'已取消订单'},
            {path:'/manager/refundOrder',component:RefundOrder,name:'退货退款订单'}
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;