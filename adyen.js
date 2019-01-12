const axios = require('axios');

const API_AUTHORIZE = 'https://pal-test.adyen.com/pal/servlet/Payment/v40/authorise';
const API_RECURRING_STOP = 'https://pal-test.adyen.com/pal/servlet/Recurring/v25/disable';
const API_RECURRING_DETAILS = 'https://pal-test.adyen.com/pal/servlet/Recurring/v25/listRecurringDetails';

module.exports = class Adyen {

    constructor() {
        this.login = process.env.WS_LOGIN;
        this.pass = process.env.WS_PASS;
    }

    authrorize(formData, userId) {
        return new Promise((resolve, reject) => {
            axios.post(API_AUTHORIZE, {
                additionalData: {
                    "card.encrypted.json": formData
                },
                amount: {
                    value: 20,
                    currency: 'USD'
                },
                recurring: {
                    recurringDetailName: 'monthly sub',
                    contract: 'RECURRING'
                },
                shopperReference: userId,
                reference: 'monthly sub first payment',
                merchantAccount: process.env.MERCHANT
            }, {
                headers: {
                    Authorization: this._generateAuthHeader()
                }
            }).then((response) => {
                if (response.data.resultCode === 'Authorised') {
                    resolve();
                } else
                    reject();
            }).catch((error) => reject());
        });
    };

    listRecurring(userId) {
        return new Promise((resolve, reject) => {
            axios.post(API_RECURRING_DETAILS, {
                recurring: {
                    contract: "RECURRING"
                },
                shopperReference: userId,
                merchantAccount: process.env.MERCHANT
            }, {
                headers: {
                    Authorization: this._generateAuthHeader()
                }
            }).then(function (response) {
                let data = [];
                if (response.data) {
                    response.data.details.forEach((elem) => {
                        data.push({
                            cardNum: elem.RecurringDetail.card.number,
                            cardName: elem.RecurringDetail.card.holderName,
                            creationDate: elem.RecurringDetail.creationDate
                        });
                    });

                }
                resolve(data)
            }).catch((error) => reject());
        });
    };

    stopReccuring(userId) {
        return new Promise((resolve, reject) => {
            axios.post(API_RECURRING_STOP, {
                shopperReference: userId,
                merchantAccount: process.env.MERCHANT
            }, {
                headers: {
                    Authorization: this._generateAuthHeader()
                }
            }).then((response) => resolve())
                .catch((error) => reject());
        });
    };

    _generateAuthHeader() {
        return 'Basic ' + Buffer.from(this.login + ':' + this.pass).toString('base64');
    };
};