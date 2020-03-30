declare var __DEV__: boolean

interface Window {
  __P: {
    [key: string]: () => {
      default: React.FunctionComponent<any>
    }
  }
}
