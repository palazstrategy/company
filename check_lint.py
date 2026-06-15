import os
import subprocess
import json

def find_lint_error():
    print("Running ESLint...")
    result = subprocess.run(['npx', 'eslint', 'src', '--format', 'json'], capture_output=True, text=True, shell=True)
    try:
        # ESLint might output some noise before/after JSON
        start = result.stdout.find('[')
        end = result.stdout.rfind(']') + 1
        if start == -1 or end == 0:
            print("No JSON found in output")
            print(result.stdout)
            return

        data = json.loads(result.stdout[start:end])
        found = False
        for file_info in data:
            if file_info.get('messages'):
                found = True
                print(f"\nFILE: {file_info['filePath']}")
                for msg in file_info['messages']:
                    print(f"  {msg['line']}:{msg['column']} - {msg.get('ruleId', 'no-rule')} - {msg['message']}")
        if not found:
            print("No lint errors found in src.")
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        print("Raw output start:", result.stdout[:500])

if __name__ == "__main__":
    find_lint_error()
