// --------------------------------------- Main ----------------------------------------------
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
      svg,image, labelText, labelColor;

  // First settings
  innerPanel.hide();
  templatesCollection.hide();
  ribbonLeft.hide();
  ribbonRight.hide();

  // Show popowers
  var popoversSettings = function($this, content) {
    var that = $this;
    if (that.hasClass('disabled')) {
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

  $.ajax({
      url: LabelUrlSettings.currentTemplateUrl,
      type: "GET",
      dataType: 'json',
      success: function (data) {
          templateActive = data.data;
          loadTemplate(0);
      },
      error: function () {
      }
  });

  var getTemplates = {
    "success":true,
    "data": {
      "template":[
        "http://localhost/AlpStoriesPraga/Content/Templates/HP_girl_1.svg",
        "http://localhost/AlpStoriesPraga/Content/Templates/HB_1.svg",
        "http://localhost/AlpStoriesPraga/Content/Templates/HB_friend_1.svg"
      ]
    }
  };

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

  (function() {
      setTimeout(function () {
        templatePath = getTemplates.data.template;
    templatesPreview(templatePath);
  }, 100);
  })();

    /*
  (function() {
    setTimeout(function(){
      templateActive = getTemplate.data;
      templateActive.template = "../Content/UserTemplates/HP_girl_3.svg";
      loadTemplate();
    }, 100);
  })();
  */

    /*
  function ajaxCallTemplate(choosenTempl, callback) {
    setTimeout(function(){
      templateActive.template = choosenTempl;
      callback();
    }, 100);
  }
  */


  //
  //$.ajax({
  //  url: 'server/getData.json',
  //  type: "get",
  //  success: function (result) {
  //    var templatePath = result.data.template;
  //    templatesPreview(templatePath);
  //  },
  //  error: function(err) {
  //    console.log(err);
  //  }
  //});


// -----------------------------------------------------------------------------------------


// ------------------------------------------- Ribbon --------------------------------------
  var loadRibbon = function() {
    var productName = svg.find('#product');
    var icons = templateActive.icons.split(",");

    //Upload icons and product name
    productName[0].textContent = templateActive.productName;

    icons.forEach(function (icon, i) {
        icon = LabelUrlSettings.rootUrl+icon;
      var $img = svg.find('#Icon' + String(i + 1));
      jQuery.get(icon, function (data) {
        var $svg = jQuery(data).find('#g-transform');
        var $transform = $img.attr("transform");
        var $class = $img.attr("class");
        if ($class)
          $svg.find('path').attr('class', $class);
        $svg.attr('transform', $transform);
        $img.replaceWith($svg);
      });
    });

    // Upload ribbon

    //Add data to ribbon
    $('.ribbon-left-top').html(templateActive.elements);
    $('.ribbon-left-middle').html(templateActive.description);
    $('.ribbon-left-bottom').html(templateActive.usage);

    $('.ribbon-right-top> img').attr('src', LabelUrlSettings.rootUrl + templateActive.barCode);
    $('.productBestbefore').html(templateActive.bestbefore);
    $('.productManufacturer').html(templateActive.manufacturer);

    $('.productId').html(templateActive.productId);
    $('.ribbon-right-bottom img').attr('src', LabelUrlSettings.rootUrl+templateActive.qrCode);
    $('.productPrice').html(templateActive.price);

    var ribbonEl = $(svg.find('#text_background_left')[0]);
    var ribbonProp = {
      'opacity': ribbonEl.css('opacity'),
      'background': ribbonEl.css('fill')
    };


    function uploadRibbons() {
      if ($(window).width() >= 768) {

        //Get height and width of ribbons
        var bottomLine = document.getElementById('Button_Stripe').getBoundingClientRect();
        var ribbonSVGLeft = document.getElementById("text_background_left").getBoundingClientRect();
        ribbonProp.height = ribbonSVGLeft.width;
        ribbonProp.width = ribbonSVGLeft.height - bottomLine.height;
        for (var key in ribbonProp) {
          ribbonRight.css(key, ribbonProp[key]);
          ribbonLeft.css(key, ribbonProp[key]);
        }
        ribbonRight.css('right', ribbonProp.height);
        ribbonLeft.css('top', ribbonProp.width);

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
  var loadImageToServer = function(img) {
    console.log(img)
  };

//Send svg to server
  saveButton.on('click', function() {
    console.log(svg[0]);

      // Post data to the server
      //$.ajax({
      //  url: 'server/getData.txt',
      //  type: "put",
      //  success: function (result) {
      //    console.log(result)
      //  },
      //  error: function(err) {
      //    console.log(err);
      //  }
      //});
  });

// -----------------------------------------------------------------------------------------


// ------------------------------------------- Templates ------------------------------------
  var rotateInput = $('.rotate-slider'),
      rotateAngle = $('.rotate-slider-value'),
      scaleInput = $('.scale-imade-slider'),
      scaleIVal = $('.scale-imade-slider-value'),
      config = {};


  //Upload choosen templete
  var loadTemplate = function (i) {
      var url = "";
      if (i == 0)
          url = LabelUrlSettings.rootUrl + templateActive.template;
      else
          url = templateActive.template;
      
      template.load(url, function () {
          svg = $(this).find('svg');
          
      image = (svg.find('image.editable'))[0];
      
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
  var templatesPreview = function(templatePath) {
    var html = '<div class="row">';
    templatePath.forEach(function (value) {
      html += '<div class=" col-xs-6 col-sm-4 col-md-3">' +
        '<div class="template-file" src="'+ value + '" style= "background-image: url(' + value + ') "></div>' +
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
      loadTemplate(1);
    // Simulate request to the server
    //ajaxCallTemplate(choosenTempl, loadTemplate(1));
  });

  var loadImageOption = function () {
    if (image) {
      $(itemImage).add(uploadImage).removeClass('disabled');

      //Rotate image
      rotateInput.on("input", function (e) {
        var value = e.target.value;
        rotateAngle.val(Math.round(value) + '°');
        TweenLite.to(image, 0, { attr: { rotation: value, transformOrigin: "50% 50%" } });
      });
      
      //Scale image
      scaleInput.on("input", function (e) {
        var value = e.target.value;
        scaleIVal.val((+value).toFixed(1));
        TweenLite.to(image, 0, { attr: { scaleX: value, scaleY: value, transformOrigin: "50% 50%" } });
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
      
    if (labelText) {
      var html = '';
      $(textCollection).removeClass('disabled');
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

    if (labelColor) {
      var html = '';
      $(colorCollection).removeClass('disabled');
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
  colorCollection.on('change','.color-item', function() {
    var coloritemNumber = $(this).index() + 1;
    [].forEach.call(labelColor, function(value) {
      var oldColor = $(value).attr('class');
      var newColor = (oldColor.slice(0,-1)) + coloritemNumber;
      $(value).removeClass(oldColor).addClass(newColor);
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
          var imgDataUrl = img.toDataURL("image/png");
          $(image).attr("xlink:href",imgDataUrl);
          loadImageToServer(imgDataUrl);
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
