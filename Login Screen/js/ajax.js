/*
 * Ajax call function
 * Parameters
 *   _url: The Service name to be called
 *   _parameter: The data to be passed to the service, null if no data is required to pass.
 * Return Value:
 *  Deferred object .
 */
var dataRecieved = 0;
function ajaxCall(_url, _parameter) {
    return $.Deferred(function (d) {
        var ajaxCall = $.ajax({
            type: "POST",
            url: $.session.get("URL") + _url,
            data: _parameter,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (data, textStatus, jqXHR) {
                dataRecieved += parseInt(ajaxCall.getResponseHeader('Content-Length'));
                d.resolve(data);
            },
            complete: function (jqXHR, textStatus) {
                if (jqXHR.status !== 200) {                    
                    insertIntoLogFile(_url, jqXHR.statusText);
                    d.reject(jqXHR.statusText);
                }
            }
        });
    });
}

function insertIntoLogFile(_serviceName, _errorMessage) {
//    if ($.session.get("LOGFILE") === "true") {
    window.logToFile.info('Service Name: ' + _serviceName + ' , Result: Error, Exception: ' + _errorMessage + "\n\n");
//    }
}
