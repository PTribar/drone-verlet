class Database {
  constructor(database) {
    this.database = database;
    this.ref = this.database.ref('scores');
  }
  
  ref(name) {
    return this.database.ref(name);
  }
  
  getScores() {
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
  
      savedEntries[i] = {name: name, score: score};
    }
    
  }

  errData(err) {
    console.log('Error');
    console.log(err);
  }

}