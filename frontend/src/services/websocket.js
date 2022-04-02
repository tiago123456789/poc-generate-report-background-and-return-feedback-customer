const { io } = require("socket.io-client");
let socket;

export default {

    disconnect() {
        socket.disconnect();
        socket = null;
    },

    init() {
        if (!socket) {
            console.log("create cliente")
            socket = io(process.env.REACT_APP_URL_SERVER);
        }
    },

    listen(event, callback) {
        socket.on(event, (data) => {
            callback(data);
        })
    }
}