<template>
  <el-row class="student-manage-box" justify="start">
    <el-row class="top">
      <el-col :span="1">
        <el-button type="primary" @click="addDialogFormVisible = true">添加</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="danger" @click="delStudents">删除</el-button>
      </el-col>
      <el-col :span="2">
        <el-upload
          class=""
          ref="upload"
          :action="uploadUrl"
          :on-change="beforeUpload"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="uploadExceed"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :headers="uploadHeaders"
          :file-list="fileList"
          :auto-upload="false">
          <el-button type="primary" @click="upload">上传文件</el-button>
          <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过10M，一次只能上传一个</div>
        </el-upload>
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="submitUpload">上传到服务器</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        border
        class="student-table"
        ref="multipleTable"
        stripe
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="序号" width="150px"></el-table-column>
        <el-table-column prop="name" label="姓名" width="150px"></el-table-column>
        <el-table-column prop="sex" label="性别" with="150px"></el-table-column>
        <el-table-column prop="birthday" label="生日" width="150px"></el-table-column>
        <el-table-column prop="workPlace" label="单位" width="150px"></el-table-column>
        <el-table-column prop="job" label="岗位" width="150px"></el-table-column>
        <el-table-column prop="major" label="专业" width="150px"></el-table-column>
        <el-table-column prop="qualification" label="学历" width="150px"></el-table-column>
        <el-table-column prop="phone" label="手机" width="150px"></el-table-column>
        <el-table-column label="操作" width="200px" adlign="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="editStudent(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
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
    <!-- 添加学生 -->
    <el-dialog class="student-dialog" title="添加学生" width="35%" :visible.sync="addDialogFormVisible">
      <el-form :model="studentForm" :rules="studentRules" ref="addRuleForm" label-width="100px">
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
          </el-select>
          /
          <el-input v-model="studentForm.department1" style="width: 30%"></el-input>
          /
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
    <!-- 修改学生 -->
    <el-dialog class="student-dialog" title="更新信息" width="35%" :visible.sync="editDialogFormVisible">
      <el-form :model="editStudentForm" :rules="studentRules" ref="editRuleForm" label-width="100px">
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
import {phoneCheck} from "@/utils/validator"
import {post, get} from "@/api"

const validatorPhoneNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入手机号码"));
  } else {
    if (phoneCheck(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号码'))
    }
  }
}

export default {
  inject: ['reload'],
  name: "StudentNewManage",
  data() {
    return {
      fileList: [],
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      studentForm: {
        id: '',
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
      uploadUrl: this.$root.URL + '/userBack/uploadFromExcel',
      uploadHeaders: {
        "token": localStorage.getItem('token')
      }
    }
  },
  created() {
    this.getAllStudents()
    this.getAllProvinces()
  },
  methods: {
    beforeUpload(file, fileList) {
      const { name, size } = file
      const index = name.lastIndexOf('.')

      const fileType = name.substr(index + 1)
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
    handleRemove(file, fileList) {
      this.fileList.pop()
      this.$message.success('文件' + file.name + '移除成功!')
    },
    uploadExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    uploadSuccess(res) {
      if (res.code === '200') {
        this.$message.success('文件上传成功!')
        this.reload()
      }
    },
    uploadError(res) {
      if (res.code !== '200') {
        this.$message.error('文件上传失败!');
      }
    },
    getAllProvinces() {
      let url = this.$root.URL + '/getAllProvinces'

      get(url).then(res => {
        if (res.data.code === "200") {
          this.provinceList = res.data.data
        }
      })
    },
    getAllStudents() {
      let path = this.$root.URL + '/userBack/getStudents'

      let obj = {
        currentPage: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }

      post(path, obj).then(res => {
        if (res.status === 200) {
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
          let url = this.$root.URL + '/userBack/addOneStudent'
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

          post(url, this.studentForm).then(res => {
            if (res.data.code === '200') {
              this.$message.success('添加成功!')
              this.addDialogFormVisible = false
              this.reload()
            }
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

      let url = this.$root.URL + '/userBack/deleteStudents'
      let ids = JSON.stringify(studentIds)

      this.$confirm('是否删除学生信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post(url, ids).then(res => {
          if (res.data.code === '200') {
            this.$message.success('删除成功')
            this.reload()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    upload() {

    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    editStudent(index, row) {
      this.editStudentForm.id = row.id
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

      this.editDialogFormVisible = true;
    },
    submitEditStudent(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = this.$root.URL + '/userBack/editStudentInfo'
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

          post(url, this.editStudentForm).then(res => {
            if (res.data.code === '200') {
              this.$message.success('更新成功!')
              this.editDialogFormVisible = false
              this.reload()
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
      this.getAllStudents()
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum
      this.getAllStudents()
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
  }
}
</script>

<style scoped>
.top {
  display: flex;
  justify-content: left;
  justify-items: center;
}

.select {
  width: 30%;
}

.student-table {
  margin-top: 10px;
}
</style>
