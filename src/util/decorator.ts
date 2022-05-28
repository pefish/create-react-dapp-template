import { ReturnType } from "./type";
import {
  Modal
} from 'antd';
import {commonStore} from "../store/init";

// 使方法调用期间显示全局loading
export function withGlobalLoading() {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        commonStore.globalLoading = true
        return await fun.apply(this, args)
      } finally {
        commonStore.globalLoading = false
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
      } catch (err: any) {
        return [null, err]
      }
    }

    return descriptor
  }
}

// 使方法不抛出异常，而是返回[any, Error]，而且有错误的话会弹出错误提示框
export function wrapPromiseWithErrorTip() {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args): Promise<ReturnType> {
      try {
        return [await fun.apply(this, args), null]
      } catch (err: any) {
        await new Promise((resolve, reject) => {
          Modal.error({
            content: err.message,
            onOk: () => {
              resolve([null, err])
            }
          })
        })
        return [null, err]
      }
    }

    return descriptor
  }
}

// 如果接口抛出未登录的异常，则登出
export function withLogout(funcName) {
  return (target, name, descriptor) => {
    let fun = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        return await fun.apply(this, args)
      } catch (err: any) {
        console.log(err.message)
        if (err.message === "Unauthorized") {
          await this[funcName]()
        }
        throw err
      }
    }

    return descriptor
  }
}
