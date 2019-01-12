const Adyen = require('./../adyen');

const tmpUserId = 'yourShopperId_IOfW3k9G2PvXFu2j';

exports.getPayment = (req, res, next) => {
    res.render('index', {
        dateTime: new Date().toISOString()
    });
};

exports.processPayment = (req, res, next) => {
    if (req.body.encryptedForm) {
        let adyen = new Adyen();
        adyen.authrorize(req.body.encryptedForm, tmpUserId,
            () => {res.render('payment_result', {msg: "Your payment was successful!"})},
            () => {res.render('payment_result', {msg: "Sorry! Something went wrong"})});


        adyen.authrorize(req.body.encryptedForm, tmpUserId)
            .then(() => res.render('payment_result', {msg: "Your payment was successful!"}))
            .catch(() => res.render('payment_result', {msg: "Sorry! Something went wrong"}));
    } else {
        res.render('payment_result', {msg: "Sorry! Something went wrong"});
    }
};

exports.getSubscription = (req, res, next) => {
    let adyen = new Adyen();
    adyen.listRecurring(tmpUserId).then((data) => {
        console.log(data);
        if (data.length) {
            res.render('sub_details', {data: data})
        } else {
            res.render('payment_result', {msg: "You have no active subscriptions"})
        }
    }).catch(() => res.render('payment_result', {msg: "Sorry! Something went wrong"}));

};

exports.getStopSubscription = (req, res, next) => {
    res.render('stop_sub');
};
exports.processStopSubscription = (req, res, next) => {
    let adyen = new Adyen();
    adyen.stopReccuring(tmpUserId)
        .then(() => res.render('payment_result', {msg: "You have been successfully unsubscribed"}))
        .catch(() => res.render('payment_result', {msg: "Sorry! Something went wrong"}));

};

