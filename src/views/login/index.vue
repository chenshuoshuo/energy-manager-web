<template>
  <div class="login-container">
    <div class="sys-name">
      <h1>智慧城管视频分析系统</h1>
      <h4>Smart City Management Video Analysis System</h4>
    </div>
    <div class="login-box">
      <div class="login-from-box">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <el-form-item prop="username">
            <span class="img-container">
              <img src="../../assets/login_images/user.png" alt="">
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              name="username"
              type="text"
              maxlength="20"
              minlength="2"
              auto-complete="off"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="img-container">
              <img src="../../assets/login_images/password.png" alt="">
            </span>
            <el-input
              ref="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              name="password"
              auto-complete="off"
              maxlength="12"
              minlength="6"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item class="checkbox-item">
            <el-checkbox v-model="passwordState.rember" style="flex:1;text-align:left;">记住密码</el-checkbox>
            <el-checkbox v-model="passwordState.auto">自动登录</el-checkbox>
          </el-form-item>
          <el-button :loading="loading" type="login" style="width:100%;font-size:24px;border-radius:0;" @click.native.prevent="handleLogin">
            登&emsp;录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername, validPassword } from '@/utils/validate'
import { getRember, getAuto, saveRember, saveAuto, saveUserCount, getUserCount, savePassword, getPassword } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (value.length < 2 || value.length > 20) {
        callback(new Error('用户名必须大于2位小于20位'))
      } else if (!validUsername(value)) {
        callback(new Error('用户名由字母、数字和汉字组成'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error('请输入正确的密码'))
      } else if (!validPassword(value)) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    return {
      passwordState: {
        rember: getRember(),
        auto: getAuto()
      },
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      capsTooltip: false,
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // 如果记住密码
    if (this.passwordState.rember) {
      this.loginForm.username = getUserCount()
      this.loginForm.password = getPassword()
    }
    // 如果自动登录
    if (this.passwordState.auto) {
      this.loginForm.username = getUserCount()
      this.loginForm.password = getPassword()
      this.handleLogin()
    }
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
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
              // 登录成功判断是否记住密码或自动登录
              saveRember(this.passwordState.rember)
              saveAuto(this.passwordState.auto)
              if (this.passwordState.rember || this.passwordState.auto) {
                saveUserCount(this.loginForm.username)
                savePassword(this.loginForm.password)
              }
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#fff;
$light_gray:#333;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 50px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 50px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item:not(.checkbox-item) {
    border:1px solid rgba(192,192,192,1);
    background: #fff;
    // border-radius: 5px;
    color: #454545;
    .el-form-item__content{
      display: flex;
    }
  }
  .el-checkbox__input.is-checked + .el-checkbox__label{
    color: #2d3a4b;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #2d3a4b;
    border-color: #2d3a4b;
  }
  .el-checkbox__inner{
    &:hover,
    &:visited,
    &:active,
    &:focus{
      border-color: #2d3a4b;
    }
  }
  .el-form-item.checkbox-item{
    .el-form-item__content{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .sys-name{
    color: #445061;
    text-align: center;
    h1{
      margin-top: 10vh;
      font-size: 44px;
      margin-bottom: 0;
      font-weight: normal;
    }
    h4{
      font-size: 22px;
      margin-top: 10px;
      margin-bottom: 16px;
      font-weight: normal;
    }
  }
  .login-box{
    position: relative;
    height: 65vh;
    background: url('../../assets/login_images/background.png');
    background-size: 100% 100%;
    .login-from-box{
      position: absolute;
      padding: 30px;
      bottom: 42px;
      left: 50%;
      transform: translateX(-50%);
      width:700px;
      background:rgba(255,255,255,0.18);
      border:1px solid rgba(198, 215, 237, 0.58);
      border-radius:30px;
      .login-form {
        position: relative;
        max-width: 100%;
        padding: 52px 146px 33px;
        overflow: hidden;
        background: #fff;
      }
    }
  }

  .img-container {
    width: 50px;
    height: 50px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
