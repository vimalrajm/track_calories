//item controller which holds data in object
const itemCtrlr = (function(){

  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const data ={
    items : [],
    currentItem : null,
    totalCalories : parseInt(0)
  }

  const getTotalCalories = function() {
    let a = 0;
    if(data.items.length>0) {
      data.items.forEach(function(item) {
        a +=  parseInt(item.calories);
      });
    }
    data.totalCalories = a;
    localStorage.setItem('totalCalories',data.totalCalories);
    return data.totalCalories;
  }

  const getItemByIdFunc = function(id) {
    data.items.forEach(function(item) {
      if(item.id === parseInt(id)) {
        data.currentItem = item;
      }
    })
    return  data.currentItem;
  }

  const updateMainData = function(item) {
    let itemsLs = JSON.parse(localStorage.getItem('items'));
    itemsLs.forEach(function(item2) {
      if(item2.id === item.id) {
        item2.name = item.name;
        item2.calories = item.calories;
      }
    });
    localStorage.setItem('items',JSON.stringify(itemsLs));
    data.items.forEach(function(item1) {
      if(item1.id === item.id) {
        item1.name = item.name;
        item1.calories = item.calories;
      }
    });
  }

  const deleteItemFromData = function(item) {
    let index = 0, i=0;
    data.items.forEach(function(item1) {
      if(item1.id === item.id) {
        index = i; 
        data.totalCalories -= item.calories;
      }
      i++;
    });
    let itemsLs = JSON.parse(localStorage.getItem('items'));
    itemsLs.splice(index,1);
    localStorage.setItem('items',JSON.stringify(itemsLs));
    data.items.splice(index,1);
  }

  const clearData = function() {
    data.items = [];
    localStorage.removeItem('items');
    localStorage.removeItem('totalCalories');
  }

  return {
    displayData: function() {
      let itemsList = [], tcal = 0;
      itemsList = JSON.parse(localStorage.getItem('items'));
      if(itemsList !== null) {
        itemsList.forEach(function(item) {
          data.items.push(item);
        })
      }
      tcal = parseInt(localStorage.getItem('totalCalories'));
      if(tcal !== null) {
        data.totalCalories = tcal;
      } else {
        localStorage.setItem('totalCalories',data.totalCalories);
      }
      return data;
    },
    createItem: function(id, name, calories) {
      data.totalCalories += calories;
      return new Item(id, name, calories);
    },
    pushItem: function(item) {
      let itemsList = [];let tcal = 0;
      if(JSON.parse(localStorage.getItem('items')) === null) {
        itemsList.push(item);
        localStorage.setItem('items',JSON.stringify(itemsList));
      } else {
        itemsList = JSON.parse(localStorage.getItem('items'));
        itemsList.push(item);
        localStorage.setItem('items',JSON.stringify(itemsList));
      }
      data.items.push(item);
    },
    totalCaloriesRes: function() {
      return getTotalCalories();
    },
    getItemById: function(id) {
      return getItemByIdFunc(id);
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    updateData: function(item) {
      return updateMainData(item);
    },
    deleteItem: function(item) {
      return deleteItemFromData(item);
    },
    clearMeals: function() {
      return clearData();
    }
  }
})();

//ui controller controls the ui
const uiCtrlr = (function(){

  const uiSelectors = {
    uiItemsList : '#uiItemsList',
    uiMealName: '#mealName',
    uiCalories: '#calories',
    addBtn: '#add',
    updateBtn: '#update',
    deleteBtn: '#delete',
    backBtn: '#back',
    totalCalories: '#totalCalories',
    clearAll: '#clearAll'
  }

  const displayItems = function(items) {
    document.querySelector(uiSelectors.updateBtn).style.display = 'none';
    document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
    document.querySelector(uiSelectors.backBtn).style.display = 'none';
    let output = '';
    items.forEach(function(item) {
      output += `
      <div class="columns is-centered">        
        <div class="column has-background-light is-7-desktop">
          <div class="field">
            <strong>${item.name}: </strong><em>${item.calories} calories</em>
          </div>
        </div>
        <div class="column has-background-light is-1-desktop">
          <div class="field has-icons item-${item.id}">
            <span class="icon is-small is-pulled-left">
              <a href="#"><i class="fa fa-pencil has-text-primary"></i></a>
            </span>
            <span class="icon is-small is-pulled-right">
              <a href="#"><i class="fa fa-trash has-text-danger"></i></a>
            </span>
          </div>
        </div>
        
      </div>
      <hr class="has-background-white"></hr>
      `
    });
    document.querySelector(uiSelectors.uiItemsList).innerHTML = output;
  }

  const addItemToUI = function(item) {
    const div = document.createElement('div');
    div.innerHTML = `<div class="columns is-centered">        
    <div class="column has-background-light is-7-desktop">
      <div class="field">
        <strong>${item.name}: </strong><em>${item.calories} calories</em>
      </div>
    </div>
    <div class="column has-background-light is-1-desktop">
      <div class="field has-icons item-${item.id}">
        <span class="icon is-small is-pulled-left">
          <a href="#"><i class="fa fa-pencil has-text-primary"></i></a>
        </span>
        <span class="icon is-small is-pulled-right">
          <a href="#"><i class="fa fa-trash has-text-danger"></i></a>
        </span>
      </div>
    </div>
    
  </div>
  <hr class="has-background-white"></hr>`;
    document.querySelector(uiSelectors.uiItemsList).insertAdjacentElement('beforeend',div);
  }

  const clearUIFields = function() {
    document.querySelector(uiSelectors.uiMealName).value = '';
    document.querySelector(uiSelectors.uiCalories).value = '';
    document.querySelector(uiSelectors.addBtn).style.display = 'inline';
    document.querySelector(uiSelectors.updateBtn).style.display = 'none';
    document.querySelector(uiSelectors.deleteBtn).style.display = 'none';
    document.querySelector(uiSelectors.backBtn).style.display = 'none';
  }

  const editItem = function(item) {
    document.querySelector(uiSelectors.uiMealName).value = item.name;
    document.querySelector(uiSelectors.uiCalories).value = item.calories;
    document.querySelector(uiSelectors.addBtn).style.display = 'none';
    document.querySelector(uiSelectors.updateBtn).style.display = 'inline';
    document.querySelector(uiSelectors.deleteBtn).style.display = 'inline';
    document.querySelector(uiSelectors.backBtn).style.display = 'inline';
    scrollTo(0,0)
  }

  const addTotalCaloriesUI = function(totalCal) {
    let out = ``;
    if(totalCal <= 500) {
      out = `<span class="has-text-success">${totalCal}</span>`;
    } else if(totalCal > 500 && totalCal <=999) {
      out = `<span class="has-text-warning">${totalCal}</span>`
    } else {
      out = `<span class="has-text-danger">${totalCal}</span>`
    }
    document.querySelector(uiSelectors.totalCalories).innerHTML = `
    ${out}
    `;

  }

  return {
    itemsList: function(data) {
      return displayItems(data);
    },
    selectors: function() {
      return uiSelectors;
    },
    insertItem: function(item) {
      return addItemToUI(item);
    },
    clearInpFields: function() {
      return clearUIFields();
    },
    addTotalCalories: function(totalCal) {
      return addTotalCaloriesUI(totalCal);
    },
    editMode: function(item) {
      return editItem(item);
    }
  }
})();

//main function which controles the project
const mainCtrlr = (function(itemCtrlr, uiCtrlr){
  const data = itemCtrlr.displayData().items;
  const selectors = uiCtrlr.selectors();

  const loadEventListners = function() {
    document.querySelector(selectors.addBtn).addEventListener('click',addItem);
    document.querySelector(selectors.uiItemsList).addEventListener('click',editItems);
    document.querySelector(selectors.backBtn).addEventListener('click',clearFields)
    document.querySelector(selectors.updateBtn).addEventListener('click',updateItem);
    document.querySelector(selectors.deleteBtn).addEventListener('click',deleteItem);
    document.querySelector(selectors.clearAll).addEventListener('click',clearAllItems);
  }

  function clearAllItems() {
    let list = document.querySelector(selectors.uiItemsList);
    list = Array.from(list.children);
    list.forEach(function(item) {
      item.remove();
    });
    itemCtrlr.clearMeals();
    uiCtrlr.addTotalCalories(itemCtrlr.totalCaloriesRes());
  }

  function deleteItem() {
    if(confirm('Are you sure, delete it?')) {
      const currItem = itemCtrlr.getCurrentItem();
    itemCtrlr.deleteItem(currItem);
    uiCtrlr.clearInpFields();
    const itemToDel = document.querySelector('.item-'+currItem.id);
    itemToDel.parentElement.parentElement.remove();
    uiCtrlr.addTotalCalories(itemCtrlr.totalCaloriesRes());
    }
  }

  function updateItem() {
  let currItem = itemCtrlr.getCurrentItem();
  currItem.name = document.querySelector(selectors.uiMealName).value;
  currItem.calories = document.querySelector(selectors.uiCalories).value;
  itemCtrlr.updateData(currItem);
  uiCtrlr.clearInpFields();
  uiCtrlr.itemsList(data);
  uiCtrlr.addTotalCalories(itemCtrlr.totalCaloriesRes());
  }

  function clearFields() {
    uiCtrlr.clearInpFields();
  }

  function editItems(e) {
    if(e.target.classList.contains('fa-pencil')) {
      const a = e.target.parentElement.parentElement.parentElement.classList[2];
    const item = itemCtrlr.getItemById(a.split('-')[1]);
    uiCtrlr.editMode(item);
    }
    if(e.target.classList.contains('fa-trash')) {
      if(confirm('Are you sure, delete it?')) {
      const a = e.target.parentElement.parentElement.parentElement.classList[2];
      const item = itemCtrlr.getItemById(a.split('-')[1]);
      itemCtrlr.deleteItem(item);
      uiCtrlr.clearInpFields();
      const itemToDel = document.querySelector('.item-'+item.id);
      itemToDel.parentElement.parentElement.remove();
      uiCtrlr.addTotalCalories(itemCtrlr.totalCaloriesRes());
      }
    }
    e.preventDefault();
  }
  
  function addItem() {
    const mealName = document.querySelector(selectors.uiMealName).value;
    const calories = document.querySelector(selectors.uiCalories).value;
    if(mealName === '' || calories === '') {
      alert('Fields are empty');
    } else {
      const item = itemCtrlr.createItem(data.length===0?1:data[data.length-1].id+1, mealName, calories);
      itemCtrlr.pushItem(item);
      uiCtrlr.insertItem(item);
      uiCtrlr.clearInpFields();
      uiCtrlr.addTotalCalories(itemCtrlr.totalCaloriesRes());
    }
  }

  return {
    init: function() {
      uiCtrlr.itemsList(data);
      uiCtrlr.addTotalCalories(itemCtrlr.totalCaloriesRes());
      loadEventListners();
    }
  };
})(itemCtrlr, uiCtrlr);

mainCtrlr.init();