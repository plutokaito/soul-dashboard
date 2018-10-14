import React, { Component } from "react";
import { Modal, Form, Select, Input, Switch, Button } from "antd";
import { connect } from "dva";
import styles from "./selector.less";

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ global }) => ({
  platform: global.platform
}))
class AddModal extends Component {
  constructor(props) {
    super(props);
    const ruleConditions = props.ruleConditions || [
      {
        paramType: "",
        operator: "",
        paramName: "",
        paramValue: ""
      }
    ];
    let replenishRate = "";
    let burstCapacity = "";
    if (props.handle) {
      const myHandle = JSON.parse(props.handle);
      replenishRate = myHandle.replenishRate;
      burstCapacity = myHandle.burstCapacity;
    }

    this.state = {
      ruleConditions,
      replenishRate,
      burstCapacity
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, handleOk } = this.props;
    const { ruleConditions, replenishRate, burstCapacity } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      const { name, matchMode, loged, enabled } = values;
      const handle = {
        replenishRate,
        burstCapacity
      };
      if (!err) {
        handleOk({
          name,
          matchMode,
          handle: JSON.stringify(handle),
          loged,
          enabled,
          sort: Number(values.sort),
          ruleConditions
        });
      }
    });
  };

  handleAdd = () => {
    let { ruleConditions } = this.state;
    ruleConditions.push({
      paramType: "",
      operator: "",
      paramName: "",
      paramValue: ""
    });
    this.setState({ ruleConditions });
  };

  handleDelete = index => {
    let { ruleConditions } = this.state;
    if (ruleConditions && ruleConditions.length > 0) {
      ruleConditions.splice(index, 1);
    }
    this.setState({ ruleConditions });
  };

  conditionChange = (index, name, value) => {
    let { ruleConditions } = this.state;
    ruleConditions[index][name] = value;
    this.setState({ ruleConditions });
  };

  onHandleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    let {
      onCancel,
      form,
      platform,
      name = "",
      matchMode = "",
      loged = true,
      enabled = true,
      sort = ""
    } = this.props;
    const { ruleConditions, replenishRate, burstCapacity } = this.state;

    let { matchModeEnums, operatorEnums, paramTypeEnums } = platform;

    if (operatorEnums) {
      operatorEnums = operatorEnums.filter(item => {
        return item.support === true;
      });
    }

    if (paramTypeEnums) {
      paramTypeEnums = paramTypeEnums.filter(item => {
        return item.support === true;
      });
    }

    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 }
      },
      wrapperCol: {
        sm: { span: 20 }
      }
    };
    const formCheckLayout = {
      labelCol: {
        sm: { span: 18 }
      },
      wrapperCol: {
        sm: { span: 4 }
      }
    };
    return (
      <Modal
        width={660}
        centered
        title="规则"
        visible
        okText="确定"
        cancelText="取消"
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称" }],
              initialValue: name
            })(<Input placeholder="名称" />)}
          </FormItem>
          <FormItem label="匹配方式" {...formItemLayout}>
            {getFieldDecorator("matchMode", {
              rules: [{ required: true, message: "请选择匹配方式" }],
              initialValue: matchMode
            })(
              <Select>
                {matchModeEnums.map(item => {
                  return (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <div className={styles.condition}>
            <h3>条件: </h3>
            {ruleConditions.map((item, index) => {
              return (
                <ul key={index}>
                  <li>
                    <Select
                      onChange={value => {
                        this.conditionChange(index, "paramType", value);
                      }}
                      value={item.paramType}
                      style={{ width: 110 }}
                    >
                      {paramTypeEnums.map(type => {
                        return (
                          <Option key={type.name} value={type.name}>
                            {type.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </li>
                  <li>
                    <Input
                      onChange={e => {
                        this.conditionChange(
                          index,
                          "paramName",
                          e.target.value
                        );
                      }}
                      value={item.paramName}
                      style={{ width: 110 }}
                    />
                  </li>
                  <li>
                    <Select
                      onChange={value => {
                        this.conditionChange(index, "operator", value);
                      }}
                      value={item.operator}
                      style={{ width: 110 }}
                    >
                      {operatorEnums.map(opearte => {
                        return (
                          <Option key={opearte.name} value={opearte.name}>
                            {opearte.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </li>

                  <li>
                    <Input
                      onChange={e => {
                        this.conditionChange(
                          index,
                          "paramValue",
                          e.target.value
                        );
                      }}
                      value={item.paramValue}
                      style={{ width: 110 }}
                    />
                  </li>
                  <li>
                    <Button
                      type="danger"
                      onClick={() => {
                        this.handleDelete(index);
                      }}
                    >
                      删除
                    </Button>
                  </li>
                </ul>
              );
            })}
            <Button
              onClick={this.handleAdd}
              style={{ marginLeft: 50 }}
              type="primary"
            >
              新增
            </Button>
          </div>
          <div className={styles.handleWrap}>
            <h4>处理: </h4>
            <ul>
              <li>
                <Input
                  addonBefore={<div>时间间隔</div>}
                  value={replenishRate}
                  style={{ width: 250 }}
                  placeholder="输入replenishRate"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("replenishRate", value);
                  }}
                />
              </li>
              <li>
                <Input
                  addonBefore={<div>最多次数</div>}
                  value={burstCapacity}
                  style={{ width: 250 }}
                  placeholder="输入burstCapacity"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("burstCapacity", value);
                  }}
                />
              </li>
            </ul>
          </div>
          <div className={styles.layout}>
            <FormItem
              style={{ margin: "0 30px" }}
              {...formCheckLayout}
              label="打印日志"
            >
              {getFieldDecorator("loged", {
                initialValue: loged,
                valuePropName: "checked",
                rules: [{ required: true }]
              })(<Switch />)}
            </FormItem>
            <FormItem {...formCheckLayout} label="是否开启">
              {getFieldDecorator("enabled", {
                initialValue: enabled,
                valuePropName: "checked",
                rules: [{ required: true }]
              })(<Switch />)}
            </FormItem>
          </div>

          <FormItem label="执行顺序" {...formItemLayout}>
            {getFieldDecorator("sort", {
              initialValue: sort,
              rules: [
                {
                  required: true,
                  message: "请输入1-100数字"
                },
                {
                  pattern: /^([1-9][0-9]{0,1}|100)$/,
                  message: "请输入1-100数字"
                }
              ]
            })(<Input placeholder="可以填写1-100之间的数字标志执行先后顺序" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AddModal);