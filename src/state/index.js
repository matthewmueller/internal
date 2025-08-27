const IS_OPTIONAL = Symbol("is_optional");

// https://github.com/b3nten/struct/blob/main/validate.ts
export function Optional(type) {
  return {
    [IS_OPTIONAL]: true,
    type,
  }
}

function getValue(el, key) {
  switch (key) {
    case "text":
      return el.textContent
    case "html":
      return el.innerHTML
    default:
      return el.getAttribute(key)
  }
}

function coerceValue(typedef, value) {
  switch (typedef) {
    case String:
      return value
    case Number:
      return parseInt(value, 10)
    case Boolean:
      return !!value
  }
}

export function extract(el, schema) {
  return extractObject(el, schema)
}

function getDeep(obj, path) {
  var keys = path.split('.');
  var current = obj;
  for (var i = 0; i < keys.length; i++) {
    if (current == null || !current.hasOwnProperty(keys[i])) {
      return undefined;
    }
    current = current[keys[i]];
  }
  return current;
}

function setDeep(obj, path, value) {
  var keys = path.split('.');
  for (var i = 0; i < keys.length - 1; i++) {
    var key = keys[i];
    // If the key doesn't exist or isn't an object, create an empty object
    if (!obj.hasOwnProperty(key) || typeof obj[key] !== 'object') {
      obj[key] = {};
    }
    obj = obj[key];
  }
  // Set the value to the last key
  obj[keys[keys.length - 1]] = value;
}

function extractObject(el, scope, state = {}) {
  for (let attr of el.attributes) {
    if (attr.name.startsWith('bind-')) {
      const key = attr.name.slice('bind-'.length)
      const variable = attr.value
      const value = getValue(el, key)
      const typedef = getDeep(scope, attr.value)
      if (!typedef) continue
      setDeep(state, variable, coerceValue(typedef, value))
    } else if (attr.name.startsWith('for-')) {
      const variable = attr.name.slice('for-'.length)
      const typedef = scope[attr.value]
      if (!Array.isArray(typedef)) {
        throw new Error(`${variable} typedef must be an array to be used within each`)
      }
      const childScope = { ...scope, [variable]: typedef[0] }
      const children = groupByKey(el)
      state[attr.value] = extractArray(children, childScope, variable)
    }
  }

  // Walk children
  let child = el.firstElementChild;
  while (child) {
    state = extractObject(child, scope, state);
    child = child.nextElementSibling;
  }

  return state
}

function groupByKey(container) {
  const groupedTags = [];
  let currentGroup = [];
  const children = container.children;
  const length = children.length;

  for (let i = 0; i < length; i++) {
    const child = children[i];
    const key = child.getAttribute('key');
    if (!key) {
      // Add non-key elements (like button, br) to the current group
      currentGroup.push(child);
      continue
    }
    // Start a new group with the tag
    if (currentGroup.length > 0) {
      groupedTags.push(currentGroup);
    }
    currentGroup = [child]; // Add the tag with key
  }
  // Push the last group if it exists
  if (currentGroup.length > 0) {
    groupedTags.push(currentGroup);
  }
  return groupedTags;
}

function extractArray(fragments, scope, variable) {
  const array = []
  for (let elements of fragments) {
    let object = {}
    for (let element of elements) {
      const inner = extractObject(element, scope)
      object = { ...object, ...(inner[variable] || {}) }
    }
    array.push(object)
  }
  return array
}