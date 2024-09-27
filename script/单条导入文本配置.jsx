

if (app.documents.length > 0) {  
    // 从桌面选择 JSON 文件
    var jsonFile = File.openDialog("请选择一个配置好的批量JSON文件", "*.json");
    if (jsonFile !== null) {
        jsonFile.open("r");
        var jsonData = jsonFile.read();
        jsonFile.close();

        // 解析 JSON 数据
        var textData = parseJson(jsonData); // 使用手动实现的 parseJson 函数

        // 获取文档中的所有文本框
        var doc = app.activeDocument;
        var textItems = doc.textFrames;

        // 遍历 JSON 数据，更新相应的文本框内容及样式
        for (var i = 0; i < textData.length; i++) {
            var textObject = textData[i];
            if (i < textItems.length) {
                var textFrame = textItems[i];
                textFrame.contents = textObject.content; // 更新文本框内容
                
                // 更新文本样式
                var charAttributes = textFrame.textRange.characterAttributes;
                
                // 验证字体是否存在
                try {
                    var font = app.textFonts.getByName(textObject.font);
                    charAttributes.textFont = font; // 设置字体
                } catch (e) {
                    alert("字体没有找到：" + textObject.font," 改用默认字体Arial-Black" ); 
                    // 使用默认字体
                    charAttributes.textFont = app.textFonts.getByName("Arial-Black"); // 或其他默认字体
                }

                charAttributes.size = textObject.size;

                // 将 HEX 颜色转换为 RGB
                var rgbColor = hexToRgb(textObject.fillColor);
                var fillColor = new RGBColor();
                fillColor.red = rgbColor.r;
                fillColor.green = rgbColor.g;
                fillColor.blue = rgbColor.b;
                charAttributes.fillColor = fillColor;
            }
        }

        // 提示用户操作已完成
        
        alert("恭喜，文本信息已替换"); 
    } else {
        alert("没有选择JSON文件，程序退出");
    }

}else { 
    alert("当前无被打开的文件,程序退出");
}

// 简单实现 JSON.parse
function parseJson(jsonString) {
    return eval('(' + jsonString + ')'); // 使用 eval 函数解析 JSON 字符串
}

// HEX 转 RGB 函数
function hexToRgb(hex) {
    var bigint = parseInt(hex.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return { r: r, g: g, b: b };
}
