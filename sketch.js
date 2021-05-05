var dog,hungryDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj,currentTime;
var milk,input,name;
var gameState="hungry";
var gameStateRef;
var bedroomIMG,washroomIMG,gardenIMG,runIMG,sleepIMG;
var input,button;

function preload(){
hungryDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
bedroomIMG=loadImage("images/Bed Room.png");
washroomIMG=loadImage("images/Wash Room.png");
gardenIMG=loadImage("images/Garden.png");
sleepIMG=loadImage("images/Lazy.png");
runIMG=loadImage("images/running.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1200,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addAnimation("hungry",hungryDog)
  dog.addAnimation("happy",happyDog)
  dog.addAnimation("sleepImg",sleepIMG)
  dog.addAnimation("run",runIMG)


  // dog.addImage(sadDog);
  dog.scale=0.3;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


  input=createInput("Pet Name")
  input.position(950,120)

  button=createButton("Confirm")
  button.position(1000,140)
  button.mousePressed(createName);


}

function draw() {
  currentTime===hour();

  if(currentTime===lastFed+1){
    gameState="playing";
    updateGameState();
    foodObj.garden();
  }
  else if(currentTime===lastFed+2){
    gameState="sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime>lastFed+2 && currentTime<= lastFed+4){
    gameState="bathing";
    updateGameState();
    foodObj.washroom();
  }
  else {
    gameState="hungry";
    updateGameState();
    foodObj.display();
  }

  foodObj.getFoodStock();

  getGameState();

  // background(46,139,87);
  // foodObj.display();

   fedTime=database.ref('FeedTime');
   fedTime.on("value",function(data){
     lastFed=data.val();
   });

   if(gameState=== "hungry"){
     feed.show();
     addFood.show();
     dog.addAnimation("hungry",hungryDog)
   }
   else{
     feed.hide();
     addFood.hide();
     dog.remove();
   }
 
  // fill(255,255,254);
  // textSize(15);
  // if(lastFed>=12){
  //   text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  //  }else if(lastFed==0){
  //    text("Last Feed : 12 AM",350,30);
  //  }else{
  //    text("Last Feed : "+ lastFed + " AM", 350,30);
  //  }
 
  drawSprites();

  textSize(32);
  fill("yellow")

  textSize(20);
  text("last feed: "+lastFed+":00",300,95)

  text("time since last feed: "+(currentTime - lastFed),300,125)

}

// function update(state){
//   database.ref('/').update({
//    gameState:state
//   })
// }

//function to read food Stock
function readStock(data){
  readState=database.ref("gameState")
  readState.on("value",function(data){
    gameState=data.val();
  })
   foodS=data.val();
   foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  // foodObj.deductFood();
  // foodObj.updateFoodStock();
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
   database.ref('/').update({
     Food:foodObj.getFoodStock(),
      FeedTime:hour()
   })
  dog.changeAnimation("happy",happyDog);
  gameState="happy";
  updateGameState();

  // dog.addImage(happyDog);

   
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
  foodObj.addFood();
  foodObj.updateFoodStock();
   
  
}

async function hour(){
  var site=await fetch("http://worldtimeapi.org/api/timezone/asia/kolkata");
  var siteJSON=await site.json();
  var dateTime=siteJSON.dateTime;
  var hourTime=dateTime.slice(11,13);
  return hourTime;
}

function createName(){
  input.hide();
  button.hide();

  name=input.value();
  var greeting=createElement("h1");
  greeting.html("pet's name: "+name);
  greeting.position(850,100);
}

function getGameState(){
  gameStateRef=database.ref("gameState");
  gameStateRef.on("value",function(data){
    gameState=data.val()
  })
}

function updateGameState(){
  database.ref("/").update({
    gameState:gameState
  })
}