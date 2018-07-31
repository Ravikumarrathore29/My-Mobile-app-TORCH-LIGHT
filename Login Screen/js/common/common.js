/*
 * Function to convert the Data from pipes format to JSON format
 * Parameters :
 *   _result: The pipe format data that is to be converted in to JSON.
 * Retrun Value:
 *   jsonFinalObject: The JSON Object  
 */

function getJsonObject(_result) {
    var jsonResultObject;
    var jsonFinalObject = new Array;
    if (_result === undefined || _result === null || _result === "") {
        return jsonResultObject;
    } else {
        if (_result == 'false' || _result == 'False' || _result == 'true' || _result == 'True') {
            jsonResultObject = _result;
        } else {
            var resultObjectarray = _result;
            var resultArray = resultObjectarray.split('#');
            var al = resultArray.length;
            var header = resultArray[0].split('|');
            var jsonArray = new Array();
            for (var j = 1; j < al - 1; j++) {
                var NEWArray = [];
                var rowvalue = resultArray[j].split('|');
                for (var i = 0; i < (header.length - 1); i++) {
                    var keyvalue = ('"' + header[i]) + '":"' + (rowvalue[i]) + '"';
                    NEWArray.push(keyvalue);

                }
                jsonArray.push("{" + NEWArray + "}");
            }
            for (var value in jsonArray) {

                jsonResultObject = JSON.parse(jsonArray[value]);
                jsonFinalObject.push(jsonResultObject);
            }
        }
    }
    return jsonFinalObject;

}

/*
 * Function to check weather the data is undefined ot null
 * Parameter:
 *  s: the data to be checked wheater undefined or null
 */
function isUndefinedNullOrEmpty(s) {
    return (s === undefined || s === null);
}


function ConvertIT(input) {
    var d = new Date(input);
    var a = d.getFullYear();
    var b = ("0" + (d.getMonth() + 1)).slice(-2);
    var c = ("0" + d.getDate()).slice(-2);
    var e = b + '/' + c + '/' + a;
    return e;
}

/*
 * Error message to be displayed if problem in database insertion or updation.
 * Parameter
 *  _message: Error message.
 */
function errorMessage(_message) {
    alert(_message);
}


function convertCanvasToImage(canvas) {
//    var image = new Image();
//    image.src = canvas.toDataURL("image/png");
    return canvas.toDataURL("image/png");
}

function generateSLNO() {
    var activityvar = '"' + Date.parse(new Date()) + '"';
    var activityID = activityvar.substring(3, 11);
    return activityID;
}

function getTimeNow() {
    var CDate = ConvertIT(new Date);
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;
    var suffix = "AM";
    if (hours >= 12) {
        suffix = "PM";
        hours = hours - 12;
    }
    if (hours == 0) {
        hours = 12;
    }
    var TimeNow = hours + ":" + minutes + ":00" + "  " + suffix;
    return CDate + " " + TimeNow;
}

