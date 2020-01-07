import { h, Component, ComponentChild } from 'preact'
import { Proxy } from '..'

export default function connect<S>(proxy: Proxy<S>, render: () => ComponentChild): ComponentChild {
  class Subscriber extends Component<{}, {}> {
    update = () => {
      this.forceUpdate()
    }
    componentDidMount() {
      proxy.subscribe(this.update)
    }
    componentWillUnmount() {
      proxy.unsubscribe(this.update)
    }
    render(): ComponentChild {
      return render()
    }
  }
  return h(Subscriber, {})
}
