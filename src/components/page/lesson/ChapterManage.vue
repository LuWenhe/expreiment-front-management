<template>
  <el-row class='chapter-container'>
    <el-row class='chapter-add-btn'>
      <el-button type='primary' @click='addChapterBtn'>添加课程章节</el-button>
    </el-row>
    <!-- 展示每个章节 -->
    <el-row class='son-chapter-box' v-for='(item, index) in chapter' :key='index'>
      <!-- 章节标题 -->
      <el-row class='chapter-title'>
        <el-row class='left'>
          <span class='chapter-index'>{{ item.chapter_no }}</span>
          <span><b>{{ item.name }}</b></span>
        </el-row>
        <el-row class='right'>
          <el-button @click='delChapter(item)'><i class='el-icon-delete-solid'></i></el-button>
          <el-button @click='editChapter(item.id, item.chapter_no, item.name, item.description)'>
            <i class='el-icon-edit'></i>
          </el-button>
          <el-button type='success' @click='addSonChapterModal(item.id, item.name)'>
            <i class='el-icon-plus'>添加实验章节</i>
          </el-button>
        </el-row>
      </el-row>
      <!-- 子章节 -->
      <el-row v-if='item.sonChapterList.length > 0' class='son-chapter'>
        <el-row class='son-chapter-item' v-for='(sonItem, index) in item.sonChapterList' :key='index'>
          <el-row class='left'>
            <span>{{ sonItem.son_no }} {{ sonItem.name }}</span>
          </el-row>
          <el-row class='right'>
            <el-button @click='delSonChapter(item, sonItem)'><i class='el-icon-delete-solid'></i></el-button>
            <el-button @click='editSonChapter(sonItem.id, item.name)'><i class='el-icon-edit'></i></el-button>
            <el-button @click='toJupyterPage(sonItem.id)'><i class='el-icon-edit'>实验指导书</i></el-button>
          </el-row>
        </el-row>
      </el-row>
      <el-row v-else class='son-chapter'>
        <span>无数据</span>
      </el-row>
    </el-row>
    <!-- 添加章节信息弹出框 -->
    <el-drawer
      title='添加章节信息'
      :visible.sync='dialog'
      direction='ltr'
      custom-class='demo-drawer'
      ref='drawer'
    >
      <div class='demo-drawer__content'>
        <el-form :model='form' :rules='rules' ref='submit'>
          <el-form-item label='章节序号' :label-width='formLabelWidth' prop='chapter_no'>
            <el-input v-model.number='form.chapter_no' style='width: 90%'></el-input>
          </el-form-item>
          <el-form-item label='章节名称' :label-width='formLabelWidth' prop='name'>
            <el-input v-model='form.name' style='width: 90%'></el-input>
          </el-form-item>
          <el-form-item label='简介' :label-width='formLabelWidth' prop='description'>
            <el-input
              style='width: 90%'
              type='textarea'
              :rows='3'
              placeholder='请输入大纲'
              v-model='form.description'
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class='demo-drawer__footer' style='margin-left: 15%'>
          <el-button @click='cancelForm'>取 消</el-button>
          <el-button type='primary' @click='addChapter'>添加章节</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 编辑课程章节弹出框 -->
    <el-drawer
      title='编辑课程章节'
      :visible.sync='editChDiag'
      direction='rtl'
      custom-class='demo-drawer'
      ref='drawer'
    >
      <el-row class='demo-drawer__content'>
        <el-form :model='editCh_form' :rules='rules' ref='submit_ediCh'>
          <el-form-item label='章节序号' :label-width='formLabelWidth' prop='chapter_no'>
            <el-input v-model='editCh_form.chapter_no' style='width: 90%' @input='changeValue'></el-input>
          </el-form-item>
          <el-form-item label='章节名称' :label-width='formLabelWidth' prop='name'>
            <el-input v-model='editCh_form.name' style='width: 90%' @input='changeValue'></el-input>
          </el-form-item>
          <el-form-item label='简介' :label-width='formLabelWidth' prop='description'>
            <el-input
              style='width: 90%'
              type='textarea'
              :rows='3'
              @input='changeValue'
              placeholder='请输入大纲' v-model='editCh_form.description'>
            </el-input>
          </el-form-item>
        </el-form>
        <div class='demo-drawer__footer' style='margin-left: 15%'>
          <el-button @click='cancelEditChForm'>取 消</el-button>
          <el-button type='primary' @click='editSubmitChapter'>修改</el-button>
        </div>
      </el-row>
    </el-drawer>
    <!-- 添加课程章节弹出框 -->
    <el-dialog title='子章节' :visible.sync='addSonChapterDiag' width='30%'>
      <el-form :model='lesson_form' :rules='son_rules' ref='submit_son'>
        <el-form-item label='序号' :label-width='formLabelWidth' prop='son_no'>
          <el-input v-model='lesson_form.son_no' style='width: 90%'></el-input>
        </el-form-item>
        <el-form-item label='名称' :label-width='formLabelWidth' prop='name'>
          <el-input v-model='lesson_form.name' style='width: 90%'></el-input>
        </el-form-item>
        <el-form-item label='简介' :label-width='formLabelWidth' prop='description'>
          <el-input
            style='width: 90%'
            type='textarea'
            :rows='3'
            placeholder='请输入大纲' v-model='lesson_form.description'>
          </el-input>
        </el-form-item>
        <el-form-item label='PPT' :label-width='formLabelWidth'>
          <el-upload
            action=''
            :before-upload='beforePPTUpload'
            :on-remove='handleRemovePPT'
            :limit='1'
            :on-exceed='handleExceedPPT'
            :file-list='fileList'
            :headers='uploadHeaders'
            :http-request='uploadPPT'
          >
            <el-button size='small' type='primary'>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label='MP4' :label-width='formLabelWidth'>
          <el-upload
            action=''
            :before-upload='beforeMP4Upload'
            :on-remove='handleRemoveMp4'
            :limit='1'
            :on-exceed='handleExceedMp4'
            :file-list='fileList'
            :headers='uploadHeaders'
            :http-request='uploadMP4'>
            <el-button size='small' type='primary'>点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
          <el-button @click='addSonChapterDiagCancel'>取 消</el-button>
          <el-button type='primary' @click='addSonChapter'>确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑子章节弹出框 -->
    <el-dialog
      title='编辑子章节'
      :visible.sync='editSonChapterDiag'
      width='30%'
    >
      <el-form :model='edit_lesson_form' :rules='son_rules' ref='submit_son'>
        <el-form-item label='序号' :label-width='formLabelWidth' prop='son_no'>
          <el-input v-model='edit_lesson_form.son_no' @input='changeValue' style='width: 90%'></el-input>
        </el-form-item>
        <el-form-item label='名称' :label-width='formLabelWidth' prop='name'>
          <el-input v-model='edit_lesson_form.name' @input='changeValue' style='width: 90%'></el-input>
        </el-form-item>
        <el-form-item label='简介' :label-width='formLabelWidth' prop='description'>
          <el-input style='width: 90%' type='textarea' :rows='3' placeholder='请输入大纲'
                    v-model='edit_lesson_form.description'></el-input>
        </el-form-item>
        <el-form-item label='PPT' :label-width='formLabelWidth'>
          <el-upload
            list-type='text'
            action=''
            :before-upload='beforePPTUpload'
            :limit='1'
            :on-exceed='handleEditExceedPPT'
            :file-list='fileList'
            :headers='uploadHeaders'
            :http-request='editUploadPPT'
          >
            <el-button size='small' type='primary'>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label='MP4' :label-width='formLabelWidth'>
          <el-upload
            action=''
            :before-upload='beforeMP4Upload'
            :on-preview='handleEditPreviewMp4'
            :limit='1'
            :on-exceed='handleEditExceedMp4'
            :file-list='fileList'
            :headers='uploadHeaders'
            :http-request='editUploadMP4'
          >
            <el-button size='small' type='primary'>点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addEditSonChapterDiagCancel'>取 消</el-button>
        <el-button type='primary' @click='addEditSonChapter'>确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  addChapter, addSonChapter, delChapter,
  delSonChapter, editSonChapter, getChapterInfo,
  getEditSonChapterInfo, updateChapter, uploadFile
} from '@/network/api/backLesson'

import { getFormData } from '@/utils/fileUtils'

export default {
  name: 'ChapterManage',
  props: {
    lessonObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      options: [
        {
          value: 'WebIDE',
          label: 'WebIDE'
        },
        {
          value: 'Jupyter',
          label: 'Jupyter'
        }
      ],
      uploadHeaders: { 'token': localStorage.getItem('token') },
      fileList: [],
      addSonChapterDiag: false,
      editSonChapterDiag: false,
      rules: {
        name: [{ required: true, message: '请输入章节名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入章节描述', trigger: 'blur' }],
        chapter_no: [
          { required: true, message: '请输入章节编号', trigger: 'blur' },
          { type: 'number', message: '编号必须为数字值' }
        ]
      },
      son_rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        son_no: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ]
      },
      table: false,
      loading: false,
      lesson_id: this.lessonObj.lessonId,    // 把传过来的值赋值给新的变量
      chapter: [],
      dialog: false,
      editChDiag: false,
      editCh_form: {
        id: '',
        chapter_no: '',
        name: '',
        description: ''
      },
      form: {
        name: '',
        description: '',
        mp4: '',
        ppt: '',
        lessonId: '',
        chapter_no: ''
      },
      exp_type: '',
      lesson_form: {
        son_no: '',
        name: '',
        description: '',
        exp_type: '',
        chapter_id: '',
        lessonId: '',
        ppt: '',
        mp4: ''
      },
      edit_lesson_form: {
        id: '',
        son_no: '',
        name: '',
        description: '',
        lessonId: '',
        ppt: '',
        mp4: ''
      },
      formLabelWidth: '80px',
      timer: null,
      chapterId: '',
      chapterName: '',
      isShow: false
    }
  },
  created() {
    this.getChapterInfoByLessonId()
  },
  watch: {
    lessonId(val) {
      this.lesson_id = val; //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
    }
  },
  methods: {
    addChapterBtn() {
      this.form = {}
      this.lesson_form = {}
      this.dialog = true
    },
    changeValue(e) {
      this.$forceUpdate()
    },
    uploadPPT(params) {
      let formData = getFormData(params)
      this.uploadFileByType('PPT', 'add', formData)
    },
    uploadMP4(params) {
      let formData = getFormData(params)
      this.uploadFileByType('MP4', 'add', formData)
    },
    editUploadPPT(params) {
      let formData = getFormData(params)
      this.uploadFileByType('PPT', 'update', formData)
    },
    editUploadMP4(params) {
      let formData = getFormData(params)
      this.uploadFileByType('MP4', 'update', formData)
    },
    uploadFileByType(fileType, operatorType, formData) {
      uploadFile(formData).then(res => {
        if (res.status === '200') {
          this.$message.success('文件上传成功!')

          let fileUrl = res.data

          if (fileType === 'PPT') {
            if (operatorType === 'add') {
              this.lesson_form.ppt = fileUrl
            } else {
              this.edit_lesson_form.ppt = fileUrl
            }
          } else {
            if (operatorType === 'add') {
              this.lesson_form.mp4 = fileUrl
            } else {
              this.edit_lesson_form.mp4 = fileUrl
            }
          }
        } else {
          this.$message.error('文件上传失败!')
        }
      })
    },
    beforePPTUpload(file) {
      let fileName = file.name
      let isPPT = fileName.indexOf('.ppt') > 0 || fileName.indexOf('.pptx') > 0
      let isLt20 = file.size / 1024 / 1024 < 20

      if (!isPPT) {
        this.$message.error('仅支持上传PPT！')
        return false
      }

      if (!isLt20) {
        this.$message.error('上传图片大小不能超过20MB!')
        return false
      }

      return isPPT && isLt20
    },
    beforeMP4Upload(file) {
      let fileName = file.name
      let isMP4 = fileName.indexOf('.mp4') > 0
      let isLt50 = file.size / 1024 / 1024 < 50

      if (!isMP4) {
        this.$message.error('仅支持上传MP4格式的视频!')
        return false
      }

      if (!isLt50) {
        this.$message.error('上传视频大小不能超过50MB!')
        return false
      }

      return isMP4 && isLt50
    },
    // Todo
    handleRemovePPT(file, fileList) {
      console.log(file, fileList);
    },
    handleExceedPPT() {
      this.$message.warning('只能上传一个文件！')
    },
    handleEditExceedPPT() {
      this.$message.warning('只能上传一个文件！');
    },
    handleRemoveMp4(file, fileList) {
      console.log(file, fileList);
    },
    handleExceedMp4() {
      this.$message.warning('只能上传一个文件！');
    },
    handleEditPreviewMp4(file) {
      console.log(file);
    },
    handleEditExceedMp4() {
      this.$message.warning('只能上传一个文件！');
    },
    addSonChapterDiagCancel() {
      this.addSonChapterDiag = false
    },
    addSonChapterModal(id, name) {
      this.addSonChapterDiag = true
      this.chapterId = id
      this.chapterName = name
    },
    addSonChapter() {
      this.$confirm('确定要提交表单吗？').then(_ => {
        this.timer = setTimeout(() => {
          this.lesson_form.lessonId = this.lesson_id
          this.lesson_form.chapter_id = this.chapterId
          this.lesson_form.chapterName = this.chapterName
          this.lesson_form.lessonName = this.lessonObj.lesson_name

          this.$refs.submit_son.validate(valid => {
            addSonChapter(this.lesson_form).then(res => {
              if (res.status === '200') {
                this.$message.success('提交成功');
                this.chapter = res.data
                this.form = '';
                this.lesson_form = {}
                this.getChapterInfoByLessonId()
                this.loading = false
              } else {
                this.$message.error('提交失败');
              }
            })
          })
        }, 2000)
      }).catch(err => {
        console.log(err)
      })

      this.addSonChapterDiag = false
    },
    // 打开编辑子章节的Dialog
    editSonChapter(id, chapterName) {
      getEditSonChapterInfo(id).then(res => {
        if (res.status === '200') {
          let dataObj = res.data

          this.edit_lesson_form.son_no = dataObj.son_no
          this.edit_lesson_form.name = dataObj.name
          this.edit_lesson_form.description = dataObj.description
          this.edit_lesson_form.ppt = dataObj.ppt
          this.edit_lesson_form.mp4 = dataObj.mp4
          this.edit_lesson_form.id = dataObj.id
          this.edit_lesson_form.lessonName = this.lessonObj.lesson_name
          this.edit_lesson_form.chapterName = chapterName

          this.editSonChapterDiag = true
        }
      })

      this.editSonChapterDiag = true
    },
    addEditSonChapterDiagCancel() {
      this.editSonChapterDiag = false
    },
    addEditSonChapter() {
      this.$confirm('确定要提交表单吗？').then(_ => {
        this.$refs.submit_son.validate(valid => {

          editSonChapter(this.edit_lesson_form).then(res => {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })

            if (res.status === '200') {
              this.$message.success('修改小节成功!')
              this.editSonChapterDiag = false
              this.chapter = res.data
              this.form = ''
              this.lesson_form = {}
              this.getChapterInfoByLessonId()
            } else {
              this.$message.error('修改小节失败!')
            }

            loading.close()
          })
        })
      }).catch(err => {
        console.log(err)
      });
    },
    delSonChapter(chapterObj, sonObj) {
      let lessonName = this.lessonObj.lesson_name
      let chapterName = chapterObj.name
      let sonId = sonObj.id
      let sonName = sonObj.name

      this.$confirm('此操作将永久删除该子章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSonChapter(lessonName, chapterName, sonId, sonName).then(res => {
          if (res.status === '200') {
            this.$message.success('删除子章节成功!')
            this.getChapterInfoByLessonId()
          } else {
            this.$message.error('删除子章节失败!')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delChapter(chapterObj) {
      let lessonName = this.lessonObj.lesson_name
      let chapterId = chapterObj.id
      let chapterName = chapterObj.name

      this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delChapter(lessonName, chapterId, chapterName).then(res => {
          if (res.status === '200') {
            this.$message.success('删除章节成功!');
            this.getChapterInfoByLessonId();
          } else {
            this.$message.error('删除章节失败!');
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //编辑章节信息
    editChapter(id, chapter_no, name, description) {
      this.editCh_form.id = id
      this.editCh_form.chapter_no = chapter_no
      this.editCh_form.name = name
      this.editCh_form.description = description
      this.editChDiag = true
      this.editCh_form.lessonName = this.lessonObj.lesson_name
    },
    addChapter() {
      this.$confirm('确定要提交表单吗？').then(_ => {
        this.timer = setTimeout(() => {
          this.form.lessonId = this.lessonObj.lessonId
          this.form.lessonName = this.lessonObj.lesson_name
          this.form.lessonPath = this.lessonObj.lessonPath

          this.$refs.submit.validate(valid => {
            if (valid) {
              addChapter(this.form).then(res => {
                if (res.status === '200') {
                  this.$message.success('提交成功')
                  this.chapter = res.data
                  this.dialog = false

                } else {
                  this.$message.error('添加章节失败!')
                }
              });

              setTimeout(() => {
                this.loading = false
              }, 400)
            } else {
              this.$message.error('输入有误');
            }
          });
        }, 2000);
      }).catch(err => {
        console.log(err);
      });
    },
    editSubmitChapter() {
      this.$confirm('确定要提交表单吗？').then(_ => {
        this.$refs.submit_ediCh.validate(valid => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })

          updateChapter(this.editCh_form).then(res => {
            if (res.status === '200') {
              this.$message.success('修改章节信息成功!')
              this.editChDiag = false
              this.getChapterInfoByLessonId()
            } else {
              this.$message.error('修改章节错误!')
            }
          })

          loading.close()

          setTimeout(() => {
            this.loading = false
          }, 400)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
      this.form = '';
    },
    cancelEditChForm() {
      this.editChDiag = false;
      this.editCh_form = {};
    },
    toJupyterPage(id) {
      this.$store.commit('setSonId', id)
      this.$router.push({ name: 'ToJupyterPage', query: { id: id } })
    },
    getChapterInfoByLessonId() {
      getChapterInfo(this.lesson_id).then(res => {
        if (res.status === '200') {
          this.chapter = res.data
        } else {
          this.$message.error('加载失败')
        }
      })
    }
  }
};
</script>

<style>
.chapter-container {
  display: flex;
  flex-direction: column;
  background-color: white;
}

.chapter-add-btn {
  margin: 10px 0 0 5px;
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

.chapter-title {
  display: flex;
  height: 50px;
  align-items: center;
}

.chapter-title .left {
  flex: 0.8;
  justify-content: flex-start;
}

.chapter-title .right {
  flex: 0.2;
  justify-content: flex-end;
}

.son-chapter {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.son-chapter-item {
  display: flex;
  height: 35px;
  align-items: center;
}

.son-chapter-item .left {
  flex: 0.8;
}

.son-chapter-item .right {
  flex: 0.2;
}

.son-chapter .chapter-btn {
  width: 120px;
}

.el-upload--text {
  width: 100px;
  height: 40px;
  border: none;
}
</style>
