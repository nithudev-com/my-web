import paramiko

host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=username, password=password)

# Kill all node processes for this user
stdin, stdout, stderr = ssh.exec_command('pkill -u u549656247 node')
print("--- pkill output ---")
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()
