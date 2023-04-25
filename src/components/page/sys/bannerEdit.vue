<template>
  <div>
    <el-form>
      <el-row>
        <el-col :span='8'>
          <el-form-item label='轮播图片'>
            <img :src=data.banner_url alt='' style='height:5rem;width:5rem;'>

            <el-upload
              ref='uploadPic'
              :http-request='uploadFile'
              :on-preview='handlePreview'
              :on-remove='handleRemove'
              :file-list='fileList'
              :auto-upload='false'
              :limit='1'
              accept='image/gif,image/jpeg,image/jpg,image/png,image/svg'
            >
              <i class='el-icon-plus'></i>
              <div slot='tip' class='el-upload__tip'>只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <el-button style='margin-left: 10px;' type='success' @click='submitUpload'>上传到服务器</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      fileList: []
    };
  },
  methods: {

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadFile(file) {
      console.log(file.file);
      this.pic_form = new FormData();
      this.pic_form.append('file', file.file);
    },
    submitUpload() {
      this.$refs.uploadPic.submit();
      axios.post(this.$root.URL + '/manage/upload_small_pic', this.pic_form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('token')
        }
      }).then((res) => {
        if (res.data.code === '200') {
          this.data.banner_url = res.data.data;
        } else {
          this.$message.error('error');
        }
      }).catch((err) => {
        console.log('上传错误');
        console.log(err);
      });

    }

    // handleEditorImgAdd (pos, $file) {
    //   // const blob = this.dataURItoBlob($file.miniurl)
    //   const formData = new FormData()
    //   formData.append('file', $file)
    //   axios.post('http://localhost:8988/manage/upload_small_pic', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'token':localStorage.getItem("token"),
    //     }
    //   }).then((res) => {
    //     if(res.data.code === '200'){
    //       //this.pic_suolue = res.data.data
    //       this.$refs.md.$img2Url(pos, res.data.data)
    //     }else {
    //       this.$message.error("error")
    //     }
    //   }).catch((err) => {
    //     console.log('上传错误')
    //     console.log(err)
    //   })
    // },
    // handleEditorImgDel (pos) {
    //   delete this.imgFile[pos]
    // },
  }


};
</script>
<style>

</style>
