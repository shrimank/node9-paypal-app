const express = require('express');
const ejs = require('ejs');
var paypal = require('paypal-rest-sdk');
const PORT = 3000;
const app = express();

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Aa9fX8AICuvSuampImy5gLANRlWTqJ3RQZnLk6w0_h81cm6fMc2JYbpNaJpdfj9C2uVUTyqWXpSeyvgV',
    'client_secret': 'EC_mQN89m0DMIwJZi2LSP59iJDu3DVPjNaGGPWRsJtPipyF03VgzwoawcW3dK08blahgiE2Uy-ugvN3Z'
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));




app.post('/pay', (req, res) => {

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "001",
                    "price": "15.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "15.00"
            },
            "description": "Mastering Node.js: Build robust and scalable real-time server-side web applications efficiently"
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            res.send(error.response);
            throw error;
        } else {
            //console.log("Payment created. :",payment);
            // const parsePayment =  JSON.stringify(payment);
            // console.log("JSON stringify:",parsePayment);
            // paymentObj = JSON.parse(parsePayment);
            
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                    //console.log(payment.links[i].href);
                   // res.send('success');
                }
            }
        }
    });


});


app.get('/success', (req, res) => {
    
     const payerId = req.query.PayerID;
     const paymentId = req.query.paymentId;

    const exePaymentJson = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "15.00"
            }
        }]
    };
    console.log(exePaymentJson);
    paypal.payment.execute(paymentId,exePaymentJson, (err, payment) => {
        if (err) {
            console.log("Error:", err.response);
            //throw err;
            res.send(err.response);
        } else {

            console.log(JSON.stringify(payment, null, 2));
            res.render('success');
        }
    })
});

app.get('/cancel', (req, res) => {
    res.render('cancel');
});



app.listen(PORT, () => {
    console.log(`Server Started & Listening ${PORT}`);
});