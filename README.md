# ng

Use the command line to manage templates

```shell
npm i -g @any-u/ng
```

## Usage
### Generate
Generate files based on different boilplate alias

```shell
ng <command> <alias> [name]
```
#### Parameter
| Parameters | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `<command>` | `string` | Command name.<br>This option can accept one of the following aliases:<li>null<li>generate<li>g |
| `<alias>` | `string` | **Required**. Boilerplate alias. |
| `[name]` | `string` | Boilerplate name. |

#### Options
| Options | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `--[args]` | `string` | Boilerplate configuration. |

#### Examples
* folder generate
```yaml
# .ng.yaml
ts-init:
  alias: ts-init
  origin: local
  path: /Users/any-u/Workspace/ng-boilplate/ts-init
  options:
    - label: project name
      value: name
    - label: project description
      value: description
```
```shell
ng vue-init ts-demo --description demo项目
```
App will be used as the name in configuration,  and will also be used as the generated folder name.
> This is to avoid `ng ts-init ts-demo --name ts-demo`

* generate file
```shell
ng vue-init App
```

* Generate file from remote boilplate
```yaml
# .ng.yaml
vue-init:
  alias: vue-init
  origin: remote
  url: https://github.com/any-u/ng-boilerplate/blob/master/vue-init.vue
  token: <GitHub Token>
  options:
    - label: component name
      value: name
```
```shell
ng vue-init App
```
> GitHub Token: A GitHub personal token, get one here: https://github.com/settings/tokens


### Configure
configure boilerplate configuration

```shell
ng config [...args]
```

#### Parameter
| Parameters | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `[...args]` | `string` | Configure keys and values.<br>eg: `vue-init.origin local` |

#### Options
| Options | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `-g`<br>`--global` | `boolean` | Configure global configuration. |
| `-l`<br>`--list` | `boolean` | Show local or global configuration. |
| `-d`<br>`--delete` | `boolean` | Delete local or global configuration. |
| `-i`<br>`--interactive` | `boolean` | Enable interactive input prompts. |

#### Examples
* Configure
```shell
# ng config <json-path> <value>
ng config v1.alias v1
ng config v1.options[0].value name

ng config v1.alias v1 -g
ng config v1.options[0].value name -g

ng config v1.alias v1 v1.origin local
ng config v1.alias v1 v2.alias v2
```

* Delete
```shell
ng config -d v1 v2
ng config -d -g v1 v2
```

* List
```shell
ng config -l
ng config -l -g
```

* Interactive
```shell
ng config -i
ng config -i -g
```



## Configuration

#### Options
| Options | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `alias` | `string` | Boilerplate alias. |
| `dir` | `string`  | Generated relative root directory.  |
| `origin` | `string` | Boilerplate origin.<br>This option can accept one of the following aliases:<li>local<li>remote |
| `path` | `string` | Local boilerplate absolute path. |
| `url` | `string` | Remote url of boilerplate. |
| `token` | `string` | GitHub token of boilerplate. |
| `options` | `string` | Boilplate options. |

#### `Options`  Options
| Options | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `label` | `string` | Option description. |
| `value` | `string` | Alias for boilerplate configuration. |

## Boilplate

Refer to [handlebar](https://handlebarsjs.com/)
