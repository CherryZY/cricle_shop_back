<template>
  <div class="register-form el-col-24">

    <div align-center style="padding-left: 23%">
      <el-steps :active="active" finish-status="success">
        <el-step title="step1" description="店主基本信息"></el-step>
        <el-step title="step2" description="店铺基本信息"></el-step>
        <el-step title="step3" description="店铺首页详情图片"></el-step>
      </el-steps>
    </div>

    <!-- 店主基本信息注册 -->
    <el-form v-if="active == 0"
      :model="ReginForm"
      ref="ReginForm"
      :rules="rule"
      class="regform"
      label-width="0">

      <h3 style="padding-bottom: 50px">店主注册</h3>

      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="ReginForm.username"
          placeholder="用户名">
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="ReginForm.password"
          placeholder="密码">
        </el-input>
      </el-form-item>

      <el-form-item prop="confirmpassword">
        <el-input
          type="password"
          v-model="ReginForm.confirmpassword"
          placeholder="确认密码">
        </el-input>
      </el-form-item>

      <el-form-item prop="email">
        <el-input
          type="email"
          v-model="ReginForm.email"
          placeholder="电子邮件">
        </el-input>
      </el-form-item>

      <el-form-item prop="tel">
        <el-input
          type="text"
          v-model="ReginForm.tel"
          placeholder="电话号码">
        </el-input>
      </el-form-item>

      <el-form-item prop="name">
        <el-input
          type="text"
          v-model="ReginForm.name"
          placeholder="昵称">
        </el-input>
      </el-form-item>

      <el-form-item >
        <!--<el-button-->
          <!--:disabled="submitDis"-->
          <!--type="success"-->
          <!--class="submitBtn"-->
          <!--round-->
          <!--@click.native.prevent="submit"-->
          <!--:loading="logining">-->
          <!--注册-->
        <!--</el-button>-->
        <el-button
          :disabled="resetDis"
          type="primary"
          class="resetBtn"
          round
          @click.native.prevent="resetUserInfo">
          重置
        </el-button>
        <el-button :disabled="submitDis"
                   @click.native.prevent="submitUserInfo"
                   style="margin-top: 12px;"
                   :loading="logining"
                   type="success">提交，并下一步</el-button>
        <hr>
        <div style="display: flex;flex-direction: row;justify-content: space-between">
          <p>已经有账号，马上去<span class="to" @click="tologin">登录</span></p>
        </div>
      </el-form-item>
    </el-form>

    <!-- 店铺基本信息填写 -->
    <el-form v-if="active == 1"
             :model="shopForm"
             ref="shopForm"
             :rules="rule2"
             class="regform"
             label-width="0">

      <h3 style="padding-bottom: 50px">店铺基本信息注册</h3>

      <el-form-item prop="shopName">
        <el-input
          type="text"
          v-model="shopForm.shopName"
          placeholder="店铺名称">
        </el-input>
      </el-form-item>

      <el-form-item prop="type">
        <el-select v-model="shopType" placeholder="商铺所属类别">
          <el-option
            v-for="item in shopTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="phoneNum">
        <el-input
          type="text"
          v-model="shopForm.phoneNum"
          placeholder="电话号码">
        </el-input>
      </el-form-item>

      <!--<el-form-item>
        <el-cascader
          :options="CityInfo"
          v-model="shopForm.locationOptions"
          :change-on-select="true"
          :clearable="true"
          :filterable="true"
          @change="handleOptionChange">
        </el-cascader>
        <span>所选地区：{{shopForm.province}}{{shopForm.city}}{{shopForm.county }}</span>
      </el-form-item>-->

      <el-form-item prop="shortIntroduction">
        <el-input
          type="textarea"
          rows=2
          v-model="shopForm.shortIntroduction"
          placeholder="商铺简介...">
        </el-input>
      </el-form-item>

      <el-form-item prop="introduction">
        <el-input
          type="textarea"
          rows=4
          v-model="shopForm.introduction"
          placeholder="商铺详细介绍...">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="resetDis2"
          type="primary"
          class="resetBtn"
          round
          @click.native.prevent="resetShopInfo">
          重置
        </el-button>
        <el-button :disabled="submitDis2"
                   @click.native.prevent="submitShopInfo"
                   style="margin-top: 12px;"
                   :loading="logining"
                   type="success">提交，进入最后一步</el-button>
        <hr>
      </el-form-item>
    </el-form>

    <!-- 店铺详情页图片上传 -->
    <div v-if="active == 2"
             class="regform borderItem"
             label-width="0">
      <el-upload
        :on-success="uploadSuccess"
        :on-error="uploadFailed"
        class="upload-demo"
        :headers = "uploadHeaders"
        action="http://localhost:8899/web/load/up"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList2"
        list-type="picture">
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
      </el-upload>
      <hr>
      <el-button :disabled="submitDis3"
                 @click.native.prevent="submitEnd"
                 style="margin-top: 12px;"
                 :loading="logining"
                 type="success">提交，进入登录页面</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      let confirmpasswordCheck = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('密码是必须的'))
        } else if (value !== this.ReginForm.password) {
          return callback(new Error('两次输入的密码不一致'))
        } else {
          return callback()
        }
      };
      let telCheck = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('电话号码是必须的'))
        } else if (! /^[1][3,4,5,7,6,8][0-9]{9}$/.test(value)){
          return callback(new Error('电话号码必须是数字'))
        } else if (value.length !== 11) {
          return callback(new Error('电话号码必须是11位数字'))
        } else {
          callback()
        }
      };
      return {
        uploadHeaders : {},
        fileList2: [],

        submitDis:false,
        resetDis: false,
        submitDis2: false,
        resetDis2: false,
        submitDis3: false,
        currentStepSuccess: false,
        cityInfo: CityInfo,
        /** 当前注册用户的id */
        csid: 0,
        /** 店铺id */
        sid: 0,
        active: 0,
        gender:'1',
        shopType: "",
        shopTypes: [
          {
            value: 1,
            label: "衣"
          },{
            value: 2,
            label: "食"
          },{
            value: 3,
            label: "其它"
          }
        ],
        ReginForm: {
          username: '',
          password: '',
          confirmpassword: '',
          tel: '',
          email: '',
          name: ''
        },
        shopForm: {
          shopName: "",
          type: "",
          introduction:"",
          shortIntroduction: "",
          phoneNum: "",
        },
        logining: false,
        rule2:{
          shopName: [
            {
              required: true,
              max: 12,
              min: 2,
              message: '店铺名是必须的',
              trigger: 'blur'
            }
          ],

          introduction:[
            {
              required: true,
              max: 180,
              min: 20,
              message: '店铺详细介绍必须-字数在20个以上，180个以下',
              trigger: 'blur'
            }
          ],
          shortIntroduction: [
            {
              required: true,
              max: 10,
              min: 2,
              message: '店铺简介必须-字数在10个字以内',
              trigger: 'blur'
            }
          ],
          phoneNum: [
            {
              required: true,
              max: 11,
              min: 11,
              message: '店铺关联联系方式必须',
              trigger: 'blur'
            }
          ]
        },
        rule: {
          username: [
            {
              required: true,
              max: 14,
              min: 2,
              message: '用户名是必须的，长度为2-14位',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '密码是必须的！',
              trigger: 'blur'
            }
          ],
          confirmpassword: [
            {
              required: true,
              validator: confirmpasswordCheck,
              trigger: 'blur'
            }
          ],
          tel: [
            {
              required: true,
              validator: telCheck,
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              type: 'email',
              message: '请输入正确的电子邮件格式(xxx@xxx.com)',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              max: 12,
              min: 2,
              message: '昵称是必须的',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      /** 上传成功 */
      uploadSuccess(response, file, fileList){
        console.log(response);
        if(response.result != 200){
          this.$message({
            message: "上传图片失败",
            type:"warning"
          });
        }
      },
      /** 上传失败 */
      uploadFailed(err, file, fileList){
        console.log(err);
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      /** 下一步 */
      next() {
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        let sid = this.sid;
        let type = 1;//商铺
        let attribute = 1;//详情图片
        this.uploadHeaders = {token:token,groupId:groupId,type:type,attribute:attribute,oid:sid};
        if(this.currentStepSuccess == true){
          if(this.active <=2){
            this.active++;
            this.currentStepSuccess = false;
          }else{
            //显示注册成功，并去登录
            this.$message({
              message: "注册成功！"
            });
            this.$router.push({
              path:"./login"
            });
          }
        }else{
          this.$message({
            message: "请完成当前步骤",
            type: "warning"
          });
        }
      },
      /** 提交商铺信息表单 */
      submitShopInfo(){
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        console.log("第二步提交");
        this.$refs.shopForm.validate(valid =>{
            if(valid){
              this.logining = true;
              let _this = this;
              console.log('开始写入后台数据！');
              let rf = this.shopForm;
              let fd = {};
              fd.shopName = rf.shopName;
              fd.shortIntroduction = rf.shortIntroduction;
              fd.introduction = rf.introduction;
              fd.phoneNum = rf.phoneNum;
              fd.type = _this.shopType;
              fd.uid = _this.csid;
              let formData = JSON.stringify(fd);
              $.ajax({
                type: "post",
                datatype: "json",
                crossDomain: true,
                url: "http://localhost:8899/web/log/regshop",
                beforeSend(xhr){
                  xhr.setRequestHeader("token",token);
                  xhr.setRequestHeader("groupId",groupId);
                  xhr.setRequestHeader("content-type","application/json");
                },
                data: formData,
                success: function(data){
                  console.log(data);
                  if(data.result == 200){
                    _this.currentStepSuccess = true;
                    _this.submitDis = true;
                    _this.resetDis = true;
                    _this.logining = false;
                    _this.sid = data.backData;
                    _this.next();
                    _this.$message({
                      message: "请进行下一步操作",
                      type: "info"
                    });
                  }else if(data.result == 10011){
                    _this.$message({
                      message: "店铺名已存在！",
                      type: "warning"
                    });
                    _this.logining = false;
                  }
                },
                error: function(data){
                  console.log(data);
                }
              });
            }
          }
        );
      },
      /** 提交表单 */
      submitUserInfo () {
        this.$refs.ReginForm.validate(valid => {
          if (valid) {
            this.logining = true;
            let _this = this;
            console.log('开始写入后台数据！');
            let rf = this.ReginForm;
            let fd = {};
            fd.accountName = rf.username;
            fd.nickName = rf.name;
            fd.phoneNum = rf.tel;
            fd.passWord = rf.password;
            fd.email = rf.email;
            let formData = JSON.stringify(fd);
            $.ajax({
              type: "post",
              datatype: "json",
              crossDomain: true,
              url: "http://localhost:8899/web/log/regin",
              beforeSend(xhr){
                xhr.setRequestHeader("content-type","application/json");
              },
              data: formData,
              success: function(data){
                console.log(data);
                if(data.result == 200) {
                  console.log("注册成功");
                  _this.submitDis = true;
                  _this.resetDis = true;
                  _this.logining = false;
                  _this.currentStepSuccess = true;
                  _this.$message({
                    message: "请进行下一步操作",
                    type: "info"
                  });
                  localStorage.setItem("i-token",data.backData);
                  localStorage.setItem("roleId","2");
                  //自动跳往下一步
                  _this.next();
                }else if(data.result == 10009){
                  _this.$message({
                    message: "账户名已存在，请重新填写",
                    type: "warning"
                  });
                  _this.logining = false;
                  _this.ReginForm.username = "";
                }
              },
              error: function (data) {
              }
            });
          } else {
            console.log('submit err')
          }
        })
      },
      /** 重置表单 */
      resetUserInfo () {
        this.$refs.ReginForm.resetFields();
      },
      /** 重置店铺信息表单 */
      resetShopInfo(){
        this.$refs.shopForm.resetFields();
      },
      /** 返回登录页面 */
      tologin () {
        this.$router.push('/login')
      },
      /** 最后一步提交 */
      submitEnd(){
        this.$router.push({
          path: "./login"
        });
      }
    }
  }
</script>

<style scoped>

  .register-form{
    align-content: center;
    height: 100%;
    background-image: url("http://pic.criclesh.shop/web-register-back.jpg");
    @include linear-gradient(-160deg,#8492A6,#1F2D3D);
    overflow: hidden;
  }

  .borderItem{
    height: 70%;
  }

  .regform {
    background-color: #324057;
    color: #E5E9F2;
    border:1px solid #29374c;
    margin: 20px auto;
    width: 410px;
    box-shadow: 0 0 10px #B4BCCC;
    padding: 30px 30px 0 30px;
    border-radius: 25px;
  }
  .submitBtn {
    width: 65%;
  }
  .to {
    color: #FA5555;
    cursor: pointer;
  }
</style>
