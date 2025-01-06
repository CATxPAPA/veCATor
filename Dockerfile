# 使用官方 Python 镜像作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制 requirements.txt 文件到工作目录
COPY requirements.txt .

# 创建虚拟环境
RUN python -m venv /app/venv

# 激活虚拟环境并安装项目依赖
RUN /app/venv/bin/pip install --upgrade pip
RUN /app/venv/bin/pip install -r requirements.txt

# 将项目代码复制到工作目录
COPY . .

# 设置环境变量
ENV FLASK_APP=app.py
ENV PATH="/app/venv/bin:$PATH"

# 暴露端口
EXPOSE 5000

# 设置启动命令
CMD ["flask", "run", "--host=0.0.0.0"]