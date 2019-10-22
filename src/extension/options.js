// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');

let ownerElement = document.getElementById('owner');
let transferFromElement = document.getElementById('transferFrom');
let transferToElement = document.getElementById('transferTo');

let saveButton = document.getElementById('saveOptions');

saveButton.addEventListener('click', function () {
  chrome.storage.local.set({
    owner: ownerElement.value,
    transferFrom: transferFromElement.value,
    transferTo: transferToElement.value
  }, function () {
    console.log('successfully stored settings ' + ownerElement.value);
  });
});

function loadSettings() {
  console.log("loading settings");
  chrome.storage.local.get(['owner', 'transferFrom', 'transferTo'], function (result) {
    console.log("successfully loaded settings: " + result.owner);
    ownerElement.value = result.owner;
    transferFromElement.value = result.transferFrom;
    transferToElement.value = result.transferTo;
  });
}

loadSettings();