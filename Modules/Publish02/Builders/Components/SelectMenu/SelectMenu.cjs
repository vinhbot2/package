'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const v10 = require('../../../api');
const SelectMenuOption = require('./SelectMenuOption.cjs');
const normalizeArray = require('../../Util/normalizeArray.cjs');
const Assertions = require('../Assertions.cjs');
const Component = require('../Component.cjs');

class SelectMenuBuilder extends Component.ComponentBuilder {
  constructor(data) {
    const { options, ...initData } = data ?? {};
    super({ type: v10.ComponentType.SelectMenu, ...initData });
    this.options = options?.map((o) => new SelectMenuOption.SelectMenuOptionBuilder(o)) ?? [];
  }
  setPlaceholder(placeholder) {
    this.data.placeholder = Assertions.placeholderValidator.parse(placeholder);
    return this;
  }
  setMinValues(minValues) {
    this.data.min_values = Assertions.minMaxValidator.parse(minValues);
    return this;
  }
  setMaxValues(maxValues) {
    this.data.max_values = Assertions.minMaxValidator.parse(maxValues);
    return this;
  }
  setCustomId(customId) {
    this.data.custom_id = Assertions.customIdValidator.parse(customId);
    return this;
  }
  setDisabled(disabled = true) {
    this.data.disabled = Assertions.disabledValidator.parse(disabled);
    return this;
  }
  addOptions(...options) {
    options = normalizeArray.normalizeArray(options);
    Assertions.optionsLengthValidator.parse(this.options.length + options.length);
    this.options.push(
      ...options.map(
        (option) => option instanceof SelectMenuOption.SelectMenuOptionBuilder ? option : new SelectMenuOption.SelectMenuOptionBuilder(Assertions.jsonOptionValidator.parse(option))
      )
    );
    return this;
  }
  setOptions(...options) {
    options = normalizeArray.normalizeArray(options);
    Assertions.optionsLengthValidator.parse(options.length);
    this.options.splice(
      0,
      this.options.length,
      ...options.map(
        (option) => option instanceof SelectMenuOption.SelectMenuOptionBuilder ? option : new SelectMenuOption.SelectMenuOptionBuilder(Assertions.jsonOptionValidator.parse(option))
      )
    );
    return this;
  }
  toJSON() {
    Assertions.validateRequiredSelectMenuParameters(this.options, this.data.custom_id);
    return {
      ...this.data,
      options: this.options.map((o) => o.toJSON())
    };
  }
}

exports.SelectMenuBuilder = SelectMenuBuilder;