<template>
  <div class="home">
    <div class="top">
      <a-row>
        <a-form
          :form="searchForm"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-col :span="5">
            <a-form-item label="负责人">
              <a-select
                v-decorator="['principal']"
                placeholder="请选择负责人"
                @change="handleSearch"
                :allowClear="allowClear"
              >
                <a-select-option v-for="item of principalValue" :key="item.id">
                  <img
                    :src="item.avatar"
                    alt=""
                    style="border-radius: 50%; width: 30px; height: 30px"
                  />
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="联系电话">
              <a-input
                @change="handleInputChange"
                v-decorator="['phone']"
                placeholder="请输入联系电话"
                autocomplete="off"
              />
            </a-form-item>
          </a-col>
        </a-form>

        <a-col></a-col>
      </a-row>
    </div>
    <div class="content">
      <div class="top">
        <a-row type="flex" justify="space-between">
          <a-col :span="8">项目管理</a-col>
          <a-col :span="8" :offset="2" :push="6">
            <!-- <a-button type="primary"> + 添加 </a-button> -->
            <AddDemo @getAddDemo="getAddDemoF"></AddDemo>
            <EditDemo
              ref="EditDemo"
              @getEditDrawerData="getEditDrawerDataF"
            ></EditDemo>
          </a-col>
        </a-row>
      </div>

      <a-table
        :columns="columns"
        rowKey="communityId"
        :data-source="tableData"
        :locale="{ emptyText: '暂无数据' }"
        :pagination="false"
      >
        <a slot="communityName" slot-scope="text">
          <a-tooltip>
            <template slot="title"> {{ text }} </template>
            {{ text }}
          </a-tooltip>
        </a>
        <span slot="action" slot-scope="text, record, index">
          <a @click="editInfo(record, index)">编辑</a>
          <a-divider type="vertical" />
          <a @click="deleteInfo(record)">删除</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AddDemo from "@/components/AddDemo.vue";
import EditDemo from "@/components/EditDemo.vue";
import {
  communities,
  deleteCommunities,
  editCommunities,
} from "@/api/communities";
import { userListAll } from "@/api/user.js";

export default {
  name: "Home",
  components: {
    AddDemo,
    EditDemo,
  },
  created() {
    this.newTableData = this.tableData;
    // axios({
    //   method: "get",
    //   url: "communities/list?community_ids=&pagesize=20&page=1&token=3c47c9fd549ea24d5fee29c65469cbc067d6044655b69a2412eeca70121d62ed",
    // })
    //   .then((resp) => {
    //     console.log(resp); //请求成功
    //     // this.tableData = resp.data.data;
    //   })
    //   .catch((error) => {
    //     console.log(error); //请求失败
    //   });
    this.handleGetCommunities();
    this.handleGetUserListAll();
  },
  data() {
    return {
      newTableData: [],
      phoneValue: "",
      formLayout: "horizontal",
      searchForm: this.$form.createForm(this),
      allowClear: true,
      principalValue: [],
      columns: [
        {
          title: "项目名称",
          dataIndex: "communityName",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "communityName" },
        },
        {
          title: "所在地区",
          dataIndex: "region",
        },
        {
          title: "详细地址",
          dataIndex: "address",
        },
        {
          title: "负责人",
          dataIndex: "principal",
          // scopedSlots: { customRender: "tags" },
        },
        {
          title: "负责人电话",
          dataIndex: "phone",
        },
        {
          title: "管理面积",
          dataIndex: "totalArea",
        },
        {
          title: "楼座数量",
          dataIndex: "buildingCount",
        },
        {
          title: "房屋数量",
          dataIndex: "houseCount",
        },
        {
          title: "业主数量",
          dataIndex: "ownerCount",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      tableData: [],
    };
  },
  methods: {
    async handleGetEditCommunities(communityId) {
      const { data } = await editCommunities(communityId);
      this.$refs.EditDemo.openEditDarwer(data, communityId);
      console.log(777);
    },
    async handleGetCommunities() {
      const { data } = await communities();
      // console.log(data.list);

      this.tableData = data.list;
      // this.tableData = data.list;
    },
    async handleDeleteCommunities(communityId) {
      const { data } = await deleteCommunities(communityId);
      console.log(1);
    },

    async handleGetUserListAll() {
      const { data } = await userListAll();
      this.principalValue = data;
      console.log("+++");
      console.log(this.principalValue);
    },
    getEditDrawerDataF(value, index) {
      value.key = index;
      this.$set(this.tableData, index, value);
    },
    editInfo(record, index) {
      console.log(record);
      this.handleGetEditCommunities(record.communityId);
    },
    deleteInfo(value) {
      // this.tableData.splice(value, 1);
      this.handleDeleteCommunities(value.communityId);
      // this.$message.success("删除成功");
      this.handleGetCommunities();
    },
    handleSearch(values) {
      this.tableData = this.newTableData;
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
          }
        }
      } else {
        console.log("this");
        console.log(this.newTableData);
        this.tableData = this.newTableData;
      }
    },

    handleInputChange(value) {
      this.tableData = this.newTableData;
      this.phoneValue = this.phoneValue.concat(value.data);
      if (value.data == null) {
        this.phoneValue = "";
        this.tableData = this.newTableData;
      }
      console.log(value.data);
      console.log(this.phoneValue);
      if (this.phoneValue !== undefined) {
        for (const i in this.tableData) {
          if (this.tableData[i] !== undefined) {
            // 姓名查询
            let arr = this.tableData.filter((value, index) => {
              if (value.phone == null) {
                value.phone = "";
              }
              return value.phone.indexOf(this.phoneValue) !== -1;
            });
            // 手机号查询
            // let arr = this.tableData.filter(
            //   (value, index) => value.phone.indexOf(values) !== -1
            // );
            this.tableData = arr;
          } else {
            console.log("no");
            this.tableData = this.newTableData;
          }
        }
      } else {
        console.log("this");
        console.log(this.newTableData);
        this.tableData = this.newTableData;
      }
    },
    getAddDemoF(value) {
      this.handleGetCommunities();
      // value.key = this.tableData.length + 1;
      // this.tableData.push(value);
    },
  },
};
</script>
<style lang="less" scoped>
.home {
  background-color: #f0f2f5;
  overflow: hidden;
  padding: 50px;
  .top {
    background-color: #fff;
    padding: 20px 20px 0 20px;
  }
  .content {
    margin-top: 30px;
    background: #ffffff;
    .top {
      padding: 15px;
    }
  }
}
</style>
