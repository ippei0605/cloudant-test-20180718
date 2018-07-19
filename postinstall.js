/**
 * @file Cloudant Test (Published 2018/7/18): 初期化
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    Cloudant = require('@cloudant/cloudant'),
    context = require('./context');

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
});

destroy(context.dbName)
    .then(v => cloudant.db.create(context.dbName))
    .then(v => {
        const db = cloudant.use(context.dbName);
        db.insert({crazy: true}, context.docName);
    })
    .catch(e => {
        console.log('error:', e)
    });

function destroy (dbName) {
    return cloudant.db.destroy(dbName)
        .catch(e => {
            if (e.error === "not_found") {
                return {ok: true};
            } else {
                throw e;
            }
        });
}