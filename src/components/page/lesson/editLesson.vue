<template>
  <el-tabs v-model='activeName' @tab-click='handleClick'>
    <el-tab-pane label='基本信息' name='first'>
      <div class='firstCard'>
        <br>
        <h1>&nbsp;&nbsp;&nbsp;编辑课程</h1>
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
                :headers='uploadHeaders'

              >
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
                    <!--                                <el-input placeholder='请输入老师姓名' v-model='lesson.teacher_name' style='width: 200px'></el-input>-->
                    <el-autocomplete
                      popper-class='my-autocomplete'
                      v-model='lesson.teacher_name'
                      :fetch-suggestions='querySearch'
                      placeholder='请输入老师姓名'
                      @select='handleSelect'
                      style='width: 200px'
                    >
                      <i
                        class='el-icon-edit el-input__icon'
                        slot='suffix'
                        @click='handleIconClick'>
                      </i>
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
              <br><br>
              <el-input
                style='width: 90%'
                type='textarea'
                :rows='3'
                placeholder='请输入大纲' v-model='lesson.dagang'>
              </el-input>
            </el-col>
            <el-col :span='12'>
              <span>可以学到的知识</span>
              <br><br>
              <el-input
                style='width:90%'
                type='textarea'
                :rows='3'
                placeholder='可以学到的知识' v-model='lesson.canLearn'>
              </el-input>

            </el-col>
          </el-row>
          <br>
          <br>
          <el-row style='margin-left: 5%'>
            <el-col :span='12'>
              <span>参考资料</span>
              <br><br>
              <el-input
                style='width: 90%'
                type='textarea'
                :rows='3'
                placeholder='参考资料' v-model='lesson.cankao'>
              </el-input>
            </el-col>
            <el-col :span='12'>
              <span>目标</span>
              <br><br>
              <el-input
                style='width: 90%'
                type='textarea'
                :rows='3'
                placeholder='目标' v-model='lesson.goal'>
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
                <mavon-editor
                  v-model='lesson.description'
                  ref='md'
                  class='editor'
                  @imgAdd='handleEditorImgAdd'
                  @imgDel='handleEditorImgDel'>
                </mavon-editor>
              </el-form-item>

            </el-col>
          </el-row>
          <br>

          <el-button type='primary' style='margin-left: 5%' @click='submit'>提交</el-button>
          <br>
          <br>
          <br>
        </el-form>
      </div>
    </el-tab-pane>
    <el-tab-pane label='章节管理' name='second'>
      <chapter-admin :lessonId='this.lessonId'></chapter-admin>
    </el-tab-pane>

  </el-tabs>
</template>
<script>
import { get, post } from '../../../api/index';
import ChapterAdmin from './ChapterAdmin';
import axios from 'axios';
import { bNumberCheck, ChineseCheck } from '../../../utils/validator';

const validatorLearnTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入学时'));
  } else {
    if (bNumberCheck(value)) {
      callback();
    } else {
      return callback(new Error('输入不正确'));
    }
  }
};
const validatorLearnCredit = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入学分'));
  } else {
    if (bNumberCheck(value)) {
      callback();
    } else {
      return callback(new Error('输入不正确'));
    }
  }
};
export default {
  components: {
    ChapterAdmin
  },
  data() {
    return {
      dialogImageUrl: '',
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
      options: [],
      lessonId: null,
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
      teachers: []

    };
  },
  created() {

    this.lessonId = this.$route.query.lessonId;
    this.uploadImgServer = this.$root.URL + '/back/addLessonPic';
    this.getLessonDetail();
    this.getOptionList();

  },
  mounted() {
    this.teachers = this.loadAll();
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
      console.log(JSON.stringify(item));
      this.lesson.teacher_name = item.username;

    },
    handleIconClick(ev) {
      console.log(ev);
    },
    async loadAll() {

      let url = this.$root.URL + '/backSysAdmin/loadAllTeachers';
      await get(url).then(res => {
        console.log(JSON.stringify(res.data.data));
        if (res.data.code === '200') {
          this.teachers = res.data.data;
        } else {

        }

      });
    },
    //------------------------------------加载老师姓名结束-------------------

    async getOptionList() {
      let url = this.$root.URL + '/back/getOptionList';
      await get(url).then(res => {

        console.log('--------------------------------------');
        console.log(JSON.stringify(res.data));
        if (res.data.code === '200') {
          this.options = res.data.data;
        } else {

        }

      });


    },
    async getLessonDetail() {
      const url = this.$root.URL + '/back/getLessonDetail';
      await post(url, { lessonId: this.lessonId }).then(res => {

        console.log(JSON.stringify(res.data));
        this.lesson = res.data.data;
        this.fileListFront.push({ name: 'xxx', url: res.data.data.pic_url.split(',')[0] });   //在el-upload中回显后台返回的地址
        this.hideUpload = true;

      });

    },
    submit() {
      this.$refs.submit.validate(valid => {
        if (valid) {
          console.log(JSON.stringify(this.lesson));
          const url = this.$root.URL + '/back/updateLessonInfo';
          post(url, this.lesson).then(res => {
            console.log(JSON.stringify(res));
            this.$message.success('提交成功');
          });
        } else {
          this.$message.error('请输入必填项');

        }

      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileListFront.some((item, i) => {
        if (item.name === file.name) {
          this.fileListFront.splice(i, 1);
          return true;
        }
      });
      this.hideUpload = fileList.length >= this.imgLimit;
      this.lesson.pic_url = '';
    },

    /**上传文件之前的钩子函数 */
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
      console.log(file);

    },
    /**文件超出个数限制时的钩子 */
    handleExceed() {
      this.$message.error(`只能选择${this.imgLimit}个文件`);
    },
    handleEditorImgAdd(pos, $file) {
      // const blob = this.dataURItoBlob($file.miniurl)
      const formData = new FormData();
      formData.append('file', $file);
      axios.post(this.$root.URL + '/back/addLessonPic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('token')
        }
      }).then((res) => {
        console.log(JSON.stringify(res));
        if (res.data.code === '200') {
          //this.pic_suolue = res.data.data
          this.$refs.md.$img2Url(pos, res.data.data);
        } else {
          this.$message.error('error');
        }
      }).catch((err) => {
        console.log('上传错误');
        console.log(err);
      });
    },
    handleEditorImgDel(pos) {
      delete this.imgFile[pos];
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

</style>
