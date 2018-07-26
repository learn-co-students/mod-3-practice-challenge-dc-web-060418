document.addEventListener("DOMContentLoaded", function() {
    displayAllBooks();

});


// -------queryfunctions

function fetchBooks(){
   return fetch(`https://flatiron-bookstore-challenge.herokuapp.com/books`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then(response => response.json())
}

function fetchABook(id){
    return fetch(`https://flatiron-bookstore-challenge.herokuapp.com/books/`+ id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }).then(response => response.json())
}

function fetchUsers(id){
    return fetch(`https://flatiron-bookstore-challenge.herokuapp.com/users/` + id, {
         method: "GET",
         headers: {
             "Content-Type": "application/json; charset=utf-8"
         }
     }).then(response => response.json())
 }

// -------get element functions
function getList(){
    return document.getElementById('list');
}

function getBookLiByID(id){
    return document.getElementById(id);
}

function getShowPanel(){
    return document.getElementById('show-panel')
}

function getUL(id){
    return document.getElementById(`likes-${id}`)
}

function getButton(id){
    return document.getElementById(`button-${id}`)
}
// ---------general functions
function displayAllBooks(){
    fetchBooks().then(
        books => books.forEach(book =>{
        getList().appendChild(displayBooksLi(book));
        getBookLiByID(book.id).addEventListener('click', displayBook)
        
        }))
}

function displayBooksLi(book){
   const liEl = document.createElement('li')
    liEl.id = book.id 
    liEl.innerHTML = `<p data-id="li-${book.id}">${book.title}</p>`
    return liEl
}


function displayBook(e){
    fetchABook(e.target.dataset.id.split("-")[1]).then(
        book => {
            getShowPanel().innerHTML = ''; 
            getShowPanel().appendChild(displayBookProperties(book));
            const likes = document.createElement('h3');
            likes.innerText = "These Users liked this book:";
            getShowPanel().appendChild(likes);
            displayLikes(book);
            getButton(book.id).addEventListener('click', checkOutBook)

        }
    )
    
}

function displayBookProperties(book){
    const showDiv = document.createElement('div');
    showDiv.id = book.id;
    showDiv.innerHTML =`
    <h1>${book.title}</h1><br>
    <img src="${book.img_url}"><br>
    <p>${book.description}</p><br>
    <button id="button-${book.id}">Chck me out!</button>
    `;
    return showDiv;
}

function displayLikes(book){
   const likeUL = document.createElement('ul');
   likeUL.id = "likes-" + book.id;
   getShowPanel().appendChild(likeUL);
   for(let user of book.users){
    creatLikeLi(user, book)
   }
   
}

function creatLikeLi(user, book){
    const li = document.createElement('li')
       li.id = user.id
     li.innerHTML = user.username
    getUL(book.id).appendChild(li);
}

function checkOutBook(e){
    const userId = Math.floor(Math.random() * 20);
    const data = {user_id: userId};
    fetch(`https://flatiron-bookstore-challenge.herokuapp.com/books/` +  e.target.id.split("-")[1], {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        return Promise.all([response.json(), userId])}).then((promiseArray) =>{
        const user = promiseArray[0].users.filter(users => users.id === promiseArray[1])[0];
         
        if (promiseArray[0].users.includes(user)){
            alert("You've already checked out this book")
        }else{
        
        const li = document.createElement('li')
        li.id = user.id
        li.innerHTML = user.username
        document.getElementById(`likes-${promiseArray[0].id}`).appendChild(li);
        }
    })
}