<template>
  <div>
    <el-table
      :data='tableData'
      border
      class='table'
      ref='multipleTable'
      stripe
      header-cell-class-name='table-header'
      @selection-change='handleSelectionChange'>
      <el-table-column type='selection' width='55'></el-table-column>
      <el-table-column prop='id' label='序号' width='130px' sortable></el-table-column>
      <el-table-column label='照片' width='200px' align='center'>
        <template slot-scope='scope'>
          <viewer :images='imgList'>
            <img :src=scope.row.banner_url style='height:3rem;width:3rem;' alt=''>
          </viewer>
        </template>
      </el-table-column>
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
      <!-- 编辑弹出框 -->
      <el-dialog
        title='轮播图片修改'
        :visible.sync='dialogVisible'
        width='70%'
        :before-close='handleClose'>
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
          :headers='uploadHeaders'>
          <i class='el-icon-plus'></i>
        </el-upload>
        <span slot='footer' class='dialog-footer'>
          <el-button @click='cancelEdit()'>取 消</el-button>
          <el-button type='primary' @click='updateBanner'>确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import bannerEdit from '@/components/page/sys/bannerEdit'
import { getAllBanners, updateBanner } from '@/api/system'

export default {
  inject: ['reload'],
  data() {
    return {
      banner_temp_url: '',
      fileListFront: [], // 照片列表
      imgLimit: 1, // 上传照片数
      uploadImgServer: '',
      hideUpload: false,
      fileList: [],
      name: '',
      dialogVisible: false,
      addVisible: false,
      dialogdata: {
        banner_url: '',
        id: ''
      },
      multipleSelection: [],
      tableData: [],
      order_num: '',
      pre_order_id: '',
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
      selectObj: {
        // 选项的对应识别号
        value: '',
        // 搜索框输入的内容
        input: ''
      },
      dialog_form: {
        banner_id: '',
        banner_url: ''
      },
      pic_url: '',
      src: '',
      price_id: '',
      imgList: [],
      banner_url: '',
      uploadHeaders: { 'token': localStorage.getItem('token') }
    }
  },
  created() {
    this.getData()
    this.uploadImgServer = this.$root.URL + '/lesson/addLessonPic'
  },
  components: {
    bannerEdit
  },
  methods: {
    /**文件超出个数限制时的钩子 */
    handleExceed() {
      this.$message.error(`只能选择${this.imgLimit}个文件`)
    },
    /**上传文件之前的钩子函数 */
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('仅支持jpg，png格式的图片！')
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    },
    /**上传成功后的钩子函数 */
    handleAvatarSuccess(res, file) {
      this.fileListFront.push(file)
      this.dialogdata.banner_url = file.response.data
      this.hideUpload = true
    },
    /**查看图片 */
    handlePictureCardPreview(file) {

    },
    handleRemove(file, fileList) {
      this.fileListFront.some((item, i) => {
        if (item.name === file.name) {
          this.fileListFront.splice(i, 1)
          return true
        }
      })

      this.hideUpload = fileList.length >= this.imgLimit
      this.dialogdata.banner_url = ''
    },
    handlePreview(file) {
      console.log(file);
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        this.fileListFront = [];
        done()
      }).catch(res => {
        console.log(res)
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
    getData() {
      let currentPage = this.pageInfo.pageNum
      let pageSize = this.pageInfo.pageSize

      getAllBanners(currentPage, pageSize).then(res => {
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
    handleEdit(index, row) {
      this.dialogVisible = true;
      this.hideUpload = true;
      this.fileListFront.push({ name: 'xxx', url: row.banner_url.split(',')[0] });   //在el-upload中回显后台返回的地址
      this.dialogdata.id = row.id;
      this.dialogdata.banner_url = row.banner_url;
    },
    cancelEdit() {
      this.dialogVisible = false
      this.fileListFront = []

      this.dialogdata = {
        id: '',
        banner_url: ''
      };
    },
    updateBanner() {
      updateBanner(this.dialogdata).then(res => {
        if (res.data.code === '200') {
          this.$message.success('更新轮播图成功!')
          this.dialogVisible = false
          this.getData()
        } else {
          this.$message.error('更新轮播图失败!')
        }
      })
    }
  }
}
</script>

<style>


</style>
