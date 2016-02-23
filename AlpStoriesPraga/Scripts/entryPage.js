$(document).ready(function(){
    var $panel = $("#panel_content");
    var $productsSection = $('#products_section');
    var $productRow = $('.product-row');
    var $products = $('.container').find('.product');
    var sz = classes.length - 1, rndAnim;
    var editPos = $panel.offset();
    var productId;

    $products.each(function(){
        var $this = $(this);
        var pos = $this.offset();
        $this.data('pos', {x:pos.left, y:pos.top});
    });

    $products.on('click', function(){
        rndAnim = classes[getRand(0,sz)];
        var $_this = $(this);
        $products.not($(this)).each(function(i){
            var $this = $(this);
            setTimeout(function(){
                $this.addClass(rndAnim);
            }, 100*i, $this);
        });

        setTimeout(function(){
            var $top = $_this.data('pos').y;
            var $left = $_this.data('pos').x;
            var l = editPos.left - $left + 150;
            var t = editPos.top - $top + 130;
            
            $_this.animate({ left: l, top: t, opacity: 0.3 }, 400);
            $("html, body").animate({ scrollTop: 0 }, 800);

            setTimeout(function(){
                //$_this.addClass('VisHidden');
                openPanel($_this.data('product'), $panel);
                $productsSection.children().addClass('VisHidden');
                $productRow.first().addClass('dispNone');

            }, 500, $_this);
            //$products.not($_this).addClass('VisHidden');
        }, 100*($products.size()+1), $_this);

        $('#close_editor').on('click', function(){
            closePanel($panel);
            var $left = $_this.data('pos').x;
            $_this.animate({left: $left+400}, function(){
                //$_this.removeClass('VisHidden');
                $products.each(function (i) {
                    var $this = $(this);
                    $productsSection.children().removeClass('dispNone VisHidden');
                    $products.removeAttr('style');
                    //$products.removeAttr('style').removeClass('VisHidden');
                    setTimeout(function(){
                        $this.removeClass(rndAnim);
                    }, 100*i, $this);
                });
            });
        });

    });

});

var classes = ['opacity','zoomIn','run','run2','hideX'];
var refreshLabelEditorTemplate;
function getRand(min, max){
    return Math.round((Math.random() * (max - min)) + min);
}

function openPanel(product, $panel) {
    //$3d_bottle.attr('src', "../3d_bottle/bottle3d.html?productId="+product)
    SI = new smartIngredients(product,0);
    $panel.css({zIndex: 100}).addClass('show');
}
function closePanel($panel) {
    SI.colaps();
    $panel.css({zIndex: 0}).removeClass('show');
}