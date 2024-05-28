class File_Utility {

    constructor() {
        this.filename = "";
        this.index = "";
    }
    
    getLastIndex(str, substr){
        this.filename = str;
        for(let i = str.length-1; i >= 0; i--) {
            if(str[i] == substr) {
                this.index = i;
                return this;
            }
        }
    }

    getExtensionFile(){
        let index = this.index;
        let ext = "";

        for (let i = index; i < this.filename.length; i++) {
            ext += this.filename[i];
        }
        return ext;
    }

    getFilename(){
        let index = this.index;
        let name = "";
        
        for (let i = 0; i < index; i++) {
            name += this.filename[i];
        }
        return name;
    }
    
}

class Static_Utility {
    
    /* routes util static */
    static splitRoute(string) {
        const segments = ['/'];
        let currentSegment = "";
        
        for (let i = 1; i < string.length; i++) {
            const result = string[i];
            if (result === "/") {
                segments.push(currentSegment);
                currentSegment = "";
            } else {
                currentSegment += result;
            }
        }
        
        if (currentSegment !== "") {
            segments.push(currentSegment);
        }
        
        return segments;
    }
    /* routes util static */
    static isRouteExist(route) {
        if (typeof route !== "function") {
            return false;
        } else {
            return "success";
        }
    }

    /* string util */
    static fetchlastIndex(str, substr){
        for(let i = str.length-1; i >= 0; i--) {
            if(str[i] == substr) {
                return i;
            }
        }
    }
    /* string util */
    static splitStr(string,separator) {
        const segments = [];
        let currentSegment = "";

        for (let i = 0; i < string.length; i++) {
            const result = string[i];
            if (result === separator) {
                segments.push(currentSegment);
                currentSegment = "";
            } else {
                currentSegment += result;
            }
        }

        if (currentSegment !== "") {
            segments.push(currentSegment);
        }

        return segments;
    }

}

    const util_route = {};
    const util_string = {};

    util_route['splitRoute'] = Static_Utility.splitRoute;
    util_route['isRouteExist'] = Static_Utility.isRouteExist;

    util_string['fetchlastIndex'] = Static_Utility.fetchlastIndex;
    util_string['splitStr'] = Static_Utility.splitStr;


module.exports = {
    util_file: new File_Utility,
    util_route: util_route,
    util_string: util_string
}
