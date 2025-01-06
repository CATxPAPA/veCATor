FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 复制当前目录内容到工作目录
COPY . /app

# 升级 pip
RUN pip install --upgrade pip

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 暴露 Flask 默认端口
EXPOSE 5000

# 设置环境变量
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# 运行 Flask 应用
CMD ["flask", "run"]