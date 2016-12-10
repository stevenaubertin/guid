
import {GUID, GuidFormat} from './Guid';

export class GuidViewModel{
    private format:GuidFormat;
    private guid:GUID;

    constructor();
    constructor(guid:GUID);
    constructor(format:GuidFormat);
    constructor(guid:GUID, format:GuidFormat);
    constructor(val?:GUID|GuidFormat, format?:GuidFormat){
        if(val != null){
            let ctor:any = val.constructor;
            let argument:any = val;
            if(ctor.name === 'GUID'){
                this.setGuid(argument);
            }
            else if(ctor.name === 'GuidFormat'){
                this.setFormat(argument);
            }
        }
        this.setFormat(format != null ? format : GuidFormat.BRACES | GuidFormat.DASHES);
    }
    public getGuid():GUID{
        return this.guid;
    }
    public setGuid(guid:GUID):void{
        this.guid = guid;
    }
    public getFormat():GuidFormat{
        return this.format;
    }
    public setFormat(format:GuidFormat):void{
        this.format = format;
    }
    public setBraces(bool:Boolean):void{
        this.setFormat(bool ? 
            this.getFormat() | GuidFormat.BRACES : 
            this.getFormat() ^ GuidFormat.BRACES
        );
    }
    public setDashes(bool:Boolean):void{
        this.setFormat(bool ? 
            this.getFormat() | GuidFormat.DASHES : 
            this.getFormat() ^ GuidFormat.DASHES
        );
    }
    public toString():string{
        return this.guid.toString(this.format);
    }
}
