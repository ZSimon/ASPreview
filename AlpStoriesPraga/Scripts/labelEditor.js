// --------------------------------------- Main ----------------------------------------------
var refreshLabelEditorTemplate;
$( document ).ready(function() {
  'use strict';
  
  var uploadTemplate = $('li.template-upload>section'),
      uploadImage = $('li.image-upload>section'),
      itemImage = $('li.image-item-menu>section'),
      itemColor = $('li.color-item-menu>section'),
      itemText = $('li.text-item-menu>section'),
      fileLoader = $('#load-image'),
      templatesCollection = $('.templates-wrapper'),
      innerPanel = $('.nav-property-items'),
      label = $('.label'),
      template = $('#svg-template'),
      popovers = $('.nav-property').find('[data-toggle="popover"]'),
      ribbonLeft = $('.ribbon-left'),
      ribbonRight = $('.ribbon-right'),
      svg,image, labelText, labelColor, productId;

  // First settings
  innerPanel.hide();
  templatesCollection.hide();
  ribbonLeft.hide();
  ribbonRight.hide();

  // Show popowers
  var popoversSettings = function ($this, content) {
    var that = $this;
    if (that.hasClass('disabled')) {
        return;//popravil
      content = 'There no value to change'
    } else {
      content = content || 'To start creating your label, please, choose a template';
    }
    popovers.popover('destroy');
    that.popover({
      trigger: 'manual',
      content: content,
      placement: function(){
        if($(window).width() > 992){
          return 'top'
        } else {
          return 'bottom'
        }
      }
    });
    that.popover('show');
    setTimeout(function () {that.popover('hide')}, 3500);
  };

  // Events in nav-bar
  uploadTemplate.click(function () {
    templatesCollection.show();
  });

  uploadImage.click(function (e) {
    if ($(this).hasClass('disabled') || !template.children().length) {
      popoversSettings($(this));
    } else {
      fileLoader.click();
    }
  });

  $(itemImage).add(itemColor).add(itemText).on('click', function() {
    if ($(this).hasClass('disabled') || !template.children().length) {
      popoversSettings($(this));
    } else {
      innerPanel.slideUp('fast');
      $(this).parent().find(innerPanel).slideDown('slow');
    }
    return false;
  });

// ----------------------------------------------------------------------------------------

// ------------------------------------------- Ajax ---------------------------------------
    // Json files
  var templateActive, templatePath;
  
  function loadLabelEditor() {
      
      $.ajax({
          url: LabelUrlSettings.currentTemplateUrl+"/"+productId,
          type: "GET",
          dataType: 'json',
          success: function (data) {
              templateActive = data.template;
              loadTemplate();
              /*for bottle size*/
              var dimension = templateActive.template.charAt(templateActive.template.length - 5);
              $.ajax({
                  url: LabelUrlSettings.getTemplatesUrl,
                  type: "GET",
                  dataType: 'json',
                  data: { "dimension": dimension },
                  success: function (data) {
                      templatePath = data.templates;
                      templatesPreview(templatePath);
                  },
                  error: function () {
                  }
              });
          },
          error: function () {
          }
      });
  }
  //var getTemplate = {
  //  "success":true,
  //  "msg:":"",
  //  "data": {
  //      "bgImage": "../Content/img/bottle/bath_salt.jpg",
  //  "elements": "INGRIDIENTS: Helianthus Annuus Seed Oil, Prunus Amygdalus Dulcis Oil, Tocopheryl AcetatePelargonium Graveolens Flower Oil, Rosmarinus Officinalis Leaf Oil, Lavandula Angustifolia Oil, Linalool, d-Limonene, Geraniol, Limonene, Citral, Citronellol",
  //  "description":"<b>Massage oil based on sunflower and sweet almond oil is enriched with lavander essential oil, rose geranium essential oil, rosemary essential oil.</b>",
  //  "usage":"USAGE: Apply evenly and massage into skin. <br>CAUTION:For external use only. Avoid contact with eyes. Keep out of reach of children.",
  //  "bestbefore":"EXP. DATE: 29.04.2016<br><br><br>After opening store in a cool and dark place.",
  //  "manufacturer":"<b>Made in EU</b><br><br>MANUFACTURER: Vastok d.o.o., Dunajska cesta 136, 1000 Ljubljana, Slovenia.<br><b>www.alpstories.com</b>",
  //  "productId":"H10000260002412051630",
  //  "productName": "Best product ever",
  //  "price":"PRICE: 13.55 eur",
  //  "quantity":"250ml",
  //  "barCode": "../Content/img/little-kitty.jpg",
  //  "qrCode": "../Content/img/little-kitty.jpg",
  //  "icons": ["../Content/img/zajecBlk.svg", "../Content/img/pet1Blk.svg", "../Content/img/ALU41Blk.svg"]
  //  }
  //};

  // To avoid problems with CORS this functions are simulate request

// ------------------------------------------- Ribbon --------------------------------------
  var loadRibbon = function () {
    var productName = svg.find('.svgProduct');
    var quantity = svg.find('#quantity');
    var icons = templateActive.icons.split(",");

    if (quantity.length)
        quantity[0].textContent = templateActive.quantity + " ml" ;
    
      //Upload icons and product name
    if(productName.length)
        productName[0].textContent = templateActive.productName;
    
    if (icons.length) {
        icons.forEach(function (icon, i) {
            var $img = svg.find('#Icon' + String(i + 1));
            
            if ($img.length > 0) {
                jQuery.get(icon, function (data) {
                    var $svg = jQuery(data).find('#g-transform');
                    var $transform = $img.attr("transform");
                    var $class = $img.attr("class");
                    if ($class)
                        $svg.find('path').attr('class', $class);
                    $svg.attr('transform', $transform);
                    $img.replaceWith($svg);
                });
            }else
                return false;//exit foreach
        });
    }
    // Upload ribbon

    //Add data to ribbon
    $('.ribbon-left-top').html(templateActive.elements);
    $('.ribbon-left-middle').html(templateActive.description);
    $('.ribbon-left-bottom').html(templateActive.usage);
    $('.ribbon-right-top> img').attr('src', templateActive.qrCode);
    $('.productBestbefore').html(templateActive.bestBefore);
    $('.productManufacturer').html(templateActive.manufacturer);

    //$('.productId').html(templateActive.productId);
    $('.ribbon-right-bottom img').attr('src', templateActive.barCode);
    $('.productPrice').html("Price: "+templateActive.price+" eur");

    var ribbonEl = $(svg.find('#text_background_left')[0]);
    var ribbonProp = {
      'opacity': ribbonEl.css('opacity'),
      'background': ribbonEl.css('fill')
    };


    function uploadRibbons() {
      if ($(window).width() >= 768) {
        
        var barCode = $('.ribbon-right-bottom');
        //Get height and width of ribbons
          //var bottomLine = document.getElementById('Button_Stripe').getBoundingClientRect();

        var ribbonSVGLeft = document.getElementById("text_background_left").getBoundingClientRect();
        ribbonProp.height = ribbonSVGLeft.width;
        ribbonProp.width = ribbonSVGLeft.height; //- bottomLine.height;
        for (var key in ribbonProp) {
          ribbonRight.css(key, ribbonProp[key]);
          ribbonLeft.css(key, ribbonProp[key]);
        }
        ribbonLeft.css('top', ribbonProp.width);
        ribbonRight.css('top', ribbonProp.width);
        ribbonLeft.add(ribbonRight).show();
        //ribbonRight.css('right', ribbonProp.height);
        
        $('.ribbon-right-bottom img').on('load', function () {

            $('.ribbon-right-middle').css({
                'padding-left': barCode.height(),
                'padding-right': $('.ribbon-right-top').height()
            });

            //ribbonLeft.add(ribbonRight).css('visibility', 'visible');
        });

        ribbonRight.show();
        ribbonLeft.show();
      } else {
        ribbonRight.hide();
        ribbonLeft.hide();
      }
    }

    // Execute on load
    uploadRibbons();

    // Bind event listener
    $(window).resize(uploadRibbons);

  };

// --------------------------------------------------------------------------------------------


// ------------------------------------------- SaveButton -------------------------------------
  var saveButton = $('.title-save');

//Send image to server
  var loadImageToServer = function (img) {
      $.ajax({
          url: LabelUrlSettings.uploadImageUrl,
          type: "POST",
          dataType: 'json',
          data: { "productId": templateActive.productId,"bImage": img.replace(/^data:image\/(png|jpeg);base64,/, "") },
          success: function (data) {
              
          },
          error: function () {
          }
      });
    //console.log(img)
  };

//Send svg to server
  saveButton.on('click', function() {
      //console.log(svg[0]);
      //$(itemImage)
      var img = svg.find('#editableImg');
      if (img.length>0) {
          var transform = img[0].style.transform;
          img.attr('transform', transform);
          img.removeAttr('style');
      }
      
      //data: { "productId": "2", "svg": $.base64('encode', svg.prop('outerHTML')) },
      $.ajax({
          url: LabelUrlSettings.saveTemplateUrl,
          type: "Post",
          dataType: 'json',
          data: { "productId": productId, "svg": svg.prop('outerHTML')},
          success: function (data) {
              $3d_bottle.attr('src', "../3d_bottle/bottle3d.html?productId=" + productId + "&size=" + $('#size_block').val());
          },
          error: function () {
          }
      });

  });

// -----------------------------------------------------------------------------------------


// ------------------------------------------- Templates ------------------------------------
  var rotateInput = $('.rotate-slider'),
      rotateAngle = $('.rotate-slider-value'),
      scaleInput = $('.scale-imade-slider'),
      scaleIVal = $('.scale-imade-slider-value'),
      config = {};


  //Upload choosen templete
  var loadTemplate = function () {
      template.load(templateActive.template, function () {
          svg = $(this).find('svg');
          image = (svg.find('#editableImg'))[0];
      
          svg.attr({
            'width': '100%',
            'height': '100%'
          });
          loadTextOption();
          loadColorOption();
          loadImageOption();
          loadRibbon();
    });
  };

  // Upload template collection
  var templatesPreview = function (templatePath) {
    var html = '<div class="row">';
    templatePath.forEach(function (value) {
      html += '<div class=" col-xs-6 col-sm-4 col-md-3">' +
        '<div class="template-file" src="' + value + '" style= "background-image: url(' + value.slice(0, -6) + '.jpg) "></div>' +
        '</div>';
    });
    html += '</div>';
    templatesCollection.html(html);
  };

  // Close template collection
  $(document).mouseup(function (e) {
    if (!uploadTemplate.is(e.target) && !templatesCollection.is(e.target) && templatesCollection.has(e.target).length == 0) {
      templatesCollection.hide();
    }
  });

  // User choosen template from collection
  templatesCollection.on('click','.template-file', function () {
      var choosenTempl = $(this).attr('src');
      templatesCollection.hide();
      templateActive.template = choosenTempl;
      loadTemplate();
    // Simulate request to the server
    //ajaxCallTemplate(choosenTempl, loadTemplate(1));
  });

    // Refreshing label editor template when user clicks on "create label" button

    
  refreshLabelEditorTemplate = function (prodId) {
      productId = prodId;
      loadLabelEditor();
  };
  
  var loadImageOption = function () {
      /*change for 2 - check for others*/
      if (templateActive.quantity == 30)
          $(".label-editor .label-wrapper .label").toggleClass('small');
      else
          $(".label-editor .label-wrapper .label").removeClass('small');

    if (image) {

      $(itemImage).add(uploadImage).removeClass('disabled');
      TweenLite.set(image, { clearProps: "all" });

      //Rotate image
      rotateInput.on("input", function (e) {
        var value = e.target.value;
        rotateAngle.val(Math.round(value) + '°');
        TweenLite.to(image, 0, {rotation: value, transformOrigin:"50% 50%"});
      });
      
      //Scale image
      scaleInput.on("input", function (e) {
        var value = e.target.value;
        scaleIVal.val((+value).toFixed(1));
        TweenLite.to(image, 0, {scaleX: value, scaleY: value, transformOrigin:"50% 50%"});
      });

      // Draggable option
        (function () {
        Draggable.create(image, {
          type: "x,y",
          throwProps: true,
          zIndexBoost: false,
          force3D: false
        });
      })()
    } else {
      $(itemImage).add(uploadImage).addClass('disabled');
    }
  };


// -----------------------------------------------------------------------------------------

// ------------------------------------------- Text ----------------------------------------
  var textCollection = $('.text-editor'),
      textMobNumber = 0;

  // Upload editable text
  var loadTextOption = function() {
    labelText = svg.find('text.editable');
      
    if (labelText.length) {
      var html = '';
      $(textCollection).removeClass('disabled');
      itemText.removeClass('disabled');
      [].forEach.call(labelText, function(value) {
        html += '<li class="text-item hidden-xs col-sm-6">' +
          '<input type="text" class="template-text" value="'+ value.textContent + '"/>' +
          '</li>';
      });
      html += '<li class="text-item mobile-property-item visible-xs">' +
        '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
        '<input type="text" class="template-text" value="'+ labelText[textMobNumber].textContent + '"/>'+
        '<span class="glyphicon glyphicon-chevron-right next" aria-hidden="true"></span>'+
        '</li>';
      textCollection.html(html);
    } else {
      // Disable click if there no data
      itemText.addClass('disabled');
    }
  };

  // Change text - tablets+ view
  textCollection.on('keyup change paste','.text-item', function() {
    var textNumber = $(this).index();
    var that = $(this);
    setTimeout(function () {
      if (textNumber < labelText.length) {
        labelText[textNumber].textContent = that.children().val();
      } else {
        labelText[textMobNumber].textContent = that.children('input').val();
      }
    }, 100);
  });

  // Change text - mobile view
  textCollection.on('click','.mobile-property-item .glyphicon', function() {
    var parent = $(this).parent();
    textMobNumber += $(this).hasClass('next') || - 1;
    if (textMobNumber >= labelText.length) {
      textMobNumber = 0;
    } else if (textMobNumber == -1) {
      textMobNumber += labelText.length ;
    }
    parent.children('input').val(labelText[textMobNumber].textContent);
  });

// -----------------------------------------------------------------------------------------


// ----------------------------------------- Color -----------------------------------------
  var colorCollection = $('.color-editor'),
      colorMobNumber = 1,
      colorNumber;

  // Upload variants of color
  var loadColorOption = function() {
    labelColor = svg.find('[class^="rpl"]');
    colorNumber =  svg.attr('data-color-numbers');

    if (colorNumber!="0") {
      var html = '';
      $(colorCollection).removeClass('disabled');
      itemColor.removeClass('disabled');
      for (var i = 1; i <= colorNumber; i++) {
        html += '<li class="color-item hidden-xs col-sm-6">' +
          '<label>' +
          '<input type="radio" name="color">' +
          '<span class="color"></span>'+
          'Theme ' + i +
          '</label>' +
          '</li>';
      }
      html += '<li class="color-item mobile-property-item visible-xs">' +
        '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
        '<label>' +
        '<input type="radio" name="color">' +
        '<span class="color"></span>'+
        'Theme ' + (colorMobNumber+1) +
        '</label>' +
        '<span class="glyphicon glyphicon-chevron-right next" aria-hidden="true"></span>'+
        '</li>';
      colorCollection.html(html);
      var choosenColor = $(colorCollection.find('.color-item')[0]).children('label').children('input');
      choosenColor.prop('checked', 'true');
    } else {
      // Disable click if there no data
      itemColor.addClass('disabled');
    }
  };

  // Change color theme - tablets+ view
  colorCollection.on('change', '.color-item', function () {
    var coloritemNumber = $(this).index() + 1;
    [].forEach.call(labelColor, function(value) {
      var oldColor = $(value).attr('class');
      var newColor = (oldColor.slice(0, -1)) + coloritemNumber;
      $(value).attr("class", newColor);
      //$(value).removeClass(oldColor).addClass(newColor);
    });
  });

  // Change color theme - mobile view
  colorCollection.on('click','.mobile-property-item .glyphicon', function() {
    var parent = $(this).parent();
    colorMobNumber += $(this).hasClass('next') ||- 1;
    if (colorMobNumber >= colorNumber) {
      colorMobNumber = 1;
    } else if (colorMobNumber == -1) {
      colorMobNumber += colorNumber;
    }
    parent.children('label').html(
      '<input type="radio" name="color">' +
      '<span class="color"></span>'+
      'Theme' + (colorMobNumber)
    );
    [].forEach.call(labelColor, function(value) {
      var oldColor = $(value).attr('class');
      var newColor = (oldColor.slice(0,-1)) + colorMobNumber;
      $(value).removeClass(oldColor).addClass(newColor);
    });
  });

// -----------------------------------------------------------------------------------------


// ------------------------------------------- Image ---------------------------------------
  var replaceResults = function (img) {
      if (!(img.src || img instanceof HTMLCanvasElement)) {
        //Loading image file failed
      } else {
          
          var file = $("#load-image").get(0).files[0];
          var data = new FormData();
          data.append("UploadedImage", file);

          $.ajax({
              type: "POST",
              url: '/LabelEditor/UploadImage?productId='+templateActive.productId,
              contentType: false,
              processData: false,
              data: data,
              success: function(result) {
                  $(image).attr("xlink:href", result.msg);
              },
              error: function (xhr, status, p3, p4){
                  var err = "Error " + " " + status + " " + p3 + " " + p4;
                  if (xhr.responseText && xhr.responseText[0] == "{")
                      err = JSON.parse(xhr.responseText).Message;
                  console.log(err);
              }
          });
          $("#load-image").val('');
          
          //var imgDataUrl = img.toDataURL("image/jpg");
          //$(image).attr("xlink:href",imgDataUrl);
          //loadImageToServer(imgDataUrl);
      }
    },
    dropChangeHandler = function (e) {
      e.preventDefault();
      e = e.originalEvent;
      
      var target = e.dataTransfer || e.target,
          file = target && target.files && target.files[0],
          options = {
            //maxWidth: config.
            //maxHeight: config.templH,
            canvas: true
          };
       if (!file) {
        return;
      } else if (!loadImage(file, replaceResults, options)) {
           //Your browser does not support the URL or FileReader API.
      }
    };

  // Image upload
  $(document)
    .on('dragover', function (e) {
      e.preventDefault();
      e = e.originalEvent;
      e.dataTransfer.dropEffect = 'copy';
      //if(!label.find('.dragover').length) {
      //  label.append('<div class="dragover"></div>');
      //}
    })
    .on('drop',function(e) {
      if (!template.children().length) {
        popoversSettings(uploadImage);
        e.preventDefault();
      } else {
        dropChangeHandler(e);
      }
    })
    .on('dragleave drop', function(e) {
        //label.find('.dragover').remove();
    });
  fileLoader.on('change', dropChangeHandler);
});

// -----------------------------------------------------------------------------------------
