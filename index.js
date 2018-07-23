document.addEventListener("DOMContentLoaded", function() {
  fetchAllBooks()
});



function fetchAllBooks() {
  fetch(`https://flatiron-bookstore-challenge.herokuapp.com/books`)
  .then((response) => response.json())
  .then((jsonData) => {
    jsonData.forEach((book) => renderList(book))
  })
}

function fetchBook(id) {
  fetch(`https://flatiron-bookstore-challenge.herokuapp.com/books/${id}`)
  .then((response) => response.json())
  .then((book) => {
    console.log(book)
    renderDetails(book)

  })
}

function patchBook(id){

  fetch(`https://flatiron-bookstore-challenge.herokuapp.com/books/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ "user_id": 19 }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(book => {
    //do something
    renderDetails(book)
    console.log(book)
  })

}



function getList() {
  return document.querySelector("#list")
}

function getShowPanel() {
  return document.querySelector("#show-panel")
}

function renderList(book) {
  let list = getList()
  let newListItem = document.createElement("li")
  newListItem.innerHTML = `<a href="#" id="${book.id}" style="text-decoration: none;"> ${book.title} </a>`
  list.appendChild(newListItem)

  newListItem.addEventListener("click", function(event) {
    event.preventDefault()
    fetchBook(event.target.id)
    console.log(event.target.id)

  })
}

function renderDetails(book) {
  let showPanel = getShowPanel()
  showPanel.innerHTML = ``
  let title = document.createElement("p")
  title.innerHTML = `Title: "${book.title}"`
  let description = document.createElement("p")
  description.innerHTML = `Description: "${book.description}"`
  let image = document.createElement("img")
  image.src = `${book.img_url}`
  let list = document.createElement("ul")
  book.users.forEach(function(user) {
    let listedUser = document.createElement("li")
    listedUser.innerText = `${user.username}`
    listedUser.id = `${user.id}`
    list.appendChild(listedUser)
  })

  let button = document.createElement("input")
  button.type = "button"
  button.value = "Checkout"
  button.addEventListener("click", function (event){
    patchBook(book.id)
  })



  showPanel.appendChild(title)
  showPanel.appendChild(description)
  showPanel.appendChild(image)
  showPanel.appendChild(list)
  showPanel.appendChild(button)

}
