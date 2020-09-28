import { observable } from 'mobx';
import Web3, { Modules } from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { withGlobalLoading, wrapPromise } from '../util/decorator';
import TimeUtil from '@pefish/js-util-time';
import { StringUtil } from '@pefish/js-node-assist';
import config from '../config';
import { Contract } from "web3-eth-contract"
import Util from '../util/util';

const walletConnectConfig = {
  infuraId: "aaa3fc062661462784b334a1a5c51940",
}
export default class CommonStore {
  
  @observable public globalLoading: boolean = false;
  @observable public user: string = ""
  @observable public userBalance: string = "0"
  @observable public rebateRate: string = "0"  // 佣金比例。10%，这里就是10
  
  private walletConnectProvider: WalletConnectProvider = new WalletConnectProvider(walletConnectConfig)
  private web3Instance: Web3 = new Web3(new Web3.providers.HttpProvider(config.rpcUrl))
  private coinToolsContractInstance: Contract = null as any
  private invitorAddress: string = Util.getQueryVariable("invitor")
  private timerStatus: boolean = false
  
  constructor () {
    console.log("invitorAddress", this.invitorAddress)
    this.walletConnectProvider.enable().then((result: any) => {
      this.user = result[0]
      this.afterConnectWalletSuccess()
    }).catch((err) => {
      this.walletConnectProvider = new WalletConnectProvider(walletConnectConfig)
    })
    TimeUtil.setInterval(async () => {
      if (!this.timerStatus) {
        return
      }
      try {
        // 取余额
        this.userBalance = StringUtil.unShiftedBy_((await this.web3Instance.eth.getBalance(this.user)).toString(), 18)
      } catch(err) {
        console.error(err)
      }
    }, 2000)
  }

  // 钱包登陆后做什么
  async afterConnectWalletSuccess () {
    // 开启定时器
    this.timerStatus = true
    // 初始化合约实例
    this.coinToolsContractInstance = new this.web3Instance.eth.Contract(config.coinToolContractAbi, config.coinToolContractAddress);
    // 查询佣金比例
    const rebateRate_ = await this.coinToolsContractInstance.methods.nomarlRebateRate().call({
      from: this.user,
    })
    this.rebateRate = StringUtil.div_(rebateRate_.toString(), 100)
  }

  @withGlobalLoading()
  @wrapPromise()
  async connectWalletConnect () {
    try {
      // Subscribe to accounts change
      this.walletConnectProvider.once("accountsChanged", (accounts: string[]) => {
        console.log("accountsChanged", accounts);
      });

      // Subscribe to chainId change
      this.walletConnectProvider.once("chainChanged", (chainId: number) => {
        console.log("chainChanged", chainId);
      });

      // Subscribe to networkId change
      this.walletConnectProvider.once("networkChanged", (networkId: number) => {
        console.log("networkChanged", networkId);
      });

      // Subscribe to session connection/open
      this.walletConnectProvider.once("open", () => {
        console.log("open");
      });

      // Subscribe to session disconnection/close
      this.walletConnectProvider.once("close", (code: number, reason: string) => {
        if (code === 1000) {  // 用户断开连接
          this.user = ""
          this.afterConnectWalletSuccess()
        }
      });
      console.log("准备连接wallet connect")
      const result: string[] = (await this.walletConnectProvider.enable()) as string[]
      console.log("wallet connect连接成功")
      this.user = result[0]
      this.afterConnectWalletSuccess()
    } catch (err) {  // 用户关掉二维码窗口就会异常
      console.log(err)
      this.walletConnectProvider = new WalletConnectProvider(walletConnectConfig)
    }
  }
}