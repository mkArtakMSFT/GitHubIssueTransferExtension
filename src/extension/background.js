// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ owner: 'aspnet', transferFrom: 'Blazor', transferTo: 'AspNetCore', labelToApplyAfterMigration: 'area-blazor' }, function () {
    console.log('Stored initial settings');
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // chrome.storage.local.get(['owner', 'transferFrom', 'transferTo'], function (result) {
    //   let newHost = 'github.com/' + result.owner + '/' + result.transferFrom + '/issues';
    //   newHost = newHost.toLowerCase();
      
      let newHost = 'github.com';
      console.log("Adding rule for new host: " + newHost);

      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: newHost },
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    //});
  });
});