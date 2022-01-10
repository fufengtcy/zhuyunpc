<template>
  <div class="addDemo">
    <a-button type="primary" @click="showDrawer"> + 添加 </a-button>
    <a-drawer
      title="添加项目"
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
        <a-form-item label="项目名称">
          <a-input
            placeholder="请输入项目名称"
            autocomplete="off"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入项目名称' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="所在地区">
          <a-cascader
            :options="cascader"
            placeholder="请选择所在地区"
            v-decorator="['region']"
          />
        </a-form-item>
        <a-form-item label="详细地址">
          <a-input placeholder="请输入详细地址" v-decorator="['address']" />
        </a-form-item>
        <a-form-item label="负责人">
          <a-select v-decorator="['principal']" placeholder="请选择负责人">
            <a-select-option
              v-for="item of principalValue"
              :value="item.name"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input placeholder="请输入联系电话" v-decorator="['phone']" />
          <div class="tip">联系电话对应相应小区的打印单据显示</div>
        </a-form-item>
        <a-form-item label="项目图片">
          <a-upload
            name="file"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            action="https://api5.cvoon.com/base/manage/upload"
            :before-upload="beforeUpload"
            @change="handleChange"
            v-decorator="['picture']"
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
        <a-form-item>
          <a-button type="primary" @click="addFormSubmit"> 保存 </a-button>
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>
<script>
import axios from "axios";
import { addCommunities } from "@/api/communities";
import { userListAll } from "@/api/user.js";
function getBase64(img, callback) {
  console.log(img);
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
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
      true: true,
      visible: false,
      formLayout: "horizontal",
      addForm: this.$form.createForm(this),
      cascader: [],
      loading: false,
      imageUrl: "",
      principalValue: [],
    };
  },
  methods: {
    deleteImg(e) {
      this.imageUrl = null;
      e.stopPropagation();
    },
    async handleGetUserListAll() {
      const { data } = await userListAll();
      this.principalValue = data;
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
          values.picture = this.imageUrl;
          this.handlePostAddCommunities(values);
        } else {
          this.$message.error("表单还未提交完整");
        }
      });
    },
    afterVisibleChange(val) {},
    showDrawer() {
      this.visible = true;
      this.imageUrl = null;
      this.handleGetUserListAll();
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
