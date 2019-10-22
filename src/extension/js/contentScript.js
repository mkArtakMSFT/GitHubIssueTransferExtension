function InitializeHandler() {
    var url = window.location.href;
    $(document).ready(function () {
        if (url.toLowerCase().startsWith("https://github.com/aspnet/blazor/issues/") && url.endsWith("?transfer")) {
            console.log("Ready to transfer: " + url);
            $("#partial-discussion-sidebar > form > div > details > summary").trigger('click');
            ExecuteSoon(function () {
                $("#partial-discussion-sidebar > form > div > details > details-dialog > div.Box-body.p-3 > details > summary").trigger("click");
                ExecuteSoon(function () {
                    let options = $("#transfer-possible-repositories-menu > label[class='select-menu-item'][role='menuitemradio']");
                    let targetRepoItem = options.filter(function () {
                        return $(this).text().contains("AspNetCore");
                    });
                    console.log("Found target item: " + targetRepoItem);

                    targetRepoItem.trigger("click");
                    ExecuteSoon(function () {
                        $("#transfer-possible-repositories-menu > label:nth-child(3)")

                    });
                });
            });
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

function GetIssueUrl(issueNumber, callback) {
    chrome.storage.local.get(['owner', 'transferFrom', 'transferTo'], function (result) {
        callback("https://github.com/" + result.owner + "/" + result.transferFrom + "/issues/" + issueNumber + "?transfer");
    });
}

function ExecuteSoon(callback) {
    setTimeout(function () {
        callback();
    }, 200);
}

InitializeHandler();