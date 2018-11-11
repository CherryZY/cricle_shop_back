<template>
  <transition name="tp-ani">
    <div class="mb-container">
      <div class="mb-button-wrap">
        <el-button type="primary" icon="delete" @click="tabDataDelete">删除</el-button>
        <!-- <el-button type="primary" icon="add" @click="tabDataLocked">锁定</el-button> -->
        <div class="mb-search">
          <el-input v-model="input" ref="searchData"  placeholder="请输入账户名进行搜索" ></el-input>
          <el-button type="primary" icon="search" @click="tabDataSearch">搜索</el-button>
        </div>
        <el-button type="primary" icon="refresh fa fa-refresh" @click="hdRefresh">刷新</el-button>
      </div>

      <el-table :data="tabDate"
                border
                style="width: 90%"
                :row-class-name="tableRowClassName"
                v-loading="asyncload"
                highlight-current-row
                @select="tabCurrentChange" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="角色"  filter-placement="bottom-end">
          <template scope="scope">
            <el-tag v-if = "scope.row.roleInfo != null" close-transition>{{scope.row.roleInfo.roleName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账户名"></el-table-column>
        <el-table-column prop="nickName" label="昵称"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="province" label="省"></el-table-column>
        <el-table-column prop="city" label="城市"></el-table-column>
        <el-table-column prop="country" label="区/县"></el-table-column>
        <el-table-column prop="logCount" label="登录次数"></el-table-column>
        <el-table-column prop="utime" label="最后登录时间" sortable></el-table-column>
      </el-table>
      <div class="mb-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="tableSize">
        </el-pagination>
      </div>
    </div>
  </transition>
</template>

<script>

import { mapGetters,mapMutations,mapActions} from 'vuex'

export default {
    data() {
      return {
      	asyncload : true,
        input : '',
        /**搜索数据 */
      	searchData : '',
        currentPage : 1,
        /** 记录删除数据 */
        tabDeleteTempData : [],
        /**即将编辑的数据 */
        tabDeleteTempEdit : '',
        /** 数据长度 */
        tableSize: 0,
        // stateKey : 'ad_async_state',
        /**Table 数据 */
        tabDate: []
      }
    },

    methods:{
    	...mapGetters(['echartloadingTime']),
    	...mapMutations({
    		tabRowsData : 'SETTABLEEDIT',
    		setStates : 'SETSTATE'
    	}),

    	...mapActions({
    		getStates : 'getStateSyncAdminData'
    	}),

    	tableRowClassName(row, index){
	        if (index % 2 == 0 ) {
	          return 'positive-row';
	        }
	    },

	    //新增
      tabDataAdd(){
          this.$router.push({
            path : '/admin/add'
          })
      },

      //编辑
      tabDataEdit(){
        this.tabRowsData( this.tabDeleteTempEdit );
        this.$router.push({
            path : '/admin/list/' + this.tabDeleteTempEdit.id
        })
      },

      //删除
      tabDataDelete() {
        if( this.tabDeleteTempData.length == 0 ){
          this.$message({
            message : '请选择要删除的数据',
            type: 'error'
          })
          return;
        }
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        let dt = JSON.stringify(this.tabDeleteTempData);
        let _this = this;
        this.$confirm('确认要删除' + this.tabDeleteTempData.length + '这组数据？').then(_ => {
            //删除数据操作
            $.ajax({
              type: "post",
              datatype: "json",
              beforeSend: function (xhr) {
                xhr.setRequestHeader("token",token);
                xhr.setRequestHeader("groupId",groupId);
                xhr.setRequestHeader("content-type","application/json");
              },
              data: dt,
              crossDomain: true,
              url: "http://localhost:8899/web/user/delete",
              success: function(data){
                console.log(data);
                if(data.result == 200){
                  _this.$message({
                    message:"删除成功",
                    type: "info"
                  });
                  _this.hdRefresh();
                }else{
                  _this.$message({
                    message: "错误",
                    type: "warning"
                  });
                }
              },
              error: function(data){
                console.log(data);
              }
            });
        }).catch(_ => {console.log(_)});
      },

      /** 搜索 */
      tabDataSearch() {
        let searchData = this.$refs.searchData.value;
        if( searchData.replace(/^\s+|\s+/,'').length == 0 ){
          this.$message({
            showClose:true,
            message: "搜索内容不得全为非法字符",
            type: "warning"
          });
          return ;
        }
        let _this = this;
        this.asyncload = true;
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        $.ajax({
          type: "post",
          datatype: "json",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("token",token);
            xhr.setRequestHeader("groupId",groupId);
          },
          data:{
            key: searchData,
            type: 2
          },
          crossDomain: true,
          url: "http://localhost:8899/web/user/search",
          success: function(data){
            console.log(data);
            if(data.result == 200){
              _this.asyncload = false;
              _this.formateDate(data);
              _this.tabDate = data.backData;
            }else if(data.result == 40010){
              _this.$message({
                showClose: true,
                message: "查询不到数据",
                type:"warning"
              });
              _this.asyncload = false;
            }else if(data.result == 10007){
              _this.message({
                showClose: true,
                message: "参数错误",
                type: "warning"
              });
            }else if(data.result == 10006){
              _this.$router.push({
                path: "./login"
              });
            }else{
              _this.$message({
                showClose: true,
                message:"服务异常",
                type:"warning"
              });
              _this.asyncload = false;
            }
          },
          error: function(data){
            console.log(data);
          }
        });
      },

      /**
       *
       * @description
       */
      handleSizeChange(val) {
        //console.log(`每页 ${val} 条`);
      },

      handleCurrentChange(val) {
        this.currentPage = val;
        this.fetchData();
      },

      tabCurrentChange( selection , Rows) {
        this.tabDeleteTempEdit = Rows;
        if( this.tabDeleteTempData.indexOf(Rows.id ) < 0 ){
          this.tabDeleteTempData.push( Rows.id );
        }else{
          this.tabDeleteTempData.splice( this.tabDeleteTempData.indexOf(Rows.id ) ,1)
        }
      },

      /** 刷新页面 */
      hdRefresh(){
        this.fetchData();
      },

      /**
       * 请求表格数据
       * @description
      */
      fetchData(){
        this.asyncload = true;
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        let _this = this;
        $.ajax({
          type: "post",
          datatype: "json",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("token",token);
            xhr.setRequestHeader("groupId",groupId);
          },
          crossDomain: true,
          url: "http://localhost:8899/web/user/queryAll",
          success: function(data){
            console.log(data);
            if(data.result == 10006){
              _this.$router.push({
                path: "./login"
              });
            }else if(data.result == 200){
              _this.asyncload = false;
              _this.formateDate(data);
              _this.tabDate = data.backData;
              _this.tableSize = data.backData.length;
            }
          },
          error: function(data){
            console.log(data);
          }
        });
      },

      /** 格式化时间 */
      formateDate: function(data){
        /** 转换时间&性别 */
        for(let i = 0;i<data.backData.length;i++){
          data.backData[i].ctime = new Date(data.backData[i].createTime).toLocaleDateString()
                          + "-" + new Date(data.backData[i].createTime).toLocaleTimeString();
          data.backData[i].utime = new Date(data.backData[i].updateTime).toLocaleDateString()
                          + "-" + new Date(data.backData[i].updateTime).toLocaleTimeString();
        }
      }

    },

    mounted(){
      this.$nextTick( ()=>{
        this.fetchData();
      })
    }
}
</script>

<style lang="scss">
  .el-table .positive-row {
    background: #e2f0e4;
  }

  .mb-container{
    min-height: 700px;
    min-width: 1200px;
    margin: 10px;

    .mb-button-wrap{
      padding: 10px;
      background-color: #D3DCE6;

      .el-input{
        width: 200px;
      }
	  }

    .mb-search{
      display: inline-block;
      width: 300px;
      padding-left: 5px;
    }

    .fa{
      font:normal normal normal 14px/1 FontAwesome!important;
    }
}

.mb-pagination{
	padding: 10px;
	text-align: center;
}


</style>
