// 获取当前打开的文档
var doc = app.activeDocument;
var textItems = doc.textFrames;
var outputText = "";

// 遍历所有文本框，获取其中的文本内容
for (var i = 0; i < textItems.length; i++) {
    outputText += textItems[i].contents + "\n";
}

// 定义保存文本文件的位置（桌面）
var file = new File(Folder.desktop + "/exported_text.txt");

// 打开文件写入模式
file.open("w");

// 将文本写入文件
file.write(outputText);

// 关闭文件
file.close();

// 通知用户操作完成
alert("Text has been exported to: " + file.fsName);
