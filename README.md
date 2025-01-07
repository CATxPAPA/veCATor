# veCATor

veCATor 是一个使用 Flask 运行的极简 Web 应用，它的本质上只是一个网页UI，在后端集成了 [vtracer](https://github.com/visioncortex/vtracer) 的 Python 扩展功能，提供批量将光栅图像（如 JPG、PNG）转换为矢量图形（SVG）的服务。用户可以通过前端页面上传图片，设置转换参数，并批量下载转换后的矢量图。

## 功能特性

- **批量处理**：支持一次性上传多张图片，进行批量矢量化转换。
- **参数配置**：通过前端表单，用户可以方便地设置 vtracer 的转换参数，以满足不同需求。
- **实时预览**：在转换前，用户可以预览设置的参数对输出结果的影响。
- **结果下载**：转换完成后，用户可以批量下载所有生成的 SVG 文件。

## 安装指南

请确保您的系统已安装以下软件：

- **Python 版本**：3.6 及以上
- **Flask**：用于构建 Web 应用的微框架
- **vtracer**：用于图像矢量化的工具

您可以使用以下命令安装所需的 Python 包：

```bash
pip install flask vtracer
```

1. **克隆仓库**：

   ```bash
   git clone https://github.com/CATxPAPA/veCATor.git
   cd veCATor
   ```

2. **运行应用**：

   ```bash
   python app.py
   ```

3. **访问服务**：

   在浏览器中打开 `http://localhost:5000`，即可使用 veCATor 的功能。

## 使用说明

* 简单来说就是上传和下载两个功能，你可以通过点选、拖拽、粘贴三种形式上传图片

* 上传后的图片会自动按当前的参数设定生成矢量图

* 你可以单个下载也可以批量下载

* 你也可以复制SVG代码用于一些直接需要代码的情况

## 已知问题
* 中文图片会无法获取
  
* 手机端还没有完全适配好（但能用）
  
## 懒猫微服版
[lzc-vecator](./lzc-vecator) 是基于 [lzc-sdk](https://gitee.com/linakesi/lzc-sdk) 专用的打包文件，用于[懒猫微服](https://lazycat.cloud/)安装使用。

目前问题：

* 无法批量下载图片（可能是容器限制？）
  
* 未来需要加入微服本地存储的读取和保存


## 许可证

本项目采用 MIT 许可证。有关详细信息，请参阅 [LICENSE](./LICENSE) 文件。

## 鸣谢

特别感谢 [vtracer](https://github.com/visioncortex/vtracer) 项目的开发者提供的优秀工具。
