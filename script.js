import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0/dist/transformers.min.js';
let DIMENSION = 384;
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
document.getElementById ("submitButton").addEventListener ("click", sumbission);
document.getElementById ("resetButton").addEventListener ("click", resetAll);
let finished = 'False';
let submitted = 'False';
let currentLine = '';
var goal =[];

async function sumbission(){
  if (document.getElementById("textEntry").value=='')
  {document.getElementById("textEntry").value = "What isn't saved (will be lost)";}
  currentLine = document.getElementById("textEntry").value;
  goal =(await extractor(currentLine, {convert_to_tensor:'True', pooling: 'mean', normalize: true }))[0];
  // console.log(currentLine);
  if (submitted=='True'){submitted='False'};
  if (submitted=='False'){submitted='True'};
}

setInterval(async function(){
  if (submitted=='True'){
    if (finished=='False'){
      addDiv(currentLine)
      // currentLine = currentLine.slice(0,currentLine.length-1);
      currentLine = await findWinner(currentLine, goal)
      if (currentLine.length==0){finished='True'}
    }}
  },200)

function resetAll(){
  finished = 'False';
  submitted = 'False';
  document.getElementById("textEntry").value='';
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
  for (let i =0; i < candidates.length; i++){
    let candidate = candidates[i];
    const candidateEmbedding = await getEmbedding(candidate);
    let score = cosineSimilarity(candidateEmbedding.tolist(),goal.tolist());
    scores[candidate] = score;
  }
  console.log("scores: ", scores)
  candidates.sort((d2,d1)=>{return scores[d1]-scores[d2]});
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
    divtest.innerHTML = currentLine;
    objTo.appendChild(divtest)
}