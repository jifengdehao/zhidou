<template>
  <div class="scroll-wp">
    <div class="scroll-bd">
      <div class="mt20">
        <mt-cell title="产品">
          <img class="icon-delete" @click="handleDelete"
               src="/assets/icon-delete.png" alt="">
        </mt-cell>
        <mt-cell title="运营">
          <img class="icon-delete" src="/assets/icon-delete.png" alt="">
        </mt-cell>
        <mt-cell title="设计">
          <img class="icon-delete" src="/assets/icon-delete.png" alt="">
        </mt-cell>
      </div>
    </div>
    <div class="scroll-ft">
      <mt-button type="primary" @click="handleAdd">添加分类</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      handleSubmit() {
        this.$toast('保存成功');
        this.$router.push('/classroom');
      },
      handleAdd() {
        this.$messagebox.prompt('新增分类', '').then(({value}) => {
          console.log(value);
        });
      },
      handleDelete() {
        this.$messagebox.confirm('确定删除分类', '').then(() => {
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../../../styles/mixin.scss";

  .icon-delete {
    margin-right: .3rem;
    width: .28rem;
    height: .3rem;
  }
</style>
