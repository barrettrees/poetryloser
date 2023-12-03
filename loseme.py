from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer('all-MiniLM-L6-v2')
source_text = "What isn't saved (will be lost)"
source_text_embedding = model.encode(source_text, convert_to_tensor=True)
import random

def remove_nth(list_, n):
    return list_[:n] + list_[n+1:]

def lose(src):
	return ([remove_nth(src, i) for i in range(len(src))])

def score(permutations):
	scored_list = []
	embeddings = model.encode(permutations, convert_to_tensor=True)
	cosine_scores = util.cos_sim(embeddings, source_text_embedding)
	listified_scores = cosine_scores.tolist()
	scored_list = list(zip(listified_scores,permutations))
	# for variation in permutations:
	# 	score = random.random()
	# 	scored_list.append((score, variation))
	scored_list.sort()
	scored_list.reverse()
	winner = scored_list[0][1]
	return(winner)

def main(source_text):
	print(source_text)
	permutations = lose(source_text)
	new = score(permutations)
	print(new)
	while(len(new)>0):
		permutations = lose(new)
		new = score(permutations)
		print(new)

main(source_text)