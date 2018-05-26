<template>
  <section>
    

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
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
      <el-table-column label="操作" width="140">
        <template scope="scope">
          <el-button size="small" slot="reference"  @click="handleEdit(scope.$index, scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  addUser
} from "../../api/api";

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
      dialogVisible: false,
      visible1: false
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrders();
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
          type: 2
        };
      }else{
        var para={
          pn: '1',
          size: '20',
          key: that.filters.name,
          type: 2
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
    //显示接单确认窗口
    showAccept: function(index, row) {
      this.visible1 = true;
      this.editForm = Object.assign({}, row);
    },
    //显示接单取消窗口
    showCancel: function(index, row) {
      this.visible2 = true;
      this.editForm = Object.assign({}, row);
    },
    //确认接单
    confirmOrder: function() {
      var that=this;
      let para={
        oid: that.editForm.oid
      }
      that.$http.post('/api/index/order/confirmOrder',para).then(function (res) { 
        that.visible1=false;
        if(res.data.code===200){
          that.$message({
            message: '发货成功',
            type: 'success'
          });
          that.getOrders();
        }else{
          that.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      })
    },
    //取消订单
    cancelOrder: function() {},
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
    this.getOrders();
  }
};
</script>

<style scoped>

</style>