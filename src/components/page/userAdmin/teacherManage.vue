<template>
  <div>
    <el-row type='flex' class='row-bg' justify='start'>
      <el-col :span='2'>
        <el-button @click='addTeacherDiag = true' type='primary'>添加</el-button>
      </el-col>
      <el-col :span='2'>
        <el-button @click='deleteTeacher()' type='danger'>删除</el-button>
      </el-col>
      <el-col :span='4'>
        <el-input
          placeholder='请根据姓名进行检索'
          v-model='name'
          maxlength='20'
          show-word-limit
          clearable
        >
        </el-input>
      </el-col>
      <el-col :span='3'>
        <el-button type='primary' icon='el-icon-search' @click='handleSearch'>搜索</el-button>
      </el-col>
      <el-col :span='3'>
        <el-upload
          list-type='text'
          :action='uploadAttachment'
          :on-preview='handlePreview'
          :on-remove='handleRemove'
          :on-success='handleSuccess'
          :limit='1'
          :on-exceed='handleExceed'
          :file-list='fileList'
          :headers='uploadHeaders'
        >
          <el-button slot='trigger' size='small' type='primary'>选取文件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <br>
    <el-table
      :data='tableData'
      border
      class='table'
      ref='multipleTable'
      stripe
      header-cell-class-name='table-header'
      @selection-change='handleSelectionChange'>
      <el-table-column type='selection' width='55'></el-table-column>
      <el-table-column type='index' label='序号' width='150px'></el-table-column>
      <el-table-column prop='username' label='用户名' width='150px'></el-table-column>
      <el-table-column prop='name' label='真实姓名' width='150px'></el-table-column>
      <el-table-column prop='phone' label='电话' width='150px'></el-table-column>
      <el-table-column prop='email' label='邮箱' width='150px'></el-table-column>
      <el-table-column prop='created_time' label='账号创建时间' width='150px' sortable></el-table-column>
      <el-table-column label='操作' width='200px' align='center'>
        <template slot-scope='scope'>
          <el-button type='primary' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='block' style='margin:5px 0 0 848px'>
      <el-row>
        <el-col>
          <div class='block'>
            <el-pagination
              @size-change='handleSizeChange'
              @current-change='handleCurrentChange'
              :current-page='pageInfo.pageNum'
              :page-sizes='[10, 50, 100, 500]'
              :page-size='pageInfo.pageSize'
              layout='total, sizes, prev, pager, next, jumper'
              :total='pageInfo.total'
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <!-- 新增教师 -->
      <el-dialog title='新增教师' :visible.sync='addTeacherDiag' width='40%' :before-close='handleClose'>
        <el-form label-position='left' label-width='100px' :model='addTeacherInfo' :rules='rules' ref='addTeacherInfo'>
          <el-form-item label='用户名' prop='username'>
            <el-input v-model=addTeacherInfo.username></el-input>
          </el-form-item>
          <el-form-item label='真实姓名' prop='name'>
            <el-input v-model=addTeacherInfo.name></el-input>
          </el-form-item>
          <el-form-item label='联系方式' prop='phone'>
            <el-input v-model=addTeacherInfo.phone></el-input>
          </el-form-item>
          <el-form-item label='邮箱' prop='email'>
            <el-autocomplete
              v-model='addTeacherInfo.email'
              :fetch-suggestions='querySearchEmail'
              :trigger-on-focus='false'
              placeholder='输入邮箱'>
            </el-autocomplete>
          </el-form-item>
        </el-form>
        <span slot='footer' class='dialog-footer'>
          <el-button @click='cancelAdd()'>取 消</el-button>
          <el-button type='primary' @click="addTeacher('addTeacherInfo')">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑教师信息 -->
      <el-dialog title='修改教师' :visible.sync='editTeacherDiag' width='70%' :before-close='handleClose'>
        <el-form label-position='left' label-width='100px' :model='editTeacherInfo' :rules='rules'
                 ref='editTeacherInfo'>
          <el-form-item label='用户名' prop='username'>
            <el-input v-model=editTeacherInfo.username></el-input>
          </el-form-item>
          <el-form-item label='真实姓名' prop='name'>
            <el-input v-model=editTeacherInfo.name></el-input>
          </el-form-item>
          <el-form-item label='联系方式' prop='phone'>
            <el-input v-model=editTeacherInfo.phone></el-input>
          </el-form-item>
          <el-form-item label='邮箱' prop='email'>
            <el-autocomplete
              v-model='editTeacherInfo.email'
              :fetch-suggestions='querySearchEmail'
              :trigger-on-focus='false'
              placeholder='输入邮箱'
            >
            </el-autocomplete>
          </el-form-item>
        </el-form>
        <span slot='footer' class='dialog-footer'>
          <el-button @click='cancelEdit()'>取 消</el-button>
          <el-button type='primary' @click="editTeacher('editTeacherInfo')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ChineseCheck, emailCheck, phoneCheck } from '@/utils/validator'
import { addTeacher, deleteUsers, editTeacher, findTeacherByName, getAllTeachers } from '@/network/api/user'

const validatorPhoneNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号码'))
  } else {
    if (phoneCheck(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的手机号码'))
    }
  }
}
const validatorEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'))
  } else {
    if (emailCheck(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的邮箱'))
    }
  }
}
const validatorChinese = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入姓名'))
  } else {
    if (ChineseCheck(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的姓名'))
    }
  }
}
export default {
  inject: ['reload'],
  data() {
    return {
      rules: {
        phone: [
          { validator: validatorPhoneNum, required: true, trigger: 'blur' }
        ],
        name: [
          { validator: validatorChinese, required: true, trigger: 'blur' }
        ],
        username: [{
          required: true, message: '用户名不能为空', trigger: 'blur'
        }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }]
      },
      addTeacherDiag: false,
      editTeacherDiag: false,
      name: '',
      dialogVisible: false,
      addVisible: false,
      multipleSelection: [],
      tableData: [],
      //总数据条数
      //总数据条数
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        size: 0,
        startRow: 0,
        endRow: 0,
        total: 0,
        pages: 0
      },
      addTeacherInfo: {
        username: '',
        name: '',
        phone: '',
        email: ''
      },
      editTeacherInfo: {
        user_id: '',
        username: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        repeatPassword: ''
      },
      waitLoading: false,
      uploadAttachment: '',
      uploadHeaders: { 'token': localStorage.getItem('token') },
      fileList: []
    }
  },
  created() {
    this.getData()
    this.uploadAttachment = this.$root.URL + '/back/uploadExcelImport'
  },
  methods: {
// 邮箱自动填充后缀名
    querySearchEmail(queryString, callback) {
      const emailList = [
        { value: '@qq.com' },
        { value: '@126.com' },
        { value: '@163.com' },
        { value: '@sina.com' },
        { value: '@21cn.com' },
        { value: '@sohu.com' },
        { value: '@yahoo.com.cn' },
        { value: '@tom.com' },
        { value: '@etang.com' },
        { value: '@eyou.com' },
        { value: '@56.com' },
        { value: '@x.cn' },
        { value: '@chinaren.comsogou.com' },
        { value: '@citiz.com' }
      ]

      let results = []
      let queryList = []

      emailList.map(item => {
        queryList.push({ value: queryString.split('@')[0] + item.value })
      })

      results = queryString ? queryList.filter(this.createFilter(queryString)) : queryList
      callback(results)
    },
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
        this.addTeacherInfo = {
          username: '',
          name: '',
          phone: '',
          email: ''
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //改变每页显示的数据条数
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize
      this.getData()
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum
      this.getData()
    },
    handleSearch() {
      let name = this.name
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      findTeacherByName(name, currentPage, pageSize).then(res => {
        if (res.data.code === '200') {
          let tableData = res.data.data.list
          let data = res.data.data

          if (tableData != null) {
            this.tableData = tableData

            this.pageInfo = {
              pageNum: data.pageNum,
              pageSize: data.pageSize,
              size: data.size,
              startRow: data.startRow,
              endRow: data.endRow,
              total: data.total,
              pages: data.pages
            }
          }
        }
      })
    },
    getData() {
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      getAllTeachers(currentPage, pageSize).then(res => {
        if (res.data.code === '200') {
          let tableData = res.data.data.list
          let data = res.data.data

          if (tableData != null) {
            this.tableData = tableData

            this.pageInfo = {
              pageNum: data.pageNum,
              pageSize: data.pageSize,
              size: data.size,
              startRow: data.startRow,
              endRow: data.endRow,
              total: data.total,
              pages: data.pages
            }
          }
        }
      })
    },
    //新增教师
    addTeacher(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在努力添加',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          setTimeout(() => {
            addTeacher(this.addTeacherInfo).then(res => {
              if (res.data.code === '200') {
                this.$message('添加教师成功!')
                this.addTeacherDiag = false
                this.addTeacherInfo = {}
                this.reload()
              } else {
                this.$message.error('添加教师失败!')
              }
            })
            loading.close()
          }, 2000)
        } else {
          console.log('error submit!!')
          this.$message.error('表单填写错误，添加失败')
        }
      })
    },
    cancelAdd() {
      this.addTeacherDiag = false
      this.addTeacherInfo = {
        username: '',
        name: '',
        phone: '',
        email: ''
      }
    },
    handleEdit(index, row) {
      this.editTeacherInfo.user_id = row.user_id
      this.editTeacherInfo.username = row.username
      this.editTeacherInfo.name = row.name
      this.editTeacherInfo.email = row.email
      this.editTeacherInfo.phone = row.phone
      this.editTeacherDiag = true
    },
    editTeacher(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editTeacher(this.editTeacherInfo).then(res => {
            if (res.data.code === '200') {
              this.$message.success('更新教师信息成功!')
              this.editTeacherDiag = false
              this.reload()
            } else {
              this.$message.error('更新教师信息失败!')
            }
          })
        } else {
          this.$message.error('表单填写错误，添加失败')
        }
      })
    },
    cancelEdit() {
      this.editTeacherDiag = false
    },
    deleteTeacher() {
      let teacherObjs = this.multipleSelection
      let teachIds = []

      teacherObjs.forEach(item => {
        teachIds.push(item.user_id)
      })

      this.$confirm('是否删除教师信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers(teachIds).then(res => {
          if (res.data.code === '200') {
            this.$message.success('删除教师成功!')
            this.reload()
          } else {
            this.$message.error('删除教师失败!')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.addToolForm.download_url = ''
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一个文件！')
    },
    handleSuccess(res, file) {
      if (file.response.code === '200') {
        this.$message.success('导入用户表格成功')
        this.reload()
      }
      // this.addToolForm.download_url = file.response.data
    }
  }
}
</script>

<style>
.el-upload--text {
  width: 80px;
  height: 33px;
  border: none;
}

</style>
