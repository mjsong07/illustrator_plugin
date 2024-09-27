# illustrator_plugin
illustrator(AI)脚本与插件
# 使用方法
## 1.单个文件处理
1. 安装复制script文件夹下面的`单条导出文本配置.jsx`,`单条导入文本配置.jsx` 到Mac电脑这里/Applications/Adobe/Illustrator 2022/Presets.localized/zh_CN/脚本/ (mac系统+M1芯+2022版本)
2. 重启ai软件
3. 打开一个ai文件
4. 点击菜单-> 文件 -》 脚本 -》 选择 单条导出文本配置.jsx
5. 此时会在桌面  /Users/xxxxx用户名/Desktop/ai单条文本配置.json 
6. 使用记事本或vscode 编辑 ai单条文本配置.json
如：
```js
[
  {
    "id": 0,
    "content": "内容：vue响应式",
    "font": "AdobeSongStd-Light",
    "size": 56.4122505187988,
    "fillColor": "#000000"
  },
  {
    "id": 1,
    "content": "标题：前端开发",
    "font": "AdobeSongStd-Light",
    "size": 56.4121856689453,
    "fillColor": "#000000"
  }
]

```

6. 修改json配置
- content代表文本内容
- font：使用的字体库
- size：字体大小
- fillColor：填充的颜色
  
修改如下
- 我们把内容改成英文，同时修改字体颜色为红色
```js

[
  {
    "id": 0,
    "content": "content：vue respone",
    "font": "AdobeSongStd-Light",
    "size": 56.4122505187988,
    "fillColor": "#d1242f"
  },
  {
    "id": 1,
    "content": "title：front-dev",
    "font": "AdobeSongStd-Light",
    "size": 56.4121856689453,
    "fillColor": "#d1242f"
  }
]
```

7. 点击菜单-> 文件 -》 脚本 -》 选择 单条导入文本配置.jsx
8. 选择刚刚编辑的 /Users/xxxxx用户名/Desktop/ai单条文本配置.json 这个文件
9. 此时提示更新成功，当前文档会根据配置自动更新设置信息



## 2.批量文件处理

1. 安装复制script文件夹下面的`批量导出文本配置.jsx`,`批量导入文本配置.jsx` 到Mac电脑这里/Applications/Adobe/Illustrator 2022/Presets.localized/zh_CN/脚本/ (mac系统+M1芯+2022版本)
2. 重启ai软件
3. 打开一个ai文件
4. 点击菜单-> 文件 -》 脚本 -》 选择 批量导出文本配置.jsx
5. 此时提示选择的语言，我们选择Chinese和English（中文和英文）
6. 此时会在桌面  /Users/xxxxx用户名/Desktop/ai批量文本配置.json 
7. 使用记事本或vscode编辑 `ai批量文本配置.json`文件
如：
```js
[
  {
    "language": "Chinese",
    "text_list": [
      {
        "id": 0,
        "content": "内容：vue响应式",
        "font": "AdobeSongStd-Light",
        "size": 56.4122505187988,
        "fillColor": "#000000"
      },
      {
        "id": 1,
        "content": "标题：前端开发",
        "font": "AdobeSongStd-Light",
        "size": 56.4121894836426,
        "fillColor": "#000000"
      }
    ]
  },
  {
    "language": "English",
    "text_list": [
      {
        "id": 0,
        "content": "内容：vue响应式",
        "font": "AdobeSongStd-Light",
        "size": 56.4122505187988,
        "fillColor": "#000000"
      },
      {
        "id": 1,
        "content": "标题：前端开发",
        "font": "AdobeSongStd-Light",
        "size": 56.4121894836426,
        "fillColor": "#000000"
      }
    ]
  }
]
```

6. 修改json配置
- language：代表当前操作的语言
- content：文本内容
- font：使用的字体库
- size：字体大小
- fillColor：填充的颜色
  
修改如下
- 我们把内容改成英文，同时修改字体颜色为红色
```js
[
  {
    "language": "Chinese",
    "text_list": [
      {
        "id": 0,
        "content": "内容：vue响应式2",
        "font": "AdobeSongStd-Light",
        "size": 56.4122505187988,
        "fillColor": "#d1242f"
      },
      {
        "id": 1,
        "content": "标题：前端开发2",
        "font": "AdobeSongStd-Light",
        "size": 56.4121894836426,
        "fillColor": "#d1242f"
      }
    ]
  },
  {
    "language": "English",
    "text_list": [
      {
        "id": 0,
        "content": "content：vue respone",
        "font": "AdobeSongStd-Light",
        "size": 56.4122505187988,
        "fillColor": "#d1242f"
      },
      {
        "id": 1,
        "content": "title：front-dev",
        "font": "AdobeSongStd-Light",
        "size": 56.4121894836426,
        "fillColor": "#d1242f"
      }
    ]
  }
]

 
```

7. 点击菜单-> 文件 -》 脚本 -》 选择 批量导入文本配置.jsx
8. 选择刚刚编辑的 /Users/xxxxx用户名/Desktop/ai批量文本配置.json 这个文件
9. 然后会提示需要导出的文件夹地址：我们选择 /Users/xxxxx用户名/Desktop/
10. 此时提示成功，当前文档会根据配置自动更新设置信息，同时/Users/jason.yang/Documents/ 会新增多两个文件
- Chinese.ai
- English.ai


# 插件使用
可以自行试试(目前未成功)
## 安装插件
将整个插件目录复制到 Adobe CEP 扩展路径：
```sh
macOS: ~/Library/Application Support/Adobe/CEP/extensions/
Windows: C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\
```
确保启用调试模式：
```sh

macOS: 在 ~/Library/Preferences/com.adobe.CSXS.10.plist 中添加 {"PlayerDebugMode": "1"}。
Windows: 在注册表 HKEY_CURRENT_USER\Software\Adobe\CSXS.10 下创建一个名为 PlayerDebugMode 的字符串值，值为 1。
```
重新启动 Illustrator，插件应该出现在 窗口 -> 扩展 菜单中。