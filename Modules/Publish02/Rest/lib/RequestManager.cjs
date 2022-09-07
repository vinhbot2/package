'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const node_buffer = require('node:buffer');
const node_events = require('node:events');
const collection = require('../../Collection/collection.cjs');
const snowflake = require('../../../Package/sapphire/snowflake/index');
const undici = require('undici');
const SequentialHandler = require('./Handlers/SequentialHandler.cjs');
const constants = require('./Utils/constants.cjs');
const utils = require('./Utils/utils.cjs');

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _token;
const getFileType = () => {
  let cached;
  return cached ?? (cached = import('file-type'));
};
var RequestMethod = /* @__PURE__ */ ((RequestMethod2) => {
  RequestMethod2["Delete"] = "DELETE";
  RequestMethod2["Get"] = "GET";
  RequestMethod2["Patch"] = "PATCH";
  RequestMethod2["Post"] = "POST";
  RequestMethod2["Put"] = "PUT";
  return RequestMethod2;
})(RequestMethod || {});
const _RequestManager = class extends node_events.EventEmitter {
  constructor(options) {
    super();
    this.agent = null;
    this.globalDelay = null;
    this.globalReset = -1;
    this.hashes = new collection.Collection();
    this.handlers = new collection.Collection();
    __privateAdd(this, _token, null);
    this.options = { ...constants.DefaultRestOptions, ...options };
    this.options.offset = Math.max(0, this.options.offset);
    this.globalRemaining = this.options.globalRequestsPerSecond;
    this.agent = options.agent ?? null;
    this.setupSweepers();
  }
  setupSweepers() {
    const validateMaxInterval = (interval) => {
      if (interval > 144e5) {
        throw new Error("Cannot set an interval greater than 4 hours");
      }
    };
    if (this.options.hashSweepInterval !== 0 && this.options.hashSweepInterval !== Infinity) {
      validateMaxInterval(this.options.hashSweepInterval);
      this.hashTimer = setInterval(() => {
        const sweptHashes = new collection.Collection();
        const currentDate = Date.now();
        this.hashes.sweep((v, k) => {
          if (v.lastAccess === -1)
            return false;
          const shouldSweep = Math.floor(currentDate - v.lastAccess) > this.options.hashLifetime;
          if (shouldSweep) {
            sweptHashes.set(k, v);
          }
          this.emit(constants.RESTEvents.Debug, `Hash ${v.value} for ${k} swept due to lifetime being exceeded`);
          return shouldSweep;
        });
        this.emit(constants.RESTEvents.HashSweep, sweptHashes);
      }, this.options.hashSweepInterval).unref();
    }
    if (this.options.handlerSweepInterval !== 0 && this.options.handlerSweepInterval !== Infinity) {
      validateMaxInterval(this.options.handlerSweepInterval);
      this.handlerTimer = setInterval(() => {
        const sweptHandlers = new collection.Collection();
        this.handlers.sweep((v, k) => {
          const { inactive } = v;
          if (inactive) {
            sweptHandlers.set(k, v);
          }
          this.emit(constants.RESTEvents.Debug, `Handler ${v.id} for ${k} swept due to being inactive`);
          return inactive;
        });
        this.emit(constants.RESTEvents.HandlerSweep, sweptHandlers);
      }, this.options.handlerSweepInterval).unref();
    }
  }
  setAgent(agent) {
    this.agent = agent;
    return this;
  }
  setToken(token) {
    __privateSet(this, _token, token);
    return this;
  }
  async queueRequest(request) {
    const routeId = _RequestManager.generateRouteData(request.fullRoute, request.method);
    const hash = this.hashes.get(`${request.method}:${routeId.bucketRoute}`) ?? {
      value: `Global(${request.method}:${routeId.bucketRoute})`,
      lastAccess: -1
    };
    const handler = this.handlers.get(`${hash.value}:${routeId.majorParameter}`) ?? this.createHandler(hash.value, routeId.majorParameter);
    const { url, fetchOptions } = await this.resolveRequest(request);
    return handler.queueRequest(routeId, url, fetchOptions, {
      body: request.body,
      files: request.files,
      auth: request.auth !== false
    });
  }
  createHandler(hash, majorParameter) {
    const queue = new SequentialHandler.SequentialHandler(this, hash, majorParameter);
    this.handlers.set(queue.id, queue);
    return queue;
  }
  async resolveRequest(request) {
    const { options } = this;
    let query = "";
    if (request.query) {
      const resolvedQuery = request.query.toString();
      if (resolvedQuery !== "") {
        query = `?${resolvedQuery}`;
      }
    }
    const headers = {
      ...this.options.headers,
      "User-Agent": `${constants.DefaultUserAgent} ${options.userAgentAppendix}`.trim()
    };
    if (request.auth !== false) {
      if (!__privateGet(this, _token)) {
        throw new Error("Expected token to be set for this request, but none was present");
      }
      headers.Authorization = `${request.authPrefix ?? this.options.authPrefix} ${__privateGet(this, _token)}`;
    }
    if (request.reason?.length) {
      headers["X-Audit-Log-Reason"] = encodeURIComponent(request.reason);
    }
    const url = `${options.api}${request.versioned === false ? "" : `/v${options.version}`}${request.fullRoute}${query}`;
    let finalBody;
    let additionalHeaders = {};
    if (request.files?.length) {
      const formData = new undici.FormData();
      for (const [index, file] of request.files.entries()) {
        const fileKey = file.key ?? `files[${index}]`;
        if (Buffer.isBuffer(file.data)) {
          const { fileTypeFromBuffer } = await getFileType();
          const contentType = file.contentType ?? (await fileTypeFromBuffer(file.data))?.mime;
          formData.append(fileKey, new node_buffer.Blob([file.data], { type: contentType }), file.name);
        } else {
          formData.append(fileKey, new node_buffer.Blob([`${file.data}`], { type: file.contentType }), file.name);
        }
      }
      if (request.body != null) {
        if (request.appendToFormData) {
          for (const [key, value] of Object.entries(request.body)) {
            formData.append(key, value);
          }
        } else {
          formData.append("payload_json", JSON.stringify(request.body));
        }
      }
      finalBody = formData;
    } else if (request.body != null) {
      if (request.passThroughBody) {
        finalBody = request.body;
      } else {
        finalBody = JSON.stringify(request.body);
        additionalHeaders = { "Content-Type": "application/json" };
      }
    }
    finalBody = await utils.resolveBody(finalBody);
    const fetchOptions = {
      headers: { ...request.headers ?? {}, ...additionalHeaders, ...headers },
      method: request.method.toUpperCase()
    };
    if (finalBody !== void 0) {
      fetchOptions.body = finalBody;
    }
    fetchOptions.dispatcher = request.dispatcher ?? this.agent ?? void 0;
    return { url, fetchOptions };
  }
  clearHashSweeper() {
    clearInterval(this.hashTimer);
  }
  clearHandlerSweeper() {
    clearInterval(this.handlerTimer);
  }
  static generateRouteData(endpoint, method) {
    const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint);
    const majorId = majorIdMatch?.[1] ?? "global";
    const baseRoute = endpoint.replace(/\d{16,19}/g, ":id").replace(/\/reactions\/(.*)/, "/reactions/:reaction");
    let exceptions = "";
    if (method === "DELETE" /* Delete */ && baseRoute === "/channels/:id/messages/:id") {
      const id = /\d{16,19}$/.exec(endpoint)[0];
      const timestamp = snowflake.DiscordSnowflake.timestampFrom(id);
      if (Date.now() - timestamp > 1e3 * 60 * 60 * 24 * 14) {
        exceptions += "/Delete Old Message";
      }
    }
    return {
      majorParameter: majorId,
      bucketRoute: baseRoute + exceptions,
      original: endpoint
    };
  }
};
let RequestManager = _RequestManager;
_token = new WeakMap();

exports.RequestManager = RequestManager;
exports.RequestMethod = RequestMethod;
//# sourceMappingURL=RequestManager.cjs.map