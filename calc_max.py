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

max_scores = {'N': 0, 'B': 0, 'T': 0}
min_scores = {'N': 0, 'B': 0, 'T': 0}

for q in questions:
    max_scores['N'] += max(o.get('N', 0) for o in q)
    min_scores['N'] += min(o.get('N', 0) for o in q)
    max_scores['B'] += max(o.get('B', 0) for o in q)
    min_scores['B'] += min(o.get('B', 0) for o in q)
    max_scores['T'] += max(o.get('T', 0) for o in q)
    min_scores['T'] += min(o.get('T', 0) for o in q)

print(f"Max: {max_scores}")
print(f"Min: {min_scores}")
