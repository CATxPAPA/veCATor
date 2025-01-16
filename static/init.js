$(function() {
      $(".knob").knob({
        'change': function (v) {
           const inputName = this.$.data('input');
             $(`#${inputName}`).val(v).trigger('change');
       },

       
      

      });
      const vtracerForm = $('#vtracer-form');
    const templateButtons = $('.template-button');
    const colorPrecisionGroup = $('#color_precision_group');
    const layerDifferenceGroup = $('#ayer_difference_group');
   const colormodeGroup = $('#colormode-group');
   const modeGroup = $('#mode-group');
    const toggleAdvancedButton = $('#toggle-advanced');
     const advancedParams = $('#advanced-params');


            function updateForm(data) {
            for (const key in data) {
                const input = vtracerForm.find(`[name="${key}"]`);
                if(input.length) {
                    if(input.is(':radio')){
                       vtracerForm.find(`input[name="${key}"][value="${data[key]}"]`).prop('checked', true);
                    }
                  else{
                       input.val(data[key])
                         const knob =  $(`input[data-input="${key}"]`);
                       if(knob.length){
                         if(key === 'length_threshold'){
                            knob.val(parseFloat(data[key]).toFixed(1)).trigger('change');
                         }else{
                            knob.val(parseInt(data[key])).trigger('change');
                         }

                        }
                    }
                }
            }
        }

        function handleColormodeChange() {
             const colormode = vtracerForm.find('input[name="colormode"]:checked').val();
              if (colormode === 'binary') {
                $(".hide_in_binary").hide();
                 //  colorPrecisionGroup.hide();
                 // layerDifferenceGroup.hide();
              } else {
                $(".hide_in_binary").show();
                   // colorPrecisionGroup.show();
                   // layerDifferenceGroup.show();
              }
        }

        function handleModeChange() {
             const mode = vtracerForm.find('input[name="mode"]:checked').val();
              if (mode === 'spline') {
                  $(".show_only_in_spline").show()
              } else {
                  $(".show_only_in_spline").hide()
              }
        }

        colormodeGroup.on('change', handleColormodeChange);
        handleColormodeChange();
        modeGroup.on('change', handleModeChange);
        handleColormodeChange();

           templateButtons.on('click', function () {
            toggleAdvancedButton.removeClass('actived');
               templateButtons.removeClass('active');
                $(this).addClass('active');
                advancedParams.hide(); //切换模板时隐藏
                const template = $(this).data('template');

                 let templateData = {};
                 if(template === 'default'){
                       templateData = {
                           colormode: 'color',
                           hierarchical: 'stacked',
                           mode: 'spline',
                           filter_speckle: 4,
                           color_precision: 6,
                           layer_difference: 16,
                           corner_threshold: 60,
                           length_threshold: 4.0,
                           max_iterations: 10,
                           splice_threshold: 45,
                           path_precision: 3
                        };
                    }
                    else if (template === 'template1') {
                           templateData = {
                           colormode: 'color',
                           hierarchical: 'stacked',
                           mode: 'polygon',
                           filter_speckle: 15,
                            color_precision: 5,
                           layer_difference: 58,
                           corner_threshold: 120,
                            length_threshold: 6.0,
                           max_iterations: 15,
                           splice_threshold: 90,
                           path_precision: 2
                        };

                    }
                    else if (template === 'template2') {
                        templateData = {
                            colormode: 'binary',
                             hierarchical: 'cutout',
                            mode: 'polygon',
                             filter_speckle: 0,
                            color_precision: 1,
                           layer_difference: 1,
                            corner_threshold: 30,
                           length_threshold: 8.0,
                           max_iterations: 5,
                           splice_threshold: 60,
                            path_precision: 1
                        };
                    }
                     else if (template === 'template3') {
                        templateData = {
                            colormode: 'color',
                            hierarchical: 'stacked',
                            mode: 'spline',
                           filter_speckle: 10,
                            color_precision: 8,
                           layer_difference: 15,
                            corner_threshold: 20,
                           length_threshold: 3.5,
                           max_iterations: 20,
                           splice_threshold: 10,
                           path_precision: 3
                        };
                    }

                    else if (template === 'template4') {
                        templateData = {
                            colormode: 'color',
                            hierarchical: 'stacked',
                            mode: 'spline',
                           filter_speckle: 40,
                            color_precision: 7,
                           layer_difference: 50,
                            corner_threshold: 55,
                           length_threshold: 7,
                           max_iterations: 20,
                           splice_threshold: 150,
                           path_precision: 1
                        };
                    }

                 updateForm(templateData);
                 handleColormodeChange();
        });
          toggleAdvancedButton.on('click', function(e) {
            templateButtons.removeClass('active');
             advancedParams.toggle();
             $(e.currentTarget).toggleClass('actived');
         });

         const helpButton = $('#help-button');
         helpButton.on('click', function() {
            const helpContent = $('#help');
            helpContent.toggleClass('open');
        const overlay = $('<div id="overlay"></div>');
        overlay.css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 8
        });
        $('body').append(overlay);
        overlay.on('click', function() {
            $('#help').removeClass('open');
            overlay.remove();
        });
        });
        $('#help').on('click', function(e) {
            $('#help').removeClass('open');
            overlay.remove();
        });
        
 });