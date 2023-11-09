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
            this.log(JSON.stringify(this.config));

            try {
                let message = "";
                let status = this.config.status;
                let timeout = this.config.timeout;
                let position = this.config.position;
                let width = this.config.width;
                let icon = this.config.icon;
                let speed = this.config.speed;
                let size = this.config.size;
                let effect = this.config.effect;
                if (req.body.message) message = req.body.message;
                if (req.body.status) status = req.body.status;
                if (req.body.timeout) timeout = req.body.timeout;
                if (req.body.position) position = req.body.position;
                if (req.body.width) width = req.body.width;
                if (req.body.icon) icon = req.body.icon;
                if (req.body.speed) speed = req.body.speed;
                if (req.body.size) size = req.body.size;
                if (req.body.effect) effect = req.body.effect;
                let msg = {
                    message: message,
                    status: status,
                    timeout: timeout,
                    position: position,
                    width: width,
                    icon: icon,
                    speed: speed,
                    size: size,
                    effect: effect
                }
                this.log('WEBHOOK_SNACKBAR ' + JSON.stringify(msg));
                this.sendSocketNotification('WEBHOOK_SNACKBAR', msg);
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


