'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return (!this.updated || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  return (password && password.length > 6);
};

var UserSchema = new Schema({
  nickname: {
    type: String,
    trim: true,
    default: '',
    unique: '该昵称已被使用',
    required: '请填写昵称',
    validate: [validateLocalStrategyProperty, '请填写昵称']
  },
  mobile: {
    type: String,
    trim: true,
    default: '',
    unique: '该手机号码已被使用',
    required: '请填写手机号码',
    validate: [validateLocalStrategyProperty, '请填写手机号码'],
    match: [/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/, '请输入一个有效的手机号码']
  },
  avatar: {
    type: String,
    trim: true,
    default: ''
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, '密码长度必须大于6位']
  },
  salt: {
    type: String
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user']
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  if (this.password && this.password.length > 6) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
})

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};


module.exports = mongoose.model('User', UserSchema);
