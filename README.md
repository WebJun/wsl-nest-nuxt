### 실행
git clone https://github.com/WebJun/wsl-nest-nuxt  
cd wsl-nest-nuxt  
docker-compose up -d --build  
docker exec -it wsl-nest-nuxt-front.test-1 su scv -c "yarn"
docker exec -it wsl-nest-nuxt-back.test-1 su scv -c "yarn"
./start.sh  
http://localhost:3000/  

### version info
"@nestjs/core": "^9.0.0",  
"nuxt": "^3.4.3"  