
export default class Util {
  static getQueryVariable(variable: string): string {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return ""
  }

  static async timeoutWrapperCall (func: () => Promise<any>): Promise<any> {
    return await Promise.race([
      func(),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("timeout"))
        }, 7000)
      })
    ])
  }
}
