if (!Array.prototype.findByKey) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.findByKey = function <T> (keyProperty: string, key: any): T {
    return this.filter(e => e[keyProperty] === key)[0]
  }
}

export interface IDictionary<TValue> {
  [id: string]: TValue;

}
