import React from 'react';
import { inject, observer } from 'mobx-react';
import './home.css'
import {
  Image, Layout, Menu, Button, Modal, Input
} from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import HomeStore from '../store/home_store';
import CommonStore from '../store/common_store';
import ClipboardJS from "clipboard"

const { Sider } = Layout;


@inject('homeStore', 'commonStore')
@observer
export default class Home extends React.Component<{
  homeStore?: HomeStore,
  commonStore?: CommonStore,
  [x: string]: any,
}, any> {

  componentDidMount() {
    this.props.homeStore!.setMediaListeners()
    new ClipboardJS('.btn')
  }

  selectMenuContent() {
    if (this.props.homeStore!.selectedMenu === "test1") {
      return (
        <div className="menu-content">
          <div>
            <Button type={`primary`} onClick={async () => {
              await this.props.homeStore!.requestBaidu()
            }}>请求百度</Button>
          </div>
          <div style={{
            display: `flex`,
            flexDirection: `column`,
            marginTop: 100
          }}>
            <span>
              {this.props.homeStore!.counter}
            </span>
            <Button type={`primary`} onClick={() => {
              this.props.homeStore!.add()
            }}>加计数</Button>
          </div>
        </div>
      )
    } else if (this.props.homeStore!.selectedMenu === "test2") {
      return (
        <div className="menu-content">test2</div>
      )
    } else {
      return (
        <div className="menu-content">nothing</div>
      )
    }

  }

  render() {
    return (
      <div className="app">
        <div className="suspension" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div className="click-div" onClick={() => {
            window.location.href = "./"
          }}>
            <span>币工具</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
          }}>
            <div className="click-div" style={{
              marginRight: 10
            }}><span onClick={
              this.props.commonStore!.user
                ?
                () => {
                  window.open(`https://etherscan.io/address/${this.props.commonStore!.user}`, "_blank")
                }
                :
                async () => {
                  await this.props.commonStore?.connectWalletConnect()
                }
            }>{(this.props.homeStore!.isWeb ? this.props.commonStore!.user : `${this.props.commonStore!.user.substr(0, 3)}...${this.props.commonStore!.user.substring(this.props.commonStore!.user.length - 3)}`) || "连接钱包"}</span></div>
            {
              (this.props.commonStore!.user)
                ?
                <div style={{
                  marginRight: 10
                }}><span>{this.props.commonStore!.userBalance} ETH</span></div>
                :
                null
            }
            <div className="click-div" style={{
              marginRight: 10
            }} onClick={() => {
              this.props.homeStore!.inviteLinkModalVisible = true
            }}><span>邀请返佣</span></div>
            <div className="click-div" onClick={() => {
              Modal.error({
                content: "暂未实现"
              })
            }}><span style={{
              color: "red"
            }}>成为会员</span></div>
          </div>
          <Modal
            title="邀请返佣"
            visible={this.props.homeStore!.inviteLinkModalVisible}
            footer={null}
            onCancel={() => {
              this.props.homeStore!.inviteLinkModalVisible = false
              this.props.homeStore!.clickMeCopyText = "点我复制"
            }}
          >
            <p>邀请返佣是指他人通过您的邀请链接使用本站任何收费项目，您将可以得到一定比例的返佣。成为会员后，你的返佣比例会得到大幅度提高。</p>
            <p>例如：A用户使用您的邀请链接使用某付费项目花费了10ETH，如果您的返佣比例是10%，您将立马得到1ETH。</p>
            <p>返佣比例：<span style={{
              color: "red",
              fontWeight: 900
            }}>{this.props.commonStore!.rebateRate}%</span></p>

            <p>邀请链接：</p>
            <div style={{
              display: "flex",
              flexDirection: "row"
            }}>
              <Input readOnly id="invite-link" defaultValue={`${window.location.origin}?invitor=${this.props.commonStore!.user}`} />
              <Button className="btn" style={{
                marginLeft: 4
              }} type="primary" data-clipboard-target="#invite-link" onClick={() => {
                this.props.homeStore!.clickMeCopyText = "✓"
              }}>{this.props.homeStore!.clickMeCopyText}</Button>
            </div>
          </Modal>
        </div>
        <div className="content">
          <div className="left-space" style={{
            flex: this.props.homeStore!.isWeb ? 1 : 0
          }}></div>
          <div className="real-content">
            <div style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}>
              <div className="content-header" style={{
                display: this.props.homeStore!.isWeb ? "flex" : "none"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center"
                }}>
                  <Image
                    width={46}
                    src="./logo.png"
                  />
                  <span style={{
                    color: "#009a61",
                    marginLeft: 10,
                    fontSize: 28
                  }}>币工具</span>
                </div>
              </div>
              <Layout className="all-menu-content">
                <Sider
                  breakpoint="lg"
                  collapsedWidth="0"
                  onBreakpoint={broken => {
                    console.log(broken);
                  }}
                  onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                  }}
                  theme="light"
                  style={{
                    backgroundColor: "#333",
                    color: "white",
                  }}
                >
                  <div className="logo" />
                  <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.homeStore!.selectedMenu]} style={{
                    backgroundColor: "#333"
                  }} onSelect={(e) => {
                    this.props.homeStore!.setSelectedMemu(e.key as string)
                  }}>
                    <Menu.Item key="test1" icon={<ToolOutlined />}>
                      代币一键生成
                    </Menu.Item>
                  </Menu>
                </Sider>
                {this.selectMenuContent()}
              </Layout>
            </div>
          </div>
          <div className="right-space" style={{
            flex: this.props.homeStore!.isWeb ? 1 : 0
          }}></div>
        </div>
        <div className="footer">Copyright © 2020-2030 Created by PEFISH</div>
      </div>
    );
  }
}
