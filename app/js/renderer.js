// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer, clipboard, shell} = require('electron');
const BrowserWindow = require('electron').remote.BrowserWindow;
const path = require('path');
const {GUID, GuidFormat} = require('../js/GUID.js');
const {GuidViewModel} = require('../js/GuidViewModel.js');
const BRACES = document.getElementById('braces-id');
const DASHES = document.getElementById('dashes-id');
const DataContext = new GuidViewModel(
    GUID.generate(0), 
    (BRACES.checked ? GuidFormat.BRACES : 0) | (DASHES.checked ? GuidFormat.DASHES : 0)
);
const updateView = () => $('#uuid-id').val(DataContext.toString());
$('#lbl-uuid-id').dblclick(() => {
    clipboard.writeText(DataContext.toString(), 'selection');
    Materialize.toast('Guid copied to clipboard', 4000);
});
$('#braces-id').click(() => {
    DataContext.setBraces(BRACES.checked);
    updateView();
});
$('#dashes-id').click(() => {
    DataContext.setDashes(DASHES.checked);
    updateView();
});
$('#generate-btn-id').click(() => {
    let seed = 0;//TODO CHANGE THIS
    DataContext.setGuid(GUID.generate(seed));
    updateView();
});
$('.open-in-browser').click((event) => {
    event.preventDefault();
    shell.openExternal(event.target.href);
});
(function(){
    $('.title').each(function(i){$(this).text('electron guid 1.1')});

    BRACES.checked = true;
    DASHES.checked = true;
    updateView();

    //----- Update some materializecss stuff
    $('select').material_select();
    $(".button-collapse").sideNav();
})();
