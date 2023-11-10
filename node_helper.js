'use strict';

const _ = require('lodash');
const NodeHelper = require('node_helper');
const bodyParser = require('body-parser');
const moment = require('moment');

module.exports = NodeHelper.create({
    start: function () {
        this.log('Starting node_helper');

        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: true }));

        this.expressApp.post('/webhook', (req, res) => {
            this.log('Incoming webhook notification : ' + JSON.stringify(req.body), true);
            this.log('config : ' + JSON.stringify(this.config));

            try {
                let msg = {
                    message: req.body?.message || "",
                    status: req.body?.status || this.config.status,
                    timeout: req.body?.timeout || this.config.timeout,
                    position: req.body?.position || this.config.position,
                    width: req.body?.width || this.config.width,
                    icon: req.body?.icon || this.config.icon,
                    speed: req.body?.speed || this.config.speed,
                    size: req.body?.size || this.config.size,
                    effect: req.body?.effect || this.config.effect,
                    dismissible: req.body?.dismissible || this.config.dismissible
                }
                this.log('notification ' + JSON.stringify(msg));
                this.sendSocketNotification('WEBHOOK_NOTIFICATION', msg);
                res.status(200)
                    .send({
                        status: 200
                    });
            }
            catch (err) {
                res.status(400)
                    .send({
                        status: 400,
                        error: err.message
                    });
            }
        });
    },

    /**
     *
     * @param {String} notification
     * @param {*}      payload
     */
    socketNotificationReceived: function (notification, payload) {
        this.log("Socket Notification recevied : " + notification);
        if (notification === 'START') {
            // Load config into this module
            this.config = payload;
            this.log("Config at start " + this.config);
        }
    },

    /**
     * Outputs log messages
     *
     * @param {String}  message
     * @param {Boolean} [debug_only]
     */
    log: function (message) {
        console.log('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] [MMM-Webhook-Notification] ' + message);
    }
    , FirstLineOnly: function (text) {
        return text.split('/r/n')[0];
    }
});


