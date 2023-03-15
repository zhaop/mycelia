import isEqual from 'lodash/isEqual'

/*
struct Node {
  string key;
  int height;
  Node left;
  Node right;
}
*/

// Module-private class containing static methods to manipulate trees
class Tree {

  // Add a node for `key` to tree under `root` if it doesn't already exist
  // Return [newRoot, added]:
  // - newRoot: the new root of the tree (`root` if the root did not change)
  // - added: true if the tree changed, false otherwise
  static add(root, key) {
    let [path, dir] = Tree.pathTo(root, key)
    let parent = (path.length >= 1) ? path[path.length - 1] : null

    const node = Tree.create(key)

    let newRoot = root
    if (!parent) {
      newRoot = node
      return [newRoot, true]
    } else if (dir === 0) {
      return [newRoot, false]
    }

    const [LEFT, RIGHT] = [1, 2]

    // Add to bottom of tree
    let heightChanged = false
    switch (dir) {
      case LEFT:
        parent.left = node
        if (!parent.right)
          heightChanged = true;
        break
      case RIGHT:
        parent.right = node
        if (!parent.left)
          heightChanged = true;
        break
    }

    // Go back up the tree; update heights, balance if necessary
    if (heightChanged) {
      for (let depth = path.length - 1; depth >= 0; --depth) {
        const current = path[depth]
        const parent = (depth >= 1) ? path[depth - 1] : null
        current.height = Tree.calculateHeight(current)

        const newSubtree = Tree.balance(current)
        if (parent === null) {
          newRoot = newSubtree
        } else {
          if (parent.left == current)
            parent.left = newSubtree;
          else if (parent.right == current)
            parent.right = newSubtree;
        }
      }
    }

    return [newRoot, true]
  }

  // Modifies the tree at `root` so it has balance factor in {-1, 0, 1}
  // `root` must have balance factor in {-2, -1, 0, 1, 2}
  // Does nothing if already balanced
  // Return the new root of the tree (`root` if unchanged)
  static balance(root) {
    const balance = Tree.balanceFactor(root)
    let newRoot = root

    if (balance == -2) {
      // Left is too heavy
      if (Tree.balanceFactor(root.left) == 1)
        root.left = Tree.rotateLeft(root.left);

      newRoot = Tree.rotateRight(root)

    } else if (balance == 2) {
      // Right is too heavy
      if (Tree.balanceFactor(root.right) == -1)
        root.right = Tree.rotateRight(root.right);

      newRoot = Tree.rotateLeft(root)
    }

    return newRoot
  }

  // Balance factor of a node
  // Negative: left-heavy; positive: right-heavy
  static balanceFactor(node) {
    return node ? Tree.height(node.right) - Tree.height(node.left) : 0
  }

  // Assuming children's heights are correct, calculate the height of `node`
  static calculateHeight(node) {
    return 1 + Math.max(Tree.height(node.left), Tree.height(node.right))
  }

  // Return the root of a tree containing keys from both `left` & `right`,
  // where the keys in `left` are strictly smaller than those in `right`
  // May mutate `left` & `right`
  static concat(left, right) {
    if (left === null && right === null)
      return null;
    else if (left === null)
      return right;
    else if (right === null)
      return left;

    const leftHeight = Tree.height(left)
    const rightHeight = Tree.height(right)

    if (leftHeight < rightHeight) {
      right.left = Tree.concat(left, right.left)
      return Tree.balance(right)
    } else if (leftHeight > rightHeight) {
      left.right = Tree.concat(left.right, right)
      return Tree.balance(left)
    } else {  // leftHeight == rightHeight
      const rightMin = Tree.min(right)

      const node = Tree.create(rightMin)
      node.left = left
      node.right = Tree.delete(right, rightMin)[0] // Slightly inefficient: path to rightMin being calculated twice
      node.height = Tree.calculateHeight(node)
      return node
    }
  }

  // Return the root of a AVL-balanced tree containing the trees `left` & `right` and a node containing `key`
  // `key` must be strictly larger than any key in `left`, & smaller than any key in `right`
  // May mutate `left` & `right`
  static concat3(key, left, right) {
    if (left === null && right === null)
      return Tree.create(key);
    else if (left === null)
      return Tree.add(right, key)[0];
    else if (right === null)
      return Tree.add(left, key)[0];

    const leftHeight = Tree.height(left)
    const rightHeight = Tree.height(right)

    if (leftHeight < rightHeight) {
      // Mix left into right.left
      right.left = Tree.concat3(key, left, right.left)
      right.height = Tree.calculateHeight(right)
      return Tree.balance(right)

    } else if (leftHeight > rightHeight) {
      // Mix right into left.right
      left.right = Tree.concat3(key, left.right, right)
      left.height = Tree.calculateHeight(left)
      return Tree.balance(left)

    } else {  // leftHeight == rightHeight
      // Attach left & key & right together
      const node = Tree.create(key)
      node.left = left
      node.right = right
      node.height = Tree.calculateHeight(node)
      return node
    }
  }

  // Create a new tree & return the node at its root
  static create(key) {
    return {key: key, height: 1, left: null, right: null}
  }

  // Delete the node for `key` from the tree under `root` if it exists
  // Return [newRoot, deleted]:
  // - newRoot: the new root of the tree (`root` if the root did not change)
  // - deleted: true if the tree changed, false otherwise
  static delete(root, key) {
    let [path, dir] = Tree.pathTo(root, key)
    let node = path.length ? path[path.length - 1] : null

    let newRoot = root

    if (!node || dir !== 0)
      return [newRoot, false];

    // Two children: replace with a max left-subnode / min right-subnode;
    // then later, pretend we were deleting the subnode all along
    // (which cannot have two children)
    if (node.left && node.right) {
      const newPath = (node.left.height <= node.right.height) ? Tree.pathToMax(node.left) : Tree.pathToMin(node.right)
      const subnode = newPath[newPath.length - 1]
      node.key = subnode.key
      node = subnode

      // Append newPath to path
      path.push(...newPath)
    }

    const parent  = (path.length >= 2) ? path[path.length - 2] : null
    const isLeft  = (parent && node == parent.left)
    const isRight = (parent && node == parent.right)

    // One child: connect child with parent
    if (node.left || node.right) {
      const child = node.left || node.right
      if (parent) {
        if (isLeft)
          parent.left = child;
        else if (isRight)
          parent.right = child;
      } else {
        newRoot = child
      }

    // Leaf: detach from parent
    } else {
      if (parent) {
        if (isLeft)
          parent.left = null;
        else if (isRight)
          parent.right = null;
      } else {
        newRoot = null
      }
    }

    // Leave only the parent of the deleted node at the end of `path`
    path.pop()

    // Backtrack & balance, starting from parent of deleted node
    for (let depth = path.length - 1; depth >= 0; --depth) {
      const current = path[depth]
      const parent = (depth >= 1) ? path[depth - 1] : null
      current.height = Tree.calculateHeight(current)

      const newCurrent = Tree.balance(current)
      if (parent === null) {
        newRoot = newCurrent
      } else {
        if (parent.left == current)
          parent.left = newCurrent;
        else if (parent.right == current)
          parent.right = newCurrent;
      }
    }

    return [newRoot, true]
  }

  // UNTESTED
  // Delete entire left subtree of `root`
  // May mutate `root`
  // Return newRoot
  static deleteLeft(root) {
    if (root === null)
      return null;

    if (root.right === null) {
      root.left = null
      return root
    }

    const newRoot = root.right
    Tree.add(newRoot, root.key)
    return newRoot
  }

  // UNTESTED
  // Delete entire right subtree of `root`
  // Mutates `root`
  // Return newRoot
  static deleteRight(root) {
    if (root === null)
      return null;

    if (root.left === null) {
      root.right = null
      return root
    }

    const newRoot = root.left
    Tree.add(newRoot, root.key)
    return newRoot
  }

  // Return the root of a tree that contains all keys from `root1` except those also in `root2`
  // May mutate `root1` & `root2`
  static difference(root1, root2) {
    if (root1 === null)
      return null;
    if (root2 === null)
      return root1;

    const {key, left, right} = root2

    const [tmpLeft, tmpRight] = Tree.split(root1, key)
    return Tree.concat(Tree.difference(tmpLeft, left), Tree.difference(tmpRight, right))
  }

  // Return [node, direction] where `key` fits / would fit in `root`,
  // if this were a normal binary search root
  // [null, 0]: at the root (iff `root` is empty)
  // [node, 0]: at `node` (iff `key` exists under `root`)
  // [node, 1|2]: as a child of `node`, to its {1: left, 2: right}
  static find(root, key) {
    if (!root)
      return [null, 0];

    const [LEFT, RIGHT] = [1, 2]

    let curr = root
    while (true) {
      if (key < curr.key) {
        if (curr.left)
          curr = curr.left;
        else
          return [curr, LEFT];

      } else if (key > curr.key) {
        if (curr.right)
          curr = curr.right;
        else
          return [curr, RIGHT];

      } else {  // key == curr.key
        return [curr, 0]
      }
    }
  }

  // Return the root of a new tree containing every key in `keys`
  static fromArray(keys) {
    let root = null
    for (const key of keys) {
      root = Tree.add(root, key)[0]
    }
    return root
  }

  // A tree with a single node has height 1; not-a-node has height 0
  static height(node) {
    return node ? node.height : 0
  }

  // Returns an iterator over the keys under `root`, in sorted order
  static *keys(root) {
    if (root === null)
      return;

    yield* Tree.keys(root.left)
    yield root.key
    yield* Tree.keys(root.right)
  }

  // Return largest key under `root`
  static max(root) {
    let node = root
    while (node.right)
      node = node.right;
    return node.key
  }

  // Return smallest key under `root`
  static min(root) {
    let node = root
    while (node.left)
      node = node.left;
    return node.key
  }

  // Return [[...node], direction] where `key` fits / would fit in the tree under
  // `root` if this were a normal binary search tree
  // [[], 0]:   at `root` (iff `root` is empty)
  // [path, 0]: at `path[-1]` (iff `key` exists in tree)
  // [path, 1|2]: as {1: left, 2: right} child of `path[-1]`
  static pathTo(root, key) {
    if (!root)
      return [[], 0];

    const [LEFT, RIGHT] = [1, 2]

    const path = [root]
    while (true) {
      const curr = path[path.length - 1]
      if (key < curr.key) {
        if (curr.left)
          path.push(curr.left);
        else
          return [path, LEFT];

      } else if (key > curr.key) {
        if (curr.right)
          path.push(curr.right);
        else
          return [path, RIGHT];

      } else {  // key == curr.key
        return [path, 0]
      }
    }
  }

  // Return Array of nodes, beginning with `root`, ending at node with maximum key under `root`
  static pathToMax(root) {
    const path = [root]
    while (path[path.length - 1].right)
      path.push(path[path.length - 1].right);
    return path
  }

  // Return Array of nodes, beginning with `root`, ending at node with minimum key under `root`
  static pathToMin(root) {
    const path = [root]
    while (path[path.length - 1].left)
      path.push(path[path.length - 1].left);
    return path
  }

  static print(node) {
    console.log(Tree.toString(node))
  }

  // Rotate `root` leftwards
  // Return the root of the resulting root
  static rotateLeft(root) {
    if (!root.right)
      return;

    const newRoot = root.right

    root.right = newRoot.left
    root.height = Tree.calculateHeight(root)

    newRoot.left = root
    newRoot.height = Tree.calculateHeight(newRoot)

    return newRoot
  }

  // Rotate `root` rightwards
  // Return the root of the resulting root
  static rotateRight(root) {
    if (!root.left)
      return;

    const newRoot = root.left

    root.left = newRoot.right
    root.height = Tree.calculateHeight(root)

    newRoot.right = root
    newRoot.height = Tree.calculateHeight(newRoot)

    return newRoot
  }

  // Split tree at `root` into 2 balanced trees, `splitLeft` / `splitRight`,
  // whose keys are strictly smaller / larger than `splitKey`
  // Return [splitLeft, splitRight]
  // May mutate `root`
  static split(root, splitKey) {
    if (root === null)
      return [null, null];

    const {key, left, right} = root

    if (splitKey < key) {
      // `splitKey` is on left side, so split `left` & merge into right side
      const [tmpLeft, tmpRight] = Tree.split(left, splitKey)
      return [tmpLeft, Tree.concat3(key, tmpRight, right)]

    } else if (splitKey > key) {
      // `splitKey` is on right side, so split `right` & merge into left side
      const [tmpLeft, tmpRight] = Tree.split(right, splitKey)
      return [Tree.concat3(key, left, tmpLeft), tmpRight]

    } else {  // splitKey == key
      return [left, right]
    }
  }

  // Converts to simple objects; omits .left & .right if null
  static toObject(root) {
    if (root === null)
      return null;

    const obj = {
      key: root.key,
      height: root.height,
    }

    if (root.left)
      obj.left = Tree.toObject(root.left);

    if (root.right)
      obj.right = Tree.toObject(root.right);

    return obj
  }

  // root: root of tree to print
  // isLeft: whether `root` is the left child of its parent
  // isRight: whether `root` is the right child of its parent
  // spacing: number of characters between each level of the printed tree
  // prefix: prepend each line with this
  static toString(root, isLeft = false, isRight = false, spacing = 1, prefix='') {
    if (root === null)
      return '';

    const space = ' '.repeat(spacing)
    const line  = '─'.repeat(spacing)

    const leftPrefix  = (isRight ? '│' : ' ') + space
    const rootPrefix  = (isLeft  ? '╭' : (isRight ? '╰' : '┠')) + line
    const rightPrefix = (isLeft  ? '│' : ' ') + space

    return (
        Tree.toString(root.left, true, false, spacing, prefix + leftPrefix)
      + `${prefix + rootPrefix}${root.key}  (${root.height}|${Tree.balanceFactor(root)})\n`
      + Tree.toString(root.right, false, true, spacing, prefix + rightPrefix)
    )
  }

  // Return the root of a tree containing the union of the keys in `root1` and `root2`
  // May mutate `root1` & `root2`
  static union(root1, root2) {
    if (root1 === null && root2 === null)
      return null;
    else if (root1 === null)
      return root2;
    else if (root2 === null)
      return root1;

    const [left2, right2] = Tree.split(root2, root1.key)
    return Tree.concat3(root1.key, Tree.union(left2, root1.left), Tree.union(right2, root1.right))
  }

  // Return whether the tree under `root` is a valid AVL tree with correct heights
  // Debug tool. Calls console.warn on error.
  // O(n) time, O(log n) space
  static verify(root, min = -Infinity, max = Infinity, depth = 0) {
    // An empty tree is a valid AVL tree
    if (root === null)
      return true;

    const {key, height, left, right} = root

    if (height != Tree.calculateHeight(root)) {
      console.warn(`node ${key} height is ${height} but should be ${Tree.calculateHeight(root)}`)
      return false
    }

    if (!left && !right && height != 1) {
      console.warn(`node ${key} is a leaf node but has height ${height} (should be 1)`)
      return false
    }

    if (key < min) {
      console.warn(`node ${key} is smaller than an ancestor node ${min} on its left side`)
      return false
    }

    if (key > max) {
      console.warn(`node ${key} is larger than an ancestor node ${max} on its right side`)
      return false
    }

    const bf = Tree.balanceFactor(root)
    if (bf <= -2 || bf >= 2) {
      console.warn(`node ${key} has balance factor ${bf}`)
      return false
    }

    return Tree.verify(left, min, key, depth + 1) && Tree.verify(right, key, max, depth + 1)
  }

}

/*
An ordered version of Set, implemented as an AVL tree.

References:
- Visualization
  https://www.cs.usfca.edu/~galles/visualization/AVLtree.html
- Add, delete, rotate algorithms
  https://www.cs.cornell.edu/courses/cs312/2008sp/lectures/lec_avl.html
- Union, difference, intersect algorithms
  http://groups.csail.mit.edu/mac/users/adams/BB/92-10.ps

Complexity figures given below are "desired", but not rigorously verified.

Methods:
- add(key): if `key` did not exist, insert `key` & return true; otherwise return false
  O(log(n)) time
- addMany(keys): add an Array of `keys`
  O(m + n) time?
- clear(): delete everything
  O(1) time?
- delete(key): if `key` exists, delete `key` & return true; otherwise return false
  O(log(n)) time?
- has(key): return whether `key` exists
  O(log(n)) time
- keys(): return iterator on all keys
  O(n log(n)) time, O(log(n)) space
- max(): return largest key stored
  O(log(n)) time, O(1) space
- min(): return smallest key stored
  O(log(n)) time, O(1) space
- range(begin, end): return iterator on keys, going in order through all keys in [begin, end] inclusive
  O(m log(n)) amortized time, O(log(n) + m log(n)) worst time (m is size of output)
- size(): return number of elements
  O(n) time!
- split(key): return [left, right], both OrderedSets, `left` entirely smaller than `key`, `right` greater
  (`this` is modified and only keeps the `left` side. `key` itself is absent from either.)
  O(log(n)) time?
- subtract(orderedSet): modify this set so it does not contain anything in `orderedSet`, return this; mutates `orderedSet`
  O(?) time?
- union(orderedSet): modify this set to also contain every element in `orderedSet`, return this; mutates `orderedSet`
  O(m + n) time?
*/
export class OrderedSet {
  constructor(init) {
    this.root = null

    if (init)
      this.addMany(init);
  }

  add(key) {
    const [newRoot, added] = Tree.add(this.root, key)
    this.root = newRoot
    return added
  }

  addMany(keys) {
    const toAdd = new OrderedSet()
    toAdd.root = Tree.fromArray(keys)
    return this.union(toAdd)
  }

  clear() {
    this.root = null
    return this
  }

  delete(key) {
    const [newRoot, deleted] = Tree.delete(this.root, key)
    this.root = newRoot
    return deleted
  }

  has(key) {
    const [node, dir] = Tree.find(this.root, key)
    return node && (dir === 0)
  }

  *keys() {
    yield* Tree.keys(this.root)
  }

  max() {
    return Tree.max(this.root)
  }

  min() {
    return Tree.min(this.root)
  }

  print(spacing = 1) {
    console.log(this.toString(spacing))
  }

  // Return iterator over keys under `root` that are between [begin, end] (inclusive)
  *range(begin, end, root = this.root) {
    if (root === null)
      return;

    const key = root.key

    if (begin < key)  // interval extends to left of node at `root`
      yield* this.range(begin, end, root.left);

    if (begin <= key && key <= end)
      yield key;

    if (key < end)  // interval extends to right of node at `root`
      yield* this.range(begin, end, root.right);
  }

  size() {
    let count = 0
    for (const key of this.keys())
      count++;
    return count
  }

  split(key) {
    const [l, r] = Tree.split(this.root, key)

    this.root = l

    const right = new OrderedSet()
    right.root = r

    return [this, right]
  }

  subtract(orderedSet) {
    this.root = Tree.difference(this.root, orderedSet.root)
    return this
  }

  // Converts to simple objects; omits .left & .right if null
  toObject() {
    return Tree.toObject(this.root)
  }

  toString(spacing = 1) {
    return Tree.toString(this.root, false, false, spacing)
  }

  union(orderedSet) {
    this.root = Tree.union(this.root, orderedSet.root)
    return this
  }

  static test() {
    window.OrderedSet = OrderedSet
    window.Tree = Tree

    const t0 = performance.now()

    function run(name, code, result) {
      const actual = code()
      console.assert(isEqual(actual, result), `${name}:\n${JSON.stringify(actual)}\nshould be\n${JSON.stringify(result)}`)
    }

    {
      const oset = new OrderedSet([2, 9, 0, 3])
      run('toObject', () => oset.toObject(), {
        key: 2, height: 3,
        left: {key: 0, height: 1},
        right: {
          key: 9, height: 2,
          left: {key: 3, height: 1},
        }
      })

      const obj = oset.toObject()

      const find = (key) => {
        const result = Tree.find(oset.root, key)
        return [Tree.toObject(result[0]), result[1]]
      }
      run('find1', () => find(-1), [obj.left, 1])
      run('find2', () => find(0), [obj.left, 0])
      run('find3', () => find(1), [obj.left, 2])
      run('find4', () => find(2), [obj, 0])
      run('find5', () => find(2.5), [obj.right.left, 1])
      run('find6', () => find(3), [obj.right.left, 0])
      run('find7', () => find(4), [obj.right.left, 2])
      run('find8', () => find(9), [obj.right, 0])
      run('find9', () => find(10), [obj.right, 2])

      const pathTo = (key)  => {
        const result = Tree.pathTo(oset.root, key)
        return [result[0].map(node => node.key), result[1]]
      }
      run('pathTo1', () => pathTo(-1), [[2, 0], 1])
      run('pathTo2', () => pathTo(0), [[2, 0], 0])
      run('pathTo3', () => pathTo(1), [[2, 0], 2])
      run('pathTo4', () => pathTo(2), [[2], 0])
      run('pathTo5', () => pathTo(2.5), [[2, 9, 3], 1])
      run('pathTo6', () => pathTo(3), [[2, 9, 3], 0])
      run('pathTo7', () => pathTo(4), [[2, 9, 3], 2])
      run('pathTo8', () => pathTo(9), [[2, 9], 0])
      run('pathTo9', () => pathTo(10), [[2, 9], 2])

      run('clear-a', () => oset.clear(), oset)
      run('clear-b', () => oset.toObject(), null)
      run('find0', () => find(42), [null, 0])
      run('pathTo0', () => pathTo(42), [[], 0])
    }

    {
      const oset = new OrderedSet()
      run('add1-0', () => oset.toObject(), null)
      run('add1-1a', () => oset.add(8), true)
      run('add1-1b', () => oset.toObject(), {key: 8, height: 1})
      run('add1-2a', () => oset.add(4), true)
      run('add1-2b', () => oset.toObject(), {
        key: 8, height: 2,
        left: {key: 4, height: 1},
      })
      run('add1-3a', () => oset.add(12), true)
      run('add1-3b', () => oset.toObject(), {
        key: 8, height: 2,
        left: {key: 4, height: 1},
        right: {key: 12, height: 1},
      })
      run('add1-4a', () => oset.add(16), true)
      run('add1-4b', () => oset.toObject(), {
        key: 8, height: 3,
        left: {key: 4, height: 1},
        right: {
          key: 12, height: 2,
          right: {key: 16, height: 1},
        },
      })
      run('add1-5', () => oset.add(16), false)

      run('keys1', () => Array.from(oset.keys()), [4, 8, 12, 16])

      run('delete1-0', () => oset.delete(14), false)
      run('delete1-1a', () => oset.delete(16), true)
      run('delete1-1b', () => oset.toObject(), {
        key: 8, height: 2,
        left: {key: 4, height: 1},
        right: {key: 12, height: 1},
      })
      run('delete1-2a', () => oset.delete(8), true)
      run('delete1-2b', () => oset.toObject(), {
        key: 4, height: 2,
        right: {key: 12, height: 1},
      })
    }

    {
      let oset = new OrderedSet([42])
      run('delete0-1a', () => oset.delete(42), true)
      run('delete0-1b', () => oset.toObject(), null)

      oset = new OrderedSet([2, 3])
      run('delete0-2a', () => oset.delete(3), true)
      run('delete0-2b', () => oset.toObject(), {key: 2, height: 1})

      oset = new OrderedSet([2, 3])
      run('delete0-3a', () => oset.toObject(), {key: 2, height: 2, right: {key: 3, height: 1}})
      run('delete0-3b', () => oset.delete(2), true)
      run('delete0-3c', () => oset.toObject(), {key: 3, height: 1})

      oset = new OrderedSet([3, 2, 4, 5])
      run('delete0-4a', () => [oset.root.key, oset.root.height], [3, 3])
      run('delete0-4b', () => oset.delete(4), true)
      run('delete0-4c', () => oset.toObject(), {
        key: 3, height: 2,
        left: {key: 2, height: 1},
        right: {key: 5, height: 1},
      })
    }

    {
      // add: Rotate left
      const oset = new OrderedSet([1, 2])
      run('add-rotl-0', () => oset.toObject(), {key: 1, height: 2, right: {key: 2, height: 1}})
      run('add-rotl-a', () => oset.add(3), true)
      run('add-rotl-b', () => oset.toObject(), {
        key: 2, height: 2,
        left: {key: 1, height: 1},
        right: {key: 3, height: 1},
      })
    }

    {
      // add: Rotate child right, then rotate left
      const oset = new OrderedSet([1, 3])
      run('add-rotrl-0', () => oset.toObject(), {key: 1, height: 2, right: {key: 3, height: 1}})
      run('add-rotrl-a', () => oset.add(2), true)
      run('add-rotrl-b', () => oset.toObject(), {
        key: 2, height: 2,
        left: {key: 1, height: 1},
        right: {key: 3, height: 1},
      })
    }

    {
      // add: Rotate right
      const oset = new OrderedSet([3, 2])
      run('add-rotr-0', () => oset.toObject(), {key: 3, height: 2, left: {key: 2, height: 1}})
      run('add-rotr-a', () => oset.add(1), true)
      run('add-rotr-b', () => oset.toObject(), {
        key: 2, height: 2,
        left: {key: 1, height: 1},
        right: {key: 3, height: 1},
      })
    }

    {
      // add: Rotate child left, then rotate right
      const oset = new OrderedSet([3, 1])
      run('add-rotlr-0', () => oset.toObject(), {key: 3, height: 2, left: {key: 1, height: 1}})
      run('add-rotlr-a', () => oset.add(2), true)
      run('add-rotlr-b', () => oset.toObject(), {
        key: 2, height: 2,
        left: {key: 1, height: 1},
        right: {key: 3, height: 1},
      })
    }

    {
      // delete: Rotate left
      const oset = new OrderedSet([3, 1, 5, 2, 4, 6, 7])
      run('delete-rotl-0', () => oset.toObject(), {
        key: 3, height: 4,
        left: {
          key: 1, height: 2,
          right: {key: 2, height: 1},
        },
        right: {
          key: 5, height: 3,
          left: {key: 4, height: 1},
          right: {
            key: 6, height: 2,
            right: {key: 7, height: 1},
          },
        },
      })
      run('delete-rotl-a', () => oset.delete(2), true)
      run('delete-rotl-b', () => oset.toObject(), {
        key: 5, height: 3,
        left: {
          key: 3, height: 2,
          left: {key: 1, height: 1},
          right: {key: 4, height: 1},
        },
        right: {
          key: 6, height: 2,
          right: {key: 7, height: 1},
        },
      })
    }

    {
      // delete: Rotate right
      const oset = new OrderedSet([5, 3, 7, 2, 4, 6, 1])
      run('delete-rotr-0', () => oset.toObject(), {
        key: 5, height: 4,
        left: {
          key: 3, height: 3,
          left: {
            key: 2, height: 2,
            left: {key: 1, height: 1},
          },
          right: {key: 4, height: 1},
        },
        right: {
          key: 7, height: 2,
          left: {key: 6, height: 1},
        },
      })
      run('delete-rotr-a', () => oset.delete(7), true)
      run('delete-rotr-b', () => oset.toObject(), {
        key: 3, height: 3,
        left: {
          key: 2, height: 2,
          left: {key: 1, height: 1},
        },
        right: {
          key: 5, height: 2,
          left: {key: 4, height: 1},
          right: {key: 6, height: 1},
        },
      })
    }

    {
      // delete: Rotate child left, then rotate right
      const oset = new OrderedSet([6, 2, 7, 1, 4, 8, 3, 5])
      run('delete-rotlr-0', () => oset.toObject(), {
        key: 6, height: 4,
        left: {
          key: 2, height: 3,
          left: {key: 1, height: 1},
          right: {
            key: 4, height: 2,
            left: {key: 3, height: 1},
            right: {key: 5, height: 1},
          },
        },
        right: {
          key: 7, height: 2,
          right: {key: 8, height: 1},
        }
      })
      run('delete-rotlr-a', () => oset.delete(8), true)
      run('delete-rotlr-b', () => oset.toObject(), {
        key: 4, height: 3,
        left: {
          key: 2, height: 2,
          left: {key: 1, height: 1},
          right: {key: 3, height: 1},
        },
        right: {
          key: 6, height: 2,
          left: {key: 5, height: 1},
          right: {key: 7, height: 1},
        },
      })
    }

    {
      // delete: Rotate child right, then rotate left
      const oset = new OrderedSet([3, 2, 6, 1, 5, 7, 4])
      run('delete-rotrl-0', () => oset.toObject(), {
        key: 3, height: 4,
        left: {
          key: 2, height: 2,
          left: {key: 1, height: 1},
        },
        right: {
          key: 6, height: 3,
          left: {
            key: 5, height: 2,
            left: {key: 4, height: 1},
          },
          right: {key: 7, height: 1},
        }
      })
      run('delete-rotrl-a', () => oset.delete(2), true)
      run('delete-rotrl-b', () => oset.toObject(), {
        key: 5, height: 3,
        left: {
          key: 3, height: 2,
          left: {key: 1, height: 1},
          right: {key: 4, height: 1},
        },
        right: {
          key: 6, height: 2,
          right: {key: 7, height: 1},
        }
      })
    }

    {
      const oset = new OrderedSet()

      run('addMany0a', () => oset.addMany([42.1]), oset)
      run('addMany0b', () => Array.from(oset.keys()), [42.1])
    }

    {
      const oset = new OrderedSet([10, 8, 12, 6, 14, 4, 16, 2, 18])

      run('addMany1a', () => oset.addMany([9, 11, 7, 13, 5, 15, 3, 17, 1, 19]), oset)
      run('addMany1b', () => Array.from(oset.keys()), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])

      run('size0', () => (new OrderedSet()).size(), 0)
      run('size1', () => oset.size(), 19)

      run('keys2', () => Array.from(oset.keys()), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])

      run('max', () => oset.max(), 19)
      run('min', () => oset.min(), 1)

      const range = (begin, end) => Array.from(oset.range(begin, end))
      run('range0', () => range(8, 8), [8])
      run('range1', () => range(1, 3), [1, 2, 3])
      run('range2', () => range(3, 9), [3, 4, 5, 6, 7, 8, 9])
      run('range3', () => range(10, 13), [10, 11, 12, 13])
      run('range4', () => range(9, 17), [9, 10, 11, 12, 13, 14, 15, 16, 17])
      run('range5', () => range(4, 2), [])

      run('verify', () => Tree.verify(oset.root), true)
    }

    {
      // concat3 & split
      // Simplify test notation: write trees as Arrays of keys from level-order traversal
      const testCS = (name, k, l, r, together) => {
        run(
          `concat3-${name}`,
          () => Tree.toObject(Tree.concat3(k, (new OrderedSet(l)).root, (new OrderedSet(r)).root)),
          (new OrderedSet(together)).toObject()
        )

        const splitted = Tree.split((new OrderedSet(together)).root, k)
        run(`split-verifyl-${name}`, () => Tree.verify(splitted[0]), true)
        run(`split-verifyr-${name}`, () => Tree.verify(splitted[1]), true)

        const recombined = Tree.concat3(k, ...splitted)
        run(
          `split-concat3-${name}`,
          () => Array.from(Tree.keys(recombined)),
          Array.from((new OrderedSet(together)).keys()),
        )

        run(`split-concat3-verify-${name}`, () => Tree.verify(recombined), true)
      }

      testCS('0', 10, null, null, [10])
      testCS('1', 10, [0], null, [0, 10])
      testCS('2', 10, null, [20], [20, 10])
      testCS('3', 10, [0], [20], [10, 0, 20])
      testCS('4a', 10, [2, 1], [20, 21], [10, 2, 20, 1, 21])
      testCS('4b', 10, [2, 1], [22, 20, 23, 21], [10, 2, 22, 1, 20, 23, 21])
      testCS('4c', 10, [2, 1], [24, 22, 25, 20, 23, 26, 21], [24, 10, 25, 2, 22, 26, 1, 20, 23, 21])
      testCS('5a', 10, [6, 7], [20, 21], [10, 6, 20, 7, 21])
      testCS('5b', 10, [5, 3, 6, 2, 4, 7, 1], [20, 21], [5, 3, 10, 2, 4, 6, 20, 1, 7, 21])
    }

    {
      // split on inexistent value
      run(
        'split-6',
        () => (new OrderedSet([1, 2, 4, 5])).split(3).map(oset => Array.from(oset.keys())),
        [[1, 2], [4, 5]]
      )
    }

    {
      // union
      const testUnion = (name, a, b, together) => {
        const union = (new OrderedSet(a)).union(new OrderedSet(b))
        run(`union-${name}`, () => Array.from(union.keys()), together)
        run(`union-verify-${name}`, () => Tree.verify(union.root), true)
      }

      testUnion('0', [], [], [])
      testUnion('1', [1, 3, 5, 7], [], [1, 3, 5, 7])
      testUnion('2', [], [2, 4, 6], [2, 4, 6])
      testUnion('3', [50, 10, 20, 40, 30], [5, 25, 35, 15, 45, 55], [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
    }

    {
      // concat
      const testConcat = (name, a, b, together) => {
        const combined = Tree.concat((new OrderedSet(a)).root, (new OrderedSet(b)).root)
        run(`concat-${name}`, () => Array.from(Tree.keys(combined)), together)
        run(`concat-verify-${name}`, () => Tree.verify(combined), true)
      }

      testConcat('0', [], [], [])
      testConcat('1', [1, 3, 5, 7], [], [1, 3, 5, 7])
      testConcat('2', [], [2, 4, 6], [2, 4, 6])
      testConcat('3', [1, 2, 3, 4], [10, 9, 8, 5], [1, 2, 3, 4, 5, 8, 9, 10])
    }

    {
      // subtraction
      const testSubtraction = (name, a, b, together) => {
        const difference = (new OrderedSet(a)).subtract(new OrderedSet(b))
        run(`difference-${name}`, () => Array.from(difference.keys()), together)
        run(`difference-${name}`, () => Tree.verify(difference.root), true)
      }

      testSubtraction('0', [], [], [])
      testSubtraction('1', [2, 3, 4], [], [2, 3, 4])
      testSubtraction('2', [], [8, 7, 9], [])
      testSubtraction('3', [5, 3, 8, 2, 9, 1, 7, 4], [2, 3, 4], [1, 5, 7, 8, 9])
    }

    console.log(`OrderedSet: tests completed in ${performance.now() - t0} ms`)
  }
}
