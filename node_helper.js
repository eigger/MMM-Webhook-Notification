/*
This code was originally written by JC21 https://github.com/jc21/MMM-IFTTT and modified by P J Tewkesbury
*/

'use strict';

const _ = require('lodash');
const NodeHelper = require('node_helper');
const bodyParser = require('body-parser');
const moment = require('moment');
//const Mustache = require('mustache');
//var url = require('url');
//const { findLastKey } = require('lodash');

module.exports = NodeHelper.create({
    /**
     * node_helper start method
     */
    start: function () {
        this.log('Starting node_helper');

        // Create endpoint for Webhook notifications
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: true }));

        //https://docs.microsoft.com/en-us/azure/devops/service-hooks/events?view=azure-devops#work-item
        this.expressApp.post('/webhook', (req, res) => {

            // Process request.
            this.log('Incoming webhook notification : ' + JSON.stringify(req.body), true);
            this.log(JSON.stringify(this.config));

            try {
                var message = "";
                var displayMiliseconds = this.config.displayMiliseconds;
                var fadeSpeed = this.config.fadeSpeed;
                var title = this.config.title;
                var effect = this.config.effect;
                var size = this.config.size;
                var color = this.config.color;
                if (req.body.message) message = req.body.message;
                if (req.body.time) displayMiliseconds = req.body.time;
                if (req.body.fadeSpeed) fadeSpeed = req.body.fadeSpeed;
                if (req.body.title) title = req.body.title;
                if (req.body.effect) effect = req.body.effect;
                if (req.body.size) size = req.body.size;
                if (req.body.color) color = req.body.color;
                var msg = {
                    message: message,
                    displayMiliseconds: displayMiliseconds,
                    fadeSpeed: fadeSpeed,
                    title: title,
                    size: size,
                    color: color,
                    effect: effect
                }

                this.log('WEBHOOK_NOTIFICATION ' + JSON.stringify(msg));
                this.sendSocketNotification('WEBHOOK_NOTIFICATION', msg);

                // return OK to caller
                res.status(200)
                    .send({
                        status: 200
                    });
            }
            catch (err) {
                // Return errors to caller
                let final_error = new Error(err);
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


