const supCart = document.querySelector('.cart-sup');
const cartBtn = document.querySelector('.cart__btn-cart');
const modal = document.querySelector('.pop-up');
const modalDialog = modal.querySelector('.pop-up__dialog');
const closeBtn = modal.querySelector('.close-btn');
const modalList = document.querySelector('.pop-up__list');
const productsList = document.querySelector('.products__list');
const buyPanel = document.querySelector('.pop-up__buy-panel');


const bodyData = {
	products: [],
	cart: JSON.parse(localStorage.getItem('cart-data')) || [],
	isLoading: true,
	totalPrice: 0,
	totalQuantity: 0,
	delivery: 150,
	currency: 'руб',
};

let createElemLi;
let createElments;
let newOrderProducts;
let createNewOrderPanel;
let createNewOrderElement;
let formNewOrder;

if (localStorage.getItem('cart-data')) {
	createElementToCart();
}

// Запрос
class GetService{
	constructor() {
		this._apiBase = 'https://640de4c81a18a5db83828add.mockapi.io/store/';
	}
	async getProducts() {
		const res = await fetch(this._apiBase);
		return res.json();
	}
	async postUserInfo(data) {
		const response = await fetch('https://64465af1ee791e1e29fcd08a.mockapi.io/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(data),
		});

		if (response.ok) {
			const result = await response.json();
			const success = document.querySelector('.pop-up-successfully');
			success.classList.add('_active');
			setInterval(() => {
				success.classList.remove('_active');
			}, 1500);
		}
	}
}


const getService = new GetService();


// Загрузка

if (bodyData.isLoading) {
	createElemLi = document.createElement('li');
	createElemLi.innerHTML = isLoader();
}

try {
	productsList.append(createElemLi);
} catch (error) {
	console.error(error.message);
}

function isLoader() {
	return (
		`
		<div class="isLoading-loader">
			<div class="loadingio-spinner-spinner-72ivgrzvb22"><div class="ldio-p4oozjogofc">
				<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
			</div></div>
			</div>
		`
	);
}


getService.getProducts()
	.then(data => {
		bodyData.products = data;
		bodyData.isLoading = false;
		createElments(bodyData.products);
	})
	.catch(err => console.error(err.message));

try {
	createElments = (data) => {
		productsList.innerHTML = '';
		data.forEach(elem => {
			const elementLi = document.createElement('li');
			elementLi.classList.add('products__item');
			const {id, img, price, title} = elem;
				elementLi.innerHTML = `
				<div class="products__bg-img">
					<img src="${img}" alt="${title}">
				</div>
				<div class="products__info">
				<div class="products__title">${title}</div>
					<div class="products__content">
						<strong class="products__price">${price} ${bodyData.currency}</strong>
						<button onclick="addToCart(${id})" class="products__btn btn-add">В корзину</button>
					</div>
				</div>
				`;
				productsList.append(elementLi);
		});
	};
} catch (error) {
	console.error(error.message);
}

try {
} catch (error) {
	console.error(error.message);
}



// modal
cartBtn.addEventListener('click', opneMoadl);
closeBtn.addEventListener('click', closeMoadl);

function opneMoadl() {
	modal.classList.add('_active');
	modalDialog.classList.add('_active');
	document.body.classList.add('_lock');
}
function closeMoadl() {
	modal.classList.remove('_active');
	modalDialog.classList.remove('_active');
	document.body.classList.remove('_lock');
}

// cart

function addToCart(id) {
	const index = bodyData.products.findIndex(elem => elem.id === Number(id));
	const indexCart = bodyData.cart.findIndex(elem => elem.id === Number(id));
	if (indexCart >= 0) {
		const oldItem = bodyData.cart[indexCart];
		const newItem = {...oldItem, quantity: oldItem.quantity + 1};
		const newArr = [...bodyData.cart.slice(0, indexCart), newItem, ...bodyData.cart.slice(indexCart + 1)];
		bodyData.cart = (newArr);
	} else {
		const oldItem = bodyData.products[index];
		const newItem = {...oldItem, quantity: 1};
		bodyData.cart.push(newItem);
	}
	createElementToCart();
	// createBuyPanelIndo();
	localStorage.setItem('cart-data', JSON.stringify(bodyData.cart));
	try {
		newOrderProducts();
	} catch (error) {
		console.error(error.message);
	}
};

function removeProdcutToCart(id) {
	const index = bodyData.cart.findIndex(elem => elem.id === id);
	const newArr = [...bodyData.cart.slice(0, index), ...bodyData.cart.slice(index + 1)];
	bodyData.cart = newArr;
	localStorage.setItem('cart-data', JSON.stringify(bodyData.cart));
	createElementToCart();
	// createBuyPanelIndo();
	try {
		newOrderProducts();
	} catch (error) {
		console.error(error.message);
	}
}

// создание элементов в корзине
function createElementToCart() {
	modalList.innerHTML = '';

	bodyData.cart.map(elem => {
		const {id, img, price, title, quantity, qmax} = elem;

		const elementLi = document.createElement('li');
		elementLi.classList.add('pop-up__item','item-pop-up');

		const totalPrice = (quantity * price).toFixed(2);
		elementLi.innerHTML = `
			<div class="item-pop-up__left">
				<img width="100px" height="100px" src="${img}" alt="${title}">

				<div class="item-pop-up__info">
					<h2>${title}</h2>
					
					<div class="item-pop-up__active">
						<span class="minus" ${quantity <= 1 ? 'class="_disable"' : `onclick="updateQuantity('minus', ${id})"`}></span>
						<strong>${quantity}</strong>
						<span class="plus" ${quantity === qmax ? 'class="_disable"' : `onclick="updateQuantity('plus', ${id})"`}></span>
					</div>

					<div>
						Цена : <strong>${price} ${bodyData.currency}</strong>
					</div>
				</div>
			</div>


			<div class="item-pop-up__end">
				<span onclick="removeProdcutToCart(${id})">
					<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g id="Trash">
							<path id="Vector" d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</g>
					</svg>
				</span>
				<p>Итого: <strong>${totalPrice} ${bodyData.currency}</strong></p>
			</div>
		`;
		modalList.append(elementLi);
	});

	supCart.textContent = bodyData.cart.length;

	if (bodyData.cart.length) {
		createBuyPanelIndo();
	} else {
		cartClear();
		buyPanel.innerHTML = '';
	}
}

function cartClear() {
	const elementLi = document.createElement('li');
	elementLi.innerHTML = 'Пустая корзина';
	elementLi.classList.add('pop-up__item-clear');
	modalList.append(elementLi);
}

function updateQuantity(str, id) {
	const index = bodyData.cart.findIndex(elem => elem.id === id);
	const oldItem = bodyData.cart[index];
	let newItem;
	if (str === 'plus') {
		newItem = {...oldItem, quantity: oldItem.quantity + 1};
	} else if (str === 'minus') {
		newItem = {...oldItem, quantity: oldItem.quantity - 1};
	}
	const newArr = [...bodyData.cart.slice(0, index), newItem, ...bodyData.cart.slice(index + 1)];
	bodyData.cart = newArr;
	localStorage.setItem('cart-data', JSON.stringify(bodyData.cart));
	createElementToCart();
	// createBuyPanelIndo();
	newOrderProducts();
}

function createBuyPanelIndo() {
	const totalPrice = bodyData.cart.reduce(( acc, elem ) => acc + (elem.price * elem.quantity), 0).toFixed(2);
	const totalQuantity = bodyData.cart.reduce(( acc, elem ) => acc + elem.quantity, 0);
	buyPanel.innerHTML = `
		<div class="pop-up__buy-panel__content">
			<p><strong>${totalQuantity}</strong> товаров, к оплате: <strong>${totalPrice} ${bodyData.currency}</strong></p>
			<a href="/new_order.html" class="btn-orange">Оформить заказ</a>
		<div>
	`;
}



try {
	newOrderProducts = () => {
		createNewOrderElement();
		createNewOrderPanel();
	}
} catch (error) {
	
}




try {
	createNewOrderPanel = () => {
		const {cart, delivery} = bodyData;
	
		const newOederPAnelSelector = document.querySelector('.products-new-order__panel');
	
		const price = cart.reduce((acc, elem) => acc + (elem.price * elem.quantity),0);
		const totalPrice = price + delivery;
	
		newOederPAnelSelector.innerHTML = `
			<div class="products-new-order__info _border">
				<div class="_space">
					<p>Сумма по товаром</p> <strong>${price} ${bodyData.currency}</strong>
				</div>
				<div class="_space">
					<p>Стоимость доставки</p> <strong>${delivery} ${bodyData.currency}</strong>
				</div>
			</div>
			<div class="products-new-order__total-price _space _border">
				<p>Итого:</p> <strong>${totalPrice} ${bodyData.currency}</strong>
			</div>
		`;
	};
} catch (error) {
	console.error(error.message);
}

try {
	createNewOrderElement = () => {
		const {cart} = bodyData;
	
		const listNewOrder = document.querySelector('.products-new-order__list');
		listNewOrder.innerHTML = '';
	
		
		cart.map(elem => {
			const {id, quantity, price, img, title} = elem;
			const elementLi = document.createElement('li');
			elementLi.classList.add('products-new-order__item', '_space');
			elementLi.innerHTML = `
				<div class="_flex-img">
					<img width="60px" height="60px" src="${img}" alt="${title}">
					<h3>${title}</h3>
				</div>
				<p>${quantity} x <strong>${price} ${bodyData.currency}</strong></p>
			`;
			listNewOrder.append(elementLi);
		});
	}
} catch (error) {
	console.error(error.message);
}

try {
	newOrderProducts();
} catch (error) {
	console.error(error.message);
}

try {
	formNewOrder = document.querySelector('.form-new-order__form');
	formNewOrder.addEventListener('submit', onSubmitFormNewOrder);
} catch (error) {
	console.error(error.message);
}

function onSubmitFormNewOrder(e) {
	e.preventDefault();

	const email = document.querySelector('#email');
	const number = document.querySelector('#number');
	const address = document.querySelector('#address');
	const comment = document.querySelector('#comment');
	const info = document.querySelector('#info');

	const data = {
		email: email.value,
		number: number.value,
		address: address.value,
		comment: comment.value,
		info: info.value,
		cart: bodyData.cart,
	};

	getService.postUserInfo(data);

	email.value = '';
	number.value = '';
	address.value = '';
	comment.value = '';
	info.value = '';
}