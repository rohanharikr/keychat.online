import "./app.postcss";
import App from './App.svelte'

const app = new App({
  target: document.getElementsByTagName('body')[0]
})

export default app
