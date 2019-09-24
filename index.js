document.addEventListener("DOMContentLoaded", () => {

  const burgerMenu = document.querySelector("body > div > div.menu")
  const orderListUl = document.querySelector("#order-list")
  const customBurgerForm = document.querySelector("#custom-burger")
  const BURGERS_URL = "http://localhost:3000/burgers/"
  let burgersData = []

  //the burgers are appended to the burger-menu
  getBurgers().then(appendBurgers)

  function appendBurgers(burgers){
    burgersData = burgers 
    burgers.forEach(renderOneBurger)
  }

  function renderOneBurger(burger){
    const burgerInfo = `
    <div class="burger">
      <h3 class="burger_title">${burger.name}</h3>
      <img src="${burger.image}">
      <p class="burger_description">
          ${burger.description}
      </p>
      <button data-id=${burger.id} class="button">Add to Order</button>
      <button data-id=${burger.id} class="button">Delete</button>
    </div>
    `
    burgerMenu.insertAdjacentHTML('beforeend', burgerInfo)
    burgerMenu.addEventListener('click', clickAddOrDelete)
  }
  
  
  //customers can press on the Add to Order button, which will then append the name of the burger into the 'Your Order' list on the left of the page.
  function clickAddOrDelete(e){
    if (e.target.innerText === "Add to Order"){
      const burgerId = parseInt(e.target.dataset.id)
      const burgerMatch = burgersData.find(burger => burgerId === burger.id)
      const newOrderInfo = `<li>${burgerMatch.name}</li>`
      
      orderListUl.insertAdjacentHTML('beforeend', newOrderInfo)
    } else if(e.target.innerText === "Delete"){
      //frontend remove
      e.target.closest('div').remove()
      //database remove
      removeBurger(e.target.dataset.id)
    }
  }

  //After that, build out the functionality that will allow customers to add their own burger creations to the menu 
  //After submitting the form, the burger should be appended to the menu with the correct information typed in the form.
  //  //It should also be added to customer's order as well as persist in the database, so that when we refresh the page, the burger is added to the menu for future customers.
  customBurgerForm.addEventListener('submit', submitNewBurger)

  function submitNewBurger(e){
    e.preventDefault()
    const nameInput = e.target.name.value
    const descInput = e.target.description.value
    const imageInput = e.target.url.value
 
    postBurger(nameInput, descInput, imageInput).then(renderOneBurger)

    orderListUl.insertAdjacentHTML('beforeend', `<li>${nameInput}</li>` )
  }
  


  //FETCHES ----------------------------------------
  function getBurgers(){
    return fetch(BURGERS_URL)
      .then(resp => resp.json())
  }

  function postBurger(nameInput, descInput, imageInput){
    const options = {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": nameInput,
        "description": descInput,
        "image": imageInput
      })
    }

    return fetch(BURGERS_URL, options)
      .then(resp => resp.json())
  }

  function removeBurger(burgerId){
    return fetch(BURGERS_URL + `${burgerId}`, {
      method: "DELETE"
    })
  }



}) //event listener for DOMContentLoaded 
