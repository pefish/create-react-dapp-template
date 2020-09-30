import { ReturnType } from "./type";
import {
  Modal
} from 'antd';
import CommonStore from "../store/common_store";
// 使方法调用期间显示全局loading
export function withGlobalLoading() {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args) {
      const commonStore: CommonStore = this instanceof CommonStore ? this : this.commonStore
      try {
        if (commonStore.globalLoadingCount === 0) {
          commonStore.globalLoading = true
        }
        commonStore.globalLoadingCount++
        
        return await fun.apply(this, args)
      } finally {
        if (commonStore.globalLoadingCount === 1) {
          commonStore.globalLoading = false
        }
        commonStore.globalLoadingCount--
      }
    }

    return descriptor
  }
}

// 使方法不抛出异常，而是返回[any, Error]
export function wrapPromise() {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args): Promise<ReturnType> {
      try {
        return [await fun.apply(this, args), null]
      } catch (err) {
        console.error(err)
        return await new Promise((resolve, reject) => {
          Modal.error({
            content: `params: ${JSON.stringify(args)} -> ` + err.message,
            onOk: () => {
              resolve([null, err])
            }
          })
        })
      }
    }

    return descriptor
  }
}
