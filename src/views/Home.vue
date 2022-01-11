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
            <a-form-item label="快速搜索">
              <a-input
                @change="handleInputChange"
                v-decorator="['phone']"
                placeholder="请输入通知标题"
                autocomplete="off"
              />
            </a-form-item>
          </a-col>
          <a-col :span="5">
            <a-form-item label="添加时间">
              <a-range-picker
                :disabled-date="disabledDate"
                :disabled-time="disabledRangeTime"
                format="YYYY-MM-DD HH:mm:ss"
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
        <a-popconfirm
          v-if="selectedRowKeys.length"
          title="确定删除所选项目？"
          okText="确定"
          cancelText="取消"
          @confirm="() => start()"
        >
          <a-button style="margin-left: 8px" type="primary"> 删除 </a-button>
        </a-popconfirm>
        <a-button
          v-else
          @click="nothing"
          style="margin-left: 8px"
          type="primary"
        >
          删除
        </a-button>
        <!-- <a-button style="margin-left: 8px" type="primary" @click="start">
          删除
        </a-button> -->
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
        :pagination="false"
        :loading="loading"
        :scroll="{ y: 500 }"
      >
        <a slot="communityName" slot-scope="text">
          <a-tooltip>
            <template slot="title"> {{ text }} </template>
            {{ text }}
          </a-tooltip>
        </a>
        <!-- <div slot="aaa" class="aaa" slot-scope="text">
          <a-tooltip>
            <template slot="title"> {{ text }} </template>
            {{ text }}
          </a-tooltip>
        </div> -->
        <div slot="aaa" class="aaa" slot-scope="text">
          <a-tooltip>
            <img style="width: 50px; height: 50px" :src="text" alt="" />
          </a-tooltip>
        </div>
        <div slot="top" class="top" slot-scope="text">
          <a-popconfirm
            :title="topTitle"
            okText="确定"
            cancelText="取消"
            @confirm="() => topSwitch(text)"
          >
            <a-switch
              :defaultChecked="text"
              :checked="topSwitchValue"
              @change="topSwitchClick"
            />
          </a-popconfirm>
        </div>
        <div slot="visible" class="visible" slot-scope="text">
          <a-popconfirm
            :title="visibleTitle"
            okText="确定"
            cancelText="取消"
            @confirm="() => visibleSwitch(text)"
          >
            <a-switch
              :defaultChecked="text"
              :checked="visibleSwitchValue"
              @change="visibleSwitchClick"
            />
          </a-popconfirm>
        </div>
        <span slot="action" slot-scope="text, record, index">
          <a @click="() => editInfo(record, index)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除所选项目？"
            okText="确定"
            cancelText="取消"
            @confirm="() => deleteInfo(record.noticeId)"
          >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
          <!-- <a @click="deleteInfo(record.communityId)"></a> -->
        </span>
      </a-table>
      <div class="bottomBox">
        <Pagination ref="Pagination" @change="onChangePge"></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import AddDemo from "@/components/AddDemo.vue";
import EditDemo from "@/components/EditDemo.vue";
import Pagination from "@/components/Pagination.vue";
import moment from "moment";
import {
  communities,
  deleteCommunities,
  editCommunities,
} from "@/api/communities";
import { userListAll } from "@/api/user.js";
import axios from "axios";

const queryData = (params) => {
  return axios.get("https://api5.cvoon.com/base/manage/communities/list", {
    params: params,
  });
};

export default {
  name: "Home",
  components: {
    AddDemo,
    EditDemo,
    Pagination,
  },
  created() {
    // this.newTableData = this.tableData;
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
    this.handleGetCommunities(1);
    this.handleGetUserListAll();
  },
  data() {
    return {
      newTableData: [],
      phoneValue: "",
      loading: false,
      tableLength: 0,
      formLayout: "horizontal",
      searchForm: this.$form.createForm(this),
      allowClear: true,
      principalValue: [],
      currentPage: 0,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      columns: [
        {
          title: "通知标题",
          dataIndex: "name",

          slots: { title: "customTitle" },
          scopedSlots: { customRender: "communityName" },
        },
        {
          title: "首页图片",
          dataIndex: "img",
          scopedSlots: { customRender: "aaa" },
        },
        {
          title: "所属项目",
          dataIndex: "communityName",
        },
        {
          title: "通知人员",
          dataIndex: "buildingList",
          // scopedSlots: { customRender: "tags" },
        },
        {
          title: "置顶",
          dataIndex: "top",
          scopedSlots: { customRender: "top" },
        },
        {
          title: "显示",
          dataIndex: "visible",
          scopedSlots: { customRender: "visible" },
        },
        {
          title: "小程序浏览人数",
          dataIndex: "mpViewCount",
        },
        {
          title: "公众号推送人数",
          dataIndex: "oaPushCount",
        },
        {
          title: "短信发送人数",
          dataIndex: "smsSendCount",
        },
        {
          title: "添加时间",
          dataIndex: "createdAt",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      tableData: [],
      total: 0,
      topSwitchValue: false,
      visibleSwitchValue: false,
      topTitle: "确定打开置顶？",
      visibleTitle: "是否显示该通知",
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    topSwitch() {
      this.topSwitchValue = !this.topSwitchValue;
      setTimeout(() => {
        if (this.topSwitchValue) {
          this.topTitle = "是否关闭置顶？";
        } else {
          this.topTitle = "确定打开置顶？";
        }
      }, 500);
    },
    visibleSwitch() {
      this.visibleSwitchValue = !this.visibleSwitchValue;
      setTimeout(() => {
        if (this.visibleSwitchValue) {
          this.visibleTitle = "确定隐藏该通知？";
        } else {
          this.visibleTitle = "是否显示该通知？";
        }
      }, 500);
    },
    topSwitchClick(e) {
      console.log(e);
    },
    visibleSwitchClick() {},
    // 分页
    onChangePge(current) {
      this.currentPage = current;
      this.handleGetCommunities(this.currentPage);
      console.log("total");
      console.log(this.total);
      this.$refs.Pagination.totalCurrent(this.total);
    },
    async handleGetEditCommunities(noticeId, index) {
      console.log("noticeId");
      console.log(noticeId);
      const { data } = await editCommunities(noticeId);
      // data.communityId = communityId;
      this.$refs.EditDemo.openEditDarwer(data, index);
    },
    async handleGetCommunities(page) {
      const { data } = await communities(page);
      this.total = data.total;
      console.log("数据呢");

      this.tableData = data.list;
      // this.tableData = data.list;
    },
    async handleDeleteCommunities(communityId) {
      await deleteCommunities(communityId);
      this.handleGetCommunities(1);
      this.$message.success("删除成功");
    },
    moment,
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },

    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    },

    disabledDateTime() {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    },

    disabledRangeTime(_, type) {
      if (type === "start") {
        return {
          disabledHours: () => this.range(0, 60).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      }
      return {
        disabledHours: () => this.range(0, 60).splice(20, 4),
        disabledMinutes: () => this.range(0, 31),
        disabledSeconds: () => [55, 56],
      };
    },

    async handleGetUserListAll() {
      const { data } = await userListAll();
      this.principalValue = data;
    },
    getEditDrawerDataF(value, index) {
      // value.communityId = index;
      this.$set(this.tableData, index, value);
      this.handleGetCommunities(1);
    },
    editInfo(record) {
      this.handleGetEditCommunities(record.noticeId);
      this.handleGetUserListAll();
    },
    nothing() {
      this.$message.error("请选择至少一个删除项");
    },
    async deleteInfo(value) {
      try {
        await this.handleDeleteCommunities(value);
      } catch (error) {}
      // this.tableData.splice(value, 1);
      // this.$message.success("删除成功");
    },
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
      if (this.phoneValue !== "") {
        for (const i in this.tableData) {
          if (this.tableData[i] !== undefined) {
            await this.handleGetCommunities(1);
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
        this.handleGetCommunities(1);
      }
    },
    getAddDemoF(value) {
      this.handleGetCommunities(1);
      this.$refs.Pagination.defaultCurrent();
      console.log(this.tableData);
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
