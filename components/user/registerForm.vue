<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input v-model="form.username" placeholder="用户名手机"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input v-model="form.captcha" placeholder="验证码">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input v-model="form.nickname" placeholder="你的名字"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input v-model="form.password" placeholder="密码" type="password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input v-model="form.checkPassword" placeholder="确认密码" type="password"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>
<script>
export default {
  data() {
    // 验证再次输入密码
    // rule当前的规则
    // value输入框的值\
    // callback回调函数,必须要调用的,不调用就不会验证
    const validatePass = (rule, value, callback) => {
      console.log(validatePass);
      if (value === "") {
        callback(new Error("再打一次啊! 你个鬼"));
      } else if (value !== this.form.password) {
        callback(new Error("你是要我拍你是吧!照上面的来"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        captcha: "", //验证码
        nickname: "",
        password: "",
        checkPassword: ""
      },
      // 表单规则
      rules: {
        username: [
          {
            required: true,
            message: "不打名字怎么知道你是谁? 你是鬼啊!",
            trigger: "blur"
          }
        ],
        captcha: [
          { required: true, message: "都说了,随便打也行啊", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "你是要我动手是吧!", trigger: "blur" }
        ],
        password: [{ required: true, messsage: "你还要我说几遍啊!!" }],
        checkPassword: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    //   手机发送验证码
    handleSendCaptcha() {
      // 判断手机号码是否为空
      if (!this.form.username) {
        this.$message.warning("手机号码不能为空");
        return;
      }

      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.form.username
        }
      }).then(res => {
        const { code } = res.data;
        this.$alert(`模拟手机验证码为:${code}`, "提示", { type: "warning" });
      });
    }
  },

  //   注册
  handleRegSubmit() {
    this.$refs.form.vakidate(valid => {
      if (valid) {
        // es6的标准语法,解构出特定的属性后,剩余的属性可以用...+表两名访问
        const { checkPassword, ...porps } = this.form;
        // 调用注册的接口
        this.$axios({
          url: "/accounts/register",
          method: "POST",
          data: porps
        }).then(res => {
          // 第一个参数是调用的方法名,第二个参数就是数据
          this.$store.commit("user/setUserInfo", res.data);
          // 跳转到首页
          this.$router.push("/");
        });
      }
    });
  }
};
</script>
<style lang="less" scoped>
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>


