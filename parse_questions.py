import json
import re

with open('/Users/bytedance/Downloads/NBTI_计分系统升级方案_v4.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JSON
json_match = re.search(r'```json\n(.*?)\n```', content, re.DOTALL)
if not json_match:
    print("JSON not found")
    exit(1)

data = json.loads(json_match.group(1))
questions_data = data['questions']

# Extract texts from Section 4
text_section = content.split('## 四、每道题的选项文案（完整版）')[1].split('## 五、新版判定逻辑')[0]

questions = []
for q in questions_data:
    q_id = q['id']
    group = q['group']
    options_scores = q['options']
    
    # Find the title
    title_match = re.search(fr'### Q{q_id}\. (.*?)\n', text_section)
    title = title_match.group(1).strip() if title_match else ""
    
    options = []
    for opt_id in ['A', 'B', 'C', 'D']:
        if opt_id not in options_scores:
            continue
        # Find the text
        # Format: | **A** | 掏出笔记本开始记要点... | N+1, B+1 |
        opt_match = re.search(fr'\|\s*\*\*{opt_id}\*\*\s*\|\s*(.*?)\s*\|', text_section)
        # But wait, there are multiple questions, so we need to scope to the current question
        q_block = text_section.split(f'### Q{q_id}.')[1].split('### Q')[0] if f'### Q{q_id}.' in text_section else ""
        opt_match = re.search(fr'\|\s*\*\*{opt_id}\*\*\s*\|\s*(.*?)\s*\|', q_block)
        text = opt_match.group(1).strip() if opt_match else ""
        
        scores_arr = options_scores[opt_id]
        scores_dict = {}
        for s in scores_arr:
            dim = s[0]
            val = int(s[1:])
            scores_dict[dim] = val
            
        options.append({
            "id": opt_id,
            "text": text,
            "scores": scores_dict
        })
        
    questions.append({
        "title": title,
        "options": options
    })

with open('src/data/questions.ts', 'w', encoding='utf-8') as f:
    f.write('export interface Option {\n')
    f.write('  id: string;\n')
    f.write('  text: string;\n')
    f.write('  scores: Record<string, number>;\n')
    f.write('}\n\n')
    f.write('export interface Question {\n')
    f.write('  title: string;\n')
    f.write('  options: Option[];\n')
    f.write('}\n\n')
    f.write('export const questions: Question[] = ')
    f.write(json.dumps(questions, ensure_ascii=False, indent=2))
    f.write(';\n')
print("questions.ts generated")
