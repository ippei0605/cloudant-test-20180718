/**
 * @file Cloudant Test (Published 2018/7/18)
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    cfenv = require('cfenv'),
    Cloudant = require('@cloudant/cloudant'),
    express = require('express'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    context = require('./context');

// アプリケーションを作成する。
const
    app = express(),
    appEnv = cfenv.getAppEnv();

const cloudant = new Cloudant({
        url: context.cloudantCreds.url,
        maxAttempt: 5,
        plugins: [
            'promises',
            {
                iamauth: {
                    iamApiKey: context.cloudantCreds.iam_apikey_name
                }
            },
            {
                retry: {
                    retryDelayMultiplier: 4
                }
            }
        ]
    }),
    db = cloudant.use(context.dbName);

// ミドルウェアを設定する。
app.use(morgan('combined'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', (req, res) => {
    db.get(context.docName)
        .then(v => {
            res.json(v);
        })
        .catch(e => {
            console.log('error:', e);
            res.json({
                error: e.error,
                reason: e.reason
            });
        });
});

// リクエトを受付ける。
app.listen(appEnv.port, () => {
    console.log("server starting on " + appEnv.url);
});