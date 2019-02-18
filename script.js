const myApp = {};
//organizes and allows global access to variables/methods as modular components - also prevents confict with other code

const budget = [
    // {
    //     name: "food",
    //     amount: 300,
    //     subcategory: [
    //         { name: "groceries", amount: 200  },
    //         { name: "restaurants", amount: 100  }
    //     ] 
    // },
    // {
    // demo of the data structure    
];

// *************************************************************************************************

// could empty() be used in one of these instances
// could replace() be used to clear content
// template literals do not play well with objects, cannot convert them to a string

// *************************************************************************************************

// Neutral state - do not show any categories if there are no sub categories

myApp.init = () => {
    myApp.listenSubmit();
    
}
    
// *** event listener for submit event
myApp.listenSubmit = () => {
    // perform the below functions once user submits form
    $('.input form').on('submit', function(e){
        e.preventDefault();
        myApp.getUserInput();
        myApp.createExpenses(budget, myApp.userCategory);
    });
}

//Problem: Wrong amount is being added to sub-category array when trying to edit



// ------------------------- Edit Expense -------------------------

// When edit button is checked 
// TODO: Jazz it up - make the h2 change to "editing ${category}"
// also highlight the row of the subcategory that is being checked




// ------------------------- End of Edit Expense -------------------------

// -------------------------- Add Expense --------------------------

// *** creates subcategory object in budget/amount array under the selected category
myApp.createExpenses = (array, category) => {
    // the category parameter is a placeholder for the filterExpense() method which accepts two arguments (so you can use it to filter categories and sub-categories)
    
    //reset number to -1 (no match) before findIndex. otherwise the old value from the last time the function was called will still be stored in there. thats because if nothing meets the condition of findIndex() the indexCategory value will NOT change.
    myApp.indexCategory = -1;
    // TODO: WHY DOES THIS HAVE TO BE OUT HERE FOR IT TO WORK? WHY WONT THIS EXPRESSION WORK INSIDE OF myApp.findCategory() ???????

    //reset filterCategory to an empty array (category not found) by default until a category is found
    myApp.filterCategory = [];
    //filterCategory will retain its old value if filterExpense returns nothing.

    //filter for the category selected by the user - checks if category exists. 
    myApp.filterCategory = myApp.filterExpense(array, category); 

    //if the category does not exist
    if (myApp.filterCategory === undefined || myApp.filterCategory.length === 0){
        console.log(`${myApp.userCategory} does not exist`);
        //create a new category and new subcategory in the array
        budget.push( { name: myApp.userCategory, subcategory: [{name:myApp.userSubcategory, amount: myApp.budgetAmount}] } );
        console.log(`New category and sub-category added to your array `, array);
        //calculate category's total and adds it to the array
        myApp.categoryTotal(array, array.length - 1);
        //second parameter is using the array length as an index - the new category is pushed to the end of the array this lets the function kno which category the total is for. Don't forget -1 on length!!!!!!!!

        //print the category
        $('.heading').after(`
            <tr class="${myApp.userCategory} category">
                <td class=name>${myApp.userCategory}</td>
                <td class=budget>$ ${myApp.sumSubCategory}</td>
            </tr>
        `);


        // go to index with the corresponding category, find the subcategory array and go to last index (newly added sub-category)
        myApp.foundSubcategory = array[array.length - 1].subcategory[array[array.length - 1].subcategory.length - 1];

        myApp.newSubcategoryName = myApp.foundSubcategory.name;
        myApp.newSubcategoryAmount = myApp.foundSubcategory.amount;

        // print the newly added sub-category
        myApp.printSubcategories(myApp.userCategory, myApp.newSubcategoryName, myApp.newSubcategoryAmount, "budget");

        // print the category and sub-category to the DOM - will also check for new/existing categories

    // if the category already exists 
    } else if (myApp.filterCategory.length > 0) {
        // find the category in the array - returns index position of category. used in findSubcategory() method
        myApp.findCategory(array);
        console.log(`Found your category of: ${myApp.userCategory}. It is located in index: ${myApp.indexCategory} in the following array`, array);

        //check if the subcategory exists. If it doesn't create a new subcategory, calculate the new total of category and add it to the array. 
        //If the subcategory exists, check if the user is editing. If the user isnt editing alert user.
        myApp.findSubcategory(array);
      
        //update the category total and print it
    }

    $('.input form')[0].reset();
    //https://stackoverflow.com/questions/3786694/how-to-reset-clear-form-through-javascript
    // reset is a DOM element method, DOM sits at index[0] of the jquery object
};


// *** checks array for the selected expense category TODO: this cannot find the category the user selected (when edit is clicked) - forcing a new subcategory to be created (eventually a new category in some instances) 
// this will impact filtersubcategory as well
myApp.filterExpense = (array, category) => {
    //need return to store the value that filter() returns (currently returns undefined if there is no category)
    return array.filter((index) => {
        return index.name === category;
    });
};


// *** calculates sum of sub-categories in a given category and creates a property of amount in the category
//call this function only when a sub-category has been added / edited / delete - this way the function only calculates the sum for the affected category (instead of calculating the total every time user click submit)
myApp.categoryTotal = (array, index) => {
    //calculate the sum of its sub categories
    myApp.sumSubCategory = array[index].subcategory.reduce((accumulator, currentValue) => {
        // for object arrays to work with reduce() an initial value must be passed after the callback function (subcategory is an array of objects)
        return accumulator + currentValue.amount;
    }, 0)
    console.log(`Category`, array[index], `total amount is `, myApp.sumSubCategory);
    array[index].amount = myApp.sumSubCategory;
    // adds category's amount to the array
};

// *** finds the category inputted by the user in array - returns the index number where the category already exists 
myApp.findCategory = (array) => {

    // myApp.indexCategory is reset to -1 before this function is called every time (in the myApp.createExpenses() method)
    
    myApp.indexCategory = array.findIndex((index) => {
        return index.name === myApp.userCategory;
    });

    console.log("This category exists in budget, it has an index position of ", myApp.indexCategory);
};

// *** category exists, checks if the sub-category exists. if sub-category exists and edit button checked off - enable edit. If edit button is not checked off - alert user that the sub category exists and do not add.
myApp.findSubcategory = (array) => {
    // array is the budget or spent array

    //reset to empty array (no subcategory) otherwise the old value will be stored if filterExpense returns nothing
    myApp.filterSubcategory = [];

    // filterExpense creates an array with with items that meet the condition (matches usersubcategory)
    myApp.filterSubcategory = myApp.filterExpense(array[myApp.indexCategory].subcategory, myApp.userSubcategory); 
    //myApp.indexCategory is created by the findCategory function, this function must be called after it

    //  if no subcategories are found, add a new subcategory to the array
    if (myApp.filterSubcategory === undefined || myApp.filterSubcategory.length === 0){
        //create a new sub category
        console.log('subcategory/s array: ', array[myApp.indexCategory].subcategory);
        
        array[myApp.indexCategory].subcategory.push({ name: myApp.userSubcategory, amount: myApp.budgetAmount });
        console.log(`This sub-category does not exist! I've added it for you`, array);

        // calculate the new total of the category 
        //findCategory() is called before findSubcategory() so myApp.indexCategory is updated
        myApp.categoryTotal(array, myApp.indexCategory);
        // second argument is the index position of the existing category

        //print the new total to an existing category 
        $(`.${myApp.userCategory}.category .budget`).text(`$ ${myApp.sumSubCategory}`);
        
        //print the new sub-category and amount 

        //reset it to the length of the array, otherwise it will hold the value from previous assignment
        myApp.indexSubcategory = array[myApp.indexCategory].subcategory.length - 1;
        console.log("indexSubcategory: ", myApp.indexSubcategory);

        //first go to the appropriate sub-category array, find the last item in that array and print it
        myApp.foundSubcategory = array[myApp.indexCategory].subcategory[myApp.indexSubcategory];

        myApp.newSubcategoryName = myApp.foundSubcategory.name;
        myApp.newSubcategoryAmount = myApp.foundSubcategory.amount;

        // print the newly added sub-category
        myApp.printSubcategories(myApp.userCategory, myApp.newSubcategoryName, myApp.newSubcategoryAmount, "budget");
       
    // if the subcategory exists and the edit button is checked off, call editExpense() method
    } else if (myApp.filterSubcategory.length > 0 && $('table .edit').is(':checked')) {
        
        // check array for data and print to DOM
        myApp.editExpense(array);
        
    } else if (myApp.filterSubcategory.length > 0)
        alert('This sub-category already exists!');
}

// *** finds category/sub-category and updates their values - no need to check because the edit button only applies to categories/sub-categories that exist 
//revision of second edit is wrong, creates duplicates


myApp.editExpense = (array) => {
    //get the index of the selected category
    // const editCategoryIndex = myApp.findExpenseIndex(array, myApp.userCategory);
    // console.log(editCategoryIndex);
    console.log("the category index from findCategory", myApp.indexCategory);

    // get the index of the selected sub-category
    let editSubCategoryIndex = myApp.findExpenseIndex(array[myApp.indexCategory].subcategory, myApp.userSubcategory);
    console.log("the subcategory index found with myApp.indexCategory", editSubCategoryIndex);

    //edit sub-category amount in the array
    array[myApp.indexCategory].subcategory[editSubCategoryIndex].amount = myApp.budgetAmount;
    console.log("Your new subcategory total ", array[myApp.indexCategory].subcategory[editSubCategoryIndex].amount);

    //calculate the new category total and amend the array
    myApp.categoryTotal(array, myApp.indexCategory);
    array[myApp.indexCategory].amount = myApp.sumSubCategory;
    console.log("Your new category total ", array[myApp.indexCategory].amount);

    //print the edited categories
    $(`.${myApp.userCategory}.category .budget`).text(`$ ${array[myApp.indexCategory].amount}`);

    //print the edited sub-categories
    $(`.${myApp.userSubcategory}.sub-category .budget`).text(`$ ${array[myApp.indexCategory].subcategory[editSubCategoryIndex].amount}`);

    //clear the radio buttons
    $('input[type="radio"]').prop('checked', false);
    // prop gets value of property and changes it
};


// *** finds the index of any expense
myApp.findExpenseIndex = (array, category) => {

    return array.findIndex((index) => {
        return index.name = category;
    });
};

// *** prints subcategories > use parameters because index position of category will change depending of its new or old
myApp.printSubcategories = (categoryName, SubcategoryName, SubcategoryAmount, arrayName) => {
    //arrayName is a string for the name of the array, array is the actual array that holds the data 
    $(`.${categoryName}`).after(`
        <tr class="${SubcategoryName} sub-category">
            <td class=name>${SubcategoryName}</td>
            <td class=${arrayName}>$ ${SubcategoryAmount}</td>
            <td><input type=radio name=action value=edit class=edit></td>
            <td><input type=radio name=action value=delete class=delete></td>
        </tr>
    `)
}

// -------------------------- End of Add Expense --------------------------

// -------------------------- User Input --------------------------

// *** store values of user's input
myApp.getUserInput = () => {
    myApp.userCategory = $('#category-budget').val().toLowerCase();
    // take user's category selection and store it 
    myApp.userSubcategory = $('#subcategory-budget').val().toLowerCase();
    myApp.budgetAmount = myApp.convertNum($('#budget').val());
    // converts user's amount to dollars (inputs always hold string values)
    console.log(`[User category: ${myApp.userCategory}], [User sub-category: ${myApp.userSubcategory}], [User budget: ${myApp.budgetAmount}]`);
    // clear the input - lets user know action has been submitted
}

// *** converts user input to dollars
myApp.convertNum = (string) => {
    return parseFloat(string);
    // parseFloat returns a number with a decimal place
}
// -------------------------- End of User Input --------------------------

// deleting sub categories
    // if user chooses to delete - check if there is an existing sub category and change the object's subcategory to null (assuming we cannot delete objects from the array)
    // once this update is complete, check the array for objects
    // if index has object, print the objects and their totals only if the object does not have a null value for the sub-category (assuming we cannot delete objects from the array)
    // sum up the totals of the objects (category) and print
    //once checked, ask the user to confirm
    //when the user confirms, remove the sub category from the data structure


//  *************************************************************************************************

// Actual / Comparison stretch goal
// for the comparison column - show the result whenever an actual or budget amount is added
    // always go to the comparison property and add 0 when budget/actual amount is added
    // when an actual/budget is deleted make its value = 0
    // always use 0 so that comparison can return a value

$(function () {
    myApp.init();
});


