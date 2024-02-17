// cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// open cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};

// close cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// cart working js
if (document.readyState == 'loading') {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// making function
function ready() {
    // remove items from cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // quantity change
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    // add to cart
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i++){
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    } 
    loadCartItems();
    // buy button
    document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked);
}

// //buy button
// function buyButtonClicked(){
//     var cartContent = document.getElementsByClassName('cart-content')[0]
//     while(cartContent.hasChildNodes()){
//         cartContent.removeChild(cartContent.firstChild);
//     }
//     updatetotal();
  
// }

// // remove item from cart
// function removeCartItem(event) {
//     var buttonClicked = event.target;
//     buttonClicked.parentElement.remove();
//     updatetotal(); // Update total after removing an item
//     saveCartItems();
// }

// Remove items from cart using event delegation
var cartContent = document.querySelector('.cart-content');
cartContent.addEventListener('click', function (event) {
    if (event.target.classList.contains('cart-remove')) {
        removeCartItem(event);
    }
});

// Function to remove an item from the cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal(); // Update total after removing an item
    saveCartItems();
}

//quantity change
function quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value =1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon(); 
}

// add to cart
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    addProductToCart(title,price,productImg);
    updatetotal();
    saveCartItems();
    updateCartIcon(); 
}
function addProductToCart(title,price,productImg){
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0]
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
        if(cartItemsNames[i].innerText == title){
        alert("you have already added this item to cart");
        return;
    }
}
var cartBoxContent = `<img src="${productImg}" alt="" class="cart-img">
                      <div class="detail-box">
                      <div class="cart-product-title">${title}</div>
                      <div class="cart-price">${price}</div>
                      <input type="number" value="1" class="cart-quantity">
   
                    </div>
                    <!-- remove - cart -->
                    <i class='bx bxs-trash-alt cart-remove'></i>`;
cartShopBox.innerHTML = cartBoxContent;
cartItems.append(cartShopBox);
cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
saveCartItems();
updateCartIcon(); 
}
// update total
function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace("₹", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity; // Move the total calculation inside the loop
    }
    document.getElementsByClassName('total-price')[0].innerText = "₹" + total;
    localStorage.setItem("cartTotal", total);
}


// keep item in the cart after reload localstorage

function saveCartItems() {
    var cartBoxes = document.getElementsByClassName("cart-box");
    var cartItems = [];
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var productImg = cartBox.getElementsByClassName("cart-img")[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value, // Use .value instead of .innerText
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}


//loads in cart
function loadCartItems() {
    var cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
        cartItems = JSON.parse(cartItems);
        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);
            var cartBoxes = document.getElementsByClassName("cart-box");
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
            quantityElement.value = item.quantity; // Set the loaded quantity
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.getElementsByClassName('total-price')[0].innerText =
            "₹" + cartTotal; // Use "₹" instead of "$"
    }
    updateCartIcon(); 
}


// // quantity in cart icon
// function updateCartIcon() {
//     var cartBoxes = document.getElementsByClassName("cart-box");
//     var quantity =0;

//     for(var i=0;i<cartBoxes.length;i++){
//         var cartBox = cartBoxes[i];
//         var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
//         quantity = parseInt(quantityElement.value);
//     }
//     var cartIcon = document.querySelector("#cart-icon");
//     cartIcon.setAttribute("data-quantity",quantity);
// }

function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName("cart-box");
    var totalQuantity = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        totalQuantity += parseInt(quantityElement.value);
    }

    var cartIcon = document.querySelector("#cart-icon");
    cartIcon.setAttribute("data-quantity", totalQuantity);
}

//create cart item after successfull payment

function clearCart(){
    var cartContent = document.getElementsByClassName("cart-content"[0]);
    cartContent.innerHTML = "";
    updatetotal();
    localStorage.removeItem("cartItems");
}

