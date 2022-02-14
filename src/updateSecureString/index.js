const AWS = require('aws-sdk');
const kms = new AWS.KMS();


function encrypt(buffer) {
    return new Promise((resolve, reject) => {
        const params = {
            KeyId: 'arn:aws:kms:eu-west-2:833803533771:key/ede4e715-ebfa-434f-b77c-dc0708f5edde', // The identifier of the CMK to use for encryption. You can use the key ID or Amazon Resource Name (ARN) of the CMK, or the name or ARN of an alias that refers to the CMK.
            Plaintext: buffer// The data to encrypt.
        };
        kms.encrypt(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.CiphertextBlob);
            }
        });
    });
}

function decrypt(buffer) {
    return new Promise((resolve, reject) => {
        const params = {
            CiphertextBlob: buffer// The data to dencrypt.
        };
        kms.decrypt(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Plaintext);
            }
        });
    });
}


/**
 * A Lambda function.
 */
exports.updateSecureString = async (event, context) => {
    const eData = await encrypt('hello');
    console.debug(`encrypt::: ${JSON.stringify(eData)}`);
    const dData = await decrypt(eData);
    console.debug(`decrypt::: ${JSON.stringify(dData)}`);
 return '{\"statusResponse\": 200}'
};