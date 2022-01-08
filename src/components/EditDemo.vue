<template>
  <div class="editDemo">
    <a-drawer
      title="编辑项目"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
      width="400"
    >
      <a-form
        :form="editForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 30 }"
        labelAlign="left"
      >
        <a-form-item label="项目名称">
          <a-input
            placeholder="请输入项目名称"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入项目名称' }],
                initialValue: this.editDetail.name,
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="所在地区">
          <a-cascader
            :options="cascader"
            placeholder="请选择所在地区"
            v-decorator="['region', { initialValue: this.editDetail.region }]"
          />
        </a-form-item>
        <a-form-item label="详细地址">
          <a-input
            placeholder="请输入详细地址"
            v-decorator="['address', { initialValue: this.editDetail.address }]"
          />
        </a-form-item>
        <a-form-item label="负责人">
          <a-select
            v-decorator="[
              'principal',
              { initialValue: this.editDetail.principal },
            ]"
            placeholder="请选择负责人"
          >
            <a-select-option value="负责人1"> 负责人1 </a-select-option>
            <a-select-option value="负责人2"> 负责人2 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input
            placeholder="请输入联系电话"
            v-decorator="['phone', { initialValue: this.editDetail.phone }]"
          />
          <div class="tip">联系电话对应相应小区的打印单据显示</div>
        </a-form-item>
        <a-form-item label="项目图片">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :before-upload="beforeUpload"
            @change="handleChange"
            v-decorator="[
              'projectPicture',
              { initialValue: this.editDetail.projectPicture },
            ]"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">添加</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="editFormSubmit"> 保存 </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script>
import axios from "axios";
// import { editCommunities } from "@/api/communities";
export default {
  created() {
    axios({
      method: "get",
      url: "/base/manage/base-data/area?community_ids=",
    })
      .then((resp) => {
        // console.log(resp); //请求成功
        this.cascader = resp.data.data;
      })
      .catch((error) => {
        console.log(error); //请求失败
      });
  },
  data() {
    return {
      editDetail: {},
      visible: false,
      formLayout: "horizontal",
      editForm: this.$form.createForm(this),
      cascader: [],
      loading: false,
      imageUrl: "",
    };
  },
  methods: {
    editFormSubmit() {
      this.editForm.validateFields((err, values) => {
        console.log("~~~");
        console.log(values);

        this.$emit("getEditDrawerData", values, this.editIndex);
        this.visible = false;
        this.$message.success("修改成功");
      });
    },

    openEditDarwer(value, index) {
      this.visible = true;
      console.log("waawawa");
      this.editDetail = value;
      console.log(this.editDetail);
      this.editIndex = index;
    },
    afterVisibleChange() {},
    onClose() {
      this.visible = false;
    },
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("You can only upload JPG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("Image must smaller than 2MB!");
      }
      return isJpgOrPng && isLt2M;
    },
  },
};
</script>
<style scoped></style>
