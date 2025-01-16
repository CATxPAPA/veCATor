const downloadAllButton = document.getElementById('download-all');
        const clearListButton = document.getElementById('clear-list');
 $(function() {
      $(".knob").knob({
        'change': function (v) {
           const inputName = this.$.data('input');
             $(`#${inputName}`).val(v).trigger('change');
       },
      });
      
     
  });
         // 上传并转换文件
      async function uploadAndConvert(file,imgContainer, resultContainer, downloadButton, copyButton, redrawButton, textarea) {
            const formData = new FormData(window.vtracerForm);

            // 对文件名进行编码
            const encodedFileName = encodeURIComponent(file.name);
            const renamedFile = new File([file], encodedFileName, { type: file.type });

            formData.append('files[]', renamedFile);

            try {
                const response = await fetch('/convert', {
                    method: 'POST',
                    body: formData
                });

                 if (response.ok) {
                    const results = await response.json();
                     if(results && results.length > 0 && results[0].preview_url){
                        imgContainer.style.display = 'none';
                        try{
                           resultContainer.innerHTML = ""; //清空初始化的文字
                             const svgResponse = await fetch(results[0].preview_url);
                            const svgText = await svgResponse.text();
                             resultContainer.style.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(svgText)}')`;
                             textarea.value = svgText;
                             downloadButton.href = results[0].preview_url;
                            downloadButton.download = results[0].filename;
                            downloadButton.style.display = 'inline-block';
                            copyButton.style.display = 'inline-block';
                            redrawButton.style.display = 'inline-block';

                        } catch(e){
                             console.error("Error fetching SVG:", e);
                            resultContainer.innerHTML = `<p class="status error">Error fetching SVG: ${e.message}</p>`;
                         }
                    }
                   else if (results && results.length > 0 && results[0].error)
                   {
                       resultContainer.innerHTML = `<p class="status error">转换失败: ${results[0].error}</p>`;
                    }
                   else{
                       resultContainer.innerHTML = `<p class="status error">转换失败: No result found for ${file.name}</p>`;
                    }
                 } else {
                    resultContainer.innerHTML = '<p class="status error">转换失败</p>';
                 }
            } catch (error) {
                 console.error("Error during fetch:", error);
                resultContainer.innerHTML = `<p class="status error">错误: ${error.message}</p>`;
            }
        }

         // 全部下载
         downloadAllButton.addEventListener('click', () => {
            const downloadLinks = previewList.querySelectorAll('.download-button');
            downloadLinks.forEach(link => {
               if(link.href){
                    const a = document.createElement('a');
                    a.href= link.href;
                    a.download = link.download;
                     a.style.display = 'none';
                   document.body.appendChild(a);
                    a.click();
                   document.body.removeChild(a)
               }
           });
        });

       // 清空列表
        clearListButton.addEventListener('click', () => {
             previewList.innerHTML = '';
       });