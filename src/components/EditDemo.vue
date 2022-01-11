<template>
  <div class="editDemo">
    <a-drawer
      title="编辑通知"
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
        <a-form-item label="所属项目">
          <a-select
            v-decorator="[
              'communityName',
              {
                rules: [{ required: true }],
                initialValue: this.editDetail.communityName,
              },
            ]"
            placeholder="请选择所属项目"
            @change="handleProject"
            :showSearch="allowClear"
          >
            <a-select-option
              v-for="item of principalValue"
              :value="item.name"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="通知人员">
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择楼座"
            @change="handleChangeBalcony"
            v-decorator="[
              'buildingIdList',
              {
                rules: [{ required: true, message: '请选择要通知的人员' }],
                initialValue: this.editDetail.buildingIdList,
              },
            ]"
          >
            <a-select-option v-for="item in balconyList" :key="item.buildingId">
              {{ item.buildingName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="通知标题">
          <a-input
            placeholder="请输入通知标题"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入通知标题' }],
                initialValue: this.editDetail.name,
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="首页图片">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://api5.cvoon.com/base/manage/upload"
            :before-upload="beforeUpload"
            @change="handleChange"
            v-decorator="[
              'img',
              {
                rules: [{ required: true, message: '请输入通知标题' }],
                initialValue: this.editDetail.img,
              },
            ]"
          >
            <img
              v-if="imageUrl"
              style="width: 100%; height: 100%"
              :src="imageUrl"
              alt="file"
            />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">添加</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="通知内容">
          <a-textarea
            placeholder="请输入"
            :rows="4"
            v-decorator="[
              'content',
              {
                rules: [{ required: true, message: '请添加首页图片' }],
                initialValue: this.editDetail.content,
              },
            ]"
          />
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
import { userListAll } from "@/api/user.js";
import { editCommunitiespPreservation } from "@/api/communities";
import { balconyList } from "@/api/user.js";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      editDetail: {},
      visible: false,
      formLayout: "horizontal",
      editForm: this.$form.createForm(this),
      cascader: [],
      loading: false,
      imageUrl: "",
      communityId: "",
      principalValue: [],
      principalId: "",
      e: "",
      imageUrl: "",
      principalValue: ["美国白宫"],
      allowClear: true,
      balconyList: [],
      projectClick: "",
      community_ids: 0,
    };
  },
  methods: {
    async handleGetbalconyList(value) {
      const { data } = await balconyList(value);
      console.log(data);
      this.balconyList = data;
    },
    handleChangeBalcony(value) {
      console.log(`selected ${value}`);
    },
    principalValueClick(e) {
      this.e = e;
      this.handleGetUserListAll();
    },
    editFormSubmit() {
      this.editForm.validateFields(async (err, values) => {
        console.log("ggg");
        console.log(values);
        values.communityName = values.name;
        values.communityId = this.communityId;
        values.img = this.imageUrl;
        values.noticeId = this.noticeId;
        values.principalId = this.principalId;
        // values.key =
        this.visible = false;
        await this.handleEditCommunitiespPreservation(values);
        this.$emit(
          "getEditDrawerData",
          values,
          this.editIndex,
          this.principalId
        );

        this.$message.success("修改成功");
      });
    },
    async handleEditCommunitiespPreservation(value) {
      const { data } = await editCommunitiespPreservation(value);
    },
    handleProject(e) {
      this.projectClick = e;
      console.log(e);
      this.principalValue.forEach((element, index) => {
        if (element.name == e) {
          this.community_ids = element.id;
          console.log(this.community_ids);
        }
      });
      this.handleGetbalconyList(this.community_ids);
    },
    async handleGetUserListAll() {
      const { data } = await userListAll();
      this.principalValue = data;
      this.principalValue.forEach((element) => {
        if (element.name == this.e) {
          this.principalId = element.id;
        }
      });
    },
    async openEditDarwer(value, index) {
      console.log("value");
      console.log(value);
      this.noticeId = value.noticeId;
      this.visible = true;
      this.handleGetbalconyList(value.communityId);
      await this.handleGetUserListAll();
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
      this.editDetail = value;
      this.editIndex = index;
      this.communityId = value.communityId;
      this.imageUrl = value.img;
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
          this.imageUrl = info.file.response.data;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      console.log("file");
      console.log(file);
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
