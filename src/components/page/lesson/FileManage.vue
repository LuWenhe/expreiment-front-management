<template>
  <el-row class='file-manage-container'>
    <!-- 顶部 -->
    <el-row class='top'>
      <el-row class='input'>
        <span>请选择小节：</span>
        <TreeSelect
          class='tree-select'
          v-model='value'
          :options='options'
          :normalizer='normailzer'
          placeholder='请选择小节'
          :appendToBody='true'
          :default-expand-level='3'
          @select='selectNode'
        >
        </TreeSelect>
      </el-row>
      <el-row class='button-group'>
        <el-button type='success' @click='addFileBtn'>上传文件</el-button>
        <el-button type="danger" @click="deleteJupyters">删除多个</el-button>
      </el-row>
    </el-row>
    <!-- 内容部分 -->
    <el-row class='content'>
      <el-table
        :data='jupyterTableData'
        border
        ref='multipleTable'
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type='index' label="序号" width="100px"></el-table-column>
        <el-table-column prop='name' label='名称' width='200px'></el-table-column>
        <el-table-column prop='createTime' label='创建时间' width='200px'></el-table-column>
        <el-table-column prop='updateTime' label='更新时间' width='200px'></el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="editJupyterFile(scope.$index, scope.row)">编辑</el-button>
            <el-button type="primary" @click="deleteJupyterFile(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 上传文件 -->
    <el-dialog title='上传文件' width='30%' :visible.sync='addFileDialogVisible'>
      <el-upload
        action=''
        list-type='text'
        :on-change='beforeUpload'
        :on-remove='handleRemove'
        :before-remove='beforeRemove'
        :file-list='fileList'
        :auto-upload='false'
      >
        <el-button type='primary'>点击上传</el-button>
      </el-upload>
      <el-row>只能上传.ipynb或者.py文件</el-row>
      <el-button class='submit-btn' type="success" @click='submitToServer'>上传到服务器</el-button>
      <el-button @click='btnCancel'>取消</el-button>
    </el-dialog>
  </el-row>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { deleteJupyterFiles, getChapterInfo, getJupyterFiles, uploadLessonFile } from '@/network/api/backLesson';
import { deleteUsers } from '@/network/api/user';

export default {
  name: 'FileManage',
  components: {
    TreeSelect
  },
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
      value: null,
      options: [],
      normailzer(node) {
        if (node.children === null) {
          delete node.children
        }

        return {
          id: node.id,
          label: node.name,
          children: node.sonChapterList
        }
      },
      rootToNodePath: '',
      jupyterTableData: [],
      sonId: '',
      chapterName: '',
      addFileDialogVisible: false,
      fileForm: {},
      fileList: [],
    }
  },
  created() {
    this.getLessonTrees(this.lessonObj.lessonId)
  },
  methods: {
    getLessonTrees(lessonId) {
      getChapterInfo(lessonId).then(res => {
        if (res.status === '200') {
          let chapterData = res.data

          if (chapterData != null && chapterData.length > 0) {
            chapterData.forEach(item => {
              // 章节节点
              item.type = 1
              let sonList = item.sonChapterList

              if (sonList != null && sonList.length > 0) {
                sonList.forEach(sonData => {
                  // 小节节点
                  sonData.type = 2
                })
              } else {
                item.sonChapterList = null
              }
            })
          } else {
            this.$message.error('该门课还没添加章节!')
          }

          this.options = chapterData
        } else {
          this.$message.error('加载失败')
        }
      });
    },
    selectNode(node) {
      if (node.type === 1) {
        this.$message.warning('请选择小节!')
        return false
      }

      let rootPath = this.lessonObj.lesson_name + '/'
      this.rootToNodePath = this.getParentPath(this.options, node, rootPath)
      this.sonId = node.id
      this.chapterName = node.name
      this.getJupyterFiles(node.id)
    },
    // 获取当前结点的父结点
    getParentPath(treeData, node, rootPath) {
      return this.dep(treeData, node, rootPath)
    },
    dep(treeData, selNode, rootPath) {
      // 循环树数据源
      for (let i = 0; i < treeData.length; i++) {
        let treeNode = treeData[i]

        // 如果是子章节
        if (treeNode.id === selNode.id) {
          return treeNode.name
        } else if (treeNode.id === selNode.chapter_id) {
          let path = this.dep(treeNode.sonChapterList, selNode, rootPath)
          rootPath += treeNode.name + '/' + path
        }
      }

      return rootPath
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getJupyterFiles(sonId) {
      getJupyterFiles(sonId).then(res => {
        if (res.status === '200') {
          this.jupyterTableData = res.data
        }
      })
    },
    editJupyterFile(index, row) {
      console.log(index, row)
    },
    deleteJupyterFile(index, row) {
      console.log(index, row)
    },
    beforeUpload(file, fileList) {
      let { name, size } = file
      let index = name.lastIndexOf('.')
      let fileType = name.substring(index)
      let acceptFileTypes = ['.ipynb', '.py']

      // 判断文件类型
      if(!acceptFileTypes.includes(fileType)) {
        return this.$notify.error('文件类型错误，请重新上传!')
      }

      this.fileList = fileList
      return true
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file) {
      this.fileList.pop()
      this.$message.success('文件' + file.name + '移除成功!')
    },
    addFileBtn() {
      if (this.rootToNodePath === '') {
        this.$message.warning('请选择需要上传文件的小节!')
      } else {
        this.addFileDialogVisible = true
      }
    },
    deleteJupyters() {
      let jupyterObjs = this.multipleSelection
      let jupyterIds = [], jupyterNames = []

      jupyterObjs.forEach(item => {
        jupyterIds.push(item.id)
        jupyterNames.push(this.rootToNodePath + '/' + item.name)
      })

      this.$confirm('是否删除Jupyter文件?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let jupyterFileObj = {
          jupyterIds: jupyterIds,
          jupyterPaths: jupyterNames
        }

        deleteJupyterFiles(jupyterFileObj).then(res => {
          if (res.status === '200') {
            this.$message.success('删除Jupyter文件成功!')
            this.getJupyterFiles(this.sonId)
          } else {
            this.$message.error('删除Jupyter文件失败!')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitToServer() {
      if (this.fileList.length === 0) {
        return this.$message.warning('请选取文件后再上传!')
      }

      let formData = new FormData()

      this.fileList.forEach(file => {
        formData.append('files', file.raw)
      })

      formData.append('path', this.rootToNodePath)
      formData.append('sonId', this.sonId)
      formData.append('lessonId', this.lessonObj.lessonId)

      uploadLessonFile(formData).then(res => {
        if (res.status === '200') {
          this.$message.success(res.msg)
          this.getJupyterFiles(this.sonId)
        } else {
          this.$message.error(res.msg)
        }

        this.addFileDialogVisible = false
      })
    },
    btnCancel() {
      this.addFileDialogVisible = false
    }
  }
}
</script>

<style scoped>
.file-manage-container {
  width: 100%;
}

.file-manage-container .top {
  display: flex;
  justify-items: center;
}

.file-manage-container .top .input {
  display: flex;
  align-items: center;
}

.file-manage-container .top .button-group {
  display: flex;
}

.tree-select {
  width: 25%;
}

.file-manage-container .content {
  padding: 0;
  margin-top: 10px;
}

.submit-btn {
  margin-top: 10px;
}
</style>
