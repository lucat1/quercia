import { loader } from 'webpack'

const pageHotLoader: loader.Loader = function (content) {
  return `${content.toString()}

  ;;if (module.hot) {
    module.hot.accept()
  }`
}

export default pageHotLoader
