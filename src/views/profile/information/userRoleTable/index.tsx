import { Component, Vue } from 'vue-property-decorator';
import {
  Form, Table, Input, Select, Radio, Card, Icon, Button, Col, Row, Avatar, Tag, Dropdown, Menu,
} from 'ant-design-vue';
import models from '@/models';
import { api } from '@/api';

import './index.less';

const User: any = models.user;

@Component({
  name: 'UserList',
  components: {
    'a-form': Form,
    'a-table': Table,
    'a-dropdown': Dropdown,
    'a-menu': Menu,
    'a-menu-item': Menu.Item,
    'a-form-item': Form.Item,
    'a-card': Card,
    'a-row': Row,
    'a-col': Col,
    'a-input': Input,
    'a-select': Select,
    'a-radio': Radio,
    'a-radio-group': Radio.Group,
    'a-icon': Icon,
    'a-button': Button,
    'a-avatar': Avatar,
    'a-tag': Tag,
  },
})
export default class UserList extends Vue {
  labelCol = {
    xs: { span: 24 },
    sm: { span: 5 },
  }

  wrapperCol = {
    xs: { span: 24 },
    sm: { span: 16 },
  }

  columns = [
    {
      title: '识别码',
      width: '50px',
      align: 'left',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      width: '300px',
      align: 'left',
      dataIndex: 'name',
    },
    {
      title: '操作',
      width: '300px',
      align: 'left',
      dataIndex: 'action',
      customRender: this.renderOperator,
    },
  ]

  keyPath = 'permissions'

  data = []

  async mounted() {
    const currentUserPermission = this.$store.getters.permission_roles;
    this.$log.info('Permission roles:', currentUserPermission);
    // const users = User.all();
    const users = await this.generateRoleList();
    this.data = users;
  }

  async generateRoleList() {
    const response = await api.request({
      url: '/user/fetch',
      method: 'get',
      params: {
        pageParams: {
          pageNum: 1,
          pageSize: 100,
          page: true,
        },
      },
    });
    return response.data.entity;
  }


  deletePermission(action) {
    // delete permission logic
  }

  handleChange(value, key, column, record) {
    console.log(value, key, column);
    record[column.dataIndex] = value;
  }

  renderCellInput(record, rowIndex) {
    const { handleChange } = this;
    return (
      <div key={rowIndex}>
        <a-input
          style="margin: -5px 0"
          value="text"
          on-change={e => handleChange(e.target.value, record.key, rowIndex, record)}
        />
      </div>
    );
  }

  renderRoleTags(actionEntitySet) {
    return (
      <a-col>
        {actionEntitySet.map((action, key) => <a-tag key={key} closable={true} on-close={() => this.deletePermission(action)} size="64px" color="cyan" >{ action.describe }</a-tag>)}
      </a-col>
    );
  }

  /**
   * @method 行扩展的渲染函数，参数对应antd的Table>expandedRowRender的参数
   * @param {object} record 当前行的值
   * @param {number} index 当前列的序列号
   */
  expandedRowRender(record: any, index: number) {
    return (
      <a-row
        key={index}
        style="marginBottom: 12px;">
        {record.permissionDetails.map(({ permissionName, actionEntitySet }, index) => (
            <a-col span="12" key={index} style="marginBottom: 12px;">
              <h2 style="color: #1f1f1f">{permissionName}</h2>
              {actionEntitySet.length > 0 ? this.renderRoleTags(actionEntitySet) : <a-col span="20">-</a-col> }
            </a-col>
        ))}
      </a-row>
    );
  }

  createUser() {
    this.$router.push({ name: 'UserFrom' });
  }

  deleteUser(id) {
    User.$delete(id);
  }

  lockUser(row) {
    User.$update({
      status: 'inactive',
    });
  }

  renderOperator(row) {
    return (
      <div class="table-operator">
        <a-button type="primary" icon="plus" on-click={this.createUser}>
          新建
        </a-button>
        <a-dropdown>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item key="1" on-click={() => this.deleteUser(row.id)}>
              <a-icon type="delete" />
              删除
            </a-menu-item>
            <a-menu-item key="2" on-click={() => this.lockUser(row.id)}>
              <a-icon type="lock" />
              锁定
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    );
  }

  render() {
    const {
      columns, data, expandedRowRender, renderCellInput,
    } = this;
    return (<div>
      <a-table rowKey="id" columns={columns} dataSource={data} expandedRowRender={expandedRowRender} customCell={renderCellInput}>
      </a-table>
    </div>);
  }
}
