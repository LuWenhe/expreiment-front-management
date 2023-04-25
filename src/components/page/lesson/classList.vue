<template>
  <img src='http://localhost:8081/jianshe.jpg' alt='' style='width: 100%;height: 800px'>
</template>

<script>
export default {
  data() {
    return {
      currentPage1: 5,
      tableData: [{
        num: '1',
        name: '认知实训',
        province: '铁道学院',
        city: '李老师',
        address: '2021-11-15 10:04:59'
      },
        {
          num: '2',
          name: '认知实训',
          province: '铁道学院',
          city: '张老师',
          address: '2021-11-15 10:04:59'
        }],

      centerDialogVisible: false,

      ruleForm: {}
    };
  },

  created() {
    this.handleClick();
    this.open();
  },

  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    dialogopen() {
      this.centerDialogVisible = true;
    }
  }
};
</script>

<style scoped>

</style>
