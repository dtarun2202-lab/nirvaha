with open(r'c:\Users\PRIYA\OneDrive\Desktop\nirvaha\frontend\src\pages\LearningPathPage.tsx', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8')

# Check for any remaining garbled chars
import re
# Look for sequences that look like mojibake (latin-1 range chars followed by more)
garbled = re.findall(r'[\x80-\xff\u0100-\u017f\u2013\u2014\u2018-\u201f\u20ac\u2022\u2026]+', text)
unique_garbled = list(set(garbled))
print(f'Potentially garbled sequences: {len(unique_garbled)}')
for g in unique_garbled[:20]:
    print(f'  {repr(g)} = {g}')

print()
# Show key sections
for section in ['Learning Streak', 'Viktor E. Frankl', 'Your Learning Path', 'Ready to Begin']:
    idx = text.find(section)
    if idx >= 0:
        print(f'{section}: {repr(text[idx-5:idx+len(section)+5])}')
