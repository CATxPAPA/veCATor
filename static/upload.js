const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewList = document.getElementById('preview-list');
window.vtracerForm = document.getElementById('vtracer-form'); // 将 vtracerForm 提升为全局变量
// 处理文件的核心函数
function handleFiles(files) {
    // console.log("handleFiles called", files); // 添加这行进行调试
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

            // 将 base64 数据转换为 Blob 对象
            const byteCharacters = atob(base64Data.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            const file = new File([blob], 'redraw.png', { type: 'image/png' });
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

        uploadAndConvert(file, resultContainer, downloadButton,copyButton,redrawButton, textarea);
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



//focus效果
document.addEventListener('click', (e) => {
    //e.preventDefault();
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