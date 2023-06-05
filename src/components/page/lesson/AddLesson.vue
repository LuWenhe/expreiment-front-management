<template>
  <div class='firstCard'>
    <br>
    <h1>&nbsp;&nbsp;&nbsp;新增课程</h1>
    <br>
    <el-form :model='lesson' :rules='rules' ref='submit'>
      <el-row :gutter='20' style='margin-left: 5%'>
        <el-col :span='6'>
          <el-upload
            :class='{hide:hideUpload}'
            list-type='picture-card'
            :action='uploadImgServer'
            :on-preview='handlePictureCardPreview'
            :on-remove='handleRemove'
            :on-success='handleAvatarSuccess'
            :before-upload='beforeAvatarUpload'
            :limit='imgLimit'
            :on-exceed='handleExceed'
            :file-list='fileListFront'
            :headers='uploadHeaders'>
            <i class='el-icon-plus'></i>
          </el-upload>
        </el-col>
        <el-col :span='6'>
          <span>难易程度</span>
          <br> <br>
          <el-form-item prop='difficulty'>
            <el-radio-group v-model='lesson.difficulty'>
              <el-radio :label='1'>简单</el-radio>
              <el-radio :label='2'>中等</el-radio>
              <el-radio :label='3'>困难</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-row>
            <el-col>
              <span>教师</span>
              <br>
              <br>
              <el-form-item prop='teacher_name'>
                <el-autocomplete
                  popper-class='my-autocomplete'
                  v-model='lesson.teacher_name'
                  :fetch-suggestions='querySearch'
                  placeholder='请输入老师姓名'
                  @select='handleSelect'
                  style='width: 200px'>
                  <i class='el-icon-edit el-input__icon' slot='suffix' @click='handleIconClick'></i>
                  <template slot-scope='{ item }'>
                    <div class='name'>{{ item.username }}</div>
                  </template>
                </el-autocomplete>


              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col>
              <span>学时</span>
              <br>
              <br>
              <el-form-item prop='learn_time'>

                <el-input placeholder='学时' style='width: 200px' v-model='lesson.learn_time'></el-input>
              </el-form-item>

            </el-col>
          </el-row>
        </el-col>
        <el-col :span='6'>
          <el-row>
            <el-col>
              <span>课程名称</span>
              <br>
              <br>
              <el-form-item prop='lesson_name'>

                <el-input placeholder='课程名称' style='width: 200px' v-model='lesson.lesson_name'></el-input>
              </el-form-item>

            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col>
              <span>学分</span>
              <br>
              <br>
              <el-form-item prop='learn_credit'>
                <el-input placeholder='学分' style='width: 200px' v-model='lesson.learn_credit'></el-input>
              </el-form-item>

            </el-col>
          </el-row>

        </el-col>
      </el-row>
      <br>
      <br>
      <el-row style='margin-left: 5%'>
        <el-col :span='12'>
          <span>tags</span>
          <br><br>
          <el-select
            style='width: 90%'
            v-model='lesson.tags'
            multiple
            filterable
            allow-create
            default-first-option
            placeholder='请选择标签'>
            <el-option
              v-for='item in options'
              :key='item.value'
              :label='item.label'
              :value='item.value'>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span='12'>
          <span>适合人群</span>
          <br>
          <br>
          <el-input placeholder='适合人群' style='width: 90%' v-model='lesson.suitablePerson'></el-input>

        </el-col>
      </el-row>
      <br>
      <br>
      <el-row style='margin-left: 5%'>
        <el-col :span='12'>
          <span>大纲</span>
          <el-input style='width: 90%' type='textarea' :rows='3' placeholder='请输入大纲'
                    v-model='lesson.dagang'></el-input>
        </el-col>
        <el-col :span='12'>
          <span>可以学到的知识</span>
          <br><br>
          <el-input style='width:90%' type='textarea' :rows='3' placeholder='可以学到的知识'
                    v-model='lesson.canLearn'></el-input>
        </el-col>
      </el-row>
      <br>
      <br>
      <el-row style='margin-left: 5%'>
        <el-col :span='12'>
          <span>参考资料</span>
          <el-input style='width: 90%' type='textarea' :rows='3' placeholder='参考资料' v-model='lesson.cankao'>
          </el-input>
        </el-col>
        <el-col :span='12'>
          <span>目标</span>
          <br><br>
          <el-input style='width: 90%' type='textarea' :rows='3' placeholder='目标' v-model='lesson.goal'>
          </el-input>
        </el-col>
      </el-row>
      <br>
      <br>
      <el-row style='margin-left: 5%'>
        <span>简介</span>
        <br> <br>
        <el-col :span='24' style='width: 95%'>
          <el-form-item prop='description'>
            <mavon-editor v-model='lesson.description' ref='md' class='editor' @imgAdd='handleEditorImgAdd'
                          @imgDel='handleEditorImgDel'>
            </mavon-editor>
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <div v-if='isAddLesson'>
        <el-button type='primary' style='margin-left: 5%' @click='toAddChapterInfo'>去添加章节信息</el-button>
      </div>
      <div v-else>
        <el-button type='primary' style='margin-left: 5%' @click='submit'>提交</el-button>
      </div>
      <br>
      <br>
      <br>
    </el-form>
  </div>
</template>
<script>
import { bNumberCheck } from '@/utils/validator'
import ChapterAdd from '@/components/page/lesson/ChapterAdd'
import { addLesson, addLessonPic, getOptionList } from '@/api/backLesson'
import { loadAllTeachers } from '@/api/user'

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
};

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
};
export default {
  components: { ChapterAdd },
  data() {
    return {
      rules: {
        difficulty: [{ required: true, message: '请选择困难程度', trigger: 'blur' }],
        teacher_name: [{ required: true, message: '请输入老师姓名', trigger: 'blur' }],
        learn_time: [{ validator: validatorLearnTime, required: true, trigger: 'blur' }],
        lesson_name: [{ required: true, message: '请输入课程名', trigger: 'blur' }],
        learn_credit: [{ validator: validatorLearnCredit, required: true, trigger: 'blur' }]
      },
      uploadHeaders: { 'token': localStorage.getItem('token') },
      activeName: 'first',
      imageUrl: '',
      tempUrl: '',
      uploadImgServer: '',
      imgLimit: 1, // 上传照片数
      fileListFront: [], // 照片列表
      hideUpload: false,
      radio: 1,
      options: [
        {
          value: 'AI',
          label: 'AI类课程'
        }, {
          value: 'qixiang',
          label: '气象类课程'
        }, {
          value: 'soft',
          label: '开发类课程'
        }, {
          value: 'other',
          label: '其他类课程'
        }],
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
        goal: ''

      },
      lesson_id: '',
      isAddLesson: false,
      tabIndex: '',
      teachers: []

    };
  },
  created() {
    this.isAddLesson = false
    this.uploadImgServer = this.$root.URL + '/lesson/addLessonPic'
    this.getOptionList()
  },
  mounted() {
    this.teachers = this.loadAll()
  },
  methods: {
    //------------------------------------加载老师姓名开始-------------------
    querySearch(queryString, cb) {
      var teachers = this.teachers;
      var results = queryString ? teachers.filter(this.createFilter(queryString)) : teachers;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (teacher) => {
        return (teacher.username.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.lesson.teacher_name = item.username;
    },
    handleIconClick(ev) {

    },
    async loadAll() {
      loadAllTeachers().then(res => {
        if (res.data.code === '200') {
          this.teachers = res.data.data
        }
      })
    },
    getOptionList() {
      getOptionList().then(res => {
        if (res.data.code === '200') {
          this.options = res.data.data
        }
      })
    },
    submit() {
      if (this.isAddLesson) {
        this.$message.error('已经添加了,不要重复点击提交');
      } else {
        this.$refs.submit.validate(valid => {
          if (valid) {
            addLesson(this.lesson).then(res => {
              if (res.data.code === '200') {
                this.$message.success('添加课程成功!')
                this.isAddLesson = true
                this.lesson_id = res.data.data
              }
            })
          } else {
            this.$message.error('请输入必填项')
          }
        })
      }
    },
    toAddChapterInfo() {
      this.$router.push({ name: 'editLesson', query: { lessonId: this.lesson_id } });
    },
    handleClick(tab, event) {
      console.log(tab.index)
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
      const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('仅支持jpg，png格式的图片！');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    /**上传成功后的钩子函数 */
    handleAvatarSuccess(res, file) {
      this.lesson.pic_url = file.response.data;
      this.fileListFront.push(file);
      this.hideUpload = true;
    },
    /**查看图片 */
    handlePictureCardPreview(file) {

    },
    /**文件超出个数限制时的钩子 */
    handleExceed() {
      this.$message.error(`只能选择${this.imgLimit}个文件`);
    },
    handleEditorImgAdd(pos, $file) {
      let formData = new FormData()
      formData.append('file', $file)
      console.log(formData)

      addLessonPic(formData).then(res => {
        if (res.data.code === '200') {
          this.$refs.md.$img2Url(pos, res.data.data);
        } else {
          this.$message.error('error');
        }
      })
    },
    handleEditorImgDel(pos) {
      delete this.imgFile[pos]
    }
  }
};
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}

.firstCard {
  background-color: white;
  height: auto;

}

.secondCard {
  background-color: white;
  height: auto;
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
