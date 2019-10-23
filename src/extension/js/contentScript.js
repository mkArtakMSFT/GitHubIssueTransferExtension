function InitializeHandler() {
    $(document).ready(function () {
        GetSettings(function (settings) {
            if (IsIssueTransferRequest(settings)) {
                TransferIssue(settings);
            } else if (IsTransferredIssue(settings)) {
                ApplyFinalLabel(settings);
            }
        });
    });
}

function IsTransferredIssue(settings) {
    var url = window.location.href;
    if (url.toLowerCase().startsWith(GetIssuesUrl(settings, settings.transferTo))) {
        return true;
    }
}

function IsIssueTransferRequest(settings) {
    var url = window.location.href;
    if (url.toLowerCase().startsWith(GetIssuesUrl(settings, settings.transferFrom)) && url.endsWith("?transfer")) {
        return true;
    }
}

function ApplyFinalLabel(settings) {
    ExecuteSoon(function () {
        $("#labels-select-menu > summary").trigger("click");

        ExecuteSoon(function () {
            console.log("Applying label");
            let areaLabelItem = FindAreaLabel(settings);
            areaLabelItem.trigger("click");
            $("#labels-select-menu > summary").trigger("click");
            window.close();
        });
    });
}

function FindAreaLabel(settings) {
    let list = $(".js-filterable-issue-labels").children();
    let labelItem = list.filter(function () {
        var matchingText = $(this).find("div.select-menu-item-text div span").text().trim().toLowerCase();
        return matchingText === "area-blazor";
    });

    return labelItem;
}

function TransferIssue(settings) {
    $("#partial-discussion-sidebar > form > div > details > summary").trigger('click');
    ExecuteSoon(function () {
        $("#partial-discussion-sidebar > form > div > details > details-dialog > div.Box-body.p-3 > details > summary").trigger("click");
        ExecuteSoon(function () {
            let options = $("#transfer-possible-repositories-menu > label[class='select-menu-item'][role='menuitemradio']");

            console.log("Preparing to transfer the issue to " + settings.transferTo);

            let targetRepoItem = options.filter(function () {
                var matchingText = $(this).find("div.select-menu-item-text div span").text().trim().toLowerCase();
                return matchingText === settings.transferTo.toLowerCase();
            });

            targetRepoItem.trigger("click");
            ExecuteSoon(function () {
                console.log("transferring issue to " + settings.transferTo + " repo");
                $("#partial-discussion-sidebar > form > div > details > details-dialog  button[type='submit']").trigger("click");
            });
        });
    });
}

function transferAll() {
    let url = document.location.href.toLowerCase();

    if (url.indexOf("/issues") > 0) {
        let selectedCheckboxes = $("div[aria-label='Issues']>div input:checkbox:checked");
        selectedCheckboxes.each(function () {
            let selectedCheckbox = $(this);
            let issueNumber = selectedCheckbox.attr('value');
            GetIssueUrl(issueNumber, function (url) {
                window.open(url, '_blank');
            });
        });
    }
}

function GetIssuesUrl(settings, repository) {
    let result = "https://github.com/" + settings.owner + "/" + repository + "/issues/";
    return result.toLowerCase();
}

function GetIssueUrl(issueNumber, callback) {
    GetSettings(function (settings) {
        callback(GetIssuesUrl(settings, settings.transferFrom) + issueNumber + "?transfer");
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
    }, 5000);
}

function SimulateEnter(inputElement) {
    var e = jQuery.Event("keydown");
    e.which = 13; // # Some key code value
    $(inputElement).trigger(e);
}

InitializeHandler();