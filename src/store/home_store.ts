import { observable } from 'mobx';
import { withGlobalLoading, wrapPromise } from '../util/decorator';
import HttpRequestUtil from "@pefish/js-util-httprequest"
import { ReturnType } from '../util/type';
import ClipboardJS from "clipboard"
import {commonStore} from "./init";

const isWebMediaString = "(min-width: 996px)"
export default class HomeStore {

  @observable
  public counter = 0;

  private isWebMatchMedia = window.matchMedia(isWebMediaString)
  @observable
  public isWeb = this.isWebMatchMedia.matches
  @observable
  public selectedMenu: string = "test1"

  @observable inviteLinkModalVisible: boolean = false
  @observable becomeVipModalVisible: boolean = false
  @observable clickMeCopyText: string = "点我复制"

  constructor () {

    this.setMediaListeners()
    new ClipboardJS('.btn')
    commonStore.initForHomePage()
  }

  public setMediaListeners () {
    this.isWebMatchMedia.addListener(e => {
      this.isWeb = e.matches
    });
  }

  public setSelectedMemu (key: string) {
    this.selectedMenu = key
  }

  public add () {
    this.counter++
  }
}
