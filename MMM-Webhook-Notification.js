
Module.register('MMM-Webhook-Notification', {

    /**
     * Module config defaults
     */
    defaults: {
        status : "",
        timeout : 5000,
        position : "tc",
        width : "500px",
        icon : "",
        speed : 500,
        size : "16px",
        effect : ""
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
        return ["SnackBar.js"];
    },

    // getTemplate(type) {
    //     return `templates/${type}.njk`;
    // },

    getStyles: function () {
        return ['MMM-Webhook-Notification.css', "font-awesome.css", "https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css", this.file(`./styles/SnackBar.css`)];
    },
    
    getDom: function() {
        const wrapper = document.createElement("ticker");
        wrapper.className = "dimmed small";
        return wrapper;
    },

    async showSnackBar(notification) {
        new SnackBar({
            message: notification.message,
            status: notification.status,
            timeout: notification.timeout,
            position: notification.position,
            width: notification.width,
            icon: notification.icon,
            speed: notification.speed,
            size: notification.size,
            effect: notification.effect
        });
    },
    /**
     * @param {String}  notification
     * @param {Object}  payload
     */
    socketNotificationReceived: function (notification, payload) {
        if (notification === 'WEBHOOK_SNACKBAR') {
            this.showSnackBar(payload);
        }
    },
});
