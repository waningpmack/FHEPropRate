import { execSync } from "child_process";

const HARDHAT_RPC_URL = "http://localhost:8545";

try {
  // Try to get the client version
  const result = execSync(`curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' ${HARDHAT_RPC_URL}`, {
    encoding: 'utf8',
    timeout: 5000
  });

  const response = JSON.parse(result);

  if (response.result && response.result.toLowerCase().includes('hardhat')) {
    console.log("Hardhat node is running");
    process.exit(0);
  } else {
    console.log("Hardhat node is not running or not accessible");
    process.exit(1);
  }
} catch (error) {
  console.log("Hardhat node is not running or not accessible");
  process.exit(1);
}

