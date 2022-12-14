'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const shapeshift = require('../../../../Package/sapphire/shapeshift/index');
const v10 = require('../../../api');
const validation = require('../../Util/validation.cjs');
const namePredicate = shapeshift.s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(32).regex(/^( *[\p{L}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+ *)+$/u).setValidationEnabled(validation.isValidationEnabled);
const typePredicate = shapeshift.s.union(shapeshift.s.literal(v10.ApplicationCommandType.User), shapeshift.s.literal(v10.ApplicationCommandType.Message)).setValidationEnabled(validation.isValidationEnabled);
const booleanPredicate = shapeshift.s.boolean;
function validateDefaultPermission(value) {
  booleanPredicate.parse(value);
}
function validateName(name) {
  namePredicate.parse(name);
}
function validateType(type) {
  typePredicate.parse(type);
}
function validateRequiredParameters(name, type) {
  validateName(name);
  validateType(type);
}
const dmPermissionPredicate = shapeshift.s.boolean.nullish;
function validateDMPermission(value) {
  dmPermissionPredicate.parse(value);
}
const memberPermissionPredicate = shapeshift.s.union(shapeshift.s.bigint.transform((value) => value.toString()), shapeshift.s.number.safeInt.transform((value) => value.toString()), shapeshift.s.string.regex(/^\d+$/)).nullish;
function validateDefaultMemberPermissions(permissions) {
  return memberPermissionPredicate.parse(permissions);
}

exports.validateDMPermission = validateDMPermission;
exports.validateDefaultMemberPermissions = validateDefaultMemberPermissions;
exports.validateDefaultPermission = validateDefaultPermission;
exports.validateName = validateName;
exports.validateRequiredParameters = validateRequiredParameters;
exports.validateType = validateType;