<template>
<div>
  <el-card >
    <el-button type="primary" @click="opendialog">新增公告</el-button>


    <el-table
      :data="tableData"
      style="width: 100%">
       <el-table-column
        prop="subject"
        label="公告主题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="date"
        label="发布时间日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="发布人"
        width="180">
      </el-table-column>

      <el-table-column
        prop="time"
        label="起止时间">
      </el-table-column>
      <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="danger" size="small">删除</el-button>
            </template>
            </el-table-column>
    </el-table>


    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>

  </el-card>


  <el-dialog
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <template slot-scope="scope">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="公告主题" prop="subjcct" required>
                <el-input v-model="ruleForm.subject"></el-input>
              </el-form-item>

              <el-form-item label="公告内容" prop="content" required>
                <el-input type="textarea" v-model="ruleForm.content"></el-input>
              </el-form-item>

              <el-form-item label="起止时间" required>
                  <el-col :span="11">
                    <el-form-item prop="date1">
                      <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="date2">
                      <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date2" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
              </el-form-item>

              <el-form-item label="附件上传" prop="upload" >

              </el-form-item>


              <el-form-item>
                  <el-button @click="centerDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
              </el-form-item>
          </el-form>
        </template>

    </el-dialog>
</div>
</template>

<script>
export default {
data() {
        return {
          tableData: [{
            subject: 'scc',
            date: '2021-11-11',
            name: '王小虎',
            time: '2021-11-05 至 2021-12-16',

          }, {
            subject: 'scwcw',
            date: '2021-11-12',
            name: '王小虎',
            time: '2021-11-05 至 2021-12-16',

          }, {
            subject: 'veccw',
            date: '2021-11-13',
            name: '王小虎',
            time: '2021-11-05 至 2021-12-16',

          }, {
            subject: 'vevb',
            date: '2021-11-14',
            name: '王小虎',
            time: '2021-11-05 至 2021-12-16',

          }],
          currentPage1: 5,
            currentPage2: 5,
            currentPage3: 5,
            currentPage4: 4,


        centerDialogVisible : false,


          ruleForm:{

          }
        }
    },
     methods: {
        handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      opendialog(){
        this.centerDialogVisible = true
      }

    }

}
</script>

<style scoped>

</style>
