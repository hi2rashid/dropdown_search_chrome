// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({
        code: '$(document).ready(function(){ $("select").select2(); })'
    });
    return;
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status == 'complete') {

        var getTab = function (tab) {
            //URL is ready
            var storekey = "white_list_url";
            chrome.storage.sync.get([storekey], function (result) {
                for (i = 0; i < result.white_list_url.length; i++) {
                    if (extractRootDomain(tab.url) == extractRootDomain(result.white_list_url[i])) {
                        chrome.tabs.executeScript({
                            code: '$(document).ready(function(){ $("select").select2(); })'
                        });
                        return;
                    }
                }
            });

        };

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            getTab(tabs[0]);
        });


    }
})

function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    return (false);
}

function fakeIPonAnchor(url) {
    var str = url;
    var a = document.createElement('a')
    a.href = str;
    return a;
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get the hostname
    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];

    return hostname;
}


// to address those who want the "root domain"
function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
    var originalHostname = domain;
    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    //If its IP
    fakeIPElement = fakeIPonAnchor(url);
    if (ValidateIPaddress(fakeIPElement.host)) {
        return fakeIPElement.host;
    } else {
        return domain + "  - Is URL";
    }
}