var doc = app.activeDocument;

// 1. 打印所有文本框信息
var textInfo = "Text Frames:\n";
for (var i = 0; i < doc.textFrames.length; i++) {
    var textFrame = doc.textFrames[i];
    textInfo += "Text Frame " + i + ": " + textFrame.contents + "\n";
}
alert(textInfo);  // 一次性显示所有文本框信息

// 2. 打印所有路径信息
var pathInfo = "Path Items:\n";
for (var j = 0; j < doc.pathItems.length; j++) {
    var pathItem = doc.pathItems[j];
    pathInfo += "Path Item " + j + ": " + pathItem.name + "\n";
}
alert(pathInfo);  // 一次性显示所有路径信息

// 3. 打印所有图层信息
var layerInfo = "Layers:\n";
for (var k = 0; k < doc.layers.length; k++) {
    var layer = doc.layers[k];
    layerInfo += "Layer " + k + ": " + layer.name + "\n";
}
alert(layerInfo);  // 一次性显示所有图层信息

// 4. 打印所有嵌入图像信息
var placedInfo = "Placed Items:\n";
for (var l = 0; l < doc.placedItems.length; l++) {
    var placedItem = doc.placedItems[l];
    placedInfo += "Placed Item " + l + ": " + placedItem.file + "\n";
}
alert(placedInfo);  // 一次性显示所有嵌入图像信息

// 5. 打印所有复合路径信息
var compoundInfo = "Compound Paths:\n";
for (var m = 0; m < doc.compoundPathItems.length; m++) {
    var compoundPath = doc.compoundPathItems[m];
    compoundInfo += "Compound Path " + m + ": " + compoundPath.name + "\n";
}
alert(compoundInfo);  // 一次性显示所有复合路径信息
