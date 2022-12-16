<template>

    <div>
        <el-row >
            <el-col :span="3">
                <br>
                <br>
                <br>
              <ul v-for="(item,index)  in tagsList" :key="index" >
                  <li class='tagLi'  @click='getLessonsByTag(item.value)' >
                       <i class='el-icon-price-tag' style='width: 150px;font-size: 20px' ><a href='#' style='width: 150px;height: 50px;font-size: 20px'>{{item.value}}</a> </i>
                  </li>
                  <br>
              </ul>
            </el-col>
            <el-col :span="21">
                <el-row type="flex" class="row-bg" justify="start">
                    <el-col :span="6">
                        <el-input
                            placeholder="请根据课程名称进行检索"
                            v-model="lesson_name"
                            maxlength="20"
                            show-word-limit
                            clearable
                        >
                        </el-input>
                    </el-col>
                    &nbsp; &nbsp;
                    <el-col :span="4">
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            @click="handleSearch"
                        >搜索</el-button>
                        <el-button type='danger' @click='addLesson'>
                            添加课程
                        </el-button>
                    </el-col>
                </el-row>
                <br>
                <el-row>
                    <el-col :xs="14" :sm="14" :md="14" :lg="8" :xl="6" :span="6" v-for="(item,index)  in lesson_list" :key="index">
                        <el-card style="width: 250px;height: 380px;margin-bottom: 25px; " shadow="hover">
                            <div v-if='item.pic_url != null'>
                                <img :src="item.pic_url" class="image" style="width: 100%;height: 250px"  @click='stepIntoDetail(item.lessonId)'>
                            </div>
                            <div v-else>
                                <img src="http://10.0.7.205:8081/2c2f312d-9ee4-4306-8c18-960046c32302.png" class="image" style="width: 100%;height: 250px"  @click='stepIntoDetail(item.lessonId)'>
                            </div>
                            <div style="padding: 14px;">
                                <span>{{item.lesson_name}}</span>
                                <br>
                                <div style='width: 200px;height: 50px'>
                                    <span style="font-size: 15px">授课老师：{{item.teacher_name}}</span>
                                    <el-button type='warning' style='float:right;position:relative;margin-right: 6px' @click="deleteLesson(item.lessonId)"><i class='el-icon-delete'></i></el-button>
                                </div>

                            </div>

                        </el-card>
                    </el-col>
                </el-row>
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
            </el-col>
        </el-row>

    </div>
</template>

<script>
import {get,post} from '../../../api/index'
export default {
    inject: ['reload'],

    data() {
        return {
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
            lesson_name:'',
            currentDate: new Date(),
            lesson_list: [
                {
                    "lessonId":'',
                    "lesson_name":'',
                    "pic_url":"http://10.0.7.205:8081/2c2f312d-9ee4-4306-8c18-960046c32302.png",
                    "difficulty":2,
                    "lesson_time":0,
                    "learn_credit":2,
                    "suitablePerson":"研究生",
                    "canLearn":"",
                    "description":"深度学习框架",
                    "teacher_id":null,
                    "user":null,
                    "chapters":null,
                    "tags":null,
                    "teacher_name":"nxd"
                },

            ],
            tagsList:[
                {
                  tagName: '全部'
                },
                {
                    tagName: 'meteo'
                },
                {
                    tagName: 'ai'
                }

            ],
            tagActive:'',
            btnShow: false,
            index:'0',


        };
    },
    created(){
        this.tagActive = "全部"
        this.getLessonList();
        this.getOptionList();
    },
    methods:{
        async getOptionList(){
            let url = this.$root.URL+"/back/getOptionList";
            await get(url).then(res=>{
                console.log("--------------------------------------")
                console.log(JSON.stringify(res.data))
                if(res.data.code === '200'){
                    this.tagsList = res.data.data;
                }else {

                }

            });


        },
        stepIntoDetail(lessonId){

            console.log(lessonId)
            this.$router.push({name:'editLesson',query:{lessonId:lessonId}})
        },
        addLesson(){

            console.log("addLesson")
            this.$router.push('/addLesson')

        },
        deleteLesson(lesson_id){
            this.$confirm('此操作将永久删除该课程, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                await get(this.$root.URL+"/back/deleteLessonById?lesson_id="+lesson_id).then(res=>{

                    if(res.data.code ==='200'){
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.reload()
                    }

                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        async handleSearch(){
            console.log(JSON.stringify(this.pageInfo))
            console.log(this.lesson_name)
            const url = this.$root.URL+"/back/findLessonsByName";
            await post(url,{ lesson_name:this.lesson_name,currentPage: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize}).then(res=>{

                //this.lesson_list = res.data;
                console.log(JSON.stringify(res.data))
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
                this.lesson_list = res.data.list;


            });


        },

        //改变每页显示的数据条数
        handleSizeChange(pageSize) {
            // console.log(`每页 ${val} 条`);
            this.pageInfo.pageSize = pageSize;
            this.getLessonList();
        },

        /**
         * 第n页
         * @param pageNum
         */
        handleCurrentChange(pageNum) {
            // console.log(`当前页: ${val}`);
            this.pageInfo.pageNum = pageNum;
            this.getLessonList();
        },

        getLessonsByTag(tagName){
            console.log(tagName)

            this.tagActive = tagName;
            this.pageInfo= {
                pageNum: 1,
                pageSize: 10,
                size: 0,
                startRow: 0,
                endRow: 0,
                total: 0,
                pages: 0
            }
            this.getLessonList()

        },

        async getLessonList() {

            console.log(this.tagActive)
            const url = this.$root.URL+"/back/getAllLessons";
            /*
            this是函数产生的, 定义一个函数就会产生作用域和this.
            你已经知道箭头函数不产生this, 所以你代码里的外面和里面this指向相同.
            另外, 如果你说有时候this是undefined, 那么仔细检查下代码, 这个情况是不会发生的, 只有出现function foo() {}或者是es6的写法foo () {}才会产生新的this
             */
            await post(url,{ currentPage: this.pageInfo.pageNum, pageSize: this.pageInfo.pageSize,tagActive:this.tagActive}).then(res=>{
                if (res){
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
                    console.log(JSON.stringify(res.data.list))
                    this.lesson_list = [];
                    this.lesson_list = res.data.list;
                }
            });



        },
    }
}
</script>


<style scoped>


.tagLi:active, .tagLi:hover {
    background-color: #fdf5e6;
}
</style>
