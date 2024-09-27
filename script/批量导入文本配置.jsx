// 检查是否有文档打开
if (app.documents.length > 0) {
    var doc = app.activeDocument; // 获取当前活动文档
        // 选择要导入的 JSON 配置文件
        var jsonFile = File.openDialog("请选择一个配置好的语言的JSON文件", "*.json");
        if (jsonFile !== null) {
            // 选择导出的路径
            var exportPath = Folder.selectDialog("请选择一个导出的文件夹");
            if (exportPath !== null) {
      
            jsonFile.open("r");
            var jsonData = jsonFile.read();
            jsonFile.close();

            // 解析 JSON 数据
            var textData = parseJson(jsonData); // 使用手动实现的 parseJson 函数

            // 遍历 JSON 数据，更新相应的文本框内容及样式
            for (var i = 0; i < textData.length; i++) {
                var languageData = textData[i];
                var textList = languageData.text_list;
                var languageName = languageData['language'];

                // 获取当前文档的文本框
                var textItems = doc.textFrames;

                // 确保文本框数量和文本内容匹配
                for (var j = 0; j < textList.length && j < textItems.length; j++) {
                    var textObject = textList[j];
                    var textFrame = textItems[j];
                    textFrame.contents = textObject.content; // 更新文本框内容

                    // 确保文本框有内容再设置样式
                    if (textFrame.contents.length > 0) {
                        var charAttributes = textFrame.textRange.characterAttributes;

                        // 验证字体是否存在
                        try {
                            var font = app.textFonts.getByName(textObject.font);
                            charAttributes.textFont = font; // 设置字体
                        } catch (e) {
                            alert("字体没有找到：" + textObject.font );
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
                    } else {
                        alert(languageName+"：没有找到要设置的文本信息，id为" + textObject.id);
                    }
                }

                // 导出新 AI 文件
                var newFile = new File(exportPath + "/" + languageName + '.ai');
                var saveOptions = new IllustratorSaveOptions();
                doc.saveAs(newFile, saveOptions);
            }

            // 提示用户操作已完成
            alert("恭喜，所有文件生成导出到： " + exportPath);
        } else {
            alert("没有选择导出的文件夹，程序退出");
        }
    } else { 
        alert("没有选择JSON文件，程序退出");
    }
} else {
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
