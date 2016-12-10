"use strict";
(function (GuidFormat) {
    GuidFormat[GuidFormat["BRACES"] = 1] = "BRACES";
    GuidFormat[GuidFormat["DASHES"] = 2] = "DASHES";
})(exports.GuidFormat || (exports.GuidFormat = {}));
var GuidFormat = exports.GuidFormat;
var GUID = (function () {
    function GUID(val, val2, val3, val4) {
        this.Data1 = new Uint8Array(4);
        this.Data2 = new Uint8Array(2);
        this.Data3 = new Uint8Array(2);
        this.Data4 = new Uint8Array(8);
        if (val != null) {
            if (typeof val === 'string') {
                this.parseImpl(val);
                return;
            }
            var ctor = val.constructor;
            if (ctor.name === 'GUID') {
                this.copyCtor(val);
                return;
            }
            if (ctor.name === 'Uint8Array') {
                var dummy = val;
                this.Data1 = dummy;
            }
            else {
                throw Error('Argument exception : val1 is of invalid type');
            }
            if (val2 != null) {
                this.Data2 = val2;
            }
            else {
                throw Error('Argument exception : val2 is null');
            }
            if (val3 != null) {
                this.Data3 = val3;
            }
            else {
                throw Error('Argument exception : val3 is null');
            }
            if (val4 != null) {
                this.Data4 = val4;
            }
            else {
                throw Error('Argument exception : val4 is null');
            }
        }
    }
    GUID.prototype.copyCtor = function (val) {
        if (val == null)
            throw Error('val is null');
        for (var i = 0; i < val.Data1.length; ++i)
            this.Data1[i] = val.Data1[i];
        for (var i = 0; i < val.Data2.length; ++i)
            this.Data2[i] = val.Data2[i];
        for (var i = 0; i < val.Data3.length; ++i)
            this.Data3[i] = val.Data3[i];
        for (var i = 0; i < val.Data4.length; ++i)
            this.Data4[i] = val.Data4[i];
    };
    GUID.prototype.parseImpl = function (val) {
        if (val == null)
            throw Error('val is null');
        var ret = GUID.Parse(val);
        this.copyCtor(ret);
    };
    GUID.prototype.toString = function (format) {
        if (format == null) {
            format = GuidFormat.BRACES | GuidFormat.DASHES;
        }
        var data = [
            GUID.toStringHexUint8(this.Data1),
            GUID.toStringHexUint8(this.Data2),
            GUID.toStringHexUint8(this.Data3),
            GUID.toStringHexUint8(this.Data4, 0, 2),
            GUID.toStringHexUint8(this.Data4, 2)
        ];
        var str = data.join(format & GuidFormat.DASHES ? '-' : '');
        if (format & GuidFormat.BRACES) {
            str = '{' + str + '}';
        }
        return str;
    };
    GUID.Parse = function (value) {
        if (value == null) {
            throw Error('value is null');
        }
        if (value == undefined) {
            throw Error('value is undefined');
        }
        if (typeof value != 'string') {
            throw Error('value must be a string');
        }
        if (value.length == 0) {
            throw Error('value is empty');
        }
        value = value.trim().toUpperCase();
        if (value.length != 32 &&
            value.length != 34 &&
            value.length != 36 &&
            value.length != 38) {
            throw Error('invalid format length');
        }
        var validCharacters = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '{', '}', '-'];
        for (var i = 0; i < value.length; ++i) {
            if (validCharacters.indexOf(value[i]) == -1) {
                throw Error('invalid format character');
            }
        }
        var posPadding = 0;
        var end = value.length;
        var start = value.indexOf('{');
        if (start != -1) {
            end = value.indexOf('}');
            if (start != 0 || end == -1 || end != value.length - 1) {
                throw Error('Invalid format braces');
            }
            start = 1;
        }
        else {
            start = 0;
        }
        var hasDashes = value.indexOf('-') != -1;
        if (hasDashes &&
            (value[start + 8] != '-' ||
                value[start + 13] != '-' ||
                value[start + 18] != '-' ||
                value[start + 23] != '-')) {
            throw Error('invalid format dashes');
        }
        if (hasDashes) {
            ++posPadding;
        }
        var data1 = value.substring(start, start = (start + 8));
        var data2 = value.substring(start + posPadding, start = (start + 4 + posPadding));
        var data3 = value.substring(start + posPadding, start = (start + 4 + posPadding));
        var data4H = value.substring(start + posPadding, start = (start + 4 + posPadding));
        var data4L = value.substring(start + posPadding, end);
        return new GUID(GUID.stringToUint8(data1), GUID.stringToUint8(data2), GUID.stringToUint8(data3), GUID.stringToUint8(data4H + data4L));
    };
    GUID.generate = function (seed) {
        if (seed == null) {
            seed = new Date().getTime();
        }
        var guid = new GUID();
        crypto.getRandomValues(guid.Data1);
        crypto.getRandomValues(guid.Data2);
        crypto.getRandomValues(guid.Data3);
        crypto.getRandomValues(guid.Data4);
        return guid;
    };
    GUID.toStringHexUint8 = function (values, start, end) {
        start = start == null ? 0 : start;
        end = end == null ? values.length : end;
        var str = '';
        for (var i = start; i < end; ++i) {
            var val = values[i].toString(16);
            str += val.length == 1 ? '0' + val : val;
        }
        return str.toUpperCase();
    };
    GUID.stringToUint8 = function (val) {
        if (val == null)
            throw Error('val is null');
        if (val == undefined)
            throw Error('val is undefined');
        if (typeof val != 'string')
            throw Error('val should be a string');
        var arr = new Uint8Array(val.length / 2);
        var j = 0;
        for (var i = 0; i < val.length; ++i, ++j) {
            var tmp = val[j] + val[++j];
            arr[i] = parseInt(tmp, 16);
        }
        return arr;
    };
    GUID.convolution = function (f, g) {
        if (f == null)
            throw Error('f is null');
        if (g == null)
            throw Error('g is null');
        if (f == undefined)
            throw Error('f is undefined');
        if (g == undefined)
            throw Error('g is undefined');
        if (f.length == 0)
            throw Error('f needs to be >= 1');
        if (g.length == 0)
            throw Error('g needs to be >= 1');
        var SIZE = f.length + g.length - 1;
        var ret = new Uint8Array(SIZE);
        for (var n = 0; n < SIZE; ++n) {
            var tmp = 0;
            var kmin = (n >= g.length - 1) ? n - (g.length - 1) : 0;
            var kmaX = (n < f.length - 1) ? n : f.length - 1;
            for (var k = kmin; k <= kmaX; ++k) {
                var signal = f[k];
                var kernel = g[n - k];
                tmp += (signal * kernel);
            }
            ret[n] = tmp;
        }
        return ret;
    };
    GUID.Empty = new GUID();
    return GUID;
}());
exports.GUID = GUID;
//# sourceMappingURL=GUID.js.map