
function transfer() {
    let url = document.location.href.toLowerCase();

    if (url.indexOf("/issues") > 0) {
        let checkAll = $("#js-issues-toolbar > div.mr-3 > input[type=checkbox]");
        // checkAll.prop('checked', true);
        let issueRows = $("div[id^='issue_']");
        // alert('Selected count: ' + issueRows.length);

        issueRows.each(function () {
            let selectionCheckbox = $(this).children("input[type='checkbox']");
            console.log(selectionCheckbox);
            console.log(selectionCheckbox.attr('name'));
            // console.log(selectionCheckbox.attr('id'));
            if (selectionCheckbox.prop('checked'))
            {
                alert ("checked");
            }
        });
    }
}

transfer();
