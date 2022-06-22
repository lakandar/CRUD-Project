
(function(){
    
let inputNameEle=document.querySelector(".product-name");
let inputPriceEle=document.querySelector(".product-price");
let formEle=document.querySelector('form');
let listEle=document.querySelector(".list-group");
let filterEle=document.querySelector("#filter");

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
            showFilterItem(product);
        }
    })
}

init();

})();
