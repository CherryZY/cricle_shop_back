<template>
  <div class="tp-admin-side el-menu--dark" :class="menuSwitch() ? 'tp_samll' : ''" >

  <el-col :span="24" v-show="!menuSwitch()">
    <div class="tp-admin-title">
        <router-link to="/" tag="h1">
          <i class="fa fa-ravelry logo"></i>CricleShop 后台
        </router-link>
      </div>
      <div class="el-menu-side">
        <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" router>
          <el-menu-item index="/"><i class="fa  fa-home"></i>首页</el-menu-item>
          <el-submenu index="1">
            <template v-if="role == '3'" slot="title"><i class="fa fa-gears"></i>商品管理</template>
            <template v-else-if="role == '2'" slot="title"><i class="fa fa-gears"></i>商铺管理</template>
            <el-menu-item v-if="role == '2'" index="/shop/detail"><i class="fa fa-angle-double-right"></i>商铺详情</el-menu-item>
            <el-menu-item index="/commodity/commAll"><i class="fa fa-angle-double-right"></i>全部商品</el-menu-item>
            <el-menu-item v-if="role == '2'" index="/commodity/newCommodity"><i class="fa fa-angle-double-right"></i>新建商品</el-menu-item>
          </el-submenu>
          <el-submenu index="7" v-if="role == '3'">
            <template slot="title"><i class="fa fa-gears"></i>商铺管理</template>
            <el-menu-item index="/shop/shopAll"><i class="fa fa-angle-double-right"></i>全部商铺</el-menu-item>
          </el-submenu>
          <el-submenu index="2" v-if="role == '3'">
            <template slot="title"><i class="fa fa-address-card"></i>用户管理</template>
            <el-menu-item index="/admin/list"><i class="fa fa-angle-double-right"></i>用户列表</el-menu-item>
            <el-menu-item index="/admin/role"><i class="fa fa-angle-double-right"></i>角色管理</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"><i class="fa fa-clipboard"></i>数据监测</template>
            <el-menu-item index="/axis/axisChart"><i class="fa fa-angle-double-right"></i>页面访问</el-menu-item>
            <el-menu-item index="/axis/pageChartState"><i class="fa fa-angle-double-right"></i>订单、销售</el-menu-item>
          </el-submenu>
        <el-menu-item index="/admin/log"><i class="fa fa-angle-double-right"></i>日志</el-menu-item>
        </el-menu>
      </div>
    </el-col>
    <div class="tp-admin-container" v-show="menuSwitch()">
      <el-popover ref="small_setting" placement="right" title="设置"  trigger="hover" :class="popoverTheme">
        <router-link to="/setting" tag="p"><i class="fa fa-angle-double-right"></i> 基本设置</router-link>
        <router-link to="/goods" tag="p"><i class="fa fa-angle-double-right"></i> 商品设置</router-link>
      </el-popover>
      <el-popover ref="small_limits" placement="right"  trigger="hover" class="tp-popover-theme">
        <p>权限</p>
      </el-popover>
      <el-popover ref="small_member" placement="right"  trigger="hover" class="tp-popover-theme">
        <p>会员</p>
      </el-popover>
      <el-popover ref="small_monitor" placement="right"  trigger="hover" class="tp-popover-theme">
        <p>数据监测</p>
      </el-popover>
      <ul  class="tp-admin-menu-small">
        <li><i class="fa fa-ravelry logo"></i></li>
        <li>
          <router-link to="/" tag="span">
              <i class="fa fa-home"></i>
          </router-link>
        </li>
        <li v-popover:small_setting>
          <i class="fa fa-gears"></i>
        </li>
        <li v-popover:small_limits>
          <i class="fa fa-address-card" ></i>
        </li>

        <li v-popover:small_member>
          <i class="fa fa-address-book" ></i>
        </li>
        <li v-popover:small_monitor>
          <i class="fa fa-clipboard" ></i>
        </li>
        <li><i class="fa fa-exclamation-triangle"></i></li>
      </ul>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default{
	data() {
      return {
        popoverTheme : 'tp-popover-theme',
        role: '2'
      }
    },

    mounted :function(){
      let token = localStorage.getItem('i-token');
      let roleId = localStorage.getItem('roleId');
      this.role = roleId;
    },

    methods : {

      ...mapGetters({
        menuSwitch : 'getSystemSwitch'
      }),

      handleSelect(key, keyPath){
        //console.log(key, keyPath);
      },

      handleOpen(key, keyPath) {
          //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
          //console.log(key, keyPath);
      }
    }

}
</script>

<style lang="scss" scoped="scoped">

.tp-admin-side .el-col{
	height: 100%;
}
.el-menu-side{
	height: 100%;
	overflow: hidden;
	overflow-y: auto;
	padding-bottom: 150px;
}

.tp-admin-side{
	width: 200px;
	position:fixed;
	z-index: 10;
	left: 0;
	top: 0;
	height: 100%;
	transition: all .5s;
	overflow: hidden;

	&.tp_samll{
		width: 60px;
	}

	>.el-tree{
		height: 100%;
	}
	.fa{
		margin-right: 10px;
	}

	.tp-admin-title{
		height: 120px;
		overflow: hidden;
		cursor: pointer;
		background-color: #1F2D3D;

		>h1{
			color: #fff;
			margin: 0;
			text-align: center;
			font-size: 20px;
			line-height: 120px;
			transition: all .3s;
		}

		&:hover >h1{
			color: #F7BA2A;
			transform: scale(1.1);
		}
	}
}

/* small menu */
.tp-admin-menu-small{
	color: #fff;
	margin: 0;
	padding:0 ;

	> li{
		list-style: none;
		cursor: pointer;

		&:hover{
			background-color: #475669;
		}
	}
	.fa{
		font-size: 20px;
		margin: 20px;
	}

	.logo{
		font-size: 30px;
		margin:15px 10px;
	}

}

</style>
<style lang="scss">
.el-popover{
	background-color: #475669;
	border-color: #475669;
	color: #fff;
	padding: 0!important;

	.popper__arrow:after{
		border-right-color: #475669!important;
		border-left-color: #475669!important;
		left: 0px!important;
	}


	>p{
		height: 40px;
		line-height: 40px;
		cursor: pointer;
		color: #fff;
		padding: 0 10px;
		margin:0;

		&:hover{
			background-color: #8492A6;
		}
	}

	.el-popover__title{
		color: #fff;
		padding: 0 10px;
		line-height: 40px;
		margin: 0;
		border-bottom: 1px solid #324057;
	}
}
</style>
