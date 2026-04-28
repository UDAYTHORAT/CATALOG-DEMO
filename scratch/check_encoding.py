import os

file_path = r"d:\Product-catelog - Copy\src\app\s\[slug]\FunnelClient.tsx"

try:
    with open(file_path, 'rb') as f:
        data = f.read()
    
    print(f"File size: {len(data)} bytes")
    
    try:
        data.decode('utf-8')
        print("File is valid UTF-8 according to Python.")
    except UnicodeDecodeError as e:
        print(f"UnicodeDecodeError: {e}")
        print(f"Error at index {e.start}: {data[e.start:e.start+10]}")
        
        # Print context
        start = max(0, e.start - 50)
        end = min(len(data), e.end + 50)
        print(f"Context (bytes): {data[start:end]}")
        
except Exception as e:
    print(f"Error: {e}")
