import random
import json
import re
from collections import Counter

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

questions = []
for q_match in re.finditer(r'options":\s*\[(.*?)\]', content, re.DOTALL):
    options_str = q_match.group(1)
    q_options = []
    for o_match in re.finditer(r'"scores":\s*\{(.*?)\}', options_str, re.DOTALL):
        scores_str = o_match.group(1)
        scores = {}
        for s_match in re.finditer(r'"([NBT])":\s*(-?\d+)', scores_str):
            scores[s_match.group(1)] = int(s_match.group(2))
        q_options.append(scores)
    questions.append(q_options)

def eval_scores(scores, thresholds=(0,0,0)):
    tn, tb, tt = thresholds
    return "{}{}{}".format(
        "N+" if scores.get("N",0) >= tn else "N-",
        "B+" if scores.get("B",0) >= tb else "B-",
        "T+" if scores.get("T",0) >= tt else "T-"
    )

results_0 = Counter()
results_4 = Counter()
for _ in range(10000):
    scores = {"N":0, "B":0, "T":0}
    for q in questions:
        choice = random.choice(q)
        for k,v in choice.items():
            scores[k] += v
    results_0[eval_scores(scores)] += 1
    results_4[eval_scores(scores, (4,-2,4))] += 1

print("Threshold 0,0,0:", results_0.most_common())
print("Threshold 4,-2,4:", results_4.most_common())
