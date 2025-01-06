# 使用官方 Python 镜像作为基础镜像
FROM python:3.8-slim

# 设置工作目录
WORKDIR /app

# 将项目依赖复制到工作目录
COPY requirements.txt .

# 安装项目依赖
RUN pip install -r requirements.txt

# 将项目代码复制到工作目录
COPY . .

# 设置环境变量
ENV FLASK_APP app.py

# 暴露端口
EXPOSE 5000

# 设置启动命令
CMD ["flask", "run", "--host=0.0.0.0"]