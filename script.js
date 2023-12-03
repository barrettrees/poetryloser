import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.9.0/dist/transformers.min.js';
let sourceText = "What isn't saved (will be lost)"
let DIMENSION = 384;

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const goal =(await extractor(sourceText, {convert_to_tensor:'True', pooling: 'mean', normalize: true }))[0];
document.getElementById("titleText").innerHTML = sourceText;

main(sourceText, goal);

async function main(src, goal){
  let line = src;
for (let i= 0; i<sourceText.length; i++){
    line = await findWinner(line, goal)
}};

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
  document.getElementById("resultText").innerHTML += candidates[0]+"<br />";
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