
function transfer() {
    let url = document.location.href.toLowerCase();

    if (url.indexOf("/issues") > 0) {
        let issueRows = $("div[aria-label='Issues']>div input:checkbox:checked");
        console.log('Selected count: ' + issueRows.length);

        issueRows.each(function () {
            let selectedCheckboxes = $(this);
            console.log(selectedCheckboxes.attr('value'));
        });
    }
}

transfer();
