<template>
  <el-row>
    <el-row type='flex' class='row-bg' justify='start'>
      <el-col :span='2'>
        <el-button @click='addToolsDiag = true' type='primary'>添加</el-button>
      </el-col>
      <el-col :span='2'>
        <el-button @click='deleteTools()' type='danger'>删除</el-button>
      </el-col>
      <el-col :span='4'>
        <el-input
          placeholder='请根据软件名进行检索'
          v-model='tool_name'
          maxlength='50'
          show-word-limit
          clearable>
        </el-input>
      </el-col>
      <el-col :span='3'>
        <el-button type='primary' icon='el-icon-search' @click='handleSearch'>搜索</el-button>
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
      <el-table-column prop='tool_name' label='软件名' width='500px'></el-table-column>
      <el-table-column prop='tool_env' label='运行环境' width='150px'></el-table-column>
      <el-table-column prop='upload_time' label='上传时间' width='150px'></el-table-column>
      <el-table-column label='操作' width='200px' align='center'>
        <template slot-scope='scope'>
          <el-button type='primary' @click='testDownLoad(scope.$index, scope.row)'>测试下载</el-button>
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
              :total='pageInfo.total'>
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title='添加工具'
      :visible.sync='addToolsDiag'
      width='50%'
      :before-close='handleClose'>
      <el-form :model='addToolForm' :rules='rules' ref='addToolForm'>
        <el-form-item label='软件名称' :label-width='formLabelWidth' prop='tool_name'>
          <el-input v-model='addToolForm.tool_name' style='width: 90%'></el-input>
        </el-form-item>
        <el-form-item label='运行环境' :label-width='formLabelWidth' prop='tool_env'>
          <el-input v-model='addToolForm.tool_env' style='width: 90%'></el-input>
        </el-form-item>
        <el-form-item label='上传工具'>
          <!-- Todo 上传文件Bug -->
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
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addCancel'>取 消</el-button>
        <el-button type='primary' @click="addTools('addToolForm')">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import { addTool, deleteTools, findToolByName, getAllTools } from '@/network/api/tool'

export default {
  inject: ['reload'],
  data() {
    return {
      rules: {
        tool_name: [
          { required: true, message: '工具名不能为空', trigger: 'blur' }
        ],
        tool_env: [
          { required: true, message: '运行环境不能为空', trigger: 'blur' }
        ]
      },
      uploadHeaders: { 'token': localStorage.getItem('token') },
      fileList: [],
      addToolsDiag: false,
      name: '',
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
      addToolForm: {
        tool_name: '',
        tool_env: '',
        download_url: ''
      },
      username: '',
      tool_name: '',
      formLabelWidth: '80px',
      uploadAttachment: 'http://10.0.7.205:8089/back/uploadAttachmentPPT'
    };
  },
  created() {
    this.getData();
    this.uploadAttachment = this.$root.URL + '/back/uploadTools'
  },

  methods: {
    addCancel() {
      this.addToolsDiag = false
      this.addToolForm = {}
    },
    addTools(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addTool(this.addToolForm).then(res => {
            if (res.status === '200') {
              this.$message.success('上传成功!')
              this.addToolsDiag = false
              this.addToolForm = {}
              this.reload()
            } else {
              this.$message.error('上传失败!')
            }
          })
        } else {
          console.log('error submit!!')
          this.$message.error('上传失败')
        }
      })
    },
    testDownLoad(index, row) {
      window.open(row.download_url)
    },
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
          realName: '',
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
    async handleSearch() {
      let toolName = this.tool_name
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      findToolByName(toolName, currentPage, pageSize).then(res => {
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
    getData() {
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      getAllTools(currentPage, pageSize).then(res => {
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
    handleRemove(file, fileList) {
      this.addToolForm.download_url = '';
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一个文件！');
    },
    handleSuccess(res, file) {
      this.addToolForm.download_url = file.response.data;
    },
    deleteTools() {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择删除的软件!');
      } else {
        this.$confirm('此操作将删除软件工具, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let toolObjs = this.multipleSelection
          let toolIds = []

          toolObjs.forEach(item => {
            toolIds.push(item.tool_id)
          })

          deleteTools(toolIds).then(res => {
            if (res.status === '200') {
              this.$message.success('删除工具成功!')
              this.reload()
            } else {
              this.$message.error('删除工具失败!')
            }
          })
        }).catch(() => {
          this.$message.info('取消删除!')
        })
      }
    }
  }
}
</script>

<style>
.el-upload--text {
  width: 100px;
  height: 40px;
  border: none;
}
</style>
