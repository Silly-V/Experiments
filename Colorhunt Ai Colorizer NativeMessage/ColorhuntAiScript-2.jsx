#target illustrator
function ColorhuntAiColorizer(args){ // function definition with a parameter specified

	// the JSON data object code to enable JSON handling inside of ExtendScript
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){
  return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];
    return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}
  function str(t,e){var n,r,o,f,u,i=gap,p=e[t];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(t)),
    "function"==typeof rep&&(p=rep.call(e,t,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";
  case"boolean":case"null":return String(p);case"object":if(!p)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(p)){
    for(f=p.length,n=0;f>n;n+=1)u[n]=str(n,p)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+i+"]":"["+u.join(",")+"]",gap=i,o}
      if(rep&&"object"==typeof rep)for(f=rep.length,n=0;f>n;n+=1)"string"==typeof rep[n]&&(r=rep[n],o=str(r,p),o&&u.push(quote(r)+(gap?": ":":")+o));
    else for(r in p)Object.prototype.hasOwnProperty.call(p,r)&&(o=str(r,p),o&&u.push(quote(r)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+
    u.join(",\n"+gap)+"\n"+i+"}":"{"+u.join(",")+"}",gap=i,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){
      return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+
      f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){
        return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&
    (escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      meta={"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,n){var r;
        if(gap="",indent="","number"==typeof n)for(r=0;n>r;r+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,
          e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),
    "function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      JSON.parse=function(text,reviver){function walk(t,e){var n,r,o=t[e];if(o&&"object"==typeof o)for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&
      (r=walk(o,n),void 0!==r?o[n]=r:delete o[n]);return reviver.call(t,e,o)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&
        (text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),
        /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@")
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]")
          .replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;
      throw new SyntaxError("JSON.parse")})}();

	function quickView(msg, title){
	  if(title == undefined){
	    title = '';
	  }
	  var w = new Window('dialog', title);
	  var e = w.add('edittext', undefined, msg, {multiline:true, readonly:true});
	  e.size = [700,500];
	  var okbtn = w.add('button', undefined, 'Ok');
	  okbtn.onClick = function(){
	    w.close();
	  }
	  w.show();
	};

	function getJsonData(filePath){
	  try {
	    var contents = readFile(filePath);
	    return JSON.parse(contents);
	  } catch (e) {
	    return false;
	  }
	};

	function readFile(path, encoding){
	  var f = path, contents;
	  if(!(path instanceof File)){
	    f = File(f);
	  }
	  if(typeof encoding != "undefined"){
	    f.encoding = encoding;  
	  }
	  if(!f.exists){
	    alert("File was not found at '" + decodeURI(f) + "'");
	    return false;
	  } else {
	    f.open('r');
	    contents = f.read();
	    f.close();
	    return contents;
	  }
	};

	function hexToRgb(hex) {
		// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [result[1], result[2], result[3]] ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
    ] : null;
	};

	function getColorNumbers(sourceTextContent){
		// gets colors from these patterns:
		// #FFFFFF, rgb(255,255,255), rgba(255,255,255,1), cmyk(0,0,0,0)
		var s = sourceTextContent.toString();
		var rx_hex = /^#(?:[0-9a-f]{3}){1,2}$/i;
		var rx_rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
		var rx_cmyk = /^cmyk\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
		if(s.match(rx_hex)){
			return hexToRgb(s);
		} else if(s.match(rx_rgb)){
			var m = s.match(rx_rgb);
			return [m[1], m[2], m[3]];
		} else if(s.match(rx_cmyk)){
			var m = s.match(rx_cmyk);
			return [m[1], m[2], m[3], m[4]];
		}
	};

	function buildProcessColor(numbers){
		var n = numbers, result;
		if(app.activeDocument.documentColorSpace == DocumentColorSpace.RGB){
			result = new RGBColor();
			if(n.length == 4){
				var c = app.convertSampleColor(ImageColorSpace.CMYK, n, ImageColorSpace.RGB, ColorConvertPurpose.defaultpurpose);
				result.red = c[0];
				result.green = c[1];
				result.blue = c[2];
			} else {
				result.red = n[0];
				result.green = n[1];
				result.blue = n[2];
			}
		} else {
			result = new CMYKColor();
			if(n.length == 3){
				var c = app.convertSampleColor(ImageColorSpace.RGB, n, ImageColorSpace.CMYK, ColorConvertPurpose.defaultpurpose);
				result.cyan = c[0];
				result.magenta = c[1];
				result.yellow = c[2];
				result.black = c[3];
			} else {
				result.cyan = n[0];
				result.magenta = n[1];
				result.yellow = n[2];
				result.black = n[3];
			}
		}
		return result;
	};

  if(app.documents.length == 0){
  	// exit script if no documents are open
  	// alert("ColorhuntAiColorizer: No documents are open.");
  	return JSON.stringify({ "ColorhuntAiColorizer Error" : "No document open." });;
  }
  var doc = app.activeDocument;

	var colorData = JSON.parse(args[0]).colorInfo;
	//quickView(colorData.toSource());
  var errorLog = [];
  if(colorData.length == 0){
		errorLog.push("The color data from website was processed and found to be invalid.");
  }
  var thisSwatchName, thisSwatchInfoObj, thisSwatchObj, theseColorNumbers, newValues;
  for (var i = 0; i < colorData.length; i++) {
  	thisSwatchInfoObj = colorData[i];
  	for(var all in thisSwatchInfoObj){
  		// only one element which is the name of the swatch as the key
  		thisSwatchName = all;
  		theseColorNumbers = getColorNumbers(thisSwatchInfoObj[all]);
  		newValues = buildProcessColor(theseColorNumbers);
  	}
  	try {
			thisSwatchObj = doc.swatches.getByName(thisSwatchName);
			thisSwatchObj.color.spot.color = newValues;
  	} catch (e) {
  		errorLog.push("Color NOT processed: " + thisSwatchName + "\n" + e + "\n");
  	}
  }
  if(errorLog.length > 0){
  	// return the error message
  	return JSON.stringify({ "ColorhuntAiColorizer Error Report" : errorLog.join("\n") });
  } else {
  	// return a success message
  	return JSON.stringify({ "Success" : "The file '" + doc.name + "' was colorized." });
  }
};
ColorhuntAiColorizer(arguments);