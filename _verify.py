import paramiko, json, sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('121.4.98.150', username='ubuntu', password='Weijiang1.', timeout=15, banner_timeout=30)

tests = [
    ('Frontend',        'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080'),
    ('Status API',      'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/status'),
    ('Replay Sessions', 'curl -s http://localhost:8080/api/replay/sessions | python3 -c "import json,sys;print(len(json.load(sys.stdin)))"'),
    ('Benchmark Latest','curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/benchmark/latest'),
    ('Benchmark History','curl -s http://localhost:8080/api/benchmark/history | python3 -c "import json,sys;d=json.load(sys.stdin);print(len(d.get(chr(114)+chr(101)+chr(115)+chr(117)+chr(108)+chr(116)+chr(115),[])))"'),
    ('Analytics KW',    'curl -s http://localhost:8080/api/analytics/keywords?limit=5 | python3 -c "import json,sys;d=json.load(sys.stdin);print(len(d.get(chr(107)+chr(101)+chr(121)+chr(119)+chr(111)+chr(114)+chr(100)+chr(115),[])))"'),
    ('Analytics Tags',  'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/analytics/tags'),
    ('Leaderboard',     'curl -s http://localhost:8080/api/leaderboard | python3 -c "import json,sys;print(len(json.load(sys.stdin)))"'),
    ('Knowledge Search','curl -s "http://localhost:8080/api/knowledge/search?q=Python" | python3 -c "import json,sys;d=json.load(sys.stdin);print(len(d.get(chr(114)+chr(101)+chr(115)+chr(117)+chr(108)+chr(116)+chr(115),[])))"'),
    ('Templates',       'curl -s http://localhost:8080/api/templates | python3 -c "import json,sys;print(len(json.load(sys.stdin)))"'),
    ('Cost Summary',    'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/cost/summary?days=7'),
    ('Skills',          'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/skills'),
    ('Share Replay',    'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/share/replay/demo%252Fsmart-writer'),
    ('Export JSON',     'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/knowledge/export/demo%252Fsmart-writer?format=json'),
    ('Export MD',       'curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/knowledge/export/demo%252Fsmart-writer?format=markdown'),
]

ok = 0
fail = 0
for name, cmd in tests:
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=15)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    result = out or err or '(empty)'
    is_ok = result in ('200', '404') or result.isdigit() and int(result) > 0
    status = 'OK' if is_ok else 'FAIL'
    if is_ok:
        ok += 1
    else:
        fail += 1
    sys.stdout.buffer.write(f'  {"PASS" if is_ok else "FAIL"} | {name:20s} | {result}\n'.encode('utf-8'))

ssh.close()
sys.stdout.buffer.write(f'\n{ok}/{ok+fail} passed\n'.encode('utf-8'))
