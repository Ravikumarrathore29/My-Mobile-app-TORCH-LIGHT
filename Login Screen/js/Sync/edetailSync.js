function edetailMasterSync() {
    GetEdetailContentsLocal();
    GetEdetailBrandMapping();
    GetESPECIALITY();
    GetEdetailFILETYPE();
    GetDetailingTo();
    GetGroups();
    GetFEEDBACKINFO();
}

function GetEdetailContentsLocal() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetEdetailContentsLocal";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
            } else if (_data === "") {
                progValue += 1;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processContent(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}
function processContent(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.CONTENT.ID + " FROM "
            + TABLES.CONTENT.TABLE + " WHERE "
            + TABLES.CONTENT.ID + "=?";
    var selectValues = new Array(_item["guidelineId"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.CONTENT.TABLE + " ( "
                    + TABLES.CONTENT.ID + ","
                    + TABLES.CONTENT.NAME + ","
                    + TABLES.CONTENT.FROM_DATE + ","
                    + TABLES.CONTENT.TO_DATE + ","
                    + TABLES.CONTENT.ENABLED + ","
                    + TABLES.CONTENT.DETALING_TO + ","
                    + TABLES.CONTENT.CONTENT + ","
                    + TABLES.CONTENT.GROUP_ID + ","
                    + TABLES.CONTENT.SYNCED + ","
                    + TABLES.CONTENT.FILE_TYPE_ID + ","
                    + TABLES.CONTENT.DELETED
                    + " ) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["Name"], _item["FromDate"],
                    _item["ToDate"], _item["Enabled"], _item["DetailingTo_Id"],
                    _item["CONTENT"], _item["Group_Id"], 0,
                    _item["FileType_Id"], _item["Deleted"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    progValue += 1;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {

                errorMessage(error.message.toString());
            });

        } else {
            if ((_item["Deleted"] == "1") || (_item["AssignRemove"] == "1")) {
                var deleteQuery = 'DELETE FROM ' + TABLES.CONTENT.TABLE + '  WHERE ' + TABLES.CONTENT.ID + '=? ';
                var deleteArray = new Array(_item["ID"]);
                $.when(dbObject.execute(deleteQuery, deleteArray)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else {
                var updateQuery = "UPDATE " + TABLES.CONTENT.TABLE + " SET "
                        + TABLES.CONTENT.NAME + "=?,"
                        + TABLES.CONTENT.FROM_DATE + "=?,"
                        + TABLES.CONTENT.TO_DATE + "=?,"
                        + TABLES.CONTENT.ENABLED + "=?,"
                        + TABLES.CONTENT.DETALING_TO + "=?,"
                        + TABLES.CONTENT.CONTENT + "=?,"
                        + TABLES.CONTENT.GROUP_ID + "=?,"

                        + TABLES.CONTENT.SYNCED + "=?,"
                        + TABLES.CONTENT.FILE_TYPE_ID
                        + "=? WHERE " + TABLES.CONTENT.ID + "=?";
                var updateQueryValues = new Array(_item["Name"], _item["FromDate"],
                        _item["ToDate"], _item["Enabled"], _item["DetailingTo_Id"],
                        _item["CONTENT"], _item["Group_Id"], 0,
                        _item["FileType_Id"], _item["ID"]);
                $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            }
        }
    }).fail(function (error) {

        errorMessage(error.message.toString());
    });


}



function GetEdetailBrandMapping() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetEdetailBrandMapping";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
                progValue += 1;
                progBar.setValue(progValue);
            } else if (_data === "") {
                progValue += 1;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processEBrandMap(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}
function processEBrandMap(_item, _index, _length) {

    var selectQuery = "SELECT " + TABLES.EBRANDMAP.ID + " FROM "
            + TABLES.EBRANDMAP.TABLE + " WHERE "
            + TABLES.EBRANDMAP.ID + "=?";
    var selectValues = new Array(_item["ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.EBRANDMAP.TABLE + " ( "
                    + TABLES.EBRANDMAP.ID + ","
                    + TABLES.EBRANDMAP.CONTENT_ID + ","
                    + TABLES.EBRANDMAP.BRAND_ID + ","
                    + TABLES.CONTENT.DELETED
                    + " ) VALUES (?,?,?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["Content_Id"], _item["Brand_Id"],
                    _item["Deleted"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    progValue += 1;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {

                errorMessage(error.message.toString());
            });

        } else {
            if ((_item["Deleted"] == "1")) {
                var deleteQuery = 'DELETE FROM ' + TABLES.EBRANDMAP.TABLE + '  WHERE ' + TABLES.EBRANDMAP.ID + '=? ';
                var deleteArray = new Array(_item["ID"]);
                $.when(dbObject.execute(deleteQuery, deleteArray)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else {
                var updateQuery = "UPDATE " + TABLES.EBRANDMAP.TABLE + " SET "
                        + TABLES.EBRANDMAP.CONTENT_ID + "=?,"
                        + TABLES.EBRANDMAP.BRAND_ID
                        + "=? WHERE " + TABLES.EBRANDMAP.ID + "=?";
                var updateQueryValues = new Array(_item["Content_Id"], _item["Brand_Id"], _item["ID"]);
                $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
//                    SYNCCONSTANTS.MARKETI = true;
                    }
                }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                    errorMessage(error.message.toString());
                });
            }
        }
    }).fail(function (error) {

        errorMessage(error.message.toString());
    });
}



function GetESPECIALITY() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetEdetailSpecialityMapping";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
                progValue += 1;
                progBar.setValue(progValue);
            } else if (_data === "") {
                progValue += 1;
                progBar.setValue(progValue);
//                SYNCCONSTANTS.MARKETI = true;
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processESpeciality(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}
function processESpeciality(_item, _index, _length) {
    var selectQuery = "SELECT " + TABLES.ESPECIALITY.ID + " FROM "
            + TABLES.ESPECIALITY.TABLE + " WHERE "
            + TABLES.ESPECIALITY.ID + "=? and " + TABLES.ESPECIALITY.CONTENT_ID + "=?";
    var selectValues = new Array(_item["ID"], _item["Content_Id"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.ESPECIALITY.TABLE + " ( "
                    + TABLES.ESPECIALITY.ID + ","
                    + TABLES.ESPECIALITY.CONTENT_ID + ","
                    + TABLES.ESPECIALITY.DELETED
                    + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["Content_Id"], _item["Deleted"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 1;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {

                errorMessage(error.message.toString());
            });

        } else {
            if ((_item["Deleted"] == "1")) {
                var deleteQuery = 'DELETE FROM ' + TABLES.ESPECIALITY.TABLE + '  WHERE ' + TABLES.ESPECIALITY.ID + '=? ';
                var deleteArray = new Array(_item["ID"]);
                $.when(dbObject.execute(deleteQuery, deleteArray)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            }
        }
    }).fail(function (error) {

        errorMessage(error.message.toString());
    });

}


function GetEdetailFILETYPE() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetEdetailFILETYPE";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
                progValue += 1;
                progBar.setValue(progValue);
            } else if (_data === "") {
//                SYNCCONSTANTS.MARKETI = true;
                progValue += 1;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processFileType(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}
function processFileType(_item, _index, _length) {
    var selectQuery = "SELECT * FROM " + TABLES.FILETYPE.TABLE + " WHERE " + TABLES.FILETYPE.ID + "=?";
    var selectValues = new Array(_item["ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.FILETYPE.TABLE + " ( "
                    + TABLES.FILETYPE.ID + ","
                    + TABLES.FILETYPE.NAME + ","
                    + TABLES.FILETYPE.DELETED
                    + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["Name"], _item["Deleted"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
//                    SYNCCONSTANTS.MARKETI = true;
                    progValue += 1;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {

                errorMessage(error.message.toString());
            });

        } else {
            if ((_item["Deleted"] == "1")) {
                var deleteQuery = 'DELETE FROM ' + TABLES.FILETYPE.TABLE + '  WHERE ' + TABLES.FILETYPE.ID + '=? ';
                var deleteArray = new Array(_item["ID"]);
                $.when(dbObject.execute(deleteQuery, deleteArray)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else {
                var updateQuery = "UPDATE " + TABLES.FILETYPE.TABLE + " SET "
                        + TABLES.FILETYPE.NAME
                        + "=? WHERE " + TABLES.FILETYPE.ID + "=?";
                var updateQueryValues = new Array(_item["Name"], _item["ID"]);
                $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                    errorMessage(error.message.toString());
                });
            }
        }
    }).fail(function (error) {

        errorMessage(error.message.toString());
    });


}

function GetDetailingTo() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetEdetailDetailingTo";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
                progValue += 1;
                progBar.setValue(progValue);
            } else if (_data === "") {
                progValue += 1;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processDetailingTo(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}
function processDetailingTo(_item, _index, _length) {
    var selectQuery = "SELECT * FROM " + TABLES.DETAILINGTO.TABLE + " WHERE " + TABLES.DETAILINGTO.ID + "=?";
    var selectValues = new Array(_item["ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.DETAILINGTO.TABLE + " ( "
                    + TABLES.DETAILINGTO.ID + ","
                    + TABLES.DETAILINGTO.NAME + ","
                    + TABLES.DETAILINGTO.DELETED
                    + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["Name"], _item["Deleted"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    progValue += 1;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {

                errorMessage(error.message.toString());
            });

        } else {
            if ((_item["Deleted"] == "1")) {
                var deleteQuery = 'DELETE FROM ' + TABLES.DETAILINGTO.TABLE + '  WHERE ' + TABLES.DETAILINGTO.ID + '=? ';
                var deleteArray = new Array(_item["ID"]);
                $.when(dbObject.execute(deleteQuery, deleteArray)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else {
                var updateQuery = "UPDATE " + TABLES.DETAILINGTO.TABLE + " SET "
                        + TABLES.DETAILINGTO.NAME
                        + "=? WHERE " + TABLES.DETAILINGTO.ID + "=?";
                var updateQueryValues = new Array(_item["Name"], _item["ID"]);
                $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                    errorMessage(error.message.toString());
                });
            }
        }
    }).fail(function (error) {

        errorMessage(error.message.toString());
    });
}

function GetGroups() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetEdetailGroups";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
                progValue += 1;
                progBar.setValue(progValue);
            } else if (_data === "") {
                progValue += 1;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processEGroup(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }

}
function processEGroup(_item, _index, _length) {
    var selectQuery = "SELECT * FROM " + TABLES.EGROUP.TABLE + " WHERE " + TABLES.EGROUP.ID + "=?";
    var selectValues = new Array(_item["ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.EGROUP.TABLE + " ( "
                    + TABLES.EGROUP.ID + ","
                    + TABLES.EGROUP.NAME + ","
                    + TABLES.EGROUP.DELETED
                    + " ) VALUES (?,?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["Name"], _item["Deleted"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    progValue += 1;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {

                errorMessage(error.message.toString());
            });

        } else {
            if ((_item["Deleted"] == "1")) {
                var deleteQuery = 'DELETE FROM ' + TABLES.EGROUP.TABLE + '  WHERE ' + TABLES.EGROUP.ID + '=? ';
                var deleteArray = new Array(_item["ID"]);
                $.when(dbObject.execute(deleteQuery, deleteArray)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else {
                var updateQuery = "UPDATE " + TABLES.EGROUP.TABLE + " SET "
                        + TABLES.EGROUP.NAME
                        + "=? WHERE " + TABLES.EGROUP.ID + "=?";
                var updateQueryValues = new Array(_item["Name"], _item["ID"]);
                $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                    if (_index === _length) {
                        progValue += 1;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                    errorMessage(error.message.toString());
                });
            }
        }
    }).fail(function (error) {

        errorMessage(error.message.toString());
    });


}

function  GetServerRecord(filepath, ContentID, fileType, NAME, _currentRecord, _dataLength) {

    var remoteFile = filepath;

    var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
   console.log("Path for file " + localFileName);

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        var entry = fileSystem.root;
        entry.getDirectory("KEAPRO_EDETAIL_DATA", {create: true, exclusive: false}, function (dirEntry) {
            dirEntry.getFile(localFileName, {create: true, exclusive: false}, function (fileEntry) {
                var localPath = fileEntry.toURL();
                if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                    localPath = localPath.substring(7);
                }


                var ft = new FileTransfer();
                ft.download(remoteFile,
                        localPath, function (entry) {

                            if (_currentRecord === _dataLength) {
                                alert("Edetail download has been completed");
                            }
                            if (fileType == 6) {
                                var htmlFileName = localFileName.split(".");
                                zip.unzip(entry.toURL(), dirEntry.toURL() + htmlFileName[0],
                                        /*success*/function () {
                                            //alert("Unzipped and assigned");
//                                        localStorage.setItem('fromedtail', true);
//                                        window.location.href = "file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html";
                                            //$('#EDetailhtmldes').load("file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html");
                                        },
                                        /*fail*/function (error) {
                                            //alert("Unzip failed: " + error.code);
//                                        localStorage.setItem('fromedtail', true);
//                                        window.location.href = "file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html";
                                            //$('#EDetailhtmldes').load("file:///data/data/com.VSM.KEA/files/files/KEA_EDETAIL_INFO/html5content/index.html");
                                        }
                                );
                                UpdateContent(dirEntry.toURL() + htmlFileName[0], ContentID);
                            } else {
                                UpdateContent(entry.toURL(), ContentID);
                            }

                        }, function () {
                    alert("Error while downloading the file please redownload");
                });
                ft.onprogress = function (progressEvent) {
                    if (progressEvent.lengthComputable) {
                        var downloadedPer = (progressEvent.loaded / progressEvent.total) * 100;
                        $('#' + ContentID).attr("aria-valuenow", downloadedPer + "%");
                        $('#' + ContentID).css('width', downloadedPer + "%");
//                        $('#' + ContentID).parent('.progress').find('.progress-completed').text(Math.round(downloadedPer) + "%");
                    }
                };
            }, fail);
        }, fail);
    }, fail);
}

function success(entry, ContentID) {
    UpdateContent(entry.toURL(), ContentID);

}

function fail(error) {
    console.log(error.toString());
}


function UpdateContent(Path, ContentID) {
    var updateQuery = 'UPDATE ' + TABLES.CONTENT.TABLE + ' SET ' +
            TABLES.CONTENT.LOCAL_FILE_PATH + '=?,' + TABLES.CONTENT.SYNCED +
            '=? WHERE ' + TABLES.CONTENT.ID + '=?';
    var updateArray = new Array(Path, 1, ContentID);
    $.when(dbObject.execute(updateQuery, updateArray)).done(function (data) {

    }).fail(function (error) {
        errorMessage(error.message.toString());
    });

}


function  CheckMasterRecordTOFileDownload() {

    db.transaction(function (tx) {

        tx.executeSql(" Select distinct " + TABLES.CONTENT.ID + "," + TABLES.CONTENT.CONTENT + "," + TABLES.CONTENT.FILE_TYPE_ID + "," + TABLES.CONTENT.NAME + " from " + TABLES.CONTENT.TABLE + " where " + TABLES.CONTENT.SYNCED + "=? and " + TABLES.CONTENT.ENABLED + "=?", [0, 1], function (tx, result) {

            dataset = result.rows;
            if (dataset.length > 0) {


                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    debugger;
                    GetServerRecord(item[TABLES.CONTENT.CONTENT], item[TABLES.CONTENT.ID], item[TABLES.CONTENT.FILE_TYPE_ID], item[TABLES.CONTENT.NAME], i, (dataset.length - 1));
                }
            } else {

            }


        });

    });
}



function onError(tx, error) {

    alert(error.message);

}
function GetFEEDBACKINFO() {
    var request = {EmployeeID: $.session.get("User_ID"), EffectiveDate: $.session.get("GACTIVITYDATE")};
    var jsondata = JSON.stringify(request);
    var serviceName = "GetFEEDBACKINFO";
    if (online) {
        $.when(ajaxCall(serviceName, jsondata)).done(function (_data) {
            if (isUndefinedNullOrEmpty(_data)) {
                progValue += 2;
                progBar.setValue(progValue);
            } else if (_data === "") {
                progValue += 2;
                progBar.setValue(progValue);
            } else {
                var jsonData = getJsonObject(_data);
                $.each(jsonData, function (index, item) {
                    processFeedbackInfo(item, index, (jsonData.length - 1));
                });
            }
        }).fail(function (error) {
            ajaxErrorCallBack(error);

        });
    }
}
function processFeedbackInfo(_item, _index, _length) {
    var selectQuery = "SELECT * FROM " + TABLES.FEEDBACKINFO.TABLE + " WHERE " + TABLES.FEEDBACKINFO.ID + "=?";
    var selectValues = new Array(_item["ID"]);
    $.when(dbObject.execute(selectQuery, selectValues)).done(function (data) {
        var resultSetLength = data.rows.length;
        if (resultSetLength === 0) {
            var insertQuery = "INSERT INTO " + TABLES.FEEDBACKINFO.TABLE + " ( "
                    + TABLES.FEEDBACKINFO.ID + ","
                    + TABLES.FEEDBACKINFO.NAME + ","
                    + TABLES.FEEDBACKINFO.RATING + ","
                    + TABLES.FEEDBACKINFO.DELETED
                    + " ) VALUES (?,?,?,?)";
            var insertQueryValues = new Array(_item["ID"], _item["Name"], _item["Rating"], _item["Deleted"]);

            $.when(dbObject.execute(insertQuery, insertQueryValues)).done(function (data) {
                if (_index === _length) {
                    progValue += 2;
                    progBar.setValue(progValue);
                }
            }).fail(function (error) {

                errorMessage(error.message.toString());
            });

        } else {
            if ((_item["Deleted"] == "1")) {
                var deleteQuery = 'DELETE FROM ' + TABLES.FEEDBACKINFO.TABLE + '  WHERE ' + TABLES.FEEDBACKINFO.ID + '=? ';
                var deleteArray = new Array(_item["ID"]);
                $.when(dbObject.execute(deleteQuery, deleteArray)).done(function (data) {
                    if (_index === _length) {
                        progValue += 2;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
                    errorMessage(error.message.toString());
                });
            } else {
                var updateQuery = "UPDATE " + TABLES.FEEDBACKINFO.TABLE + " SET "
                        + TABLES.FEEDBACKINFO.NAME
                        + "=? WHERE " + TABLES.FEEDBACKINFO.ID + "=?";
                var updateQueryValues = new Array(_item["Name"], _item["ID"]);
                $.when(dbObject.execute(updateQuery, updateQueryValues)).done(function (data) {
                    if (_index === _length) {
                        progValue += 2;
                        progBar.setValue(progValue);
                    }
                }).fail(function (error) {
//                SYNCCONSTANTS.MARKETI = false;
                    errorMessage(error.message.toString());
                });
            }
        }
    }).fail(function (error) {

        errorMessage(error.message.toString());
    });


}


//calling the wcf service for Call Scheduler informations
function GetCallPlan(DATE) {
    var request = {Employee_id: $.session.get("User_ID"), Date_Modified: DATE};
    var jsondata = JSON.stringify(request);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "GetCallPlan",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
              //  console.log("GetCallPlan result = " + result);
                var CALLPLAN;
                if (isUndefinedNullOrEmpty(result)) {
                } else if (result == "") {
                } else {
                    CALLPLAN = getJsonObject(result);
                    for (var CP in CALLPLAN)
                    {
                        InsertintoCallPlan($.trim(CALLPLAN[CP].CallPlanDate), $.trim(CALLPLAN[CP].Doctor_Sl_no));
                    }
                }
            },
            error: function (result) {
            }
        });
    }
}

//calling the wcf service for Call Scheduler Chemist informations
function GetCallPlanchemist(DATE) {
    var request = {Employee_id: $.session.get("User_ID"), Date_Modified: DATE};
    var jsondata = JSON.stringify(request);
  //  console.log("GetCallPlanchemist" + jsondata);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "GetCallPlanchemist",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
             //   console.log("GetCallPlanchemist result = " + result);
                var CALLPLAN;
                if (isUndefinedNullOrEmpty(result)) {
                } else if (result == "") {

                } else {
                    CALLPLAN = getJsonObject(result);
                    for (var CP in CALLPLAN)
                    {
                        InsertintoCallPlanchemist($.trim(CALLPLAN[CP].CallPlanDate), $.trim(CALLPLAN[CP].Chemist_ID));
                    }
                }
            },
            error: function (result) {
                console.log("Error from GetCallPlanchemist = " + result);
            }
        });
    }
}

//calling the wcf service for Call Scheduler Stockist informations
function GetCallPlanstockist(DATE) {
    var request = {Employee_id: $.session.get("User_ID"), Date_Modified: DATE};
    var jsondata = JSON.stringify(request);
   // console.log("GetCallPlanstockist " + jsondata);
    if (navigator.onLine) {
        $.ajax({
            type: "POST",
            url: $.session.get("URL") + "GetCallPlanstockist",
            data: jsondata,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            processdata: true,
            crossDomain: true,
            success: function (result) {
             //   console.log("GetCallPlanstockist result = " + result);
                var CALLPLAN;
                if (isUndefinedNullOrEmpty(result)) {
                } else if (result == "") {
                } else {
                    CALLPLAN = getJsonObject(result);
                    for (var CP in CALLPLAN)
                    {
                        InsertintoCallPlanstockist($.trim(CALLPLAN[CP].CallPlanDate), $.trim(CALLPLAN[CP].Stockist_ID));
                    }
                }
            },
            error: function (result) {
            }
        });
    }
}
// inserting the Call Scheduler informations into local db return by wcf .
function InsertintoCallPlan(DATE, DOCTOR_SLNO) {
  //  console.log("InsertintoCallPlan result = " + DATE + "   " + DOCTOR_SLNO);
    dbCon.transaction(function (tx) {
        tx.executeSql("Insert INTO " + TABLES.CALLPLAN.TABLE + " (" + TABLES.CALLPLAN.DCR_DOCTOR_SLNO + " ," + TABLES.CALLPLAN.DATE + ") VALUES (?,?)", [DOCTOR_SLNO, DATE], Check, onError);
    });
}
// inserting the Call Scheduler chemist informations into local db return by wcf .
function InsertintoCallPlanchemist(DATE, Chemist_ID) {
   // console.log("InsertintoCallPlanchemist result = " + DATE + "   " + Chemist_ID);
    dbCon.transaction(function (tx) {
        tx.executeSql("Insert INTO " + TABLES.CALLPLANCHEMIST.TABLE + " (" + TABLES.CALLPLANCHEMIST.CHEMIST_SLNO + "," + TABLES.CALLPLANCHEMIST.DATE + ") VALUES (?,?)", [Chemist_ID, DATE], Check, onError);
    });
}
// inserting the Call Scheduler stockist informations into local db return by wcf .
function InsertintoCallPlanstockist(DATE, Stockist_ID) {
  //  console.log("InsertintoCallPlanchemist result = " + DATE + "   " + Stockist_ID);
    dbCon.transaction(function (tx) {
        tx.executeSql("Insert INTO " + TABLES.CALLPLANSTOCKIST.TABLE + " (" + TABLES.CALLPLANSTOCKIST.STOCKIST_SLNO + "," + TABLES.CALLPLANSTOCKIST.DATE + ") VALUES (?,?)", [Stockist_ID, DATE], Check, onError);
    });
}

function Check() {
}

function SHOWCALLPLAN() {
   
    dbCon.transaction(function (tx) {
        tx.executeSql("SELECT * FROM CALL_PLAN C INNER JOIN doctor_info D ON D.doctor_sl_no=C.DCRDOCTOR_SLNO INNER JOIN market_area M ON M.market_area_id=D.market_area_id ORDER BY   C.DATE ASC ", [], function (tx, result) {
            dataset = result.rows;
         //   console.log(dataset);
            $("#CALLPLANWEEKCLID").empty();
            var dd = $("#CALLPLANWEEKCLID");
            var nid = 1;
            var DIVID = "";
            var oldtable = "";
            var ADAte = "";
            if (dataset.length > 0) {
              //  console.log(" FIRST ");
                for (var i = 0, item = null; i < dataset.length; i++) {
                    item = dataset.item(i);
                    if (ADAte == ConvertIT(item["DATE"])) {
                   //    console.log(" second ");
                        var tableID = "NEWCLTBID" + nid;
                        $("#" + oldtable).after('<table style="width:100% ;margin-bottom: 20px;"data-role="table" id=' + tableID + ' data-mode="Refresh" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-popup-theme="a"  ><thead><tr class="ui-bar-a"><th style="width:98%" colspan="2">' + item["name"] + ' </th></tr></thead><tbody>' +
                                '<tr><td style="width:35px;">SL.NO</td> <td style="width:63px;"> ' + item["DCRDOCTOR_SLNO"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Name</td> <td style="width:63px;"> ' + item["name"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Spciality</td> <td style="width:63px;"> ' + item["speciality_id"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Classification</td> <td style="width:63px;"> ' + item["classification"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Location</td> <td style="width:63px;"> ' + item["market_area"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Phone No.</td> <td style="width:63px;"> ' + item["mobile_no"] + '</td> </tr>' +
                                '</tbody></table>');
                        nid++;
                        $("#" + tableID).table();
                        $("#" + tableID).table("refresh");
                        oldtable = tableID;
                    } else {
                       // console.log(" Third ");
                        ADAte = item["DATE"];
                        DIVID = "NEWDIVDATEID" + nid;
                        var tableID = "NEWCLTBID" + nid;
                        oldtable = tableID;
                        dd.append('<div data-role="collapsible" data-theme="f"  id=' + DIVID + ' data-content-theme="d" data-inset="false" style="width: 100%; margin-bottom: 20px;"><h3>' + getFormattedDate(item["DATE"]) + '</h3>' +
                                '<table style="width:100% ;margin-bottom: 20px;"data-role="table" id=' + tableID + ' data-mode="Refresh" class="ui-body-d ui-shadow table-stripe ui-responsive" data-column-popup-theme="a"  ><thead><tr class="ui-bar-a"><th style="width:96%" colspan="2">' + item["name"] + ' </th></tr></thead><tbody>' +
                                '<tr><td style="width:35px;">SL.NO</td> <td style="width:63px;"> ' + item["DCRDOCTOR_SLNO"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Name</td> <td style="width:63px;"> ' + item["name"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Spciality</td> <td style="width:63px;"> ' + item["speciality_id"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Classification</td> <td style="width:63px;"> ' + item["classification"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Location</td> <td style="width:63px;"> ' + item["market_area"] + '</td> </tr>' +
                                '<tr><td style="width:35px;">Phone No.</td> <td style="width:63px;"> ' + item["mobile_no"] + '</td> </tr>' +
                                '</tbody></table></div>');
                        nid++;
                        $("#" + tableID).table();
                        $("#" + tableID).table("refresh");
                    }
//pa  
                    $("#CALLPLANWEEKCLID").collapsibleset();
                    $("#CALLPLANWEEKCLID").collapsibleset('refresh');
                }
            } else {
              //  console.log("Something wrong in sql query plz check it ");
            }
        });
    });
}

function getFormattedDate(input) {
    var pattern = /(.*?)\/(.*?)\/(.*?)$/;
    var result = input.replace(pattern, function (match, p1, p2, p3) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (p2 < 10 ? "0" + p2 : p2).slice(-2) + "-" + months[(p1 - 1)] + "-" + p3;
    });
    return result;
}