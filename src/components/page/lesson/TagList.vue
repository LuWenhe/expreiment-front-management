<template>
    <div>
    <el-row type="flex" class="row-bg" justify="start">
        <el-col :span="1">
            <el-button
                @click="addTagDiag = true"
                type="primary">添加</el-button>
        </el-col>
    </el-row>
        <br>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%">

        <el-table-column
            prop="tag_id"
            label="序号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="tagName"

            label="标签名">
        </el-table-column>
        <el-table-column
            label="操作"
            width="200px"
            align="center"
        >
            <template slot-scope="scope">

                <el-button
                    type="primary"
                    @click="editTag(scope.$index, scope.row)"
                >编辑</el-button>
                &nbsp;

                    <el-button  type="danger"  @click="delTag(scope.$index, scope.row)">删除</el-button>


            </template>
        </el-table-column>
    </el-table>
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

        <el-dialog title="添加标签" :visible.sync="addTagDiag">
            <el-form :model="form">
                <el-form-item label="标签名称" :label-width="formLabelWidth">
                    <el-input v-model="form.tagName" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddTag">取 消</el-button>
                <el-button type="primary" @click="enterAddTag">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑标签" :visible.sync="editTagDiag">
            <el-form :model="editForm">
                <el-form-item label="标签名称" :label-width="formLabelWidth">
                    <el-input v-model="editForm.tagName" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEditTag">取 消</el-button>
                <el-button type="primary" @click="enterEditTag">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
import axios from 'axios';
import {get,post} from '../../../api/index'

export default {
name: "TagList",
    data(){
        return{
            formLabelWidth: '120px',
            form: {
                tagName: '',
            },
            editForm:{
              tagName:'',
                tag_id:'',

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
            addTagDiag:false,
            editTagDiag:false,
            tableData: [{
                tag_id: 1,
                tagName: 'AI',

            }, {
                tag_id: 2,
                tagName: 'Linux',
            }, {
                tag_id: 3,
                tagName: '开发',
            }, {
                tag_id: 4,
                tagName: '运维',
            }]
        }
    },
    created() {

        this.loadTag();

    },
    methods:{
        editTag(index,row){

            this.editTagDiag = true;
            console.log(JSON.stringify(row))
            this.editForm.tagName = row.tagName;
            this.editForm.tag_id = row.tag_id;

        },
         delTag(index,row){

            console.log(JSON.stringify(row))
            this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = this.$root.URL+"/back/delTag"
                axios.post(
                    url,{tag_id:row.tag_id},
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
                                message: '删除成功',
                                type: 'success'
                            });
                            this.loadTag();
                        } else if(res.data.code ==='502'){
                            this.$message({
                                message:"已有课程使用该标签，不能删除"
                            })
                        }else {
                            this.$message.error("内部错误")
                        }
                    });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        cancelEditTag(){
            this.editTagDiag = false;
            this.editForm.tagName = '';
        },
        async enterEditTag(){
            if(this.editForm.tagName === ''){
                this.$message.error("请输入编辑的内容")
            }else {
                let url = this.$root.URL+"/back/editTag";
                await post(url,this.editForm).then(res=>{
                    if(res.data.code ==='200'){
                        this.$message.success("编辑成功");
                        this.editTagDiag = false;
                        this.loadTag();
                    }else {
                        this.$message.error("内部错误")
                    }
                });

            }


        },
        cancelAddTag(){

            this.form.tagName ='';
            this.addTagDiag = false;
        },
        async enterAddTag(){
            console.log(JSON.stringify(this.form));
            if(this.form.tagName ===''){
                this.$message.error("标签不能为空！")
            }else {
                let num = 0;
                for (let i = 0; i < this.tableData.length; i++) {
                    if(this.form.tagName === this.tableData[i].tagName){
                        num++;
                    }
                }
                if(num>0){
                    this.$message.error("已经存在，请重新添加！")
                    this.form.tagName = '';
                }else {
                    let url = this.$root.URL+"/back/addTag";
                    await post(url,this.form).then(res=>{
                        console.log(res.data)
                        if (res.data.code === '200'){
                            this.$message.success("添加成功！");
                            this.addTagDiag = false;
                            this.loadTag();
                        }else {
                            this.$message.error("内部错误");
                            this.addTagDiag = false;
                        }
                    });

                }

            }
        },
        addTag(){


        },
        //改变每页显示的数据条数
        handleSizeChange(pageSize) {
            // console.log(`每页 ${val} 条`);
            this.pageInfo.pageSize = pageSize;
            this.loadTag();
        },

        /**
         * 第n页
         * @param pageNum
         */
        handleCurrentChange(pageNum) {
            // console.log(`当前页: ${val}`);
            this.pageInfo.pageNum = pageNum;
            this.loadTag();
        },
        async loadTag(){
            let url = this.$root.URL+"/back/loadTagList";
           await post(url,{currentPage: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize}).then(res=>{

               console.log(res);
               console.log(JSON.stringify(res.data))
               this.tableData = res.data.list
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


           });


        }

    }
}
</script>

<style scoped>

</style>
