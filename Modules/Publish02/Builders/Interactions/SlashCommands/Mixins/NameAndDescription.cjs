'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Assertions = require('../Assertions.cjs');

class SharedNameAndDescription {
  setName(name) {
    Assertions.validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }
  setDescription(description) {
    Assertions.validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }
  setNameLocalization(locale, localizedName) {
    if (!this.name_localizations) {
      Reflect.set(this, "name_localizations", {});
    }
    const parsedLocale = Assertions.validateLocale(locale);
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
  setDescriptionLocalization(locale, localizedDescription) {
    if (!this.description_localizations) {
      Reflect.set(this, "description_localizations", {});
    }
    const parsedLocale = Assertions.validateLocale(locale);
    if (localizedDescription === null) {
      this.description_localizations[parsedLocale] = null;
      return this;
    }
    Assertions.validateDescription(localizedDescription);
    this.description_localizations[parsedLocale] = localizedDescription;
    return this;
  }
  setDescriptionLocalizations(localizedDescriptions) {
    if (localizedDescriptions === null) {
      Reflect.set(this, "description_localizations", null);
      return this;
    }
    Reflect.set(this, "description_localizations", {});
    Object.entries(localizedDescriptions).forEach(
      (args) => this.setDescriptionLocalization(...args)
    );
    return this;
  }
}

exports.SharedNameAndDescription = SharedNameAndDescription;