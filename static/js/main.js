document.body.addEventListener('click', function(event) {
    if (event.target.id === 'addBtn') {
        // Add book logic here
        event.preventDefault(); // Prevent default form submission
        
    }
});
// inputs 
const imageInput = document.getElementById("imageInput")
const titleInput = document.getElementById("titleInput")
const DescriptionInput = document.getElementById("DescriptionInput")
const priceInput = document.getElementById("priceInput")

// error 

const errorSpanBooks = document.getElementById("errorSpanBooks")

// container 
const container = document.getElementById("container")

// buttons 
const addBtn = document.getElementById("addBtn")
const resetBtn = document.getElementById("resetBtn")


// urlApi 
const urlApi = "http://127.0.0.1:1000/books"

// form 
const addBookForm = document.getElementById("addBookForm");
 
//

const reset =()=>{
    imageInput.value = ""
    titleInput.value = ""
    DescriptionInput.value = ""
    priceInput.value = ""
}
// resetBtn.addEventListener('click',()=>{
//     reset()
// })

let addBookToSection=(data)=>{
    let bookDiv = document.createElement("div")
    let img = document.createElement("img")
    let h2 = document.createElement("h2")
    let parag = document.createElement("p")
    let price = document.createElement("p")
    let btnDelete = document.createElement("button")
    let btnUpdate = document.createElement("button")


    // for the div 
    bookDiv.appendChild(img)
    img.classList.add("images")
    img.src = "/images/" + data.image;
    // for the title  
    bookDiv.appendChild(h2)
    h2.classList.add("h2")
    h2.innerText = data.title
    // for the paragraph
    bookDiv.appendChild(parag)
    parag.classList.add("parag")
    parag.innerText = data.description
    // for the price
    bookDiv.appendChild(price)
    price.classList.add("price")
    price.innerText = data.price
    // for the deleteButton
    bookDiv.appendChild(btnDelete)
    btnDelete.classList.add("deleteBtn")
    btnDelete.innerText = "Delete"
    // for the updateButton
    bookDiv.appendChild(btnUpdate)
    btnUpdate.classList.add("updateBtn")
    btnUpdate.innerText = "Update"

     // for the download button
     let downloadBtn = document.createElement("button");
     downloadBtn.classList.add("downloadBtn");
     downloadBtn.innerText = "Download PDF";
     downloadBtn.dataset.filename = data.image; // assuming data.image is the filename
     bookDiv.appendChild(downloadBtn);
 
     // event listener for download button
     downloadBtn.addEventListener('click', () => {
         downloadBook(data.image); // assuming data.image is the filename
     });

    // for the div
    container.appendChild(bookDiv)
    bookDiv.classList.add("book")
    // event Listenner 
    btnDelete.addEventListener('click',()=>{
        const xhr = new XMLHttpRequest();
        xhr.open("delete",urlApi + '/' + data.id,true)
        xhr.addEventListener('load ',()=>{
            if(xhr.status != 200 )
                return alert("error" +xhr.response)
            container.remove()            
        })  
        xhr.addEventListener('error',()=>{
          alert('Error removing Data')
        })
        xhr.send()
        location.reload();
    })
     // event Listenner 
     btnUpdate.addEventListener('click',()=>{
        
     })
}
const loadBooks=()=>{
    const xhr = new XMLHttpRequest()
    // bookDiv.innerHTML = ""
    xhr.open("get",urlApi,true)
    xhr.addEventListener('load',()=>{
        if(xhr.status != 200 )
            alert("Error"+xhr.response)
        let data = JSON.parse(xhr.response)
        data.forEach(ele =>addBookToSection(ele))
    })
    xhr.addEventListener('error',()=>{
        alert("Error")
    })
    xhr.send()
}
addBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    // Get the actual file name from the input
    let imageValue = imageInput.files[0].name;
    let titleValue = titleInput.value;
    let descriptionValue = DescriptionInput.value;
    let priceValue = priceInput.value;
    let dataToSend = {
        image: imageValue,
        title: titleValue,
        description: descriptionValue,
        price: priceValue
    };
    dataToSend = JSON.stringify(dataToSend);
    const xhr = new XMLHttpRequest();
    xhr.open("post", urlApi, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener('load', () => {
        if (xhr.status == 201) {
            let data = JSON.parse(xhr.response);
            addBookToSection(data);
        } else {
            alert(xhr.response);
        }
    });
    xhr.addEventListener('error', () => {
        alert("Error");
    });
    xhr.send(dataToSend);
    reset();
});
loadBooks();


// downloading 
// Inside your main.js file
document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('downloadBtn')) {
        const filename = event.target.dataset.filename;
        downloadBook(filename);
    }
});

const downloadBook = (filename) => {
    // Trigger the download by creating an anchor element and clicking it
    const downloadLink = document.createElement('a');
    downloadLink.href = `/download/${filename}`;
    downloadLink.download = `${filename}.pdf`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};