<template>
  <el-row class='lesson-add-container'>
    <el-row class='lesson-add-title'>
      <span class='big-title'>新增课程</span>
    </el-row>
    <el-form class='lesson-add-content' :model='lesson' :rules='rules' ref='submit'>
      <!-- 第一行 -->
      <el-row class='content-row'>
        <!-- 第一列 -->
        <el-row class='content-row-left'>
          <el-row class='content-row-left-left'>
            <span>课程图片：</span>
            <el-upload
              class='content-row-left-left'
              :class='{hide:hideUpload}'
              list-type='picture-card'
              action=''
              :on-remove='handleRemove'
              :before-upload='beforeAvatarUpload'
              :limit='imgLimit'
              :on-exceed='handleExceed'
              :file-list='fileListFront'
              :http-request='uploadFile'
            >
              <i class='el-icon-plus'></i>
            </el-upload>
          </el-row>
          <el-row class='content-row-left-right'>
            <el-row class='difficulty-group'>
              <span>难易程度：</span>
              <el-form-item prop='difficulty'>
                <el-radio-group v-model='lesson.difficulty'>
                  <el-radio :label='1'>简单</el-radio>
                  <el-radio :label='2'>中等</el-radio>
                  <el-radio :label='3'>困难</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
          </el-row>
        </el-row>
        <!-- 第二列 -->
        <el-row class='content-first-row-right'>
          <!-- 第二列第一行 -->
          <el-row class='teacher-and-lesson'>
            <el-row class='content-row-right-left'>
              <span class='title'>教师：</span>
              <el-form-item prop='teacher_name'>
                <el-autocomplete
                  popper-class='my-autocomplete'
                  v-model='lesson.teacher_name'
                  :fetch-suggestions='querySearch'
                  placeholder='请输入老师姓名'
                  @select='handleSelect'
                >
                  <i class='el-icon-edit el-input__icon' slot='suffix' @click='handleIconClick'></i>
                  <template slot-scope='{ item }'>
                    <div class='name'>{{ item.username }}</div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-row>
            <el-row class='content-row-right-right'>
              <span class='title'>课程名称：</span>
              <el-form-item prop='lesson_name'>
                <el-input placeholder='课程名称' v-model='lesson.lesson_name'></el-input>
              </el-form-item>
            </el-row>
          </el-row>
          <!-- 第二列第二行 -->
          <el-row class='hours-and-credits'>
            <el-row class='content-row-right-left'>
              <span class='title'>学时：</span>
              <el-form-item prop='learn_time'>
                <el-input placeholder='学时' v-model='lesson.learn_time'></el-input>
              </el-form-item>
            </el-row>
            <el-row class='content-row-right-right'>
              <span class='title'>学分：</span>
              <el-form-item prop='learn_credit'>
                <el-input placeholder='学分' v-model='lesson.learn_credit'></el-input>
              </el-form-item>
            </el-row>
          </el-row>
        </el-row>
      </el-row>
      <!-- 第二行 -->
      <el-row class='content-row'>
        <el-row class='content-row-left'>
          <span class='content-row-left-left2'>tags</span>
          <el-select
            class='content-row-left-right2'
            v-model='lesson.tags'
            multiple
            filterable
            allow-create
            default-first-option
            placeholder='请选择标签'
          >
            <el-option
              v-for='item in options'
              :key='item.value'
              :label='item.label'
              :value='item.value'>
            </el-option>
          </el-select>
        </el-row>
        <el-row class='content-row-right'>
          <span class='content-row-right-left2'>适合人群</span>
          <el-input class='content-row-right-right2' placeholder='适合人群'
                    v-model='lesson.suitablePerson'></el-input>
        </el-row>
      </el-row>
      <!-- 第三行 -->
      <el-row class='content-row'>
        <el-row class='content-row-left'>
          <span class='content-row-left-left2'>大纲</span>
          <el-input class='content-row-left-right2' type='textarea' placeholder='请输入大纲'
                    v-model='lesson.dagang'></el-input>
        </el-row>
        <el-row class='content-row-right'>
          <span class='content-row-right-left2'>可以学到的知识</span>
          <el-input class='content-row-right-right2' type='textarea' placeholder='可以学到的知识'
                    v-model='lesson.canLearn'></el-input>
        </el-row>
      </el-row>
      <!-- 第四行 -->
      <el-row class='content-row'>
        <el-row class='content-row-left'>
          <span class='content-row-left-left2'>参考资料</span>
          <el-input class='content-row-left-right2' type='textarea' placeholder='参考资料'
                    v-model='lesson.cankao'></el-input>
        </el-row>
        <el-row class='content-row-right'>
          <span class='content-row-right-left2'>目标</span>
          <el-input class='content-row-right-right2' type='textarea' placeholder='目标'
                    v-model='lesson.goal'></el-input>
        </el-row>
      </el-row>
      <!-- 第五行 -->
      <el-row class='content-row-introduction'>
        <span class='title'>简介</span>
        <mavon-editor
          ref='md'
          class='editor'
          v-model='lesson.description'
          @imgAdd='handleEditorImgAdd'
          @imgDel='handleEditorImgDel'>
        </mavon-editor>
      </el-row>
      <el-row class='submit-btn'>
        <el-button v-if='isAddLesson' type='primary' @click='toAddChapterInfo'>添加章节信息</el-button>
        <el-button v-else type='primary' @click='submit'>提交</el-button>
      </el-row>
    </el-form>
  </el-row>
</template>

<script>
import { bNumberCheck } from '@/utils/validator'
import { addLesson, uploadFile } from '@/network/api/backLesson'
import { loadAllTeachers } from '@/network/api/user'
import { getTags } from '@/network/api/tag'
import { getFormData } from '@/utils/fileUtils'

const validatorLearnTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入学时'))
  } else {
    if (bNumberCheck(value)) {
      callback()
    } else {
      return callback(new Error('输入不正确'))
    }
  }
}

const validatorLearnCredit = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入学分'))
  } else {
    if (bNumberCheck(value)) {
      callback();
    } else {
      return callback(new Error('输入不正确'))
    }
  }
}

export default {
  name: 'AddLesson',
  data() {
    return {
      rules: {
        difficulty: [
          { required: true, message: '请选择困难程度', trigger: 'blur' }
        ],
        teacher_name: [
          { required: true, message: '请输入老师姓名', trigger: 'blur' }
        ],
        learn_time: [
          { validator: validatorLearnTime, required: true, trigger: 'blur' }
        ],
        lesson_name: [
          { required: true, message: '请输入课程名', trigger: 'blur' }
        ],
        learn_credit: [
          { validator: validatorLearnCredit, required: true, trigger: 'blur' }
        ]
      },
      activeName: 'first',
      imageUrl: '',
      tempUrl: '',
      imgLimit: 1, // 上传照片数
      fileListFront: [], // 照片列表
      hideUpload: false,
      radio: 1,
      options: [],
      value: [],
      lesson: {
        pic_url: '',
        lesson_name: '',
        difficulty: '',
        teacher_name: '',
        learn_time: '',
        learn_credit: '',
        tags: [],
        suitablePerson: '',
        canLearn: '',
        description: '',
        dagang: '',
        cankao: '',
        goal: '',
        teacherId: ''
      },
      lesson_id: '',
      isAddLesson: false,
      tabIndex: '',
      teachers: []
    }
  },
  created() {
    this.isAddLesson = false
    this.getTags()
    this.loadAll()
  },
  methods: {
    querySearch(queryString, cb) {
      let teachers = this.teachers
      let results = queryString ? teachers.filter(this.createFilter(queryString)) : teachers
      cb(results)
    },
    createFilter(queryString) {
      return (teacher) => {
        return (teacher.username.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.lesson.teacher_name = item.username
      let userData = JSON.parse(localStorage.getItem('userData'))
      this.lesson.teacherId = userData.userId
    },
    handleIconClick(ev) {

    },
    loadAll() {
      loadAllTeachers().then(res => {
        if (res.status === '200') {
          this.teachers = res.data
        }
      })
    },
    getTags() {
      getTags().then(res => {
        if (res.status === '200') {
          let tagList = res.data
          let tagOption = []

          tagList.forEach(item => {
            let tagObj = {}
            tagObj.value = item.tagName
            tagObj.label = item.tagName
            tagOption.push(tagObj)
          })

          this.options = tagOption
        }
      })
    },
    uploadFile(params) {
      let formData = getFormData(params)

      uploadFile(formData).then(res => {
        if (res.status === '200') {
          this.$message.success('上传图片成功!')
          this.lesson.pic_url = res.data
        }
      })
    },
    submit() {
      if (this.isAddLesson) {
        this.$message.error('已经添加了,不要重复点击提交')
      } else {
        this.$refs.submit.validate(valid => {
          if (valid) {
            addLesson(this.lesson).then(res => {
              if (res.status === '200') {
                this.isAddLesson = true
                this.$message.success('添加课程成功!')
                this.$router.push('/lessonManage')
              }
            })
          } else {
            this.$message.error('请输入必填项')
          }
        })
      }
    },
    toAddChapterInfo() {
      this.$router.push({ name: 'editLesson', query: { lessonId: this.lesson_id } })
    },
    handleClick(tab, event) {
      this.tabIndex = tab.index
    },
    handleRemove(file, fileList) {
      this.fileListFront.some((item, i) => {
        if (item.name === file.name) {
          this.fileListFront.splice(i, 1)
          return true
        }
      })
      this.hideUpload = fileList.length >= this.imgLimit
      this.lesson.pic_url = ''
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('仅支持jpg，png格式的图片！')
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.lesson.pic_url = file.response.data
      this.fileListFront.push(file)
      this.hideUpload = true
    },
    handleExceed() {
      this.$message.error(`只能选择${this.imgLimit}个文件`)
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
    }
  }
}
</script>

<style scoped>
.lesson-add-container {
  background-color: #FFF;
  padding: 20px;
  height: 100%;
}

.lesson-add-content {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
}

.lesson-add-title {
  margin-bottom: 20px;
}

.lesson-add-title .big-title {
  font-size: 30px;
  font-weight: bold;
}

.content-row {
  display: flex;
  margin-bottom: 20px;
}

.content-row-left, .content-row-right,
.content-row-left-left, .content-row-left-right,
.content-row-right-left, .content-row-right-right {
  display: flex;
  flex: 1;
  align-items: center;
}

.content-row-left-left2 {
  display: flex;
  width: 10%;
}

.content-row-right-left2 {
  display: flex;
  width: 15%;
}

.content-row-left-right2 {
  display: flex;
  width: 85%;
}

.content-row-right-right2 {
  display: flex;
  width: 85%;
}

.difficulty-group {
  align-items: center;
}

.content-first-row-right {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.teacher-and-lesson, .hours-and-credits {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 0;
}

.editor {
  margin-top: 10px;
}

.submit-btn {
  margin-top: 10px;
}
</style>
