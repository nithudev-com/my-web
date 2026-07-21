import pexpect
import sys

def run_ssh_command(host, port, user, password, command):
    ssh_newkey = 'Are you sure you want to continue connecting'
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no -p {port} {user}@{host} "{command}"', encoding='utf-8')
    
    try:
        i = child.expect([ssh_newkey, '(?i)assword:', pexpect.EOF])
        if i == 0:
            child.sendline('yes')
            child.expect('(?i)assword:')
            child.sendline(password)
        elif i == 1:
            child.sendline(password)
        
        child.expect(pexpect.EOF)
        print(child.before)
    except Exception as e:
        print(f"Error: {e}")

run_ssh_command('82.29.157.55', '65002', 'u549656247', 'Sthvika@2020', 'ls -la')
