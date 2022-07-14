let productList = new Array();
let cartList;
const indexValidation = new IndexValidation();

function saveCart() {
  localStorage.setItem("cartList", JSON.stringify(cartList));
}

function loadCart() {
  const data = localStorage.getItem("cartList");

  if (data) {
    cartList = JSON.parse(data);
  } else {
    cartList = new Array();
  }
}

function renderProductList(data = productList) {
  let tag = ``;
  for (let item of data) {
    tag += `
        <div class="column">
            <div class="item">
                <div class="productImage">
                    <img src="${item.img}" alt="error">
                </div>
                <div class="productInfo">
                    <h1>${item.name}</h1>
                    <h2>$${item.price}</h2>
                </div>
                <div class="itemFooter">
                    <button onclick="addProductToCart('${item.id}')">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            </div>
        </div>`;
  }

  document.getElementById("row").innerHTML = tag;
}

function renderCartList(data = cartList) {
  let tag = ``;
  let total = 0;

  for (let item of data) {
    tag += `<div class="column">
        <div class="item">
            <img src="${item.product.img}" alt="error">
            <h1>${item.product.name}</h1>
            <h2>$${item.product.price}</h2>
            <div class="changeQuantity">
                <button onclick="decreaseQuantity('${item.product.id}')">
                    <i class="fa-solid fa-angle-left"></i>
                </button>
                <input id="txtQuantity" data-id="${item.product.id}" type="text" value="${item.quantity}" 
                onchange="changeQuantity(event)" onkeypress="validateNumber(event)">
                <button onclick="increaseQuantity('${item.product.id}')">
                    <i class="fa-solid fa-angle-right"></i>
                </button>
            </div>
            <button class="btnDel" onclick="removeCartItem('${item.product.id}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>`;

    total += +item.product.price * +item.quantity;
  }

  document.getElementById("cartRow").innerHTML = tag;
  document.getElementById("total").innerHTML = "Total: $" + total;
}

function findProductByID(data, id) {
  let leftIndex = 0;
  let rightIndex = data.length - 1;
  let midIndex = Math.floor((leftIndex + rightIndex) / 2);

  while (rightIndex >= leftIndex) {
    if (data[midIndex].id === id) {
      return data[midIndex];
    } else if (data[midIndex].id > id) {
      rightIndex = midIndex - 1;
      midIndex = Math.floor((leftIndex + rightIndex) / 2);
    } else {
      leftIndex = midIndex + 1;
      midIndex = Math.floor((leftIndex + rightIndex) / 2);
    }
  }

  return null;
}

function findCartItem(data, id) {
  for (let item of data) {
    if (item.product.id === id) {
      return item;
    }
  }

  return null;
}

function getProductList() {
  axios({
    url: "https://62c57c08134fa108c253a9cb.mockapi.io/api/product",
    method: "GET",
  }).then((response) => {
    productList = response.data;
    renderProductList();
  });
}

//Product Region Start
window.onload = function () {
  getProductList();

  loadCart();
};

function filterProductList() {
  const option = document.getElementById("phoneType").value;
  let filteredList = new Array();

  if (option === "Samsung") {
    for (let item of productList) {
      if (item.type.toLowerCase() === "samsung") {
        filteredList.push(item);
      }
    }
  } else if (option === "Iphone") {
    for (let item of productList) {
      if (item.type.toLowerCase() === "iphone") {
        filteredList.push(item);
      }
    }
  } else {
    filteredList = productList;
  }

  renderProductList(filteredList);
}
//Product Region End

//Cart Region Start
function addProductToCart(id) {
  let product = findProductByID(productList, id);
  let cartItem = findCartItem(cartList, id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cartItem = new CartItem(product, 1);
    cartList.push(cartItem);
  }

  if (document.getElementById("cart").classList.contains("show")) {
    renderCartList();
  }

  saveCart();
}

function showCart() {
  renderCartList();

  document.getElementById("cart").classList.toggle("show");
}

function decreaseQuantity(id) {
  let cartItem = findCartItem(cartList, id);

  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
  }

  renderCartList();

  saveCart();
}

function increaseQuantity(id) {
  let cartItem = findCartItem(cartList, id);

  cartItem.quantity += 1;

  renderCartList();

  saveCart();
}

function validateNumber(e) {
  indexValidation.validateNumber(e);
}

function changeQuantity(e) {
  let productID = e.target.getAttribute("data-id");
  let cartItem = findCartItem(cartList, productID);
  if (document.getElementById("txtQuantity").value) {
    cartItem.quantity = +document.getElementById("txtQuantity").value;
  } else {
    cartItem.quantity = 1;
  }

  renderCartList();

  saveCart();
}

function removeCartItem(id) {
  for (let i = 0; i < cartList.length; i++) {
    if (cartList[i].product.id === id) {
      cartList.splice(i, 1);
    }
  }

  renderCartList();

  saveCart();
}

function checkOutCart() {
  cartList.length = 0;

  renderCartList();

  saveCart();
}

//Cart Region End
