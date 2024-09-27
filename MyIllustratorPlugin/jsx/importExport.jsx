// 导出文本功能
function exportText() {
    var doc = app.activeDocument;
    var textFrames = doc.textFrames;
    var exportData = [];

    // 遍历所有文本框
    for (var i = 0; i < textFrames.length; i++) {
        var frame = textFrames[i];
        var item = {
            id: i,
            content: frame.contents,
            font: frame.textRange.characterAttributes.textFont.name,
            size: frame.textRange.characterAttributes.size,
            fillColor: rgbToHex(frame.textRange.characterAttributes.fillColor)
        };
        exportData.push(item);
    }

    // 将 JSON 数据写入文件
    var jsonFile = new File("~/Desktop/exportedText.json");
    jsonFile.open("w");
    jsonFile.write(JSON.stringify(exportData, null, 4));
    jsonFile.close();
}

// 导入文本功能
function importText() {
    var jsonFile = File.openDialog("Select a JSON file to import", "*.json");
    if (jsonFile !== null) {
        jsonFile.open("r");
        var jsonData = jsonFile.read();
        jsonFile.close();

        var textData = eval('(' + jsonData + ')');
        var textFrames = app.activeDocument.textFrames;

        for (var i = 0; i < textData.length; i++) {
            var textObject = textData[i];
            if (i < textFrames.length) {
                var textFrame = textFrames[i];
                textFrame.contents = textObject.content;
                var charAttributes = textFrame.textRange.characterAttributes;
                
                try {
                    var font = app.textFonts.getByName(textObject.font);
                    charAttributes.textFont = font;
                } catch (e) {
                    alert("Font '" + textObject.font + "' not found.");
                }

                charAttributes.size = textObject.size;
                charAttributes.fillColor = hexToRgb(textObject.fillColor);
            }
        }
    } else {
        alert("No JSON file selected.");
    }
}

// HEX to RGB 转换
function hexToRgb(hex) {
    var bigint = parseInt(hex.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    var rgbColor = new RGBColor();
    rgbColor.red = r;
    rgbColor.green = g;
    rgbColor.blue = b;
    return rgbColor;
}

// RGB to HEX 转换
function rgbToHex(rgbColor) {
    var r = Math.round(rgbColor.red).toString(16).padStart(2, '0');
    var g = Math.round(rgbColor.green).toString(16).padStart(2, '0');
    var b = Math.round(rgbColor.blue).toString(16).padStart(2, '0');
    return "#" + r + g + b;
}
