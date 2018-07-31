var dbObject = new dbAccess();
$(function () {
    initData();
    assignEvents();
});

function initData() {
    displayAdddedCustomerCounts();
}

function displayAdddedCustomerCounts() {
    displayAddedDoctorCount();
    displayAddedChemistCount();
    displayAddedStockistCount();
}

function assignEvents() {
    $('.Added').click(function () {
        $.session.set('customerType', $(this).attr('id'));
        document.location = "AddedCustomers.html";
    });

}

function displayAddedDoctorCount() {    
    var selectQuery = "Select Count(" + TABLES.DCR_DOCTOR.DCR_DOCTOR_SL_NO + ") as DoctorCount FROM " + TABLES.DCR_DOCTOR.TABLE + " WHERE " + TABLES.DCR_DOCTOR.DCR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var dataRows = data.rows.length;
        if (dataRows > 0) {
            var item = data.rows.item(0);
            $('#D').text(item["DoctorCount"]);
        }
    });
}

function displayAddedChemistCount() {
    var selectQuery = "Select Count(" + TABLES.DCR_CHEMIST.CHEMIST_ID + ") as chemistCount FROM " + TABLES.DCR_CHEMIST.TABLE + " WHERE " + TABLES.DCR_CHEMIST.DCR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var dataRows = data.rows.length;
        if (dataRows > 0) {
            var item = data.rows.item(0);
            $('#C').text(item["chemistCount"]);
        }
    });
}

function displayAddedStockistCount() {
    var selectQuery = "Select Count(" + TABLES.DCR_STOCKIST.DCR_STOCK_ID + ") as StockistCount FROM " + TABLES.DCR_STOCKIST.TABLE + " WHERE " + TABLES.DCR_STOCKIST.DCR_SL_NO + "=?";
    var selectValues = new Array($.session.get("ActivityId"));
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var dataRows = data.rows.length;
        if (dataRows > 0) {
            var item = data.rows.item(0);
            $('#S').text(item["StockistCount"]);
        }
    });
}