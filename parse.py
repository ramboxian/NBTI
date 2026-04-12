import re
import json

with open('/Users/bytedance/Downloads/NBTI_v3_题目终版.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the section with questions
# It starts from "### Q1." and ends before "## 维度计分速查表"
match = re.search(r'(### Q1\..*?)## 维度计分速查表', content, re.DOTALL)
if not match:
    print("Questions section not found.")
    exit()

qs_text = match.group(1)
questions_raw = re.split(r'### Q\d+\.', qs_text)
questions = []

for q_raw in questions_raw:
    if not q_raw.strip():
        continue
    
    lines = [l.strip() for l in q_raw.strip().split('\n') if l.strip()]
    if not lines:
        continue
    
    title = lines[0]
    options = []
    
    current_option = None
    for line in lines[1:]:
        if line.startswith('---'):
            continue
        
        opt_match = re.match(r'^([A-E])\.\s*(.*)', line)
        if opt_match:
            if current_option:
                options.append(current_option)
            current_option = {
                'id': opt_match.group(1),
                'text': opt_match.group(2),
                'scores': {}
            }
        elif line.startswith('`→') and current_option:
            scores_str = line.replace('`→', '').replace('`', '').strip()
            # Parse T+1, N-1 etc.
            score_parts = [s.strip() for s in scores_str.split(',')]
            for sp in score_parts:
                if sp:
                    dim = sp[0]
                    val = int(sp[1:])
                    current_option['scores'][dim] = val
            options.append(current_option)
            current_option = None
            
    if current_option:
        options.append(current_option)
        
    questions.append({
        'title': title,
        'options': options
    })

ts_content = "export interface Option {\n  id: string;\n  text: string;\n  scores: Record<string, number>;\n}\n\nexport interface Question {\n  title: string;\n  options: Option[];\n}\n\nexport const questions: Question[] = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"

with open('src/data/questions.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)
    
print("Successfully generated src/data/questions.ts")
