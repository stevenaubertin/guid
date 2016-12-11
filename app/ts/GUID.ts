
export enum GuidFormat{
    BRACES = 1,
    DASHES = 2
}

export class GUID{
    public static readonly Empty:GUID = new GUID();

    private readonly Data1:Uint8Array=new Uint8Array(4);
    private readonly Data2:Uint8Array=new Uint8Array(2);
    private readonly Data3:Uint8Array=new Uint8Array(2);
    private readonly Data4:Uint8Array=new Uint8Array(8);

    public constructor();
    public constructor(val:string);
    public constructor(val:GUID);
    public constructor(val1:Uint8Array, val2:Uint8Array, val3:Uint8Array, val4:Uint8Array);
    public constructor(val?:string|GUID|Uint8Array, val2?:Uint8Array, val3?:Uint8Array, val4?:Uint8Array){
        if(val!=null){
            if(typeof val === 'string'){
                this.parseImpl(val);
                return;
            }

            let ctor:any = val.constructor;
            if(ctor.name === 'GUID'){
                this.copyCtor(val);
                return;
            }
            
            if(ctor.name === 'Uint8Array'){
                let dummy:any = val;//Force the TypeScript type system to shut up.
                this.Data1 = dummy;
            }
            else{
                throw Error('Argument exception : val1 is of invalid type');
            }
            if(val2 != null){
                this.Data2 = val2;
            }
            else {
                throw Error('Argument exception : val2 is null');
            }
            if(val3 != null){
                this.Data3 = val3;
            }
            else {
                throw Error('Argument exception : val3 is null');
            }
            if(val4 != null){
                this.Data4 = val4;
            }
            else {
                throw Error('Argument exception : val4 is null');
            }
        }
    }

    private copyCtor(val:any):void{
        if(val == null)throw Error('val is null');
        for(let i = 0; i < val.Data1.length; ++i)this.Data1[i] = val.Data1[i];
        for(let i = 0; i < val.Data2.length; ++i)this.Data2[i] = val.Data2[i];
        for(let i = 0; i < val.Data3.length; ++i)this.Data3[i] = val.Data3[i];
        for(let i = 0; i < val.Data4.length; ++i)this.Data4[i] = val.Data4[i];
    }

    private parseImpl(val:string):void{
        if(val == null)throw Error('val is null');
        let ret:GUID = GUID.Parse(val);
        this.copyCtor(ret);
    }

    public toString(format?:GuidFormat):string{
        if(format==null){
            format = GuidFormat.BRACES | GuidFormat.DASHES;
        }
        
        let data = [
            GUID.toStringHexUint8(this.Data1),
            GUID.toStringHexUint8(this.Data2),
            GUID.toStringHexUint8(this.Data3),
            GUID.toStringHexUint8(this.Data4, 0, 2),
            GUID.toStringHexUint8(this.Data4, 2)
        ];
        
        let str:string =  data.join(format & GuidFormat.DASHES ? '-' : '');

        if(format & GuidFormat.BRACES){
            str = '{' + str +'}';
        }

        return str;
    }

    public static Parse(value:string):GUID{
        if(value == null){
            throw Error('value is null');
        }
        if(value == undefined){
            throw Error('value is undefined');
        }
        if(typeof value != 'string'){
            throw Error('value must be a string');
        }
        if(value.length==0){
            throw Error('value is empty');
        }

        value = value.trim().toUpperCase();
        
        if (value.length != 32 && //digits only
            value.length != 34 && //digits with braces
            value.length != 36 && //digits with dashes
            value.length != 38) { //digits with braces and dashes
            throw Error('invalid format length');
        } 

        //Check valid characters
        var validCharacters = ['A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '{', '}', '-'];
        for (var i = 0; i < value.length; ++i) {
            if (validCharacters.indexOf(value[i]) == -1) {
                throw Error('invalid format character');
            }
        }

        //[{]dddddddd[-]dddd[-]dddd[-]dddd[-]dddddddddddd[}]
        let posPadding:number = 0;//Padding use in case of dashes
        var end:number = value.length;
        var start:number = value.indexOf('{');

        //Check for braces
        if(start != -1){
            end = value.indexOf('}');
            if (start != 0 || end == -1 || end != value.length - 1) {
                throw Error('Invalid format braces');
            }
            start = 1;
        }
        else{
            start = 0;
        }

        var hasDashes:boolean = value.indexOf('-') != -1;
        if (hasDashes &&
            (value[start + 8]  != '-' ||
             value[start + 13] != '-' ||
             value[start + 18] != '-' ||
             value[start + 23] != '-')) {
            throw Error('invalid format dashes');
        }
        if(hasDashes){
            ++posPadding;
        }

        var data1:string  = value.substring(start, start = (start + 8));
        var data2:string  = value.substring(start + posPadding, start = (start + 4 + posPadding));
        var data3:string  = value.substring(start + posPadding, start = (start + 4 + posPadding));
        var data4H:string = value.substring(start + posPadding, start = (start + 4 + posPadding));
        var data4L:string = value.substring(start + posPadding, end);

        return new GUID(
            GUID.stringToUint8(data1),
            GUID.stringToUint8(data2),
            GUID.stringToUint8(data3),
            GUID.stringToUint8(data4H+data4L)
        );
    }

    public static generate(seed?:number):GUID{
        if(seed==null){
            seed = new Date().getTime();
        }

        var guid:GUID = new GUID();
        
        crypto.getRandomValues(guid.Data1);//8bytes
        crypto.getRandomValues(guid.Data2);//4bytes
        crypto.getRandomValues(guid.Data3);//4bytes
        crypto.getRandomValues(guid.Data4);//16bytes

        return guid;
    }

    private static toStringHexUint8(values:Uint8Array, start?:number, end?:number):string{
        start = start == null ? 0 : start;
        end = end == null ? values.length : end;
        let str = '';
        for(let i:number = start; i < end; ++i){
            let val = values[i].toString(16);
            str += val.length == 1 ? '0'+val : val;   
        }
        return str.toUpperCase();
    }

    private static stringToUint8(val:string):Uint8Array{
        if(val == null)throw Error('val is null');
        if(val == undefined)throw Error('val is undefined');
        if(typeof val != 'string')throw Error('val should be a string');
        let arr:Uint8Array = new Uint8Array(val.length / 2);
        let j:number = 0;
        for(let i = 0; i < val.length; ++i, ++j){
            let tmp:string = val[j] + val[++j];
            arr[i] = parseInt(tmp, 16);
        }
        return arr;
    }
    
    private static convolution(f:Uint8Array, g:Uint8Array):Uint8Array{
        if(f == null)throw Error('f is null');
        if(g == null)throw Error('g is null');
        if(f == undefined)throw Error('f is undefined');
        if(g == undefined)throw Error('g is undefined');
        if(f.length==0)throw Error('f needs to be >= 1');
        if(g.length==0)throw Error('g needs to be >= 1');
        
        const SIZE = f.length + g.length - 1;
        let ret:Uint8Array = new Uint8Array(SIZE);
        for(let n = 0; n < SIZE; ++n){
            let tmp = 0;let kmin = (n >= g.length - 1) ? n - (g.length - 1) : 0;
            let kmaX = (n <  f.length - 1) ? n : f.length - 1;
            for(let k = kmin; k <= kmaX; ++k){
                let signal = f[k];
                let kernel = g[n - k];
                tmp += (signal * kernel);
            }
            ret[n] = tmp;
        }
        return ret;
    }
}