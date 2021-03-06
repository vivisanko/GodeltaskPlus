"use strict";

function task() {
    
    const boxSize = 7;
    const stepSize = 1;
    const itemsCount = boxSize**2;
    const box = document.getElementById('box');
    const person = document.getElementById('person');
    const start = 0;
    const setupKeys = 
    {ArrowRight: +stepSize,
     ArrowLeft:-stepSize,
     ArrowDown: +boxSize,
     ArrowUp: -boxSize,
    }
    const personePathway = [];

    let current = start;
    let lastStep = "ArrowDown";
    let currentStep = '';
    let rotate = 0;
 
    function createPersonePathway(first){
        let counter = first;

        while(Math.floor(counter/boxSize) !== 0){
            personePathway.push('ArrowUp');
            counter-=boxSize;
        }
        while(personePathway.length < itemsCount){
            while ( Math.floor(counter/boxSize) === Math.floor((counter + stepSize)/boxSize)){
                personePathway.push('ArrowRight')
                counter+=stepSize;
            } 
            if(Math.round(counter/boxSize) < boxSize ){
                personePathway.push('ArrowDown');
                counter+=boxSize;

            } else if(Math.round(counter/boxSize) === boxSize){
                break;
            }
            else {
            personePathway.push('ArrowUp');
            counter-=boxSize;
            }
            while ( Math.floor(counter/boxSize) === Math.floor((counter - stepSize)/boxSize)){
                personePathway.push('ArrowLeft')
                counter-=stepSize;
            } 
            if(Math.round(counter/boxSize) < boxSize){
                personePathway.push('ArrowDown');
                counter+=boxSize;

            } else {
            personePathway.push('ArrowUp');
            counter-=boxSize;
            }
        }
        console.log('personePathway',personePathway);
        
    }


    function determineBoxSizes(){
    let wrapper = document.getElementsByClassName("wrapper")[0];
    let html = document.getElementsByTagName("html")[0];
    
    let width = wrapper.clientWidth;
    let height = wrapper.clientHeight;
    let units = (Math.min(width,height)===height)? "vh":"vw";
       html.style.setProperty(`--area-size`, `80${units}`);
       html.style.setProperty(`--cell-size`, `${80/boxSize}${units}`);
    }

  function  createBox() {
      determineBoxSizes();
      for (let i = 0; i < itemsCount; i++) {
      let item = document.createElement('div');
      item.className = "item";
      item.id = i;
      box.appendChild(item);
      box.className="itemBox"};
    };

    function rotatePerson(){
     
        let angleOfRotation = () => {
            if(lastStep === currentStep){
                return 0;
            }
            if(Math.abs(setupKeys[lastStep]) === Math.abs(setupKeys[currentStep])) {
                return 180
            } 
            let arr= ["ArrowRight","ArrowDown","ArrowLeft","ArrowUp","ArrowRight"];
            let prevInd = arr.findIndex((el,index) => el === lastStep);
            const isClockwise = arr[prevInd+1] === currentStep;            
            return isClockwise ? 90 : -90;
        }
        rotate+=angleOfRotation();
        person.style.transform = `rotate(${rotate}deg)`;
        lastStep = currentStep;
        
    }


    function startMove(newCurrent){
     current = newCurrent;
     findPositionMutableEl(newCurrent, person);
     
    }


    function checkDirection(step){
    let sum = current + step;
        
    if(sum <0 || sum >itemsCount-1){
     console.log('мешает стена, не в интервале : ');
     rotatePerson(step);
     return
    } 

    if( Math.abs(step) === stepSize && Math.floor(current/boxSize) !== Math.floor(sum/boxSize)){
        console.log('мешает стена, другой ряд');
        rotatePerson(step);
        return
    } 

     rotatePerson(step);
     makeCleaner(current);
     startMove(sum);
     makeCleaner(sum);
    }
    

    function go(event){
        if(Object.keys(setupKeys).includes(event)){
         let step = setupKeys[event];
         currentStep = event;
         checkDirection(step);
        }
    }

    function findPositionMutableEl(elemId, mutable){
    let elem = document.getElementById(elemId);
    let position = elem.getBoundingClientRect();
    mutable.style.left = `${position.left}px`;
    mutable.style.top = `${position.top}px`;
    mutable.style.display = "flex";
    // mutable.offsetTop;
    }
    function makeCleaner(cell){
      let cleanCell = document.getElementById(cell);
      console.log('cleanCell',cleanCell);
    //   cleanCell.style.backgroundColor = 'lightskyblue';
    cleanCell.style.backgroundColor = '#87b6b8';

        
    }
   
    createBox();
    createPersonePathway(start);
    findPositionMutableEl(start, person);

    
   
    function animate() {
      let  fps = 40;
      let time = 1000 * personePathway.length;
      let steps = time / (1000);   
      let timer = setInterval(function(){
      go(personePathway[personePathway.length-steps]);
      steps-=1;
      if(steps <= 0){
        clearInterval(timer);
      }
        }, (1000 * personePathway.length / fps))
    }
     
    animate();
}

task();
   



