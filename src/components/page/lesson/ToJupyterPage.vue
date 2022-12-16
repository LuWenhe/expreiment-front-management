<template>
<div  id="allLesson">
    <el-row>
        <h3>实验指导书</h3>
        <br>
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
        ><el-button slot="trigger"   type="primary">上传实验指导书</el-button>
        </el-upload>
        <br> <br>
        <el-col :span="24" style='width: 100%'>
                <mavon-editor
                    v-model='guide_book'
                    ref="md"
                    class="editor"
                    @imgAdd="handleEditorImgAdd"
                    @imgDel="handleEditorImgDel">
                </mavon-editor>

        </el-col>
    </el-row>
    <br>

    <el-button type='primary' @click='submit' style='margin-bottom: 5%'>提交</el-button>
</div>

</template>

<script>
import axios from 'axios';
import {get,post} from '../../../api/index'

export default {
    inject: ['reload'],
    name: 'ToJupyterPage',
    data(){
        return{
            load:true,
            fileList:[],
            uploadServer: '',
            son_id:'',
            guide_book:'',
            uploadAttachment:"",
            uploadHeaders:{},

        }
    },
    created() {
        this.uploadAttachment = this.$root.URL+'/back/uploadExpBook'
        this.son_id = this.$route.query.son_id
        console.log(this.son_id)
        this.uploadHeaders = {"token":localStorage.getItem("token"),"son_id":this.son_id}
        this.getGuideBook();


    },
    methods:{


        handleSuccess(res, file) {
            //console.log(file.response.data);
            this.guide_book = file.response.data;
            // this.edit_personInfo.avatar_image = file.response.data;
            // this.fileListFront.push(file);
            // this.hideUpload = true;
        },
        /**文件超出个数限制时的钩子 */
        handleExceed() {
            this.$message.error(`只能选择1个文件`);
        },
        async getGuideBook(){
            const url = this.$root.URL+"/front/getGuideBook?son_id="+this.son_id;
            await get(url).then(res=>{

                this.guide_book = res.data.data.guide_book
            });

        },
        submit(){

            axios.post(this.$root.URL+"/back/addSonChapterBook", {son_id:this.son_id,guide_book:this.guide_book}, {
                headers: {
                    'Content-Type': 'application/json',
                    'token':localStorage.getItem("token"),
                }
            }).then((res) => {
                if(res.data.code === '200'){
                    this.$message.success('提交成功');
                    this.reload();
                }
            }).catch((err) => {
                console.log('上传错误')
                console.log(err)
            })

        },
        handleEditorImgAdd (pos, $file) {
            // const blob = this.dataURItoBlob($file.miniurl)
            const formData = new FormData()
            formData.append('file', $file)
            axios.post(this.$root.URL+'/back/addLessonPic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token':localStorage.getItem("token"),
                }
            }).then((res) => {
                if(res.data.code === '200'){
                    //this.pic_suolue = res.data.data
                    this.$refs.md.$img2Url(pos, res.data.data)
                }else {
                    this.$message.error("error")
                }
            }).catch((err) => {
                console.log('上传错误')
                console.log(err)
            })
        },
        handleEditorImgDel (pos) {
            delete this.imgFile[pos]
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        uploadFile(file) {
            this.file_form  = new FormData()
            this.file_form.append('file',file.file)
            this.file_form.append("son_id",this.son_id)
        },
        submitUpload(){
            this.$refs.uploadJupyterFile.submit();
            axios.post(this.uploadServer, this.file_form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token':localStorage.getItem("token"),
                }
            }).then((res) => {
                if(res.data.code === '200'){
                    this.$message.success("上传成功")

                    this.$router.push({name:"lessonIndex"});
                }else {
                    this.$message.error("上传失败")
                }
            }).catch((err) => {
                console.log('上传错误')
                console.log(err)
            })

        },


    },
    watch: {
        '$route.query.son_id': {
            handler(newVal, oldVal) {
                //判断newVal有没有值监听路由变化

                this.son_id = newVal
                this.getGuideBook()
            },
            deep: true

        }
    }
};
</script>

<style>
#allLesson{
    width: 90%;
    height: 100%;
    margin-left: 5%;
    margin-top: 1%;

}
.el-upload--text{
    width:120px;
    height: 33px;
    border: none;
}
</style>
