import paramiko
import os

host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'

# Read local server.js
with open('.next/standalone/Documents/next-ecommerce-isr-starter/server.js', 'r') as f:
    local_server = f.read()

# Prepend the DATABASE_URL
database_url_line = 'process.env.DATABASE_URL = "postgresql://postgres.bxltfwydeszutzkovviw:Sathvika%402020@15.156.114.158:6543/postgres?pgbouncer=true&connection_limit=2&pool_timeout=0";\n\n'
new_server = database_url_line + local_server

# Write back to a temp file
with open('server_patched.js', 'w') as f:
    f.write(new_server)

# Upload to server
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=username, password=password)

sftp = ssh.open_sftp()
sftp.put('server_patched.js', 'domains/sextoyslovers.com/nodejs/server.js')
sftp.close()

# Restart the Node server
ssh.exec_command('pkill -u u549656247 node')
ssh.exec_command('touch domains/sextoyslovers.com/nodejs/tmp/restart.txt')
ssh.close()
print("Server patched and restarted successfully!")
