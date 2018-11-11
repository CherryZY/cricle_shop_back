import Vue from 'vue'
import Router from 'vue-router'
import * as path from './path'
import store from '../store'
import Axios from 'axios';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      component: path.admin,
      children : [
      		{
			      path: '/',
			      name : 'home',
			      component: path.home,
			      meta : {
			      	//验证登录
			      	requiresAuth : true
			      }
			    },

      		{
			      path: '/setting/basic',
			      name : 'setting',
			      component: path.setting_basic,
			      meta : {
			      	requiresAuth : true
			      }
			    },

			    {
			      path: '/setting/goods',
			      component: path.setting_goods,
			      meta : {
			      	requiresAuth : true
			      }
			    },
			    {
			      path: '/admin/list',
			      component: path.admin_list,
			      meta : {
			      	requiresAuth : true
			      }
			    },
			    {
			      path: '/admin/list/:edit',
			      component: path.admin_list_edit,
			      meta : {
			      	requiresAuth : true
			      }
			    },
			    {
			      path: '/admin/add',
			      component: path.admin_list_add,
			      meta : {
			      	requiresAuth : true
			      }
			    },
			    {
			      path: '/admin/role',
			      component: path.admin_role,
			      meta : {
			      	requiresAuth : true
			      }
			    },

			    {
			      path: '/admin/log',
			      component: path.admin_log,
			      meta : {
			      	requiresAuth : true
			      }
			    },

			    {
			      path: '/member/list',
			      name : 'member',
			      component: path.member_list,
			      meta : {
			      	requiresAuth : true
			      }
			    },
			    {
			      path: '/member/list/:edit',
			      component: path.member_list_edit,
			      meta : {
			      	requiresAuth : true
			      }
			    },
			    {
			      path: '/member/goods',
			      component: path.member_goods,
			      meta : {
			      	requiresAuth : true
			      }
			    },

			    {
			      path: '/axis/axisChart',
			      component: path.axis_axisChart,
			      meta : {
			      	requiresAuth : true
			      }
			    },
			    {
			    	  path: '/axis/pageChartState',
			      component: path.axis_pageChartState,
			      meta : {
			      	requiresAuth : true
			      }
          },
          {
            path:'/commodity/commAll',
            component: path.commodity_all,
            meta : {
              requiresAuth : true
            }
          },
          {
            path:'/shop/shopAll',
            component: path.shop_all,
            meta : {
              requiresAuth : true
            }
          },
          {
            path:'/commodity/newCommodity',
            component: path.new_commodity,
            meta : {
              requiresAuth : true
            }
          },
          {
            path: '/shop/detail',
            component: path.shop_detail,
            meta: {
              requiresAuth : true
            }
          }
      ]
    },
    {
      path: '/login',
      name : 'login',
      component: path.login
    },
    {
      path: '/register',
      name: 'register',
      component: path.register
    },
    {
      path: '*',
      component: path.Error
    }

  ]
});


router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("i-token");
  let _this = this;
  if(to.path == "/login"){
    next();
    return;
  }
  if(to.path == "/register"){
    next();
    return;
  }
  //检测当前storage中的token是否有效
  $.ajax({
    type: "post",
    datatype: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("token",token);
    },
    crossDomain: true,
    url: "http://localhost:8899/web/log/verify",
    success: function(data){
      if(data.result == 200){
        next();
      }else{
        next({
          path: '/login'
        });
      }
    },
    error: function(data){
      console.log(data);
      next({
        path: '/login'
      });
    }
  });
});

export default  router;
