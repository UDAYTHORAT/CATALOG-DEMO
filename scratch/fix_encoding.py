import os

file_path = r"d:\Product-catelog - Copy\src\app\s\[slug]\FunnelClient.tsx"

with open(file_path, 'rb') as f:
    data = f.read()

# Try to decode with 'ignore' to see what the text looks like
decoded_text = data.decode('utf-8', errors='ignore')

# Alternatively, we can try to find the specific bad bytes and replace them.
# The error was at 546: b'\xe2\x94interfac'
# \xe2\x94 is the start of a 3-byte sequence for box drawing characters.
# Let's replace any invalid utf-8 sequences with a space or just remove them.
# A simple way to "fix" it is to decode with ignore and re-encode.
# However, that might lose other non-ascii characters if they were valid but mis-parsed.
# But 'ignore' only drops the INVALID ones.

fixed_data = decoded_text.encode('utf-8')

# Let's check where the bad bytes were to be sure we are doing the right thing.
print(f"Original size: {len(data)}")
print(f"Fixed size: {len(fixed_data)}")

with open(file_path, 'wb') as f:
    f.write(fixed_data)

print("File has been 'cleaned' of invalid UTF-8 sequences.")
