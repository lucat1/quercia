declare global {
  interface Window {
    __P: { 
      [key: string]: () => {
        default: React.FunctionComponent<any>
      } 
    }
  }
}

export { App } from './app'
export { Context as RouterContext } from './router'
export { Link } from './link'
export { navigate } from './navigate'