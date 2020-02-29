document.getElementById('save').addEventListener('click', save_options);

document.addEventListener('DOMContentLoaded', get_whitelist_urls);

// Saves options to chrome.storage
function save_options() {
    var white_list_url_value = document.getElementById('white_list_url').value;
    var storekey = "white_list_url";
    fakeIPAhrefElement = fakeIPonAnchor(white_list_url_value);
    if(!isUrlValid(white_list_url_value) && !ValidateIPaddress(fakeIPAhrefElement.host)){
        alert("Enter a Valid URL starting with http:// or https://");
        return;
    }
    chrome.storage.sync.get([storekey], function (result) {
        if(typeof result.white_list_url == 'undefined'){
            result.white_list_url = [];
        }
        
        result.white_list_url.push(white_list_url_value);
        chrome.storage.sync.set(result, function () {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'New URL Added.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
            get_whitelist_urls();
        });
    });

}

function get_whitelist_urls() {
    var white_list_url_cont = document.getElementById('white_list_url_cont');
    chrome.storage.sync.get(
            {
                white_list_url: "",
            }, function (items) {
        var x = items.white_list_url;
        var htmlcont = "<ul>";
        for (i = 0; i < items.white_list_url.length; i++) {
            htmlcont += "<li> " + " <input name='messageCheckbox' type='checkbox' value=" + x[i] + ">" + x[i] + "</li>";
        }

        htmlcont += "</ul><p>To remove any URL from the above listing, select the URL and click on remove. Only a single URL can be removed at a time.</p><button id='removeFromarrayBtn' class='red'>Remove</button> <span>Remove one element at a time</span>";

        white_list_url_cont.innerHTML = htmlcont;
        document.getElementById('removeFromarrayBtn').addEventListener('click', removeFromarray);
    }

    );
}


function removeFromarray() {
    var storekey = "white_list_url";
    var inputElements = document.getElementsByName('messageCheckbox');
    // finalArray = [];
    for (var i = 0; inputElements[i]; i++) {
        if (inputElements[i].checked) {
            checkedValue = inputElements[i].value;
            chrome.storage.sync.get([storekey], function (result,i) {
                
                // console.log("White list URLs ",result.white_list_url);
                indexToRemove = result.white_list_url.indexOf(checkedValue);
                // console.log("Value of I ",checkedValue);
                result.white_list_url.splice(i, 1);
                // console.log("After",result.white_list_url);

                    chrome.storage.sync.set(result, function () {
                       // Update status to let user know options were saved.
                       var status = document.getElementById('status');
                       status.textContent = 'Removed this URL : '+checkedValue;
                       setTimeout(function () {
                           status.textContent = '';
                       }, 750);
                       get_whitelist_urls();
                    });
                
            });

        }
    }
    
}


function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

function fakeIPonAnchor(url) {
    var str = url;
    var a = document.createElement('a')
    a.href = str;
    return a;
}

function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    return (false);
}