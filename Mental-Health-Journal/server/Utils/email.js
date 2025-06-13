const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.username.split(' ')[0];
    this.url = url;
    this.from = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;
  }

  /**
   * Create a new nodemailer transporter
   */
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Use SendGrid for production
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Use Mailtrap for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send the actual email
   * @param {string} template - Template name (without extension)
   * @param {string} subject - Email subject
   * @param {Object} templateVars - Variables to pass to the template
   */
  async send(template, subject, templateVars = {}) {
    try {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(
        `${__dirname}/../views/emails/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
          ...templateVars,
        }
      );

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html), // Convert HTML to plain text
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('There was an error sending the email. Try again later!');
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcome() {
    await this.send(
      'welcome',
      'Welcome to AI-Powered Mental Health Journal!',
      { subject: 'Welcome to AI-Powered Mental Health Journal!' }
    );
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)',
      { subject: 'Your password reset token (valid for 10 minutes)' }
    );
  }

  /**
   * Send email verification
   */
  async sendVerification() {
    await this.send(
      'verifyEmail',
      'Verify your email address',
      { subject: 'Verify your email address' }
    );
  }

  /**
   * Send login notification
   */
  async sendLoginNotification(ip, device, location) {
    await this.send(
      'loginNotification',
      'New login detected',
      {
        subject: 'New login detected',
        ip,
        device: device || 'Unknown device',
        location: location || 'Unknown location',
        date: new Date().toLocaleString(),
      }
    );
  }
};
