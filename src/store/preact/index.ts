import { h, Component, ComponentChild } from 'preact'
import { Store } from '..'

export default function connect<S>(store: Store<S>, render: () => ComponentChild): ComponentChild {
  class Subscriber extends Component<{}, {}> {
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
      return render()
    }
  }
  return h(Subscriber, {})
}
