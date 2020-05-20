var xhr = new XMLHttpRequest();
let books;
let isEn = false;

function changeLanguage(el){
        if(el === undefined) isEn = false;
        else isEn = el.innerHTML === "Eng";
        xhr.open('GET', (isEn) ? 'en' : 'ukr', false);
        xhr.send();

        if (xhr.status != 200) {
            alert( xhr.status + ': ' + xhr.statusText );
        } else {
            let data = JSON.parse(xhr.response);
            console.log(data);
            let l = document.getElementsByClassName("lang");
            for( var i =0; i<l.length; i++) {
                let t = l[i].getAttribute("tr");
                l[i].innerHTML = data[t];
            }

        }
        if(el !== undefined) addBooks();
}

 function getBooks(){
        xhr.open('GET', 'getBooks', false);
        xhr.send();

        if (xhr.status != 200) {
            alert( xhr.status + ': ' + xhr.statusText );
        } else {
            books = JSON.parse(xhr.response);
            addBooks();
        }
}

function addBooks(){
    let e = document.getElementById("allBooks");
    e.innerHTML = " ";
    for(var i =0; i<books.length; i++){
        let l = document.createElement("div");
        l.id = books[i]._id;
        e.appendChild(l);

        (isEn)
        ? showBook(books[i].autorEn, books[i].headerEn,
            books[i].detailsEn, books[i]._id, isEn)
        : showBook(books[i].author, books[i].header,
            books[i].details, books[i]._id, isEn)
    }
}


function getImg(){
    xhr.open('GET', 'img', false);
    xhr.send();

    if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText );
    } else {
        let i = document.getElementById("image");
        console.log(xhr.response);
        i.src = "data:image/jpg;base64," + xhr.responseText;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    getImg();
   changeLanguage(undefined);
}, false);


