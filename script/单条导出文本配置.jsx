// 获取当前文档中的所有文本框


if (app.documents.length > 0) { 
    var doc = app.activeDocument;
    var textItems = doc.textFrames;
    var textData = [];

    // 遍历所有文本框，并将文本内容与样式存储为对象
    for (var i = 0; i < textItems.length; i++) {
        var textFrame = textItems[i];
        var fillColor = textFrame.textRange.characterAttributes.fillColor;

        // 将 RGBColor 转换为 HEX 格式
        var hexColor = rgbToHex(fillColor.red, fillColor.green, fillColor.blue);
        
        var textObject = {
            id: i,
            content: textFrame.contents,
            font: textFrame.textRange.characterAttributes.textFont.name,
            size: textFrame.textRange.characterAttributes.size,
            fillColor: hexColor // 使用 HEX 颜色
        };
        textData.push(textObject);
    }

    // 使用手动实现的 stringify 替代 JSON.stringify
    var jsonString = stringify(textData);

    // 保存 JSON 文件到桌面，并设置为 UTF-8 编码
    var file = new File(Folder.desktop + "/ai单条文本配置.json");
    file.encoding = "UTF-8";  // 设置文件编码为 UTF-8
    file.open("w");
    file.write(jsonString);
    file.close();

    // 提示用户文件已导出
    alert("文件已经导出到: " + file.fsName); 
} else { 
    alert("当前无被打开的文件,程序退出");
}



// 实现简化版 JSON.stringify 函数
function stringify(obj) {
    if (typeof obj !== "object" || obj === null) {
        if (typeof obj === "string") return '"' + obj + '"';
        else return String(obj);
    } else {
        var json = [];
        var isArrayCheck = isArray(obj);  // 使用手动实现的 isArray 函数
        for (var key in obj) {
            var value = obj[key];
            var type = typeof value;
            var keyStr = isArrayCheck ? "" : '"' + key + '":';
            if (type === "object" && value !== null) {
                json.push(keyStr + stringify(value)); // 递归处理对象
            } else if (type === "string") {
                json.push(keyStr + '"' + value + '"'); // 处理字符串
            } else {
                json.push(keyStr + String(value)); // 处理数字或布尔值
            }
        }
        return (isArrayCheck ? "[" : "{") + json.join(",") + (isArrayCheck ? "]" : "}");
    }
}

// 手动实现 isArray 函数
function isArray(obj) {
    return obj && obj.constructor === Array;
}

// RGB 转 HEX 函数
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}
