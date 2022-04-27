# @anyu/ng

通过命令行生成代码模板

## 案例

如你想开发一个 vue 组件，正常操作你是需要去手动创建 xxx.vue 文件，然后一行一行的输入代码

```vue
<template>
  <div class="root"></div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {},
  },
}
</script>

<style lang="scss" scoped></style>
```

如果通过这个工具, 可以按照下面的步骤

- 首先创建一个模板文件

```vue
<template>
  <div class="root"></div>
</template>

<script>
export default {
  name: "{{name}}",
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {},
  },
}
</script>

<style lang="scss" scoped></style>
```

- 然后将模板文件收录起来，通过在命令行执行以下脚本的方式

```sh
na vue-init ./App.vue -c name
# na [alias] [origin] -c[config] name[配置内容]
```

- 在你想创建组件的文件夹中，执行以下命令，即可快速生成

```sh
ng vue-init ./component/modal.vue -name modal
# ng [alias] [目标路径] -name[配置项] [配置值]
```

> 也许你认为可以通过代码片段(snippets)等方案可以解决问题，但这只是该工具的基础功能，它还支持文件夹方案  
> 如也许某个文件夹下有多个文件，如 index.vue, type.ts, style.scss、index.spec.ts 等文件
> 那它也将支持一键创建这些文件

## na

```
# file template
na /admin/temp/index.js
na ./index.js

# folder template
na /admin/temp

# alias
na -a test /admin/temp/index.js

# config
na -a test /admin/temp/index.js -c name&foo
```

## ng

```
# base
ng test -d ./src

# use name
# will create file use the template name
ng test -d ./src  -u[--useName]

# use config
# will replace the configuration fields in the template
ng test -d ./src -c[--config] name=demo&foo=1
```

## nc

```
# base
nc test
```
