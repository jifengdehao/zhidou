<template>
  <div class="empty-wp">
    <p class="empty-bd">{{ text || '暂无数据' }}</p>
  </div>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    text: {
      type: String,
    },
  },
  data() {
    return {

    };
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

</style>
