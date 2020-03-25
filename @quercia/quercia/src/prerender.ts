// usePrerender returns wether the rendering is happening
// on the client-side or in a nodejs enviroment for website prerendering
export const usePrerender = () => {
  return typeof window === 'undefined'
}