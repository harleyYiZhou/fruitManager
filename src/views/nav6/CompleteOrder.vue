<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="订单编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getOrders">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading"  @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" align="center" >
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <!-- <el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column> -->
      <el-table-column prop="trade_no" label="订单编号" align="center"  sortable>
      </el-table-column>
      <el-table-column prop="total_price" label="订单总额" align="center"  sortable>
      </el-table-column>
      <el-table-column prop="address" label="取货方式" align="center" :formatter="formatShipType" sortable>
      </el-table-column>
      <el-table-column prop="order_status" label="订单状态" align="center" :formatter="formatType" sortable>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
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
    <el-dialog title="订单详情" v-model="editFormVisible" :close-on-click-modal="false">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">订单id</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.oid}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">交易订单号</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.trade_no}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">商品名称</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.goods}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">总价</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.total_price}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">配送方式</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.type}}</div>
        </el-col>
      </el-row>
      <el-row v-if="editForm.address.info.name">
        <el-col :span="6">
          <div class="grid-content bg-purple">收货人</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.address.info.name}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">联系方式</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.address.info.phone}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">地址</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.address.info.addr}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">订单状态</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">{{editForm.order_status}}</div>
        </el-col>
      </el-row>
    </el-dialog>

    
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
// import {
//   getUserListPage,
//   removeUser,
//   batchRemoveUser,
//   editUser,
//   addUser
// } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
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
        oid: 0,
        mid: 0,
        order_status: '',
        total_price: "",
        trade_no: '',
        user_id: '',
        address: {
          type: 0,
          info: {
            phone:'',
            addr: ''
          }
        },
        goods: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
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
    formatType: function (row,column) { 
      return row.order_status==0 ? "未接单" : row.order_status==1 ? "未发货" : row.order_status==2 ? "待收货" : row.order_status==3 ? "已完成" : row.order_status==4 ? "退货退款中" : row.order_status==5 ? "已取消" : row.order_status==6 ? "已评论" :"未知";
    },
    formatShipType: function(row,column){
      let address=JSON.parse(row.address);
      return address.type==0? "上门自提" :address.type==1? "同城配送" :"未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrders();
    },
    //获取订单列表
    getOrders(){
      var that=this;
      if(this.filters.name===''){
        var para={
          pn: '1',
          size: '20',
          type: 3
        };
      }else{
        var para={
          pn: '1',
          size: '20',
          key: that.filters.name,
          type: 3
        };
      }
      this.listLoading=true;
      this.$http.post('/api/index/order/getOrderList',para).then(function(res){
        if(res.data.code===200){
          that.total = res.data.data.total;
          that.users = res.data.data.orders;
          that.listLoading = false;
        }
      });
    },
    
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getOrders();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      var that=this;
      
      this.editForm = Object.assign({}, row);
      let address=JSON.parse(row.address);
      this.editForm.address=address;
      this.editForm.type=address.type==0? "上门自提" :address.type==1? "同城配送" :"未知";
      this.editForm.order_status=row.order_status==0 ? "未接单" : row.order_status==1 ? "未发货" : row.order_status==2 ? "待收货" : row.order_status==3 ? "已完成" : row.order_status==4 ? "退货退款中" : row.order_status==5 ? "已取消" : row.order_status==6 ? "已评论" :"未知";
      this.$http.post('/api/index/order/getOrderGoodsList',{oid: row.oid}).then(function (res) { 
        // that.editForm.goods=res;
        that.editForm.goods=" ";
        for(var i=0;i<res.data.list.length;i++){
          that.editForm.goods=that.editForm.goods+''+res.data.list[i].goods_name+"*"+res.data.list[i].goods_count
        }
        console.log(that.editForm.goods);
        that.editFormVisible = true;
      })
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
              this.getOrders();
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
              this.getOrders();
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
            this.getOrders();
          });
        })
        .catch(() => {});
    },
   
  },
  mounted() {
    this.getOrders();
  }
};
</script>

<style scoped>

</style>