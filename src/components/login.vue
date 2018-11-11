<template>
  <transition name="tp-fade">
    <div class="login-container el-col-24">
       <form action="/"  class="login-form" ref="loginForm">
          <div style="text-align: center;font-size: x-large;padding-top: 20px;padding-bottom: 20px">用户登录</div>
          <div class="login-item">
            <label class="label"><i class="fa fa-user-circle-o"></i></label>
            <input type="text" ref="loginAccount" @blur="UNValidate"  v-model="formData.name" class="el-input" placeholder="账户名" v-on:input="accountListener"/>
          </div>
          <div class="login-item">
            <label class="label"><i class="fa fa-key"></i></label>
            <input type="password" class="el-input" @blur="PWValidate" v-model="formData.password" ref="pw" placeholder="密码" v-on:input="passwordListener"/>
          </div>
          <div class="login-item">
            <label class="label"><i class="fa fa-key"></i></label>
            <el-select v-model="formData.role" placeholder="请选择账户类型">
              <el-option label="我是店主" value="2"></el-option>
              <el-option label="我是管理员" value="3"></el-option>
            </el-select>
          </div>
          <div class="login-item el-login">
            <!-- <div class="label"><el-switch v-model="loginSwitchDate" on-color="#13ce66" off-color="#ff4949" @change="userloginSwitch"></el-switch></div> -->
             <el-button class="register" type="text" ref="login" @click="register" >注册</el-button>
             <span class="forget">忘记密码？</span>
          </div>
          <div class="login-item el-login ">
             <!--<label class="label"><i class="fa fa-user-circle-o"></i></label>-->
            <el-button type="info" size="large" ref="login" @click="login" :loading="loading_login">登陆</el-button>
          </div>
       </form>

       <span class="login-animate" >
         <i class="fa fa-space-shuttle" v-for="fly in flyAnimate" :key="fly" :class="'p'+ fly"></i>
       </span>
    </div>
  </transition>
</template>

<script>
import {mapGetters,mapMutations, mapActions, Store } from 'vuex'
export default {
	data(){
		return {
        /** 选项 */
       formData: {
         role: '',
         name : '',
	  		 password : ''
       },
       /** token */
       token:"",
       loginSwitchDate : true,
       info:null,
	  	 loading_login : false,
	  	 flyAnimate : 5
	  	}
	},

	computed : {
	  	...mapGetters(['tempAccount','getloginSwitch']),
  },

	methods:{

      UNValidate(){
        if(this.formData.name.length == 0){
          this.$message({
            showClose : true,
            message : '账户不能为空',
            type: 'warning'
          });
        }
      },

      PWValidate(){
         if(this.formData.password.length == 0){
          this.$message({
            showClose : true,
            message : '密码不能为空',
            type: 'warning'
          });
        }
      },

      passwordListener(data) {
        console.log(data);
      },

      accountListener(data){
        console.log(data);
      },

	  	...mapMutations({
	  		setStateDate : 'USERLOGINDATANODEVUE',
	  		setSwitch : 'LOGINSWITCH'
	  	}),

	  	...mapActions({
	  		setUserDate : 'userLoginDataAsync',
	  		getUserData : 'getUserData'
      }),

      /**
       * @description
       * 注册
       */
      register(){
        this.$router.push({
          path: './register'
        });
      },

      /**
       * @description
       * 登录
      **/
	  	login(){
        let uname = this.$refs.loginAccount.value;
        let password = this.$refs.pw.value;
        let groupId = this.formData.role;
        this.loading_login = true;
        var _this = this;
        if( groupId == null || groupId == ""){
          this.loading_login = false;
          this.$message({
            showClose : true,
            message : '角色不能为空',
            type: 'warning'
          });
          return;
        }
        //判断字符长度
        $.ajax({
          type: "post",
          datatype: "json",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("groupId",groupId);
          },
          crossDomain: true,
          url: "http://localhost:8899/web/log/in",
          data:{
            uname: uname,
            pword: password
          },
          success: function(data){
            let value = _this.userData = {
              name : _this.$refs.loginAccount.value,
              password : _this.$refs.pw.value
            };
            if(data.result == 10002){
              _this.loading_login = false;
              _this.$message({
                showClose : true,
                message : '密码错误',
                type: 'warning'
              });
            }else if(data.result == 10003){
              _this.loading_login = false;
              _this.$message({
                showClose : true,
                message : '账户不存在',
                type: 'warning'
              });
            }else if(data.result == 200){
              //token存入storage并且跳转
              let token = data.backData;
              localStorage.setItem('i-token',token);
              localStorage.setItem('accountName',uname);
              if(groupId == "2"){
                localStorage.setItem('roleName',"店主");
              }else if(groupId == "3"){
                localStorage.setItem('roleName',"管理员");
              }
              localStorage.setItem('roleId', groupId);
              _this.$router.push({
                path: '/'
              });
            }
          },
          error: function(data){
            console.log(data);
            _this.loading_login = false;
            _this.$message({
               showClose : true,
                message : '网络错误',
                type: 'warning'
            });
            _this.$router.push({
              path: './login'
            });
          }
        });

        if(this.loginSwitchDate ){
          console.log("this.loginSwitchDate == true");
        }
	  	},


	  	userloginSwitch(){
	  		this.setSwitch( this.loginSwitchDate )
	  	},


	  	SyncloginSwitch(){
		  	this.loginSwitchDate = this.getloginSwitch
	  	}

	},

  mounted(){
  	this.SyncloginSwitch();
  	let flag = this;
  	this.getUserData(function(){
  		flag.userData = this;
  	})
  }

}
</script>
<style lang="scss">

@mixin linear-gradient($direction, $color-stops...) {
  background: nth(nth($color-stops, 1), 1);
  background: -webkit-linear-gradient(legacy-direction($direction), $color-stops);
  background: linear-gradient($direction, $color-stops);
}

.login-container{
	height: 100%;
  background-image: url("http://pic.criclesh.shop/web-register-back.jpg");
	overflow: hidden;


	.login-form{
		 width:500px;
		 position: absolute;
		 left: 50%;
		 top: 50%;
		 border-radius:5px;
		 transform: translate(-250px,-220px);
		 background-color: #324057;
		 color: #E5E9F2;
		 padding-bottom: 40px;
		 border:1px solid #29374c;
		 position: relative;


		 h5{
		 	height: 60px;
		 	line-height: 60px;
		 	text-align: center;
		 	font-size: 30px;
		 	background-color: #263348;
		 	border-radius: 5px 5px 0 0;
		 	margin-bottom: 10px;

		 	&:before{
			 	content: "\f2da";
			 	font: normal normal normal 14px/1 FontAwesome;
			 	font-size: 30px;
			 	margin-right: 10px;
			 }
		 };


	}


	.login-item{
		padding: 10px;

    .select{
      padding-left: 10px
    }

		&.el-login{
			padding:10px 60px 0 80px;

      .register{
        float: left;
      }

			.forget{
				float: right;
			}

			.el-button--info{
				width: 100%;
				height: 50px;
			}
		}



		>.label{
			display: inline-block;
			width:70px;
			height: 50px;
			padding: 0;
			text-align: center;
			vertical-align: middle;

			.fa{
				float: left;
				font-size: 25px;
				margin: 20px 25px 10px;
			}
		}

		.el-input{
			height: 50px;
			width: 350px;
			border:0 none;
			background-color: transparent;
			outline: none;
			border-bottom: 1px solid #8492A6;
			font-size: 18px;
		}
	}

	.login-animate > .fa{
		position: fixed;
		top:50%,;
		left: -100px;
		font-size: 30px;
		color: #fff;
		animation: testm 5s cubic-bezier(0.39, -0.04, 0, 0.87) 0s;

		&.p1{animation-delay: .1s; margin-top:-200px;}
		&.p2{animation-delay: .2s; margin-top:-100px;}
		&.p3{animation-delay: .3s; margin-top:0px;}
		&.p4{animation-delay: .4s; margin-top:100px;}
		&.p5{animation-delay: .5s; margin-top:200px;}
	}
}


@keyframes testm{
	from{ transform: scale(1,1) translateX(0px);}
	50%{ transform: scale(4,4) translateX(350px) ;}
	to{ transform: scale(4,4) translate(800px,-100px);}
}


</style>
