<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.telphone" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getShopManager">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
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
      <el-table-column prop="id" label="连锁店id" width="80" sortable>
      </el-table-column>
      <el-table-column prop="account" label="用户账号" width="130" sortable>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" min-width="130" sortable>
      </el-table-column>
      <el-table-column prop="address" label="连锁店地址" min-width="160" sortable>
      </el-table-column>
      <el-table-column prop="csstatus" label="账号状态" min-width="80" sortable>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button v-if="scope.row.csstatus===0" size="small" @click="handleAble(scope.$index, scope.row)">冻结</el-button>
          <el-button v-if="scope.row.csstatus===1" size="small" @click="handleAble(scope.$index, scope.row)">解禁</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="连锁店id" prop="account">
          {{editForm.id}}
        </el-form-item>
        <el-form-item label="连锁店地址">
          <el-input type="text" v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input type="text" v-model="editForm.telphone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="添加商品" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="160px" :rules="addFormRules" ref="addForm">
        <el-form-item label="连锁店管理员账号" prop="account">
          <el-input v-model="addForm.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="addForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="addForm.pwd_confirm"></el-input>
        </el-form-item>
        <el-form-item label="省份" >
          <el-select size="small" style="" v-model="addForm.province" placeholder="请选择省份" v-on:change="getCity(addForm.province)">
            <el-option v-for="item in provs" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市区"  v-if="selectProv!=''">
          <el-select size="small" style="" v-model="addForm.city"  v-on:change="setCity(addForm.city)">
            <el-option v-for="item in citys" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="连锁店详细地址">
          <el-input type="text" v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="连锁店店名">
          <el-input type="text" v-model="addForm.shop_name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input type="text" v-model="addForm.telphone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import md5 from "js-md5";
import util from "../../common/js/util";
import zone from "../../common/js/china_zones.js";
//import NProgress from 'nprogress'
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser
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
        account: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        account: "",
        pwd: "",
        pwd_confirm: "",
        province: "",
        city: "",
        address: "",
        shop_name: "",
        telphone: ""
      },
      //上传图片
      dialogImageUrl: "",
      dialogVisible: false,
      //获取省份城市列表
      provs: zone.province,
      citys: [],
      formLabelWidth: "120px"
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getShopManager();
    },
    //获取连锁店管理员列表
    getShopManager() {
      var that = this;
      let para = {
        pn: 1,
        size: 20
      };
      if (this.filters.telphone !== "") {
        para = {
          pn: 1,
          size: 20,
          key: this.filters.telphone
        };
      }
      this.listLoading = true;
      this.$http.post("/api/admin/seller/getList", para).then(function(res) {
        if (res.data.code === 200) {
          console.log(res);
          that.total = res.data.data.count;
          that.users = res.data.data.seller;
          that.listLoading = false;
          that.filters.telphone = "";
        }
        that.filters.telphone = "";
      });
    },

    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        account: "",
        pwd: "",
        pwd_confirm: "",
        address: "",
        telphone: ""
      };
    },
    //冻结/解禁
    handleAble: function(index, row) {
      var that = this;
      if (row.csstatus === 0) {
        var para = {
          id: row.id,
          type: 1
        };
      } else {
        var para = {
          id: row.id,
          type: 0
        };
      }
      this.$http
        .post("/api/admin/seller/disableSeller", para)
        .then(function(res) {
          if (res.data.code === 200) {
            that.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            that.$message({
              message: res.data.msg,
              type: "error"
            });
          }
          that.getShopManager();
        });
    },
    //编辑
    editSubmit: function() {
      var that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = {
              id: this.editForm.id,
              address: this.editForm.address,
              telphone: this.editForm.telphone
            };
            this.$http
              .post("/api/admin/seller/update", para)
              .then(function(res) {
                if (res.data.code === 200) {
                  that.addLoading = false;
                  console.log("add success");
                  that.$message({
                    message: "连锁店管理员账号修改成功",
                    type: "success"
                  });
                }
                if (res.data.code === 201) {
                  that.addLoading = false;
                  console.log("error");
                  that.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
              });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      var that = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.pwd = md5(para.pwd);
            para.pwd_confirm = md5(para.pwd_confirm);
            console.log(para);
            // return ;
            this.$http.post("/api/admin/seller/add", para).then(function(res) {
              console.log(res);
              if (res.data.code === 200) {
                that.addLoading = false;
                console.log("add success");
                that.$message({
                  message: "连锁店管理员账号添加成功",
                  type: "success"
                });
              }
              if (res.data.code === 201 || res.data.code === 202) {
                that.addLoading = false;
                console.log("error");
                that.$message({
                  message: res.data.msg,
                  type: "error"
                });
              }
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
            this.getShopManager();
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
    },
    // 增加连锁店管理员——省份，市区，地址，店名
    getCity: function(prov) {
      let tempCity = [];
      this.citys = [];
      this.addForm.city = "";
      let allCity = zone.city;
      for (var val of allCity) {
        if (prov == val.prov) {
          console.log(val);
          tempCity.push({ label: val.label, value: val.label });
        }
      }
      this.citys = tempCity;
      console.log(this.citys);
    },
    setCity: function(city){
      this.addForm.city=city;
    }
  },
  mounted() {
    this.getShopManager();
  }
};
</script>

<style scoped>
</style>