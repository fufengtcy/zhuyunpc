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
                <a-select-option
                  v-for="item of principalValue"
                  :value="item.name"
                  :key="item.id"
                >
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
      <div style="margin-bottom: 16px">
        <a-button style="margin-left: 8px" type="primary" @click="start">
          删除
        </a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `已选择${selectedRowKeys.length} 项` }}
          </template>
        </span>
      </div>
      <a-table
        :columns="columns"
        rowKey="communityId"
        :data-source="tableData"
        :locale="{ emptyText: '暂无数据' }"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <a slot="communityName" slot-scope="text">
          <a-tooltip>
            <template slot="title"> {{ text }} </template>
            {{ text }}
          </a-tooltip>
        </a>
        <div slot="aaa" class="aaa" slot-scope="text">
          <a-tooltip>
            <template slot="title"> {{ text }} </template>
            {{ text }}
          </a-tooltip>
        </div>
        <span slot="action" slot-scope="text, record, index">
          <a @click="editInfo(record, index)">编辑</a>
          <a-divider type="vertical" />
          <a @click="deleteInfo(record.communityId)">删除</a>
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
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      columns: [
        {
          title: "项目名称",
          dataIndex: "communityName",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "communityName" },
        },
        {
          title: "所在地区",
          dataIndex: "aaa",
          scopedSlots: { customRender: "aaa" },
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
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    async handleGetEditCommunities(communityId, index) {
      const { data } = await editCommunities(communityId);
      console.log(data);
      data.communityId = communityId;
      this.$refs.EditDemo.openEditDarwer(data, index);
    },
    async handleGetCommunities() {
      const { data } = await communities();
      console.log(data.list);
      data.list.forEach((element) => {
        if (element.regionStr.length == 0) {
          element.regionStr = null;
        } else {
          element.regionStr = element.regionStr.toString();
          element.aaa = element.regionStr;
        }
      });
      this.tableData = data.list;
      // this.tableData = data.list;
    },
    async handleDeleteCommunities(communityId) {
      await deleteCommunities(communityId);
      this.handleGetCommunities();
      this.$message.success("删除成功");
    },

    async handleGetUserListAll() {
      const { data } = await userListAll();
      this.principalValue = data;
    },
    getEditDrawerDataF(value, index) {
      // value.communityId = index;
      this.$set(this.tableData, index, value);
      this.handleGetCommunities();
    },
    editInfo(record, index) {
      this.handleGetEditCommunities(record.communityId, index);
      this.handleGetUserListAll();
    },
    deleteInfo(value) {
      // this.tableData.splice(value, 1);
      this.handleDeleteCommunities(value);
      // this.$message.success("删除成功");
    },
    async handleSearch(values) {
      // this.tableData = this.newTableData;
      await this.handleGetCommunities();
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
        this.handleGetCommunities();
      }
    },

    async handleInputChange(value) {
      // this.tableData = this.newTableData;
      if (value.data !== null) {
        this.phoneValue = this.phoneValue.concat(value.data);
      } else {
        this.phoneValue = this.phoneValue.substring(
          0,
          this.phoneValue.length - 1
        );
      }
      console.log(this.phoneValue);
      if (this.phoneValue !== "") {
        for (const i in this.tableData) {
          if (this.tableData[i] !== undefined) {
            await this.handleGetCommunities();
            // 姓名查询
            let arr = this.tableData.filter((value, index) => {
              if (value.phone == null) {
                value.phone = "";
                // this.tableData = this.newTableData;
                // this.handleGetCommunities();
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
            // this.tableData = this.newTableData;
          }
        }
      } else {
        this.handleGetCommunities();
      }
    },
    getAddDemoF(value) {
      this.handleGetCommunities();
    },
    start() {
      this.loading = true;
      // ajax request after empty completing
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请选择至少一个删除项");
      }
      setTimeout(() => {
        this.selectedRowKeys.forEach((element, index) => {
          this.handleDeleteCommunities(element);
        });
        this.loading = false;
        this.selectedRowKeys = [];
      }, 100);
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);

      this.selectedRowKeys = selectedRowKeys;
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
  .aaa {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 120px;
  }
}
</style>
