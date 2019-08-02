<template>
  <div>
    <Header />
    <nuxt />
    <Footer />
  </div>
</template>
<script>
// 导入组件,.vue可以省略
import Header from "@/components/header";
import Footer from "@/components/footer";
export default {
  // 添加组件的注册
  components: {
    Header,
    Footer
  }
};
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}

ul,
li,
ol {
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
}

em,
i {
  font-style: normal;
}
</style>




