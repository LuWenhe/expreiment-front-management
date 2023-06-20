<template>
  <div id='allLesson'>
    <el-row>
      <h3>实验指导书</h3>
      <el-upload
        list-type='text'
        :action='uploadAttachment'
        :on-preview='handlePreview'
        :on-remove='handleRemove'
        :on-success='handleSuccess'
        :limit='1'
        :on-exceed='handleExceed'
        :file-list='fileList'
        :headers='uploadHeaders'>
        <el-button slot='trigger' type='primary'>上传实验指导书</el-button>
      </el-upload>
      <el-col :span='24' style='width: 100%'>
        <mavon-editor
          v-model='guide_book'
          ref='md'
          class='editor'
          @imgAdd='handleEditorImgAdd'
          @imgDel='handleEditorImgDel'>
        </mavon-editor>
      </el-col>
    </el-row>
    <el-button type='primary' @click='submit' style='margin-bottom: 5%'>提交</el-button>
  </div>
</template>

<script>
import { getGuideBook } from '@/network/api/frontLesson'
import { uploadFile, addSonChapterBook } from '@/network/api/backLesson'

export default {
  inject: ['reload'],
  name: 'ToJupyterPage',
  data() {
    return {
      load: true,
      fileList: [],
      uploadServer: '',
      son_id: '',
      guide_book: '',
      uploadAttachment: '',
      uploadHeaders: {}
    }
  },
  created() {
    this.uploadAttachment = this.$root.URL + '/back/uploadExpBook'
    this.son_id = this.$route.query.son_id
    this.uploadHeaders = { 'token': localStorage.getItem('token'), 'son_id': this.son_id }
    this.getGuideBook()
  },
  methods: {
    handleSuccess(res, file) {
      this.guide_book = file.response.data;
    },
    handleExceed() {
      this.$message.error(`只能选择1个文件`);
    },
    getGuideBook() {
      getGuideBook(this.son_id).then(res => {
        if (res.status === '200') {
          if (res.data.guide_book === null) {
            res.data.guide_book = ''
          }

          this.guide_book = res.data.guide_book
        }
      })
    },
    submit() {
      let sonChapterObj = {
        son_id: this.son_id,
        guide_book: this.guide_book
      }

      addSonChapterBook(sonChapterObj).then(res => {
        if (res.status === '200') {
          this.$message.success('提交成功')
          this.reload()
        }
      })
    },
    handleEditorImgAdd(pos, $file) {
      let formData = new FormData()
      formData.append('file', $file)

      uploadFile(formData).then(res => {
        if (res.status === '200') {
          this.$refs.md.$img2Url(pos, res.data)
        } else {
          this.$message.error('error')
        }
      })
    },
    handleEditorImgDel(pos) {
      delete this.imgFile[pos]
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    uploadFile(file) {
      this.file_form = new FormData()
      this.file_form.append('file', file.file)
      this.file_form.append('son_id', this.son_id)
    }
    // submitUpload() {
    //   this.$refs.uploadJupyterFile.submit()
    //   post(this.uploadServer, this.file_form, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       'token': localStorage.getItem('token')
    //     }
    //   }).then((res) => {
    //     if (res.status === '200') {
    //       this.$message.success('上传成功')
    //       this.$router.push({ name: 'lessonIndex' })
    //     } else {
    //       this.$message.error('上传失败')
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //   })
    // }
  },
  watch: {
    '$route.query.son_id': {
      handler(newVal, oldVal) {
        //判断newVal有没有值监听路由变化
        this.son_id = newVal;
        this.getGuideBook();
      },
      deep: true
    }
  }
};
</script>

<style>
#allLesson {
  width: 90%;
  height: 100%;
  margin-left: 5%;
  margin-top: 1%;

}

.el-upload--text {
  width: 120px;
  height: 33px;
  border: none;
}
</style>
