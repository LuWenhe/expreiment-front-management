<template>
  <el-row class="student-manage-box" justify="start">
    <!-- 头部 -->
    <el-row class="top">
      <el-row class='input'>
        <span>请选择班级：</span>
        <el-select v-model="clazzId" placeholder="请选择" @change='changeSelect'>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <el-row class='button-group'>
        <el-button type="danger" @click="delStudents">删除多个</el-button>
        <el-button type="primary" @click="addStudentBtn">添加学生</el-button>
        <el-button type="success" @click="uploadBtn">上传文件</el-button>
      </el-row>
    </el-row>
    <!-- 内容部分 -->
    <el-row>
      <el-table
        :data="tableData"
        border
        class="student-table"
        ref="multipleTable"
        stripe
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type='index' label="序号" width="100px"></el-table-column>
        <el-table-column prop="username" label="用户名" width="130px"></el-table-column>
        <el-table-column prop="name" label="姓名" width="130px"></el-table-column>
        <el-table-column prop="sex" label="性别" with="50px"></el-table-column>
        <el-table-column prop="birthday" label="生日" width="150px"></el-table-column>
        <el-table-column prop="workPlace" label="单位" width="150px"></el-table-column>
        <el-table-column prop="job" label="岗位" width="150px"></el-table-column>
        <el-table-column prop="major" label="专业" width="150px"></el-table-column>
        <el-table-column prop="qualification" label="学历" width="150px"></el-table-column>
        <el-table-column prop="phone" label="手机" width="150px"></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="editStudent(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 分页 -->
    <el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[10, 50, 100, 500]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </el-row>
    <!-- 添加单个学生 -->
    <el-dialog title="添加学生" width="30%" :visible.sync="addDialogFormVisible">
      <el-form :model="studentForm" :rules="studentRules" ref="addRuleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="studentForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="studentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="studentForm.sex" class="select">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-col :span="8">
            <el-date-picker type="date" placeholder="选择日期" v-model="studentForm.birthday"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="单位" prop="province">
          <el-select v-model="studentForm.province" class="select">
            <el-option v-for="item in provinceList" :label="item.name" :value="item.name" :key="item.id"></el-option>
          </el-select>/
          <el-input v-model="studentForm.department1" style="width: 30%"></el-input>/
          <el-input v-model="studentForm.department2" placeholder="(可选)" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="studentForm.job"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="studentForm.major"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="qualification">
          <el-input v-model="studentForm.qualification"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="studentForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddStudent('addRuleForm')">确 定</el-button>
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 根据文件添加学生 -->
    <el-dialog title='上传文件' width='30%' :visible.sync='addMultiDialogFormVisible'>
      <el-upload
        list-type="text"
        ref="upload"
        action=""
        :on-change="beforeUpload"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="1"
        :on-exceed="uploadExceed"
        :headers="uploadHeaders"
        :file-list="fileList"
        :auto-upload="false">
        <el-button type="primary">点击上传</el-button>
      </el-upload>
      <div style='margin-top: 10px'>只能上传xlsx文件，且不超过10M，一次只能上传一个</div>
      <el-button type="success" @click='submitToServer'>上传到服务器</el-button>
      <el-button @click='btnCancel'>取消</el-button>
    </el-dialog>
    <!-- 修改学生 -->
    <el-dialog title="更新学生信息" width="35%" :visible.sync="editDialogFormVisible">
      <el-form :model="editStudentForm" :rules="studentRules" ref="editRuleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editStudentForm.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editStudentForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editStudentForm.sex" class="select">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-col :span="8">
            <el-date-picker type="date" placeholder="选择日期" v-model="editStudentForm.birthday"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="单位" prop="province">
          <el-select v-model="editStudentForm.province" class="select">
            <el-option v-for="item in provinceList" :label="item.name" :value="item.name" :key="item.id"></el-option>
          </el-select>
          /
          <el-input v-model="editStudentForm.department1" style="width: 30%"></el-input>
          /
          <el-input v-model="editStudentForm.department2" placeholder="(可选)" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="editStudentForm.job"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="editStudentForm.major"></el-input>
        </el-form-item>
        <el-form-item label="学历" prop="qualification">
          <el-input v-model="editStudentForm.qualification"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editStudentForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditStudent('editRuleForm')">确 定</el-button>
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { phoneCheck } from '@/utils/validator'
import { getClazzListByTeacherId, getStudentsByClazzId } from '@/network/api/clazz'
import { getProvinces } from '@/network/api/province'
import { addStudent, addStudentFromExcel, deleteUsers, editStudent } from '@/network/api/user'

const validatorPhoneNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入手机号码"))
  } else {
    if (phoneCheck(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的手机号码'))
    }
  }
}

export default {
  inject: ['reload'],
  name: "StudentManage",
  data() {
    return {
      fileList: [],
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      addMultiDialogFormVisible: false,
      clazzId: '',
      options: [],
      studentForm: {
        id: '',
        username: '',
        name: '',
        sex: '',
        birthday: '',
        province: '',
        department1: '',
        department2: '',
        workPlace: '',
        job: '',
        major: '',
        qualification: '',
        phone: ''
      },
      editStudentForm: {
        id: '',
        username: '',
        name: '',
        sex: '',
        birthday: '',
        province: '',
        department1: '',
        department2: '',
        job: '',
        major: '',
        qualification: '',
        phone: ''
      },
      provinceList: [],
      formLabelWidth: '100px',
      studentRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        birthday: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ],
        province: [
          {required: true, message: '请选择省份', trigger: 'change'}
        ],
        job: [
          {required: true, message: '请输入岗位', trigger: 'blur'}
        ],
        major: [
          {required: true, message: '请输入专业', trigger: 'blur'}
        ],
        qualification: [
          {required: true, message: '请输入学历', trigger: 'blur'}
        ],
        phone: [
          {validator: validatorPhoneNum, trigger: 'blur'}
        ],
      },
      tableData: [],
      multipleSelection: [],
      pageInfo: {
        pageNum: 1,     // 当前页码
        pageSize: 10,   // 每页显示的条数
        size: 0,        // 当前页的数量
        startRow: 0,    // 当前页面第一个元素在数据库中的行号
        endRow: 0,      // 当前页面最后一个元素在数据库中的行号
        total: 0,       // 总记录数
        pages: 0        // 总页数
      },
      uploadHeaders: {
        'token': localStorage.getItem('token')
      },
    }
  },
  created() {
    this.getAllProvinces()
    this.getClazzList()
  },
  methods: {
    addStudentBtn() {
      // 如果没有选择班级
      if (typeof this.clazzId !== 'number') {
        this.$message.warning('请选择班级!')
      } else {
        this.addDialogFormVisible = true
      }
    },
    uploadBtn() {
      // 如果没有选择班级
      if (typeof this.clazzId !== 'number') {
        this.$message.warning('请选择班级!')
      } else {
        this.addMultiDialogFormVisible = true
      }
    },
    beforeUpload(file, fileList) {
      const { name, size } = file
      const index = name.lastIndexOf('.')
      const fileType = name.substring(index + 1)
      const acceptFileTypes = ['xlsx']

      // 判断文件类型
      if(!acceptFileTypes.includes(fileType)) {
        this.$notify.error('文件类型错误，请重新上传!')
        return false
      }

      // 判断文件大小
      if(size > 10 * 1024 * 1024) {
        this.$message.error('文件大小超过10M，请重新上传！')
        return false
      }

      this.fileList = fileList
      return true
    },
    handleRemove(file) {
      this.fileList.pop()
      this.$message.success('文件' + file.name + '移除成功!')
    },
    uploadExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getClazzList() {
      let userData = JSON.parse(localStorage.getItem('userData'))
      let teacherId = userData.userId

      getClazzListByTeacherId(teacherId).then(res => {
        if (res.status === '200') {
          let clazzList = res.data.list
          let clazzSelect = []

          clazzList.forEach(item => {
            let option = {}
            // value是id, label是name
            option.value = item.id
            option.label = item.name
            clazzSelect.push(option)
          })

          // 下拉框的默认选项
          // this.defaultVal = clazzSelect[0].value
          this.options = clazzSelect
        }
      })
    },
    changeSelect(value) {
      this.getStudentsByClazzId(value)
    },
    getAllProvinces() {
      getProvinces().then(res => {
        if (res.status === "200") {
          this.provinceList = res.data
        }
      })
    },
    // 根据班级id获取该班级下的所有学生
    getStudentsByClazzId(clazzId) {
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      getStudentsByClazzId(clazzId, currentPage, pageSize).then(res => {
        if (res.status === '200') {
          let tableData = res.data.list
          let data = res.data

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
    submitAddStudent(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let studentForm = this.studentForm
          let workPlace

          if (studentForm.department1 === ' ') {
            this.$message.error('请输入单位名称!')
            return false
          }

          if (studentForm.department2 === ' ') {
            workPlace = studentForm.province + '/' + studentForm.department1
          } else {
            workPlace = studentForm.province + '/' + studentForm.department1
              + '/' + studentForm.department2
          }

          this.studentForm.workPlace = workPlace
          this.studentForm.clazzId = this.clazzId

          this.$confirm('是否为当前班级添加学生?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            addStudent(this.studentForm).then(res => {
              if (res.status === '200') {
                this.$message.success('添加学生成功!')
                this.addDialogFormVisible = false
                this.getStudentsByClazzId(this.clazzId)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消添加'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delStudents() {
      let studentObjs = this.multipleSelection
      let studentIds = []

      studentObjs.forEach(item => {
        studentIds.push(item.id)
      })

      this.$confirm('是否删除学生信息?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUsers(studentIds).then(res => {
          if (res.status === '200') {
            this.$message.success('删除学生成功!')
            this.getStudentsByClazzId(this.clazzId)
          } else {
            this.$message.error("删除学生失败!")
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    editStudent(index, row) {
      // 回显
      this.editStudentForm.id = row.id
      this.editStudentForm.username = row.username
      this.editStudentForm.name = row.name
      this.editStudentForm.sex = row.sex
      this.editStudentForm.birthday = row.birthday
      this.editStudentForm.job = row.job
      this.editStudentForm.major = row.major
      this.editStudentForm.qualification = row.qualification
      this.editStudentForm.phone = row.phone

      let workPlace = row.workPlace

      let province = '', department1 = '', department2 = ''

      let firstIndex = workPlace.indexOf('/')
      let lastIndex = workPlace.lastIndexOf('/')

      // 如果只有一个/
      if (firstIndex === lastIndex) {
        province = workPlace.substring(0, firstIndex)
        department1 = workPlace.substring(firstIndex + 1, workPlace.length)
      } else {
        province = workPlace.substring(0, firstIndex)
        department1 = workPlace.substring(firstIndex + 1, lastIndex)
        department2 = workPlace.substring(lastIndex + 1, workPlace.length)
      }

      this.editStudentForm.province = province
      this.editStudentForm.department1 = department1
      this.editStudentForm.department2 = department2
      this.editDialogFormVisible = true
    },
    submitEditStudent(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let editStudentForm = this.editStudentForm
          let workPlace

          if (editStudentForm.department1 === '') {
            this.$message.error('请输入单位名称!')
            return false
          }

          if (editStudentForm.department2 === '') {
            workPlace = editStudentForm.province + '/' + editStudentForm.department1
          } else {
            workPlace = editStudentForm.province + '/' + editStudentForm.department1
              + '/' + editStudentForm.department2
          }

          this.editStudentForm.workPlace = workPlace
          this.editStudentForm.clazzId = this.clazzId

          editStudent(this.editStudentForm).then(res => {
            if (res.status === '200') {
              this.$message.success('更新学生信息成功!')
              this.editDialogFormVisible = false
              this.getStudentsByClazzId(this.clazzId)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize
      this.getStudentsByClazzId(this.clazzId)
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum
      this.getStudentsByClazzId(this.clazzId)
    },
    submitToServer() {
      let formData = new FormData()
      formData.append('file', this.fileList[0].raw)
      formData.append('clazzId', this.clazzId)

      addStudentFromExcel(formData).then(res => {
        if (res.status === 200) {
          this.$message.success(res.data.msg)
          this.addMultiDialogFormVisible = false
          this.getStudentsByClazzId(this.clazzId)
        }
      })
    },
    btnCancel() {
      this.addMultiDialogFormVisible = false
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

.top {
  display: flex;
  justify-items: center;
}

.select {
  width: 30%;
}

.student-table {
  margin-top: 10px;
}

.button-group {
  margin-left: auto;
}
</style>
