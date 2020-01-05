import { h, Component, ComponentChild } from 'preact'
import Store from '../index'

export default function connect<S>(store: Store<S>, component: ComponentChild) {
  return h(
    class C extends Component {
      update = () => {
        this.forceUpdate()
      }

      componentDidMount() {
        store.subscribe(this.update)
      }

      componentWillUnmount() {
        store.unsubscribe(this.update)
      }

      render(): ComponentChild {
        return component
      }
    },
    {}
  )
}
