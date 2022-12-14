'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const Assertions = require('./Assertions.cjs');
const ActionRow = require('../../Components/ActionRow.cjs');
const Assertions$1 = require('../../Components/Assertions.cjs');
const Components = require('../../Components/Components.cjs');
const normalizeArray = require('../../Util/normalizeArray.cjs');

class ModalBuilder {
  constructor({ components, ...data } = {}) {
    this.components = [];
    this.data = { ...data };
    this.components = components?.map((c) => Components.createComponentBuilder(c)) ?? [];
  }
  setTitle(title) {
    this.data.title = Assertions.titleValidator.parse(title);
    return this;
  }
  setCustomId(customId) {
    this.data.custom_id = Assertions$1.customIdValidator.parse(customId);
    return this;
  }
  addComponents(...components) {
    this.components.push(
      ...normalizeArray.normalizeArray(components).map(
        (component) => component instanceof ActionRow.ActionRowBuilder ? component : new ActionRow.ActionRowBuilder(component)
      )
    );
    return this;
  }
  setComponents(...components) {
    this.components.splice(0, this.components.length, ...normalizeArray.normalizeArray(components));
    return this;
  }
  toJSON() {
    Assertions.validateRequiredParameters(this.data.custom_id, this.data.title, this.components);
    return {
      ...this.data,
      components: this.components.map((component) => component.toJSON())
    };
  }
}

exports.ModalBuilder = ModalBuilder;