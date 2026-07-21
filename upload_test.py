import paramiko
host = '82.29.157.55'
port = 65002
username = 'u549656247'
password = 'Sathvika@2020'
transport = paramiko.Transport((host, port))
transport.connect(username=username, password=password)
sftp = paramiko.SFTPClient.from_transport(transport)
sftp.put('test_hostinger.js', 'domains/sextoyslovers.com/nodejs/test_hostinger.js')
sftp.close()
