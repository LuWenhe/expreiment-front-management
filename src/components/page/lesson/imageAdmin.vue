<template>
    <div>
        <el-row type="flex" class="row-bg" justify="start">
            <el-col :span="2">
                <el-button @click="addToolsDiag = true" type="primary">添加</el-button>
            </el-col>
            <el-col :span='2'>
                <el-button @click='deleteTools()' type='danger'>删除</el-button>
            </el-col>
            <el-col :span="4">
                <el-input
                    placeholder="请根据软件名进行检索"
                    v-model="tool_name"
                    maxlength="50"
                    show-word-limit
                    clearable
                >
                </el-input>
            </el-col>
            &nbsp; &nbsp;
            <el-col :span="3">
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch"
                >搜索</el-button>

            </el-col>
        </el-row>
        <br>
        <el-table
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            stripe
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                type="index"
                label="序号"
                width="150px">
            </el-table-column>
            <el-table-column
                prop="tool_name"
                label="软件名"
                width="500px"

            ></el-table-column>

            <el-table-column
                prop="tool_env"
                label="运行环境"
                width="150px"

            ></el-table-column>
            <el-table-column
                prop="upload_time"
                label="上传时间"
                width="150px"
            ></el-table-column>
            <el-table-column
                label="操作"
                width="200px"
                align="center"
            >
                <template slot-scope="scope">

                    <el-button
                        type="primary"
                        @click="testDownLoad(scope.$index, scope.row)"
                    >测试下载</el-button>

                </template>
            </el-table-column>
        </el-table>

        <div
            class="block"
            style="margin:5px 0 0 848px"
        >
            <el-row>
                <el-col>
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageInfo.pageNum"
                            :page-sizes="[10, 50, 100, 500]"
                            :page-size="pageInfo.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageInfo.total"
                        >
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>




        </div>
        <el-dialog
            title="添加工具"
            :visible.sync="addToolsDiag"
            width="50%"
            :before-close="handleClose">
            <el-form :model="addToolForm" :rules='rules' ref='addToolForm'>
                <el-form-item label="软件名称" :label-width="formLabelWidth" prop='tool_name'>
                    <el-input v-model="addToolForm.tool_name" style='width: 90%'></el-input>
                </el-form-item>
                <el-form-item label="运行环境" :label-width="formLabelWidth" prop='tool_env'>
                    <el-input v-model="addToolForm.tool_env" style='width: 90%'></el-input>
                </el-form-item>
                <el-form-item label="上传工具"  >
                    <el-upload
                        list-type="text"
                        :action="uploadAttachment"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :file-list="fileList"
                        :headers="uploadHeaders"
                    ><el-button slot="trigger"  size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                    <el-button @click="addCancel">取 消</el-button>
                    <el-button type="primary" @click="addTools('addToolForm')">确 定</el-button>
            </span>

        </el-dialog>
    </div>

</template>

<script>
import axios from 'axios';
import { get, post } from '@/api';
export default {
    inject: ['reload'],
    data() {
        return {
            rules: {
                tool_name: [
                    {required:true,message:'工具名不能为空',trigger:'blur'}
                ],
                tool_env: [
                    {required:true,message:'运行环境不能为空',trigger:'blur'}
                ],
            },
            uploadHeaders: {"token":localStorage.getItem('token')},
            fileList:[],
            addToolsDiag:false,
            name:'',
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

            addToolForm:{
                tool_name:'',
                tool_env:'',
                download_url:'',
            },

            username:'',
            // waitLoading:false,
            tool_name:'',
            formLabelWidth: '80px',
            uploadAttachment:'http://10.0.7.205:8089/back/uploadAttachmentPPT'
        };
    },

    created() {
        this.getData();
        this.uploadAttachment = this.$root.URL+"/back/uploadTools"

    },

    methods: {
        showFile(){
            alert("xxx")
            console.log(document.getElementById('uploadfile'));
        },
        addCancel(){

            this.addToolsDiag = false;
            this.addToolForm = {

            }

        },
        addTools(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let path = this.$root.URL+'/back/addTool';
                    let token = localStorage.getItem('token');
                    axios.post(path, this.addToolForm,
                        {
                            headers: {
                                'content-type': 'application/json',
                                'token': token,
                            }
                        }
                    ).then((res) => {
                        if(res.data)
                        {
                            if (res.data.code === '200') {
                                this.$message({
                                    message: '上传成功',
                                    type: 'success'
                                });
                                this.addToolsDiag = false;
                                this.addToolForm = {

                                }
                                this.reload();
                            }
                        }else {
                            this.$message({
                                message:"内部服务器出错",
                                type:'error'
                            })
                        }

                    });
                } else {
                    console.log("error submit!!");
                    this.$message.error("上传失败")
                }
            });


        },

        testDownLoad(index,row){

            window.open(row.download_url)
        },
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
                { value: '@citiz.com' },
            ]
            let results = []
            let queryList = []
            emailList.map(item => {
                queryList.push({ value: queryString.split('@')[0] + item.value })
            })
            results = queryString ? queryList.filter(this.createFilter(queryString)) : queryList;
            console.log(results)
            callback(results);
        },

// 邮箱填写过滤
        createFilter(queryString) {
            return (item) => {
                return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },


        handleClose (done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                    this.addTeacherInfo ={
                        username:'',
                        realName:'',
                        phone:'',
                        email:'',
                    };


                })
                .catch(_ => {})
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
        async handleSearch(){
            const url = this.$root.URL+"/back/findToolByName";
            await post(url,{ tool_name:this.tool_name,currentPage: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize}).then(res=>{
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
            let path = this.$root.URL+'/back/getAllTools';
            let token = localStorage.getItem('token');
            axios.post(path, {  currentPage: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize},
                {
                    headers: {
                        'content-type': 'application/json',
                        'token': token,
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
                }else{

                    this.$message({
                        message:"没有权限"
                    })
                }
            });
        },


        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.addToolForm.download_url = '';
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning("只能上传一个文件！");
        },

        handleSuccess(res, file) {
            console.log(file.response.data);
            this.addToolForm.download_url = file.response.data;

        },


        deleteTools(){

            if(this.multipleSelection.length<1){
                this.$message.error("请选择删除的软件!")

            }else {

                this.$confirm('此操作将删除软件工具, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    console.log(JSON.stringify(this.multipleSelection));
                    let token = localStorage.getItem("token");
                    let path = this.$root.URL+'/back/deleteTools';
                    axios.post(
                        path,
                        {
                            deleteRow:JSON.stringify(this.multipleSelection),
                        },
                        {
                            headers: {
                                'dataType': 'json',
                                'token': token,
                            }
                        }
                    ).then((res) => {
                        if (res.data.code === '200') {
                            console.log('成功');
                            this.$message({
                                message:'删除成功'
                            })

                            // this.addToolForm = this.addToolForm.filter(item=>item.id != data.id);
                            // console.log(this.multipleSelection[0].tool_id);

                            this.reload();
                        }else{
                            this.$message({
                                message:'删除失败'
                            })

                        }
                    });
                }).catch(() => {


                    this.$message({
                        type: 'info',
                        message: '已经取消删除'
                    });
                });

            }
        }


    }
};
</script>

<style>
/*.el-upload--text {*/
/*    display: none;*/


/*}*/
.el-upload--text{
    width: 100px;
    height: 40px;
    border: none;
}

</style>
