<template>
	<div class="mb-container" width="80%">
		<div class="mb-button-wrap">
			<el-button type="primary" icon="delete" @click="tabDataDelete">删除</el-button>
      <el-button type="primary" icon="refresh fa fa-refresh" @click="hdRefresh">刷新</el-button>
			<div class="mb-search">
				<el-input v-model="input" ref="searchData"  placeholder="请输入商铺名进行搜索" ></el-input>
				<el-button type="primary" icon="search" @click="tabDataSearch">搜索</el-button>
			</div>
		</div>

   <el-table :data="shopData"  border style="width: 99%" :row-class-name="tableRowClassName"
             v-loading="asyncload"
             highlight-current-row
             @select="tabCurrentChange"
             @click="toDetail">
   		<el-table-column type="selection" width="55"></el-table-column>
	    <el-table-column prop="id" label="ID"  sortable></el-table-column>
	    <el-table-column prop="ctime" label="注册时间"></el-table-column>
      <el-table-column prop="utime" label="更新时间"></el-table-column>
	    <el-table-column prop="shopName" label="店铺名称"></el-table-column>
	    <el-table-column prop="phoneNum" label="联系方式"  ></el-table-column>
	    <el-table-column prop="shortIntroduction" label="简介"></el-table-column>
      <el-table-column prop="accountName" label="归属账户名"></el-table-column>
      <el-table-column prop="sellsCount" label="销量"></el-table-column>
	    <el-table-column prop="starLevel"  label="店铺等级"  filter-placement="bottom-end">
        <template scope="scope">
          <el-rate
            v-model="scope.row.starLevel"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>
        </template>
	    </el-table-column>
  </el-table>

  <div class="mb-pagination">
  	<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>
  </div>
</div>
</template>


<script>

export default {
  data(){
    return{
      currentPage: 1,
      totalSize: 0,
      shopData:[],
      asyncload: false,
      tableRowClassName:"",
      input:'',
      tabDeleteTempData: []
    }
  },

  methods:{

    /** 编辑-row */
    handleEdit(){},

    /** 删除-row */
    handleDelete(index,row){
      console.log(index + "--" + row);
    },

    /** 详情 */
    toDetail(){
      let token = localStorage.getItem("i-token");
      let groupId = localStorage.getItem("roleId");
    },

    /**编辑 */
    tabDataEdit(){},


    /**删除 */
    tabDataDelete(){
        if( this.tabDeleteTempData.length == 0 ){
          this.$message({
            message : '请选择要删除的数据',
            type: 'error'
          });
          return;
        }
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        let dt = JSON.stringify(this.tabDeleteTempData);
        let _this = this;
        this.$confirm('确认要删除' + this.tabDeleteTempData.length + '这组数据？').then(_=> {
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
              url: "http://localhost:8899/web/shop/delete",
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

    /**搜索 */
    tabDataSearch(){
        let searchData = this.$refs.searchData.value;
        if(searchData == ""){
          this.hdRefresh();
        }
        if( searchData.replace(/^\s+|\s+/,'').length == 0 ){
          this.$message({
            showClose:true,
            message: "搜索内容不得全为非法字符",
            type: "warning"
          });
          return;
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
          crossDomain: true,
          url: "http://localhost:8899/web/shop/search",
          data:{
            key: searchData,
            page: 1,
            size: 10
          },
          success: function(data){
            console.log(data);
            if(data.result == 200){
              _this.asyncload = false;
              _this.formateDate(data);
              _this.shopData = data.backData;
              _this.totalSize = data.backData.length;
            }else if(data.result == 40010){
              _this.$message({
                showClose: true,
                message: "查询不到数据",
                type:"warning"
              });
              _this.asyncload = false;
            }else if(data.result == 10010){
              console.log(data);
            }else{
              _this.$router.push({
                path: "./login"
              });
            }
          },
          error: function(data){
            console.log(data);
          }
        });
    },

    handleSizeChange(){},

    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },

    /** tab变化 */
    tabCurrentChange( selection , Rows) {
      this.tabDeleteTempEdit = Rows;
      if( this.tabDeleteTempData.indexOf(Rows.id ) < 0 ){
        this.tabDeleteTempData.push( Rows.id );
      }else{
        this.tabDeleteTempData.splice( this.tabDeleteTempData.indexOf(Rows.id ) ,1)
      }
    },


    hdRefresh(){
      this.fetchData();
    },

    /** 请求数据  */
    fetchData: function(){
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
          crossDomain: true,
          url: "http://localhost:8899/web/shop/queryAll",
          data:{
            page: 1,
            size: 10
          },
          success: function(data){
            console.log(data);
            if(data.result == 200){
              _this.asyncload = false;
              _this.formateDate(data);
              _this.shopData = data.backData;
              _this.totalSize = data.backData.length;
            }else if(data.result == 40010){
              _this.$message({
                showClose: true,
                message: "查询不到数据",
                type:"warning"
              });
              _this.asyncload = false;
            }else if(data.result == 10010){
              console.log(data);
            }else{
              _this.$router.push({
                path: "./login"
              });
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

