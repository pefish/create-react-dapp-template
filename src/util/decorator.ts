import { ReturnType } from "./type";
import {
  Modal
} from 'antd';
// 使方法调用期间显示全局loading
export function withGlobalLoading() {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        this.commonStore.globalLoading = true
        return await fun.apply(this, args)
      } finally {
        this.commonStore.globalLoading = false
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
        return await new Promise((resolve, reject) => {
          Modal.error({
            content: err.message,
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
