import { v4 } from 'uuid';

export default function getShortUid() {

    let hexString = v4();
    console.log("hex:   ", hexString);
    
    // remove decoration
    hexString = hexString.replace(/-/g, "");
    
    let base64String = Buffer.from(hexString, 'hex').toString('base64')
    console.log("base64:", base64String);
    
    return base64String;
}


