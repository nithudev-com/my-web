import pexpect
import sys

def run_ssh_cmd(cmd):
    password = "Sathvika@2020"
    child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no -p 65002 u549656247@82.29.157.55 "{cmd}"', encoding='utf-8')
    try:
        index = child.expect(['password:', pexpect.EOF, pexpect.TIMEOUT], timeout=10)
        if index == 0:
            child.sendline(password)
            child.expect(pexpect.EOF, timeout=120)
            print(child.before)
        elif index == 1:
            print(child.before)
        else:
            print("Timeout!")
            print(child.before)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    run_ssh_cmd(sys.argv[1])
