$(document).ready(function(){

    /*var $nav_tabs = $('#nav_tabs');

    $nav_tabs.find('a').each(function(i){
        $(this).on( "mouseover", function(){
            var $detail = $(this).parents('#product_details').find('#info_'+i);
            $(this).parent().addClass('active').siblings().removeClass('active');
            $detail.removeClass('dispNone').siblings().addClass('dispNone');
        });
    });*/

});

function smartIngredients(product, quantity){
    
    //var $ingredients = $('#ingredients');
    var product = product;
    
    var $productDescList = $('<ul id="product_desc_list" class="product-desc-list">');
    var $canvas = $(".product-essential").find(".gallery")
        .attr("id", "product_detail_image")
        .addClass("product-detail-image")
        .addClass("product-detail-image")
        .html('');
    var $priceTbl = $('<ul id="price_table" class="price-table"></ul>');
    var $PTblLastCh = $('<li class="price-line" data-id=-2>').html('<span>Total + VAT</span><span></span><span id="TPrice">'+0.00+'</span><span></span>');
    var $matchBtn = $('<button id="match_to_my_profile" class="match-to-my-profile" data-disabledText="matched">Match to my profile</button>');
    var $CLabelBtn = $('<button id="create_label" class="create-label">Create label</button>');

    /******     ingredients dropdown blok      *****/
    var $prodTabsLine = $('<ul id="prod_tabs_line" class="prod-tabs-line drop-down">');
    /*****         *****/

    /******     product size dropdown blok      *****/
    var $sizeBlock;
    if(quantity==0|| quantity==220)
        $sizeBlock = $('<aside class="size-block"><select name="size" id="size_block" ><option value="220">220ml</option><option value="30">30ml</option></select><p>Select packaging</p></aside>');
    else
        $sizeBlock = $('<aside class="size-block"><select name="size" id="size_block" ><option value="220">220ml</option><option value="30" selected>30ml</option></select><p>Select packaging</p></aside>');
    /*****         *****/

    var $canvas_id = $canvas.attr('id');
    var width = $canvas.outerWidth(),
        height = $canvas.outerHeight();

    var $nodes = $('');
    var $backCover = $('<div class="back-cover">').css({width: width, height: height});

    var smWidth = width<450;
    var radius = smWidth?26:35,
        radiusBG = radius+6,
        node;
    var nodes = [
        { radius : 5, fixed : true, x : width/2, y : height/4 },
        { radius : radius, fixed : true, x : width/2, y : height/3 },
        { radius : 5, fixed : true, x : width/2, y : height/2+50 },
        { radius : 5, fixed : true, x : width/2, y : height - height/4 }
    ];
    //var colors = ["#0000FF","#E8430C","#225428","#002E54","#FFD700"];
    //var PNC = nodes.length, /* Passive Nodes Count */
        //RemNodes = [];

    var force = null;
    var svg  = null;

    var thisObject = this;

    var obj_matched = [];
    var matched,
        basePrice,
        currency,
        prodDesc,
        prodName,
        VAT,
        scent_q;

    this.ingredients = {};
    this.chosenIngredients = [];

    var __construct = function () {
        setTimeout(function () { return thisObject.start(product, quantity); }, 10);
    }();
    
    this.start = function (product, quantity) {
        this.getData(quantity);
    }

    this.d3Start = function(){
        force = d3.layout.force()
            .gravity(0.25)
            .charge(function(d, i){
                switch(i){
                    case 0: return smWidth ? -400 : -1200;
                    case 1: return smWidth ? -800 : 20;
                    case 2: return smWidth ? -2500 : -3000;
                    case 3: return smWidth ? -1500 : -3000;
                    default : return smWidth ? -2000 : -1500;
                }
            })
            .nodes(nodes)
            .size([width, height])
            .on("tick", function(){ return thisObject.tick(); })
            .start();

        svg = d3.select("#"+$canvas_id).append("div");

        //for(var k in obj_matched) this.addIng(obj_matched[k]);

        this.addDescript();
        this.visualizeNode();
        this.reDesign();

        return this.domEvents();
    }

    this.addDescript = function(){
        var $d = $('<div class="clear description"><h2>Description</h2><p>' + prodDesc + '</p></div>');
        $d.insertAfter($canvas.parent());
    }

    this.visualizeNode = function(){
        node = svg.selectAll(".nodeKnob")
            .data(nodes)
            .enter().append("div")
            .attr("class", "nodeKnob")
            .attr("data-id", function(d) { return d.id; } )
            .attr("id", function(d, i) { return (d.type != undefined) ? "par_"+d.type : "par_"+i; } )
            .style("width", function(d) { return (d.radius*2)+"px"; } )
            .style("height", function(d) { return (d.radius*2)+"px"; } )
            .style("visibility", function(d, i) { return i<4 ? "hidden" : "visible"; })
            .style("top", function(d) { return  ( d.y-d.radius )+"px"; })
            .style("left", function(d) { return ( d.x-d.radius )+"px"; })
            .call(force.drag)
            .on("click", function(d) {
                if(d3.event.defaultPrevented) return;

                var $target = $(d3.event.target);
                var $this = $target.parents('li.ingredient');

                if( $target.hasClass('ingredient-image') )
                    if($this.hasClass('active')){
                        var $par = $this.parent().parent();
                        if($par.hasClass('open'))
                            thisObject.closeAll($par);
                        else
                            thisObject.openAll($par);
                    } else
                        thisObject.changeActive($this);

            });

       /* setTimeout(function(){
            for(var k in obj_matched) thisObject.addIng(obj_matched[k]);
        }, 500);*/

    }

    this.matchProd = function($this){
        if( !$this.parent().parent().hasClass('open') ){
            $this.siblings('.active').addClass('hide');
            $this.removeClass('hide');
        }
        thisObject.changeActive($this);
    }

    this.changeActive = function($this){
        var $active = $this.siblings('.active');
        this.hideDesc($active);
        this.showDesc($this);
        this.updateProdNamePrice($this);
        this.removePriceLine($active);
        this.addPriceLine($this);
        $active.css({
            top: $this.css('top'),
            left: $this.css('left')
        }).removeClass('active')
            .find('.knob').trigger('configure',{
                "fgColor": "transparent",
                "bgColor": "transparent",
                "height" : radius*2,
                "width" : radius*2
            });

        $this.addClass('active').css({ top: 0, left: 0 });
        $this.find('.knob').trigger('configure',{
            "fgColor": "gold",
            "bgColor": "#FFF9D9",
            "height" : radiusBG*2,
            "width" : radiusBG*2
        });

        this.closeAll( $this.parent().parent() );

        this.enableButton($matchBtn);

        $backCover.removeClass('active');
        
        //product = $this.attr("data-id");
        product = $this.data('pId');
        //$("#size-block option:selected").text();
        $3d_bottle.attr('src', "../3d_bottle/bottle3d.html?productId=" + product + "&size=" + $('#size_block').val()); /* changing bottle on scent update */
    }

    this.updateProdNamePrice = function ($this) {
        basePrice = $this.data('pPrice');
        var pName = $this.data('pName');
        var $prodLi = $priceTbl.children().first();
        $('#desc_title').find('h2').text(pName);
        $prodLi.children().first().text(pName);
        $prodLi.children().last().prev().text(basePrice + currency);
    }

    this.closeAll = function($par){
        $par.removeClass('open');
        var $li = $par.children().children().not('.active');
        $li.addClass('hide').css({ top: 0, left: 0 });
        $backCover.removeClass('active');
    }

    this.openAll = function($par){
        $par.addClass('open');
        var $li = $par.children().children().not('.active');
        var r = radius * 2.2;
        //var s = $li.size();
        //var step = (2*Math.PI)/s;
        var step = .25*Math.PI;

        $li.each(function(i) {
            var $this = $(this);
            setTimeout(function(){
                var Y = Math.round(r * Math.cos(step*i+1.57));
                var X = Math.round(r * Math.sin(step*i+1.57));
                $this.removeClass('hide').css({
                    top: Y + 6,
                    left: X + 6
                });
            }, 50*i, i, $this);
        });
        $backCover.addClass('active');
    }

    this.addIng = function($this){
        var $circle = $this.find('div');
        var parPos = $this.parents('#product_detail_image').offset() /*|| {left: this.getRandNum(130, width+530), top: 100}*/;
        var pos = $circle.offset();
        var posX = pos.left - parPos.left - 10 + radius,
            posY = pos.top - parPos.top - 10 + radius;
        var $DDcontent = $this.parents('.drop-down-content');
        $DDcontent.addClass('dispNone');
        $this.addClass('active');
        setTimeout(function(){ $DDcontent.removeClass('dispNone'); }, 200, $DDcontent);
        this.add($circle, posX, posY);
    }

    this.add = function ($this, X, Y) {
        debugger;
        var $clone = $this.clone();
        var d = $this.data();
        var c = d.color || '';
        var type = d.gName;
        var id = parseInt( d.ingredient_id );
        var value = parseFloat( d.value );
        var price = parseFloat( d.price );
        var name = d.name;
        var lgt = nodes.length-4;
        var no_de = {x: X, y: Y, name: name, radius: radiusBG, type: type, id: id};
        nodes.push(no_de);

        force.charge(function(d, i){
            switch(i){
                case 0: return smWidth ? -600 : -1200;
                case 1: return smWidth ? -300 : 20;
                case 2: return smWidth ? -1500 : -3000;
                case 3: return smWidth ? -1500 : -3000;
                default : return smWidth ? -2000+(30*lgt) : -3200+(280*lgt);
            }
        }).nodes(nodes).start();

        var $div = $('<div id="par_'+type+'" class="nodeKnob" data-cid="'+id+'" data-id="'+d.ingredient_id+'">');
        var $ingredient = $('<div id="ingredient_'+id+'" class="ingredient active tooltip" data-title="'+name+'">')
            .data({ price : price, value : value, id : id });
        var $knob = $('<input class="knob" value="'+value+'" />');
        $ingredient.append($clone).append($knob);
        $div.append($ingredient);

        node = svg.selectAll(".nodeKnob")
            .data(nodes)
            .enter().append(function(){ return $div[0]; })
            /*.attr("data-id", function(d) { return d.id; } )*/
            .attr("id", function(d, i) { return (d.type != undefined) ? "par_"+d.type : "par_"+i; } )
            .style("width", function(d) { return (d.radius*2)+"px"; } )
            .style("height", function(d) { return (d.radius*2)+"px"; } )
            .style("visibility", function(d, i) { return i<4 ? "hidden" : "visible"; })
            .style("top", function(d) { return  ( d.y-d.radius )+"px"; })
            .style("left", function(d) { return ( d.x-d.radius )+"px"; })
            .call(force.drag);

        force.start();

        this.showDesc($ingredient);
        this.addPriceLine($ingredient);
        this.enableButton($matchBtn);

        return this.knobify($ingredient, d, id, true, c);
    }

    this.colaps = function () {
        $canvas.children().remove();
        $canvas.siblings('.overview').children().not('.availability').remove();
        $canvas.siblings('#desc_title').remove();
        $canvas.parent().next('.clear').remove();
    }

    this.getNodes_test = function(){
        console.log(nodes);
    }

    this.remove = function(id){
        var $PLine = $canvas.find('#ingredient_'+id).parents('.nodeKnob');
        for(var i in nodes)
            if(nodes[i].id == id){
                //RemNodes[i] = nodes.splice(i, 1)[0];
                $canvas.find('#prod_tabs_line').find('[data-list-id='+id+']').removeClass('active');
                this.hideDesc($PLine);
                this.removePriceLine($PLine);
                $PLine.remove();
            }
        //$ingredients.children('[data-id="'+id+'"]').find('.hide').removeClass('hide');
        return force.start();
    }

    this.tick = function(){
        var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;

        while (++i < n) q.visit(this.collide(nodes[i]));

        svg.selectAll(".nodeKnob")
            .style("top", function(d) { return ( d.y-d.radius ).toFixed(2)+"px"; })
            .style("left", function(d) { return ( d.x-d.radius ).toFixed(2)+"px"; });
    }

    this.collide = function(nd){

        var r = nd.radius + 16,
            nx1 = nd.x - r,
            nx2 = nd.x + r,
            ny1 = nd.y - r,
            ny2 = nd.y + r;
        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== nd)) {
                var x = nd.x - quad.point.x,
                    y = nd.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = nd.radius + quad.point.radius;
                if (l < r) {
                    l = (l - r) / l * .5;
                    nd.x -= x *= l;
                    nd.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }

    this.getSize = function(imgUrl){
        var img = new Image();
        img.src = imgUrl;
        /*return ( img.onload = function(){ */return [img.width, img.height];/* } )(img);*/
    }

    this.getRandNum = function(min, max){
         return Math.round((Math.random() * (max - min)) + min);
    }

    this.addPriceTbl = function(){
        var $li = $('<li class="price-line" data-id=-1>').html('<span>'+prodName+'</span><span></span><span>'+basePrice+currency+'</span><span></span>');
        $priceTbl.append($li).append('<li style="padding:0;border:0;border-bottom:2px"><ul></ul></li>').append($PTblLastCh);
    }

    this.addDescTbl = function(){
        var $desc_li = $('<div id="desc_title" class="desc-title"><h2>'+prodName+'</h2></div>');
        $canvas.parent().append($desc_li);
        $canvas.parent().append($productDescList);
    }

    this.hideDesc = function($ingr){
        $ingr.each(function(){
            var $this = $(this);
            var id = $this.find('li.active').data('id') || $this.data('id');
            $productDescList.find('#desc_'+id).addClass('dispNone');
        });
        $productDescList.perfectScrollbar('update');
    }

    this.showDesc = function($ingr){
        var id = $ingr.find('li.active').data('id') || $ingr.data('id');
        $productDescList.find('#desc_'+id).removeClass('dispNone');
        $productDescList.perfectScrollbar('update');
    }

    this.removePriceLine = function($ingr){
        $ingr.each(function(){
            var $this = $(this);
            var id = $this.find('li.active').data('id') || $this.data('id');
            $priceTbl.find('#ingr_'+id).remove();
        });
        return this.updateTotPrice();
    }

    this.addPriceLine = function($ingr){
        var isRem = !!$ingr.find('.removable').size() ? '<i></i>' : '';
        //var isRem = '<i></i>';
        var id = $ingr.data('id') || $ingr.attr('data-id');
        var prc = $ingr.data('price');
        var val = $ingr.data('value').toFixed(2);
        scent_q = val;
        var name = $ingr.data('title') || $ingr.attr('data-title') || '';
        var price = (prc * val).toFixed(2) + currency;
        var calc = val+" x "+prc+currency;
        var $line = $('<li id="ingr_'+id+'" class="price-line" data-id="'+id+'"><span>'+name+'</span><span>'+calc+'</span><span>'+price+'</span><span>'+isRem+'</span></li>')
            .data('price', price);
        $priceTbl.find('ul').append($line);
        return this.updateTotPrice();
    }

    this.updateTotPrice = function(){
        var TPrice = basePrice;
        var $pList = $priceTbl.find('ul');
        $pList.find('li').each(function(){
            TPrice += parseFloat( $(this).data('price') );
        });
        $PTblLastCh.find('#TPrice').text((TPrice + VAT * TPrice).toFixed(2) + currency);
    }

    this.updateIngrPrice = function(v, $li, scent, id){
        //v = v.toFixed(2);
        scent_q = v.toFixed(2);
        var sid = "#ingr_"+( scent.ingredient_id || $li.data('id') || $li.attr('data-id') );
        var $pList = $priceTbl.find(sid);
        var p = $li.data('price');
        var pr = (p * v).toFixed(2) + currency;
        $pList.data('price', pr).children().each(function(i){
            switch(i){
                case 1: $(this).text(v.toFixed(2)+' x '+p+currency);  break;
                case 2: $(this).text(pr);
            }
        });
        return this.updateTotPrice();
    }

    this.getData = function (quantity) {
        
        $.ajax({
            url: LabelUrlSettings.getIngredientsUrl,
            type: "GET",
            dataType: 'json',
            data: { "productId": product, quantity: quantity },
            success: function (result) {
                var data = result.data;
                product = data.Id;
                matched = !!data.matched;
                basePrice = data.basePrice;
                prodDesc = data.description;
                currency = data.currency;
                prodName = data.name;
                VAT = data.VAT;
                
                $3d_bottle = $('<iframe src="../3d_bottle/bottle3d.html">');
                $3d_bottle.attr('src', "../3d_bottle/bottle3d.html?productId=" + product );
                $canvas.append($3d_bottle);

                thisObject.ingredients = JSON.parse(JSON.stringify(data.ingredients));
                if(matched) thisObject.disableButton($matchBtn);
                return thisObject.makeAll();
            },
            error: function(err){

            }
        });
    }

    this.hideRemovables = function(){
        $canvas.children('div').find('.removable').each(function(){
            thisObject.remove($(this).parent().parent().data('id'));
        });
    }

    this.getMatched = function(){
        $.ajax({
            url: '../server/ingredients_matched.json',
            type: "POST",
            dataType:'json',
            success: function(data){
                var pi = data.profileIngredients;
                for(var i in pi){
                    var $this = $canvas.find('#ingredient_'+pi[i].ingredient_id);
                    if($this.size() && !$this.hasClass('active'))  /* */
                        thisObject.matchProd($this);
                }
                return thisObject.disableButton($matchBtn);
            },
            error: function(){
                //alert("");
            }
        });
    }

    this.openLabelEditor = function(){
        $('#label_editor').removeClass('VisHidden');
        $('#panel_content').removeClass('show');
    }

    this.closeLableEditor = function(){
        $('#panel_content').addClass('show');
        $('#label_editor').addClass('VisHidden');
    }

    this.disableButton = function($btn){
        if( $btn.prop('disabled') ) return;
        var txt = $btn.data('disabledText') || $btn.attr('data-disabledText') || '';
        $btn.prop('disabled', true);
        if(txt.length) $btn.data('disabledText', $btn.text()).text(txt);
    }

    this.enableButton = function($btn){
        if( !$btn.prop('disabled') ) return;
        var txt = $btn.data('disabledText') || $btn.attr('data-disabledText') || '';
        $btn.prop('disabled', false);
        if(txt.length) $btn.data('disabledText', $btn.text()).text(txt);
    }

    this.AddNodes = function(name, n, id){
        for(var i in n){
            if(!!n[i].selected)
                return nodes.push({x: this.getRandNum(-30, width+30), y: 10, radius: radiusBG, name: n[i].name, type: name, id: id});
        }
    }

    this.makeAll = function(){
        this.addPriceTbl();
        this.addDescTbl();
        for(var i in this.ingredients){
            var name = (this.ingredients[i].name).toLowerCase(),
                item_s = this.ingredients[i].items,
                id = this.ingredients[i].category_id,
                r = this.ingredients[i].removable,
                e = this.ingredients[i].editable;
            switch (name){
                case "scent":
                case "minerals":
                case "extracts":
                case "oil":
                    this.makeGroup(name, item_s, r, e, id);/*, colors[i]*/
            }
        }
        return this.d3Start();
    }

    this.makeGroup = function(name, ing_obj, r, e, id){/*, c*/
        var $L = $('<li id="ing_'+id+'" class="drop-down-par">').html("<span>"+name+"</span>");  /* style="color:'+c+'"*/
        var $SmDD = $('<div id="DD_'+id+'" class="drop-down-content">');
        var $SmList = $('<ul id="dropDownList_'+id+'" class="drop-down-list">');

        $SmDD.append($SmList);
        $L.append($SmDD);
        $prodTabsLine.append($L);
        switch (e){
            case 1:
                this.circleGroup(name, ing_obj, r, e, id);/*, c*/
                break;
            case 0:
                this.tabGroup($SmList, name, ing_obj, r, e, id);/*, c*/
        }
    }

    this.circleGroup = function(name, ing_type_obj, r, e, id){/*, c*/
        var $ing = $('<ul id="'+name+'" class="'+name+' '+(r?'removable':'')+'">');
        var isSelected = false;
        $nodes = $nodes.add($ing);
        //var l = nodes.length;
        for(var i in ing_type_obj){
            var s = ing_type_obj[i];
            var is = !!s.selected && !isSelected;
            
            var $ingredient = $('<li id="ingredient_' + s.ingredient_id + '" class="ingredient ' + (is ? 'active' : 'hide') + ' tooltip" data-title="' + s.name + '" data-id="' + s.ingredient_id + '">' +
                '<div class="ingredient-image unselectable ' + (r ? 'removable' : '') + '" style="background-image: url(' + s.icon + ')" ></div>' + /*border:1px solid '+c+';*/
                '<input class="knob" value="' + s.value + '" />' +
                '</li>').data({ price: s.price, value: s.value, pId: s.productId, pName: s.pName, pPrice: s.pPrice });

            $ing.append($ingredient);
            if(!!s.selected) isSelected = true;
            this.knobify($ingredient, s, i, is);/*, c*/

            if(is) this.showDesc($ingredient);
            if(is) this.addPriceLine($ingredient);
            if(is) id = s.ingredient_id;


            var $desc_li = $('<li id="desc_'+s.ingredient_id+'" class="ingredient'+(is?'':' dispNone')+'" data-id="'+s.ingredient_id+'">'+
                '<div class="ingredient-main">'+
                '<div class="desc-image" style="background-image:url(' + s.icon + ')"></div>' +/*border-color:'+c+';*/
                '<h2>'+s.name+'</h2>'+/* style="color:'+c+'"*/
                '</div>'+
                '<div class="ingredient-desc">'+
                '<p>'+s.description+'</p>'+
                '</div>'+
                '</li>');

            $productDescList.append($desc_li);

        }
        return this.AddNodes(name, ing_type_obj, id);
    }

    this.knobify = function($ingredient, scent, id, is){/*, c*/
        var step = scent.max/20;
        var size = is ? radiusBG*2 : radius*2;
        $ingredient.find('.knob').data('step', step).knob({
            "min" : scent.min,
            "step" : step,
            "width" : size,
            "height" : size,
            "max" : scent.max,
            "thickness" : .05,
            "lineCap" : "round",
            "displayInput" : false,
            "bgColor" : !is ? "transparent" : "#FFF9D9", /*rgba(255, 215, 0, 0.15)*/
            "fgColor" : !is ? "transparent" : "gold",
            "release"  : function(v){ thisObject.updateIngrPrice(v, $ingredient, scent, id); },
            "change"  : function(v){ thisObject.updateIngrPrice(v, $ingredient, scent, id); }
        });
    }

    this.tabGroup = function ($SmList, name, ing_obj, r, e, id) {/*, c*/
        for (var i in ing_obj) {
            var s = ing_obj[i];
            /*var isSelected = s.selected;*/
            var visible = !!(matched && s.selected);
            s.gName = name;
            /*s.color = c;*/
            s.gID = id;
            //var is = !!s.selected;
            var $li = $('<li data-list-id="' + s.ingredient_id + '" class="drop-down-item unselectable">').html("<span>" + s.name + "</span>");
            var $ingredient = $('<div class="ingredient-image unselectable ' + (r ? 'removable' : '') + '" style="background-image: url(' + s.icon + ')"></div>').data(s);  /*border:1px solid '+c+';*/
            $li.append($ingredient);
            $SmList.append($li);

            //var $desc_li = $('<li id="desc_'+s.ingredient_id+'" '+(visible?'':'class="dispNone"')+'><p>'+s.description+'</p></li>');

            var $desc_li = $('<li id="desc_' + s.ingredient_id + '" class="ingredient' + (visible ? '' : ' dispNone') + '" data-id="' + s.ingredient_id + '">' +
                                    '<div class="ingredient-main">' +
                                        '<div class="desc-image" style="background-image:url(' + s.icon + ')"></div>' +/*border-color:'+c+';*/
                                        '<h2>' + s.name + '</h2>' +  /* style="color:'+c+'"*/
                                    '</div>' +
                                    '<div class="ingredient-desc">' +
                                        '<p>' + s.description + '</p>' +
                                    '</div>' +
                                '</li>');

            $productDescList.append($desc_li);

            if (visible) obj_matched.push($li);
        }
    }

    this.reDesign = function(){
        var $overview = $('div.overview');
        var $buttons = $overview.find('.buttons');
        var $availability = $overview.find('.availability');
        var $tablist = $('ul').filter('[role="tablist"]').addClass('tablist');
        var $PTBody = $('.productTabs-body');
        var $mainTab = $('<div class="main-tab" aria-labelledby="ui-id-main">');

        $buttons.find('input').each(function(){
            var val = $(this).val();
            $(this).removeAttr('value').parent().attr({title: val});
        });

        $priceTbl.insertAfter($availability);
        $productDescList.insertBefore($priceTbl);

        var $tablistCh = $tablist.children().removeClass().removeAttr("aria-selected id").off();
        $tablistCh.find('a').off();
        var $tablistChL = $tablistCh.filter(":last");
        var $tablistChF = $tablistCh.filter(':first').removeAttr("aria-labelledby");

        $tablistChL.clone().prependTo($tablist).attr("aria-labelledby", "ui-id-x").append('<a>&nbsp;</a>').find('a:first').remove();
        $tablistChF.clone().insertAfter($tablistChF).find('a').text('ingredients');
        $tablistChF.clone().insertAfter($tablistChF).find('a').text('description');
        $tablistChF.clone().insertAfter($tablistChF).attr("aria-labelledby","ui-id-main").find('a').text('main');

        $($availability.prevAll().get().reverse()).appendTo($mainTab);
        $PTBody.insertBefore($availability);
        $PTBody.append($mainTab);

        return this.repairTabs($tablist, $PTBody);
    }

    this.repairTabs = function($tablist, $PTBody){
        var $tablistCh = $tablist.children();
        var $PTBodyCh = $PTBody.children();
        $tablistCh.not(':first').each(function(i){
            i++;
            var $tabCntnt = $PTBodyCh.filter("[aria-labelledby='"+$(this).attr("aria-labelledby")+"']");

            if($tabCntnt.size() && $(this).attr('aria-labelledby') != 'ui-id-main'){
                $tabCntnt.removeAttr('style').addClass("dispNone").html('<p>'+i+'</p>');
            } else {
                if( $(this).attr('aria-labelledby') == 'ui-id-main' ){
                    ///alert( $(this).attr('aria-labelledby') );
                } else {
                    $tabCntnt = $('<div class="dispNone">').html('<p>'+i+'</p>');
                    $PTBody.append($tabCntnt);
                }
            }



            $(this).attr({ "tabindex":i, "aria-labelledby":"ui-id-"+i})
                .find('a').removeAttr("id")
                .on("click", function(e){
                    $(this).addClass('active').parent().siblings()
                        .find('a').filter('.active').removeClass('active');

                    $PTBody.children().not($tabCntnt).addClass('dispNone');
                    $tabCntnt.removeClass('dispNone');

                    e.preventDefault();
                });
        });

    }

    this.domEvents = function(){

        $canvas/*.append($matchBtn).append($CLabelBtn).append($prodTabsLine)*/.append($sizeBlock).append('');


        var $addToCart = $('<button class="match-to-my-profile" style="position: relative;float: right">Create product</button>');
        $addToCart.insertAfter($priceTbl);
        $CLabelBtn.insertAfter($priceTbl);

        this.updateTotPrice();

        setTimeout(function(){

            $nodes.each(function(){
                var $this = $(this);
                var id = '#par_' + $this.attr('id');
                $(id).append($this);
            });

            $canvas
                .on('mousewheel DOMMouseScroll', ".ingredient-image", function(e){
                    $(this).parent().find('canvas').trigger("DOMMouseScroll", [ e.originalEvent ]);
                    e.stopPropagation();
                    e.preventDefault();
                })
                .find('canvas').on("mousedown touchstart", function(e){
                    e.stopPropagation();
                });

        }, 1000);

        $canvas.children('div').append($backCover);

        $sizeBlock.on("change", function () {
            var val = $(this).find('#size_block').val(); // 30, 50, 220
            SI.colaps();
            SI = new smartIngredients(product, val);
            
            //$3d_bottle.attr('src', "../3d_bottle/bottle3d.html?productId=" + product + '&size=' + val);
        });
        
        $addToCart.on("click", function (e) {
            e.preventDefault();
            
            $.ajax({
                url: LabelUrlSettings.createProductUrl,
                type: "GET",
                dataType: 'json',
                data: { "productId": product, "scent_q": scent_q },
                success: function (result) {
                    alert(result.msg);
                },
                error: function (err) {
                    alert("Product can't be cerated. Error:"+err);
                }
            });

            $('#close_editor').click();
            
        });

        $matchBtn.on("click", function (e) {
        
            e.preventDefault();
            thisObject.getMatched();
            thisObject.hideRemovables();
            
        });

        $CLabelBtn.on("click", function (e) {
            e.preventDefault();
            thisObject.openLabelEditor();
            //thisObject.disableButton($(this));
            refreshLabelEditorTemplate(product);
        });

        var $exit = $('#exit, .title-save');
        $exit.on("click", function(e){
            thisObject.closeLableEditor();
            //thisObject.enableButton($CLabelBtn);
            e.preventDefault();
        });

        $priceTbl.on("click", "i", function(){
            thisObject.remove($(this).parents('.price-line').data('id'));
        });

        $priceTbl.find('ul').on("mouseenter", "li", function(){
            var id = $(this).data('id');
            var $target = $canvas.find('#ingredient_'+id);
            $target.addClass('hover');
            setTimeout(function(){$target.removeClass('hover');}, 350);
        });

        $canvas.on("mouseenter", ".drop-down-item.active", function(){
            var id = $(this).data('list-id');
            var $target = $canvas.find('#ingredient_'+id);
            $target.addClass('hover');
            setTimeout(function(){$target.removeClass('hover');}, 350);
        });

        $prodTabsLine.on("click", ".drop-down-item", function(){
            if(!$(this).hasClass('active'))
                thisObject.addIng($(this));
        });

        $productDescList.perfectScrollbar({maxScrollbarLength: 120});

        $3d_bottle.on('load', function(){
            var mDoun = false;
            var $this = $(this);
            var $body = $this.contents().find("body");
            $body.on('mouseup tuchend', function(e){
                force.start();
                $this.css({zIndex: 0});
                mDoun = false;
            }).on('mousedown tuchstart', function(e){
                mDoun = true;
                //$this.css({zIndex: 155});
            }).on('mousemove', function(e){
                if(mDoun) $this.css({zIndex: 155});
            }).on('mousewheel DOMMouseScroll', function(e){
                force.start();
            });

            $body.on('mousedoun', function(){
                mDoun = true;
                force.start();
            });

            $canvas.on('mouseup', '.nodeKnob', function(e){
                if(mDoun)
                    $body.find('canvas').trigger(e.type);
                mDoun = false;
            });
        });

    }

    this.prefix = function(){
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                    .call(styles)
                    .join('')
                    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];
        return '-' + pre + '-';
    }

}

/*TODO selected=1 must be included in product, and when matched */
/*TODO Will have 30 ml, 50 ml and 220 ml bottle sizes.   You can just call the same link again */
/*TODO have tabs instead of buttons, one tab shows product editor, other Label editor.  Do as you think it is better */
/*TODO "label editor" button  -  just replace your editor content with label editor content */
/*TODO on top of the bottle add product name somewhere and add description of product somewhere  from json */
/*TODO colors for each type of ingredient, and scent tab */

/*TODO make empty page, with banner on top and some link(button) on middle when click on link, you show your product editor */