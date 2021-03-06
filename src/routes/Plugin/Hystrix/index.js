import React, { Component } from "react";
import { Table, Row, Col, Button, Input, message, Popconfirm } from "antd";
import { connect } from "dva";
import styles from "../index.less";
import Selector from "./Selector";
import Rule from "./Rule";
import { getCurrentLocale, getIntlContent } from "../../../utils/IntlUtils";
import AuthButton from "../../../utils/AuthButton";

const { Search } = Input;

@connect(({ hystrix, global, loading }) => ({
  ...global,
  ...hystrix,
  loading: loading.effects["global/fetchPlatform"]
}))
export default class Hystrix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectorPage: 1,
      rulePage: 1,
      popup: "",
      localeName:'',
      selectorName: undefined,
      ruleName: undefined
    };
  }

  componentDidMount() {
    const { dispatch , plugins } = this.props;
    if(plugins && plugins.length > 0){
      this.getAllSelectors(1, plugins);
    }else{
      dispatch({
        type: "global/fetchPlugins",
        payload: {
          callback: (pluginList) => {
            this.getAllSelectors(1, pluginList);
          }
        }
      })
    }
  }

  getAllSelectors = (page, plugins) => {
    const { dispatch } = this.props;
    const { selectorName } = this.state;
    const pluginId = this.getPluginId(plugins, "hystrix");
    dispatch({
      type: "hystrix/fetchSelector",
      payload: {
        currentPage: page,
        pageSize: 12,
        pluginId,
        name: selectorName
      }
    });
  };

  getAllRules = page => {
    const { dispatch, currentSelector } = this.props;
    const { ruleName } = this.state;
    const selectorId = currentSelector ? currentSelector.id : "";
    dispatch({
      type: "hystrix/fetchRule",
      payload: {
        selectorId,
        currentPage: page,
        pageSize: 12,
        name: ruleName
      }
    });
  };

  getPluginId = (plugins, name) => {
    const plugin = plugins.filter(item => {
      return item.name === name;
    });
    if (plugin && plugin.length > 0) {
      return plugin[0].id;
    } else {
      return "";
    }
  };

  closeModal = () => {
    this.setState({ popup: "" });
  };

  searchSelectorOnchange = e => {
    const selectorName = e.target.value;
    this.setState({ selectorName });
  };

  searchSelector = () => {
    const { plugins } = this.props;
    this.setState({ selectorPage: 1 });
    this.getAllSelectors(1, plugins);
  }

  addSelector = () => {
    const { selectorPage } = this.state;
    const { dispatch, plugins } = this.props;
    const pluginId = this.getPluginId(plugins, "hystrix");
    this.setState({
      popup: (
        <Selector
          pluginId={pluginId}
          handleOk={selector => {
            dispatch({
              type: "hystrix/addSelector",
              payload: { pluginId, ...selector },
              fetchValue: { pluginId, currentPage: selectorPage, pageSize: 12 },
              callback: () => {
                this.closeModal();
              }
            });
          }}
          onCancel={this.closeModal}
        />
      )
    });
  };

  searchRuleOnchange = e => {
    const ruleName = e.target.value;
    this.setState({ ruleName });
  };

  searchRule = () => {
    this.setState({ rulePage: 1 });
    this.getAllRules(1);
  }

  addRule = () => {
    const { rulePage } = this.state;
    const { dispatch, currentSelector } = this.props;
    if (currentSelector && currentSelector.id) {
      const selectorId = currentSelector.id;
      this.setState({
        popup: (
          <Rule
            handleOk={rule => {
              dispatch({
                type: "hystrix/addRule",
                payload: { selectorId, ...rule },
                fetchValue: {
                  selectorId,
                  currentPage: rulePage,
                  pageSize: 12
                },
                callback: () => {
                  this.closeModal();
                }
              });
            }}
            onCancel={this.closeModal}
          />
        )
      });
    } else {
      message.destroy();
      message.warn(getIntlContent('SHENYU.COMMON.WARN.INPUT_SELECTOR'));
    }
  };

  editSelector = record => {
    const { dispatch, plugins } = this.props;
    const { selectorPage } = this.state;
    const pluginId = this.getPluginId(plugins, "hystrix");
    const { id } = record;
    dispatch({
      type: "hystrix/fetchSeItem",
      payload: {
        id
      },
      callback: selector => {
        this.setState({
          popup: (
            <Selector
              {...selector}
              handleOk={values => {
                dispatch({
                  type: "hystrix/updateSelector",
                  payload: {
                    pluginId,
                    ...values,
                    id
                  },
                  fetchValue: {
                    pluginId,
                    currentPage: selectorPage,
                    pageSize: 12
                  },
                  callback: () => {
                    this.closeModal();
                  }
                });
              }}
              onCancel={this.closeModal}
            />
          )
        });
      }
    });
  };

  deleteSelector = record => {
    const { dispatch, plugins } = this.props;
    const { selectorPage } = this.state;
    const pluginId = this.getPluginId(plugins, "hystrix");
    dispatch({
      type: "hystrix/deleteSelector",
      payload: {
        list: [record.id]
      },
      fetchValue: {
        pluginId,
        currentPage: selectorPage,
        pageSize: 12
      }
    });
  };

  pageSelectorChange = page => {
    const { plugins } = this.props;
    this.setState({ selectorPage: page });
    this.getAllSelectors(page, plugins);
  };

  pageRuleChange = page => {
    this.setState({ rulePage: page });
    this.getAllRules(page);
  };

  rowClick = record => {
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type: "hystrix/saveCurrentSelector",
      payload: {
        currentSelector: record
      }
    });
    dispatch({
      type: "hystrix/fetchRule",
      payload: {
        currentPage: 1,
        pageSize: 12,
        selectorId: id
      }
    });
  };

  editRule = record => {
    const { dispatch, currentSelector } = this.props;
    const { rulePage } = this.state;
    const selectorId = currentSelector ? currentSelector.id : "";
    const { id } = record;
    dispatch({
      type: "hystrix/fetchRuleItem",
      payload: {
        id
      },
      callback: rule => {
        this.setState({
          popup: (
            <Rule
              {...rule}
              handleOk={values => {
                dispatch({
                  type: "hystrix/updateRule",
                  payload: {
                    selectorId,
                    ...values,
                    id
                  },
                  fetchValue: {
                    selectorId,
                    currentPage: rulePage,
                    pageSize: 12
                  },
                  callback: () => {
                    this.closeModal();
                  }
                });
              }}
              onCancel={this.closeModal}
            />
          )
        });
      }
    });
  };

  deleteRule = record => {
    const { dispatch, currentSelector } = this.props;
    const { rulePage } = this.state;
    dispatch({
      type: "hystrix/deleteRule",
      payload: {
        list: [record.id]
      },
      fetchValue: {
        selectorId: currentSelector.id,
        currentPage: rulePage,
        pageSize: 12
      }
    });
  };

  asyncClick = () => {
    const { dispatch, plugins } = this.props;
    const id = this.getPluginId(plugins, "hystrix");
    dispatch({
      type: "global/asyncPlugin",
      payload: {
        id
      }
    });
  };

  changeLocales(locale) {
    this.setState({
      localeName: locale
    });
    getCurrentLocale(this.state.localeName);
  }

  render() {
    const { popup, selectorPage, rulePage } = this.state;
    const {
      selectorList,
      ruleList,
      selectorTotal,
      ruleTotal,
      currentSelector
    } = this.props;
    const selectColumns = [
      {
        align: "center",
        title: getIntlContent("SHENYU.PLUGIN.SELECTOR.LIST.COLUMN.NAME"),
        dataIndex: "name",
        key: "name"
      },
      {
        align: "center",
        title: getIntlContent("SHENYU.COMMON.OPEN") ,
        dataIndex: "enabled",
        key: "enabled",
        render: text => {
          if (text) {
            return <div className="open">{getIntlContent("SHENYU.COMMON.OPEN")}</div>;
          } else {
            return <div className="close">{getIntlContent("SHENYU.COMMON.CLOSE")}</div>;
          }
        }
      },
      {
        align: "center",
        title: getIntlContent("SHENYU.COMMON.OPERAT"),
        dataIndex: "operate",
        key: "operate",
        render: (text, record) => {
          return (
            <div>
              <span
                style={{ marginRight: 8 }}
                className="edit"
                onClick={e => {
                  e.stopPropagation();
                  this.editSelector(record);
                }}
              >
                {getIntlContent("SHENYU.COMMON.CHANGE")}
              </span>
              <AuthButton perms="plugin:hystrixSelector:delete">
                <Popconfirm
                  title={getIntlContent("SHENYU.COMMON.DELETE")}
                  placement='bottom'
                  onCancel={(e) => {
                    e.stopPropagation()
                  }}
                  onConfirm={(e) => {
                    e.stopPropagation()
                    this.deleteSelector(record);
                  }}
                  okText={getIntlContent("SHENYU.COMMON.SURE")}
                  cancelText={getIntlContent("SHENYU.COMMON.CALCEL")}
                >
                  <span
                    className="edit"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    {getIntlContent("SHENYU.COMMON.DELETE.NAME")}
                  </span>
                </Popconfirm>
              </AuthButton>
            </div>
          );
        }
      }
    ];

    const rulesColumns = [
      {
        align: "center",
        title: getIntlContent("SHENYU.COMMON.RULE.NAME"),
        dataIndex: "name",
        key: "name"
      },
      {
        align: "center",
        title: getIntlContent("SHENYU.COMMON.OPEN"),
        dataIndex: "enabled",
        key: "enabled",
        render: text => {
          if (text) {
            return <div className="open">{getIntlContent("SHENYU.COMMON.OPEN")}</div>;
          } else {
            return <div className="close">{getIntlContent("SHENYU.COMMON.CLOSE")}</div>;
          }
        }
      },
      {
        align: "center",
        title: getIntlContent("SHENYU.SYSTEM.UPDATETIME"),
        dataIndex: "dateCreated",
        key: "dateCreated"
      },
      {
        align: "center",
        title: getIntlContent("SHENYU.COMMON.OPERAT"),
        dataIndex: "operate",
        key: "operate",
        render: (text, record) => {
          return (
            <div>
              <span
                className="edit"
                style={{ marginRight: 8 }}
                onClick={e => {
                  e.stopPropagation();
                  this.editRule(record);
                }}
              >
                {getIntlContent("SHENYU.COMMON.CHANGE")}
              </span>
              <AuthButton perms="plugin:hystrixRule:delete">
                <Popconfirm
                  title={getIntlContent("SHENYU.COMMON.DELETE")}
                  placement='bottom'
                  onCancel={(e) => {
                    e.stopPropagation()
                  }}
                  onConfirm={(e) => {
                    e.stopPropagation()
                    this.deleteRule(record);
                  }}
                  okText={getIntlContent("SHENYU.COMMON.SURE")}
                  cancelText={getIntlContent("SHENYU.COMMON.CALCEL")}
                >
                  <span
                    className="edit"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    {getIntlContent("SHENYU.COMMON.DELETE.NAME")}
                  </span>
                </Popconfirm>
              </AuthButton>
            </div>
          );
        }
      }
    ];

    return (
      <div className="plug-content-wrap">
        <Row gutter={20}>
          <Col span={8}>
            <div className="table-header">
              <h3>{getIntlContent("SHENYU.PLUGIN.SELECTOR.LIST.TITLE")}</h3>
              <div className={styles.headerSearch}>
                <AuthButton perms="plugin:hystrixSelector:query">
                  <Search
                    className={styles.search}
                    style={{maxWidth:"50%"}}
                    placeholder={getIntlContent("SHENYU.PLUGIN.SEARCH.SELECTOR.NAME")}
                    enterButton={getIntlContent("SHENYU.SYSTEM.SEARCH")}
                    size="default"
                    onChange={this.searchSelectorOnchange}
                    onSearch={this.searchSelector}
                  />
                </AuthButton>
                <AuthButton perms="plugin:hystrixSelector:add">
                  <Button type="primary" onClick={this.addSelector}>
                    {getIntlContent("SHENYU.PLUGIN.SELECTOR.LIST.ADD")}
                  </Button>
                </AuthButton>
              </div>
            </div>
            <Table
              size="small"
              onRow={record => {
                return {
                  onClick: () => {
                    this.rowClick(record);
                  }
                };
              }}
              style={{ marginTop: 30 }}
              bordered
              columns={selectColumns}
              dataSource={selectorList}
              pagination={{
                total: selectorTotal,
                current: selectorPage,
                pageSize: 12,
                onChange: this.pageSelectorChange
              }}
              rowClassName={item => {
                if (currentSelector && currentSelector.id === item.id) {
                  return "table-selected";
                } else {
                  return "";
                }
              }}
            />
          </Col>
          <Col span={16}>
            <div className="table-header">
              <div style={{ display: "flex" }}>
                <h3 style={{ marginRight: 30 }}>{getIntlContent("SHENYU.PLUGIN.SELECTOR.RULE.LIST")}</h3>
                <AuthButton perms="plugin:hystrix:modify">
                  <Button icon="reload" onClick={this.asyncClick} type="primary">
                    {getIntlContent("SHENYU.COMMON.SYN")} hystrix
                  </Button>
                </AuthButton>
              </div>
              <div className={styles.headerSearch}>
                <AuthButton perms="plugin:hystrixRule:query">
                  <Search
                    className={styles.search}
                    placeholder={getIntlContent("SHENYU.PLUGIN.SEARCH.RULE.NAME")}
                    enterButton={getIntlContent("SHENYU.SYSTEM.SEARCH")}
                    size="default"
                    onChange={this.searchRuleOnchange}
                    onSearch={this.searchRule}
                  />
                </AuthButton>
                <AuthButton perms="plugin:hystrixRule:add">
                  <Button type="primary" onClick={this.addRule}>
                    {getIntlContent("SHENYU.COMMON.ADD.RULE")}
                  </Button>
                </AuthButton>
              </div>
            </div>
            <Table
              size="small"
              style={{ marginTop: 30 }}
              bordered
              columns={rulesColumns}
              expandedRowRender={record => <span style={{ wordBreak:'break-all', width:'100%'}}>{record.handle}</span>}
              dataSource={ruleList}
              pagination={{
                total: ruleTotal,
                current: rulePage,
                pageSize: 12,
                onChange: this.pageRuleChange
              }}
            />
          </Col>
        </Row>
        {popup}
      </div>
    );
  }
}
