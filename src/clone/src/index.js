import { type } from '../../type/src/index.js'

function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function isClone(x) {
  const t = type(x)
  return t === 'Object' || t === 'Array'
}

export function clone(x) {
  if (!isClone(x)) return x

  const t = type(x)

  let res

  if (t === 'Array') {
    res = []
    for (let i = 0; i < x.length; i += 1) {
      res[i] = x[i] === x ? res : clone(x[i])
    }
  } else if (t === 'Object') {
    res = {}
    for (let key in x) {
      if (hasOwnProp(x, key)) {
        res[key] = x[key] === x ? res : clone(x[key])
      }
    }
  }

  return res
}


export function cloneJSON(x, errOrDef = true) {
  if (!isClone(x)) return x

  try {
    return JSON.parse(JSON.stringify(x))
  } catch (e) {
    if (errOrDef === true) {
      throw e
    } else {
      try {
        console.error('cloneJSON error:', e.message)
      } catch (e) { }
      return errOrDef
    }
  }
}

export function cloneLoop(x) {
  const t = type(x)

  let root = x

  if (t === 'Array') {
    root = []
  } else if (t === 'Object') {
    root = {}
  }

  const loopList = [{
    parent: root,
    key: undefined,
    data: x
  }]

  while (loopList.length) {
    const node = loopList.pop()
    const parent = node.parent
    const key = node.key
    const data = node.data
    const tt = type(data)

    let res = parent
    if (typeof key !== 'undefined') {
      res = parent[key] = tt === 'Array' ? [] : {}
    }

    if (tt === 'Array') {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i] === data) {
          res[i] = res
        } else if (isClone(data[i])) {
          loopList.push({
            parent: res,
            key: i,
            data: data[i]
          })
        } else {
          res[i] = data[i]
        }
      }
    } else if (tt === 'Object') {
      for (let k in data) {
        if (hasOwnProp(data, k)) {
          if (data[k] === data) {
            res[k] = res
          } else if (isClone(data[k])) {
            loopList.push({
              parent: res,
              key: k,
              data: data[k]
            })
          } else {
            res[k] = data[k]
          }
        }
      }
    }
  }

  return root
}

const UNIQUE_KEY = 'com.helx.jsmini.clone' + new Date().getTime()

function SimpleWeakmap() {
  this.cacheArray = []
}

SimpleWeakmap.prototype.set = function (key, value) {
  this.cacheArray.push(key)
  key[UNIQUE_KEY] = value
}
SimpleWeakmap.prototype.get = function (key) {
  return key[UNIQUE_KEY]
}
SimpleWeakmap.prototype.clear = function () {
  for (let i = 0; i < this.cacheArray.length; i += 1) {
    let key = this.cacheArray[i]
    delete key[UNIQUE_KEY]
  }
  this.cacheArray.length = 0
}

function getWeakMap() {
  let result
  if (typeof WeakMap !== 'undefined' && type(WeakMap) === 'function') {
    result = new WeakMap()
    if (type(result) === 'WeakMap') {
      return result
    }
  }
  result = new SimpleWeakmap()
  return result
}

export function cloneForce(x) {
  const uniqueData = getWeakMap()

  const t = type(x)

  let root = x

  if (t === 'Array') {
    root = []
  } else if (t === 'Object') {
    root = {}
  }

  const loopList = [{
    parent: root,
    key: undefined,
    data: x
  }]

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const source = node.data;
    const tt = type(source);

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let target = parent;
    if (typeof key !== 'undefined') {
      target = parent[key] = tt === 'array' ? [] : {};
    }

    // 复杂数据需要缓存操作
    if (isClone(source)) {
      // 命中缓存，直接返回缓存数据
      let uniqueTarget = uniqueData.get(source);
      if (uniqueTarget) {
        parent[key] = uniqueTarget;
        continue; // 中断本次循环
      }

      // 未命中缓存，保存到缓存
      uniqueData.set(source, target);
    }

    if (tt === 'array') {
      for (let i = 0; i < source.length; i++) {
        if (isClone(source[i])) {
          // 下一次循环
          loopList.push({
            parent: target,
            key: i,
            data: source[i],
          });
        } else {
          target[i] = source[i];
        }
      }
    } else if (tt === 'object') {
      for (let k in source) {
        if (hasOwnProp(source, k)) {
          if (k === UNIQUE_KEY) continue;
          if (isClone(source[k])) {
            // 下一次循环
            loopList.push({
              parent: target,
              key: k,
              data: source[k],
            });
          } else {
            target[k] = source[k];
          }
        }
      }
    }
  }

  uniqueData.clear && uniqueData.clear()

  return root
}