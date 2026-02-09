declare module 'vue/dist/vue.esm-bundler' {
  export * from 'vue';
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
