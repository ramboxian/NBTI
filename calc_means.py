import json
import re

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

# extract the json part
json_str = content[content.find('['):content.rfind(']')+1]
# fix syntax to make it valid json if needed, or just use a simple regex
# Actually, since it's typescript, it might have unquoted keys or trailing commas.
# Let's just parse it using python regex.
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

means = {'N': 0, 'B': 0, 'T': 0}
for q in questions:
    n_sum = sum(o.get('N', 0) for o in q)
    b_sum = sum(o.get('B', 0) for o in q)
    t_sum = sum(o.get('T', 0) for o in q)
    means['N'] += n_sum / len(q)
    means['B'] += b_sum / len(q)
    means['T'] += t_sum / len(q)

print(f"Means: {means}")
