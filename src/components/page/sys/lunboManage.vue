<template>
    <div>
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
                prop="id"
                label="序号"
                width="130px"
                sortable
            ></el-table-column>
            <el-table-column
                label="照片"
                width="200px"
                align="center"
            >
                <template slot-scope="scope">
                    <viewer :images="imgList">
                        <img :src=scope.row.banner_url style="height:3rem;width:3rem;" alt="">
                    </viewer>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="200px"
                align="center"
            >
                <template slot-scope="scope">

                    <el-button
                        type="primary"
                        @click="handleEdit(scope.$index, scope.row)"
                    >编辑</el-button>

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

            <!-- 编辑弹出框 -->
            <el-dialog
                title="轮播图片修改"
                :visible.sync="dialogVisible"
                width="70%"
                :before-close="handleClose">
                <el-upload
                    :class='{hide:hideUpload}'
                    list-type="picture-card"
                    :action="uploadImgServer"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :limit="imgLimit"
                    :on-exceed="handleExceed"
                    :file-list="fileListFront"
                    :headers="uploadHeaders"

                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <span slot="footer" class="dialog-footer">
      <el-button @click="cancelEdit()">取 消</el-button>
      <el-button type="primary" @click="updateBanner">确 定</el-button>
    </span>
            </el-dialog>



        </div>

    </div>

</template>

<script>
import axios from 'axios';
import deepClone from '@/utils/deep-clone'
import bannerEdit from '@/components/page/sys/bannerEdit'
export default {
    inject: ['reload'],
    data() {
        return {
            banner_temp_url:'',
            fileListFront: [], // 照片列表
            imgLimit: 1, // 上传照片数
            uploadImgServer:'',
            hideUpload:false,
            fileList:[],
            name:'',
            dialogVisible: false,
            addVisible:false,
            dialogdata: {
                banner_url:'',
                id:''
            },
            multipleSelection: [],
            tableData: [],
            order_num:'',

            pre_order_id: '',

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
            selectObj: {
                // 选项的对应识别号
                value: '',
                // 搜索框输入的内容
                input: ''
            },

            dialog_form: {
                banner_id:'',
                banner_url:''
            },
            pic_url:'',
            src: '',
            price_id:'',
            imgList:[],
            banner_url:'',
            uploadHeaders: {"token":localStorage.getItem('token')},

        };
    },

    created() {
        this.getData();
        this.uploadImgServer = this.$root.URL+'/back/addLessonPic'
        console.log(this.$root.URL)
    },
    components: {
        bannerEdit
    },

    methods: {
        /**文件超出个数限制时的钩子 */
        handleExceed() {
            this.$message.error(`只能选择${this.imgLimit}个文件`);
        },
        /**上传文件之前的钩子函数 */
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('仅支持jpg，png格式的图片！');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        /**上传成功后的钩子函数 */
        handleAvatarSuccess(res, file) {

            this.fileListFront.push(file);
            this.dialogdata.banner_url = file.response.data;
            this.hideUpload = true;
        },
        /**查看图片 */
        handlePictureCardPreview(file) {
            console.log(file);

        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.fileListFront.some((item, i) => {
                if (item.name === file.name) {
                    this.fileListFront.splice(i, 1);
                    return true;
                }
            });
            this.hideUpload = fileList.length>=this.imgLimit;
            this.dialogdata.banner_url = '';
        },
        handlePreview(file) {
            console.log(file);
        },



        handleClose (done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.fileListFront = []
                    done()

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

        getData() {
            let path = this.$root.URL+'/backSysAdmin/getAllBanner';
            let token = localStorage.getItem('token');
            axios.post(path, { token: token, currentPage: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize},
                {
                    headers: {
                        'content-type': 'application/json',
                        'token': token,
                    }
                }
            )
                .then((res) => {
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
                            const imageList = []
                            res.data.list.forEach((item, index) => {
                                imageList.push(item.banner_url)
                            })
                            this.imgList = imageList
                        }
                    }else{

                        this.$message({
                            message:"没有权限"
                        })
                    }
                });
        },



        handleEdit (index, row) {

            this.dialogVisible = true
            this.hideUpload = true;
            this.fileListFront.push({name:'xxx',url:row.banner_url.split(",")[0]})   //在el-upload中回显后台返回的地址
            this.dialogdata.id = row.id;
            this.dialogdata.banner_url = row.banner_url;

        },
        cancelEdit(){
            this.dialogVisible = false;

            this.fileListFront = [];
            this.dialogdata = {
                id:'',
                banner_url: ''
            }
        },
        updateBanner () {

            this.dialogVisible = false
            console.log("update------------------------")
            console.log(JSON.stringify(this.dialogdata));
            let path = this.$root.URL+'/backSysAdmin/updateBanner';
            let token = localStorage.getItem('token');
            axios.post(
                path,this.dialogdata,
                {
                    headers: {
                        'content-type': 'application/json',
                        'token':localStorage.getItem("token")
                    }
                }
            )
                .then((res) => {
                    if (res.data.code === '200') {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.fileListFront = [];
                        this.dialogdata = {
                            id:'',
                            banner_url: ''
                        }
                        this.getData()
                    } else if (res.data.code === '502'){
                        this.$message({
                            message:"没有权限"
                        })
                    }
                });
        },




    }
};
</script>

<style>


</style>
