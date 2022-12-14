'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const v10 = require('../../../api');
const Assertions = require('../Assertions.cjs');
const Component = require('../Component.cjs');


class ButtonBuilder extends Component.ComponentBuilder {
  constructor(data) {
    super({ type: v10.ComponentType.Button, ...data });
  }
  setStyle(style) {
    this.data.style = Assertions.buttonStyleValidator.parse(style);
    return this;
  }
  setURL(url) {
    this.data.url = Assertions.urlValidator.parse(url);
    return this;
  }
  setCustomId(customId) {
    this.data.custom_id = Assertions.customIdValidator.parse(customId);
    return this;
  }
  setEmoji(emoji) {
    this.data.emoji = Assertions.emojiValidator.parse(emoji);
    return this;
  }
  setDisabled(disabled = true) {
    this.data.disabled = Assertions.disabledValidator.parse(disabled);
    return this;
  }
  setLabel(label) {
    this.data.label = Assertions.buttonLabelValidator.parse(label);
    return this;
  }
  toJSON() {
    Assertions.validateRequiredButtonParameters(
      this.data.style,
      this.data.label,
      this.data.emoji,
      this.data.custom_id,
      this.data.url
    );
    return {
      ...this.data
    };
  }
}

exports.ButtonBuilder = ButtonBuilder;