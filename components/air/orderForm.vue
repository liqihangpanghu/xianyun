<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <!-- 循环渲染的乘机人 -->
        <div class="member-info-item" v-for="(item, index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <!-- 删除按钮 -->
          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <!-- 保险的列表 -->
        <div class="insurance-item" v-for="(item, index) in infoData.insurances" :key="index">
          <el-checkbox
            @change="handleChange(item)"
            :label="`${ item.type }：￥${ item.price }/份×${ users.length }  最高赔付${ item.compensation }`"
            border
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>

    <!-- 调用allpice让总价开始计算 -->
    <input type="hidden" :value="allPrice" />
  </div>
</template>
<script>
export default {
  // 表单的双向数据绑定
  data() {
    return {
      users: [
        {
          username: "",
          id: ""
        }
      ], //用户列表,可以新增也可以删除,保存用户的对象
      insurances: [], //保险的id
      contactName: "", //联系人
      contactPhone: "", //联系电话
      captcha: "",
      invoice: false, //机票
      infoData: {} //机票信息
    };
  },
  computed: {
    // computed函数内部引用的实例的属性一旦发生变化
    // 重复调用,返回新的值
    allPrice() {
      let price = 0;
      // 接口还没有返回
      if (!this.infoData.seat_infos) {
        return 0;
      }
      // 单价
      price += this.infoData.seat_infos.org_settle_price;
      // 燃油费
      price += this.infoData.airport_tax_audlet;
      // 保险
      price += this.insurances.length * 30;
      // 人数
      price *= this.users.length;
      // 把总价返回给父组件
      this.$emit("setAllPrice", price);
      return price;
    }
  },
  mounted() {
    const { id, seat_xid } = this.$route.query;
    // 请求机票的信息,包含有保险数据
    this.$axios({
      url: "airs/" + id,
      params: {
        seat_xid
      }
    }).then(res => {
      // 获取机票信息
      this.infoData = res.data;
      // 把infodata传递给父组件
      this.$emit("setInfoData", this.infoData);
    });
  },
  methods: {
    // 添加乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },
    // 选中保险时候触发
    handleChange(item) {
      // 判断数组中是否存在id,如果存在需要删除
      const index = this.insurances.indexOf(item.id);
      if (index > _1) {
        // 删除
        this.insurances.splice(index, 1);
      } else {
        // 不存在再添加
        this.insurances.push(item.id);
      }
    },
    // 发送手机验证码
    handleSendCaptcha() {
      // 判断手机号码是否为空
      if (!this.contactPhone) {
        this.$message.warning("手机号码不能为空");
        return;
      }
      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.comtactPhone
        }
      }).then(res => {
        const { code } = res.data;
        this.$alert(`模拟手机验证码为: ${code}`, "提示", {
          type: "warning"
        });
      });
    },
    // 提交订单
    handleSubmit() {
      // 需要提交给接口的数据
      const data = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        captcha: this.captcha,
        invoice: this.invoice,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      };
    }
  }
};
</script>
<style lang="less" scoped>
</style>


