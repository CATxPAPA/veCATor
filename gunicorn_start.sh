#!/bin/bash

# 定义项目路径
PROJECT_DIR=/home/bitnami/www/vecator/vecator

# 定义应用入口
FLASK_APP=backend/app.py

# 定义虚拟环境路径（如果使用）
#source $PROJECT_DIR/env/bin/activate

# 定义 Gunicorn 监听地址和端口
BIND_ADDRESS=0.0.0.0:8000

# 定义 Gunicorn 工作进程数
WORKERS=4

# 定义 Gunicorn 访问日志文件
LOG_FILE=/home/bitnami/www/vecator/vecator/log/gunicorn.log

# 切换到项目目录
cd $PROJECT_DIR

# 启动 Gunicorn
/home/bitnami/.local/bin/gunicorn --bind $BIND_ADDRESS --workers $WORKERS --log-file $LOG_FILE $FLASK_APP