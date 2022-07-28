class Book {
    constructor(title, author, pages, readStatus) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
    }
}


const myLibrary = [
    new Book('Cool Title','Someone', '33', false),
    new Book('Cool Title','Someone', '43', true),
    new Book('Cool Title','Someone', '1003', true),
    new Book('Cool Title','Someone', '33', false),
];
const addBookButton = document.getElementById('add-book');
const addBookModalButton = document.getElementById('add-book-modal');
const overlayModal = document.getElementById('overlay');
const bookDisplay = document.getElementById('books');
const closeModal = document.getElementById('close-modal');

addBookButton.addEventListener('click', showModal);
addBookModalButton.addEventListener('click', addBookToLibrary);
closeModal.addEventListener('click', hideModal);



function showModal() {
    overlayModal.classList.remove('hide');
    overlayModal.classList.add('fadein')
}

function hideModal() {
    overlayModal.classList.add('fadeout')
}

overlayModal.addEventListener('animationend', e => {
    switch (e.animationName) {
        case 'fadein':
            overlayModal.classList.remove('fadein');            
            break;
        
        case 'fadeout':
            overlayModal.classList.remove('fadeout');
            overlayModal.classList.add('hide')
            break;
    }
})

function resetForm() {
    document.getElementById('title').value = ''
    document.getElementById('author').value = ''
    document.getElementById('pages').value = ''
    document.getElementById('read-modal').checked = false;
}

function render(books, display) {
    display.innerHTML = '';

    if (myLibrary.length === 0) {
        display.innerHTML = '<h1>No books</h1>'
        return;
    }

    books.forEach((book, index) => {


        const card = document.createElement('div');
        card.classList.add('card');

        card.dataset.index = index;

        const title = document.createElement('h4');
        title.innerText = book.title;
        card.append(title);

        const author = document.createElement('p');
        author.innerText = `Author: ${book.author}`;
        card.append(author);

        const pages = document.createElement('p');
        pages.innerText = `Pages: ${book.pages}`;
        card.append(pages);

        const readDiv = document.createElement('div');
        readDiv.classList.add('read');

        const readLabel = document.createElement('label');
        readLabel.innerText = `Read`;
        readLabel.setAttribute('for', 'read');
        readDiv.append(readLabel);

        const checkbox = document.createElement('input');

        checkbox.addEventListener('change', e => {
            book.readStatus = e.target.checked;
        });

        checkbox.setAttribute('type', 'checkbox');
        checkbox.id = 'read';
        checkbox.checked = book.readStatus;
        readDiv.append(checkbox);

        card.append(readDiv);


        const deleteButtonDiv = document.createElement('div');
        deleteButtonDiv.classList.add('buttons');
        const deleteButton = document.createElement('button');

        deleteButton.addEventListener('click', e => {
            const deleteIndex = e.target.parentElement.dataset.index;
            myLibrary.splice(deleteIndex, 1);
            render(myLibrary, bookDisplay);
        })

        deleteButton.innerText = `Remove`;
        deleteButton.classList.add('btn');
        deleteButton.classList.add('red');

        deleteButtonDiv.append(deleteButton)

        const editButton = document.createElement('button');

        editButton.addEventListener('click',
        () => editMode(index, card));

        editButton.innerText = `Edit`;
        editButton.classList.add('yellow');
        editButton.classList.add('btn');

        deleteButtonDiv.append(editButton)

        card.append(deleteButtonDiv)

        display.prepend(card);
    })
}

function editMode(index, card) {
    card.innerHTML = '';


        const errorMsg = document.createElement('p');
        errorMsg.classList.add('error-msg');
        errorMsg.style.display = 'none';
        card.append(errorMsg);


        function displayError(msg) {
            function hide() {
                errorMsg.style.display = 'none';
            }
            errorMsg.style.display = 'block';

            errorMsg.innerText = msg;
            setTimeout(hide, 1500);
        }

        const title = document.createElement('input');
        title.value = myLibrary[index].title;
        card.append(title);

        const author = document.createElement('input');
        author.value = `${myLibrary[index].author}`;
        card.append(author);

        const pages = document.createElement('input');
        pages.setAttribute('type', 'number')
        pages.value = `${myLibrary[index].pages}`;
        card.append(pages);

        const readDiv = document.createElement('div');
        readDiv.classList.add('read');

        const deleteButtonDiv = document.createElement('div');
        const editButton = document.createElement('button');

        editButton.addEventListener('click',
        () => {
            if (
                title.value === '' ||
                author.value === '' ||
                pages.value === '' 
                ) {
                displayError('Fill all fields');
                return
            }

            myLibrary[index].title = title.value;
            myLibrary[index].author = author.value;
            myLibrary[index].pages = pages.value;

            render(myLibrary, bookDisplay);
        });

        editButton.innerText = `Done`;
        editButton.classList.add('yellow');
        editButton.classList.add('btn');

        deleteButtonDiv.append(editButton)

        card.append(deleteButtonDiv)

}

function addBookToLibrary(e) {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const readStatus = document.getElementById('read-modal').checked;

    const form = document.querySelector('#overlay form')
    form.noValidate = false;
    const inputs = document.querySelectorAll('#overlay input:not(input[type="checkbox"]');

    let canContinue = true;

    inputs.forEach(input => {
        if (input.value === '') canContinue = false;
    })

    if (!canContinue) return;

    const book = new Book(title, author, pages, readStatus);
    myLibrary.push(book);

    hideModal();
    form.setAttribute('novalidate', 'novalidate');
    resetForm();

    render(myLibrary, bookDisplay);
}


render(myLibrary, bookDisplay);