// Genetic Algorithm, Evolving Shakespeare

// A class to describe a population of virtual organisms
// In this case, each organism is just an instance of a DNA object

class Population {
    constructor(p, m, num) {
      this.population; // Array to hold the current population
      this.matingPool; // ArrayList which we will use for our "mating pool"
      this.generations = 0; // Number of generations
      this.finished = false; // Are we finished evolving?
      this.target = p; // Target phrase
      this.mutationRate = m; // Mutation rate
      this.perfectScore = 1;
  
      this.best = "";
      
      //population is a long array of random phrase
      this.population = [];
      //DNA is every character of the words
      for (let i = 0; i < num; i++) {
        this.population[i] = new DNA(this.target.length);
      }
      this.matingPool = [];
      this.calcFitness();
    }
  
    // Fill our fitness array with a value for every member of the population
    // it's in DNA.js file
    calcFitness() {
      for (let i = 0; i < this.population.length; i++) {
        this.population[i].calcFitness(target);
      }
    }
  
//POOL SELECTION METHOD 1:
    //哪一个fitness值大就多多pick他
    // // Generate a mating pool
    naturalSelection() {
      // Clear the ArrayList
      //fit pick array
      this.matingPool = [];
  
      let maxFitness = 0;
      for (let i = 0; i < this.population.length; i++) {
        if (this.population[i].fitness > maxFitness) {
          maxFitness = this.population[i].fitness;
        }
      }
  
      // Based on fitness, each member will get added to the mating pool a certain number of times
      // a higher fitness = more entries to mating pool = more likely to be picked as a parent
      // a lower fitness = fewer entries to mating pool = less likely to be picked as a parent
      for (let i = 0; i < this.population.length; i++) {
        let fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);
        let n = floor(fitness * 100); // Arbitrary multiplier, we can also use monte carlo method

        for (let j = 0; j < n; j++) {
          // and pick two random numbers
          this.matingPool.push(this.population[i]);
        }
       
      }
    }

        generate() {
          // Refill the population with children from the mating pool
          for (let i = 0; i < this.population.length; i++) {
            let a = floor(random(this.matingPool.length));
            let b = floor(random(this.matingPool.length));
            let partnerA = this.matingPool[a];
            let partnerB = this.matingPool[b];
            let child = partnerA.crossover(partnerB);
            child.mutate(this.mutationRate);
            this.population[i] = child;
          }
          this.generations++;
    }




//POOL SELECTION METHOD 2:
        //rejection samplelling 方法： 就是说把fitness值和generate出来的一个random值相比较
        //如果fitness值（例如是0.8）比 random值（0.9）小， 淘汰 ，如果更大就保留
        //这样fitness值很小的 例如0.1什么的就很早被淘汰了
        // Generate a mating pool
        //naturalSelection() 在 generate里面
    // Create a new generation
    // generate() {
    //   let maxFitness = 0;
    //   for (let i = 0; i < this.population.length; i++) {
    //     if (this.population[i].fitness > maxFitness) {
    //       maxFitness = this.population[i].fitness;
    //     }
    //   }

    //   // Refill the population with children from the mating pool
    //   for (let i = 0; i < this.population.length; i++) {
    //     let partnerA = this.acceptReject();
    //     let partnerB = this.acceptReject();
    //     //crossover and mutationrate are in DNA's class
    //     let child = partnerA.crossover(partnerB);
    //     child.mutate(this.mutationRate);
    //     this.population[i] = child;
    //   }
    //   this.generations++;
    // }

    // acceptReject(maxFitness){
    //   let basafe = 0;
    //   while (true){
    //     var index = floor(random(this.population.length))
    //     var r = random(0, maxFitness)
    //     var partner = this.population[index]
    //     if (r < partner.fitness){
    //       return partner;
    //     }
    //     basafe++;

    //   if(basafe >10000){
    //     return null;
    //   }
    // }
    // }
  
    getBest() {
      return this.best;
    }
  
    // Compute the current "most fit" member of the population
    evaluate() {
      let worldrecord = 0.0;
      let index = 0;
      for (let i = 0; i < this.population.length; i++) {
        if (this.population[i].fitness > worldrecord) {
          index = i;
          worldrecord = this.population[i].fitness;
        }
      }
  
      this.best = this.population[index].getPhrase();
    
      if (worldrecord === this.perfectScore) {
        this.finished = true;
      }
    }
  
    isFinished() {
      return this.finished;
    }
  
    getGenerations() {
      return this.generations;
    }
  
    // Compute average fitness for the population
    getAverageFitness() {
      let total = 0;
      for (let i = 0; i < this.population.length; i++) {
        total += this.population[i].fitness;
      }
      return total / this.population.length;
    }
  
    allPhrases() {
      let everything = "";
  
      let displayLimit = min(this.population.length, 50);
  
      for (let i = 0; i < displayLimit; i++) {
        everything += this.population[i].getPhrase() + "<br>";
      }
      return everything;
    }
  }
  