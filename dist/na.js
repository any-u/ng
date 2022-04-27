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

// src/na.ts
var import_chalk = __toESM(require("chalk"));
var import_fs_extra3 = __toESM(require("fs-extra"));
var import_minimist = __toESM(require("minimist"));
var path2 = __toESM(require("path"));
var import_perf_hooks = require("perf_hooks");

// src/config.ts
var import_fs_extra2 = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));

// src/shared/file.ts
var import_fs_extra = __toESM(require("fs-extra"));
function isFile(path3) {
  return import_fs_extra.default.existsSync(path3) && import_fs_extra.default.statSync(path3).isFile();
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
var templatesDir = import_path.default.resolve(__dirname, "../templates");
var configPath = import_path.default.resolve(templatesDir, "config.json");
var ensureConfig = once(async () => {
  return await import_fs_extra2.default.ensureFileSync(configPath);
});
var writeConfig = (config2) => {
  return import_fs_extra2.default.writeFileSync(configPath, JSON.stringify(config2));
};
function getConfig() {
  const content = import_fs_extra2.default.readFileSync(configPath);
  const config2 = content.toString();
  return config2 ? JSON.parse(config2) : {};
}
async function setConfig(alias, config2) {
  await ensureConfig();
  const origin = getConfig();
  origin[alias] = config2;
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

// src/na.ts
var args = (0, import_minimist.default)(process.argv.slice(2));
var scripts = args._;
var config = args.config || args.c;
var templatesDir2 = path2.resolve(__dirname, "../templates");
var resolve2 = (p) => path2.resolve(templatesDir2, p);
async function run() {
  let alias = "", origin = "";
  if (!scripts.length) {
    console.log(import_chalk.default.red(`[Ng] Failed to find <Template>, have you initialized it?'`));
    return;
  }
  if (scripts.length > 2) {
    console.log(import_chalk.default.yellow("[Ng] You provide more than two arguments. The first will be used as the name of the template, the second will be used as the path of the template, and the rest will be ignored."));
  }
  if (scripts.length === 1) {
    const script = scripts[0];
    origin = script;
    alias = path2.basename(script, path2.extname(script));
  }
  ;
  [alias, origin] = scripts;
  const destPath = resolve2(alias);
  if (import_fs_extra3.default.existsSync(destPath)) {
    console.log(import_chalk.default.red(`[Ng] You provided an existing alias <${alias}>, please try a new alias`));
    return;
  }
  const realPath = path2.isAbsolute(origin) ? origin : path2.resolve(process.cwd(), origin);
  const basename2 = path2.basename(realPath);
  if (!import_fs_extra3.default.existsSync(realPath)) {
    console.log(import_chalk.default.red(`[Ng] You provided a wrong path <${realPath}>, please check your path`));
    return;
  }
  const type = isFile(realPath) ? "file" : "folder";
  const dest = type === "file" ? `${destPath}/${basename2}` : destPath;
  await import_fs_extra3.default.copy(realPath, dest);
  const res = {
    name: alias,
    path: dest,
    type,
    config: config.split("&")
  };
  await config_default.setConfig(alias, res);
  console.log(`\u2728  Done in ${import_perf_hooks.performance.now()}ms.`);
}
run().catch((err) => console.error(err));
