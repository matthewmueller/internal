import assert from '../assert'
import domify from '../domify'
import { extract } from '.'

describe('state', () => {
  let root
  beforeEach(() => {
    root = document.getElementById('root')
    if (root) root.parentNode.removeChild(root)
    root = domify(`<div id="root"></div>`)
    document.body.appendChild(root)
  })

  afterEach(function () {
    if (this.currentTest.state === 'passed') {
      root.innerHTML = ''
    }
  })

  function append(html) {
    const el = domify(html)
    root.appendChild(el)
    return el
  }

  describe('extract(el, schema)', () => {
    it('should handle { author: string, comment: string }', () => {
      const el = append(`
        <div component="comment" class="comment">
          <input type="text" name="author" bind-value="author" value="Matt" />
          <textarea name="comment" bind-text="comment">Some comment</textarea>
          <input type="submit" name="Post" />
        </div>
      `)
      const state = extract(el, {
        author: String,
        comment: String
      })
      assert(state.author, "Matt")
      assert(state.comment, "Some comment")
    })

    it('should handle { name: { first: string, last: string } }', () => {
      const el = append(`
        <div component="comment" class="comment">
          <input type="text" name="author" bind-value="name.first" value="Matt" />
          <input type="text" name="author" bind-value="name.last" value="Mueller" />
          <input type="submit" name="Post" />
        </div>
      `)
      const state = extract(el, {
        name: {
          first: String,
          last: String
        },
      })
      assert.deepEqual(state.name, { first: "Matt", last: "Mueller" })
    })

    it('should handle { tags: Array<{ name: string, class: string }> }', () => {
      const el = append(`
        <div component="tags" for-tag="tags">
          <div class="tag one" key="1" bind-text="tag.name" bind-class="tag.class">Soccer</div>
          <button>X</button>
          <div class="tag two" key="2" bind-text="tag.name" bind-class="tag.class">Football</div>
          <button>X</button>
        </div>
      `)
      const state = extract(el, {
        tags: [{ name: String, class: String }],
      })
      assert.deepEqual(state.tags, [
        { name: 'Soccer', class: "tag one" },
        { name: 'Football', class: "tag two" },
      ])
    })
  })
})