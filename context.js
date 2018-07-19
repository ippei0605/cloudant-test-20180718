/**
 * Cloudant Test (Published 2018/7/18): コンテキスト
 * @module context
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    vcapServices = require('vcap_services'),
    cloudantCreds = vcapServices.getCredentials('cloudantNoSQLDB');

module.exports = {
    cloudantCreds: cloudantCreds,
    dbName: process.env.npm_package_config_db_name,
    docName: process.env.npm_package_config_doc_name
};