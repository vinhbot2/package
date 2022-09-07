'use strict';

const { deprecate } = require('node:util');
const { isJSONEncodable } = require('../../Publish02/index');
const Component = require('./Component');
const { createComponent } = require('../Util/Components');

/**
 * Represents an action row
 * @extends {Component}
 */
class ActionRow extends Component {
  constructor({ components, ...data }) {
    super(data);

    /**
     * The components in this action row
     * @type {Component[]}
     * @readonly
     */
    this.components = components.map(c => createComponent(c));
  }

  /**
   * Creates a new action row builder from JSON data
   * @param {JSONEncodable<APIActionRowComponent>|APIActionRowComponent} other The other data
   * @returns {ActionRowBuilder}
   * @deprecated Use {@link ActionRowBuilder.from()} instead.
   */
  static from(other) {
    if (isJSONEncodable(other)) {
      return new this(other.toJSON());
    }
    return new this(other);
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIActionRowComponent}
   */
  toJSON() {
    return { ...this.data, components: this.components.map(c => c.toJSON()) };
  }
}

ActionRow.from = deprecate(ActionRow.from, 'ActionRow.from() không được dùng nữa. Sử dụng ActionRowBuilder.from() để thay thế.');

module.exports = ActionRow;