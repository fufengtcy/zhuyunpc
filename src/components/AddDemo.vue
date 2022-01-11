<template>
  <div class="addDemo">
    <a-button type="primary" @click="showDrawer"> + 添加 </a-button>
    <a-drawer
      title="添加通知"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
      :destroyOnClose="true"
      width="400"
    >
      <a-form
        :form="addForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 30 }"
        labelAlign="left"
      >
        <a-form-item label="所属项目">
          <a-select
            v-decorator="['project', { rules: [{ required: true }] }]"
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
          <FindMultiUsersSelectComponent
            placeholder="请选择其他"
            @change="onUserIdsChange"
            :value="userId"
          />
          <!-- <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择楼座"
            @change="handleChangeBalcony"
            v-decorator="[
              'buildingIdList',
              { rules: [{ required: true, message: '请选择要通知的人员' }] },
            ]"
          >
            <a-select-option v-for="item in balconyList" :key="item.buildingId">
              {{ item.buildingName }}
            </a-select-option>
          </a-select> -->
        </a-form-item>
        <a-form-item label="通知标题">
          <a-input
            placeholder="请输入通知标题"
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入通知标题' }] },
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
              { rules: [{ required: true, message: '请添加首页图片' }] },
            ]"
          >
            <div v-if="imageUrl" class="imgBox">
              <img
                style="width: 100%; height: 100%"
                v-if="imageUrl"
                :src="imageUrl"
                alt="avatar"
              />
              <div class="deleteImg" @click="deleteImg">x</div>
            </div>

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
              { rules: [{ required: true, message: '请添加首页图片' }] },
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="addFormSubmit"> 提交 </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script>
import axios from "axios";
import { addCommunities } from "@/api/communities";
import { userListAll, balconyList } from "@/api/user.js";
import FindMultiUsersSelectComponent from "./FindMultiUsersSelectComponent.vue";
function getBase64(img, callback) {
  console.log(img);
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  created() {
    console.log("created!~~~~~~~");
  },
  components: {
    FindMultiUsersSelectComponent,
  },
  data() {
    return {
      true: true,
      userId: undefined,
      visible: false,
      formLayout: "horizontal",
      addForm: this.$form.createForm(this),
      cascader: [],
      loading: false,
      imageUrl: "",
      principalValue: ["美国白宫"],
      allowClear: true,
      balconyList: [],
      projectClick: "",
      community_ids: 0,
    };
  },
  methods: {
    onUserIdsChange(id) {
      this.userId = id;
      console.log("++++");
      console.log(this.userId);
      console.log("++++");
    },
    deleteImg(e) {
      this.imageUrl = null;
      e.stopPropagation();
    },
    handleChangeBalcony(value) {
      console.log(`selected ${value}`);
    },
    async handleGetUserListAll() {
      const { data } = await userListAll();
      this.principalValue = data;
    },
    async handleGetbalconyList(value) {
      const { data } = await balconyList(value);
      console.log(data);
      this.balconyList = data;
    },

    async handlePostAddCommunities(value) {
      const data = await addCommunities(value);
      if (data.code == 200) {
        this.$message.success("添加成功");
        this.visible = false;
        this.$emit("getAddDemo", value);
      }
    },
    addFormSubmit() {
      this.addForm.validateFields((err, values) => {
        if (!err) {
          values.communityId = this.community_ids;
          values.img = this.imageUrl;
          this.handlePostAddCommunities(values);
        } else {
          this.$message.error("表单还未提交完整");
        }
      });
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
    afterVisibleChange(val) {},
    async handleSearch(values) {
      // this.tableData = this.newTableData;
      await this.handleGetCommunities(1);
      // this.tableData = this.newTableData;
      // console.log(this.searchForm);
      if (values !== undefined) {
        for (const i in this.tableData) {
          if (values[i] !== undefined) {
            // 姓名查询
            let arr = this.tableData.filter((value, index) => {
              if (value.principal == null) {
                value.principal = "";
              }
              return value.principal.indexOf(values) !== -1;
            });
            // 手机号查询
            // let arr = this.tableData.filter(
            //   (value, index) => value.phone.indexOf(values) !== -1
            // );
            this.tableData = arr;
          } else {
            // this.tableData = this.immobilityData;
            // this.tableData = this.newTableData;
          }
        }
      } else {
        // this.tableData = this.newTableData;
        this.handleGetCommunities(1);
      }
    },
    showDrawer() {
      this.visible = true;
      this.imageUrl = null;
      this.handleGetUserListAll();
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
          // this.imageUrl = imageUrl;
          this.imageUrl = info.file.response.data;
          console.log(this.imageUrl);
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
<style lang="less" scoped>
.tip {
  color: #8c8c8c;
  margin-top: -13px;
  margin-left: 5px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.deleteImg {
  width: 20px;
  height: 20px;
  top: 0;
  right: 0;
  font-weight: bold;
  cursor: pointer;
  // background-color: pink;
  position: absolute;
}
.imgBox {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
}
.ant-upload {
  padding: 0;
}
</style>
