/**
 * 存储数据
 * @param id
 * @param key
 * @param val
 * _seller_:{"id":{key:val}}
 * 例如 {"233":{"favorite":false}
 */
export function saveToLocal(id, key, val) {
  let seller = localStorage._seller_;
  if (!seller) {
    seller = {};
    seller[id] = {};
    seller[id][key] = val;
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  localStorage._seller_ = JSON.stringify(seller);
};

/**
 * 读取存储数据
 * @param id
 * @param key
 * @param def 默认值
 * @return {*}
 * _seller_:{"id":{key:val}}
 * 例如 {"233":{"favorite":false}
 */
export function loadFromLocal(id, key, def) {
  let seller = localStorage._seller_;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
}