if (app.documents.length > 0) {  
    // 从桌面选择 JSON 文件
    var jsonFile = File.openDialog("请选择一个导出的 JSON 文件", "*.json");
    if (jsonFile !== null) {
        jsonFile.open("r");
        var jsonData = jsonFile.read();
        jsonFile.close();

        // 解析 JSON 数据
        var importedData = JSON.parse(jsonData);

        // 获取当前文档中的所有文本框
        var doc = app.activeDocument;
        var textItems = doc.textFrames;

        // 遍历 JSON 数据并更新文档中的文本框
        for (var i = 0; i < importedData.length; i++) {
            var textObject = importedData[i];
            var targetId = textObject.id;  // 使用 JSON 中的 id 来确定文本框

            if (targetId < textItems.length) {
                var textFrame = textItems[targetId];
                textFrame.contents = textObject.content;  // 更新文本框内容

                // 更新字体和字体大小
                var charAttributes = textFrame.textRange.characterAttributes;
                charAttributes.textFont = app.textFonts.getByName(textObject.font);
                charAttributes.size = textObject.size;

                // 更新颜色
                var newColor = hexToRgb(textObject.fillColor);
                var fillColor = new RGBColor();
                fillColor.red = newColor.r;
                fillColor.green = newColor.g;
                fillColor.blue = newColor.b;
                charAttributes.fillColor = fillColor;
            }
        }

        alert("文本框颜色和内容已根据 JSON 文件更新");
    } else {
        alert("没有选择 JSON 文件，程序退出");
    }
} else { 
    alert("当前无被打开的文件，程序退出");
}

// HEX 转 RGB 函数
function hexToRgb(hex) {
    var bigint = parseInt(hex.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return { r: r, g: g, b: b };
}
