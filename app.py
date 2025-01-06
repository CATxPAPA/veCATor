from flask import Flask, request, jsonify, send_file, render_template
import os
import vtracer
from werkzeug.utils import secure_filename
from PIL import Image
import uuid

# 创建 Flask 应用
app = Flask(__name__)

# 文件上传配置
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# 检查文件扩展名
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 主页路由
@app.route('/')
def index():
    return render_template('index.html')

# 文件上传和转换 API
@app.route('/convert', methods=['POST'])
def convert_image():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files[]')
    results = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            unique_id = uuid.uuid4().hex
            output_filename = f"{os.path.splitext(filename)[0]}_{unique_id}.svg"
            output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)

            # 保存上传的文件
            try:
                file.save(input_path)
            except Exception as e:
                 results.append({'filename': filename, 'error': f'Error saving file: {str(e)}'})
                 continue

             # 读取表单参数
            colormode = request.form.get('colormode', 'color')
            hierarchical = request.form.get('hierarchical', 'stacked')
            mode = request.form.get('mode', 'spline')
            filter_speckle = int(float(request.form.get('filter_speckle', 4)))
            color_precision = int(float(request.form.get('color_precision', 6)))
            layer_difference = int(float(request.form.get('layer_difference', 16)))
            corner_threshold = int(float(request.form.get('corner_threshold', 60)))
            length_threshold = float(request.form.get('length_threshold', 4.0))
            max_iterations = int(float(request.form.get('max_iterations', 10)))
            splice_threshold = int(float(request.form.get('splice_threshold', 45)))
            path_precision = int(float(request.form.get('path_precision', 3)))


            # 转换为 SVG
            try:
                vtracer.convert_image_to_svg_py(input_path,
                                                output_path,
                                                colormode=colormode,
                                                hierarchical=hierarchical,
                                                mode=mode,
                                                filter_speckle=filter_speckle,
                                                color_precision=color_precision,
                                                layer_difference=layer_difference,
                                                corner_threshold=corner_threshold,
                                                length_threshold=length_threshold,
                                                max_iterations=max_iterations,
                                                splice_threshold=splice_threshold,
                                                path_precision=path_precision
                                                )
                results.append({
                    'filename': output_filename,
                    'preview_url': f"/outputs/{output_filename}"
                })
            except Exception as e:
                results.append({'filename': filename, 'error': str(e)})
            
            # 删除上传的临时文件
            try:
               os.remove(input_path)
            except:
               pass
        else:
            results.append({'filename': file.filename, 'error': 'Invalid file type'})
    return jsonify(results)

# 提供 SVG 文件的静态访问
@app.route('/outputs/<filename>')
def output_file(filename):
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    if os.path.exists(output_path):
        return send_file(output_path, mimetype='image/svg+xml')
    else:
        return "File not found", 404

# 运行服务器
if __name__ == '__main__':
    app.run(debug=True)