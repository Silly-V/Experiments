#target illustrator
/**
 * Creates or edits named document swatches according to a colorway image copied from LinkedIn's Adobe Tips & Tricks group.
 * By Vasily Hall    
 */
function LinkedInAdobeIllustratorColors () {
    var scriptName = "LinkedInAdobeIllustratorColors";
    var scriptVersion = "0.0.1";
    var setName = "LinkedInIllustratorColors";
    var traceAction = "/version 3" +
        "/name [ 25" +
        "	4c696e6b6564496e496c6c7573747261746f72436f6c6f7273" +
        "]" +
        "/isOpen 1" +
        "/actionCount 1" +
        "/action-1 {" +
        "	/name [ 5" +
        "		7472616365" +
        "	]" +
        "	/keyIndex 0" +
        "	/colorIndex 0" +
        "	/isOpen 1" +
        "	/eventCount 1" +
        "	/event-1 {" +
        "		/useRulersIn1stQuadrant 0" +
        "		/internalName (ai_plugin_tracing)" +
        "		/localizedName [ 13" +
        "			496d6167652054726163696e67" +
        "		]" +
        "		/isOpen 1" +
        "		/isOn 1" +
        "		/hasDialog 0" +
        "		/parameterCount 1" +
        "		/parameter-1 {" +
        "			/key 1835363957" +
        "			/showInPalette -1" +
        "			/type (enumerated)" +
        "			/name [ 0" +
        "" +
        "			]" +
        "			/value 1" +
        "		}" +
        "	}" +
        "}";
    
    function applyLiveTrace () {
        try {
            app.unloadAction(setName, "");
        } catch (e) { }
        aiaFile = new File('~/LinkedInIllustratorColors.aia');
        aiaFile.open("w");
        aiaFile.write(traceAction);
        aiaFile.close();
        app.loadAction(aiaFile);
        aiaFile.remove();
        app.doScript("trace", setName);
        app.redraw();
        var tracedItem = doc.selection[0].tracing;
        tracedItem.tracingOptions.tracingMode = TracingModeType.TRACINGMODECOLOR;
        tracedItem.tracingOptions.fills = true;
        tracedItem.tracingOptions.tracingColorType = TracingColorType.TRACINGLIMITEDCOLOR;
        tracedItem.tracingOptions.strokes = false;
        tracedItem.tracingOptions.tracingColors = 6;
        tracedItem.tracingOptions.tracingMethodType = TracingMethodType.TRACINGMETHODOVERLAPPING;
        tracedItem.expandTracing();
    }
    function gatherFillColorsOfBlocks () {
        var expandedTraceItem = tempLayer.groupItems[0];
        var foundBlocks = [];
        for (var i = expandedTraceItem.compoundPathItems.length - 1; i > -1; i --) {
            var thisCompoundPath = expandedTraceItem.compoundPathItems[i];
            if (thisCompoundPath.width > 100 && foundBlocks.length < 5) {
                foundBlocks.push(thisCompoundPath);
            }
        }
        foundBlocks.sort(function (a, b) {
            return a.top < b.top ? 1 : 0;
        });
        var foundFillColors = [];
        for (var i = 0; i < foundBlocks.length; i++) {
            var block = foundBlocks[i];
            var fillColor = block.pathItems[0].fillColor;
            foundFillColors.push(fillColor);
        }
        return foundFillColors;
    }
    function getSettingsFile () {
        var documentsFolder = Folder.myDocuments;
        var adobeScriptsFolder = Folder(documentsFolder + "/Adobe Scripts");
        if (!adobeScriptsFolder.exists) {
            adobeScriptsFolder.create();
        }
        var settingsFile = File(adobeScriptsFolder + "/LinkedInAdobeIllustratorColors_SETTINGS.xml");
        return settingsFile;
    }
    function initializeScriptData () {
        var settingsFile = getSettingsFile();
        if (!settingsFile.exists) {
            writeSettingsFile(storedDataXML);
        } else {
            var storedDataString = "";
            settingsFile.open("r");
            storedDataString = settingsFile.read();
            settingsFile.close();
            storedDataXML = new XML(storedDataString);
            usedNames = [
                storedDataXML.scriptSettings.colorNames.c1,
                storedDataXML.scriptSettings.colorNames.c2,
                storedDataXML.scriptSettings.colorNames.c3,
                storedDataXML.scriptSettings.colorNames.c4,
                storedDataXML.scriptSettings.colorNames.c5,
            ];
        }
    }
    function writeSettingsFile (settings) {
        var settingsFile = getSettingsFile();
        settingsFile.open("w");
        settingsFile.write(
            <scriptSettings>
                <scriptName>
                    {scriptName}
                </scriptName>
                <scriptVersion>
                    {scriptVersion}
                </scriptVersion>
                <colorNames>
                    <c1>{settings.colorNames.c1}</c1>
                    <c2>{settings.colorNames.c2}</c2>
                    <c3>{settings.colorNames.c3}</c3>
                    <c4>{settings.colorNames.c4}</c4>
                    <c5>{settings.colorNames.c5}</c5>
                </colorNames>
            </scriptSettings>
            .toString()
        );
        settingsFile.close();
    }
    function createOrEditSwatches (doc, newFills, usedNames) {
        for (var i = 0; i < newFills.length; i++) {
            var colorName = usedNames[i];
            var fill = newFills[i];
            try {
                var existingSpot = doc.spots.getByName(colorName);
                existingSpot.color = fill;
                existingSpot.colorType = ColorModel.PROCESS;
            } catch (e) {
                var swatchGroup = null;
                try {
                    swatchGroup = doc.swatchGroups.getByName(setName);
                } catch (e) {
                    swatchGroup = doc.swatchGroups.add();
                    swatchGroup.name = setName;
                }
                var newSpot = doc.spots.add();
                newSpot.name = colorName;
                newSpot.color = fill;
                newSpot.colorType = ColorModel.PROCESS;
                swatchGroup.addSpot(newSpot);
            }
        }
    }
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
    function scriptAlert (message) {
        alert(
            scriptName + " " + scriptVersion +
            message
        );
    }
    function uiDialog () {
        var w = new Window("dialog", scriptName + " " + scriptVersion);
        w.spacing = 4;
        var p0 = w.add("panel", undefined, "Instructions");
        p0.size = [300, 200];
        var instructionText = p0.add("statictext", undefined, "First, go to LinkedIn and copy a colorway image.\n" +
            "Then, run this script in the open Illustrator document.\n" +
            "If swatches named by the list below are in the document, their values will be changed and any shapes colored with these colors will change color.\n" +
            "If the swatches do not exist in the document, they will be created."
            , { multiline : true });
        instructionText.size = [280, 200];
        var hsep = w.add("panel", undefined);
        hsep.size = [300, 1];
        var p1 = w.add("panel", undefined, "Swatch Names");
        p1.size = [300, 200];
        p1.helptip = "Swatch names are by index, top color of the image is 1st on the list";
        var inputs = [];
        for (var i = 0; i < 5; i++) {
            var newRowGroup = p1.add("group");
            var lbl = newRowGroup.add("statictext", undefined, "Swatch " + (i + 1));
            var input = newRowGroup.add("edittext", undefined, storedDataXML.colorNames["c" + (i + 1)]);
            input.characters = 20;
            inputs.push(input);
        }
        var g_btn = w.add("group");
        var btn_cancel = g_btn.add("button", undefined, "Cancel");
        var btn_ok = g_btn.add("button", undefined, "Ok");
        if (w.show() === 2) {
            return null;
        } else {
            for (var i = 0; i < inputs.length; i++) {
                var thisInput = inputs[i];
                var thisInputText = thisInput.text.trim();
                if (thisInputText) {
                    usedNames[i] = thisInputText;
                } else {
                    usedNames[i] = "";
                }
            }
            writeSettingsFile({ colorNames : {
                c1 : usedNames[0],
                c2 : usedNames[1],
                c3 : usedNames[2],
                c4 : usedNames[3],
                c5 : usedNames[4],
            }});
            return true;
        }
    }
    if (app.documents.length === 0) {
        alert("Please open a document first.");
        return;
    }
    var doc = app.activeDocument;
    var defaultNames = ["c1", "c2", "c3", "c4", "c5"];
    var storedDataXML = <scriptSettings>
        <scriptName>
            {scriptName}
        </scriptName>
        <scriptVersion>
            {scriptVersion}
        </scriptVersion>
        <colorNames>
            <c1>{defaultNames[0]}</c1>
            <c2>{defaultNames[1]}</c2>
            <c3>{defaultNames[2]}</c3>
            <c4>{defaultNames[3]}</c4>
            <c5>{defaultNames[4]}</c5>
        </colorNames>
    </scriptSettings>;
    var usedNames = defaultNames.slice();
    try {
        initializeScriptData();
        var uiResult = uiDialog();
        if (!uiResult) { return; }
        doc.selection = null;
        var tempLayerName = "TEMP|||TEMP";
        try {
            doc.layers.getByName(tempLayerName).remove();
        } catch (e) {}
        var tempLayer = doc.layers.add();
        tempLayer.name = tempLayerName;
        app.paste();
        if (doc.selection.length === 0 || doc.selection[0].typename !== "RasterItem") {
            tempLayer.remove();
            throw new Error("Pasted LinkedIn Illustrator Colorway image not detected.");
        }
        var colorwayImage = doc.selection[0];
        colorwayImage.move(tempLayer, ElementPlacement.INSIDE);
        applyLiveTrace();
        var fills = gatherFillColorsOfBlocks();
        createOrEditSwatches(doc, fills, usedNames);
        tempLayer.remove();
    } catch (e) {
        scriptAlert(
            "\nThere was a problem applying the LinkedIn colors to the Illustrator document:\n" + e.message
        );
    }
};
LinkedInAdobeIllustratorColors();
