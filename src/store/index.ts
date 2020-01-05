type State = {
  [key: string]: any
}

export default class Store<S extends State> {
  private readonly subscribers: Array<() => void>
  private data: S

  constructor(initial: S) {
    this.subscribers = []
    this.data = initial
  }

  set(state: Partial<S> | ((state: Readonly<S>) => Partial<S>)) {
    let s = typeof state === 'function' ? state(this.state) : state
    this.data = { ...this.data, ...s }
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i]()
    }
  }

  get state(): Readonly<S> {
    return this.data
  }

  get<K extends keyof S>(key: K): S[K] {
    return this.data[key]
  }

  subscribe(fn: () => void) {
    this.subscribers.push(fn)
  }

  unsubscribe(fn: () => void) {
    const i = this.subscribers.indexOf(fn)
    if (~i) this.subscribers.splice(i, 1)
  }
}

// export function New<S extends State>(initial: S): Store<S> {
//   return new Store(initial)
// }

// export class Store<S extends State> {
//   private readonly subscribers: Array<() => void>
//   private data: S

//   constructor(initial: S) {
//     this.subscribers = []
//     this.data = initial
//   }

//   setState(state: Partial<S>) {
//     this.data = Object.assign(this.data, state)
//     for (let i = 0; i < this.subscribers.length; i++) {
//       this.subscribers[i]()
//     }
//   }

//   get state(): Readonly<S> {
//     return this.data
//   }

//   subscribe(fn: () => void) {
//     this.subscribers.push(fn)
//   }

//   unsubscribe(fn: () => void) {
//     const i = this.subscribers.indexOf(fn)
//     if (~i) this.subscribers.splice(i, 1)
//   }
// }

// export function connect<S>(store: Store<S>, component: ComponentChild) {
//   return h(
//     class C extends Component {
//       update = () => {
//         this.forceUpdate()
//       }

//       componentDidMount() {
//         store.subscribe(this.update)
//       }

//       componentWillUnmount() {
//         store.unsubscribe(this.update)
//       }

//       render(): ComponentChild {
//         return component
//       }
//     },
//     {}
//   )
// }

// type RecordState = {
//   windows: {
//     id: number
//     url: string
//     active: boolean
//   }[]
//   frames: {
//     id: number
//   }[]
// }

// class Record extends Store<RecordState> {
//   constructor(initial: RecordState) {
//     super(initial)
//   }

//   addWindow(window: RecordState['windows'][0]) {
//     this.setState({
//       windows: this.state.windows.concat(window),
//     })
//   }
// }

// const record = new Record({
//   frames: [],
//   windows: [
//     {
//       id: 1,
//       active: true,
//       url: 'ok',
//     },
//   ],
// })

// record.subscribe(() => {
//   console.log(record.state.windows)
// })

// record.addWindow({
//   id: 10,
//   active: false,
//   url: 'cooll',
// })
