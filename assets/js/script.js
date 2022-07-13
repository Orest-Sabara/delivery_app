// ------- TABS -------
let tl = new TimelineMax();
$('.tabs-block li').on('click', function(){
    let $label = $('.label');
    let $this = $(this);
    let el_width = $this.width();
    let offset_left = $this.offset();
    let initTabNum = $this.data('menu');
    let $article= $('.article');
    let $show = $('.show');
    function step_1() {
        $article.removeClass('show')
    }
    function step_2() {
        $('.num_' + initTabNum).addClass('show')
    }

    if(!tl.isActive()){
        tl.to($article, 0.5, {y: 100, ease: Back.easeOut, onComplete: step_1})
            .fromTo($('.num_' + initTabNum), 0.75, { onStart: step_2, y: -100}, {y: 0, ease: Elastic.easeOut, immediateRender:false})
        $label.offset({
            left : offset_left.left
        }).css('width', el_width)
        $('.tabs-block li').removeClass('active');
        $this.addClass('active');
    }
})

let initSize = function() {
    let start_element = $('.tabs-block li:first-of-type');
    let $label = $('.label');
    let initWidth = start_element.css('width')
    $label.css('width', initWidth)
}
initSize()


// -------- Local Storage  and backets  ---------------------------------------
let d = document,
    itemBox = d.querySelectorAll('.item_box'),
    cartCont = d.getElementById('cart_content');

function addEvent(elem, type, handler){
    if(elem.addEventListener){
        elem.addEventListener(type, handler, false);
    } else {
        elem.attachEvent('on'+type, function(){ handler.call( elem ); });
    }
    return false;
}

function getCartData(){
    return JSON.parse(localStorage.getItem('cart'));
}

function setCartData(o){
    localStorage.setItem('cart', JSON.stringify(o));
    return false;
}

function addToCart(e){
    this.disabled = true;
    let cartData = getCartData() || {},
        parentBox = this.parentNode,
        itemId = this.getAttribute('data-id'),
        itemTitle = parentBox.querySelector('.item_title').innerHTML,
        itemPrice = parentBox.querySelector('.item_price').innerHTML;
    if(cartData.hasOwnProperty(itemId)){
        cartData[itemId][2] += 1;
    } else {
        cartData[itemId] = [itemTitle, itemPrice, 1];
    }

    if(!setCartData(cartData)){
        this.disabled = false;
        cartCont.innerHTML = 'Товар добавлений в кошик.';
        setTimeout(function(){
            cartCont.innerHTML = 'Продовжити покупки...';
        }, 1000);
    }
    return false;
}

for(let i = 0; i < itemBox.length; i++){
    addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
}

function openCart(e){

    let cartData = getCartData(),
        totalItems = '';
    console.log(JSON.stringify(cartData));

    if(cartData !== null){
        totalItems = '<table class="shopping_list"><tr><th>Назва</th><th>Ціна</th><th>К-сть</th></tr>';
        for(let items in cartData){
            totalItems += '<tr>';
            for(let i = 0; i < cartData[items].length; i++){
                totalItems += '<td>' + cartData[items][i] + '</td>';
            }
            totalItems += '</tr>';
        }
        totalItems += '<table>';
        cartCont.innerHTML = totalItems;
    } else {

        cartCont.innerHTML = 'В кошику пусто!';
    }
    return false;
}

addEvent(d.getElementById('checkout'), 'click', openCart);

addEvent(d.getElementById('clear_cart'), 'click', function(e){
    localStorage.removeItem('cart');
    cartCont.innerHTML = 'Кошик очищений.';
});


// header scroll
(function() {

    let $curve = document.getElementById("curve");
    let last_known_scroll_position = 0;
    let defaultCurveValue = 350;
    let curveRate = 3;
    let ticking = false;
    let curveValue;

    function scrollEvent(scrollPos) {
        if (scrollPos >= 0 && scrollPos < defaultCurveValue) {
            curveValue = defaultCurveValue - parseFloat(scrollPos / curveRate);
            $curve.setAttribute(
                "d",
                "M 800 300 Q 400 " + curveValue + " 0 300 L 0 0 L 800 0 L 800 300 Z"
            );
        }
    }

    // Scroll Listener
    window.addEventListener("scroll", function(e) {
        last_known_scroll_position = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                scrollEvent(last_known_scroll_position);
                ticking = false;
            });
        }

        ticking = true;
    });
})();