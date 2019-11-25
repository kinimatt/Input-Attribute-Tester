// background (event) page
var parent = chrome.contextMenus.create({
    "title": "Enable Input Attribute Tester",
    "id": "ipt-tst-context",
    "contexts": ["all"],
    "type": "checkbox",
    "checked":false
});

var tabDataStore = {};

chrome.tabs.onCreated.addListener(function (tab) {
    console.log(JSON.stringify(tab));

    //chrome.browserAction.setBadgeText({ text: 'OFF', tabId: tab.id });
    //chrome.browserAction.setBadgeBackgroundColor({ color: "#F00", tabId: tab.id });

    tabDataStore['tab_' + tab.id] = {
        state: false
    };

});

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      if (changeInfo.url) {
        if (typeof tabDataStore['tab_' + tab.id] === typeof undefined) {
            tabDataStore['tab_' + tab.id] = {
                state: false
            };   
        }
        tabDataStore['tab_' + tab.id].state = false;
        chrome.browserAction.setBadgeText({ text: '', tabId: tab.id });
      }
    }
  );

chrome.tabs.onRemoved.addListener(function (tabId) {
    delete tabDataStore['tab_' + tabId];
});

chrome.browserAction.onClicked.addListener(function (tab) {
    
    if (typeof tabDataStore['tab_' + tab.id] === typeof undefined) {
        tabDataStore['tab_' + tab.id] = {
            state: false
        };   
    }

    toggleState(!tabDataStore['tab_' + tab.id].state, tab.id);
    if(tabDataStore['tab_' + tab.id].state){
        chrome.contextMenus.update("ipt-tst-context",{
            "checked":true
        });
    } else {
        chrome.contextMenus.update("ipt-tst-context",{
            "checked":false
        });
    }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log(JSON.stringify(info));
    console.log(JSON.stringify(tab));

     if (info.menuItemId == "ipt-tst-context") {
        toggleState(info.checked, tab.id);
    }

});

function toggleState(state, tabId) {
    if (state) {
        tabDataStore['tab_' + tabId].state = true;
        chrome.browserAction.setBadgeText({ text: 'ON', tabId: tabId });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#0F0", tabId: tabId });

        chrome.tabs.sendMessage(tabId, { id: "ipt-tst", enable: true });
    } else {
        tabDataStore['tab_' + tabId].state = false;
        chrome.browserAction.setBadgeText({ text: 'OFF', tabId: tabId });
        chrome.browserAction.setBadgeBackgroundColor({ color: "#F00", tabId: tabId });

        chrome.tabs.sendMessage(tabId, { id: "ipt-tst", enable: false });
    }
}