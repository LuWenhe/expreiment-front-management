<template>
  <div>
    <el-button type='primary' @click='dialog = true'>添加课程章节</el-button>
    <div v-for='(item,index)  in chapterList' :key='index'>
      <div class='secondCard'>
        <br>
        <div>
          <div style='float: left;margin-left: 20px'><span class='chapter-index'>{{ item.chapter_no }}</span>
            &nbsp;<span><b>{{ item.name }}</b></span></div>
          <div style='float: right;margin-right: 20px'>
            <el-button @click='delChapter(item.id)'><i class='el-icon-delete-solid'></i></el-button>
            <el-button @click='editChapter(item.id)'><i class='el-icon-edit'></i></el-button>
          </div>
          <br>
        </div>
        <br>
        <hr>
        <br>
        <div style='margin-left: 20px'>
          <span>{{ item.description }}</span>
          <br>
          <br>
          <div v-for='(sonItem,index) in item.sonChapterList' :key='index'>
            <div style='float: left;'>
              <span> {{ sonItem.son_no }} &nbsp;{{ sonItem.name }}</span>
            </div>
            <div style='float: right;margin-right: 20px'>
              <el-button><i class='el-icon-edit'></i></el-button>
              <el-button @click='toJupyterPage(sonItem.exp_url,sonItem.id)'><i class='el-icon-edit'>jupyter实验</i>
              </el-button>
            </div>
            <br>
            <br>
          </div>
          <el-button><i class='el-icon-plus' @click='addSonChapterModal(item.id)'>添加实验章节</i></el-button>
          <br>
          <br>
        </div>
      </div>
      <br>
      <br>
    </div>
    <div>
      <el-drawer
        title='课程章节'
        :visible.sync='dialog'
        direction='ltr'
        custom-class='demo-drawer'
        ref='drawer'
      >
        <div class='demo-drawer__content'>
          <el-form :model='form' :rules='rules' ref='submit'>
            <el-form-item label='章节序号' :label-width='formLabelWidth' prop='chapter_no'>
              <el-input v-model='form.chapter_no' style='width: 90%'></el-input>
            </el-form-item>
            <el-form-item label='章节名称' :label-width='formLabelWidth' prop='name'>
              <el-input v-model='form.name' style='width: 90%'></el-input>
            </el-form-item>
            <el-form-item label='简介' :label-width='formLabelWidth' prop='description'>
              <el-input
                style='width: 90%'
                type='textarea'
                :rows='3'
                placeholder='请输入大纲' v-model='form.description'>
              </el-input>
            </el-form-item>
          </el-form>
          <div class='demo-drawer__footer' style='margin-left: 15%'>
            <el-button @click='cancelForm'>取 消</el-button>
            <el-button type='primary' @click='addChapter'>提交</el-button>
          </div>
        </div>
      </el-drawer>
      <el-dialog
        title='子章节'
        :visible.sync='addSonChapterDiag'
        width='30%'
      >
        <el-form :model='lesson_form' :rules='rules' ref='submit_son'>
          <el-form-item label='序号' :label-width='formLabelWidth' prop='son_no'>
            <el-input v-model='lesson_form.son_no' style='width: 90%'></el-input>
          </el-form-item>
          <el-form-item label='名称' :label-width='formLabelWidth' prop='name'>
            <el-input v-model='lesson_form.son_name' style='width: 90%'></el-input>
          </el-form-item>
          <el-form-item label='简介' :label-width='formLabelWidth' prop='description'>
            <el-input
              style='width: 90%'
              type='textarea'
              :rows='3'
              placeholder='请输入大纲' v-model='lesson_form.description'>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot='footer' class='dialog-footer'>
          <el-button @click='addSonChapterDiagCancel'>取 消</el-button>
          <el-button type='primary' @click='addSonChapter'>确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addSonChapter, delChapter } from '@/network/api/backLesson'
import toJupyterPage from '@/components/page/lesson/ToJupyterPage.vue';

export default {
  name: 'ChapterAdd',
  computed: {
    toJupyterPage() {
      return toJupyterPage
    }
  },
  props: ['isAddLesson', 'lesson_id', 'tabIndex'],
  data() {
    return {
      lessonId: this.lesson_id,    // 把传过来的值赋值给新的变量
      isAddLesson: this.isAddLesson,
      tab_index: this.tabIndex,
      addSonChapterDiag: false,
      rules: {
        name: [{ required: true, message: '请输入章节名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入章节描述', trigger: 'blur' }],
        chapter_no: [{ required: true, message: '请输入章节编号', trigger: 'blur' }]
      },
      son_rules: {
        son_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        son_no: [{ required: true, message: '请输入编号', trigger: 'blur' }]
      },
      table: false,
      loading: false,
      lesson_id: this.lessonId,    // 把传过来的值赋值给新的变量
      chapterList: [],
      dialog: false,
      form: {
        name: '',
        description: '',
        mp4: '',
        ppt: '',
        lesson_id: '',
        chapter_no: ''
      },
      lesson_form: {
        son_no: '',
        son_name: '',
        description: '',
        exp_type: '',
        id: '',
        lesson_id: ''
      },
      formLabelWidth: '80px',
      timer: null,
      id: ''
    };
  },
  methods: {
    addSonChapterDiagCancel() {
      this.addSonChapterDiag = false
      this.lesson_form = {}
    },
    addSonChapterModal(id) {
      this.id = id
      this.addSonChapterDiag = true
    },
    addSonChapter() {
      this.$confirm('确定要提交表单吗？').then(_ => {
        this.timer = setTimeout(() => {
          this.lesson_form.lesson_id = this.lesson_id
          this.lesson_form.id = this.id
          // this.lesson_form.lessonName =

          this.$refs.submit_son.validate(valid => {
            addSonChapter(this.lesson_form).then(res => {
              if (res.status === '200') {
                this.$message.success('提交子章节成功')
                this.chapter = res.data
                this.form = ''
                this.getChapterInfoByLessonId()
              } else {
                this.$message.error('系统内部错误')
              }
            })
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          })
        }, 2000)
      }).catch(err => {
        console.log(err)
      })

      this.addSonChapterDiag = false
    },
    delChapter(id) {
      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        delChapter(id).then(res => {
          if (res.status === '200') {
            this.$message.success('删除章节成功!')
            this.getChapterInfoByLessonId()
          } else {
            this.$message({
              type: 'error',
              message: '服务器异常，暂时无法删除!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addChapter() {
      this.$refs.submit.validate(valid => {
        this.form.lesson_id = this.lesson_id

        this.chapterList.push({
          name: this.form.name,
          chapter_no: this.form.chapter_no,
          description: this.form.description,
          sonChapterList: []
        })

        this.dialog = false
        this.form = {}
      })
    },
    cancelForm() {
      this.dialog = false
      this.form = {}
    }
  },
  created() {
    if (!(this.isAddLesson) && this.tab_index === 1) {
      this.$message.error('还未添加课程，请添加课程之后再添加对应章节信息');
    }
  },
  watch: {
    lesson_id(val) {
      this.lessonId = val; //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
    },
    isAddLesson(val) {
      this.isAddLesson = val;
    },
    tabIndex(val) {
      this.tab_index = val;
    }
  }
};
</script>

<style scoped>
.secondCard {
  background-color: white;
  height: auto;
  width: 60%;
  margin-left: 20px;
}

.chapter-index {
  display: inline-block;
  line-height: 30px;
  text-align: center;
  background-color: #fdf5e6;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 12px;
}
</style>
