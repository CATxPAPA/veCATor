const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewList = document.getElementById('preview-list');
window.vtracerForm = document.getElementById('vtracer-form'); // 将 vtracerForm 提升为全局变量

//将服务器端icon.jpg做为第一张测试用图上传并转换
window.onload = async () => {
    const firstImg = new Image(); // 使用 Image 对象加载图片
    firstImg.src = '/static/test.jpg';

    // 等待图片加载完成
    firstImg.onload = () => {
        // 创建一个 600x600 的 canvas
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // 将图片绘制到 canvas 上
        ctx.drawImage(firstImg, 0, 0, 600, 600);

        // 将 canvas 转换为 Base64 格式
        const base64String = canvas.toDataURL('image/png'); // 默认是 PNG 格式
        console.log('Base64 String:', base64String);

        // 如果需要 Blob 格式，可以用 toBlob
        canvas.toBlob((blob) => {
            const file = new File([blob], 'icon.jpg', { type: 'image/jpeg' });
            handleFiles([file]);
        }, 'image/jpeg');
    };

    firstImg.onerror = () => {
        console.error('Failed to load the image at /static/icon.jpg');
    };
};



// 处理文件的核心函数
function handleFiles(files) {
    const fileArray = Array.from(files);
    fileInput.value = ''; // 清空 fileInput 的值
    fileArray.forEach(file => {
        const reader = new FileReader();
        const listItem = document.createElement('li');
        listItem.classList.add('preview-item');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-container');

        const resultContainer = document.createElement('div');
        resultContainer.classList.add('result-container');
        resultContainer.innerHTML = '<p class="status">转换中...</p>';
        
        resultContainer.addEventListener('click', (e) => {
            //打开.big-preview
            let backgroundImage = e.target.style.backgroundImage;
            const bigPreview = document.getElementById('big-preview');
            bigPreview.classList.add('open');
            bigPreview.style.backgroundImage = backgroundImage;
        });
        

        const codeContainer = document.createElement('div');
        codeContainer.classList.add('code-container');

        const textarea = document.createElement('textarea');
        textarea.readOnly = true;

        const downloadButton = document.createElement('a');
        downloadButton.classList.add('download-button');
        downloadButton.textContent = '下载';
        downloadButton.style.display = 'none';

        const redrawButton = document.createElement('a');
        redrawButton.classList.add('redraw-button');
        redrawButton.textContent = '重绘';
        redrawButton.style.display = 'none';
        redrawButton.onclick = () => {
            const backgroundImage = imgContainer.style.backgroundImage;
            const base64Data = backgroundImage.slice(5, -2); // 去掉 url(' 和 ') 部分
            console.log('Base64 Data:', base64Data); // 添加调试信息

            // 检查 MIME 类型
            const mimeType = base64Data.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
            console.log('MIME Type:', mimeType); // 添加调试信息

            // 将 base64 数据转换为 Blob 对象
            const byteCharacters = atob(base64Data.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });

            const file = new File([blob], 'redraw.' + (mimeType === 'image/jpeg' ? 'jpg' : 'png'), { type: mimeType });
            console.log('Redraw File:', file); // 添加调试信息
            handleFiles([file]);
        };

        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-button');
        copyButton.textContent = '拷贝代码';
        copyButton.style.display = 'none';
        copyButton.onclick = () => {
            // 恢复其他所有拷贝按钮的原始状态
            document.querySelectorAll('.copy-button').forEach(btn => {
                btn.style.backgroundColor = '';
                btn.textContent = '拷贝代码';
            });

            navigator.clipboard.writeText(textarea.value)
                .then(() => {
                    copyButton.style.backgroundColor = '#00aabb';
                    copyButton.textContent = '已拷贝';
                    setTimeout(() => {
                        copyButton.style.backgroundColor = '';
                        copyButton.textContent = '拷贝代码';
                    }, 3000);
                })
                .catch(err => {
                    copyButton.style.backgroundColor = '#ee6688';
                    copyButton.textContent = '拷贝失败';
                    setTimeout(() => {
                        copyButton.style.backgroundColor = '';
                        copyButton.textContent = '拷贝代码';
                    }, 3000);
                });
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(redrawButton);

        codeContainer.appendChild(textarea);

        listItem.appendChild(imgContainer);
        listItem.appendChild(resultContainer);
        listItem.appendChild(codeContainer);
        listItem.appendChild(buttonContainer);
        previewList.prepend(listItem);

        reader.onload = (e) => {
            imgContainer.style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);

        // 将文件转换为 Blob 对象
        const readerForBlob = new FileReader();
        readerForBlob.onloadend = () => {
            const arrayBuffer = readerForBlob.result;
            const blob = new Blob([arrayBuffer], { type: file.type });
            const newFile = new File([blob], file.name, { type: file.type });
            uploadAndConvert(newFile, imgContainer, resultContainer, downloadButton, copyButton, redrawButton, textarea);
        };
        readerForBlob.readAsArrayBuffer(file);
    });
}

// 拖拽和粘贴事件
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

// 粘贴事件
uploadArea.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    const files = [];
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            files.push(item.getAsFile());
        }
    }
    if (files.length > 0) {
        handleFiles(files);
    }
});

// focus效果
document.addEventListener('click', (e) => {
    if (e.target !== uploadArea) {
        uploadArea.classList.remove('focused');
    } else {
        uploadArea.classList.add('focused');
    }
});

// 选择文件事件
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});


//点击#big-preview关闭
document.addEventListener('click', (e) => {
    if (e.target.id === 'big-preview') {
        e.target.classList.remove('open');
    }
});