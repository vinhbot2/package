'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const shapeshift = require('../../../../Package/sapphire/shapeshift/index');
const v10 = require('../../../api');
const validation = require('../../Util/validation.cjs');

const namePredicate = shapeshift.s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(32).regex(/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u).setValidationEnabled(validation.isValidationEnabled);
function validateName(name) {
  namePredicate.parse(name);
}
const descriptionPredicate = shapeshift.s.string.lengthGreaterThanOrEqual(1).lengthLessThanOrEqual(100).setValidationEnabled(validation.isValidationEnabled);
const localePredicate = shapeshift.s.nativeEnum(v10.Locale);
function validateDescription(description) {
  descriptionPredicate.parse(description);
}
const maxArrayLengthPredicate = shapeshift.s.unknown.array.lengthLessThanOrEqual(25).setValidationEnabled(validation.isValidationEnabled);
function validateLocale(locale) {
  return localePredicate.parse(locale);
}
function validateMaxOptionsLength(options) {
  maxArrayLengthPredicate.parse(options);
}
function validateRequiredParameters(name, description, options) {
  validateName(name);
  validateDescription(description);
  validateMaxOptionsLength(options);
}
const booleanPredicate = shapeshift.s.boolean;
function validateDefaultPermission(value) {
  booleanPredicate.parse(value);
}
function validateRequired(required) {
  booleanPredicate.parse(required);
}
const choicesLengthPredicate = shapeshift.s.number.lessThanOrEqual(25).setValidationEnabled(validation.isValidationEnabled);
function validateChoicesLength(amountAdding, choices) {
  choicesLengthPredicate.parse((choices?.length ?? 0) + amountAdding);
}
function assertReturnOfBuilder(input, ExpectedInstanceOf) {
  shapeshift.s.instance(ExpectedInstanceOf).parse(input);
}
const localizationMapPredicate = shapeshift.s.object(Object.fromEntries(Object.values(v10.Locale).map((locale) => [locale, shapeshift.s.string.nullish]))).strict.nullish.setValidationEnabled(validation.isValidationEnabled);
function validateLocalizationMap(value) {
  localizationMapPredicate.parse(value);
}
const dmPermissionPredicate = shapeshift.s.boolean.nullish;
function validateDMPermission(value) {
  dmPermissionPredicate.parse(value);
}
const memberPermissionPredicate = shapeshift.s.union(shapeshift.s.bigint.transform((value) => value.toString()), shapeshift.s.number.safeInt.transform((value) => value.toString()), shapeshift.s.string.regex(/^\d+$/)).nullish;
function validateDefaultMemberPermissions(permissions) {
  return memberPermissionPredicate.parse(permissions);
}

exports.assertReturnOfBuilder = assertReturnOfBuilder;
exports.localizationMapPredicate = localizationMapPredicate;
exports.validateChoicesLength = validateChoicesLength;
exports.validateDMPermission = validateDMPermission;
exports.validateDefaultMemberPermissions = validateDefaultMemberPermissions;
exports.validateDefaultPermission = validateDefaultPermission;
exports.validateDescription = validateDescription;
exports.validateLocale = validateLocale;
exports.validateLocalizationMap = validateLocalizationMap;
exports.validateMaxOptionsLength = validateMaxOptionsLength;
exports.validateName = validateName;
exports.validateRequired = validateRequired;
exports.validateRequiredParameters = validateRequiredParameters;