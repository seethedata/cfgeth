# cfgeth - pushing a single node of Ethereum to Cloud Foundry
Getting a single-node of Ethereum geth running on Cloud Foundry is not difficult, but it is also not straightforward. After getting things up and running, I wanted to document the lessons learned so that others can get things up and running more quickly. We use the Cloud Foundry binary buildpack to run a geth executable that was already compiled on Linux.

Here are a few things to keep in mind when pushing geth to Cloud Foundry:
---
* Cloud Foundry applications only listen on a single port (port 8080 by default) that is represented by the environment variable `PORT`. Any application pushed to Cloud Foundry needs to use this port if the application is talk to the outside world. In the case of geth, we want the RPC api set to this value using the `--rpcport` command line option.
* Remember that while the application exposes its RPC API on port 8080, Cloud Foundry maps exteral HTTP ports (80 and 443) to this internal port. This means when you are trying to attach to geth running at Cloud Foundry, you want to use port 80 (usually by not specifying a port at all). Cloud Foundry will map this to port 8080 for you.
* Because Cloud Foundry only ever exposes a single port, it is impossible to have a geth node join a cluster of other geth nodes. This is because we need to choose between using that port for exposing the RPC API or inter-node communication. Since a geth node with no RPC API is pretty much useless, the choice is easy. NOTE: It may be possible to handle this by creating TCP routes in Cloud Foundry instead of HTTP routes. This will be examined in the future. For now, this repository will produce a single node using the `--nodiscover` command line option.
* By default, Cloud Foundry will only listen on one interface. To assure that things map properly, we use the `--rpcaddr 0.0.0.0` argument for geth to make sure that the app listens on all interfaces.
* You are going to want a minmum of 2GB of RAM for you application (Cloud Foundry default is 512MB) to support not only handling RPC API requests, but also mining and DAG creation. Make sure to specify the RAM when pushing instead of taking the default.
* Storage is something that you will want to keep a close watch on. Even a fairly young blockchain will need 2GB of storage to run, which is much larger than the standard Cloud Foundry app and certainly larger than the Cloud Foundry default of 1GB. Make sure to specify the storage when pushing instead of taking the default.
* When using the binary_buildpack, you want to disable the Cloud Foundry health check, either with by adding `health-check-type: none` to the `manifest.yml` or using the `--health-check-type none` on the `cf push` command line.

To push Ethereum geth to Cloud Foundry, run the following steps:
---
1. Download and compile `geth` as described in the [go-ethereum repository](http://github.com/ethereum/go-ethereum). Note where `geth` is created (usually in `build/bin/geth`. This will be the binary that you want to run.
2. Clone this repo with `git clone https://github.com/seethedata/cfgeth`. This will pull all of the other required files to push geth to Cloud Foundry.
3. Run `cd cfgeth` to change into the cfgeth directory.
4. Copy the geth binary produced in step one to the `cfgeth` directory. If the `cfgeth` and `go-ethereum` directories are at the same directory level, you can run `cp ../go-ethereum/build/bin/geth .` to copy it.
5. Edit the `manifest.yml` and change the `name:` value to what you want your geth instance to be called. Also, if you want to change the memory or disk size you can edit the `memory:` or `disk_quota:` values respectively.
6. Use the Cloud Foundry cli to set your endpoint you want to push to with `cf api` and login with `cf login`. 
7. Push the app with `cf push`.
8. Once the app is running, you can connect using `geth` or the web3 api. To use `geth`, run the command `./geth attach http://yourappname.yourdomain.com`. To use the javascript web3 api, enter the line `web3.setProvider(new web3.providers.HttpProvider('http://yourappname.yourdomain.com'));` in your code. Again, note that no port is specified so the default HTTP port 80 will be used.

---
* Running the above commands will create a geth node running in Cloud Foundry with a base blockchain already created and a miner thread started. This base blockchain is stored in the file `genesis_ethereum.tar.gz`. We put this blockchain in so that we can start geth with a miner thread running. If you want to start with an empty blockchain, you can edit the `start` script and remove the first 4 lines, as well as remove the `--mine minerthreads 1` argument from the `geth` command.
* Right now, `geth` is started with a cache size of 1024MB. If you want more, in the `start` script, change the 1024 in the argument `--cache=1024` to the desired value. Just make sure you don't exceed the amount of RAM you specified in the manifest.yml file.
