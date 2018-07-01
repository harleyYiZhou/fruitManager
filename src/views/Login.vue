<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item>
      <el-radio v-model="radio" label="1">超级管理员</el-radio>
      <el-radio v-model="radio" label="2">连锁店管理员</el-radio>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import { requestLogin } from "../api/api";
//import NProgress from 'nprogress'
import md5 from "js-md5";
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: "admin",
        checkPass: "123456"
      },
      radio: "1",
      rules2: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    getmd5() {
      var a = md5("123456");
      console.log(a);
      //47bce5c74f589f4867dbd57e9ca9f808
    },
    handleSubmit2(ev) {
      var that=this;
      var _this = this;
      var loginParams = {
        account: this.ruleForm2.account,
        pwd: md5(this.ruleForm2.checkPass)
      };
      var loginParams1={
        admin_name: this.ruleForm2.account,
        admin_pwd:  md5(this.ruleForm2.checkPass)
      };
      if(this.radio==='1'){
        this.$http.post('/api/admin/admin/login',loginParams1).then(function (res) {
          if (res.data.code === 201) {
              _this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
            if (res.data.code === 200) {
              let param={key:that.ruleForm2.account};
              sessionStorage.setItem("user", '{"id":1,"username":"admin","avatar":"https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png","name":"张某某"}');
              that.$http.post("/api/admin/admin/getAdminList",param).then(function(res2){
                console.log(res2);
                sessionStorage.setItem('admin',JSON.stringify(res2.data.data));
                _this.$router.push({ path: "/table" });
              })
              console.log('登录成功');
            }
            if (res.data.code === 202) {
              _this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
        })
      }
      if (this.radio === "2") {
        this.$http
          .post("/api/admin/seller/login", loginParams)
          .then(function(res) {
            // this.logining = false;
            console.log(res);
            if (res.data.code === 201) {
              _this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
            if (res.data.code === 200) {
              sessionStorage.setItem("user", '{"id":1,"username":"admin","avatar":"https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png","name":"张某某"}');
              that.$http.post('/api/admin/seller/getSellerInfo').then(function (res2) { 
                sessionStorage.setItem('admin',JSON.stringify(res2.data.seller));
                _this.$router.push({ path: "/stock" });
              })
            }
            if (res.data.code === 202) {
              _this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
      }
      // this.$refs.ruleForm2.validate(valid => {
      //   if (valid) {
      //     //_this.$router.replace('/table');
      //     this.logining = true;
      //     //NProgress.start();
      //     var loginParams = {
      //       username: this.ruleForm2.account,
      //       password: this.ruleForm2.checkPass
      //     };

      // this.$router.push({ path: "/manager/stock" });
      //     requestLogin(loginParams).then(data => {
      //       this.logining = false;
      //       //NProgress.done();
      //       let { msg, code, user } = data;
            
      //       if (code !== 200) {
      //         this.$message({
      //           message: msg,
      //           type: "error"
      //         });
      //       } else {
      //         sessionStorage.setItem("user", JSON.stringify(user));
      //         this.$router.push({ path: "/manager/stock" });
      //       }
      //     });
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
      
    }
  },
  mounted() {
    this.getmd5();
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>