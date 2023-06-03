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
          v-model='realName'
          maxlength='20'
          show-word-limit
          clearable
        >
        </el-input>
      </el-col>
      &nbsp; &nbsp;
      <el-col :span='3'>
        <el-button
          type='primary'
          icon='el-icon-search'
          @click='handleSearch'
        >搜索
        </el-button>

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
      <el-table-column
        type='selection'
        width='55'>
      </el-table-column>
      <el-table-column
        type='index'
        label='序号'
        width='150px'>
      </el-table-column>
      <el-table-column
        prop='username'
        label='用户名'
        width='150px'

      ></el-table-column>
      <el-table-column
        prop='realName'
        label='真实姓名'
        width='150px'

      ></el-table-column>
      <el-table-column
        prop='phone'
        label='电话'
        width='150px'

      ></el-table-column>
      <el-table-column
        prop='email'
        label='邮箱'
        width='150px'

      ></el-table-column>
      <el-table-column
        prop='created_time'
        label='账号创建时间'
        width='150px'
        sortable
      ></el-table-column>
      <el-table-column
        label='操作'
        width='200px'
        align='center'
      >
        <template slot-scope='scope'>

          <el-button
            type='primary'
            @click='handleEdit(scope.$index, scope.row)'
          >编辑
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <div
      class='block'
      style='margin:5px 0 0 848px'
    >
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
          <el-form-item label='真实姓名' prop='realName'>
            <el-input v-model=addTeacherInfo.realName></el-input>
          </el-form-item>
          <el-form-item label='联系方式' prop='phone'>
            <el-input v-model=addTeacherInfo.phone></el-input>
          </el-form-item>
          <el-form-item label='邮箱' prop='email'>
            <el-autocomplete
              v-model='addTeacherInfo.email'
              :fetch-suggestions='querySearchEmail'
              :trigger-on-focus='false'
              placeholder='输入邮箱'
            >
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
          <el-form-item label='真实姓名' prop='realName'>
            <el-input v-model=editTeacherInfo.realName></el-input>
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
import axios from 'axios';
import { ChineseCheck, emailCheck, phoneCheck } from '../../../utils/validator';
import { post } from '@/api';

const validatorPhoneNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号码'));
  } else {
    if (phoneCheck(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号码'));
    }
  }
};
const validatorEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入邮箱'));
  } else {
    if (emailCheck(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号码'));
    }
  }
};
const validatorChinese = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入手机号码'));
  } else {
    if (ChineseCheck(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号码'));
    }
  }
};
export default {
  inject: ['reload'],
  data() {
    return {
      rules: {
        phone: [
          { validator: validatorPhoneNum, required: true, trigger: 'blur' }
        ],
        realName: [
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
        realName: '',
        phone: '',
        email: ''
      },
      editTeacherInfo: {
        user_id: '',
        username: '',
        realName: '',
        phone: '',
        email: '',
        password: '',
        repeatPassword: ''
      },
      realName: '',
      waitLoading: false,
      uploadAttachment: '',
      uploadHeaders: { 'token': localStorage.getItem('token') },
      fileList: []

    };
  },
  created() {
    this.getData();
    this.uploadAttachment = this.$root.URL + '/back/uploadExcelImport';
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
      ];
      let results = [];
      let queryList = [];
      emailList.map(item => {
        queryList.push({ value: queryString.split('@')[0] + item.value });
      });
      results = queryString ? queryList.filter(this.createFilter(queryString)) : queryList;
      callback(results);
    },

// 邮箱填写过滤
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },


    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.addTeacherInfo = {
            username: '',
            realName: '',
            phone: '',
            email: ''
          };


        })
        .catch(_ => {
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },


    //改变每页显示的数据条数
    handleSizeChange(pageSize) {
      // console.log(`每页 ${val} 条`);
      this.pageInfo.pageSize = pageSize;
      this.getData();
    },

    /**
     * 第n页
     * @param pageNum
     */
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${val}`);
      this.pageInfo.pageNum = pageNum;
      this.getData();
    },
    async handleSearch() {
      const url = this.$root.URL + '/userBack/findTeacherByName';
      await post(url, {
        realName: this.realName,
        currentPage: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo = {
          // 当前页数
          pageNum: res.data.pageNum,
          // 每页数量
          pageSize: res.data.pageSize,
          // 当前页数量
          size: res.data.size,
          // 当前页面第一个元素在数据库中的行号
          startRow: res.data.startRow,
          // 当前页面最后一个元素在数据库中的行号
          endRow: res.data.endRow,
          // 总记录数
          total: res.data.total,
          // 总页数
          pages: res.data.pages
        };
        this.tableData = res.data.list;


      });


    },
    getData() {
      let path = this.$root.URL + '/userBack/getAllTeachers';
      let token = localStorage.getItem('token');
      axios.post(path, { token: token, currentPage: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize },
        {
          headers: {
            'content-type': 'application/json',
            'token': token
          }
        }
      ).then((res) => {
        if (res && res.data) {
          if (res.data.list) {
            this.pageInfo = {
              // 当前页数
              pageNum: res.data.pageNum,
              // 每页数量
              pageSize: res.data.pageSize,
              // 当前页数量
              size: res.data.size,
              // 当前页面第一个元素在数据库中的行号
              startRow: res.data.startRow,
              // 当前页面最后一个元素在数据库中的行号
              endRow: res.data.endRow,
              // 总记录数
              total: res.data.total,
              // 总页数
              pages: res.data.pages
            };
            this.tableData = res.data.list;
          }
        } else {

          this.$message({
            message: '没有权限'
          });
        }
      });
    },
    //新增教师
    addTeacher(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          console.log(JSON.stringify(this.addTeacherInfo));
          let path = this.$root.URL + '/userBack/addTeacher';
          let token = localStorage.getItem('token');

          const loading = this.$loading({
            lock: true,
            text: '正在努力添加',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(() => {
            axios.post(path, this.addTeacherInfo,
              {
                headers: {
                  'content-type': 'application/json',
                  'token': token
                }
              }
            ).then((res) => {
              if (res.data) {
                if (res.data.code === '200') {
                  this.$message({
                    message: '添加教师成功',
                    type: 'success'
                  });
                  this.addTeacherDiag = false;
                  this.addTeacherInfo = {};
                  this.reload();
                }
              } else {
                this.$message({
                  message: '内部服务器出错',
                  type: 'error'
                });
              }

            });
            loading.close();
          }, 2000);


        } else {
          console.log('error submit!!');
          this.$message.error('表单填写错误，添加失败');
        }
      });
    },
    cancelAdd() {
      this.addTeacherDiag = false;
      this.addTeacherInfo = {
        username: '',
        realName: '',
        phone: '',
        email: ''
      };

    },

    handleEdit(index, row) {

      console.log(JSON.stringify(row));
      this.editTeacherInfo.user_id = row.user_id;
      this.editTeacherInfo.username = row.username;
      this.editTeacherInfo.realName = row.realName;
      this.editTeacherInfo.email = row.email;
      this.editTeacherInfo.phone = row.phone;
      this.editTeacherDiag = true;

    },
    editTeacher(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(JSON.stringify(this.editTeacherInfo));
          let path = this.$root.URL + '/userBack/editTeacher';
          let token = localStorage.getItem('token');
          axios.post(path, this.editTeacherInfo,
            {
              headers: {
                'content-type': 'application/json',
                'token': token
              }
            }
          ).then((res) => {
            if (res.data) {
              if (res.data.code === '200') {
                this.$message({
                  message: '编辑教师成功',
                  type: 'success'
                });
                this.editTeacherDiag = false;

                this.reload();
              }
            } else {
              this.$message({
                message: '内部服务器出错',
                type: 'error'
              });
            }

          });
        } else {
          console.log('error submit!!');
          this.$message.error('表单填写错误，添加失败');
        }
      });
    },
    cancelEdit() {
      this.editTeacherDiag = false;
    },
    deleteTeacher() {

      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择删除的用户!');

      } else {
        console.log(JSON.stringify(this.multipleSelection));
        let token = localStorage.getItem('token');
        let path = this.$root.URL + '/userBack/deleteUser';
        axios.post(
          path,
          {
            deleteRow: JSON.stringify(this.multipleSelection)
          },
          {
            headers: {
              'dataType': 'json',
              'token': token
            }
          }
        ).then((res) => {
          if (res.data.code === '200') {
            console.log('成功');
            this.$message({
              message: '操作成功'
            });
            this.reload();
          } else {
            this.$message({
              message: '删除失败'
            });

          }
        });
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.addToolForm.download_url = '';
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning('只能上传一个文件！');
    },

    handleSuccess(res, file) {
      console.log(file.response);
      if (file.response.code === '200') {
        this.$message.success('导入用户表格成功');
        this.reload();
      }
      // this.addToolForm.download_url = file.response.data;

    }


  }
};
</script>

<style>
.el-upload--text {
  width: 80px;
  height: 33px;
  border: none;
}

</style>
