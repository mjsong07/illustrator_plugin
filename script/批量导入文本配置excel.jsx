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

                for (var i = 0; i < csvData.length; i++) {
                    var textObject = csvData[i];

                    // 获取当前文档的文本框
                    var textItems = doc.textFrames;

                    // 确保文本框数量和文本内容匹配
                    if (parseInt(textObject.Id) < textItems.length) {
                        var textFrame = textItems[parseInt(textObject.Id)];
                        textFrame.contents = textObject.Content; // 更新文本框内容

                        // 确保文本框有内容再设置样式
                        if (textFrame.contents.length > 0) {
                            var charAttributes = textFrame.textRange.characterAttributes;

                            // 验证字体是否存在
                            try {
                                var font = app.textFonts.getByName(textObject.Font);
                                charAttributes.textFont = font; // 设置字体
                            } catch (e) {
                                alert("字体没有找到：" + textObject.Font );
                                // 使用默认字体
                                charAttributes.textFont = app.textFonts.getByName("Arial-Black"); // 或其他默认字体
                            }

                            charAttributes.size = parseFloat(textObject.Size);

                            // 将 HEX 颜色转换为 RGB
                            var rgbColor = hexToRgb(textObject.FillColor);
                            var fillColor = new RGBColor();
                            fillColor.red = rgbColor.r;
                            fillColor.green = rgbColor.g;
                            fillColor.blue = rgbColor.b;
                            charAttributes.fillColor = fillColor;
                        } else {
                            alert("没有找到要设置的文本信息，id为" + textObject.Id);
                        }
                    }
                }

                // 导出新 AI 文件
                var newFile = new File(exportPath + "/" + textObject.Language + '.ai');
                var saveOptions = new IllustratorSaveOptions();
                doc.saveAs(newFile, saveOptions);

                // 提示用户操作已完成
                alert("恭喜，所有文件生成导出到： " + exportPath);
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