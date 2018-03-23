/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$('#toggleLights').on('click', function(e) {
  $("body").toggleClass('lights-is-active');
});


$(function () {

    $(".col-toggle input").on("change", function () {
        var that = $(this);
        if (that.prop("checked")) {
            that.parent().addClass("active");
        } else {
            that.parent().removeClass("active");
        }
        
        
        
        
        window.plugins.flashlight.toggle(
  function() {}, // optional success callback
  function() {}, // optional error callback
  {intensity: 0.3} // optional as well, used on iOS when switching on
);

    }).trigger("change");

$("#leaveApp").on("click", function () {
    document.addEventListener("backbutton", function() {
  // pass exitApp as callbacks to the switchOff method
  window.plugins.flashlight.switchOff(exitApp, exitApp);
}, false);

function exitApp() {
  navigator.app.exitApp();
}
});



});