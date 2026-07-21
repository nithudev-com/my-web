import paramiko
host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'
try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, port=port, username=username, password=password)
    
    stdin, stdout, stderr = ssh.exec_command('find domains/sextoyslovers.com/nodejs -name "*.log" 2>/dev/null')
    print("Log files:")
    print(stdout.read().decode())
    
    ssh.close()
except Exception as e:
    print(f"Error: {e}")
