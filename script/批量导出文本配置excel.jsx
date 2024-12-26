// 获取当前文档中的所有文本框
var doc = app.activeDocument;
var textItems = doc.textFrames;
var allTextData = [];

// 选择国家语言
var languages = ["Chinese", "English", "Spanish", "French", "German"]; // 可以根据需要添加更多语言
var selectedLanguages = getSelectedLanguages(languages);

if (selectedLanguages.length > 0) {
    for (var j = 0; j < selectedLanguages.length; j++) {
        var lang = selectedLanguages[j];
        var languageData = {
            language: lang,
            text_list: []
        };

        for (var i = 0; i < textItems.length; i++) {
            var textFrame = textItems[i];

            // 创建文本对象
            var textObject = {
                id: i, // 使用 i + 1 作为 ID
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

    // 保存 CSV 文件到桌面，并设置为 UTF-8 编码
    saveAsCsv(allTextData, Folder.desktop + "/ai批量文本配置.csv");

    // 提示用户文件已导出
    alert("文件已经导出到：" + Folder.desktop + "/ai批量文本配置.csv");
} else {
    alert("没有选择任何语言，程序退出");
}

 
function buildCsvRow(data) {
    var row = [];
    for (var k in data) {
        if (data.hasOwnProperty(k)) {
            var value = data[k];
            // 检查是否为字符串，并处理可能存在的引号
            if (typeof value === 'string') {
                value = '"' + value.replace(/"/g, '""') + '"';
            } else if (value !== null && value !== undefined) {
                // 如果不是字符串且不为空或未定义，则直接转换为字符串
                value = String(value);
            } else {
                // 对于null或undefined，可以设置为空字符串或其他默认值
                value = '';
            }
            row.push(value);
        }
    }
    return row.join(',');
}

function saveAsCsv(textData, filePath) {
    var csvContent = "Language,Id,Content,Font,Size,FillColor\n"; // CSV Header

    for (var i = 0; i < textData.length; i++) {
        var languageData = textData[i];
        for (var j = 0; j < languageData.text_list.length; j++) {
            var textObject = languageData.text_list[j];
            // 确保所有值都是字符串
            var row = {
                Language: String(languageData.language),
                Id: String(textObject.id),
                Content: String(textObject.content),
                Font: String(textObject.font),
                Size: String(textObject.size),
                FillColor: String(textObject.fillColor)
            };
            csvContent += buildCsvRow(row) + "\n";
        }
    }

    var file = new File(filePath);
    file.encoding = "UTF-8";
    file.open("w");
    file.write(csvContent);
    file.close();
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

function getSelectedLanguages(languages) {
    var dialog = new Window('dialog', '选择语言');
    var selected = [];

    for (var i = 0; i < languages.length; i++) {
        dialog.add('checkbox', undefined, languages[i]);
    }

    dialog.add('button', undefined, 'OK');
    dialog.show();

    for (var i = 0; i < languages.length; i++) {
        if (dialog.children[i].value) {
            selected.push(languages[i]);
        }
    }
    return selected;
}