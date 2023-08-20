<template>
  <el-row id='allLesson'>
    <el-row>
      <h3>实验指导书</h3>
      <el-upload
        list-type='text'
        action=''
        :on-remove='handleRemove'
        :limit='1'
        :before-upload='beforeFileUpload'
        :on-exceed='handleExceed'
        :file-list='fileList'
        :http-request='parseJupyter'
      >
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
  </el-row>
</template>

<script>
import { getGuideBook } from '@/network/api/frontLesson'
import { uploadFile, addSonChapterBook, parseJupyter } from '@/network/api/backLesson'
import { getFormData } from '@/utils/fileUtils'

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
    }
  },
  created() {
    this.son_id = this.$store.state.sonId
    this.getGuideBook()
  },
  methods: {
    parseJupyter(params) {
      let formData = getFormData(params)

      parseJupyter(formData).then(res => {
        if (res.status === '200') {
          this.guide_book = res.data
        }
      })
    },
    handleExceed() {
      this.$message.error(`只能选择1个文件`);
    },
    getGuideBook() {
      let sonId = this.$store.state.sonId

      getGuideBook(sonId).then(res => {
        if (res.status === '200') {
          if (res.data.guide_book === null) {
            res.data.guide_book = ''
          }

          this.guide_book = res.data.guide_book
        }
      })
    },
    submit() {
      let sonId = this.$store.state.sonId

      let sonChapterObj = {
        son_id: sonId,
        guide_book: this.guide_book
      }

      addSonChapterBook(sonChapterObj).then(res => {
        if (res.status === '200') {
          this.$message.success('提交成功')
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

    },
    beforeFileUpload(file) {
      let fileName = file.name
      let isJupyter = fileName.indexOf('.ipynb') > 0

      if (!isJupyter) {
        this.$message.error('仅支持上传.ipynb文件')
        return false
      }

      return isJupyter
    },
    uploadFile(file) {
      this.file_form = new FormData()
      this.file_form.append('file', file.file)
      this.file_form.append('son_id', this.$store.state.sonId)
    }
  },
  watch: {
    '$route.query.son_id': {
      handler(newVal, oldVal) {
        //判断newVal有没有值监听路由变化
        this.son_id = newVal
        this.getGuideBook()
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
