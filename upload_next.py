import paramiko
import sys
import os

host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'

try:
    print("Compressing .next...")
    os.system("tar -czf .next.tar.gz .next/")

    print("Connecting to server...")
    transport = paramiko.Transport((host, port))
    transport.connect(username=username, password=password)
    
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    remote_path = 'domains/sextoyslovers.com/nodejs/.next.tar.gz'
    local_path = '.next.tar.gz'
    
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)
    sftp.close()

    print("Extracting on server...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, port=port, username=username, password=password)
    
    stdin, stdout, stderr = ssh.exec_command('cd domains/sextoyslovers.com/nodejs && tar -xzf .next.tar.gz && rm .next.tar.gz')
    exit_status = stdout.channel.recv_exit_status()
    print("Extract stdout:", stdout.read().decode())
    print("Extract stderr:", stderr.read().decode())
    
    if exit_status == 0:
        print("Successfully deployed!")
        # Touch a file to potentially restart the node app if it uses passenger/litespeed
        ssh.exec_command('touch domains/sextoyslovers.com/nodejs/tmp/restart.txt')
    else:
        print(f"Failed with exit status: {exit_status}")
    
    ssh.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
