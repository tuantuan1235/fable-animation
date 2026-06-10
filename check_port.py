import paramiko
import sys
import time

sys.stdout.reconfigure(line_buffering=True)

HOST = '47.93.213.140'
USER = 'root'
PEM_KEY = r'C:\Users\User\Downloads\trae.pem'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
key = paramiko.RSAKey.from_private_key_file(PEM_KEY)
client.connect(HOST, port=22, username=USER, pkey=key, timeout=15)
print(">>> 已连接")

def run(cmd, timeout=30):
    print(f"\n  $ {cmd}")
    transport = client.get_transport()
    channel = transport.open_session()
    channel.settimeout(timeout)
    channel.exec_command(cmd)
    while True:
        if channel.recv_ready():
            data = channel.recv(8192)
            if not data:
                break
            print(data.decode('utf-8', errors='replace'), end='', flush=True)
        if channel.exit_status_ready():
            while channel.recv_ready():
                data = channel.recv(8192)
                print(data.decode('utf-8', errors='replace'), end='', flush=True)
            break
        time.sleep(0.1)
    exit_code = channel.recv_exit_status()
    channel.close()
    print()
    return exit_code

print(">>> 检查阿里云 CLI...")
run("which aliyun 2>/dev/null && aliyun version || echo 'aliyun CLI not found'")

print("\n>>> 检查本地防火墙...")
run("systemctl status firewalld 2>/dev/null | head -3 || echo 'no firewalld'")
run("iptables -L INPUT -n --line-numbers 2>/dev/null | head -20 || echo 'no iptables'")

print("\n>>> 检查当前安全组（通过 metadata）...")
run("curl -s --connect-timeout 3 http://100.100.100.200/latest/meta-data/instance-id 2>/dev/null || echo 'metadata not available'")
run("curl -s --connect-timeout 3 http://100.100.100.200/latest/meta-data/region-id 2>/dev/null || echo 'region not available'")

print("\n>>> 检查 8088 端口是否已经被外部访问...")
run("curl -s --connect-timeout 5 http://47.93.213.140:8088/ -o /dev/null -w 'HTTP %{http_code}' 2>&1 || echo 'cannot reach'")

print("\n>>> 检查本机到 8088 的连通性...")
run("curl -sI http://localhost:8088/ 2>&1 | head -3")

client.close()
