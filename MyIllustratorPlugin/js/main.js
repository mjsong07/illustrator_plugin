document.getElementById('exportBtn').addEventListener('click', function () {
    // 调用 JSX 进行导出
    callJSX('exportText');
});

document.getElementById('importBtn').addEventListener('click', function () {
    // 调用 JSX 进行导入
    callJSX('importText');
});

function callJSX(functionName) {
    var csInterface = new CSInterface();
    csInterface.evalScript(functionName + "()");
}
