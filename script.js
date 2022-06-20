

let inputNameEle=document.querySelector(".product-name");
let inputPriceEle=document.querySelector(".product-price");
let formEle=document.querySelector('form');
let listEle=document.querySelector(".list-group");

formEle.addEventListener('submit', (evt)=>{
    evt.preventDefault();
    
    let {nameInput, priceInput}=inputValue();
    //validation
    let isErrorCheck=validInput(nameInput, priceInput);
    if(!isErrorCheck){
        //add data
        addItemToUI(nameInput, priceInput);
        resetInput();
    }
    else if(isErrorCheck){
        alert("Invalid Input")
    }
    //console.log(!isErrorCheck)
})

function resetInput(){
    inputNameEle.value="";
    inputPriceEle.value="";
}

function validInput(name, price){
    let isError=false;
    if(!name || name.length<5){
        isError=true;
        //alert("Invalid Product Name");
    }
    if(!price || Number(price)<0){
        isError=true;
        //alert("Invalid Price");
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

function addItemToUI(name, price){
    let listData=`<li class="list-group-item collection-item">
    <strong>${name}</strong>- <span class="price">$${price}</span>
    <i class="fa fa-trash float-end"></i>
    </li>`

    listEle.insertAdjacentHTML('afterbegin', listData);
}


