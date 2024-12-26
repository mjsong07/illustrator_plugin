// 检查是否有文档打开
if (app.documents.length > 0) {
    var doc = app.activeDocument; // 获取当前活动文档

    // 选择要导入的 CSV 配置文件
    var csvFile = File.openDialog("请选择一个配置好的语言的CSV文件", "*.csv");
    if (csvFile !== null) {
        // 选择导出的路径
        var exportPath = Folder.selectDialog("请选择一个导出的文件夹");
        if (exportPath !== null) {

            try {
                var csvData = loadFromCsv(csvFile.fsName);

                if (!isArray(csvData)) {
                    throw new Error("加载的数据不是有效的数组");
                }

                // 创建一个对象来存储每个语言的所有文本框信息
                var textsByLanguage = {};

                for (var i = 0; i < csvData.length; i++) {
                    var textObject = csvData[i];
                    var language = textObject.Language;
                    var originalId = textObject.OriginalId;

                    if (!textsByLanguage[language]) {
                        textsByLanguage[language] = {};
                    }

                    if (!textsByLanguage[language][originalId]) {
                        textsByLanguage[language][originalId] = {
                            content: "",
                            font: textObject.Font,
                            size: parseFloat(textObject.Size),
                            fillColor: hexToRgb(textObject.FillColor)
                        };
                    }
                    textsByLanguage[language][originalId].content += textObject.Content + "\n"; // 合并文本并添加换行符
                }

                // 创建临时文件用于复制文档内容
                var tempFile = new File(Folder.temp.fsName + "/temp.ai");
                doc.saveAs(tempFile);

                for (var language in textsByLanguage) {
                    // 打开临时文件以创建一个新的文档副本
                    var docCopy = app.open(tempFile);
                
                    for (var originalId in textsByLanguage[language]) {
                        var combinedText = textsByLanguage[language][originalId];
                        var textFrame;
                
                        // 使用 OriginalId 作为索引查找文本框
                        var index = parseInt(originalId);
                        if (!isNaN(index) && index >= 0 && index < docCopy.textFrames.length) {
                            textFrame = docCopy.textFrames[index];
                
                            //console.log("正在更新文本框: " + index);
                            textFrame.contents = combinedText.content; // 设置合并后的文本内容
                
                            // 确保文本框有内容再设置样式
                            if (textFrame.contents.length > 0) {
                                var charAttributes = textFrame.textRange.characterAttributes;
                
                                // 设置字体、大小和颜色
                                try {
                                    var font = app.textFonts.getByName(combinedText.font);
                                    if (font) {
                                        charAttributes.textFont = font; // 设置字体
                                    } else {
                                        //console.warn("字体未找到：" + combinedText.font);
                                        charAttributes.textFont = app.textFonts.getByName("Arial-Black"); // 或其他默认字体
                                    }
                                } catch (e) {
                                    //console.error("设置字体时出错: " + e.message);
                                }
                
                                charAttributes.size = combinedText.size;
                
                                var fillColor = new RGBColor();
                                fillColor.red = combinedText.fillColor.r;
                                fillColor.green = combinedText.fillColor.g;
                                fillColor.blue = combinedText.fillColor.b;
                                charAttributes.fillColor = fillColor;
                            }
                        } else {
                            //console.error("未能找到文本框索引: " + index);
                        }
                    }
                
                    // 导出新 AI 文件，文件名为对应的语言
                    var newFile = new File(exportPath + "/" + language + '.ai');
                    var saveOptions = new IllustratorSaveOptions();
                    docCopy.saveAs(newFile, saveOptions);
                    docCopy.close(SaveOptions.DONOTSAVECHANGES); // 关闭副本而不保存更改
                }
                

                // 删除临时文件
                tempFile.remove();

                // 提示用户操作已完成
                alert("恭喜，所有文件已成功导入和合并，并根据语言分别保存： " + exportPath);
            } catch (error) {
                alert("发生错误：" + error.message);
            }
        } else {
            alert("没有选择导出的文件夹，程序退出");
        }
    } else { 
        alert("没有选择CSV文件，程序退出");
    }
} else {
    alert("当前无被打开的文件,程序退出");
}
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function parseCsvRow(row) {
    var fields = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // 正确处理包含逗号的字段
    for (var i = 0; i < fields.length; i++) {
        fields[i] = fields[i].replace(/^"|"$/g, ''); // 去除包围的引号
    }
    return fields;
}

function loadFromCsv(filePath) {
    var file = new File(filePath);
    file.open("r");
    var content = file.read();
    file.close();

    var rows = content.split("\n");
    var headers = parseCsvRow(rows.shift()); // 获取表头并移除

    var result = [];
    for (var i = 0; i < rows.length; i++) {
        if (rows[i]) {
            var values = parseCsvRow(rows[i]);
            var obj = {};
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = values[j];
            }
            result.push(obj);
        }
    }
    return result;
}

function hexToRgb(hex) {
    var bigint = parseInt(hex.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return { r: r, g: g, b: b };
}