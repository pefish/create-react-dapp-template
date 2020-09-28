import { observable } from 'mobx';
export default class CommonStore {
  
  @observable public globalLoading: boolean = false;
  
}