var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/ng.ts
var import_chalk = __toESM(require("chalk"));
var import_fs_extra4 = __toESM(require("fs-extra"));
var import_minimist = __toESM(require("minimist"));
var path4 = __toESM(require("path"));
var import_perf_hooks = require("perf_hooks");

// src/config.ts
var import_fs_extra2 = __toESM(require("fs-extra"));
var import_path2 = __toESM(require("path"));

// src/shared/file.ts
var import_fs_extra = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
function isFile(path5) {
  return import_fs_extra.default.existsSync(path5) && import_fs_extra.default.statSync(path5).isFile();
}
function getFiles(src) {
  if (isFile(src))
    return [];
  const files = import_fs_extra.default.readdirSync(src);
  return files.map((file) => import_path.default.join(src, file));
}

// src/shared/util.ts
function once(fn) {
  let called = false;
  return (...args2) => {
    if (!called) {
      called = true;
      fn(args2);
    }
  };
}

// src/config.ts
var templatesDir = import_path2.default.resolve(__dirname, "../templates");
var configPath = import_path2.default.resolve(templatesDir, "config.json");
var ensureConfig = once(async () => {
  return await import_fs_extra2.default.ensureFileSync(configPath);
});
var writeConfig = (config) => {
  return import_fs_extra2.default.writeFileSync(configPath, JSON.stringify(config));
};
function getConfig() {
  const content = import_fs_extra2.default.readFileSync(configPath);
  const config = content.toString();
  return config ? JSON.parse(config) : {};
}
async function setConfig(alias, config) {
  await ensureConfig();
  const origin = getConfig();
  origin[alias] = config;
  return writeConfig(origin);
}
async function deleteConfig(alias) {
  await ensureConfig();
  const origin = getConfig();
  delete origin[alias];
  return writeConfig(origin);
}
var config_default = {
  getConfig,
  setConfig,
  deleteConfig
};

// src/template.ts
var import_fs_extra3 = __toESM(require("fs-extra"));
var import_path3 = __toESM(require("path"));
var import_handlebars = __toESM(require("handlebars"));
var templatesDir2 = import_path3.default.resolve(__dirname, "../templates");
async function generate(src, config) {
  const rawContent = import_fs_extra3.default.readFileSync(src, "utf-8");
  const template = import_handlebars.default.compile(rawContent);
  return template(config);
}
async function writeTemplate(src, dest, config) {
  const content = await generate(src, config);
  await import_fs_extra3.default.ensureFileSync(dest);
  await import_fs_extra3.default.writeFile(dest, content);
}

// src/ng.ts
var args = (0, import_minimist.default)(process.argv.slice(2));
var scripts = args._;
var getConfiguration = () => {
  let res = {};
  for (let key in args) {
    if (key !== "_") {
      res[key] = args[key];
    }
  }
  return res;
};
async function run() {
  if (!scripts.length) {
    console.log(import_chalk.default.red(`[Ng] Failed to find <Template>, have you initialized it?'`));
    return;
  }
  if (scripts.length === 1) {
    console.log(import_chalk.default.red(`[Ng] Generate requires exactly two args, but got one`));
    return;
  }
  if (scripts.length > 2) {
    console.log(import_chalk.default.yellow("[Ng] You provide more than two arguments. The first will be used as the name of the template, the second will be used as the path of the template, and the rest will be ignored."));
  }
  const [alias, dest] = scripts;
  const allConfig = config_default.getConfig();
  if (!allConfig[alias]) {
    console.log(import_chalk.default.red(`[Ng] You provided a wrong template <${alias}>, please check your alias`));
    return;
  }
  const config = allConfig[alias];
  if (!import_fs_extra4.default.existsSync(config.path)) {
    console.log(import_chalk.default.red(`[Ng] Failed to find <Template>, have you add it?`));
    return;
  }
  const realPath = path4.isAbsolute(dest) ? dest : path4.resolve(process.cwd(), dest);
  if (import_fs_extra4.default.existsSync(realPath)) {
    console.log(import_chalk.default.yellow(`[Ng] You provided an existing path <${realPath}>, please try a new path`));
    return;
  }
  const userConfig = getConfiguration();
  const required = config.config.some((item) => item in userConfig);
  if (!required) {
    console.log(import_chalk.default.yellow(`[Ng] <${config.name}> requires ${config.config.length} configurations, but got ${Object.keys(userConfig)}`));
    return;
  }
  if (config.type === "file") {
    await writeTemplate(config.path, realPath, userConfig);
  } else {
    const files = getFiles(config.path);
    const response = await Promise.allSettled(files.map((item) => {
      const basename2 = path4.basename(item);
      return writeTemplate(item, `${realPath}/${basename2}`, userConfig);
    }));
    for (let res of response) {
      if (res.status === "rejected") {
        console.log(import_chalk.default.yellow(`[Ng] Failed to write <Template>, Please try agin`));
        res.reason && console.log(import_chalk.default.red(`${res.reason}
`));
      }
    }
  }
  console.log(`\u2728  Done in ${import_perf_hooks.performance.now()}ms.
`);
}
run();
