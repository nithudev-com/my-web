import paramiko

host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=username, password=password)

# Check running node processes
stdin, stdout, stderr = ssh.exec_command('grep -o "object-fit:contain" domains/sextoyslovers.com/nodejs/.next/server/app/\(frontend\)/page.js | head -n 5')
print("--- page.js check ---")
print(stdout.read().decode())
print(stderr.read().decode())

ssh.close()
