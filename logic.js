var score = 0;
var freespinNum = 0;
var segNum = 14;
var spinCount = 0;
var firstOccurFirstNumIndex, secondOccurFirstNumIndex, thirdOccurFirstNumIndex;
var firstOccurSecondNumIndex, secondOccurSecondNumIndex;
var firstNum = 0, secondNum = 0;
var selectedSegments = [];
var currSegment = 0;

function sel() {
  let x = document.getElementById("bet").value;
  betSelected(x);
}

function newTenSpinsRules() {

  //The one which will be selected 3 times in 10 rounds
  firstNum = Math.floor(Math.random() * segNum) % segNum;

  //The one which will be selected 2 times in 10 rounds
  secondNum = (firstNum + Math.floor(Math.random() * (segNum - 2) + 1)) % segNum;

  let spinIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  firstOccurFirstNumIndex = spinIndexes[Math.floor(Math.random() * 10)];

  let rangeSecondOccurFirstNum = spinIndexes.filter(withoutPrevAndNextSpinIndexFirstOccurFirstNum);
  secondOccurFirstNumIndex = rangeSecondOccurFirstNum[Math.floor(Math.random() * 7)];

  let rangeThirdOccurFirstNum = rangeSecondOccurFirstNum.filter(withoutPrevAndNextSpinIndexFirstAndSecondOccurFirstNum);
  thirdOccurFirstNumIndex = rangeThirdOccurFirstNum[Math.floor(Math.random() * 4)];

  function withoutPrevAndNextSpinIndexFirstOccurFirstNum(value) {
    return value != firstOccurFirstNumIndex && value != (firstOccurFirstNumIndex + 1) % 10 && value != (firstOccurFirstNumIndex + 10 - 1) % 10;
  }

  function withoutPrevAndNextSpinIndexFirstAndSecondOccurFirstNum(value) {
    return value != secondOccurFirstNumIndex && value != (secondOccurFirstNumIndex + 1) % 10 && value != (secondOccurFirstNumIndex + 10 - 1) % 10;
  }

  let rangeFirstOccurSecondNum = spinIndexes.filter(withoutFirstNumSpinIndexOccurances);
  firstOccurSecondNumIndex = rangeFirstOccurSecondNum[Math.floor(Math.random() * 7)];

  let rangeSecondOccurSecondNum = rangeFirstOccurSecondNum.filter(withoutPrevAndNextSpinIndexFirstOccurSecondNumAndAllOccurancesOfFirstNum);
  secondOccurSecondNumIndex = rangeSecondOccurSecondNum[Math.floor(Math.random() * 4)];


  function withoutFirstNumSpinIndexOccurances(value) {
    return value != firstOccurFirstNumIndex && value != secondOccurFirstNumIndex && value != thirdOccurFirstNumIndex;
  }

  function withoutPrevAndNextSpinIndexFirstOccurSecondNumAndAllOccurancesOfFirstNum(value) {
    return value != firstOccurSecondNumIndex && value != (firstOccurSecondNumIndex + 1) % 10 && value != (firstOccurSecondNumIndex + 10 - 1) % 10;
  }

  let allSegmentsIndexes = [];
  for (let i = 0; i < segNum; i++) {
    allSegmentsIndexes.push(i);
  }
  let allSegmentsIndexesWithoutIndexOfFirstSecondAndCurrSegment = allSegmentsIndexes.filter(withoutFirstSecondAndCurSegment);
  for (let i = 0; i < 10; i ++) {
    if (i == firstOccurFirstNumIndex || i == secondOccurFirstNumIndex || i == thirdOccurFirstNumIndex) {
      selectedSegments[i] = firstNum;
    }
    else if (i == firstOccurSecondNumIndex || i == secondOccurSecondNumIndex) {
      selectedSegments[i] = secondNum;
    }
    else {
      allSegmentsIndexesWithoutIndexOfFirstSecondAndCurrSegment = allSegmentsIndexesWithoutIndexOfFirstSecondAndCurrSegment.filter(withoutFirstSecondAndCurSegment);
      selectedSegments[i] = allSegmentsIndexesWithoutIndexOfFirstSecondAndCurrSegment[Math.floor(Math.random() * allSegmentsIndexesWithoutIndexOfFirstSecondAndCurrSegment.length)];
      currSegment = selectedSegments[i];
    }
  }

  function withoutFirstSecondAndCurSegment(value) {
    return value != firstNum && value != secondNum && value != currSegment;
  }
}

var segList = [
  "Free Spins",
  "200",
  "900",
  "400",
  "1800",
  "1500",
  "1200",
  "1100",
  "350",
  "500",
  "800",
  "1600",
  "400",
  "150",
  "300",
  "200",
  "1000",
  "100"
];

window.onload = function() {
  addSegs(segNum);
  document.getElementById('bet1').className = "betActived";
  newTenSpinsRules();
}
var tp = new Winwheel({
  'canvasId'    : 'trianglePointer',
  'outerRadius' : 110,
  'fillStyle'   : '#eae56f'
});

let tcanvas = document.getElementById('trianglePointer');
let tx;
if (tcanvas){
  tx = tcanvas.getContext('2d');
}
if (tx) {
  drawTriangle();
}

function drawTriangle()
{
  tx.strokeStyle = '#000000';     // Set line colour.
  tx.fillStyle   = 'aqua';        // Set fill colour.
  tx.lineWidth   = 2;
  tx.beginPath();                 // Begin path.
  tx.moveTo(175, 20);             // Move to initial position.
  tx.lineTo(235, 20);             // Draw lines to make the shape.
  tx.lineTo(205, 80);
  tx.lineTo(176, 20);
  tx.stroke();                    // Complete the path by stroking (draw lines).
  tx.fill();                      // Then fill with colour.
}

var theWheel;

function addSegs(segCount) {
  theWheel = new Winwheel({
    'numSegments'  : 0,     // Specify number of segments.
    'outerRadius'  : 440,   // Set outer radius so wheel fits inside the background.
    'textFontSize' : 24,    // Set font size as desired.
    'textAlignment' : 'outer',
    'textDirection' : 'reversed',
    'animation' :           // Specify the animation to use.
    {
      'type'     : 'spinToStop',
      'duration' : 5,     // Duration in seconds.
      'spins'    : 3,     // Number of complete spins.
      'callbackFinished' : alertPrize
    }
  });

  var segColor;
  var fromIndex = Math.floor(Math.random() * segCount);

  for (i = fromIndex; i < fromIndex + segCount; i ++) {
    let newSegment = theWheel.addSegment();

    newSegment.text = segList[i % segCount];
    segColor = i % 2 ? "#38bfec" : "#f3a917";
    newSegment.fillStyle = segColor;
  }

  theWheel.rotationAngle = 360 / segCount / 2;
  theWheel.draw();
}

function betSelected(betLevel) {
  if (wheelSpinning) {
    return;
  }

  document.getElementById('bet1').className = "";
  document.getElementById('bet2').className = "";
  document.getElementById('bet3').className = "";

  if (betLevel == 1) {
    document.getElementById('bet1').className = "betActived";
    segNum = 14;
  }
  if (betLevel == 2) {
    document.getElementById('bet2').className = "betActived";
    segNum = 16;
  }
  if (betLevel == 3) {
    document.getElementById('bet3').className = "betActived";
    segNum = 18;
  }

  theWheel.clearCanvas();
  addSegs(segNum);
  newTenSpinsRules();
}

let wheelSpinning = false;

function start() {
  score = 0;
  document.getElementById('score').innerHTML = 'Score : ' + score;

  startSpin();
}

function startSpin(posValue = 360)
{
  if (wheelSpinning) {
    return;
  }
  theWheel.startAnimation(selectedSegments[spinCount] * 360 / segNum + 360 / segNum / 2);

  spinCount ++;
  if (spinCount > 9)
  {
    spinCount %= 10;
    newTenSpinsRules();
  }

  wheelSpinning = true;
}

let freeSpined;
let oldScore;
function alertPrize(indicatedSegment)
{
  wheelSpinning = false;
  theWheel.animation.spins = 5;
  theWheel.rotationAngle = 0;

  if (indicatedSegment.text == "Free Spins") {
    freespinNum += 3;
    freeSpined = true;
  }
  else {
    if (freeSpined == false) {
      score = 0;
    }

    score += +indicatedSegment.text;
  }

  document.getElementById('score').innerHTML = 'Score : ' + score;

  if (freespinNum > 0) {
    freespinNum --;
    startSpin();
  }
  else {
    freeSpined = false;
  }
}