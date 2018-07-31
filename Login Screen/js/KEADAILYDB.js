

//Codes are written by Pradeep Shetty(Politron technology(P). Ltd).

var selectAllStatementD = "SELECT * FROM Dailyactivity";
var selectAllStatementE = "SELECT * FROM Dailyactivity ORDER BY activity_date_time DESC LIMIT 1";
var insertStatementD = "INSERT INTO Dailyactivity (activity_id,activity_date_time,period,activity_type,description,activity_end_date) VALUES (?,?,?,?,?,?)";
var db = openDatabase("KEAPRO", "1.0", "KEAPRO", 5 * 1024 * 1024);
var dataset;
var DataType;
var Password;
function initDatabase()  // Function Call When Page is ready.
{
    try {
        if (!window.openDatabase)  // Check browser is supported SQLite or not.
        {

            alert('Databases are not supported in this browser.');

        } else {

            // If supported then call Function for create table in SQLite

        }

    } catch (e) {

        if (e == 2) {

            console.log("Invalid database version.");

        } else {

            console.log("Unknown error " + e + ".");

        }

        return;

    }

}



function dropTable()
{
    db.transaction(function (tx) {
        tx.executeSql("DROP TABLE DOCTOR_INFO", [], Check, onError);
    });

    initDatabase();

}

function Check() {
}

function onError(tx, error) // Function for Hendeling Error...
{

}

$(document).ready(function () {
    initDatabase();
    // DisplayChemistNamelist(); 
    //  GET_COMMUNICATIONPAD();
    // $('.marquee').marquee();
//   14660695	04/12/2013	1	1		10/30/2014	P	N		
//14660742	04/12/2013	1	1		10/30/2014	P	N		
//14660757	04/12/2013	1	1		10/30/2014	P	N		


    //db.transaction(function (tx) { tx.executeSql('DELETE FROM Daily_Report WHERE report_id = ?', ["14660695"], Check, onError); });
    //Display All Master Information

    $("#required_UDOCTORSBrand").change(function () {
        DisplayKeyMaglist("required_UDOCTORSBrand");
    })
    $("#required_DOCTORSBrand").change(function () {
        DisplayKeyMaglist("required_DOCTORSBrand");
    })
});

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



