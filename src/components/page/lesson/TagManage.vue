<template>
  <div>
    <el-row type='flex' class='row-bg' justify='start'>
      <el-col :span='1'>
        <el-button
          @click='addTagDiag = true'
          type='primary'>添加
        </el-button>
      </el-col>
    </el-row>
    <br>
    <el-table
      :data='tableData'
      stripe
      style='width: 100%'>
      <el-table-column prop='tag_id' label='序号' width='180'></el-table-column>
      <el-table-column prop='tagName' label='标签名'></el-table-column>
      <el-table-column label='操作' width='200px' align='center'>
        <template slot-scope='scope'>
          <el-button type='primary' @click='editTag(scope.$index, scope.row)'>编辑</el-button>
          <el-button type='danger' @click='delTag(scope.$index, scope.row)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog title='添加标签' :visible.sync='addTagDiag'>
      <el-form :model='form'>
        <el-form-item label='标签名称' :label-width='formLabelWidth'>
          <el-input v-model='form.tagName' autocomplete='off'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='cancelAddTag'>取 消</el-button>
        <el-button type='primary' @click='enterAddTag'>确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title='编辑标签' :visible.sync='editTagDiag'>
      <el-form :model='editForm'>
        <el-form-item label='标签名称' :label-width='formLabelWidth'>
          <el-input v-model='editForm.tagName' autocomplete='off'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='cancelEditTag'>取 消</el-button>
        <el-button type='primary' @click='enterEditTag'>确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { addTag, deleteTag, editTag, getTagsByPage } from '@/network/api/tag'

export default {
  name: 'tagManage',
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        tagName: ''
      },
      editForm: {
        tagName: '',
        tag_id: ''
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        size: 0,
        startRow: 0,
        endRow: 0,
        total: 0,
        pages: 0
      },
      addTagDiag: false,
      editTagDiag: false,
      tableData: [
        {
          tag_id: 1,
          tagName: 'AI'
        },
        {
          tag_id: 2,
          tagName: 'Linux'
        },
        {
          tag_id: 3,
          tagName: '开发'
        },
        {
          tag_id: 4,
          tagName: '运维'
        }
      ]
    };
  },
  created() {
    this.loadTag()
  },
  methods: {
    editTag(index, row) {
      this.editTagDiag = true;
      this.editForm.tagName = row.tagName;
      this.editForm.tag_id = row.tag_id;
    },
    delTag(index, row) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTag(row.tag_id).then(res => {
          if (res.data.code === '200') {
            this.$message({
              message: '删除标签成功!',
              type: 'success'
            })

            this.loadTag()
          } else if (res.data.code === '502') {
            this.$message({
              message: '已有课程使用该标签，不能删除'
            })
          } else {
            this.$message.error('内部错误')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    cancelEditTag() {
      this.editTagDiag = false
      this.editForm.tagName = ''
    },
    async enterEditTag() {
      if (this.editForm.tagName === '') {
        this.$message.error('请输入编辑的内容')
      } else {
        editTag(this.editForm).then(res => {
          if (res.data.code === '200') {
            this.$message.success('编辑标签成功!')
            this.editTagDiag = false
            this.loadTag()
          } else {
            this.$message.error('内部错误!');
          }
        })
      }
    },
    cancelAddTag() {
      this.form.tagName = ''
      this.addTagDiag = false
    },
    enterAddTag() {
      if (this.form.tagName === '') {
        this.$message.error('标签不能为空！')
      } else {
        let num = 0

        for (let i = 0; i < this.tableData.length; i++) {
          if (this.form.tagName === this.tableData[i].tagName) {
            num++
          }
        }

        if (num > 0) {
          this.$message.error('已经存在，请重新添加！')
          this.form.tagName = ''
        } else {
          addTag(this.form).then(res => {
            if (res.data.code === '200') {
              this.$message.success('添加成功！')
              this.addTagDiag = false
              this.loadTag()
            } else {
              this.$message.error('内部错误')
              this.addTagDiag = false
            }
          })
        }
      }
    },
    //改变每页显示的数据条数
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.loadTag();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.loadTag();
    },
    loadTag() {
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      getTagsByPage(currentPage, pageSize).then(res => {
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
    }
  }
}
</script>

<style scoped>

</style>
