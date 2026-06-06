import re

with open(r'c:\Users\PRIYA\OneDrive\Desktop\nirvaha\frontend\src\pages\LearningPathPage.tsx', 'rb') as f:
    raw = f.read()

has_bom = raw[:3] == b'\xef\xbb\xbf'
if has_bom:
    raw = raw[3:]

# Decode the file as UTF-8 to get the garbled unicode string
text = raw.decode('utf-8')

# The garbled chars are sequences of latin-1/cp1252 chars that were saved as UTF-8.
# Fix: for each char, try to encode as cp1252 to recover original bytes, then decode as UTF-8.
# We do this chunk by chunk - find runs of "mojibake" chars and fix them.

def fix_mojibake(text):
    result = []
    i = 0
    while i < len(text):
        c = text[i]
        code = ord(c)
        # Characters in the range 0x80-0xFF are likely mojibake
        # (they were originally UTF-8 bytes misread as cp1252/latin-1)
        if 0x80 <= code <= 0xFF or code in (0x201C, 0x201D, 0x2018, 0x2019, 0x20AC, 0x2026, 0x2013, 0x2014, 0x0152, 0x0153, 0x0160, 0x0161, 0x0178, 0x017E, 0x017D, 0x0192, 0x02C6, 0x02DC):
            # Collect a run of potentially mojibake chars
            run = []
            j = i
            while j < len(text):
                cc = ord(text[j])
                if 0x80 <= cc <= 0xFF or cc in (0x201C, 0x201D, 0x2018, 0x2019, 0x20AC, 0x2026, 0x2013, 0x2014, 0x0152, 0x0153, 0x0160, 0x0161, 0x0178, 0x017E, 0x017D, 0x0192, 0x02C6, 0x02DC, 0x00A0):
                    run.append(text[j])
                    j += 1
                else:
                    break
            run_str = ''.join(run)
            try:
                # Try to encode as cp1252 and decode as utf-8
                fixed_bytes = run_str.encode('cp1252')
                fixed_str = fixed_bytes.decode('utf-8')
                result.append(fixed_str)
            except (UnicodeEncodeError, UnicodeDecodeError):
                # If that fails, try latin-1
                try:
                    fixed_bytes = run_str.encode('latin-1')
                    fixed_str = fixed_bytes.decode('utf-8')
                    result.append(fixed_str)
                except:
                    # Keep as-is
                    result.append(run_str)
            i = j
        else:
            result.append(c)
            i += 1
    return ''.join(result)

fixed = fix_mojibake(text)

# Verify the fix
idx = fixed.find('Floating concept')
print('Fixed emojis:')
print(fixed[idx:idx+300])
print()
idx2 = fixed.find('constants')
print('Fixed box drawing:')
print(fixed[idx2:idx2+100])
print()

# Check for any remaining garbled chars
remaining = [(i, c, hex(ord(c))) for i, c in enumerate(fixed) if ord(c) > 0x7F and ord(c) not in range(0x2500, 0x2600) and ord(c) not in [0x1F9E0, 0x1F30A, 0x1F33F, 0x2728, 0x1F3C6, 0x2190, 0x2192, 0x2022]]
print(f'Remaining non-ASCII chars: {len(remaining)}')
for pos, c, h in remaining[:20]:
    ctx = fixed[max(0,pos-10):pos+10]
    print(f'  pos {pos}: {repr(c)} {h} | context: {repr(ctx)}')

# Save the fixed file
with open(r'c:\Users\PRIYA\OneDrive\Desktop\nirvaha\frontend\src\pages\LearningPathPage.tsx', 'wb') as f:
    f.write(fixed.encode('utf-8'))

print('\nFile saved successfully!')
