
Module.register('MMM-Webhook-Notification', {

    /**
     * Module config defaults
     */
    defaults: {
        displayMiliseconds: 10,
        fadeSpeed: 30,
        title: "Notification",
        effect: "slide-center", // scale|slide-center|slide-left|side-right|genie|jelly|flip|bouncyflip|exploader
        size: "20px",
        color: "white"
    },

    /**
     * @var {Object}
     */
    currentNotification: null,

    /**
     * @var {Integer}
     */
    currentTimeout: null,

    /**
     * Starting of the module
     */
    start: function () {
        Log.info('[' + this.name + '] Starting');
        this.sendSocketNotification('START', this.config);
    },

    getScripts() {
        return ["notificationFx.js"];
    },

    getStyles: function () {
        return ['MMM-Webhook-Notification.css', "font-awesome.css", this.file(`./styles/notificationFx.css`)];
    },

    async showNotification(notification) {
        new NotificationFx({
            title: notification.title,
            message: notification.message,
            layout: "growl",
            effect: notification.effect,
            ttl: notification.timer,
            size: notification.size,
            color: notification.color
        }).show();
    },

    /**
     * @param {String}  notification
     * @param {Object}  payload
     */
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'WEBHOOK_NOTIFICATION') {
            // this.currentNotification = payload;
            // this.updateDom(fadeSpeed);
            //this.sendNotification('SCREEN_WAKEUP', true);
            this.showNotification({ title: payload.title, message: payload.message, timer: payload.displayMiliseconds, effect: payload.effect, size: payload.size, color: payload.color });
        }
    },

    hideAlert(sender, close = true) {
        // Dismiss alert and remove from this.alerts
        if (this.alerts[sender.name]) {
            this.alerts[sender.name].dismiss(close);
            delete this.alerts[sender.name];
            // Remove overlay
            if (!Object.keys(this.alerts).length) {
                this.toggleBlur(false);
            }
        }
    },

    toggleBlur(add = false) {
        const method = add ? "add" : "remove";
        const modules = document.querySelectorAll(".module");
        for (const module of modules) {
            module.classList[method]("alert-blur");
        }
    },

    // /**
    //  * @returns {*}
    //  */
    getDom: function () {
        return null;
    }
});
