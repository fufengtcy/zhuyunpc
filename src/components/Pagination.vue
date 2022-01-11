<template>
  <div>
    <a-pagination
      v-model="current"
      show-size-changer
      :default-current="1"
      :total="50"
      @change="onChangePage"
      @showSizeChange="onShowSizeChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageSize: 20,
      current: 1,
      total: 20,
    };
  },
  watch: {
    pageSize(val) {
      console.log("pageSize", val);
    },
    current(val) {
      console.log("current", val);
    },
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    onChangePage(current) {
      this.$emit("change", current);
      console.log("子组件的total");
      console.log(this.total);
    },
    defaultCurrent() {
      console.log("已经跳转到第一页");
      this.current = 1;
    },
    totalCurrent(value) {
      this.total = value;
    },
  },
};
</script>
