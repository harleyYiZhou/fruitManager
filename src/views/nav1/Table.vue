<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getProductList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" row-key="goods_id" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <!-- <el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column> -->
      <el-table-column prop="goods_name" label="名称" width="100" sortable>
      </el-table-column>
      <el-table-column prop="classify_id" label="分类" width="100" sortable>
      </el-table-column>
      <el-table-column prop="goods_price" label="价格" width="120" sortable>
      </el-table-column>
      <el-table-column prop="goods_desc" label="描述" min-width="180" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope" prop="goods_id">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row,row-key)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="editForm.price" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="editForm.category" placeholder="请选择商品分类">
            <el-option v-for="value in classify" label="value.cname" value="value.cname"></el-option>
            <!-- <el-option label="海鲜" value="fish"></el-option>
            <el-option label="蔬菜" value="vegetable"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="商品详情" prop="image">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="添加商品" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload action="/api/index/goods/upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlePictureId">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="addForm.description"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="addForm.price" :min="0"></el-input-number>元/斤
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="addForm.category" placeholder="请选择商品分类">
            <li v-for="item in classify">
              <el-option v-bind:label="item.cname" v-bind:value="item.cid"></el-option>
            </li>
          </el-select>
        </el-form-item>
        <el-form-item label="商品详情" prop="image">
          <el-upload action="/api/index/goods/upload" :data="form" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleDetailId">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
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
import util from "../../common/js/util";
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
        name: ""
      },
      products: [],
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
        name: "",
        addr: "",
        productName: "",
        description: "",
        price: 0,
        image: [],
        productDetail: [],
        category: "",
        imgId: "0",
        detailId: "0"
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        addr: "",
        productName: "",
        description: "",
        price: 0,
        image: [],
        productDetail: [],
        category: "",
        imgId: "0",
        detailId: "0",
        dialogImageUrl: ''
      },
      //上传图片
      dialogImageUrl: "",
      dialogVisible: false,
      //获取商品分类
      classify: [],
      form: {
        type: "1"
      }
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getProductList();
    },
    getProductList() {
      var that = this;
      this.$http.post("/api/index/goods/getList",{}).then(function(res){
        that.total = res.data.data.count;
      })
      let para = {
        pn: that.page,
        size: 20
      };
      this.listLoading = true;
      this.$http.post("/api/index/goods/getList", para).then(function(res) {
        console.log(res);
        that.products = res.data.data.goods;
        that.listLoading = false;
      });
    },
    getClassifyList() {
      var that = this;
      let param = {};
      this.$http
        .post("/api/index/classify/getAllList", param)
        .then(function(res) {
          that.classify = res.data.classify;
          console.log(that.classify);
        });
    },

    //删除
    handleDel: function(index, row) {
      var that = this;
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.goods_id };
          that.$http
            .post("/api/index/goods/deleteGoods", para)
            .then(function(res) {
              if (res.data.code === 200) {
                this.listLoading = false;
                that.$message({
                  message: "删除成功",
                  type: "success"
                });
              }
            });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row, id) {
      this.editFormVisible = true;
      console.log(row.goods_id);
      let param = { id: row.goods_id };
      this.$http
        .post("/api/index/goods/getGoodsDetail", param)
        .then(function(res) {
          console.log(res);
        });
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        addr: "",
        productName: "",
        description: "",
        price: 0,
        image: [],
        productDetail: [],
        category: "",
        imgId: "0",
        detailId: "0",
        dialogImageUrl: ''
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
              this.getUsers();
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
            let para = {
              name: this.addForm.name,
              img_ids: this.addForm.imgId,
              desc: this.addForm.description,
              price: this.addForm.price,
              classify_id: this.addForm.category,
              detail_ids: this.addForm.detailId
            };
            this.$http.post("/api/index/goods/add", para).then(function(res) {
              console.log(res);
              if (res.data.code === 200) {
                that.addLoading = false;
                console.log("add success");
                that.$message({
                  message: "商品添加成功",
                  type: "success"
                });
                that.addFormVisible = false;
              }
              if (
                res.data.code === 201 ||
                res.data.code === 202 ||
                res.data.code === 203 ||
                res.data.code === 204
              ) {
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
            this.getUsers();
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
    handlePictureId(response, file, fileList) {
      console.log(response);
      if (this.addForm.imgId === "0") {
        this.addForm.imgId = response.id;
      } else {
        this.addForm.imgId = this.addForm.imgId + "," + response.id;
      }
      console.log(this.addForm.imgId);
    },
    handleDetailId(response, file, fileList) {
      if (this.addForm.detailId === "0") {
        this.addForm.detailId = response.id;
      } else {
        this.addForm.detailId = this.addForm.detailId + "," + response.id;
      }
      console.log(this.addForm.detailId);
    }
  },
  mounted() {
    this.getProductList();
    this.getClassifyList();
    console.log(this.addForm.imgId);
  }
};
</script>

<style scoped>
</style>