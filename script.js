
(function(){
    
let inputNameEle=document.querySelector(".product-name");
let inputPriceEle=document.querySelector(".product-price");
let formEle=document.querySelector('form');
let listEle=document.querySelector(".list-group");
let filterEle=document.querySelector("#filter");
let submitBtnEle=document.querySelector((".add-product"));

//tracking items
let product=[
    // {
    //     id: 1,
    //     name: "egg",
    //     price: 10
    // },
]

function showFilterItem(filterItem){
    listEle.innerHTML="";

    filterItem.forEach(element => {
    let listData=`<li class="list-group-item collection-item item-${element.id}">
    <strong>${element.name}</strong>- <span class="price">$${element.price}</span>
    <i class="fa fa-trash float-end delete-item"></i>
    <i class="fa fa-pencil-alt float-end edit-item pe-4"></i>
    </li>`

    listEle.insertAdjacentHTML('afterbegin', listData);
    });
}

function updateAfterRemove(FilterProduct, id){
    return FilterProduct.filter(pro=>pro.id!==id);
}

function removeItemFromDataStore(id){
    let productAfterDel=updateAfterRemove(product, id)
    product=productAfterDel;
}

function removeItemFromLocalStorage(id){
    let FilterProduct=JSON.parse(localStorage.getItem("productData"))
    let updateRemove=updateAfterRemove(FilterProduct, id);
    //console.log(updateRemove);
    localStorage.setItem("productData", JSON.stringify(updateRemove));
}

function removeItemFromUI(id){
    document.querySelector(`.item-${id}`).remove();
}

function getItemID(ele){
   return Number(ele.parentElement.classList[2].split("-")[1]);
}

function resetInput(){
    inputNameEle.value="";
    inputPriceEle.value="";
}

function validInput(name, price){
    let isError=false;
    if(!name || name.length<3){
        isError=true;
        alert("Invalid Product Name");
    }
    if(!price || Number(price)<0){
        isError=true;
        alert("Invalid Price");
    }
    return isError;
}

function inputValue(){
    let nameInput=inputNameEle.value;
    let priceInput=inputPriceEle.value;
    return{
        nameInput,
        priceInput
    }
}

function addItemToUI(id, name, price){
    let listData=`<li class="list-group-item collection-item item-${id}">
    <strong>${name}</strong>- <span class="price">$${price}</span>
    <i class="fa fa-trash float-end delete-item"></i>
    <i class="fa fa-pencil-alt float-end edit-item pe-4"></i>
    </li>`

    listEle.insertAdjacentHTML('afterbegin', listData);
}

function addItemToLocalStorage(pro){
    if(localStorage.getItem("productData")){
        let productArr=JSON.parse(localStorage.getItem("productData"))
        productArr.push(pro);
        //update to LocalStorage
        localStorage.setItem("productData", JSON.stringify(productArr));
    }
    else{
        let LocalProduct=[];
        LocalProduct.push(pro);
        //update to LocalStorage
        localStorage.setItem("productData", JSON.stringify(LocalProduct));
    }
}

function populateUIInEditState(foundProductArr){
    //console.log(foundProductArr);
    inputNameEle.value=foundProductArr.name;
    inputPriceEle.value=foundProductArr.price;
}

function showUpdateBtn(){
    let updateBtn=`<div class="d-flex justify-content-center">
    <button type="button" class="btn mt-3 btn-block btn-warning update-product">Update</button>
    <div>`
    submitBtnEle.style.display='none';
    formEle.insertAdjacentHTML('beforeend', updateBtn);
}

function updateProductToLocalStorage(){
    if(localStorage.getItem("productData")){
        localStorage.setItem("productData", JSON.stringify(product));
    }
}

function init(){

    formEle.addEventListener('submit', (evt)=>{
        evt.preventDefault();
        
        let {nameInput, priceInput}=inputValue();
        //validation
        let isErrorCheck=validInput(nameInput, priceInput);
        if(!isErrorCheck){
            //generate id
            let itemID=product.length+1;

            let products={
                id: itemID,
                name: nameInput,
                price: priceInput
            }

            //add item to data-store(obj)
            product.push(products)
            //add item to UI
            addItemToUI(itemID, nameInput, priceInput);
            //add item to LocalStorage
            addItemToLocalStorage(products);

            resetInput();
            //console.log(product);
        }
        // else if(isErrorCheck){
        //     alert("Invalid Input")
        // }
        //console.log(!isErrorCheck)
    })
    
    //delete item (event delegation)
    let updateItemId;
    listEle.addEventListener("click", e=>{
        if(e.target.classList.contains('delete-item')){
            let getID = getItemID(e.target);
            
            //remove item from UI
            removeItemFromUI(getID);
            //remove item from data store
            removeItemFromDataStore(getID);
            //remove item from LocalStorage
            removeItemFromLocalStorage(getID);
        }
        //edit and update item
        else if(e.target.classList.contains("edit-item")){
            //pick the item id
            updateItemId=getItemID(e.target)
            //find the item
            let foundProduct=product.find(pro=>pro.id===updateItemId);
            //populate the item data to UI
            populateUIInEditState(foundProduct);
            //show update button
            if(!document.querySelector(".update-product")){
                showUpdateBtn();
            }            
        }
    })
    
    filterEle.addEventListener('keyup', e=>{
        let filterValue = e.target.value;
        let filterArr= product.filter(pro=>
            pro.name.includes(filterValue));

        //show item to UI
        showFilterItem(filterArr);
        
    })

    //LocalStorage Event
    document.addEventListener("DOMContentLoaded", e=>{
        if(localStorage.getItem("productData")){
            product=JSON.parse(localStorage.getItem("productData"));
            //console.log(product)
            //show item to UI
            showFilterItem(product);
        }
    })

    //update item (Event Delegation)
    formEle.addEventListener("click", (e)=>{
        if(e.target.classList.contains("update-product")){
        //pick the data from the field
        const {nameInput, priceInput} = inputValue();
        //validate input
        validInput(nameInput, priceInput);
        // if(!isError){
        //     alert("Please provide valid input");
        //     return;
        // }
        //updating the data (from user)
        //updated data should be updated to Data Store
        
        product = product.map(pro=>{
            if(pro.id===updateItemId){
                //item should be updated
                return{
                    id: pro.id,
                    name: nameInput,
                    price: priceInput
                }
            }
            else{
                return pro;
            }
        })
        //reset input
        resetInput();
        //show submit button
        submitBtnEle.style.display='block';
        //hide update button
        document.querySelector(".update-product").remove();
        //updated data should be updated to UI
        showFilterItem(product);
        //updated data should be updated to Local Store
        updateProductToLocalStorage();
        }
    })
}

init();

})();
