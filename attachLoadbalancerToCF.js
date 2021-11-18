const {
  ElasticLoadBalancingV2Client,
  DescribeLoadBalancersCommand
 } = require('@aws-sdk/client-elastic-load-balancing-v2');
const axios = require('axios')

async function fetchELB() {
  try {
    const client = new ElasticLoadBalancingV2Client({ region: 'us-east-1' });
    const command = new DescribeLoadBalancersCommand('');
    const response = await client.send(command);
    const loadBalancer = response.LoadBalancers[0]
    const loadBalancerDNSName = loadBalancer.DNSName
    return loadBalancerDNSName
  } catch(e) {
    console.log('error', e)
  }
}

async function createDNSRecord(dnsName) {
  const body = {
    type: 'CNAME',
    name: 'ableumami',
    content: dnsName,
    ttl: 1
  }
  console.log('create record in cloudflare')
  try {
  await axios.post(
    'https://api.cloudflare.com/client/v4/zones/ZONE-ID/dns_records',
    JSON.stringify(body),
    {
      headers: {
        "X-Auth-Email": 'EMAIL',
        "X-Auth-Key": 'API KEY',
        "Content-Type": 'application/json'
      }
    })
  console.log('success')
  } catch(e) {
    console.log(e)
  }
}

(async function() {
  const dnsName = await fetchELB();
  await createDNSRecord(dnsName)
})();