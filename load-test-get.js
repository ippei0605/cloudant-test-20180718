/**
 * @file Cloudant Test (Published 2018/7/18): 負荷テスト get
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
    }),
    db = cloudant.use(context.dbName);

const
    n = !isNaN(process.argv[2]) ? Number(process.argv[2]) : 30,
    temp = [];
for (let i = 0; i < n; i++) {
    temp.push({});
}

console.time('get documents');

Promise.all(temp.map(v => {
    return db.get(context.docName);
}))
    .then(v => {
        console.timeEnd('get documents');
        console.log(v);
    })
    .catch(e => {
        console.log('error:', e);
    });