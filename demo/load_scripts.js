function getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
  if (endBlockNumber == null) {
    endBlockNumber = eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }
    var block = eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach( function(e) {
        if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
            console.log("  tx hash          : " + e.hash + "\n"
            + "   nonce           : " + e.nonce + "\n"
            + "   blockHash       : " + e.blockHash + "\n"
            + "   blockNumber     : " + e.blockNumber + "\n"
            + "   transactionIndex: " + e.transactionIndex + "\n"
            + "   from            : " + e.from + "\n" 
            + "   to              : " + e.to + "\n"
            + "   value           : " + e.value + "\n"
            + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
            + "   gasPrice        : " + e.gasPrice + "\n"
            + "   gas             : " + e.gas + "\n"
            + "   input           : " + e.input);
        }
      })
    }
  }
}

function findContractsByAccount(myaccount, startBlockNumber, endBlockNumber) {
  if (endBlockNumber == null) {
    endBlockNumber = eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }
    var block = eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
      block.transactions.forEach( function(e) {
        if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
            var result = eth.getTransactionReceipt(e.hash);
            if(result.contractAddress != null) {        
                console.log("Found contract in block " + i + " and contract address is " + result.contractAddress);
            }
        }
      })
    }
  }
}

function findTransactionsByContract(contractAddress, startBlockNumber, endBlockNumber) {
  if (endBlockNumber == null) {
    endBlockNumber = eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions  for contract \"" + contractAddress + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
        console.log("Searching block " + i);
    }
    var block = eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
       block.transactions.forEach( function(e) {
           var result = eth.getTransactionReceipt(e.hash);
           if (result.contractAddress == contractAddress || result.to == contractAddress || result.from == contractAddress) {
               console.log("Found transaction " + e.hash + " for contract " + result.contractAddress + " at block " + i);
           }
       });
    }
  }
}

function findInputOfTransactionsByContract(contractAddress, startBlockNumber, endBlockNumber) {
  if (endBlockNumber == null) {
    endBlockNumber = eth.blockNumber;
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (endBlockNumber == "latest") {
      endBlockNumber = eth.blockNumber;
      console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log("Searching for transactions  for contract \"" + contractAddress + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
        console.log("Searching block " + i);
    }
    var block = eth.getBlock(i, true);
    if (block != null && block.transactions != null) {
       block.transactions.forEach( function(e) {
           var result = eth.getTransaction(e.hash);
           if (result.contractAddress == contractAddress || result.to == contractAddress || result.from == contractAddress) {
               console.log("Found transaction " + e.hash + " for contract " + result.contractAddress + " at block " + i + " with input " + result.input);
           }
       });
    }
  }
}

function inputDecoder(input) {
    var length = input.length;
    if (length == 138) {
        opcode = "0x" + input.slice(2, 10);
        arg1 = "0x" + input.slice(11, 74);
        arg2 = "0x" + input.slice(75, 138);
        var result = [opcode, arg1, arg2];
        return result;
    } else if (length == 74) {
        opcode = "0x" + input.slice(2, 10);
        arg1 = "0x" + input.slide(11, 74);
        var result = [opcode, arg1];
        return result;
    }
}

function getBalance(account) {
    var ether = web3.fromWei(eth.getBalance(account).toNumber(), "ether");
    console.log(" Account: " + account + " has " + ether + " ethers\n");
}

function getAllBalances() {
    var totalBal = 0;
    for (var acctNum in eth.accounts) {
        var acct = eth.accounts[acctNum];
        var acctBal = web3.fromWei(eth.getBalance(acct), "ether");
        totalBal += parseFloat(acctBal);
        console.log("  eth.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal + " ether");
    }
    console.log("  Total balance: " + totalBal + " ether");
}

function getBalanceToFrom(startAcctNumber, endAcctNumber) {
    for (var acctNum = startAcctNumber; acctNum <= endAcctNumber; acctNum ++) {
        var acctBal = web3.fromWei(eth.getBalance(eth.accounts[acctNum]).toNumber(), "ether");
        console.log(" Account #" + acctNum + " with address "  + eth.accounts[acctNum] + " has a balance of " + acctBal + " ethers");
    }
}

function convertAllBalances() {
    var totalBal = 0;
    var masterAcct = eth.accounts[0];
    for (var acctNum in eth.accounts) {
        var acct = eth.accounts[acctNum];
        var acctBal = web3.fromWei(eth.getBalance(acct), "ether");
        if (acct != masterAcct) {
            if (acctBal != 2) {
                if (acctBal == 0) {
                    console.log("Account " + acct + " has a balance of " + acctBal + " transferring 2 ethers from " + eth.accounts[0]);
                    eth.sendTransaction({from: eth.accounts[0], to: acct, value: web3.toWei(2, "ether")});
                } else {
                    console.log("Account " + acct + " has a balance of " + acctBal + " transferring " + (acctBal - 2) + " to " + eth.accounts[0]);
                    personal.unlockAccount(acct, "password01");
                    eth.sendTransaction({from: acct, to: eth.accounts[0], value: web3.toWei(acctBal - 2, "ether")});
                }
            }
        }
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
    return ((Math.random() * (max - min + 1)) + min);
}

function unlockMaster() {
	personal.unlockAccount(eth.accounts[0], "Molodoi1");
}

function listenEvents(contractAddress) {
    ContractAllEvents = contractAddress.allEvents();
    ContractAllEvents.watch(function(error, event) {
        if(error) {
            console.log("Error : " + error);
        } else {
            console.log(event.event + ": " + JSON.stringify(event.args));
        }
    });
}
