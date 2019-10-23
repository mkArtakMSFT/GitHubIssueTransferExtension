function InitializeHandler() {
    $(document).ready(function () {
        OnIssueTransferRequest(function (settings) {
            $("#partial-discussion-sidebar > form > div > details > summary").trigger('click');
            ExecuteSoon(function () {
                $("#partial-discussion-sidebar > form > div > details > details-dialog > div.Box-body.p-3 > details > summary").trigger("click");
                ExecuteSoon(function () {
                    let options = $("#transfer-possible-repositories-menu > label[class='select-menu-item'][role='menuitemradio']");

                    console.log("Preparing to transfer the issue to " + settings.transferTo);

                    let targetRepoItem = options.filter(function () {
                        var matchingText = $(this).find("div.select-menu-item-text div span").text().trim().toLowerCase();
                        console.log(matchingText);
                        return matchingText === settings.transferTo.toLowerCase();
                    });

                    targetRepoItem.trigger("click");
                    ExecuteSoon(function () {
                        console.log("transferring issue to " + settings.transferTo + " repo");
                        $("#partial-discussion-sidebar > form > div > details > details-dialog  button[type='submit']").trigger("click");
                    });
                });
            });
        });
    });
}

function OnIssueTransferRequest(callback) {
    var url = window.location.href;
    GetSettings(function (settings) {

        if (url.toLowerCase().startsWith(GetIssuesUrl(settings)) && url.endsWith("?transfer")) {
            console.log("Ready to transfer: " + url);
            callback(settings);
        }
    });
}

function transferAll() {
    let url = document.location.href.toLowerCase();

    if (url.indexOf("/issues") > 0) {
        let selectedCheckboxes = $("div[aria-label='Issues']>div input:checkbox:checked");
        console.log('Selected count: ' + selectedCheckboxes.length);

        selectedCheckboxes.each(function () {
            let selectedCheckbox = $(this);
            let issueNumber = selectedCheckbox.attr('value');
            GetIssueUrl(issueNumber, function (url) {
                window.open(url, '_blank');
            });
        });
    }
}

function GetIssuesUrl(settings) {
    let result = "https://github.com/" + settings.owner + "/" + settings.transferFrom + "/issues/";
    return result.toLowerCase();
}

function GetIssueUrl(issueNumber, callback) {
    GetSettings(function (settings) {
        callback(GetIssuesUrl(settings) + issueNumber + "?transfer");
    });
}

function GetSettings(callback) {
    chrome.storage.local.get(['owner', 'transferFrom', 'transferTo'], function (result) {
        callback(result);
    });
}

function ExecuteSoon(callback) {
    setTimeout(function () {
        callback();
    }, 500);
}

InitializeHandler();