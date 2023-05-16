### 실행
git clone https://github.com/WebJun/wsl-nest-nuxt  
cd wsl-nest-nuxt  
docker-compose up -d --build  
docker exec -it wsl-nest-nuxt-front.test-1 su scv -c "yarn"  
docker exec -it wsl-nest-nuxt-back.test-1 su scv -c "yarn"  
./startBack.sh  
./startFront.sh  
http://localhost:3000/  

### version info
"@nestjs/core": "^9.0.0",  
"nuxt": "^3.4.3"  

### issue
```
[nitro] [dev] [uncaughtException] Error: listen EADDRINUSE: address already in use /tmp/nitro/worker-76-1.sock                                      12:23:47 PM
    at Server.setupListenHandle [as _listen2] (node:net:1446:21)                                                                                    12:23:43 PM
    at listenInCluster (node:net:1511:12)
    at Server.listen (node:net:1610:5)
    at file:///front.test/.nuxt/dev/index.mjs:625:8
    at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:530:24)
    at async loadESM (node:internal/process/esm_loader:91:5)
    at async handleMainPromise (node:internal/modules/run_main:65:12) {
  code: 'EADDRINUSE',
  errno: -98,
  syscall: 'listen',
  address: '/tmp/nitro/worker-76-1.sock',
  port: -1
}
```
docker exec -it wsl-nest-nuxt-front.test-1 chown -R scv:scv /tmp/nitro/  

