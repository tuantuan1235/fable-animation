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

def run(cmd, timeout=60):
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

print(">>> 查找实例所属安全组...")
exit_code = run(
    'aliyun ecs DescribeInstanceAttribute --InstanceId i-2zecoqmyuwivn9s6496j '
    '--region cn-beijing 2>&1 | grep -i securitygroup'
)

print("\n>>> 获取安全组详情...")
exit_code = run(
    'aliyun ecs DescribeInstanceAttribute --InstanceId i-2zecoqmyuwivn9s6496j '
    '--region cn-beijing --output cols=SecurityGroupIds rows=SecurityGroupIds.SecurityGroupId 2>&1'
)

exit_code, out = 0, ""
print("\n>>> 用 JSON 方式获取安全组ID...")
exit_code = run(
    'aliyun ecs DescribeInstanceAttribute --InstanceId i-2zecoqmyuwivn9s6496j '
    '--region cn-beijing 2>&1'
)

print("\n>>> 添加安全组规则（放行 8088 端口 TCP 入方向）...")
exit_code = run(
    'aliyun ecs AuthorizeSecurityGroup '
    '--RegionId cn-beijing '
    '--SecurityGroupId $(aliyun ecs DescribeInstanceAttribute --InstanceId i-2zecoqmyuwivn9s6496j --region cn-beijing 2>&1 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[\'SecurityGroupIds\'][\'SecurityGroupId\'][0])") '
    '--IpProtocol tcp '
    '--PortRange 8088/8088 '
    '--SourceCidrIp 0.0.0.0/0 '
    '--Policy accept '
    '--Description "Fable-Web-HTTP" '
    '2>&1',
    timeout=30
)

print("\n>>> 测试外部访问...")
time.sleep(3)
run("curl -s --connect-timeout 5 http://47.93.213.140:8088/ -o /dev/null -w 'HTTP %{http_code}' 2>&1")

print(f"\n{'='*50}")
print(f"  访问地址: http://47.93.213.140:8088")
print(f"{'='*50}")

client.close()
