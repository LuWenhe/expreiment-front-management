<template>
  <el-row class='clazz-box'>
    <!-- 头部 -->
    <el-row class='top'>
      <el-button type='primary' @click='addClazz'>添加班级</el-button>
    </el-row>
    <!-- 表格部分 -->
    <el-row class='table'>
      <el-table
        class='clazz-table'
        :data='clazzTableData'
        border
      >
        <el-table-column type='selection' width='55px'></el-table-column>
        <el-table-column type='index' label='序号' width='100px'></el-table-column>
        <el-table-column prop='name' label='班级名' width='150px'></el-table-column>
        <el-table-column prop='size' label='最大人数' width='150px'></el-table-column>
        <el-table-column label='操作' width='200px' align='center'>
          <template slot-scope='scope'>
            <el-button type='primary' @click='editClazz(scope.$index, scope.row)'>编辑</el-button>
            <el-button type='danger' @click='delClazz(scope.$index, scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 添加班级 -->
    <el-dialog title='添加班级' width='20%' :visible.sync='addDialogFormVisible'>
      <el-form :model='clazzForm' label-width='100px'>
        <el-form-item label='班级名称' prop='name'>
          <el-input v-model='clazzForm.name' class='clazz-input'></el-input>
        </el-form-item>
        <el-form-item label='班级人数' prop='size'>
          <el-select v-model='clazzForm.size'>
            <el-option
              v-for='item in clazzSizeList'
              :label='item'
              :value='item'
              :key='item'>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClazz">确 定</el-button>
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改班级信息 -->
    <el-dialog title='更新班级信息' width='20%' :visible.sync='editDialogFormVisible'>
      <el-form :model='editClazzForm' label-width='100px'>
        <el-form-item label='班级名' prop='name'>
          <el-input v-model='editClazzForm.name' class='clazz-input'></el-input>
        </el-form-item>
        <el-form-item label='最大人数' prop='size'>
          <el-select v-model='editClazzForm.size'>
            <el-option
              v-for='item in clazzSizeList'
              :label='item'
              :value='item'
              :key='item'>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditClazz">确 定</el-button>
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { addClazz, getClazzList, updateClazz } from '@/network/api/clazz'
import { deleteStudentsAndClazzByClazzId } from '@/network/api/user'

export default {
  name: 'ClazzManage',
  data() {
    return {
      clazzTableData: [],
      teacherId: '',
      roleId: '',
      pageInfo: {
        pageNum: 1,     // 当前页码
        pageSize: 10,   // 每页显示的条数
        size: 0,        // 当前页的数量
        startRow: 0,    // 当前页面第一个元素在数据库中的行号
        endRow: 0,      // 当前页面最后一个元素在数据库中的行号
        total: 0,       // 总记录数
        pages: 0        // 总页数
      },
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      clazzForm: {
        id: '',
        name: '',
        size: '',
        teacherId: ''
      },
      editClazzForm: {
        id: '',
        name: '',
        size: '',
        teacherId: ''
      },
      clazzSizeList: []
    }
  },
  created() {
    let userData = JSON.parse(localStorage.getItem('userData'))

    this.teacherId = userData.userId
    this.roleId = userData.roleId

    this.getClazzList()
    this.initClazzSize()
  },
  methods: {
    getClazzList() {
      let pageRequest = {
        userId: this.teacherId,
        roleId: this.roleId,
        currentPage: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }

      getClazzList(pageRequest).then(res => {
        if (res.status === '200') {
          let tableData = res.data.list
          let data = res.data

          if (tableData != null) {
            this.clazzTableData = tableData

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
    editClazz(index, row) {
      this.editClazzForm.id = row.id
      this.editClazzForm.name = row.name
      this.editClazzForm.size = row.size
      this.editDialogFormVisible = true
    },
    delClazz(index, row) {
      this.$confirm('是否删除当前班级以及班级下的所有学生?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let clazzId = row.id

        deleteStudentsAndClazzByClazzId(clazzId).then(res => {
          if (res.status === '200') {
            this.$message.success('删除班级以及班级下的所有学生成功!')
            this.getClazzList()
          } else {
            this.$message.error('删除失败!')
          }
        })
      })
    },
    addClazz() {
      this.addDialogFormVisible = true
    },
    initClazzSize() {
      for (let i = 1; i <= 100; i++) {
        this.clazzSizeList.push(i)
      }
    },
    submitClazz() {
      this.clazzForm.teacherId = this.teacherId

      this.$confirm("是否添加当前班级?", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addClazz(this.clazzForm).then(res => {
          if (res.status === '200') {
            this.$message.success('添加班级成功!')
            this.addDialogFormVisible = false
            this.getClazzList()
          } else {
            this.$message.error('添加班级失败!')
          }
        })
      })
    },
    submitEditClazz() {
      updateClazz(this.editClazzForm).then(res => {
        if (res.status === '200') {
          this.$message.success('更新班级信息成功!')
          this.editDialogFormVisible = false
          this.getClazzList()
        } else {
          this.$message.error('更新班级信息失败!')
        }
      })
    }
  }
}
</script>

<style>
  .table {
    margin-top: 10px;
  }

  .clazz-input {
    width: 88%;
  }
</style>
