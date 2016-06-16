/***
  {
    "name" : "Material_Icon_Glyphs",
    "scriptVersion" : "1.0.1",
    "note" : "This is a script called Material_Icon_Glyphs"
  }
***/
#target illustrator-19
#script "Material_Icon_Glyphs"
function Material_Icon_Glyphs(props){


//======================================== FUNCTIONS ========================================//
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

function asSourceString(func){
  var functionName = (func.name == "anonymous") ? "" : func.name;
  var startRx = new RegExp("^\\(function\\s*" + functionName + "\\(\\)\\{");
  var endRx = new RegExp("\\}\\)$");
  return func.toSource().toString().replace(startRx, "").replace(endRx, "");
};

function bridgeTalkEncode( txt ) {
  txt = encodeURIComponent( txt );
  txt = txt.replace( /\r/, "%0d" );
  txt = txt.replace( /\n/, "%0a" );
  txt = txt.replace( /\\/, "%5c" );
  txt = txt.replace(/'/g, "%27");
  return txt.replace(/"/g, "%22"); 
};

function bridgeTalkDecode( txt ){
	return txt.replace(/%0d/g, "\r").replace(/%0a/g, "\n").replace(/%5c/g, "\\").replace(/%27/g, "'").replace(/%22/g, '"');
};

function sendBTmsgArgs(func, argsObj, targetApp, resultFunc){
  var bt = new BridgeTalk;
  // bt.target = 'illustrator-' + SESSION.AIVersion;
  bt.target = targetApp;

  var functionName = (func.name == "anonymous") ? "" : func.name;
  var startRx = new RegExp("^\\(function\\s*" + functionName + "\\(\\)\\{");
  var btMsg = func.toString();

  var meat;
  if(typeof argsObj != "undefined"){
    meat = btMsg + ";\n" + functionName + "('" + JSON.stringify(argsObj) + "');";
  } else {
  	meat = btMsg + ";\n" + functionName + "();";
  }
  meat += ("\n" + "BridgeTalk.bringToFront('illustrator');");
//~ $.writeln( meat );
  meat = bridgeTalkEncode( meat );
  
  btMsg = "var scp ='" + meat + "'";
  btMsg += ";\nvar scpDecoded = decodeURI( scp );\n"; 
  btMsg += "eval( scpDecoded );"; 


  bt.body = btMsg;
//~   $.writeln(decodeURI(bridgeTalkDecode(btMsg)));
  if(typeof resultFunc == "function"){
  	bt.onResult = resultFunc;
  	// resultFunc takes the (result) default argument that's implied.
  }

  bt.onError = function(res){
    alert('zzz');
  	alert(res.body);
  };

  bt.send();
};

function getAllIconNames(){
	var arr = [], thisGlyph;
	for (var i = 0; i < GLYPHS.collection.length; i++) {
		thisGlyph = GLYPHS.collection[i];
		arr.push(thisGlyph.name);
	}
	return arr;
};

function checkFontAvailability(fontName){
	try {
		var t = getFont(fontName);
		return true;
	} catch(e) {
		return false;
	}
};

function getFont(fontName){
  return app.textFonts.getByName(fontName);
};

function findGlyphFunc(glyphName){
  var doc = app.activeDocument;
  if(!checkFontAvailability(SETTINGS.targetFontName)){
    alert("Font '" + SETTINGS.targetFontName + "' is not found.");
    return;
  }
  var tempLayer = doc.layers.add(), tempText = tempLayer.textFrames.add();
  tempLayer.name = "font-test: " + glyphName;
  tempText.contents = glyphName;
  tempText.position = [(doc.width / 2) - (tempText.width / 2), -(doc.height / 2) + (tempText.height / 2)];
  tempText.textRange.select();
  tempText.textRange.textFont = getFont(SETTINGS.targetFontName);
  app.redraw();

  var action = confirm("'" + glyphName + "' located. Cleanup the font test?");
  if(action){
    try{
      tempLayer.remove();
    } catch(e) {
      alert("tempLayer.remove: " + e);
    }
  }
};

function findAction(glyphName){
  sendBTmsgArgs(Material_Icon_Glyphs, {procedure : "findGlyphFunc", name : glyphName}, "illustrator");
};

var FUNCTIONS = {
  findGlyphFunc : findGlyphFunc
};

//==============================================================================================//

//======================================== OBJECTS ========================================//
//objects go here...
var SETTINGS = {
  "scriptVersion" : "1.0.1",
	 "scriptName" : "Material_Icon_Glyphs",
	 bigWindowLocation : { x : 400, y : 200 },
	 targetFontName : "MaterialIcons-Regular"
};

var SESSION = {
  os : $.os.match('Windows') ? 'Windows' : 'Mac',
  AIVersion : parseInt(app.version.split(/\./)[0]),
};

var GLYPHS = {
	collection : [
		{
			name : "local_florist",
			imageData : ""
		},
		{
			name : "filter_drama",
			imageData : ""
		},
		{
			name : "filter_center_focus",
			imageData : ""
		},
		{
			name : "filter_b_and_w",
			imageData : ""
		},
		{
			name : "filter_9_plus",
			imageData : ""
		},
		{
			name : "filter_9",
			imageData : ""
		},
		{
			name : "filter_8",
			imageData : ""
		},
		{
			name : "ac_unit",
			imageData : ""
		},
		{
			name : "airport_shuttle",
			imageData : ""
		},
		{
			name : "all_inclusive",
			imageData : ""
		},
		{
			name : "beach_access",
			imageData : ""
		},
		{
			name : "business_center",
			imageData : ""
		},
		{
			name : "casino",
			imageData : ""
		},
		{
			name : "child_care",
			imageData : ""
		},
		{
			name : "child_friendly",
			imageData : ""
		},
		{
			name : "fitness_center",
			imageData : ""
		},
		{
			name : "free_breakfast",
			imageData : ""
		},
		{
			name : "golf_course",
			imageData : ""
		},
		{
			name : "hot_tub",
			imageData : ""
		},
		{
			name : "kitchen",
			imageData : ""
		},
		{
			name : "pool",
			imageData : ""
		},
		{
			name : "room_service",
			imageData : ""
		},
		{
			name : "rv_hookup",
			imageData : ""
		},
		{
			name : "smoke_free",
			imageData : ""
		},
		{
			name : "smoking_rooms",
			imageData : ""
		},
		{
			name : "spa",
			imageData : ""
		},
		{
			name : "cake",
			imageData : ""
		},
		{
			name : "more",
			imageData : ""
		},
		{
			name : "network_check",
			imageData : ""
		},
		{
			name : "network_locked",
			imageData : ""
		},
		{
			name : "no_encryption",
			imageData : ""
		},
		{
			name : "ondemand_video",
			imageData : ""
		},
		{
			name : "personal_video",
			imageData : ""
		},
		{
			name : "phone_bluetooth_speaker",
			imageData : ""
		},
		{
			name : "phone_forwarded",
			imageData : ""
		},
		{
			name : "phone_in_talk",
			imageData : ""
		},
		{
			name : "phone_locked",
			imageData : ""
		},
		{
			name : "phone_missed",
			imageData : ""
		},
		{
			name : "keyboard_arrow_left",
			imageData : ""
		},
		{
			name : "keyboard_arrow_right",
			imageData : ""
		},
		{
			name : "keyboard_arrow_up",
			imageData : ""
		},
		{
			name : "keyboard_backspace",
			imageData : ""
		},
		{
			name : "indeterminate_check_box",
			imageData : ""
		},
		{
			name : "check_box_outline_blank",
			imageData : ""
		},
		{
			name : "check_box",
			imageData : ""
		},
		{
			name : "delete",
			imageData : ""
		},
		{
			name : "delete_forever",
			imageData : ""
		},
		{
			name : "description",
			imageData : ""
		},
		{
			name : "dns",
			imageData : ""
		},
		{
			name : "done",
			imageData : ""
		},
		{
			name : "done_all",
			imageData : ""
		},
		{
			name : "donut_large",
			imageData : ""
		},
		{
			name : "donut_small",
			imageData : ""
		},
		{
			name : "eject",
			imageData : ""
		},
		{
			name : "cancel",
			imageData : ""
		},
		{
			name : "terrain",
			imageData : ""
		},
		{
			name : "subway",
			imageData : ""
		},
		{
			name : "streetview",
			imageData : ""
		},
		{
			name : "store_mall_directory",
			imageData : ""
		},
		{
			name : "satellite",
			imageData : ""
		},
		{
			name : "restaurant_menu",
			imageData : ""
		},
		{
			name : "restaurant",
			imageData : ""
		},
		{
			name : "rate_review",
			imageData : ""
		},
		{
			name : "zoom_out_map",
			imageData : ""
		},
		{
			name : "developer_board",
			imageData : ""
		},
		{
			name : "device_hub",
			imageData : ""
		},
		{
			name : "devices_other",
			imageData : ""
		},
		{
			name : "dock",
			imageData : ""
		},
		{
			name : "gamepad",
			imageData : ""
		},
		{
			name : "headset",
			imageData : ""
		},
		{
			name : "headset_mic",
			imageData : ""
		},
		{
			name : "keyboard",
			imageData : ""
		},
		{
			name : "keyboard_arrow_down",
			imageData : ""
		},
		{
			name : "transfer_within_a_station",
			imageData : ""
		},
		{
			name : "tram",
			imageData : ""
		},
		{
			name : "train",
			imageData : ""
		},
		{
			name : "traffic",
			imageData : ""
		},
		{
			name : "subdirectory_arrow_right",
			imageData : ""
		},
		{
			name : "subdirectory_arrow_left",
			imageData : ""
		},
		{
			name : "refresh",
			imageData : ""
		},
		{
			name : "more_vert",
			imageData : ""
		},
		{
			name : "more_horiz",
			imageData : ""
		},
		{
			name : "menu",
			imageData : ""
		},
		{
			name : "last_page",
			imageData : ""
		},
		{
			name : "fullscreen_exit",
			imageData : ""
		},
		{
			name : "fullscreen",
			imageData : ""
		},
		{
			name : "first_page",
			imageData : ""
		},
		{
			name : "expand_more",
			imageData : ""
		},
		{
			name : "expand_less",
			imageData : ""
		},
		{
			name : "close",
			imageData : ""
		},
		{
			name : "chevron_right",
			imageData : ""
		},
		{
			name : "chevron_left",
			imageData : ""
		},
		{
			name : "check",
			imageData : ""
		},
		{
			name : "enhanced_encryption",
			imageData : ""
		},
		{
			name : "drive_eta",
			imageData : ""
		},
		{
			name : "do_not_disturb_on",
			imageData : ""
		},
		{
			name : "do_not_disturb_off",
			imageData : ""
		},
		{
			name : "do_not_disturb_alt",
			imageData : ""
		},
		{
			name : "do_not_disturb",
			imageData : ""
		},
		{
			name : "disc_full",
			imageData : ""
		},
		{
			name : "confirmation_number",
			imageData : ""
		},
		{
			name : "bluetooth_audio",
			imageData : ""
		},
		{
			name : "airline_seat_recline_normal",
			imageData : ""
		},
		{
			name : "airline_seat_recline_extra",
			imageData : ""
		},
		{
			name : "airline_seat_legroom_reduced",
			imageData : ""
		},
		{
			name : "airline_seat_legroom_normal",
			imageData : ""
		},
		{
			name : "airline_seat_legroom_extra",
			imageData : ""
		},
		{
			name : "airline_seat_individual_suite",
			imageData : ""
		},
		{
			name : "airline_seat_flat_angled",
			imageData : ""
		},
		{
			name : "airline_seat_flat",
			imageData : ""
		},
		{
			name : "adb",
			imageData : ""
		},
		{
			name : "event_available",
			imageData : ""
		},
		{
			name : "event_busy",
			imageData : ""
		},
		{
			name : "event_note",
			imageData : ""
		},
		{
			name : "folder_special",
			imageData : ""
		},
		{
			name : "live_tv",
			imageData : ""
		},
		{
			name : "mms",
			imageData : ""
		},
		{
			name : "apps",
			imageData : ""
		},
		{
			name : "arrow_back",
			imageData : ""
		},
		{
			name : "arrow_downward",
			imageData : ""
		},
		{
			name : "arrow_drop_down",
			imageData : ""
		},
		{
			name : "arrow_drop_down_circle",
			imageData : ""
		},
		{
			name : "arrow_drop_up",
			imageData : ""
		},
		{
			name : "arrow_forward",
			imageData : ""
		},
		{
			name : "arrow_upward",
			imageData : ""
		},
		{
			name : "local_taxi",
			imageData : ""
		},
		{
			name : "map",
			imageData : ""
		},
		{
			name : "my_location",
			imageData : ""
		},
		{
			name : "navigation",
			imageData : ""
		},
		{
			name : "near_me",
			imageData : ""
		},
		{
			name : "person_pin",
			imageData : ""
		},
		{
			name : "sentiment_satisfied",
			imageData : ""
		},
		{
			name : "sentiment_neutral",
			imageData : ""
		},
		{
			name : "sentiment_dissatisfied",
			imageData : ""
		},
		{
			name : "school",
			imageData : ""
		},
		{
			name : "public",
			imageData : ""
		},
		{
			name : "poll",
			imageData : ""
		},
		{
			name : "plus_one",
			imageData : ""
		},
		{
			name : "person_outline",
			imageData : ""
		},
		{
			name : "person_add",
			imageData : ""
		},
		{
			name : "person",
			imageData : ""
		},
		{
			name : "people_outline",
			imageData : ""
		},
		{
			name : "people",
			imageData : ""
		},
		{
			name : "local_gas_station",
			imageData : ""
		},
		{
			name : "local_grocery_store",
			imageData : ""
		},
		{
			name : "local_hospital",
			imageData : ""
		},
		{
			name : "local_hotel",
			imageData : ""
		},
		{
			name : "local_laundry_service",
			imageData : ""
		},
		{
			name : "local_library",
			imageData : ""
		},
		{
			name : "local_mall",
			imageData : ""
		},
		{
			name : "local_movies",
			imageData : ""
		},
		{
			name : "local_offer",
			imageData : ""
		},
		{
			name : "phone_paused",
			imageData : ""
		},
		{
			name : "power",
			imageData : ""
		},
		{
			name : "iso",
			imageData : ""
		},
		{
			name : "landscape",
			imageData : ""
		},
		{
			name : "wifi",
			imageData : ""
		},
		{
			name : "wc",
			imageData : ""
		},
		{
			name : "vpn_lock",
			imageData : ""
		},
		{
			name : "voice_chat",
			imageData : ""
		},
		{
			name : "vibration",
			imageData : ""
		},
		{
			name : "keyboard_capslock",
			imageData : ""
		},
		{
			name : "keyboard_hide",
			imageData : ""
		},
		{
			name : "keyboard_return",
			imageData : ""
		},
		{
			name : "keyboard_tab",
			imageData : ""
		},
		{
			name : "keyboard_voice",
			imageData : ""
		},
		{
			name : "laptop",
			imageData : ""
		},
		{
			name : "laptop_chromebook",
			imageData : ""
		},
		{
			name : "laptop_mac",
			imageData : ""
		},
		{
			name : "laptop_windows",
			imageData : ""
		},
		{
			name : "memory",
			imageData : ""
		},
		{
			name : "mouse",
			imageData : ""
		},
		{
			name : "phone_android",
			imageData : ""
		},
		{
			name : "phone_iphone",
			imageData : ""
		},
		{
			name : "phonelink",
			imageData : ""
		},
		{
			name : "phonelink_off",
			imageData : ""
		},
		{
			name : "power_input",
			imageData : ""
		},
		{
			name : "router",
			imageData : ""
		},
		{
			name : "scanner",
			imageData : ""
		},
		{
			name : "security",
			imageData : ""
		},
		{
			name : "sim_card",
			imageData : ""
		},
		{
			name : "smartphone",
			imageData : ""
		},
		{
			name : "speaker",
			imageData : ""
		},
		{
			name : "speaker_group",
			imageData : ""
		},
		{
			name : "tablet",
			imageData : ""
		},
		{
			name : "tablet_android",
			imageData : ""
		},
		{
			name : "tablet_mac",
			imageData : ""
		},
		{
			name : "toys",
			imageData : ""
		},
		{
			name : "tv",
			imageData : ""
		},
		{
			name : "videogame_asset",
			imageData : ""
		},
		{
			name : "watch",
			imageData : ""
		},
		{
			name : "add_a_photo",
			imageData : ""
		},
		{
			name : "add_to_photos",
			imageData : ""
		},
		{
			name : "adjust",
			imageData : ""
		},
		{
			name : "assistant",
			imageData : ""
		},
		{
			name : "assistant_photo",
			imageData : ""
		},
		{
			name : "audiotrack",
			imageData : ""
		},
		{
			name : "star_half",
			imageData : ""
		},
		{
			name : "star_border",
			imageData : ""
		},
		{
			name : "star",
			imageData : ""
		},
		{
			name : "radio_button_unchecked",
			imageData : ""
		},
		{
			name : "radio_button_checked",
			imageData : ""
		},
		{
			name : "cast",
			imageData : ""
		},
		{
			name : "cast_connected",
			imageData : ""
		},
		{
			name : "computer",
			imageData : ""
		},
		{
			name : "desktop_mac",
			imageData : ""
		},
		{
			name : "desktop_windows",
			imageData : ""
		},
		{
			name : "local_parking",
			imageData : ""
		},
		{
			name : "local_pharmacy",
			imageData : ""
		},
		{
			name : "local_phone",
			imageData : ""
		},
		{
			name : "local_pizza",
			imageData : ""
		},
		{
			name : "local_play",
			imageData : ""
		},
		{
			name : "local_post_office",
			imageData : ""
		},
		{
			name : "local_printshop",
			imageData : ""
		},
		{
			name : "local_see",
			imageData : ""
		},
		{
			name : "local_shipping",
			imageData : ""
		},
		{
			name : "party_mode",
			imageData : ""
		},
		{
			name : "pages",
			imageData : ""
		},
		{
			name : "notifications_paused",
			imageData : ""
		},
		{
			name : "notifications_off",
			imageData : ""
		},
		{
			name : "notifications_none",
			imageData : ""
		},
		{
			name : "notifications_active",
			imageData : ""
		},
		{
			name : "notifications",
			imageData : ""
		},
		{
			name : "mood_bad",
			imageData : ""
		},
		{
			name : "mood",
			imageData : ""
		},
		{
			name : "location_city",
			imageData : ""
		},
		{
			name : "group_add",
			imageData : ""
		},
		{
			name : "group",
			imageData : ""
		},
		{
			name : "domain",
			imageData : ""
		},
		{
			name : "person_pin_circle",
			imageData : ""
		},
		{
			name : "pin_drop",
			imageData : ""
		},
		{
			name : "place",
			imageData : ""
		},
		{
			name : "priority_high",
			imageData : ""
		},
		{
			name : "sd_card",
			imageData : ""
		},
		{
			name : "sim_card_alert",
			imageData : ""
		},
		{
			name : "sms",
			imageData : ""
		},
		{
			name : "sms_failed",
			imageData : ""
		},
		{
			name : "sync",
			imageData : ""
		},
		{
			name : "sync_disabled",
			imageData : ""
		},
		{
			name : "sync_problem",
			imageData : ""
		},
		{
			name : "system_update",
			imageData : ""
		},
		{
			name : "tap_and_play",
			imageData : ""
		},
		{
			name : "time_to_leave",
			imageData : ""
		},
		{
			name : "sentiment_very_dissatisfied",
			imageData : ""
		},
		{
			name : "sentiment_very_satisfied",
			imageData : ""
		},
		{
			name : "share",
			imageData : ""
		},
		{
			name : "whatshot",
			imageData : ""
		}
	]
};

GLYPHS.namedCollection = {};
var thisGlyph;
for( var i = 0; i < GLYPHS.collection.length; i++ ){
	thisGlyph = GLYPHS.collection[i];
	GLYPHS.namedCollection[thisGlyph.name] = {
		imageData : thisGlyph.imageData
	};
}
thisGlyph = null;


//==============================================================================================//

//======================================== UI WINDOW ========================================//

DropDownList.prototype.selectWell = function(){
  //CC will let you select null
  this.addEventListener('change', function(){
    if(this.selection == null){
      this.selection = this.items[0];
    }
  });
};

DropDownList.prototype.getValue = function(){
  if(this.selection != null){
    if(this.hasOwnProperty("data") && typeof this.data == "object"){
      return this.data[this.selection.text];
    }
    return this.selection.text;
  } else {
    return null;
  }
};

DropDownList.prototype.setValue = function(value){
  for (var i = 0; i < this.items.length; i++) {
    if(this.items[i].text == value){
      this.selection = this.items[i];
      return;
    } else if(this.hasOwnProperty("data") && typeof this.data == "object"){
      if(value == this.data[this.items[i].text]){
        this.selection = this.items[i];
        return;
      }
    }
  };
  alert("The value '" + value + "' is not present in this DropDownList.");
};

function makeDropdownlist(parent, items){
  var dd = parent.add("dropdownlist", undefined, items);
  dd.selectWell();
  dd.selection = dd.items[0];
  return dd;
};

function paletteWindow(){
  var windowType = 'palette' ;
  var w = new Window(windowType, (SETTINGS.scriptName), undefined, {closeButton: true, borderless : false});
  w.spacing = 2;
  w.margins= [2,2,2,2];
  w.location = SETTINGS.bigWindowLocation;

  var g1 = w.add('group');
  var dd_icons = makeDropdownlist(g1, getAllIconNames());

  var g2 = w.add('group');
  var btn_find = g2.add("button", undefined, "Find");
  btn_find.helpTip = "Reveal this character in the Glyphs Panel.";
  btn_find.onClick = function(){
  	return findAction(dd_icons.selection.text);
  };
  
  w.onShow = function(){
  };
  this.show = function(){w.show();}
};




//==============================================================================================//

	try {
		props = JSON.parse(props);
		FUNCTIONS[props.procedure]( props.name );
	} catch(e) {
		var p = new paletteWindow();
		p.show();
	}

};

Material_Icon_Glyphs();