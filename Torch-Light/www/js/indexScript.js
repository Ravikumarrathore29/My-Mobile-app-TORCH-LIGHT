var app = {
// Application Constructor
//receivedEvent(): This function is used to handle the deviceready event.
    initialize: function () {
        this.bindEvents();
    },
//    bindEvent(): This is a bind event listener that binds events such as load, deviceready, offline, etc, which are required on start up. 
//            In the above code, this function is listening for the ‘deviceready’ event.
//            Once the device is ready, it makes a call to onDeviceReady().
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
//    
//    onDeviceReady(): This is a ‘deviceready’ event handler; in this function, we make an explicit call to app.receivedEvent(), which specifies the device is ready. 
//            We have added the plugin code to turn on the flashlight of the mobile’s camera in this function.
//            We have added a click event listener to an element whose ID is ‘torch’, which means that when we click that element, the window.plugins.flashlight.toggle() function is called.
//            In simple words, it toggles the flashlight on/off, when we click the element.

    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        document.getElementById("torch").addEventListener("click", function () {
            window.plugins.flashlight.available(function (isAvailable) {
                if (isAvailable) {
                    // if flash light is available then this function is called
                    window.plugins.flashlight.toggle();
                } else {
                    // if flash light is not available then alert message will appear
                    alert("Flashlight not available on this device");
                }
            });
        });

// on exit of app message will appaear and flaslight will swithc off
        document.getElementById("exit").addEventListener("click", function () {
            alert("Thankyou for Using this App .");
            // pass exitApp as callbacks to the switchOff method
            window.plugins.flashlight.switchOff(exitApp, exitApp);
        }, false);

    },
//receivedEvent(): This function is used to handle the deviceready event.
    receivedEvent: function (id) {
        console.log(id);
    }
};
//initialize(): This is a default application constructor. It makes a call to bindEvent() when the application starts up.
app.initialize();

function exitApp() {
    navigator.app.exitApp();
}
