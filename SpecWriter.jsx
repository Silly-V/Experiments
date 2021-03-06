/*============================= SPEC WRITER By Vasily ==========================*/
function main () {
	/* --------------------------------------------------------------------------------------- Basic Functions */
	function asSourceString (func) {
		return func
		.toSource()
		.toString()
		.replace(
			"(function " + func.name + " () {",
			""
		).replace(
			/\s?}\)$/,
			""
		);
	}
	function quickView (msg, title) {
		if (title == undefined) {
			title = '';
		}
		var w = new Window('dialog', title);
		var e = w.add('edittext', undefined, msg, {multiline:true, readonly:true});
		e.size = [700,500];
		var okbtn = w.add('button', undefined, 'Ok');
		w.show();
	};
	function sendBTmsg (func, updateObj, resultFunc, resultFuncArgs) {
		if (updateObj == undefined) {
			updateObj = { self : 'nothing' };
		};
		var updateObjName = updateObj.self;
		if (updateObjName != undefined) {
			var bt = new BridgeTalk;
			bt.target = 'illustrator';

			var btMsg = asSourceString(func);

			for (all in updateObj) {
				if (all != 'self') {
					var rx = new RegExp(updateObjName + '\\.' + all, 'g');
					btMsg = btMsg.replace(rx, updateObj[all]);
				}
			}
			var script = "var scp = '" + bridgeTalkEncode(btMsg) + "'";

			script += ";\nvar scpDecoded = \rdecodeURI( scp );\n"; 
			script += "eval(scpDecoded);"; 
			bt.body = script;
			/* $.write(btMsg); */
			bt.onResult = function (result) {
				if (resultFunc != undefined) {
					resultFunc(result.body, resultFuncArgs);
				}
			}
			bt.onError = function (e) {
				alert("BT msg error:\r" + e.body);
			}
			bt.send();
		} else {
			$.writeln("Error, function 'sendBTmsg(func, updateOb)': the update object should have a 'self' property, indentifying its' name.");
		}
	}
	function CMYKtoRGB (c,m,y,k) {
		return [
			(1 - (c / 100)) * (1 - (k / 100)),
			(1 - (m / 100)) * (1 - (k / 100)),
			(1 - (y / 100)) * (1 - (k / 100))
		];
	}
	function drawFromObjString (objString, canvasArea) {
		var obj = eval(objString);
		var canvas = canvasArea.graphics;
		var counter = obj.total;
		while (counter >= 0) {
			for (all in obj) {
				if (all.match( /\d{1,2}$/g) && all.match( /\d{1,2}$/g) == counter) {
					var thisShp = obj[all];
					var vectorPts = thisShp.pathPoints;
					canvas.newPath();
					canvas.moveTo(thisShp.pathPoints[0][0], thisShp.pathPoints[0][1]);
					for (var j = 0; j < vectorPts.length; j ++) {
						var thisAnchor = vectorPts[j];
						var x = thisAnchor[0], y = thisAnchor[1];
						canvas.lineTo(x,y);
					}
					canvas.closePath();
					if (thisShp.fillColor != null) {
						var clr = thisShp.fillColor; // RGB only
						var myBrush = canvas.newBrush(canvas.BrushType.SOLID_COLOR,clr);
						canvas.fillPath(myBrush);
					}
					if (thisShp.strokeColor != null) {
						var clr = thisShp.strokeColor; // RGB only
						var myPen = canvas.newPen(canvas.PenType.SOLID_COLOR, [clr[0], clr[1], clr[2], 1], thisShp.strokeWidth);
						canvas.strokePath(myPen);
					}
				}
			}
			counter -= 1;
		}
	}
	/* -------------------------------------------------------------------------------------------------------------------- Specific Functions */
	function boo () {
		alert("Howdy!!!");
	}
	function doNothing () {
		var nothing = function () {
			return;
		}();
	}
	function returnRefresh () {
		outcome = {
			width : width,
			height : height,
			unitsName : unitsName,
		}.toSource()
	}
	function processRefresh (objString, args) {
		var uiStuff = args[0];
		var obj = eval(objString);
		uiStuff.wE.text = obj.width + " " + obj.unitsName;
		uiStuff.hE.text = obj.height + " " + obj.unitsName;
	}
	/* putSpecs() continued from paletteToAI() using 'item', 'left', 'top', 'right', 'bottom', 'width, 'height', 'unitsName', 'proportionFactor' */
	function putSpecs () {
		var specsLayer = null;
		for (var i = 0; i < doc.layers.length; i ++) {
			var thisLayer = doc.layers[i];
			if (thisLayer.name == "Specs_Layer") {
				specsLayer = thisLayer;
				thisLayer.locked = false;
				thisLayer.visible = true;
				break;
			}
		}
		if (specsLayer == null) {
			specsLayer = doc.layers.add();
			specsLayer.name = "Specs_Layer";
		}
		function specLine (pt_1, pt_2, parent, orientation, color, textContents, specOffset, arrowType, proportionFactor) {
			var end_1 = parent.pathItems.add();
			var end_2 = parent.pathItems.add();
			var path = parent.pathItems.add();
			var text = parent.textFrames.add();
			text.contents = textContents;
			var hd = 10 * proportionFactor;
			var vd_1 = 4 * proportionFactor;
			var vd_2 = 6 * proportionFactor;
			if (orientation == 'horizontal') {
				if (arrowType == 1) {
					end_1.setEntirePath([
						[pt_1[0] + hd, pt_1[1]],
						[pt_1[0] + hd, pt_1[1] + vd_1],
						[pt_1[0], pt_1[1]],
						[pt_1[0] + hd, pt_1[1] - vd_1],
						[pt_1[0] + hd, pt_1[1]]
					]);
					end_2.setEntirePath([
						[pt_2[0] - hd, pt_2[1]],
						[pt_2[0] - hd, pt_2[1] + vd_1],
						[pt_2[0], pt_2[1]],
						[pt_2[0] - hd, pt_2[1] - vd_1],
						[pt_2[0] - hd, pt_2[1]]
					]);
				} else {
					end_1.setEntirePath([
						[pt_1[0], pt_1[1]],
						[pt_1[0], pt_1[1] + vd_2],
						[pt_1[0], pt_1[1]],
						[pt_1[0], pt_1[1] - vd_2],
						[pt_1[0], pt_1[1]]
					]);
					end_2.setEntirePath([
						[pt_2[0], pt_2[1]],
						[pt_2[0], pt_2[1] + vd_2],
						[pt_2[0], pt_2[1]],
						[pt_2[0], pt_2[1] - vd_2],
						[pt_2[0], pt_2[1]]
					]);
				}
				path.setEntirePath([pt_1, pt_2]);
				text.left = ((pt_2[0] - pt_1[0]) / 2) + pt_1[0] - (text.width / 2);
				text.top = pt_1[1] - (specOffset / 2);
			} else if (orientation == 'vertical') {
				if (arrowType == 1) {
					end_1.setEntirePath([
						[pt_1[0], pt_1[1] - hd],
						[pt_1[0] - vd_1,pt_1[1] - hd],
						[pt_1[0], pt_1[1]],
						[pt_1[0] + vd_1,pt_1[1] - hd],
						[pt_1[0], pt_1[1] - hd]
					]);
					end_2.setEntirePath([
						[pt_2[0], pt_2[1] + hd],
						[pt_2[0] - vd_1, pt_2[1] + hd],
						[pt_2[0], pt_2[1]],
						[pt_2[0] + vd_1, pt_2[1] + hd],
						[pt_2[0], pt_2[1] + hd]
					]);
				} else {
					end_1.setEntirePath([
						[pt_1[0], pt_1[1]],
						[pt_1[0] - vd_2, pt_1[1]],
						[pt_1[0], pt_1[1]],
						[pt_1[0] + vd_2, pt_1[1]],
						[pt_1[0], pt_1[1]]
					]);
					end_2.setEntirePath([
						[pt_2[0], pt_2[1]],
						[pt_2[0] - vd_2, pt_2[1]],
						[pt_2[0], pt_2[1]],
						[pt_2[0] + vd_2, pt_2[1]],
						[pt_2[0], pt_2[1]]
					]);
				}
				path.setEntirePath([pt_1, pt_2]);
				text.left = pt_1[0] + (specOffset / 2); text.top = ((pt_2[1] - pt_1[1]) / 2) + pt_1[1] + (text.height / 2);
			}
			end_1.stroked = true;
			end_1.strokeWidth = 1;
			end_1.strokeColor = color;
			end_2.stroked = true;
			end_2.strokeColor = color;
			end_2.strokeWidth = 1;
			end_1.filled = true;
			end_1.fillColor = color;
			end_2.filled = true;
			end_2.fillColor = color;
			path.stroked = true;
			path.filled = false;
			path.strokeColor = color;
			path.strokeWidth = 1;
			text.textRange.characterAttributes.fillColor = color;
		}
		var markerColor;
		if (INFO.colortype == 'CMYKColor') {
			markerColor = new CMYKColor();
			markerColor.cyan = INFO.clr_1;
			markerColor.magenta = INFO.clr_2;
			markerColor.yellow = INFO.clr_3;
			markerColor.black = INFO.clr_4;
		} else if (INFO.colortype == 'RGBColor') {
			markerColor = new RGBColor();
			markerColor.red = INFO.clr_1;
			markerColor.green = INFO.clr_2;
			markerColor.blue = INFO.clr_3;
		} else if (INFO.colortype == 'GrayColor') {
			markerColor = new GrayColor();
			markerColor.gray = INFO.clr_1;
		}
		var specGrp = doc.groupItems.add(specsLayer, ElementPlacement.PLACEATBEGINNING);
		var time = new Date();
		var hours = time.getHours();
		var minutes = time.getMinutes();
		var seconds = time.getSeconds();
		if (seconds < 10) { seconds = '0' + seconds; }
		if (minutes < 10) { minutes = '0' + minutes; }
		var ampm = function () {
			if (hours > 12) {
				hours -= 12;
				return 'pm';
			} else {
				return 'am';
			}
		}();
		var specOffset = 10, aT = INFO.arrowType;
		specGrp.name = item.name + "_Specs_" + (hours) + ":" + minutes + ":" + seconds + ampm;
		var wSpec = specGrp.groupItems.add();
		wSpec.name = "Width Spec";
		specLine(
			[left, bottom - specOffset],
			[right, bottom - specOffset],
			wSpec,
			"horizontal",
			markerColor,
			"W: " + width + ' ' + unitsName,
			specOffset,
			aT,
			proportionFactor
		);
		var hSpec = specGrp.groupItems.add();
		hSpec.name = "Height Spec";
		specLine(
			[right + specOffset, top],
			[right + specOffset, bottom],
			hSpec,
			"vertical",
			markerColor,
			"H: " + height + ' ' + unitsName,
			specOffset,
			aT,
			proportionFactor
		);
		outcome = {
			width: width,
			height: height,
			unitsName: unitsName,
		}.toSource()
	}
	function getDefaultFill () {
		outcome = null;
		if (app.documents.length > 0) {
			var doc = app.activeDocument;
			try {
				var df = doc.defaultFillColor, colorArray = [];
				var type = df.typename;
				if (type == "GrayColor") {
					colorArray = [df.gray];
				} else if (type == "RGBColor") {
					colorArray = [df.red, df.green, df.blue];
				} else if (type == "CMYKColor") {
					colorArray = [df.cyan,df.magenta, df.yellow, df.black];
				} else if (type == "GradientColor") {
					alert("Sorry, no gradient colors allowed.");
					type = null, colorArray = null;
				} else if (type == "SpotColor") {
					colorArray = df.spot.name;
				} else if (type == "PatternColor") {
					alert("Sorry, no Pattern colors allowed.");
					type = null, colorArray = null;
				}
			} catch (e) {
				alert("Sorry, couldn't set spec color to current FillColor due to: " + e);
				type = null;
				colorArray = null;
			}
			outcome = {
				type: type,
				colorArray: colorArray
			}.toSource();
		} else {
			alert("There isnt an open document!");
		}
	}
	function processDefaultFill (objString, args) {
		var cE = args[0], info = args[1];
		var obj = eval(objString);
		if (obj.type == "RGBColor") {
			var clr = [
				Math.round((obj.colorArray[0] / 255) * 100) / 100,
				Math.round((obj.colorArray[1] / 255) * 100) / 100, 
				Math.round((obj.colorArray[2] / 255) * 100) / 100
			];
			cE.pen = cE.penParent.newPen(cE.penParent.PenType.SOLID_COLOR, [clr[0], clr[1], clr[2], 1], 3);
			cE.canvasG.hide(); cE.canvasG.show();
			info.colortype = '"' + obj.type + '"';
			info.clr_1 = obj.colorArray[0];
			info.clr_2 = obj.colorArray[1];
			info.clr_3 = obj.colorArray[2];
		} else if (obj.type == "CMYKColor") {
			var clr = CMYKtoRGB(obj.colorArray[0], obj.colorArray[1], obj.colorArray[2], obj.colorArray[3]);
			cE.pen = cE.penParent.newPen(cE.penParent.PenType.SOLID_COLOR, [clr[0], clr[1], clr[2], 1], 3);
			cE.canvasG.hide(); cE.canvasG.show();
			info.colortype = '"' + obj.type + '"';
			info.clr_1 = obj.colorArray[0];
			info.clr_2 = obj.colorArray[1];
			info.clr_3 = obj.colorArray[2];
			info.clr_4 = obj.colorArray[3];
		} else if (obj.type == "GrayColor") {
			var grayValue = 1 - (Math.round(((obj.colorArray[0] / 100) * 255) * 100) / 100) / 255;
			var clr = [grayValue, grayValue, grayValue];
			cE.pen = cE.penParent.newPen(cE.penParent.PenType.SOLID_COLOR, [clr[0], clr[1], clr[2], 1], 3);
			cE.canvasG.hide();
			cE.canvasG.show();
			info.colortype = '"' + obj.type + '"';
			info.clr_1 = obj.colorArray[0];
		}
	}
	function drawArrows (canvas, myPen) {
		var ofstL = 10, ofstR = 80, top_1 = 15, top_2 = 43;
		canvas.newPath();
		canvas.moveTo(ofstL, top_1);
		canvas.lineTo(ofstR, top_1);
		canvas.closePath();
		canvas.strokePath(myPen);
		canvas.newPath();
		canvas.moveTo(ofstL, top_1);
		canvas.lineTo(ofstL, top_1 + 3);
		canvas.lineTo(ofstL - 3, top_1);
		canvas.lineTo(ofstL, top_1 - 3); 
		canvas.closePath();
		canvas.strokePath(myPen);
		canvas.newPath();
		canvas.moveTo(ofstR, top_1);
		canvas.lineTo(ofstR, top_1 + 3);
		canvas.lineTo(ofstR + 3, top_1);
		canvas.lineTo(ofstR, top_1 - 3); 
		canvas.closePath();
		canvas.strokePath(myPen);
		
		canvas.newPath();
		canvas.moveTo(ofstL - 2, top_2);
		canvas.lineTo(ofstR + 2, top_2);
		canvas.closePath();
		canvas.strokePath(myPen);
		canvas.newPath();
		canvas.moveTo(ofstL - 2, top_2 - 5);
		canvas.lineTo(ofstL - 2, top_2 + 5);
		canvas.closePath();
		canvas.strokePath(myPen);
		canvas.newPath();
		canvas.moveTo(ofstR + 2, top_2 - 5);
		canvas.lineTo(ofstR + 2, top_2 + 5);
		canvas.closePath();
		canvas.strokePath(myPen);
	}
	function bridgeTalkEncode( txt ) { 
		txt = encodeURIComponent( txt ); 
		txt = txt.replace(/\r/, "%0d"); 
		txt = txt.replace(/\n/, "%0a"); 
		txt = txt.replace(/\\/, "%5c"); 
		txt = txt.replace(/'/g, "%27"); 
		return txt.replace(/"/g, "%22"); 
	};
	/* Main messenger function */
	function paletteToAI () {
		outcome = null;
		if (app.documents.length > 0) {
			var doc = app.activeDocument;
			var sel = doc.selection;
			if (sel.length > 0) {
				var top, left, bottom, right;
				if (sel.length > 1) {
					alert("selection items : " + sel.length);
				} else {
					var item = sel[0];
					left = item.visibleBounds[0];
					top = item.visibleBounds[1];
					right = item.visibleBounds[2];
					bottom = item.visibleBounds[3];
					var cv = 1 * INFO.unitsRatio;
					var decimals = Math.pow(10, INFO.decimals);
					var pointWidth = -1 * (left - right);
					var pointHeight = top - bottom;
					var width = Math.round( - 1 * (left - right) * cv * decimals) / decimals;
					var height = Math.round((top - bottom) * cv * decimals) / decimals;
					var unitsName = INFO.unitsName;
					var proportionFactor = function () {
						var num = (pointWidth < pointHeight) ? pointWidth : pointHeight;
						if (num > 72) {
							return 1;
						} else {
							return (num > 10) ? num / 72:10 / 72;
						}
					}();
					INFO.procedure;
				}
			} else {
				alert("Please select an Art Object...");
				outcome = null;
			}
		} else {
			alert("There isnt an open document!");
			outcome = null;
		}
	}
	/* ---------------------------------------------------------------------------------------------- -Staying Variables */
	var os = function () {
		if ($.os.match('Windows')) {
			return 'Windows';
		} else {
			return 'Mac';
		}
	}();
	var version = parseInt(app.version);
	var UNITS = {
		self: "UNITS",
		_in: {ratio: 1 / 72, name: '"in"'},
		_mm: {ratio: 0.352777778, name: '"mm"'},
		_pt: {ratio: 1, name: '"pt"'}
	};
	var INFO = {
		self: "INFO",
		unitsRatio: UNITS._in.ratio,
		unitsName: UNITS._in.name,
		procedure: asSourceString(doNothing),
		decimals: 3,
		colortype: '"CMYKColor"',
		clr_1: 0,
		clr_2: 100,
		clr_3: 100,
		clr_4: 0,
		arrowType: 1,
	};
	var uiStuff = {};
	var colorElements = {};
	/* - - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -Palette - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - --- */
	var controlPalette = function () {
		var logo = "({total: 33, shape_33:{pathPoints:[[175, 7], [100, 7], [100, 6], [98, 6], [93, 6], [91, 6], [91, 7], [84, 7], [84, 6], [82, 6], [77, 6], [75, 6], [75, 7], [34, 7], [31, 5], [29, 5], [24, 5], [22, 5], [20, 7], [17, 7], [5, 28], [5, 29], [20, 29], [22, 31], [24, 31], [29, 31], [31, 31], [34, 29], [36, 29], [36, 31], [38, 31], [38, 31], [40, 31], [40, 29], [49, 29], [49, 31], [51, 31], [59, 31], [61, 31], [61, 29], [62, 29], [64, 31], [66, 31], [70, 31], [72, 31], [74, 29], [79, 29], [79, 31], [81, 31], [86, 31], [87, 31], [88, 31], [89, 31], [94, 31], [97, 31], [97, 29], [101, 29], [101, 31], [103, 31], [104, 31], [106, 31], [106, 29], [108, 29], [108, 31], [111, 31], [111, 31], [113, 31], [113, 29], [114, 29], [114, 31], [116, 31], [117, 31], [119, 31], [119, 29], [124, 29], [124, 31], [126, 31], [127, 31], [129, 31], [129, 29], [133, 29], [133, 31], [135, 31], [143, 31], [145, 31], [145, 29], [146, 29], [146, 31], [148, 31], [149, 31], [151, 31], [151, 29], [154, 29], [154, 31], [156, 31], [156, 31], [158, 31], [158, 29], [163, 29]], fillColor:null, strokeColor:[0.69, 0.7, 0.59], strokeWidth: 3},"+
		"shape_32:{pathPoints:[[17, 7], [5, 28], [5, 29], [163, 29], [175, 7]], fillColor:[0, 0.84, 0.87], strokeColor:null},"+
		"shape_31:{pathPoints:[[19, 28], [22, 31], [29, 31], [32, 28], [32, 19], [29, 16], [23, 16], [23, 9], [29, 9], [29, 11], [32, 11], [32, 8], [29, 5], [22, 5], [19, 8], [19, 17], [22, 20], [29, 20], [29, 27], [23, 27], [23, 25], [19, 25]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_30:{pathPoints:[[43, 10], [36, 10], [36, 31], [38, 31], [38, 22], [43, 22], [46, 20], [46, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_29:{pathPoints:[[45, 19], [38, 19], [38, 13], [45, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_28:{pathPoints:[[59, 13], [59, 10], [49, 10], [49, 31], [59, 31], [59, 28], [52, 28], [52, 22], [56, 22], [56, 19], [52, 19], [52, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_27:{pathPoints:[[72, 16], [72, 13], [70, 10], [64, 10], [62, 13], [62, 28], [64, 31], [70, 31], [72, 28], [72, 25], [69, 25], [69, 28], [65, 28], [65, 13], [69, 13], [69, 16]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_26:{pathPoints:[[77, 10], [80, 27], [79, 27], [79, 31], [86, 31], [86, 27], [84, 27], [87, 22], [89, 27], [87, 27], [87, 31], [94, 31], [94, 27], [93, 27], [96, 10], [98, 10], [98, 6], [91, 6], [91, 10], [93, 10], [90, 21], [89, 13], [87, 13], [83, 21], [80, 10], [82, 10], [82, 6], [75, 6], [75, 10]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_25:{pathPoints:[[111, 13], [109, 10], [101, 10], [101, 31], [104, 31], [104, 22], [108, 22], [108, 31], [111, 31], [111, 21], [111, 21], [111, 20]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_24:{pathPoints:[[111, 19], [104, 19], [104, 13], [111, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_23:{pathPoints:[[114, 10], [114, 31], [117, 31], [117, 10]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_22:{pathPoints:[[120, 10], [120, 13], [124, 13], [124, 31], [127, 31], [127, 13], [130, 13], [130, 10]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_21:{pathPoints:[[143, 13], [143, 10], [133, 10], [133, 31], [143, 31], [143, 28], [136, 28], [136, 22], [140, 22], [140, 19], [136, 19], [136, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_20:{pathPoints:[[156, 13], [154, 10], [146, 10], [146, 31], [149, 31], [149, 22], [154, 22], [154, 31], [156, 31], [156, 21], [156, 21], [156, 20]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_19:{pathPoints:[[156, 19], [149, 19], [149, 13], [156, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_18:{pathPoints:[[22, 28], [24, 31], [31, 31], [34, 28], [34, 19], [31, 16], [25, 16], [25, 9], [31, 9], [31, 11], [34, 11], [34, 8], [31, 5], [24, 5], [22, 8], [22, 17], [24, 20], [31, 20], [31, 27], [25, 27], [25, 25], [22, 25]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_17:{pathPoints:[[74, 16], [74, 13], [72, 10], [66, 10], [64, 13], [64, 28], [64, 29], [66, 31], [72, 31], [74, 29], [74, 28], [74, 25], [71, 25], [71, 28], [67, 28], [67, 13], [71, 13], [71, 16]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_16:{pathPoints:[[51, 10], [51, 31], [61, 31], [61, 28], [54, 28], [54, 22], [58, 22], [58, 19], [54, 19], [54, 13], [61, 13], [61, 10]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_15:{pathPoints:[[45, 10], [38, 10], [38, 31], [40, 31], [40, 22], [45, 22], [48, 20], [48, 13]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_14:{pathPoints:[[45, 19], [40, 19], [40, 13], [45, 13]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_13:{pathPoints:[[79, 10], [82, 27], [81, 27], [81, 31], [88, 31], [88, 27], [86, 27], [89, 22], [91, 27], [89, 27], [89, 31], [97, 31], [97, 27], [95, 27], [98, 10], [100, 10], [100, 6], [93, 6], [93, 10], [95, 10], [92, 21], [89, 13], [85, 21], [82, 10], [84, 10], [84, 6], [77, 6], [77, 10]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_12:{pathPoints:[[113, 13], [111, 10], [103, 10], [103, 31], [106, 31], [106, 22], [111, 22], [111, 31], [113, 31], [113, 21], [113, 21], [113, 20]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_11:{pathPoints:[[106, 19], [106, 13], [111, 13], [111, 19]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_10:{pathPoints:[[116, 10], [116, 31], [119, 31], [119, 10]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_9:{pathPoints:[[122, 10], [122, 13], [126, 13], [126, 31], [129, 31], [129, 13], [132, 13], [132, 10]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_8:{pathPoints:[[145, 13], [145, 10], [135, 10], [135, 31], [145, 31], [145, 28], [138, 28], [138, 22], [142, 22], [142, 19], [138, 19], [138, 13]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_7:{pathPoints:[[158, 13], [156, 10], [148, 10], [148, 31], [151, 31], [151, 22], [156, 22], [156, 31], [158, 31], [158, 21], [158, 21], [158, 20]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_6:{pathPoints:[[151, 19], [151, 13], [156, 13], [156, 19]], fillColor:[0.94, 0.35, 0.16], strokeColor:null},"+
		"shape_5:{pathPoints:[[45, 13], [45, 19], [43, 19], [43, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_4:{pathPoints:[[156, 13], [156, 19], [154, 19], [154, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_3:{pathPoints:[[111, 13], [111, 19], [108, 19], [108, 13]], fillColor:[0.62, 0.18, 0], strokeColor:null},"+
		"shape_2:{pathPoints:[[43, 19], [40, 19], [40, 13], [43, 13]], fillColor:[0, 0.84, 0.87], strokeColor:null},"+
		"shape_1:{pathPoints:[[108, 19], [106, 19], [106, 13], [108, 13]], fillColor:[0, 0.84, 0.87], strokeColor:null},"+
		"shape_0:{pathPoints:[[154, 19], [151, 19], [151, 13], [154, 13]], fillColor:[0, 0.84, 0.87], strokeColor:null}})";
		var w = new Window('palette', 'Spec Writer™', undefined, { closeButton : true });
		w.margins = [5, 3, 5, 8];
		w.spacing = 2;
		var logoG = w.add('group');
		var logoP = logoG.add('panel', [0, 0, 184, 40], '', { borderStyle : 'sunken' });
		logoP.onDraw = function () {
			drawFromObjString(logo, this);
		}
		var tabG = w.add('tabbedpanel');
		var controlsG = tabG.add('tab', undefined, 'Controls');
		var unitsG = controlsG.add('group');
		unitsG.orientation = 'row';
		var unitsH = unitsG.add('statictext', undefined, 'Units:');
		var unitsDD = unitsG.add('dropdownlist', undefined, ['in', 'mm', 'pt']);
		unitsDD.selection = unitsDD.items[0];
		var decimalsG = controlsG.add('group');
		var decimalsH = decimalsG.add('statictext', undefined, 'Decimals:');
		var decimalsDD = decimalsG.add('dropdownlist', undefined, [0, 1, 2, 3, 4]);
		decimalsDD.selection = decimalsDD.items[3];
		var selObjG = controlsG.add('panel', undefined, 'Target Object(s):');
		selObjG.size = [150, 140];
		if (os == 'Windows') {
			selObjG.size = [150, 120]; 
		}
		if (os == 'Mac' && version < 17) {
			selObjG.margins = [4, 30, 4, 4];
		} else {
			selObjG.margins = [4, 20, 4, 4];
		}
		var wG = selObjG.add('group');
		var wH = wG.add('statictext', undefined, 'Width');
		var wE = wG.add('edittext', undefined, '', { readonly : true });
		wE.characters = 10;
		var hG = selObjG.add('group');
		var hH = hG.add('statictext', undefined, 'Height');
		var hE = hG.add('edittext' , undefined, '', { readonly : true });
		hE.characters = 10;
		var refreshBtn = selObjG.add('button', undefined, 'Capture Object');
		var optsG = tabG.add('tab', undefined, 'Options');
		var specArrowP = optsG.add('panel', undefined, "Arrows:");
		specArrowP.orientation = 'row';
		specArrowP.size = [164, 90];
		var arrowSelect = specArrowP.add('group', [0, 10, 20, 60]);
		arrowSelect.orientation = 'column';
		var type_1 = arrowSelect.add('radiobutton', undefined);
		type_1.value = true;
		var type_2 = arrowSelect.add('radiobutton', undefined);
		arrowSelect.addEventListener('mousedown', function (ev) {
			if (ev.target == type_1) {
				type_2.value = false; type_1.value = true;
				INFO.arrowType = 1;
			} else if (ev.target == type_2) {
				type_1.value = false; type_2.value = true;
				INFO.arrowType = 2;
			}
		});
		var specArrowG = specArrowP.add('group');
		specArrowG.size = [90, 60];
		if (os == 'Windows') {
			arrowSelect.margins = [2, 3, 2, 2];
			var windowsGroupShowingCrap = specArrowG.add('statictext', undefined, '');
		}
		var arrowPic = specArrowG.graphics;
		colorElements.pen = arrowPic.newPen(arrowPic.PenType.SOLID_COLOR, [1, 0, 0, 1], 3);

		specArrowG.onDraw = function () {
			var myPen = colorElements.pen;
			drawArrows(arrowPic, myPen);
		}
		var colorChoicesP = optsG.add('panel', undefined, 'Colors');
		var colorChoicesG = colorChoicesP.add('group');
		colorChoicesP.size = [164, 100];
		colorChoicesP.margins = [2, 20, 2, 2];
		if (os == 'Windows') {
			colorChoicesP.size = [164, 80];
		}
		var red = colorChoicesG.add('panel');
		var redG = red.add('group');
		red.margins = [0, 0, 0, 0];
		redG.size = [16, 10];
		red.graphics.backgroundColor = red.graphics.newBrush(red.graphics.BrushType.SOLID_COLOR, [1, 0, 0]);
		red.helpTip = "CMYK Red: C: 0, M: 100, Y: 100, K: 0";
		red.colortype = '"CMYKColor"';
		red.clr_1 = 0;
		red.clr_2 = 100;
		red.clr_3 = 100;
		red.clr_4 = 0;
		var cyan = colorChoicesG.add('panel');
		var cyanG = cyan.add('group');
		cyan.margins = [0, 0, 0, 0];
		cyanG.size = [16, 10];
		cyan.graphics.backgroundColor = cyan.graphics.newBrush(cyan.graphics.BrushType.SOLID_COLOR, [0, 0.8, 1]);
		cyan.helpTip = "CMYK Cyan: C: 100, M: 0, Y: 0, K: 0";
		cyan.colortype = '"CMYKColor"';
		cyan.clr_1 = 100;
		cyan.clr_2 = 0;
		cyan.clr_3 = 0;
		cyan.clr_4 = 0;
		var black = colorChoicesG.add('panel');
		var blackG = black.add('group');
		black.margins = [0, 0, 0, 0];
		blackG.size = [16, 10];
		black.graphics.backgroundColor = black.graphics.newBrush(black.graphics.BrushType.SOLID_COLOR, [0, 0, 0]);
		black.helpTip = "CMYK Black: C: 0, M: 0, Y: 0, K: 100";
		black.colortype = '"CMYKColor"';
		black.clr_1 = 0;
		black.clr_2 = 0;
		black.clr_3 = 0;
		black.clr_4 = 100;
		var yellow = colorChoicesG.add('panel');
		var yellowG = yellow.add('group');
		yellow.margins = [0, 0, 0, 0];
		yellowG.size = [16, 10];
		yellow.graphics.backgroundColor = yellow.graphics.newBrush(yellow.graphics.BrushType.SOLID_COLOR, [1, 1, 0]);
		yellow.helpTip = "CMYK Yellow: C: 0, M: 0, Y: 100, K: 0";
		yellow.colortype = '"CMYKColor"';
		yellow.clr_1 = 0;
		yellow.clr_2 = 0;
		yellow.clr_3 = 100;
		yellow.clr_4 = 0;
		var defaultFill = colorChoicesP.add('button', undefined, "Current Fill Color");
		var colorChoices = [red, cyan, yellow, black];
		for (var i = 0; i < colorChoices.length; i++) {
			var thisColor = colorChoices[i];
			thisColor.addEventListener('mousedown', function () {
				var clr = this.graphics.backgroundColor.color;
				colorElements.pen = arrowPic.newPen(arrowPic.PenType.SOLID_COLOR, [clr[0], clr[1], clr[2], 1], 3);
				specArrowG.hide();
				specArrowG.show();
				INFO.colortype = this.colortype;
				INFO.clr_1 = this.clr_1;
				INFO.clr_2 = this.clr_2;
				INFO.clr_3 = this.clr_3;
				INFO.clr_4 = this.clr_4;
			});
		}
		var specsBtn = w.add('button', undefined, "Put Specs");
	/* - - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - -- - - Event Handlers */
		uiStuff.wE = wE;
		uiStuff.hE = hE;
		colorElements.penParent = arrowPic;
		colorElements.canvasG = specArrowG;
		defaultFill.addEventListener('mousedown', function () {
			sendBTmsg(getDefaultFill, undefined, processDefaultFill, [colorElements, INFO]);
		});
		unitsDD.addEventListener('change', function () {
			if (this.selection == null) {
				this.selection = this.items[0];
			}
		});
		decimalsDD.addEventListener('change', function () {
			if (this.selection == null) {
				this.selection = this.items[0];
			}
		});
		refreshBtn.addEventListener('mousedown', function () { /* REFRESH */
			try {
				INFO.unitsRatio = UNITS['_' + unitsDD.selection.text].ratio;
				INFO.unitsName = UNITS['_' + unitsDD.selection.text].name;
				INFO.procedure = asSourceString(returnRefresh);
				INFO.decimals = decimalsDD.selection.text;
				sendBTmsg(paletteToAI, INFO, processRefresh, [uiStuff]);
			} catch (e) {
				alert("SpecWriter Refresh error:\r" + e);
			}
		});
		specsBtn.addEventListener('mousedown', function () { /* Real Specs */
			try {
				INFO.unitsRatio = UNITS['_' + unitsDD.selection.text].ratio;
				INFO.unitsName = UNITS['_' + unitsDD.selection.text].name;
				INFO.decimals = decimalsDD.selection.text;
				INFO.procedure = asSourceString(putSpecs);
				sendBTmsg(paletteToAI, INFO, processRefresh, [uiStuff]);
			} catch (e) {
				alert("SpecWriter Write error:\r" + e);
			}
		});
		var windowObj = {
			w: w,
			show: function () { this.w.show(); },
		}
		return windowObj;
	}();
	controlPalette.show();
}
#target illustrator
#targetengine main
main();
