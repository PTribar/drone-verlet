let destinationArray;

function database_init() {
  
  const firebaseConfig = {
    apiKey: "AIzaSyC2-7m8bc9VtmWwg350XQ8gUpgALp5bJgI",
    authDomain: "drone-verlet.firebaseapp.com",
    databaseURL: "https://drone-verlet-default-rtdb.firebaseio.com",
    projectId: "drone-verlet",
    storageBucket: "drone-verlet.appspot.com",
    messagingSenderId: "1009179183741",
    appId: "1:1009179183741:web:86642259fabc13f15abf14",
    measurementId: "G-NYHGNV8V0L"
  };
  firebase.initializeApp(firebaseConfig);
  
  database = new Database(firebase.database());
  database.getScores(savedEntries);
}


class Database {
  constructor(database) {
    this.database = database;
    
    const startTime = 1691334000; // aug 8 2023
    const unixSecondsPassed = int((Date.now()/1000-startTime))
    const unixWeeksPassed = int(unixSecondsPassed/60/60/24);

    this.curr_week = unixWeeksPassed;
    this.ref = this.getRef('week'+this.curr_week);
  }
  
  getRef(name) {
    return this.database.ref(name);
  }
  
  getScores(arrToSave, collection='week'+this.curr_week) {
    
    this.ref = this.getRef(collection);
    
    destinationArray = arrToSave;
    var result = 0;
    this.ref.on('value', this.gotData, this.errData);
  }

  gotData(data) {
    var scores = data.val();
    var keys = Object.keys(scores);
    for (var i=0; i<keys.length; i++) {
      var k = keys[i];
      var name = scores[k].name;
      var score = scores[k].score;
  
      destinationArray[i] = {name: name, score: score};
    }
    
  }

  errData(err) {
    console.log('Error');
    console.log(err);
  }

}