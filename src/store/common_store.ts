import { observable } from 'mobx';
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { withGlobalLoading, wrapPromise } from '../util/decorator';
import TimeUtil from '@pefish/js-util-time';
import config from '../config';
import { EthWallet } from "@pefish/js-coin-eth";

const walletConnectConfig = {
  rpc: {
    1: config.rpcUrl
  }
}
export default class CommonStore {

  @observable public globalLoading: boolean = false;
  public globalLoadingCount: number = 0 // 控制全局loading的显示时机
  @observable public user: string = ""
  @observable public userBalance: string = "0"
  @observable public rebateRate: string = "0"
  @observable public vipRebateRate: string = "0"

  private web3Provider?: any
  private web3Instance?: Web3
  private ethWallet: EthWallet = new EthWallet()

  // 用作没连接到钱包之前的访问
  private publicProvider = new Web3.providers.HttpProvider(config.rpcUrl)
  private web3PublicInstance: Web3 = new Web3(this.publicProvider)

  private timerStatus: boolean = false
  @observable public vipInfo?: {
    type_: string,
    registerTime: string,
    enable: boolean
  }
  @observable public isVipValid: boolean = false
  public tools?: {
    name: string, // tool的名字
    addr: string,  // tool的合约地址
    reward: string,  // 收费多少eth
    monthVipReward: string,  // 月费价格的收费价格
    enable: boolean  // 是否启用
  }[] = []

  constructor() {
    TimeUtil.setInterval(async () => {
      if (!this.timerStatus) {
        return
      }
      try {
        await this.loop()
      } catch (err) {
        console.error(err)
      }
    }, 3000)

    // 如果metamask安装了则立马连接
    if (typeof window["ethereum"] !== 'undefined') {
      console.log(`window["ethereum"]`, window["ethereum"])
      this.connectMetamask()
    }
  }

  private async connectMetamask() {
    this.web3Provider = window["ethereum"]
    this.web3Provider.on('accountsChanged', async (accounts) => {
      console.log("metamask 账户变更")
      if (accounts.length === 0) {  // metamask连上的账户全部断开了
        this.afterWalletDisconnectSuccess()
        return
      }
      this.user = accounts[0]
      console.log("获取到用户:", this.user)
      this.web3Instance = new Web3(this.web3Provider as any)
      await this.afterConnectWalletSuccess()
    });
    const accounts = await this.web3Provider.request({ method: 'eth_requestAccounts' });
    this.user = accounts[0]
    console.log("获取到用户:", this.user)
    this.web3Instance = new Web3(this.web3Provider as any)
    await this.afterConnectWalletSuccess()
  }

  private async loop() {
    console.log("循环工作。。。")
  }

  // 钱包登陆后做什么
  @withGlobalLoading()
  async afterConnectWalletSuccess() {
    console.log("钱包连接成功")
    // 开启定时器
    this.timerStatus = true

  }

  // 授权方主动断开后做什么
  afterWalletDisconnectSuccess(walletType: string = "metamask") {
    if (walletType === "wallet_connect") {
      this.web3Provider?.disconnect()  // 断开session
    }
    this.user = ""
    this.timerStatus = false
    console.log(`${walletType} 已断开`)
  }

  @withGlobalLoading()
  @wrapPromise()
  async initForHomePage() {
    console.log("进入主页需要加载")
    // 进入主页需要加载的东西

  }

  @withGlobalLoading()
  @wrapPromise()
  async walletConnect() {
    if (typeof window["ethereum"] !== 'undefined') {
      await this.connectMetamask()
    } else {
      try {
        console.log("准备连接 wallet connect")
        this.web3Provider = new WalletConnectProvider(walletConnectConfig)  // 会立马启动一个ws
        // Subscribe to accounts change
        this.web3Provider.once("accountsChanged", (accounts: string[]) => {
          console.log("accountsChanged", accounts);
        });

        // Subscribe to chainId change
        this.web3Provider.once("chainChanged", (chainId: number) => {
          console.log("chainChanged", chainId);
        });

        // Subscribe to networkId change
        this.web3Provider.once("networkChanged", (networkId: number) => {
          console.log("networkChanged", networkId);
        });

        // Subscribe to session connection/open
        this.web3Provider.once("open", () => {
          console.log("open");
        });

        // Subscribe to session disconnection/close
        this.web3Provider.once("close", (code: number, reason: string) => {
          console.log("close", code, reason)
          if (code === 1000) {  // 用户断开连接
            this.afterWalletDisconnectSuccess("wallet_connect")
          }
        });
        const result: string[] = (await this.web3Provider!.enable()) as string[]
        console.log("wallet connect 连接成功")
        this.user = result[0]
        this.web3Instance = new Web3(this.web3Provider as any)
        console.log("获取到用户:", this.user)
        await this.afterConnectWalletSuccess()
      } catch (err) {  // 用户关掉二维码窗口就会异常
        console.log(err)
      }
    }

  }
}