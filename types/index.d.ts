interface Window {
  __P: {
    [key: string]: () => {
      default: React.FunctionComponent<any>
    }
  }
}
