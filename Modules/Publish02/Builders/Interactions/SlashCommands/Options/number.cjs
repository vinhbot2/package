'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const shapeshift = require('../../../../../Package/sapphire/shapeshift/index');
const v10 = require('../../../../api');
const tsMixer = require('ts-mixer');
const ApplicationCommandNumericOptionMinMaxValueMixin = require('../Mixins/ApplicationCommandNumericOptionMinMaxValueMixin.cjs');
const ApplicationCommandOptionBase = require('../Mixins/ApplicationCommandOptionBase.cjs');
const ApplicationCommandOptionWithChoicesAndAutocompleteMixin = require('../Mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.cjs');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
const numberValidator = shapeshift.s.number;
exports.SlashCommandNumberOption = class extends ApplicationCommandOptionBase.ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    this.type = v10.ApplicationCommandOptionType.Number;
  }
  setMaxValue(max) {
    numberValidator.parse(max);
    Reflect.set(this, "max_value", max);
    return this;
  }
  setMinValue(min) {
    numberValidator.parse(min);
    Reflect.set(this, "min_value", min);
    return this;
  }
  toJSON() {
    this.runRequiredValidations();
    if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
      throw new RangeError("Autocomplete and choices are mutually exclusive to each other.");
    }
    return { ...this };
  }
};
exports.SlashCommandNumberOption = __decorateClass([
  tsMixer.mix(ApplicationCommandNumericOptionMinMaxValueMixin.ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin.ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
], exports.SlashCommandNumberOption);
//# sourceMappingURL=number.cjs.map
