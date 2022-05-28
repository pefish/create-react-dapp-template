
export default class PersistenceStore {
  private persistenceData: {[x: string]: any} = {}

  constructor() {
    // 加载持久化数据
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key !== null) {
        this.persistenceData[key] = localStorage.getItem(key)
      }
    }
    // console.log("persistenceData", this.persistenceData)
  }

  set (key: string, data: string) {
    localStorage.setItem(key, data)
    this.persistenceData[key] = data
  }

  remove (key: string) {
    localStorage.removeItem(key)
    delete this.persistenceData[key]
  }

  get (key: string): string {
    return this.persistenceData[key] || ""
  }
}
