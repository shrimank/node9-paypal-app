var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Aa9fX8AICuvSuampImy5gLANRlWTqJ3RQZnLk6w0_h81cm6fMc2JYbpNaJpdfj9C2uVUTyqWXpSeyvgV',
    'client_secret': 'EC_mQN89m0DMIwJZi2LSP59iJDu3DVPjNaGGPWRsJtPipyF03VgzwoawcW3dK08blahgiE2Uy-ugvN3Z'
});

module.exports = {
    paypal
};