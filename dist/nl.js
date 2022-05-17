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

// src/nl.ts
var import_cli_table3 = __toESM(require("cli-table3"));
var import_perf_hooks = require("perf_hooks");

// src/config.ts
var import_fs_extra2 = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));

// src/shared/file.ts
var import_fs_extra = __toESM(require("fs-extra"));

// src/shared/util.ts
function once(fn) {
  let called = false;
  return (...args) => {
    if (!called) {
      called = true;
      fn(args);
    }
  };
}

// src/config.ts
var templatesDir = import_path.default.resolve(__dirname, "../templates");
var configPath = import_path.default.resolve(templatesDir, "config.json");
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

// src/nl.ts
async function run() {
  const config = config_default.getConfig();
  var table = new import_cli_table3.default({
    head: ["name", "type", "config"],
    colWidths: [15, 30, 30],
    style: {
      head: ["blue"]
    }
  });
  Object.values(config).forEach((item) => {
    var arr = { [item.name]: [item.type, item.config.join("\n")] };
    table.push(arr);
  });
  console.log(table.toString());
  console.log(`\u2728  Done in ${import_perf_hooks.performance.now()}ms.
`);
}
run().catch(console.error);
