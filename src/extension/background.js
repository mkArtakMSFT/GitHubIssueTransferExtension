'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ owner: 'aspnet', transferFrom: 'Blazor', transferTo: 'AspNetCore', labelToApplyAfterMigration: 'area-blazor' }, function () {
    console.log('Stored initial settings');
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    let newHost = 'github.com';
    console.log("Adding rule for new host: " + newHost);

    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: newHost },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});