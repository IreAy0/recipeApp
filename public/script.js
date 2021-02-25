const mealsEl = document.getElementById('meals');
const favContainer = document.getElementById("fav-meals");
const mealPopup = document.getElementById('meal-popup');
// const closePopupBtn = document.getElementById('close-popup') ;
const mealInfoEl = document.getElementById("meal-info");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search")

getRandomMeal();
fetchFavMeals();


async function getRandomMeal() {
  const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);  

  const respData = await resp.json();
const randomMeal = respData.meals[0];
addMeal( randomMeal , true);
}

async function getMealById(id) {
    const resp =await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=
    ` + id);

    const respData = await resp.json();
    const meal = respData.meals[0]

    return meal
}


async function getMealBySearch(term) {

    const resp =await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=` + term );
    const respData = await resp.json();
    const meals = respData.meals
console.log(meals );
    return meals
}

function addMeal(mealData, random = false){
    console.log(mealData);
    const meal = document.createElement('div');
    meal.classList.add("meal");
    meal.innerHTML = `
    
    <div id="meal" class=" overflow-hidden shadow-lg rounded-lg h-90 w-60 md:w-80  m-auto text-left my-5">
            <div  class="w-full block h-full relative">
            ${
                random ? ` <span class="random">Random Recipe</span>` : ""
            }
                <img src="${mealData.strMealThumb}" class="cursor-pointer max-h-40 w-full object-cover meal-img" alt="${mealData.strMeal}"/>
                <div class=" meal-body bg-white dark:bg-gray-800 w-full p-4 items-center flex justify-between">
                    
                    <p class="text-gray-800 dark:text-white text-lg font-medium mb-2">
                    ${mealData.strMeal}
                    </p>
                    
                <button   class="fav-btn focus:outline-none">
                    <i class="fas fa-heart"></i>
                </button>
        
                   
                </div>
            </div>
        </div>
    `;

 const btn =  meal.querySelector(".meal-body .fav-btn");
   
    btn.addEventListener('click', () => {
        if(btn.classList.contains("active")){
            removeMealFromLS(mealData.idMeal)
            btn.classList.remove('active');
        } else{
            addMealToLS(mealData.idMeal)
            btn.classList.add("active");
        }
        // btn.classList.toggle("active");
        // btn.style.color = "red"
       
        // mealsEl.innerHTML="";
        fetchFavMeals();
        // getRandomMeal();
    })

    const getInfo = meal.querySelector(".meal .meal-img")

    getInfo.addEventListener('click', () => {
        showMealInfo(mealData)
    })
    // meal.addEventListener('click', () =>{
    //     showMealInfo(mealData)
    // })
    mealsEl.appendChild(meal)
};


function showMealInfo(mealData) {

    mealInfoEl.innerHTML ="";
    const mealEL = document.createElement('div');

    const ingredients = [];
    for (let i = 1; i <= 20 ; i++) {
       if (mealData['strIngredient' +i]) {
           ingredients.push(`${mealData['strIngredient' +i]} - ${mealData['strMeasure' + i]} `)

       } else {
           break
       }
    }
    console.log(ingredients);
    mealEL.innerHTML= `
    <div class="info bg-white sm:m-3 shadow rounded-lg dark:bg-gray-800 ">
    <div class="relative w-full max-h-screen overflow-auto mx-auto py-6 px-4 sm:px-6 lg:py-6 lg:px-8 z-20">
    <button class="close-popup absolute cursor-pointer bg-transparent text-2xl top-4 right-8 focus:outline-none "><i class="fas fa-times"></i></button>
      
       
        <h2 class="text-center mb-3 text-lg font-semibold text-black dark:text-white sm:text-xl">
            <span class="block">
              ${mealData.strMeal}
            </span>
           
        </h2>
        <img src="${mealData.strMealThumb}" alt="" srcset="" class="w-full h-60 object-cover">
      <p class="text-base my-3">
        ${mealData.strInstructions}
      </p>
      <h3 class="text-lg font-medium text-center">Ingredients</h3>
<ul class="my-3 list-disc px-5">
  ${ingredients.map(
      (ing) => `<li>${ing}</li>`
  )
.join("")}

</ul>

</div>
</div>
    
    `;
  const   closePop = mealEL.querySelector(".info .close-popup");

    closePop.addEventListener('click', () =>{
        mealPopup.classList.add('hide')
        console.log('working');
    
    
    })

     mealInfoEl.appendChild(mealEL)

     mealPopup.classList.remove('hide');


    
}

function addMealToLS(mealId) {
   const mealIds = getMealFromLS();

   localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}

function  removeMealFromLS(mealId){
const mealIds = getMealFromLS();
localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))
}

function getMealFromLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    console.log(mealIds);
    return mealIds === null ? [] : mealIds
}
async function fetchFavMeals() {
    favContainer.innerHTML = "";
    const mealIds = getMealFromLS();

    const meals = []
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];

       
   meal =  await getMealById(mealId)
   addMealToFav(meal)
       meals.push(meal) 
    }
    console.log(meals);
}

function addMealToFav(mealData){
    console.log(mealData);
    const favMeal = document.createElement('li');
 
    favMeal.innerHTML = `
   
                 <img src="${mealData.strMealThumb}" alt="food_img" srcset=""cursor-pointer class="rounded-full fav-img">
           
             <span class="font-medium ">${mealData.strMeal}</span>
             <button class="clear focus:outline-none bg-transparent border-0 text-lg " > <i class="fas fa-window-close"></i></button>
    `;

    //remove meal from fav by clicking clear btn
    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', () =>{
        removeMealFromLS(mealData.idMeal);
        fetchFavMeals();
    })
// view meal info by clicking meal img
    const favView = favMeal.querySelector(".fav-img");
    favView.addEventListener('click', () =>{
        showMealInfo(mealData)
    })
    // favMeal.addEventListener('click', () =>{
        
    // })
    favContainer.appendChild(favMeal)
};

searchBtn.addEventListener('click', async () => {
    mealsEl.innerHTML =""
    const search = searchTerm.value;
    const meals = await getMealBySearch(search)
    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }else {
        mealsEl.innerHTML ="<div class='font-medium p-5'>Not Available</div> "
    }
   
});

