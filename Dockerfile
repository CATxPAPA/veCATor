# 使用 alpine 镜像作为基础镜像
FROM alpine:3.21

# 设置工作目录
WORKDIR /app

# 安装 Python3, pip3
RUN apk add --no-cache python3 py3-pip

# Alpine 镜像需要安装 libc6-compat 以支持某些软件
RUN apk add --no-cache libc6-compat

# 将项目依赖复制到工作目录
COPY requirements.txt .

# 安装项目依赖
RUN pip3 install -r requirements.txt

# 将项目代码复制到工作目录
COPY . .

# 设置环境变量
ENV FLASK_APP app.py

# 暴露端口
EXPOSE 5000

# 设置启动命令
CMD ["flask", "run", "--host=0.0.0.0"]