<template>
  <div>
    <a-select :placeholder="placeholder" :value="value" @change="handleChange">
      <a-select-option v-for="item in principalValue" :key="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
import { userListAll } from "@/api/user.js";
export default {
  props: {
    value: {
      required: false,
      type: String,
    },
    placeholder: {
      required: false,
    },
  },

  created() {
    this.handleGetUserListAll();
  },
  data() {
    return {
      principalValue: [],
    };
  },
  methods: {
    handleChange(id) {
      this.$emit("change", id);
    },
    async handleGetUserListAll() {
      try {
        const { data } = await userListAll();
        this.principalValue = data;
      } catch {}
    },
  },
};
</script>