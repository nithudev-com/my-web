import paramiko

host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=username, password=password)

stdin, stdout, stderr = ssh.exec_command('grep -o "mix-blend-mode" domains/sextoyslovers.com/nodejs/.next/server/app/\(frontend\)/page.html | wc -l')
print("--- page.html mix-blend-mode count ---")
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
