import React from 'react';
import { inject, observer } from 'mobx-react';
import CommonStore from '../store/common_store';
import Footer from '../component/footer';
import Header from '../component/header';
import { StringUtil } from '@pefish/js-node-assist';
import { Button } from 'antd';

@inject('commonStore')
@observer
export default class Vip extends React.Component<{
  commonStore?: CommonStore,
  [x: string]: any,
}> {
  render() {
    return (
      <div className="app">
        <Header/>
        <div className="content" style={{
          alignItems: "center",
          height: 500,
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}>
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
          </div>
        </div>
        <Footer/>
      </div>

    );
  }
}
