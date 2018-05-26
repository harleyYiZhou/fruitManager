<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.telphone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUserList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <!-- <el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column> -->
      <el-table-column prop="uid" label="用户id" width="180" sortable>
      </el-table-column>
      <el-table-column prop="nickname" label="用户名" width="100" sortable>
      </el-table-column>
      <el-table-column prop="telphone" label="手机号" width="120" sortable>
      </el-table-column>
      <el-table-column prop="register_time" label="创建时间" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="ustatus" label="账号状态" min-width="100" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">冻结</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">解禁</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    

  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser,
getUserList
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        telphone: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        productName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: "",
        productName: "",
        description: "",
        price: 0,
        image: [],
        productDetail: [],
        category: ""
      },
      //上传图片
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUserList();
    },
    //获取用户列表
    getUserList() {
      var that = this;
      let para = {
        pn: 1,
        size: 20
      };
      if(this.filters.telphone!==''){
        para={
          pn: 1,
          size: 20,
          key: this.filters.telphone
        }
      }
      this.listLoading = true;
      this.$http.post("/api/user/user/getUserList", para).then(function(res) {
        if (res.data.code === 200) {
          console.log(res);
          that.total = res.data.data.count;
          that.users = res.data.data.user;
          that.listLoading = false;
          that.filters.telphone=''; 
        }
        that.filters.telphone=''; 
      });
    },
    //解禁用户
    handleDel: function(index, row) {
      var that = this;
      this.editForm = Object.assign({}, row);
      let para = {
        uid: row.uid
      };
      if (this.editForm.ustatus === 1) {
        this.$http.post("/api/user/user/enableUser", para).then(function(res) {
          if (res.data.code === 200) {
            that.$message({
              message: "解禁成功",
              type: "success"
            });
            that.getUserList();
          }
        });
      } else {
        this.$message({
          message: "该账号状态为正常状态",
          type: "error"
        });
      }
    },
    //冻结用户
    handleEdit: function(index, row) {
      var that = this;
      this.editForm = Object.assign({}, row);
      let para = {
        uid: row.uid
      };
      if (this.editForm.ustatus === 0) {
        this.$http.post("/api/user/user/disableUser", para).then(function(res) {
          if (res.data.code === 200) {
            that.$message({
              message: "冻结成功",
              type: "success"
            });
            that.getUserList();
          }
        });
      } else {
        this.$message({
          message: "该账号状态为冻结状态",
          type: "error"
        });
      }
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        sex: -1,
        age: 0,
        birth: "",
        addr: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            editUser(para).then(res => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUserList();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addUser(para).then(res => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getUserList();
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUserList();
          });
        })
        .catch(() => {});
    },
    //上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    }
  },
  mounted() {
    this.getUserList();
  }
};
</script>

<style scoped>
</style>