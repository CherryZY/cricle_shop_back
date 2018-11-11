<template>
	<div class="mb-container">
		<div class="mb-button-wrap">
			<el-button type="primary" icon="delete" @click="tabDataDelete">禁止销售</el-button>
			<div class="mb-search">
				<el-input v-model="input" ref="searchData"  placeholder="请输入姓名进行搜索" ></el-input>
				<el-button type="primary" icon="search" @click="tabDataSearch">搜索</el-button>
			</div>
			<el-button type="primary" icon="refresh fa fa-refresh" @click="hdRefresh">刷新</el-button>
		</div>

   <el-table :data="commDatas"  border style="width: 99.9%"
             :row-class-name="tableRowClassName" v-loading="asyncload"
             highlight-current-row
             @select="tabCurrentChange"
             @click="toDetail">
   		<el-table-column type="selection" width="55"></el-table-column>
	    <el-table-column prop="commodityName" label="商品名称" ></el-table-column>
	    <el-table-column prop="shopName" label="所属商铺名称"></el-table-column>
	    <el-table-column prop="shortIntroduction" label="商品简介" ></el-table-column>
      <el-table-column prop="price" label="价格" style="color:red" sortable></el-table-column>
      <el-table-column prop="inventory" label="库存" sortable></el-table-column>
      <el-table-column prop="sellsCount" label="销量" sortable ></el-table-column>
	    <el-table-column prop="utime" label="更新时间" sortable></el-table-column>
	    <el-table-column prop="ctime" label="创建时间" sortable></el-table-column>
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
      /**商品tabel数据 */
      commDatas:[],
      /**总数 */
      totalSize:0,
      /**loading */
      asyncload: true,
      input: '',
      tableRowClassName:'',
      tabDeleteTempData: []
    }
  },

  methods: {

    handleCurrentChange(){

    },

    /** */
    tabCurrentChange( selection , Rows) {
      this.tabDeleteTempEdit = Rows;
      if( this.tabDeleteTempData.indexOf(Rows.id ) < 0 ){
        this.tabDeleteTempData.push( Rows.id );
      }else{
        this.tabDeleteTempData.splice( this.tabDeleteTempData.indexOf(Rows.id ) ,1)
      }
    },

    /**禁止商品 */
    tabDataDelete(){
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
              url: "http://localhost:8899/web/comm/deleteComm",
              success: function(data){
                console.log(data);
                if(data.result == 200){
                  _this.$message({
                    message:"删除成功",
                    type: "info"
                  });
                  _this.hdRefresh();
                }else if(data.result == 10010){
                  _this.$message({
                    message:"没有权限",
                    type: "info"
                  });
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

    /**详情页 */
    toDetail: function(){
      // this.$router.push({
      //   name: 'generalAdminOrderFlowAdd',
      //   params: {
      //     type: 'add',
      //     templateType: this.orderTemplateType
      //   }
      // })
    },

    /**请求初始数据 */
    fetchData(){
        let _this = this;
        this.asyncload = true;
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        let requestUrl = "";
        if(groupId === "2"){//店主
          requestUrl =  "http://localhost:8899/web/comm/queryBys";
        }else if(groupId === "3"){
          requestUrl =  "http://localhost:8899/web/comm/queryAll"
        }
        $.ajax({
          type: "post",
          datatype: "json",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("token",token);
            xhr.setRequestHeader("groupId",groupId);
          },
          crossDomain: true,
          url: requestUrl,
          data:{
            page: 1,
            size: 10.
          },
          success: function(data){
            console.log(data);
            if(data.result == 200){
              console.log(data);
              _this.asyncload = false;
              _this.formateDate(data);
              _this.commDatas = data.backData;
              _this.totalSize = data.backData.length;
            }else if(data.result == 40010){
              _this.$message({
                showClose: true,
                message: "查询不到数据",
                type:"warning"
              });
              _this.asyncload = false;
            }else if(data.result == 10006){
              _this.$router.push({
                path: "/login"
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
    },

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
