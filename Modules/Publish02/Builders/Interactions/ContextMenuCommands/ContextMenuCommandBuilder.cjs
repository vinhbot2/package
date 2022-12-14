'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Assertions = require('./Assertions.cjs');
const Assertions$1 = require('../SlashCommands/Assertions.cjs');

class ContextMenuCommandBuilder {
  constructor() {
    this.name = void 0;
    this.type = void 0;
    this.default_permission = void 0;
    this.default_member_permissions = void 0;
    this.dm_permission = void 0;
  }
  setName(name) {
    Assertions.validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }
  setType(type) {
    Assertions.validateType(type);
    Reflect.set(this, "type", type);
    return this;
  }
  setDefaultPermission(value) {
    Assertions.validateDefaultPermission(value);
    Reflect.set(this, "default_permission", value);
    return this;
  }
  setDefaultMemberPermissions(permissions) {
    const permissionValue = Assertions.validateDefaultMemberPermissions(permissions);
    Reflect.set(this, "default_member_permissions", permissionValue);
    return this;
  }
  setDMPermission(enabled) {
    Assertions.validateDMPermission(enabled);
    Reflect.set(this, "dm_permission", enabled);
    return this;
  }
  setNameLocalization(locale, localizedName) {
    if (!this.name_localizations) {
      Reflect.set(this, "name_localizations", {});
    }
    const parsedLocale = Assertions$1.validateLocale(locale);
    if (localizedName === null) {
      this.name_localizations[parsedLocale] = null;
      return this;
    }
    Assertions.validateName(localizedName);
    this.name_localizations[parsedLocale] = localizedName;
    return this;
  }
  setNameLocalizations(localizedNames) {
    if (localizedNames === null) {
      Reflect.set(this, "name_localizations", null);
      return this;
    }
    Reflect.set(this, "name_localizations", {});
    Object.entries(localizedNames).forEach(
      (args) => this.setNameLocalization(...args)
    );
    return this;
  }
  toJSON() {
    Assertions.validateRequiredParameters(this.name, this.type);
    Assertions$1.validateLocalizationMap(this.name_localizations);
    return { ...this };
  }
}

exports.ContextMenuCommandBuilder = ContextMenuCommandBuilder;