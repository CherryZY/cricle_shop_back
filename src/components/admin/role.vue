<template>
  <transition name="tp-ani">

    <div class="mb-container">

      <div class="mb-button-wrap">
        <el-button type="primary" icon="add" @click="tabDataAdd">新增</el-button>
        <!-- <el-button type="primary" icon="edit" @click="tabDataEdit">编辑</el-button> -->
        <el-button type="primary" icon="delete" @click="tabDataDelete">移除</el-button>
        <!-- <el-button type="primary" icon="add" @click="tabDataLocked">锁定</el-button> -->
        <div class="mb-search">
          <el-input v-model="input" ref="searchData"  placeholder="请输入角色名进行搜索" ></el-input>
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
        <el-table-column prop="roleName" label="角色名"></el-table-column>
        <el-table-column prop="ctime" label="创建时间"></el-table-column>
        <el-table-column prop="utime" label="更新时间"></el-table-column>
        <el-table-column></el-table-column>
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

export default {
  data(){
    return{
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

  mounted(){
    this.$nextTick( ()=>{
        this.fetchData();
    })
  },

  methods:{

    tableRowClassName(row, index){
	      if (index % 2 == 0 ) {
	        return 'positive-row';
        }
   },

    /** 监控tab变化 */
    tabCurrentChange: function(){

    },

    /** 刷新 */
    hdRefresh: function(){
      let token = localStorage.getItem('i-token');
      let roleId = localStorage.getItem('roleId');

    },

    /** 删除 */
    tabDataDelete: function(){
      let token = localStorage.getItem('i-token');
      let roleId = localStorage.getItem('roleId');

    },

    /**新增 */
    tabDataAdd: function(){
      let token = localStorage.getItem('i-token');
      let roleId = localStorage.getItem('roleId');

    },

    /**搜索 */
    tabDataSearch:function(){
      let token = localStorage.getItem('i-token');
      let roleId = localStorage.getItem('roleId');
      let search = this.$ref.searchData.value;

    },

    /** 请求表格初始数据 */
    fetchData: function(){
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
        url: "http://localhost:8899/web/role/queryAll",
        success: function(data){
          console.log(data);
          if(data.result == 200){
            _this.formateDate(data);
            _this.tabDate = data.backData;
            _this.asyncload = false;
            _this.tableSize = data.backData.length;
          }else if(data.result == 10006){
            _this.$message({
              message: "登录已过期",
              type: "info"
            });
            _this.$router.push({
              path: "./login"
            });
          }
        },
        error: function(data){
          console.log(data);
          _this.$router.push({
              path: "./login"
          });
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
    },

    handleSizeChange: function(){
    },

    handleCurrentChange(val) {
        this.currentPage = val;
        this.fetchData();
    },

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

