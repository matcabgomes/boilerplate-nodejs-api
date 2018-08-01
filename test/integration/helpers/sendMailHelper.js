var settings              = require('../../../src/config/settings');
var SendMailHelper        = require('../../../src/helpers/sendMailHelper');
var nodemailer            = require('nodemailer');

describe('helpers', function(){
  describe('sendMailHelper', function(){
    it('should send an email to matcabgomes@gmail.com', function() {
      this.timeout(5000);

      var sendMailHelper = new SendMailHelper(nodemailer);
      sendMailHelper.options = settings.mailOptions;

      return sendMailHelper.send({
        from: 'matcabgomes@gmail.com',
        to: 'matcabgomes@gmail.com',
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
      });
    });
  });
});
