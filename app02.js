var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Aa9fX8AICuvSuampImy5gLANRlWTqJ3RQZnLk6w0_h81cm6fMc2JYbpNaJpdfj9C2uVUTyqWXpSeyvgV',
  'client_secret': 'EC_mQN89m0DMIwJZi2LSP59iJDu3DVPjNaGGPWRsJtPipyF03VgzwoawcW3dK08blahgiE2Uy-ugvN3Z'
});

var create_payment_json = {
    "intent": "authorize",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://return.url",
        "cancel_url": "http://cancel.url"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};

var paymentId;
paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Payment created.")
        for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
            if (payment.links[index].rel === 'approval_url') {
                console.log(payment.links[index].href);
                const href = payment.links[index].href;
                paymentId =  href.substring(href.lastIndexOf("/")+1,href.length);
            }
        }
       // console.log(payment);
    }
});

var execute_payment_json = {
    "payer_id": "Appended to redirect url",
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "1.00"
        }
    }]
};

//var paymentId = 'PAYMENT id created in previous step';

paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
    }
});