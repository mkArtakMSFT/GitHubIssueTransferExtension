
function transferAll() {
    let url = document.location.href.toLowerCase();

    if (url.indexOf("/issues") > 0) {
        let selectedCheckboxes = $("div[aria-label='Issues']>div input:checkbox:checked");
        console.log('Selected count: ' + selectedCheckboxes.length);

        selectedCheckboxes.each(function () {
            let selectedCheckbox = $(this);
            let issueNumber = selectedCheckbox.attr('value');
            let issueUrl = "https://github.com/aspnet/Blazor/issues/" + issueNumber;
            window.open(issueUrl, '_blank');
        });
    }
}

//transferAll();
