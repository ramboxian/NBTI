import random
import statistics
import json
import re

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

ns, bs, ts = [], [], []
for _ in range(10000):
    scores = {"N":0, "B":0, "T":0}
    for q in questions:
        choice = random.choice(q)
        for k,v in choice.items():
            scores[k] += v
    ns.append(scores["N"])
    bs.append(scores["B"])
    ts.append(scores["T"])

print(f"Median N: {statistics.median(ns)}")
print(f"Median B: {statistics.median(bs)}")
print(f"Median T: {statistics.median(ts)}")
