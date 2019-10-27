function InitializeHandler() {
    $(document).ready(function () {
        GetSettings(function (settings) {
            if (IsIssueTransferRequest(settings)) {
                let isIssueLocked = IsIssueLocked();
                if (isIssueLocked) {
                    console.log("The issue to be transferred is locked. Unlocking the issue to enable the transfer");
                    let issueKey = GetIssueKey();
                    StoreIssueStateToTransfer(issueKey, IsIssueLocked(), function () {
                        UnlockIssue();
                        console.log("Successfully unlocked the issue");
                    });
                }
                else {
                    TransferIssue(settings);
                }
            } else if (IsTransferredIssue(settings)) {
                ApplyFinalLabel(settings, function () {
                    RetrieveTransferredIssueState(GetIssueKey(), function (lockAfterTransfer) {
                        if (lockAfterTransfer === true) {
                            if (IsIssueLocked()) {
                                // End of the workflow.
                                CloseIfLabelApplied(settings.labelToApplyAfterMigration);
                            } else {
                                LockIssue();
                            }
                        } else {
                            CloseIfLabelApplied(settings.labelToApplyAfterMigration);
                        }
                    });
                });
            }
        });
    });
}

function CloseIfLabelApplied(label) {
    if (label != null && HasLabel(label) === true) {
        console.log("closing issue");
        window.close();
    } else {
        console.log("ERROR: The issue has no required label assigned");
    }
}

function HasLabel(label) {
    let labelField = $("#partial-discussion-sidebar > div.discussion-sidebar-item.sidebar-labels.js-discussion-sidebar-item > div > a > span");
    return labelField != null && labelField.length > 0 && labelField[0].innerText.trim().toLowerCase() == label;
}

function IsTransferredIssue(settings) {
    var url = window.location.href;
    if (url.toLowerCase().startsWith(GetIssuesUrl(settings, settings.transferTo) + "/")) {
        return true;
    }
}

function IsIssueTransferRequest(settings) {
    var url = window.location.href;
    if (url.toLowerCase().startsWith(GetIssuesUrl(settings, settings.transferFrom) + '/')) {
        if (url.endsWith("?transfer")) { return true; }
        else {
            let parts = url.split('/');
            return Number.isInteger(Number.parseInt(parts[parts.length - 1]));
        }
    }

    return false;
}

function ApplyFinalLabel(settings, callback) {
    if (HasLabel(settings.labelToApplyAfterMigration) === true) {
        callback();
    }
    else {
        ExecuteSoon(function () {
            $("#labels-select-menu > summary").trigger("click");

            ExecuteSoon(function () {
                console.log("Applying label");
                let areaLabelItem = FindAreaLabel(settings);
                areaLabelItem.trigger("click");
                $("#labels-select-menu > summary").trigger("click");

                callback();
            });
        });
    }
}

function FindAreaLabel(settings) {
    let list = $(".js-filterable-issue-labels").children();
    let labelItem = list.filter(function () {
        var matchingText = $(this).find("div.select-menu-item-text div span").text().trim().toLowerCase();
        return matchingText === settings.labelToApplyAfterMigration;
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

/// This method is being called by the extension to transfer the selected issues
function TransferSelectedIssues() {
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

/// Gets the url to issues for the specified repository: https://github.com/owner/repository/issues
function GetIssuesUrl(settings, repository) {
    let result = "https://github.com/" + settings.owner + "/" + repository + "/issues";
    return result.toLowerCase();
}

/// Gets the url to the specified issue in the source repository
function GetIssueUrl(issueNumber, callback) {
    GetSettings(function (settings) {
        callback(GetIssuesUrl(settings, settings.transferFrom) + "/" + issueNumber + "?transfer");
    });
}

function GetSettings(callback) {
    chrome.storage.local.get(['owner', 'transferFrom', 'transferTo', 'labelToApplyAfterMigration'], function (result) {
        callback(result);
    });
}

function ExecuteSoon(callback) {
    setTimeout(function () {
        callback();
    }, 4000);
}

function SimulateEnter(inputElement) {
    var e = jQuery.Event("keydown");
    e.which = 13; // # Some key code value
    $(inputElement).trigger(e);
}

/// Stores the state of the issue before transfer, so that the state can be retrieved post transfer
function StoreIssueStateToTransfer(key, lockAfterTransfer, callback) {
    let stateToStore = new Object();
    stateToStore[key] = lockAfterTransfer;
    chrome.storage.local.set(stateToStore, function () {
        callback();
    });
}

/// Retrieves the state of an issue which was transferred.
function RetrieveTransferredIssueState(key, callback) {
    chrome.storage.local.get(key, function (result) {
        callback(result);
    });
}

function NormalizeString(text) {
    return text.replace("'", "").replace('"', "").replace(' ', '').replace(/\-\?\'\+\\\-"/, '');
}

function GetIssueKey() {
    let issueTitle = $("#partial-discussion-header > div.gh-header-show > h1 > span.js-issue-title")[0].innerText;
    return NormalizeString(issueTitle).substring(0, 30);
}

function IsIssueLocked() {
    let unlockParentElement = $("#partial-discussion-sidebar > div:nth-child(7) > details > summary")[0];
    return unlockParentElement.innerText.trim().toLowerCase() == "unlock conversation";
}

function LockIssue() {
    $("#partial-discussion-sidebar > div:nth-child(7) > details > summary").trigger("click");
    ExecuteSoon(function () {
        $("#partial-discussion-sidebar > div:nth-child(7) > details > details-dialog > form > div.Box-footer > button").trigger("click");
    });
}

function UnlockIssue() {
    $("#partial-discussion-sidebar > div:nth-child(7) > details > summary").trigger("click");
    $("#partial-discussion-sidebar > div:nth-child(7) > details > details-dialog > form > div.Box-footer > button").trigger("click");
}

InitializeHandler();