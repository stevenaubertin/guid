"use strict";
var Guid_1 = require('./Guid');
var GuidViewModel = (function () {
    function GuidViewModel(val, format) {
        if (val != null) {
            var ctor = val.constructor;
            var argument = val;
            if (ctor.name === 'GUID') {
                this.setGuid(argument);
            }
            else if (ctor.name === 'GuidFormat') {
                this.setFormat(argument);
            }
        }
        this.setFormat(format != null ? format : Guid_1.GuidFormat.BRACES | Guid_1.GuidFormat.DASHES);
    }
    GuidViewModel.prototype.getGuid = function () {
        return this.guid;
    };
    GuidViewModel.prototype.setGuid = function (guid) {
        this.guid = guid;
    };
    GuidViewModel.prototype.getFormat = function () {
        return this.format;
    };
    GuidViewModel.prototype.setFormat = function (format) {
        this.format = format;
    };
    GuidViewModel.prototype.setBraces = function (bool) {
        this.setFormat(bool ?
            this.getFormat() | Guid_1.GuidFormat.BRACES :
            this.getFormat() ^ Guid_1.GuidFormat.BRACES);
    };
    GuidViewModel.prototype.setDashes = function (bool) {
        this.setFormat(bool ?
            this.getFormat() | Guid_1.GuidFormat.DASHES :
            this.getFormat() ^ Guid_1.GuidFormat.DASHES);
    };
    GuidViewModel.prototype.toString = function () {
        return this.guid.toString(this.format);
    };
    return GuidViewModel;
}());
exports.GuidViewModel = GuidViewModel;
//# sourceMappingURL=GuidViewModel.js.map