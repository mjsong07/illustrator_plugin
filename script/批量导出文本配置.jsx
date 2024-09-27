// 获取当前文档中的所有文本框
var doc = app.activeDocument;
var textItems = doc.textFrames;
var allTextData = [];

// 选择国家语言
var languages = ["Chinese", "English", "Spanish", "French", "German"]; // 可以根据需要添加更多语言
var selectedLanguages = getSelectedLanguages(languages);

if (selectedLanguages.length > 0) {
    // 为每种语言创建一个对象
    for (var j = 0; j < selectedLanguages.length; j++) {
        var lang = selectedLanguages[j];
        var languageData = {
            language: lang,
            text_list: []
        };

        // 遍历所有文本框，并将文本内容与样式存储为对象
        for (var i = 0; i < textItems.length; i++) {
            var textFrame = textItems[i];

            // 创建文本对象
            var textObject = {
                id: i , // 使用 i + 1 作为 ID
                content: textFrame.contents,
                font: textFrame.textRange.characterAttributes.textFont.name,
                size: textFrame.textRange.characterAttributes.size,
                fillColor: rgbToHex(textFrame.textRange.characterAttributes.fillColor.red, 
                                    textFrame.textRange.characterAttributes.fillColor.green, 
                                    textFrame.textRange.characterAttributes.fillColor.blue)
            };
            languageData.text_list.push(textObject); // 将文本对象添加到当前语言的文本列表中
        }

        allTextData.push(languageData); // 将语言对象添加到总数据中
    }

    // 使用手动实现的 stringify 替代 JSON.stringify
    var jsonString = stringify(allTextData);

    // 保存 JSON 文件到桌面，并设置为 UTF-8 编码
    var file = new File(Folder.desktop + "/ai批量文本配置.json");
    file.encoding = "UTF-8";  // 设置文件编码为 UTF-8
    file.open("w");
    file.write(jsonString);
    file.close();

    // 提示用户文件已导出
    alert("文件已经导出到：" + file.fsName);
} else {
    alert("当前无被打开的文件,程序退出");
}

// 实现简单版 JSON.stringify 函数
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

// RGB 转 HEX 函数
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

// 获取用户选择的语言
function getSelectedLanguages(languages) {
    var dialog = new Window('dialog', '选择语言');
    var selected = [];

    // 创建复选框
    for (var i = 0; i < languages.length; i++) {
        dialog.add('checkbox', undefined, languages[i]);
    }

    dialog.add('button', undefined, 'OK');
    dialog.show();

    // 收集选中的语言
    for (var i = 0; i < languages.length; i++) {
        if (dialog.children[i].value) {
            selected.push(languages[i]);
        }
    }
    return selected;
}

// 手动实现的 isArray 函数
function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}
