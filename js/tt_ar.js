const _pathCDNFile = "https://fayaian.github.io/Files/";
const _pathRedirect = "https://www.toyota.com.tw/AR/redirect/";
const _defaultCar = "corolla_cross"; //corolla_cross
const _carColorData = {
    "altis": ["white", "blue"],
    "corolla_cross": ["blue_grey", "white", "red", "grey", "black", "silver"]
};

function CallAr(car) {
    var browserType = getBrowserType();
    console.log("browserType:"+browserType);
    if (browserType == "PC") {
        alert('pc 88');
    } else if (browserType == "Android") {
        showSceneViewer(car);
    } else if (browserType == "ios_other") {
        //redirectHintSafari(car, color);
        alert('plz use safari');
    } else if (browserType == "ios_safari") {
        showSchematicView(car);
    } else if (browserType == "ios_v12") {
        show3DView(car);
    } 
}

function showSceneViewer(car) {
    var strUrl = _pathCDNFile + car + ".glb";
    window.location.href =
        "intent://arvr.google.com/scene-viewer/1.0?file=" + strUrl + "#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;";
}

function showSchematicView(car, color) {
    let strUrl = _pathCDNFile + car + ".usdz";
    window.location.href = strUrl;
}

function show3DView(car, color) {
    let strUrl = _pathCDNFile + car + ".usdz";
    let a3DView = document.createElement('a');
    a3DView.setAttribute('rel', 'ar');
    a3DView.appendChild(document.createElement('img'));
    a3DView.setAttribute('href', strUrl);
    a3DView.click();
}

function getBrowserType() {
    var strType = "";
    var md = new MobileDetect(window.navigator.userAgent);
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (md.versionStr('Safari') != null && md.versionStr('Safari').split('.')[0] == '12'){
        strType = "ios_v12"
    }
    else if (md.os() == null) {
        if (userAgent.match(/Mac/i)) {
            if (isTouchDevice()) {
                //TODO 這邊可能要再判斷
                strType = "ios_safari";
            }
            else {
                strType = "PC";
            }
        } else {
            strType = "PC";
        }
    } else if (md.os().toLowerCase() == "androidos") {
        strType = "Android";
    } else if (md.os().toLowerCase() == "ios") {
        if ( md.userAgent() != null && md.userAgent().toLowerCase() == "safari") {
            strType = "ios_safari";
        } else { // null or chrome
             strType = "ios_other";
        }
    }
    return strType;
}

function popupQRcode(car, color) {
    var mobileSCanQRcodeUrl = _pathRedirect + "mobileScan.html"
    var fullUrl = mobileSCanQRcodeUrl + '?car=' + car + '&color=' + color;
    var divDialog = document.getElementById("dialogPopupQRCode");

    if (typeof (divDialog) != 'undefined' && divDialog != null) {
        divDialog.style.display = "block";
        document.getElementById("imgQRCode").innerHTML = '';
        generateQRcode(fullUrl);
    } else {
        divDialog = document.createElement("div");
        divDialog.classList.add("pnlDialogFull");
        divDialog.setAttribute("id", "dialogPopupQRCode");
        divDialog.innerHTML =
            "<div class='pnlDialogGray'>" +
            "<div id='imgQRCode' class='imgQRcode'></div>" +
            "<label class='lblTitle'>AR互動賞車</label>" +
            "<label class='lblContent'>請透過手機掃描Qrcode體驗AR互動賞車</label>" +
            "<button class='btnClosePopUp' onclick='closeQRcodePopup();'>關閉</button>" +
            "</div>";
        document.body.appendChild(divDialog);
        generateQRcode(fullUrl);
    }
}

function closeQRcodePopup() {
    var dialog = document.getElementById("dialogPopupQRCode");
    dialog.style.display = "none";
}

function generateQRcode(url) {
    $('#imgQRCode').qrcode({
        width: 279,
        height: 279,
        text: url,
    });
}

function redirectHintSafari(car, color) {
    var redirectUrl = _pathRedirect + "hintSafari.html"
    var fullUrl = redirectUrl + '?car=' + car + '&color=' + color;
    window.location.href = fullUrl;
}

function checkCarName(car) {
    car = car.toLowerCase();
    let testcolorarray = _carColorData[car];
    if (testcolorarray == null) {
        car = _defaultCar;
    }
    return car;
}

function getDefaultColor(car) {
    return _carColorData[car][0];
}

function checkCarColor(car, color) {
    color = color.toLowerCase();
    if (_carColorData[car].indexOf(color) < 0) {
        color = getDefaultColor(car);
    }
    return color;
}

function isTouchDevice() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function (query) {
        return window.matchMedia(query).matches;
    };
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function testMobileDetect() {
    var md = new MobileDetect(window.navigator.userAgent);
    var lblResult = document.getElementById("lblResult");
    lblResult.innerHTML =
        "md.phone() = " + md.phone() + "<br><br>" +
        "md.tablet() = " + md.tablet() + "<br><br>" +
        "md.mobile() = " + md.mobile() + "<br><br>" +
        "md.os() = " + md.os() + "<br><br>" +
        "md.userAgent() = " + md.userAgent() + "<br><br>" +
        "md.versionStr('Chrome') = " + md.versionStr('Chrome') + "<br><br>" +
        "md.versionStr('Safari') = " + md.versionStr('Safari') + "<br><br>" +
        "md.versionStr('iOS') = " + md.versionStr('iOS') + "<br><br>" +
        "md.versionStr('Windows NT') = " + md.versionStr('Windows NT');
}