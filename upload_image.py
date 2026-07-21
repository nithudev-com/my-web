import paramiko
import sys

host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'

try:
    print("Connecting to server...")
    transport = paramiko.Transport((host, port))
    transport.connect(username=username, password=password)
    
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    remote_path = 'domains/sextoyslovers.com/nodejs/public/remote-vibrator.png'
    local_path = 'public/remote-vibrator.png'
    
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)
    sftp.close()
    transport.close()
    print("Successfully uploaded image!")
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
