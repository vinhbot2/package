'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const promises = require('node:timers/promises');
const asyncQueue = require('../../../../Package/sapphire/async-queue/index');
const undici = require('undici');
const DiscordAPIError = require('../Errors/DiscordAPIError.cjs');
const HTTPError = require('../Errors/HTTPError.cjs');
const RateLimitError = require('../Errors/RateLimitError.cjs');
const constants = require('../Utils/constants.cjs');
const utils = require('../Utils/utils.cjs');

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
var _asyncQueue, _sublimitedQueue, _sublimitPromise, _shiftSublimit;
let invalidCount = 0;
let invalidCountResetTime = null;
class SequentialHandler {
  constructor(manager, hash, majorParameter) {
    this.manager = manager;
    this.hash = hash;
    this.majorParameter = majorParameter;
    this.reset = -1;
    this.remaining = 1;
    this.limit = Infinity;
    __privateAdd(this, _asyncQueue, new asyncQueue.AsyncQueue());
    __privateAdd(this, _sublimitedQueue, null);
    __privateAdd(this, _sublimitPromise, null);
    __privateAdd(this, _shiftSublimit, false);
    this.id = `${hash}:${majorParameter}`;
  }
  get inactive() {
    return __privateGet(this, _asyncQueue).remaining === 0 && (__privateGet(this, _sublimitedQueue) === null || __privateGet(this, _sublimitedQueue).remaining === 0) && !this.limited;
  }
  get globalLimited() {
    return this.manager.globalRemaining <= 0 && Date.now() < this.manager.globalReset;
  }
  get localLimited() {
    return this.remaining <= 0 && Date.now() < this.reset;
  }
  get limited() {
    return this.globalLimited || this.localLimited;
  }
  get timeToReset() {
    return this.reset + this.manager.options.offset - Date.now();
  }
  debug(message) {
    this.manager.emit(constants.RESTEvents.Debug, `[REST ${this.id}] ${message}`);
  }
  async globalDelayFor(time) {
    await promises.setTimeout(time, void 0, { ref: false });
    this.manager.globalDelay = null;
  }
  async onRateLimit(rateLimitData) {
    const { options } = this.manager;
    if (!options.rejectOnRateLimit)
      return;
    const shouldThrow = typeof options.rejectOnRateLimit === "function" ? await options.rejectOnRateLimit(rateLimitData) : options.rejectOnRateLimit.some((route) => rateLimitData.route.startsWith(route.toLowerCase()));
    if (shouldThrow) {
      throw new RateLimitError.RateLimitError(rateLimitData);
    }
  }
  async queueRequest(routeId, url, options, requestData) {
    let queue = __privateGet(this, _asyncQueue);
    let queueType = 0 /* Standard */;
    if (__privateGet(this, _sublimitedQueue) && utils.hasSublimit(routeId.bucketRoute, requestData.body, options.method)) {
      queue = __privateGet(this, _sublimitedQueue);
      queueType = 1 /* Sublimit */;
    }
    await queue.wait();
    if (queueType === 0 /* Standard */) {
      if (__privateGet(this, _sublimitedQueue) && utils.hasSublimit(routeId.bucketRoute, requestData.body, options.method)) {
        queue = __privateGet(this, _sublimitedQueue);
        const wait = queue.wait();
        __privateGet(this, _asyncQueue).shift();
        await wait;
      } else if (__privateGet(this, _sublimitPromise)) {
        await __privateGet(this, _sublimitPromise).promise;
      }
    }
    try {
      return await this.runRequest(routeId, url, options, requestData);
    } finally {
      queue.shift();
      if (__privateGet(this, _shiftSublimit)) {
        __privateSet(this, _shiftSublimit, false);
        __privateGet(this, _sublimitedQueue)?.shift();
      }
      if (__privateGet(this, _sublimitedQueue)?.remaining === 0) {
        __privateGet(this, _sublimitPromise)?.resolve();
        __privateSet(this, _sublimitedQueue, null);
      }
    }
  }
  async runRequest(routeId, url, options, requestData, retries = 0) {
    while (this.limited) {
      const isGlobal = this.globalLimited;
      let limit2;
      let timeout2;
      let delay;
      if (isGlobal) {
        limit2 = this.manager.options.globalRequestsPerSecond;
        timeout2 = this.manager.globalReset + this.manager.options.offset - Date.now();
        if (!this.manager.globalDelay) {
          this.manager.globalDelay = this.globalDelayFor(timeout2);
        }
        delay = this.manager.globalDelay;
      } else {
        limit2 = this.limit;
        timeout2 = this.timeToReset;
        delay = promises.setTimeout(timeout2);
      }
      const rateLimitData = {
        timeToReset: timeout2,
        limit: limit2,
        method: options.method ?? "get",
        hash: this.hash,
        url,
        route: routeId.bucketRoute,
        majorParameter: this.majorParameter,
        global: isGlobal
      };
      this.manager.emit(constants.RESTEvents.RateLimited, rateLimitData);
      await this.onRateLimit(rateLimitData);
      if (isGlobal) {
        this.debug(`Global rate limit hit, blocking all requests for ${timeout2}ms`);
      } else {
        this.debug(`Waiting ${timeout2}ms for rate limit to pass`);
      }
      await delay;
    }
    if (!this.manager.globalReset || this.manager.globalReset < Date.now()) {
      this.manager.globalReset = Date.now() + 1e3;
      this.manager.globalRemaining = this.manager.options.globalRequestsPerSecond;
    }
    this.manager.globalRemaining--;
    const method = options.method ?? "get";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.manager.options.timeout).unref();
    let res;
    try {
      res = await undici.request(url, { ...options, signal: controller.signal });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError" && retries !== this.manager.options.retries) {
        return await this.runRequest(routeId, url, options, requestData, ++retries);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
    if (this.manager.listenerCount(constants.RESTEvents.Response)) {
      this.manager.emit(
        constants.RESTEvents.Response,
        {
          method,
          path: routeId.original,
          route: routeId.bucketRoute,
          options,
          data: requestData,
          retries
        },
        { ...res }
      );
    }
    const status = res.statusCode;
    let retryAfter = 0;
    const limit = utils.parseHeader(res.headers["x-ratelimit-limit"]);
    const remaining = utils.parseHeader(res.headers["x-ratelimit-remaining"]);
    const reset = utils.parseHeader(res.headers["x-ratelimit-reset-after"]);
    const hash = utils.parseHeader(res.headers["x-ratelimit-bucket"]);
    const retry = utils.parseHeader(res.headers["retry-after"]);
    this.limit = limit ? Number(limit) : Infinity;
    this.remaining = remaining ? Number(remaining) : 1;
    this.reset = reset ? Number(reset) * 1e3 + Date.now() + this.manager.options.offset : Date.now();
    if (retry)
      retryAfter = Number(retry) * 1e3 + this.manager.options.offset;
    if (hash && hash !== this.hash) {
      this.debug(["Received bucket hash update", `  Old Hash  : ${this.hash}`, `  New Hash  : ${hash}`].join("\n"));
      this.manager.hashes.set(`${method}:${routeId.bucketRoute}`, { value: hash, lastAccess: Date.now() });
    } else if (hash) {
      const hashData = this.manager.hashes.get(`${method}:${routeId.bucketRoute}`);
      if (hashData) {
        hashData.lastAccess = Date.now();
      }
    }
    let sublimitTimeout = null;
    if (retryAfter > 0) {
      if (res.headers["x-ratelimit-global"] !== void 0) {
        this.manager.globalRemaining = 0;
        this.manager.globalReset = Date.now() + retryAfter;
      } else if (!this.localLimited) {
        sublimitTimeout = retryAfter;
      }
    }
    if (status === 401 || status === 403 || status === 429) {
      if (!invalidCountResetTime || invalidCountResetTime < Date.now()) {
        invalidCountResetTime = Date.now() + 1e3 * 60 * 10;
        invalidCount = 0;
      }
      invalidCount++;
      const emitInvalid = this.manager.options.invalidRequestWarningInterval > 0 && invalidCount % this.manager.options.invalidRequestWarningInterval === 0;
      if (emitInvalid) {
        this.manager.emit(constants.RESTEvents.InvalidRequestWarning, {
          count: invalidCount,
          remainingTime: invalidCountResetTime - Date.now()
        });
      }
    }
    if (status >= 200 && status < 300) {
      return res;
    } else if (status === 429) {
      const isGlobal = this.globalLimited;
      let limit2;
      let timeout2;
      if (isGlobal) {
        limit2 = this.manager.options.globalRequestsPerSecond;
        timeout2 = this.manager.globalReset + this.manager.options.offset - Date.now();
      } else {
        limit2 = this.limit;
        timeout2 = this.timeToReset;
      }
      await this.onRateLimit({
        timeToReset: timeout2,
        limit: limit2,
        method,
        hash: this.hash,
        url,
        route: routeId.bucketRoute,
        majorParameter: this.majorParameter,
        global: isGlobal
      });
      this.debug(
        [
          "Encountered unexpected 429 rate limit",
          `  Global         : ${isGlobal.toString()}`,
          `  Method         : ${method}`,
          `  URL            : ${url}`,
          `  Bucket         : ${routeId.bucketRoute}`,
          `  Major parameter: ${routeId.majorParameter}`,
          `  Hash           : ${this.hash}`,
          `  Limit          : ${limit2}`,
          `  Retry After    : ${retryAfter}ms`,
          `  Sublimit       : ${sublimitTimeout ? `${sublimitTimeout}ms` : "None"}`
        ].join("\n")
      );
      if (sublimitTimeout) {
        const firstSublimit = !__privateGet(this, _sublimitedQueue);
        if (firstSublimit) {
          __privateSet(this, _sublimitedQueue, new asyncQueue.AsyncQueue());
          void __privateGet(this, _sublimitedQueue).wait();
          __privateGet(this, _asyncQueue).shift();
        }
        __privateGet(this, _sublimitPromise)?.resolve();
        __privateSet(this, _sublimitPromise, null);
        await promises.setTimeout(sublimitTimeout, void 0, { ref: false });
        let resolve;
        const promise = new Promise((res2) => resolve = res2);
        __privateSet(this, _sublimitPromise, { promise, resolve });
        if (firstSublimit) {
          await __privateGet(this, _asyncQueue).wait();
          __privateSet(this, _shiftSublimit, true);
        }
      }
      return this.runRequest(routeId, url, options, requestData, retries);
    } else if (status >= 500 && status < 600) {
      if (retries !== this.manager.options.retries) {
        return this.runRequest(routeId, url, options, requestData, ++retries);
      }
      throw new HTTPError.HTTPError(res.constructor.name, status, method, url, requestData);
    } else {
      if (status >= 400 && status < 500) {
        if (status === 401 && requestData.auth) {
          this.manager.setToken(null);
        }
        const data = await utils.parseResponse(res);
        throw new DiscordAPIError.DiscordAPIError(data, "code" in data ? data.code : data.error, status, method, url, requestData);
      }
      return res;
    }
  }
}
_asyncQueue = new WeakMap();
_sublimitedQueue = new WeakMap();
_sublimitPromise = new WeakMap();
_shiftSublimit = new WeakMap();

exports.SequentialHandler = SequentialHandler;