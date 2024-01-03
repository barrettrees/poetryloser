import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0/dist/transformers.min.js';
let DIMENSION = 384;
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
document.getElementById ("submitButton").addEventListener ("click", submission);
document.getElementById ("aboutButton").addEventListener ("click", toggleAbout);
document.getElementById ("randomButton").addEventListener ("click", randomize);
document.getElementById ("resetButton").addEventListener ("click", resetAll);
document.getElementById ("darkMode").addEventListener ("click", darkmode);
document.getElementById ("showScoring").addEventListener ("click", toggleScoring);


let finished = 'False';
let submitted = 'False';
let colors = ['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'];
let currentLine = '';
let fulltext = '';
let textColorMask =[];
var goal =[];



let textColorMaskDisplay =[];

let candidate = ""
let innerIndex = 0;
let bestScore = NaN;
let bestCandiateIndex = -1;
let currentChild = document.getElementById("resultText").lastChild;
let candidates = [];
let scores = {};
let score = NaN;
let bestIndex = 0;
let originalIndex = {};
let currentProgress = 0;
let date1 = new Date();
let timediff = 0;

document.body.onload = darkmode()
document.body.onload = toggleScoring()

// setInterval(async function(){
//   if (submitted=='True'){
//     if (finished=='False'){
//       addDiv(currentLine)
//       currentLine = await findWinner(currentLine, goal)
//       if (currentLine.length==0){finished='True'}
//     }}
//   },2)

setInterval(async function(){
  if (submitted=='True'){
    if (finished=='False'){
      candidate = candidates[innerIndex]
      const candidateEmbedding = await getEmbedding(candidate);
      currentProgress+=1;
      score = cosineSimilarity(candidateEmbedding.tolist(),goal.tolist());
      scores[candidate] = score;
      originalIndex[candidate] = innerIndex;
      const percentageComplete = (currentProgress/numberSteps(fulltext.length))*100
      var scoreDisplay = "<div id=\"myProgress\"><div id=\"myBar\"></div></div>"
      timediff = (new Date()- date1)/1000
      scoreDisplay+="<div class=score> Completion: "+percentageComplete.toFixed(2)+"% Time: "+timediff.toFixed(3)+"secs<br> Score: "+score.toFixed(2)+" Variation:"+candidate+"</div>"
      document.getElementById('scoreZone').innerHTML = scoreDisplay
      document.getElementById("myBar").style.width = percentageComplete+"%"
      // document.getElementById("myProgress").textContent = candidate 
      innerIndex+=1;
      if (innerIndex==candidates.length)
        {
          innerIndex = 0;
          if (document.getElementById("waluigiMode").checked==false)
            {candidates.sort((d2,d1)=>{return scores[d1]-scores[d2]});}
          else
            {candidates.sort((d2,d1)=>{return scores[d2]-scores[d1]});}
          candidate = candidates[0];
          bestIndex = originalIndex[candidate]
          textColorMask.splice(bestIndex,1)
          addDiv(candidate)
          if (candidate.length==1){
            finished = 'True';
            console.log("\""+fulltext+"\" ("+fulltext.length+" characters) processed in "+timediff.toFixed(3)+" seconds.")
            scoreDisplay=""
            document.getElementById('scoreZone').innerHTML = scoreDisplay
          }
          candidates = removeNth(candidate)
      //     bestCandidate = candidates[0]

      //     textColorMask.splice(bestIndex,1)
      //     addDiv(bestCandidate)
      //     candidates = removeNth(bestCandidate)
      //     innerIndex=0
      //     bestScore = NaN
      //     console.log('line finished')
      //   }
      // if (candidates.length =='1')
      //   {
      //     console.log('finished submission')
      //     finished='True'
      //     firstTime = 'True'
      //     console.log(candidates)
      //     addDiv(candidates[0])
        }
    }}
  },2)



// setInterval(async function(){
//   if (true){
//   if (submitted=='True'){
//     if (finished=='False'){
//       if (document.getElementById("resultText").hasChildNodes()==false) 
//         {addDiv(currentLine)}
//       else{
//         currentChild = document.getElementById("resultText").lastChild
//         hackerCandidate = hackerCandidates[hackerIndex]
//         const hackerCandidateEmbedding = await getEmbedding(hackerCandidate);
//         let hackerScore = cosineSimilarity(hackerCandidateEmbedding.tolist(),goal.tolist());
//         if (isNaN(hackerBestScore)){
//           hackerBestScore = hackerScore
//         }
//         textColorMaskDisplay = textColorMask.slice()
//         textColorMaskDisplay.splice(hackerIndex,1)
//         let hackerCandidateDisplay =""
//         let s = 0;
//         for (s in hackerCandidate)
//         {
//           hackerCandidateDisplay+="<span style='color:"+textColorMask[s]+"'>"+hackerCandidate[s]+"</span>"
//           s+=1
//         }
//         if(document.getElementById("hackerMode").checked)
//         {
//           currentChild.innerHTML = "<div class=score> "+hackerScore.toFixed(2)+": "+hackerCandidateDisplay}
//         else{
//           currentChild.innerHTML = hackerCandidateDisplay}

//         if (document.getElementById("waluigiMode").checked==false){
//         if (hackerScore>hackerBestScore)
//           {
//             hackerBestIndex = hackerIndex;
//             hackerBestScore = hackerScore;
//             hackerBestCandidate = hackerCandidate;
//           }}
//           else{        if (hackerScore<hackerBestScore)
//           {
//             hackerBestIndex = hackerIndex;
//             hackerBestScore = hackerScore;
//             hackerBestCandidate = hackerCandidate;
//           }

//           }
//         // console.log(hackerCandidate, hackerIndex)
//         if (hackerIndex == hackerCandidates.length-1)
//         {
//           // console.log('round over')
//           // console.log (hackerBestCandidate)
//           // addDiv(hackerBestCandidate)
//           hackerCandidates = removeNth(hackerBestCandidate);
//           hackerIndex = 0;
//           hackerBestScore = 0;
//           textColorMask.splice(hackerBestIndex,1);
          
//           let hackerCandidateDisplay =""
//           let s = 0;
//           for (s in hackerBestCandidate)
//           {
//           hackerCandidateDisplay+="<span style='color:"+textColorMask[s]+"'>"+hackerBestCandidate[s]+"</span>"
//           s+=1}
//           currentChild.innerHTML = hackerCandidateDisplay
//           // console.log(hackerCandidateDisplay)

//           addDiv("")
//           // addDiv(hackerBestCandidate)
//           hackerCandidate = ""
//           hackerBestCandidate = ""
//           // console.log(currentLine)
//         }
//         else
//         {
//         hackerIndex+=1 
//         }
//       }
//       // currentLine = currentLine.slice(0,currentLine.length-1);
//       // console.log(currentLine)
//       // currentLine = await findWinner(currentLine, goal)
//       if (hackerBestCandidate.length==1){finished='True'}
//     }}}
//   },2)




let sampleText = ["The propeller's spinning blades held acquaintance with the waves", 
  "Do you believe what you're saying? Yeah right now but not that often!",
  "The essence of a lossy compression scheme is choosing what matters least to forget",
  "Language is the liquid that we're all dissolved in",
  "The horse raced past the barn fell",
  "The complex houses married and single soldiers and their families.",
  "The old man the boat."
  ]
let samplePalettes =[
['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'],
['#f7fcfd','#e0ecf4','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#810f7c','#4d004b'],
['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a'],
['#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636']
]


function randomize(){
  if (submitted == 'False'){
  
  let oldcolors = colors
  let oldtext = document.getElementById("textEntry").value
  colors = samplePalettes[Math.floor(Math.random() * samplePalettes.length)]
  document.getElementById("textEntry").value = sampleText[Math.floor(Math.random() * sampleText.length)]
  if (oldtext == document.getElementById("textEntry").value){
    if (oldcolors == colors){
      randomize()
    }
  }
  else
  {submission()}
}
else
{
  resetAll()
  randomize()
}
}

function toggleAbout(){
  var about = document.getElementById("aboutText")
  if (about.style.display == "none")
  {
    about.style.display = ""

  }
  else
    about.style.display = "none"
}

function toggleScoring(){
  var scoring = document.getElementById("scoreZone")
  if (document.getElementById("showScoring").checked==true)
    {scoring.style.display = "none"}
  else
  scoring.style.display = ""
}

async function submission(){

  if (submitted=='False'){
    submitted='True'
    if (document.getElementById("textEntry").value=='')
    {document.getElementById("textEntry").value = "What isn't saved (will be lost)";}
    currentLine = document.getElementById("textEntry").value;
    fulltext = currentLine;
    candidates = removeNth(currentLine)
    textColorMask= colorize(fulltext);
    goal =(await extractor(currentLine, {convert_to_tensor:'True', pooling: 'mean', normalize: true }))[0];
    date1 = new Date();
    // console.log(currentLine);
    // document.getElementById('submitButton').value= "Reset"
  }
  else {
    currentLine = document.getElementById("textEntry").value;
    resetAll()
    document.getElementById("textEntry").value = currentLine;
    submission()
  };
      
}

function colorize (fulltext){
let textColorArray =[]
let colorIndex=0;
let i = 0;
 for (i in fulltext){
  textColorArray[i] = colors[colorIndex]
  if (fulltext[i]==' '){colorIndex +=1};
  if (colorIndex==colors.length){colorIndex=0};
} return(textColorArray);
}

  



function resetAll(){
  finished = 'False';
  submitted = 'False';
  document.getElementById('submitButton').value= "Submit";
  document.getElementById("textEntry").value='';
  candidates = [];
  candidate = ""
  innerIndex = 0;
  currentProgress =0;
  // hackerBestScore = NaN;
  currentChild = document.getElementById("resultText").lastChild;
  // hackerBestCandidate= "";
  // hackerBestIndex = -1;
  textColorMaskDisplay =[];
  while (resultText.hasChildNodes()){
    resultText.removeChild(resultText.firstChild)
  }
}

async function getEmbedding(src){
  let result = (await extractor(src, {convert_to_tensor:'True', pooling: 'mean', normalize: true }))[0];
  return result;
}

async function findWinner(src, goal){
  let candidates = removeNth(src);
  let scores = {}
  let order = {}
  for (let i =0; i < candidates.length; i++){
    let candidate = candidates[i];
    const candidateEmbedding = await getEmbedding(candidate);
    let score = cosineSimilarity(candidateEmbedding.tolist(),goal.tolist());
    scores[candidate] = score;
    order[candidate]=i;
  }
  console.log("scores: ", scores)
  if (document.getElementById("waluigiMode").checked==false)
  {candidates.sort((d2,d1)=>{return scores[d1]-scores[d2]});}
else
  {candidates.sort((d2,d1)=>{return scores[d2]-scores[d1]});}

  console.log("winner index:", order[candidates[0]]);
  textColorMask.splice(order[candidates[0]],1);
  // document.getElementById("resultText").innerHTML += candidates[0]+"<br />";
  return candidates[0]

}

function removeNth (src){
  let removals = [];
  let i = 0;
  for (let i=0; i<src.length; i++){
    removals.push(src.slice(0,i).concat(src.slice(i+1,src.length)))
  };
  return removals;
}

function cosineSimilarity(vectorA, vectorB) {
    let dot_product = dotProduct((vectorA), (vectorB));
    let magnitude_product = magnitude(vectorA) * magnitude(vectorB);
    return dot_product / magnitude_product;
}

function dotProduct(vectorA, vectorB) {
    let dot_product = 0;
    for(let comp = 0; comp < DIMENSION; comp++) {
        dot_product += vectorA[comp] * vectorB[comp];
    }
    return dot_product;
}

function magnitude(vector) {
    return Math.sqrt(dotProduct(vector, vector));
}

function addDiv(text) {
    var objTo = document.getElementById('resultText')
    var divtest = document.createElement("div");
    var coloredText = "";
    let s = 0;
    for (s in text)
    {
      coloredText+="<span style='color:"+textColorMask[s]+"'>"+text[s]+"</span>"
      s+=1
    }
    divtest.innerHTML = coloredText;
    objTo.appendChild(divtest)
}

function colorLinks(hex)
{
    var links = document.getElementsByTagName("a");
    for(var i=0;i<links.length;i++)
    {
        if(links[i].href)
        {
            links[i].style.color = hex;  
        }
    }  
}

function darkmode(){
  if (document.getElementById("darkMode").checked==false)
    {
      // console.log("darkmode disabled")
      colors = ['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000']
      document.body.style.backgroundColor = "#99d8c9";
      document.body.style.color ="black";
      colorLinks("black");

}
  else
    {
      // console.log("darkmode enabled")
      colors = ['#f7fcf5','#e5f5e0','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b']
      document.body.style.backgroundColor = "black";
      document.body.style.color ="white";
      colorLinks("white");
}
}

function numberSteps(x) {
       if(x == 0) {
           return undefined;
       }
       if(x < 0 ) {
           return undefined;
       }
       for(var i = x; --i; ) {
           x += i;
       }
       x-=1
       return x;
}