// 检查是否有文档打开
if (app.documents.length > 0) {
    var doc = app.activeDocument; // 获取当前活动文档

    // 选择要导入的 CSV 配置文件
    var csvFile = File.openDialog("请选择一个配置好的CSV文件", "*.csv");
    if (csvFile !== null) {
        try {
            var csvData = loadFromCsv(csvFile.fsName);

            if (!isArray(csvData)) {
                throw new Error("加载的数据不是有效的数组");
            }

            // 创建一个对象来存储每个文本框的信息
            var textsById = {};

            for (var i = 0; i < csvData.length; i++) {
                var textObject = csvData[i];
                var originalId = textObject.OriginalId;
                var splitId = textObject.SplitId;

                if (!textsById[originalId]) {
                    textsById[originalId] = [];
                }

                textsById[originalId][splitId] = textObject;
            }

            for (var originalId in textsById) {
                // 使用 OriginalId 作为索引查找文本框
                var index = parseInt(originalId);
                if (!isNaN(index) && index >= 0 && index < doc.textFrames.length) {
                    var textFrame = doc.textFrames[index];
                    var combinedText = "";

                    // 合并文本并添加换行符
                    for (var k = 0; k < textsById[originalId].length; k++) {
                        if (textsById[originalId][k]) {
                            combinedText += textsById[originalId][k].Content + "\n";
                        }
                    }

                    // 设置合并后的文本内容
                    textFrame.contents = combinedText;

                    // 确保文本框有内容再设置样式
                    if (textFrame.contents.length > 0) {
                        var charAttributes = textFrame.textRange.characterAttributes;

                        // 获取第一个条目的样式信息
                        var firstTextObject = textsById[originalId][0];

                        // 设置字体、大小和颜色
                        try {
                            var font = app.textFonts.getByName(firstTextObject.Font);
                            if (font) {
                                charAttributes.textFont = font; // 设置字体
                            } else {
                                charAttributes.textFont = app.textFonts.getByName("Arial-Black"); // 或其他默认字体
                            }
                        } catch (e) {
                            // 设置字体时出错
                        }

                        charAttributes.size = parseFloat(firstTextObject.Size);

                        var fillColor = new RGBColor();
                        var rgbColor = hexToRgb(firstTextObject.FillColor);
                        fillColor.red = rgbColor.r;
                        fillColor.green = rgbColor.g;
                        fillColor.blue = rgbColor.b;
                        charAttributes.fillColor = fillColor;
                    }
                } else {
                    // 未能找到文本框索引
                    alert("未能找到文本框索引: " + index);
                }
            }

            // 提示用户操作已完成
            alert("恭喜，所有文件已成功导入并更新当前文档");
        } catch (error) {
            alert("发生错误：" + error.message);
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