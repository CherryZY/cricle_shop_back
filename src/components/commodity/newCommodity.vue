<template>
  <div class="newCommform">
    <el-upload
      :on-error="uploadFailed"
      class="avatar-uploader"
      action="http://localhost:8899/web/load/up"
      :show-file-list="false"
      :headers = "uploadHeaders"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-form ref="form" :model="form" label-width="80px" >
      <el-form-item label="商品名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="商品种类">
        <el-select v-model="form.region" placeholder="请选择商品种类">
          <el-option label="其他" value="3"></el-option>
          <el-option label="食品" value="2"></el-option>
          <el-option label="服饰" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="price" style="width:100px " maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="库存">
        <el-input-number v-model="inventory" :step="2"></el-input-number>
      </el-form-item>
      <el-form-item label="商品简介">
        <el-input type="textarea" v-model="shortIntroduction"></el-input>
      </el-form-item>
      <el-form-item label = "商品详情">
        <el-input type="textarea"
                  rows=3
                  v-model="introduction"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>


<script>
  export default {
    data() {
      return {
        uploadHeaders: {},
        imageUrl: '',
        form: {
          inventory: 0,
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {

      /** 上传失败 */
      uploadFailed(err, file, fileList){
        console.log(err);
      },

      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },

      beforeAvatarUpload(file) {
        let token = localStorage.getItem("i-token");
        let groupId = localStorage.getItem("roleId");
        this.uploadHeaders = {token:token,groupId:groupId,type:type,attribute:attribute,oid:sid};
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>

<style lang="scss">
  .newCommform{
    padding-left: 20%;
    margin-top: 10%;
    height: 100%;
    width: 60%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
