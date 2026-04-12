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

def eval_scores(scores, thresholds=(0,0,0)):
    tn, tb, tt = thresholds
    return "{}{}{}".format(
        "N+" if scores.get("N",0) >= tn else "N-",
        "B+" if scores.get("B",0) >= tb else "B-",
        "T+" if scores.get("T",0) >= tt else "T-"
    )

print("--- Threshold 0,0,0 ---")
for choice in range(4):
    scores = {"N":0, "B":0, "T":0}
    for q in questions:
        if choice < len(q):
            for k,v in q[choice].items():
                scores[k] += v
        else:
            for k,v in q[-1].items():
                scores[k] += v
    print(f"Always {chr(65+choice)}: {scores} -> {eval_scores(scores)}")

print("\n--- Threshold 4,-2,4 ---")
for choice in range(4):
    scores = {"N":0, "B":0, "T":0}
    for q in questions:
        if choice < len(q):
            for k,v in q[choice].items():
                scores[k] += v
        else:
            for k,v in q[-1].items():
                scores[k] += v
    print(f"Always {chr(65+choice)}: {scores} -> {eval_scores(scores, (4,-2,4))}")
