# MMM-Webhook-Notification

## Module installation

Clone the module and npm install:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/eigger/MMM-Webhook-Notification.git
cd MMM-Webhook-Notification
npm install
```

Add the module config to `~/MagicMirror/config/config.js`

```javascript
modules: [
    {
        module: 'MMM-Webhook-Notification',        
        position: 'fullscreen_above',
        config: {
            fadeSpeed: 30,
		    displayMiliseconds:5000,  
        }
    }
]
```



# Sending WebHook Notifcations

Once you have configured your router/reverse proxy to route HTTP POST traffic to your Magic Mirror, you can send any HTTP POST messages using the url http://magic mirror url:8080/webhook?

You can use CURL for testing.

```bash
curl -X POST -H "Content-Type: application/json" \
    -d '{"message": "hello world!"}' \
    "http://magic mirror url:8080/webhook?"
```

