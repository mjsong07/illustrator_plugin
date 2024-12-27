 

import os
import shutil
from tkinter import Tk, filedialog, messagebox, simpledialog, ttk
from pathlib import Path
import pandas as pd
import tkinter as tk

# 模拟Illustrator操作的函数（需要根据实际情况实现）
def open_illustrator_document(file_path):
    # 这里应该是打开Illustrator文档的代码
    print(f"打开Illustrator文档: {file_path}")
    return "doc_object"

def get_all_text_frames(doc):
    # 这里应该是获取所有文本框的代码
    print("获取所有文本框")
    return ["text_frame"]  # 返回文本框列表的占位符

def set_content(text_frame, content):
    # 设置文本框内容的代码
    print(f"设置文本框内容为: {content}")

def set_font(text_frame, font):
    # 设置字体的代码
    print(f"设置字体为: {font}")

def set_size(text_frame, size):
    # 设置大小的代码
    print(f"设置大小为: {size}")

def set_fill_color(text_frame, fill_color):
    # 设置填充颜色的代码
    print(f"设置填充颜色为: {fill_color}")
 

def close_illustrator_document(doc):
    # 关闭Illustrator文档的代码
    print("关闭Illustrator文档")

def load_csv(file_path):
    """从CSV文件加载数据"""
    df = pd.read_csv(file_path)
    data_by_language = {}
    
    for index, row in df.iterrows():
        language = row['Language']
        original_id = str(row['OriginalId'])
        
        if language not in data_by_language:
            data_by_language[language] = {}
        
        if original_id not in data_by_language[language]:
            data_by_language[language][original_id] = {
                'content': '',
                'font': row['Font'],
                'size': float(row['Size']),
                'fill_color': row['FillColor']
            }
        
        data_by_language[language][original_id]['content'] += row['Content'] + '\n'
    
    # 添加调试输出以检查数据结构
    print("Loaded data structure:", data_by_language)

    return data_by_language

def update_text_frame(doc, text_frames, original_id, content, font, size, fill_color):
    """更新指定ID的文本框内容及样式"""
    try:
        text_frame = text_frames[int(original_id)]
        set_content(text_frame, content.strip())
        
        if content.strip():
            set_font(text_frame, font)
            set_size(text_frame, size)
            set_fill_color(text_frame, fill_color)
    except IndexError:
        print(f"未能找到文本框索引: {original_id}")
    except Exception as e:
        print(f"更新文本框时发生错误: {e}")

def process_language(language, data, export_folder, ai_file_path):
    """为每种语言创建并保存新的AI文件"""
    if not isinstance(data, dict):
        raise ValueError(f"Data for language {language} is not a dictionary")

    temp_file_path = Path('temp.ai')
    new_file_path = Path(export_folder) / f"{language}.ai"
    
    # 确保导出文件夹存在
    if not Path(export_folder).exists():
        Path(export_folder).mkdir(parents=True, exist_ok=True)

    # 复制原始AI文件到临时文件
    print(f"复制原始AI文件 {ai_file_path} 到临时文件 {temp_file_path}")
    shutil.copyfile(ai_file_path, temp_file_path)

    # 打开临时文件并更新文本框
    doc = open_illustrator_document(str(temp_file_path))
    text_frames = get_all_text_frames(doc)

    for original_id, text_data in data.items():
        update_text_frame(doc, text_frames, original_id, **text_data)

    # 保存新AI文件并关闭文档
    print(f"保存新AI文件到 {new_file_path}")
    save_illustrator_document(doc, str(new_file_path))
    close_illustrator_document(doc)

    # 删除临时文件
    print(f"删除临时文件 {temp_file_path}")
    if temp_file_path.exists():
        os.remove(temp_file_path)

def select_csv_file():
    file_path = filedialog.askopenfilename(filetypes=[("CSV files", "*.csv")])
    csv_file_var.set(file_path)

def select_export_folder():
    folder_path = filedialog.askdirectory()
    export_folder_var.set(folder_path)

def select_original_ai_file():
    file_path = filedialog.askopenfilename(filetypes=[("AI files", "*.ai")])
    original_ai_file.set(file_path)

def start_processing():
    csv_file = csv_file_var.get()
    export_folder = export_folder_var.get()
    ai_file_path = original_ai_file.get()  # 确保这是一个字符串路径
    
    if not all([csv_file, export_folder, ai_file_path]):
        messagebox.showerror("错误", "请选择CSV文件、导出文件夹和原始AI文件")
        return
    
    texts_by_language = load_csv(csv_file)

    for language, data in texts_by_language.items():
        try:
            print(f"正在处理语言: {language}")
            process_language(language, data, export_folder, ai_file_path)
            print(f"成功处理语言: {language}")
        except Exception as e:
            messagebox.showerror("错误", f"处理语言 {language} 时发生错误: {e}")
            break

    messagebox.showinfo("完成", "所有文件已成功导入和合并，并根据语言分别保存")

# 创建主窗口
root = Tk()
root.title("AI 文档多语言批量处理工具")

# 变量初始化
csv_file_var = tk.StringVar()
export_folder_var = tk.StringVar()
original_ai_file = tk.StringVar()

# 布局
ttk.Label(root, text="CSV 文件:").grid(row=0, column=0, padx=10, pady=5, sticky='w')
ttk.Entry(root, textvariable=csv_file_var, width=50).grid(row=0, column=1, padx=10, pady=5)
ttk.Button(root, text="浏览", command=select_csv_file).grid(row=0, column=2, padx=10, pady=5)

ttk.Label(root, text="导出文件夹:").grid(row=1, column=0, padx=10, pady=5, sticky='w')
ttk.Entry(root, textvariable=export_folder_var, width=50).grid(row=1, column=1, padx=10, pady=5)
ttk.Button(root, text="浏览", command=select_export_folder).grid(row=1, column=2, padx=10, pady=5)

ttk.Label(root, text="原始AI文件:").grid(row=2, column=0, padx=10, pady=5, sticky='w')
ttk.Entry(root, textvariable=original_ai_file, width=50).grid(row=2, column=1, padx=10, pady=5)
ttk.Button(root, text="浏览", command=select_original_ai_file).grid(row=2, column=2, padx=10, pady=5)

ttk.Button(root, text="开始处理", command=start_processing).grid(row=3, columnspan=3, pady=20)


import subprocess

def run_applescript(script):
    """Run an AppleScript command and return the result."""
    process = subprocess.Popen(['osascript', '-e', script],
                               stdout=subprocess.PIPE,
                               stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode != 0:
        raise Exception(f"AppleScript error: {stderr.decode()}")
    return stdout.decode()

def save_illustrator_document(doc_name, file_path):
    """
    Save the specified Illustrator document to the given file path.
    
    :param doc_name: The name of the document to save (as it appears in Illustrator).
    :param file_path: The full path where the document should be saved.
    """
    script = f'''
    tell application "Adobe Illustrator"
        save document "{doc_name}" in POSIX file "{file_path}" as AI format
    end tell
    '''
    print(f"尝试保存Illustrator文档到: {file_path}")
    run_applescript(script)

# 运行主循环
if __name__ == "__main__":
    root.mainloop()