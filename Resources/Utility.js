var CommonSetting = {
    imageBaseUrl: '/Widgets/_Resources/Images/',
    graphicsUrl: '//gs1.wpc.edgecastcdn.net/80289E/media/2/IMAGES/'
};
Array.prototype.IndexOf = function (searchStr) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === searchStr) {
            return i;
        }
    }
    return -1;
};
Array.prototype.Contains = function (searchStr) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == searchStr) {
            return true;
        }
    }
    return false;
};
Array.prototype.Clear = function () {
    if (typeof this == Array) {
        while (this.length > 0) {
            this.pop();
        }
    }
};
// ToDo: confirm following two methods
Array.prototype.Dedupe = function () {
    var result = [];
    $.each(this, function (i, e) {
        if (e && e.length && $.inArray(e, result) == -1) result.push(e);
    });
    // ToDo: change method signature
    return result;
}
// pass multiple arrays as arguments, eg. arr1.Intersection(arr2, arr3, arr4...) will return intersection of {arr1, arr2, arr3, arr4...}
Array.prototype.Intersection = function () {
    var result = [];
    if (typeof this == Array) {
        var arrays = [this];
        for (var i = 0; i < arguments.length; i++) {
            var thisArg = arguments[i];
            if (typeof thisArg == Array) {
                arrays.push(thisArg);
            }
        }
        result = arrays.shift().filter(function (v) {
            return arrays.every(function (a) {
                return a.indexOf(v) !== -1;
            });
        });
    }
    return result;
}

var TravelHelper = {
    deserialize: function (str) {
        if (str == null || str == "")
            return null;
        return Sys.Serialization.JavaScriptSerializer.deserialize(str);
    },

    serialize: function (obj) {
        if (obj == null)
            return null;
        return Sys.Serialization.JavaScriptSerializer.serialize(obj);
    },

    dateInJson: function (value) {
        if (typeof value === 'string') {
            var isDate = /Date\(([-+]?\d+[-+]?\d+)\)/.exec(value);
            if (isDate) {
                value = new Date(eval(isDate[1]));
            }
        }
        return value;
    },

    dateDiffInDays: function (d1, d2) {
        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24;
        var date1 = new Date(d1);
        var date2 = new Date(d2);
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms);

        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY);
    },

    formatDate: function (date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return month + '/' + day + '/' + year;
    },

    template: function () {
        var svcUrl = '/Services/HelperServices/TemplateService.svc';
        return {
            setSvcUrl: function (url) {
                svcUrl = url;
            },
            get: function () {
                var url = svcUrl + "/GetTemplate?t=" + arguments[0];

                var callback;
                if (typeof arguments[1] == "boolean" && arguments[1] == true) {
                    url = url + "&local=true";
                    callback = arguments[2];
                } else
                    callback = arguments[2];
                $.getJSON(url, function (data) { // response = > { name : 'templateName', template:'template'}
                    if (typeof callback == "function")
                        callback(data);
                });
            },
            getGroup: function () {
                var url = svcUrl + "/GetGroupTemplate?t=" + arguments[0];

                var callback;
                if (typeof arguments[1] == "boolean" && arguments[1] == true) {
                    url = url + "&local=true";
                    callback = arguments[2];
                } else
                    callback = arguments[1];
                $.getJSON(url, function (data) { // response = > [{ name : 'templateName', template:'template'}]
                    if (typeof callback == "function")
                        callback(data);
                });
            },
            getList: function () {
                var url = svcUrl + "/GetTemplates";
                var callback;
                if (typeof arguments[1] == "boolean") {
                    if (arguments[1] == true)
                        url = url + "?local=true";
                    callback = arguments[2];
                } else
                    callback = arguments[1];
                TravelHelper.ajax.post(url, arguments[0], function (data) {
                    if (typeof callback == "function")
                        callback(data);
                });
            }
        };
    } (),

    Template: function (templateList, afterLoadCallback) {
        var _tmpl = {}, _isInit = false, _compileTmpl = {};
        var _this = this;
        var initilize = function () {
            TravelHelper.template.getList(templateList, false, $.proxy(onTemplLoad, _this));
        };
        var onTemplLoad = function (lst) {
            $.each(lst, function (index, val) {
                _tmpl[val.Name] = val.Template;
            });
            _isInit = true;
            if ($.isFunction(afterLoadCallback)) {
                afterLoadCallback();
            }
        };
        initilize();
        return {
            get: function (tname) {
                return _tmpl[tname];
            },
            isInit: function () {
                return _isInit;
            },
            getCompile: function (tname) {
                if (typeof _compileTmpl[tname] === "undefined")
                    _compileTmpl[tname] = Handlebars.compile(_tmpl[tname]);
                return _compileTmpl[tname];
            }
        };
    },

    ajax: {
        lstAjaxCall: [],
        getVersionUrl: function (url) {

            if (SiteContext != undefined && SiteContext.ScriptVersion != undefined) {
                if (url.indexOf('?') >= 0)
                    url = url + "&sver=" + SiteContext.ScriptVersion;
                else
                    url = url + "?sver=" + SiteContext.ScriptVersion;
            }
            return url;
        },
        get: function (url, onSuccess, onFailed) {
            var ac = $.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getVersionUrl(url),
                data: null,
                dataType: 'json',
                processData: false,
                success: function (res) {
                    if (typeof onSuccess == "function")
                        onSuccess(res);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof onFailed == "function")
                        onFailed(XMLHttpRequest, textStatus, errorThrown);
                }
            });
            this.lstAjaxCall.push(ac);
        },
        getJsonp: function (url, onSuccess, onFailed) {
            var ac = $.ajax({
                type: "GET",
                contentType: "application/json",
                url: this.getVersionUrl(url),
                data: null,
                dataType: 'jsonp',
                processData: false,
                success: function (res) {
                    if (typeof onSuccess == "function")
                        onSuccess(res);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof onFailed == "function")
                        onFailed(XMLHttpRequest, textStatus, errorThrown);
                }
            });
            this.lstAjaxCall.push(ac);  
        },
        post: function (url, data, onSuccess, onFailed) {
            var pData = null;
            if (data != null)
                pData = TravelHelper.serialize(data);
            var ac = $.ajax({
                type: "POST",
                contentType: "application/json",
                url: this.getVersionUrl(url),
                data: pData,
                dataType: 'json',
                processData: false,
                success: function (res) {
                    if (typeof onSuccess == "function")
                        onSuccess(res);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof onFailed == "function")
                        onFailed(XMLHttpRequest, textStatus, errorThrown);
                }
            });
            this.lstAjaxCall.push(ac);
        },
        stop: function () {
            if (this.lstAjaxCall.length > 0) {
                try {
                    for (var cnt = 0; cnt < this.lstAjaxCall.length; cnt++) {
                        this.lstAjaxCall[cnt].abort();
                    }
                } catch (e) {
                }
            }
        },
        getXML: function (url, onSuccess, onFailed) {
            var ac = $.ajax({
                type: "GET",
                contentType: "application/xml",
                url: url,
                data: null,
                cache: false,
                processData: false,
                success: function (res) {
                    if (typeof onSuccess == "function")
                        onSuccess(res);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof onFailed == "function")
                        onFailed(XMLHttpRequest, textStatus, errorThrown);
                }
            });
            this.lstAjaxCall.push(ac);
        }
    }
};

function hideDiv(id) {
    $("#" + id).hide();
    return;
}

function showDiv(id) {
    $("#" + id).show();
    return;
}
function validateYear(source, arguments) {
    if (arguments.Value == "yyyy")
        arguments.IsValid = false;
}
function validateMonth(source, arguments) {
    if (arguments.Value == "mm")
        arguments.IsValid = false;
}
function toggleVisibility(div) {
    if ($("#" + div).css("display") == "none")
        $("#" + div).show();
    else
        $("#" + div).hide();
}
function hideDivByName(parentDivId, id) {
    if (document.getElementsByName(id) != null) {
        var div = new Array();
        div = document.getElementById(parentDivId).getElementsByTagName('div');
        for (var i = 0; i < div.length; i++) {
            if (div.item(i).getAttribute('name') == id) {

                div.item(i).style.display = "none";
                div.item(i).style.visibility = "hidden";
            }
        }
    }
    return;
}

function showDivByName(parentDivId, id) {
    if (document.getElementsByName(id) != null) {
        var div = new Array();
        div = document.getElementById(parentDivId).getElementsByTagName('div');
        for (var i = 0; i < div.length; i++) {
            if (div.item(i).getAttribute('name') == id) {
                div.item(i).style.display = "block";
                div.item(i).style.visibility = "visible";
            }
        }
    }
    return;
}

function checkDate(month, day, year) {
    if (month == null || day == null || year == null || month == "" || day == "" || year == "")
        return false;

    var dayPattern = new RegExp("^[0-3]{0,1}[0-9]$");
    var monthPattern = new RegExp("0?[1-9]|(1[012])");
    var yearPattern = new RegExp("19|20[0-9]{2}");

    if (!month.match(monthPattern) || !day.match(dayPattern) || !year.match(yearPattern))
        return false;

    var inputDate;
    month = month - 1;
    inputDate = new Date(year, month, day);

    return ((day == inputDate.getDate())
			 && (month == inputDate.getMonth())
			 && (year == inputDate.getFullYear()));

}

//takes the date in the format mm/dd/yyyy
function validateDate(dateString) {
    var dateArray = dateString.split("/", 3);
    return checkDate(dateArray[0], dateArray[1], dateArray[2]);
}

function empty() { return; }

function toggleDiv(id) {

    var divToToggle = document.getElementById(id);
    if (divToToggle == null)
        return;

    if (divToToggle.style.visibility == 'hidden') {
        divToToggle.style.visibility = 'visible';
        divToToggle.style.display = '';
    }
    else {
        divToToggle.style.visibility = 'hidden';
        divToToggle.style.display = 'none';
    }

    return;
}
function showSectionDiv(divid, section) {
    var ypos = document.getElementById(section).offsetTop;
    var xpos = 0;
    showDivAt(divid, xpos, ypos);
    return;
}

//x position changed
function showSectionDiv1(divid, section) {
    var ypos = document.getElementById(section).offsetTop;
    var xpos = 500;
    showDivAt(divid, xpos, ypos);
    return;
}


function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}

function SetSelection(id, value) {
    if (document.getElementById(id) != null)
        document.getElementById(id).value = value;
    //alert(id)
    //alert(value);
}


/*handling Water Mark for date text boxes */
function OnFocus(elementId, defaultText) {
    if (document.getElementById(elementId).value == defaultText) {
        document.getElementById(elementId).className = "normal";
        document.getElementById(elementId).value = "";
    }
}
function OnBlur(elementId, defaultText) {
    var textValue = document.getElementById(elementId).value;

    if (textValue == defaultText || textValue.length == 0) {
        document.getElementById(elementId).className = "watermark";
        document.getElementById(elementId).value = defaultText;
    }
    else
        document.getElementById(elementId).className = "normal";
}

function OpenPopupWindow(url) {
    popWindow = window.open(url, 'mywindow', 'height=850,width=1050,resizable=yes,scrollbars=yes,menubar=yes,toolbar=yes,location=yes');
    // return false;
}



function hasOptions(obj) {
    if (obj != null && obj.options != null) { return true; }
    return false;
}


function sortSelect(obj) {
    var o = new Array();
    if (!hasOptions(obj)) { return; }
    for (var i = 0; i < obj.options.length; i++) {
        o[o.length] = new Option(obj.options[i].text, obj.options[i].value, obj.options[i].defaultSelected, obj.options[i].selected);
    }
    if (o.length == 0) { return; }
    o = o.sort(
		function (a, b) {
		    if ((a.text + "") < (b.text + "")) { return -1; }
		    if ((a.text + "") > (b.text + "")) { return 1; }
		    return 0;
		}
		);

    for (i = 0; i < o.length; i++) {
        obj.options[i] = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);
    }
}



/****Tab script start**************************************************************************************************/



function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    var cookieContent = name + "=" + value + expires + "; path=/";
    document.cookie = cookieContent;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


//**************************************************************************************************

function ToggleProfileAddressType(ddlId, divStdAddr, divMltAddr) {
    var ddlEle = $get(ddlId);  ///$("#" + ddlId);
    if (ddlEle != null) {
        if (ddlEle.value == 'Military') {
            showDiv(divMltAddr);
            hideDiv(divStdAddr);
        }
        else {
            hideDiv(divMltAddr);
            showDiv(divStdAddr);
        }
    }
}

function hideDiv(id) {

    if ($("#" + id) != null) {
        $("#" + id).hide();
        $("#" + id).css("visibility", "hidden");
    }
    return;
}

function showDiv(id) {
    if ($("#" + id) != null) {
        $("#" + id).show();
        $("#" + id).css("visibility", "visible");
    }

    return;
}

//Toggle status of all child validator controls in the control tree
function toggleAllChildValidators(status, control) {
    if (control == null)
        return;

    //check if the control is a validation control
    if (control.controltovalidate != null) {
        ValidatorEnable(control, status);
    }

    for (var i = 0; i < control.childNodes.length; i++) {
        toggleAllChildValidators(status, control.childNodes[i]);
    }
}
var hotelSearch = function (location, checkIn, checkOut, hotelName, guestCnt, starRating) {
    this.location = location;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.guestCount = guestCnt;
    this.hotelName = hotelName;
    this.starRating = starRating;
};

//Air Filter Criteria Object for Interwidget Communication
function AirFilterCriteria() {
    var Val = function () {
        this.Min = 0;
        this.Max = 0;
        this.Value = [];
        this.MinDate = null;
        this.MaxDate = null;
    }
    var FT = function () {
        this.EnableTakeOffTime = null;
        this.EnableLandingTime = null;
        this.TakeOffTime = new Val();
        this.LandingTime = new Val();
    }

    var Stop = function () {
        this.Disabled = null;
        this.Active = null;
        this.LowestFare = null;
    }

    this.CMF = function () {
        this.Checked = false;
        this.Company = new (function () {
            this.Code = '';
            this.ShortName = '';
            this.FullName = '';
        });
        this.MinFare = new (function () {
            this.Amount = 0;
            this.DisplayValue = '';
        });
    }
    this.DispCurr = '$';
    this.Stops = new Object();
    this.Stops.NonStop = new Stop();
    this.Stops.OneStop = new Stop();
    this.Stops.TwoPlusStops = new Stop();

    this.ShowAllAirLines = true;
    this.AirLines = [];

    this.airLineClassOfService = [];
    this.ShowAllClassOfService = true;

    this.TripDuration = new Val();
    this.Price = new Val();
    this.FlightTimes =
                {
                    EnableReturn: null,
                    Depart: new FT(),
                    Return: new FT()
                };
}

function HotelFilterCriteria() {
    var _price = function () {
        this.min = 0;
        this.max = 1;
        this.value = [];
        this.DispCurr = '$';
    };

    var _initialPriceFilter = function () {
        this.min = 0;
        this.max = 1;
        this.value = [];
        this.DispCurr = '$';
    };

    var _distance = function () {
        this.min = 0;
        this.max = 0;
        this.value = [];
    };

    var nameVal = function () {
        this.name = "";
        this.minVal = 0;
    };

    this.price = new _price();
    this.distance = new _distance();
    this.initialPriceFilter = new _initialPriceFilter();
    this.occupancy = null;
    this.bedroom = null;
    this.fareType = {
        prepaid: 1,
        postpaid: 1,
        enablePrepaid: 1,
        enablePostpaid: 1
    };
    this.hotelName = "";
    this.amenities = [];
    this.hotelBrand = [];
    this.starRating = [];
    this.priceAvailOnly = false;
}

function TripsFilterValues() {
    var valClass = function() {
        this.eleId = '';
        this.eleVal = '';
    };

    this.tripName = new valClass();
    this.startDate = new valClass();
    this.endDate = new valClass();
    this.locator = new valClass();
    this.travName = new valClass();
}

function ActivityFilterCriteria() {
    var val = function () {
        this.min = 0;
        this.max = 1;
        this.value = [];
    };

    var nameVal = function () {
        this.name = "";
        this.minVal = 0;
    };

    this.price = new val();

    this.category = new nameVal();

    this.activityName = "";

}

function TripsFilterValues() {
    var valClass = function() {
        this.eleId = '';
        this.eleVal = '';
    };

    this.tripName = new valClass();
    this.startDate = new valClass();
    this.endDate = new valClass();
    this.locator = new valClass();
    this.travName = new valClass();
}
function SwitchIt(id) {
    $("#" + id).show();
}
//Great Escape
function mhov(o) {
    if (crObj(o))
        crObj(o).textDecoration = 'underline';
}
function mout(o) {
    if (crObj(o))
        crObj(o).style.textDecoration = 'none';
}
function hide_map_div(id) { $("#" + id).hide(); }


var messagingService = new function () {
    var servicePath;
    var siteId;
    return {
        init: function(svcPath, sId) {
            servicePath = svcPath;
            siteId = sId;
        },
        removeMessage: function() {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: servicePath + "/removeMessage/" + siteId,
                processData: false,
                cache: false,
                success: function(result) {
                    if (result == '') {
                        return false;
                    }
                    return result;
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    return false;
                }
            });
        },
        addMessage: function(message) {
            $.ajax(
                {
                    type: "POST",
                    contentType: "application/json",
                    url: servicePath + "/addMessage/" + siteId,
                    data: Sys.Serialization.JavaScriptSerializer.serialize(message),
                    processData: false,
                    cache: false,
                    success: function(result) {
                        if (result == '') {
                            return false;
                        }
                        return true;
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        return false;
                    }
                });
        }
    };
} ();

function HideShowView(hideDivId, showDivId) {

    var hideDiv = document.getElementById(hideDivId.toString());
    hideDiv.style.display = 'none';

    $("#" + showDivId).slideDown('fast');
}
function validateAlphanumeric(txtBoxId) {
    var txtBoxEle = document.getElementById(txtBoxId);
    if (txtBoxEle != null) {
        var check = "\"[a-zA-Z0-9]*?\""
        var temp = "\"" + txtBoxEle.value + "\"";
        txtBoxEle.value = txtBoxEle.value.replace('\"', '');
        var match = temp.match(check);
        if (match == null) {
            txtBoxEle.value = txtBoxEle.value.replace(/[^a-zA-Z0-9]+/g, '');
            return false;
        }
    }
}
function OpenFullWindow(url) {    
    var windowFeatures = "scrollbars=yes,top=0,left=0,resizable=yes,width=" + (screen.width) + ",height=" + (screen.height);
    var win = window.open(url, '', windowFeatures);
}

function OpenWindow(url, windowname, w, h) {    
    var setvalues = 'height=' + h + ',width=' + w + ',top=50,left=100,scrollbars=yes,resizable=yes,,menubar=no,toolbar=no,status=no';
    var win = window.open(url, windowname, setvalues);
}
//Dream trip popup
function OpenNewPopupWindowWithHeightWidth(url) {
    OpenWindow(url, "", 1100, 600);
}

function EnableTextBox(chx, txt) {
    var chxOther = document.getElementById(chx);
    var txtOther = document.getElementById(txt);
    if (chxOther != null && txtOther != null) {
        if (chxOther.checked == true) {
            txtOther.disabled = false;
        }
        else {
            txtOther.disabled = true;
            txtOther.value = "";
        }
    }
}
function DisableValidators(ddlId, val1, val2) {
    var val1Ele = document.getElementById(val1);
    var val2Ele = document.getElementById(val2);

    var ddlEle = document.getElementById(ddlId);

    if (val1Ele != null && val2Ele != null) {
        if (ddlEle.value == 'Military') {
            ValidatorEnable(val1Ele, false);
            ValidatorEnable(val2Ele, false);
        }
        else {
            ValidatorEnable(val1Ele, true);
            ValidatorEnable(val2Ele, true);
        }
    }
}

function toggleLiveChatBody(divHead) {
    $(divHead).toggleClass('left_box_inner_down').siblings('.widget_body').toggle();
}

function toggleWidgetBody(divHead) {
    if ($(divHead).hasClass('left_box')) {
        $(divHead).removeClass("left_box");
        $(divHead).addClass("left_box_min");
        $(".widget_body", $(divHead).parent()).toggle("slow");
    }
    else if ($(divHead).hasClass('left_box_min')) {
        $(divHead).removeClass("left_box_min");
        $(divHead).addClass("left_box");
        $(".widget_body", $(divHead).parent()).toggle("slow");
    }
    else if ($(divHead).hasClass('left_box_inner')) {
        $(divHead).removeClass("left_box_inner");
        $(divHead).addClass("left_box_inner_down");
        $(".widget_body", $(divHead).parent()).slideUp();
    }
    else if ($(divHead).hasClass('left_box_inner_down')) {
        $(divHead).removeClass("left_box_inner_down");
        $(divHead).addClass("left_box_inner");
        $(".widget_body", $(divHead).parent()).slideDown();
    }

}

String.prototype.trim = function() {
    return this.replace( /^\s*/ , "").replace( /\s*$/ , "");
};


var UIEvent = function (sender) {
    var _sender = sender;
    var _listeners = [];

    var callAsyn = function (index, args) {
        setTimeout(function () {
            _listeners[index](_sender, args);
        }, 0);
    };

    return {
        attach: function (listener) {
            _listeners.push(listener);
        },
        notify: function (args, async) {
            var isAsync = false;
            if (typeof async == "boolean")
                isAsync = async;
            for (var i = 0; i < _listeners.length; i++) {
                if (isAsync)
                    callAsyn(i, args);
                else
                    _listeners[i](_sender, args);
            }
        }
    };
};