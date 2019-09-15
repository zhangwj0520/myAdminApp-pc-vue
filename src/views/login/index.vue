<template>
  <div class="login-container">
    <section class="form_container">
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" label-width="80px">
        <!-- <el-form-item prop="userName">
          <el-input ref="userName" v-model="loginUser.userName" placeholder="请输入邮箱" />
        </el-form-item> -->

        <el-form-item label="用户名" prop="userName">
          <el-input
            ref="userName"
            v-model="loginForm.userName"
            placeholder="Username"
            name="userName"
            type="text"
            tabindex="1"
          >
            <span slot="prefix" class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <!-- <i class="el-input__icon el-icon-user" /> -->
          </el-input>
        </el-form-item>

        <el-tooltip v-model="capsTooltip" placement="right" manual>
          <div slot="content">
            <i class="el-icon-warning" />
            大小写锁定已打开
          </div>
          <el-form-item label="密码" prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <span slot="prefix" class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <span slot="suffix" class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-input></el-form-item>
        </el-tooltip>

        <el-form-item label="用户类型" prop="loginType">
          <el-select ref="loginType" v-model="loginForm.loginType" placeholder="类型">
            <el-option label="商家" value="merchant" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item>
          <el-radio-group v-model="loginForm.loginType">
            <el-radio label="merchant">商家</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">登录</el-button>

        <div class="thirdparty-box">
          <div class="tiparea">
            <p>还没有账号？现在<router-link to="/register">注册</router-link></p>
          </div>

          <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
            第三方登录
          </el-button>
        </div>
      </el-form>

      <el-dialog title="Or connect with" :visible.sync="showDialog">
        Can not be simulated on local, so please combine you own business simulation! ! !
        <br>
        <br>
        <br>
        <social-sign />
      </el-dialog>
    </section>
  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    return {
      loginForm: {
        userName: 'admin',
        password: 'admin',
        loginType: 'admin'
        // loginType: 'merchant'
      },
      loginRules: {
        userName: { required: true, message: '请输入账号', trigger: 'blur' },
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, message: '长度在不少于5 个字符', trigger: 'change' }],
        loginType: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.userName === '') {
      this.$refs.userName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  background: url(../../assets/images/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
  .form_container {
    width: 520px;
    max-width: 100%;
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
}

  .login-form {
    padding: 40px 35px 20px;;
    border-radius: 10px;
    background-color: #fff;
    .el-select{
      width: 100%;
    }
  }

  .svg-container {
    width: 25px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    width: 25px;
    font-size: 16px;
    display: inline-block;
  }
   .thirdparty-box{
     position: relative;
     height: 47px;
     .tiparea {
      font-size: 12px;
      color: #333;
    }
    .tiparea p a {
      color: #409eff;
    }
      .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
   }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
