<template>
    <div>
    <div v-for="(item,index)  in chapter" :key="index">
        <div class='secondCard'>
            <br>
            <div>
                <div style='float: left;margin-left: 20px'><span class='chapter-index'>{{ item.chapter_no }}</span> &nbsp;<span><b>{{item.chapter_name}}</b></span></div>
                <div style='float: right;margin-right: 20px'> <el-button @click='delChapter(item.chapter_id)'> <i class='el-icon-delete-solid'></i> </el-button> <el-button @click='editChapter(item.chapter_id,item.chapter_no,item.chapter_name,item.description)'><i class="el-icon-edit"></i></el-button></div>
                <br>
            </div>
            <br>
            <hr>
            <br>
            <div style='margin-left: 20px'>
                <span>{{item.description}}</span>
                <br>
                <br>
                <div v-for="(item1,index)  in item.sonChapterList" :key="index">
                    <div style='float: left;'>
                        <span> {{item1.son_no}} &nbsp;{{item1.son_name}}</span>
                    </div>
                    <div style='float: right;width: 300px'>
                        <div style='float: left;'>
                            <el-button style='width: 50px' @click='editSonChapter(item1.son_id)'><i class="el-icon-edit"></i></el-button>
                            <el-button @click='delSonChapter(item1.son_id)'> <i class='el-icon-delete-solid'></i> </el-button>
                        </div>
                        &nbsp;&nbsp;
                        <div style='width: 100px; float: right;margin-right: 50px'>
                            <el-button  @click="toJupyterPage(item1.son_id)"><i class="el-icon-edit">实验指导书</i></el-button>

                        </div>

                    </div>

                    <br>
                    <br>

                 </div>
                <el-button> <i class='el-icon-plus' @click='addSonChapterModal(item.chapter_id)' >添加实验章节</i> </el-button>
                <br>
                <br>
            </div>

        </div>
        <br>
        <br>

    </div>
        <el-button type='primary'  @click="dialog = true">添加课程章节</el-button>
        <!-- 添加章节信息       -->
        <div>
            <el-drawer
                title="课程章节"
                :before-close="handleClose"
                :visible.sync="dialog"
                direction="ltr"
                custom-class="demo-drawer"
                ref="drawer"
            >
                <div class="demo-drawer__content">
                    <el-form :model="form" :rules='rules' ref='submit'>
                        <el-form-item label="章节序号" :label-width="formLabelWidth" prop='chapter_no'>
                            <el-input v-model="form.chapter_no" style='width: 90%'></el-input>
                        </el-form-item>
                        <el-form-item label="章节名称" :label-width="formLabelWidth" prop='chapter_name'>
                            <el-input v-model="form.chapter_name" style='width: 90%'></el-input>
                        </el-form-item>
                        <el-form-item label="简介" :label-width="formLabelWidth" prop='description'>
                            <el-input
                                style='width: 90%'
                                type="textarea"
                                :rows="3"
                                placeholder="请输入大纲" v-model='form.description'>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div class="demo-drawer__footer" style='margin-left: 15%'>
                        <el-button @click="cancelForm">取 消</el-button>
                        <el-button type="primary" @click="addChapter">添加章节</el-button>
                    </div>
                </div>
            </el-drawer>

            <el-drawer
                title="编辑课程章节"
                :before-close="handleClose"
                :visible.sync="editChDiag"
                direction="rtl"
                custom-class="demo-drawer"
                ref="drawer"
            >
                <div class="demo-drawer__content">
                    <el-form :model="editCh_form" :rules='rules' ref='submit_ediCh'>
                        <el-form-item label="章节序号" :label-width="formLabelWidth" prop='chapter_no'>
                            <el-input v-model="editCh_form.chapter_no" style='width: 90%'></el-input>
                        </el-form-item>
                        <el-form-item label="章节名称" :label-width="formLabelWidth" prop='chapter_name'>
                            <el-input v-model="editCh_form.chapter_name" style='width: 90%'></el-input>
                        </el-form-item>
                        <el-form-item label="简介" :label-width="formLabelWidth" prop='description'>
                            <el-input
                                style='width: 90%'
                                type="textarea"
                                :rows="3"
                                placeholder="请输入大纲" v-model='editCh_form.description'>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div class="demo-drawer__footer" style='margin-left: 15%'>
                        <el-button @click="cancelEditChForm">取 消</el-button>
                        <el-button type="primary" @click="editSubmitChapter">修改</el-button>
                    </div>
                </div>
            </el-drawer>



            <el-dialog
                title="子章节"
                :visible.sync="addSonChapterDiag"
                width="30%"
                :before-close="handleClose">
                <el-form :model="lesson_form" :rules='son_rules' ref='submit_son'>
                    <el-form-item label="序号" :label-width="formLabelWidth" prop='son_no'>
                        <el-input v-model="lesson_form.son_no" style='width: 90%'></el-input>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth" prop='son_name'>
                        <el-input v-model="lesson_form.son_name" style='width: 90%'></el-input>
                    </el-form-item>

                    <el-form-item label="简介" :label-width="formLabelWidth" prop='description'>
                        <el-input
                            style='width: 90%'
                            type="textarea"
                            :rows="3"
                            placeholder="请输入大纲" v-model='lesson_form.description'>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="PPT" :label-width="formLabelWidth" >

                        <el-upload

                            :action="uploadAttachmentPPT"
                            :on-preview="handlePreviewPPT"
                            :on-remove="handleRemovePPT"
                            :on-success="handleSuccessPPT"
                            :limit="1"
                            :on-exceed="handleExceedPPT"
                            :file-list="fileList"
                            :headers="uploadHeaders"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>

                        </el-upload>
                    </el-form-item>
                    <el-form-item label="MP4" :label-width="formLabelWidth">
                        <el-upload

                            :action="uploadAttachmentMp4"
                            :on-preview="handlePreviewMp4"
                            :on-remove="handleRemoveMp4"
                            :on-success="handleSuccessMp4"
                            :limit="1"
                            :on-exceed="handleExceedMp4"
                            :file-list="fileList"
                            :headers="uploadHeaders"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>

                        </el-upload>

                    </el-form-item>


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addSonChapterDiagCancel">取 消</el-button>
                    <el-button type="primary" @click="addSonChapter">确 定</el-button>
                </span>
            </el-dialog>


            <el-dialog
                title="编辑子章节"
                :visible.sync="editSonChapterDiag"
                width="30%"
                :before-close="handleClose">
                <el-form :model="edit_lesson_form" :rules='son_rules' ref='submit_son'>
                    <el-form-item label="序号" :label-width="formLabelWidth" prop='son_no'>
                        <el-input v-model="edit_lesson_form.son_no" style='width: 90%'></el-input>
                    </el-form-item>
                    <el-form-item label="名称" :label-width="formLabelWidth" prop='son_name'>
                        <el-input v-model="edit_lesson_form.son_name" style='width: 90%'></el-input>
                    </el-form-item>
                    <el-form-item label="简介" :label-width="formLabelWidth" prop='description'>
                        <el-input
                            style='width: 90%'
                            type="textarea"
                            :rows="3"
                            placeholder="请输入大纲" v-model='edit_lesson_form.description'>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="PPT" :label-width="formLabelWidth" >

                        <el-upload
                            list-type="text"
                            :action="uploadAttachmentPPT"
                            :on-preview="handleEditPreviewPPT"
                            :on-remove="handleEditRemovePPT"
                            :on-success="handleEditSuccessPPT"
                            :limit="1"
                            :on-exceed="handleEditExceedPPT"
                            :file-list="fileList"
                            :headers="uploadHeaders"

                        >
                            <el-button size="small" type="primary">点击上传</el-button>

                        </el-upload>
                    </el-form-item>
                    <el-form-item label="MP4" :label-width="formLabelWidth">
                        <el-upload

                            :action="uploadAttachmentMp4"
                            :on-preview="handleEditPreviewMp4"
                            :on-remove="handleEditRemoveMp4"
                            :on-success="handleEditSuccessMp4"
                            :limit="1"
                            :on-exceed="handleEditExceedMp4"
                            :file-list="fileList"
                            :headers="uploadHeaders"

                        >
                            <el-button size="small" type="primary">点击上传</el-button>

                        </el-upload>

                    </el-form-item>


                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addEditSonChapterDiagCancel">取 消</el-button>
                    <el-button type="primary" @click="addEditSonChapter">确 定</el-button>
                </span>
            </el-dialog>




        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {get,post} from '../../../api/index'

export default {
    name: 'ChapterAdmin',
    props: ['lessonId'],
    data() {
        return {
            options: [{
                value: 'WebIDE',
                label: 'WebIDE'
            }, {
                value: 'Jupyter',
                label: 'Jupyter'
            }],
            uploadHeaders: {"token":localStorage.getItem('token')},
            fileList:[],
            addSonChapterDiag:false,
            editSonChapterDiag:false,
            rules: {

                chapter_name: [{ required: true, message: '请输入章节名称', trigger: 'blur' }],
                description: [{ required: true, message: '请输入章节描述', trigger: 'blur' }],
                chapter_no: [{ required: true, message: '请输入章节编号', trigger: 'blur' }],

            },
            son_rules: {

                son_name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
                son_no: [{ required: true, message: '请输入编号', trigger: 'blur' }],

            },
            table: false,

            loading: false,
            lesson_id : this.lessonId,    // 把传过来的值赋值给新的变量
            chapter:[

            ],
            dialog:false,
            editChDiag: false,

            editCh_form:{
              chapter_id:null,
              chapter_no:null,
              chapter_name:null,
              description:null
            },
            form: {
                chapter_name: '',
                description: '',
                mp4: '',
                ppt: '',
                lessonId:'',
                chapter_no:''

            },
            exp_type:'',
            lesson_form:{
                son_no:'',
                son_name:'',
                description:'',
                exp_type:'',
                chapter_id:'',
                lessonId:'',
                ppt:'',
                mp4:'',
            },
            edit_lesson_form:{
                son_id:'',
                son_no:'',
                son_name:'',
                description:'',
                chapter_id:'',
                lessonId:'',
                ppt:'',
                mp4:'',
            },
            formLabelWidth: '80px',
            timer: null,
            chapter_id:'',
            uploadAttachmentMp4:'',
            uploadAttachmentPPT:''

        }
    },
    created() {

        this.getChapterInfoByLessonId();
        this.uploadAttachmentMp4 = this.$root.URL+'/back/uploadAttachmentMp4';
        this.uploadAttachmentPPT = this.$root.URL+'/back/uploadAttachmentPPT'
        console.log("chapter-------------"+this.lesson_id)
    },
    watch: {
        lessonId(val) {
            this.lesson_id = val //对父组件传过来的值进行监听，如果改变也对子组件内部的值进行改变
        }
    },
    methods: {

        handleRemovePPT(file, fileList) {
            console.log(file, fileList);
        },
        handlePreviewPPT(file) {
            console.log(file);
        },
        handleExceedPPT(files, fileList) {
            this.$message.warning("只能上传一个文件！");
        },

        handleSuccessPPT(res, file) {
            console.log(file.response.data);
            this.lesson_form.ppt = file.response.data;

        },

        handleEditRemovePPT(file, fileList) {
            console.log(file, fileList);
        },
        handleEditPreviewPPT(file) {
            console.log(file);
        },
        handleEditExceedPPT(files, fileList) {
            this.$message.warning("只能上传一个文件！");
        },

        handleEditSuccessPPT(res, file) {
            console.log(file.response.data);
            this.edit_lesson_form.ppt = file.response.data;

        },


        handleRemoveMp4(file, fileList) {
            console.log(file, fileList);
        },
        handlePreviewMp4(file) {
            console.log(file);
        },
        handleExceedMp4(files, fileList) {
            this.$message.warning("只能上传一个文件！");
        },

        handleSuccessMp4(res, file) {
            console.log(file.response.data);
            this.lesson_form.mp4 = file.response.data;

        },

        handleEditRemoveMp4(file, fileList) {
            console.log(file, fileList);
        },
        handleEditPreviewMp4(file) {
            console.log(file);
        },
        handleEditExceedMp4(files, fileList) {
            this.$message.warning("只能上传一个文件！");
        },

        handleEditSuccessMp4(res, file) {
            console.log(file.response.data);
            this.edit_lesson_form.mp4 = file.response.data;

        },


        addSonChapterDiagCancel(){

            this.addSonChapterDiag = false;
            this.lesson_form = {};
        },
        addSonChapterModal(chapter_id){

            console.log(chapter_id)
            this.chapter_id = chapter_id;
            this.addSonChapterDiag = true;
        },
        addSonChapter(){

            console.log("chapter_id "+this.chapter_id)

            this.$confirm('确定要提交表单吗？')
                .then(_ => {
                    this.timer = setTimeout(() => {
                        this.lesson_form.lessonId = this.lesson_id
                        this.lesson_form.chapter_id = this.chapter_id
                        //this.lesson_form.exp_type = this.exp_type[0];
                        let url =   this.$root.URL+"/back/AddSonChapterInEdit";
                        this.$refs.submit_son.validate(valid => {
                            axios.post(url, this.lesson_form, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'token':localStorage.getItem("token"),
                                }
                            }).then((res) => {
                                console.log(JSON.stringify(res))
                                if(res.data.code === '200'){
                                    this.$message.success('提交成功');
                                    this.chapter = res.data.data;
                                    this.form = '';
                                    this.lesson_form = {};
                                    this.getChapterInfoByLessonId()
                                }else {
                                    this.$message.error("系统内部错误")
                                }
                            }).catch((err) => {
                                console.log('添加错误')
                                console.log(err)
                            })
                            // 动画关闭需要一定的时间
                            setTimeout(() => {
                                this.loading = false;
                            }, 400);
                        });
                    }, 2000)

                })
                .catch(_ => {});

            this.addSonChapterDiag = false;

        },

        editSonChapter(son_id){


            console.log(son_id);
            this.editSonChapterDiag = true;
            this.getEditSonChapterInfo(son_id)
           // post()

        },

        addEditSonChapterDiagCancel(){

            this.editSonChapterDiag = false;
            this.edit_lesson_form = {};
        },
        addEditSonChapter(){

            console.log(JSON.stringify(this.edit_lesson_form))
            this.$confirm('确定要提交表单吗？')
                .then(_ => {
                    this.timer = setTimeout(() => {
                        let url =   this.$root.URL+"/back/EditSonChapterInEdit";
                        this.$refs.submit_son.validate(valid => {
                            axios.post(url, this.edit_lesson_form, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'token':localStorage.getItem("token"),
                                }
                            }).then((res) => {
                                console.log(JSON.stringify(res))
                                if(res.data.code === '200'){
                                    const loading = this.$loading({
                                        lock: true,
                                        text: 'Loading',
                                        spinner: 'el-icon-loading',
                                        background: 'rgba(0, 0, 0, 0.7)'
                                    });
                                    setTimeout(() => {
                                        loading.close();
                                    }, 2000);

                                    this.editSonChapterDiag = false;
                                    this.chapter = res.data.data;
                                    this.form = '';
                                    this.lesson_form = {};
                                    this.getChapterInfoByLessonId()
                                }else {
                                    this.$message.error("系统内部错误")
                                }
                            }).catch((err) => {
                                console.log('添加错误')
                                console.log(err)
                            })
                            // 动画关闭需要一定的时间
                            setTimeout(() => {
                                this.loading = false;
                            }, 400);
                        });
                    }, 2000)

                })
                .catch(_ => {});


        },
        getEditSonChapterInfo(son_id){

            let url = this.$root.URL+"/back/getEditSonChapterInfo";
            post(url,{son_id:son_id}).then(res=>{
                console.log(JSON.stringify(res.data))
                this.edit_lesson_form.son_no = res.data.data.son_no;
                this.edit_lesson_form.son_name = res.data.data.son_name;
                this.edit_lesson_form.description = res.data.data.description;
                this.edit_lesson_form.ppt = res.data.data.ppt;
                this.edit_lesson_form.mp4 = res.data.data.mp4;
                this.edit_lesson_form.son_id = res.data.data.son_id;

            })


        },
        delSonChapter(son_id){
            this.$confirm('此操作将永久删除该子章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let url = this.$root.URL + '/back/delSonChapterInEdit?son_id='+son_id
                get(url).then(res=>{
                    //this.lesson_list = res.data;
                    if(res.data.code === '200'){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getChapterInfoByLessonId();
                    }else {
                        this.$message({
                            type: 'error',
                            message: '服务器异常，暂时无法删除!'
                        });
                    }

                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });




        },
         delChapter(chapter_id){
            this.$confirm('此操作将永久删除该章节, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {

                console.log("chapter_id "+chapter_id)
                let url = this.$root.URL + '/back/delChapterInEdit?chapter_id='+chapter_id
                get(url).then(res=>{
                    //this.lesson_list = res.data;
                    console.log(JSON.stringify(res))
                    if(res.data.code === '200'){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getChapterInfoByLessonId();
                    }else {
                        this.$message({
                            type: 'error',
                            message: '服务器异常，暂时无法删除!'
                        });

                    }


                });


            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        //编辑章节信息
        editChapter(chapter_id,chapter_no,chapter_name,description){
            this.editCh_form.chapter_id = chapter_id;
            this.editCh_form.chapter_no = chapter_no;
            this.editCh_form.chapter_name = chapter_name;
            this.editCh_form.description = description;
            this.editChDiag = true;

        },

        addChapter(){
            this.$confirm('确定要提交表单吗？')
                .then(_ => {
                    this.timer = setTimeout(() => {
                    this.form.lessonId = this.lesson_id

                    let url =   this.$root.URL+"/back/AddChapterInEdit";
                     this.$refs.submit.validate(valid => {
                         if(valid){
                             axios.post(url, this.form, {
                                 headers: {
                                     'Content-Type': 'application/json',
                                     'token':localStorage.getItem("token"),
                                 }
                             }).then((res) => {
                                 console.log(JSON.stringify(res))
                                 if(res.data.code === '200'){
                                     this.$message.success('提交成功');
                                     this.chapter = res.data.data;
                                     this.dialog = false;
                                     this.form = {
                                         chapter_name: '',
                                         description: '',
                                         mp4: '',
                                         ppt: '',
                                         lesson_id:'',
                                         chapter_no:''
                                     }
                                 }else {
                                     this.$message.error("系统内部错误")
                                 }
                             }).catch((err) => {
                                 console.log('添加错误')
                                 console.log(err)
                             })
                             // 动画关闭需要一定的时间
                             setTimeout(() => {
                                 this.loading = false;
                             }, 400);
                         }else {
                             this.$message.error("输入有误")
                         }
                    });

                    }, 2000)

                })
                .catch(_ => {});
        },
        editSubmitChapter(){
            this.$confirm('确定要提交表单吗？')
                .then(_ => {

                    let url =   this.$root.URL+"/back/editChapterInEdit";
                    this.$refs.submit_ediCh.validate(valid => {
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

                        axios.post(url, this.editCh_form, {
                            headers: {
                                'Content-Type': 'application/json',
                                'token':localStorage.getItem("token"),
                            }
                        }).then((res) => {
                            console.log(JSON.stringify(res))
                            if(res.data.code === '200'){
                                loading.close()
                                this.$message.success('提交成功');
                                this.editChDiag = false;
                                this.editCh_form = {};
                                this.getChapterInfoByLessonId()
                            }else {
                                this.$message.error("系统内部错误")
                            }
                        }).catch((err) => {
                            console.log('添加错误')
                            console.log(err)
                        })
                        // 动画关闭需要一定的时间
                        setTimeout(() => {
                            this.loading = false;
                        }, 400);
                    });



                })
                .catch(_ => {});
        },
        handleClose(done) {

            this.$confirm('确认关闭？')
                .then(_ => {
                    done()
                    this.form = {
                        chapter_name: '',
                        description: '',
                        mp4: '',
                        ppt: '',
                        lesson_id:'',
                        chapter_no:''
                    };
                    this.lesson_form = {
                        son_no:'',
                        son_name:'',
                        description:'',
                        exp_type:'',
                        chapter_id:'',
                        lesson_id:'',
                        ppt:'',
                        mp4:'',
                    }


                })
                .catch(_ => {})

        },
        cancelForm() {
            this.loading = false;
            this.dialog = false;
            clearTimeout(this.timer);
            this.form = '';
        },
        cancelEditChForm(){
            this.editChDiag = false;
            this.editCh_form = {}
        },
        toJupyterPage(son_id){

            console.log(son_id)
            this.$router.push({name:"ToJupyterPage",query:{son_id:son_id}})
        },
        async getChapterInfoByLessonId(){
            const url = this.$root.URL+"/back/getChapterInfoByLessonId";
            await post(url,{lessonId:this.lesson_id}).then(res=>{
               if(res.data.code === '200'){
                   console.log(JSON.stringify(res.data.data))
                   this.chapter = res.data.data;
               }
               else {
                   this.$message.error("加载失败")
               }

           });


        }
    }
};
</script>

<style>
.secondCard{
    background-color: white;
    height: auto;
    width: 60%;
    margin-left: 20px;
}
.chapter-index{
    display: inline-block;
    line-height: 30px;
    text-align: center;
    background-color: #fdf5e6;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 12px;
}
.el-upload--text{
    width: 100px;
    height: 40px;
    border: none;
}
</style>
