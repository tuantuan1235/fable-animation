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

print(">>> 检查 aliyun CLI 配置...")
run("aliyun configure list 2>&1")
run("aliyun ecs DescribeRegions 2>&1 | head -10")

print("\n>>> 尝试用 ECS metadata 获取安全组信息...")
run("curl -s http://100.100.100.200/latest/meta-data/ram/security-credentials/ 2>/dev/null")

print("\n>>> 检查已有安全组规则（尝试其他 API）...")
run("aliyun ecs DescribeSecurityGroups --RegionId cn-beijing 2>&1 | head -20")

client.close()
