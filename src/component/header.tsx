import React from 'react';
import {
  Link,
} from "react-router-dom"
import {
  Button, Modal, Input
} from 'antd';
import HomeStore from '../store/home_store';
import CommonStore from '../store/common_store';
import { inject, observer } from 'mobx-react';
import { StringUtil } from '@pefish/js-node-assist';

@inject('homeStore', 'commonStore')
@observer
export default class Header extends React.Component<{
  homeStore?: HomeStore,
  commonStore?: CommonStore,
  [x: string]: any,
}, any> {

  render() {
    return (
      <div className="suspension" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link to={"/home"}>
          <div className="click-div">
            <span>币工具</span>
          </div>
        </Link>
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
                await this.props.commonStore?.walletConnect()
              }
          }>{
                this.props.commonStore!.user
                  ?
                  (
                    this.props.homeStore!.isWeb
                      ?
                      this.props.commonStore!.user
                      :
                      `${this.props.commonStore!.user.substr(0, 3)}...${this.props.commonStore!.user.substring(this.props.commonStore!.user.length - 3)}`
                  )
                  :
                  "连接钱包"
              }</span></div>
          {
            (this.props.commonStore!.user)
              ?
              <div style={{
                marginRight: 10
              }}><span>{StringUtil.remainDecimal_(this.props.commonStore!.userBalance, 4)} ETH</span></div>
              :
              null
          }
          <div className="click-div" style={{
            marginRight: 10
          }} onClick={() => {
            this.props.homeStore!.inviteLinkModalVisible = true
          }}><span>邀请返佣</span></div>
          {
            this.props.commonStore!.user && this.props.commonStore!.vipInfo && this.props.commonStore!.isVipValid
              ?
              <div><span style={{
                color: "red"
              }}>{this.props.commonStore!.vipInfo!.type_ === "1" ? "上帝" : "普通会员"}</span></div>
              :
              <div className="click-div"><span style={{
                color: "red"
              }} onClick={() => {
                this.props.homeStore!.becomeVipModalVisible = true
              }}>成为会员</span></div>
          }
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
          }}>{
              this.props.commonStore!.user
                ?
                `${this.props.commonStore!.isVipValid ? this.props.commonStore!.vipRebateRate : this.props.commonStore!.rebateRate}%`
                :
                "连接钱包后查看"
            }</span></p>

          <p>邀请链接：</p>
          <div style={{
            display: "flex",
            flexDirection: "row"
          }}>
            <Input readOnly id="invite-link" defaultValue={
              this.props.commonStore!.user ? `${window.location.origin}?invitor=${this.props.commonStore!.user}` : "连接钱包后查看"
            } />
            <Button className="btn" style={{
              marginLeft: 4
            }} type="primary" data-clipboard-target="#invite-link" onClick={() => {
              this.props.homeStore!.clickMeCopyText = "✓"
            }}>{this.props.homeStore!.clickMeCopyText}</Button>
          </div>
        </Modal>
        <Modal
          title="成为会员"
          visible={this.props.homeStore!.becomeVipModalVisible}
          footer={null}
          onCancel={() => {
            this.props.homeStore!.becomeVipModalVisible = false
          }}
        >
          <p>本站会员为月费会员，单月 {this.props.commonStore!.tools!.length > 0 ? StringUtil.unShiftedBy_(this.props.commonStore!.tools![0].reward, 18) : 0} ETH，每次只能购买一个月。</p>
          <p>会员的好处：</p>
          <p style={{
            color: "black",
            fontWeight: 900,
          }}>1. 使用付费工具只需支付更少的费用。</p>
          <p style={{
            color: "black",
            fontWeight: 900,
          }}>2. 更高的返佣比例。</p>
          <Button type="primary" onClick={async () => {
            this.props.commonStore!.becomeVip()
          }}>成为会员</Button>
        </Modal>
      </div>

    )
  }
}
