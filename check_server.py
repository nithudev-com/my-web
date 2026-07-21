import paramiko

host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=username, password=password)

# Check running node processes
stdin, stdout, stderr = ssh.exec_command('ps aux | grep node')
print("--- ps aux | grep node ---")
print(stdout.read().decode())

# Check for pm2
stdin, stdout, stderr = ssh.exec_command('pm2 status')
pm2_status = stdout.read().decode()
if pm2_status:
    print("--- pm2 status ---")
    print(pm2_status)

ssh.close()
