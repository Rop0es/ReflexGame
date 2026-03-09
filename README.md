El meu joc senzill creat amb docker, consisteix en l'encadenació rapida d'escritura. 
Disposes de 60 segons per aconseguir la màxima puntuació possible, quan vegis una tecla hauràs de fer "click", ànims!!!

PER DESCARREGAR (copia de comanda en comanda al CMD/Powershell) 
--------------------------------------------
git clone https://github.com/Rop0es/ReflexGame.git

cd reflex-game

docker-compose up -d (dins de la carpeta on s'hagi fet el git clone)

Nota: Assegura't de tenir Docker Desktop instal·lat abans de començar.
COM JUGAR
------------
Conectar-se a localhost:9443 (potser fa falta http per funcionar)

PORTS 
----
Servei|Port Extern|Port Intern|Protocol|Accés

Joc (Node.js)|9443|8080|HTTP|http://localhost:9443

phpMyAdmin|8081|80|HTTP|http://localhost:8081

MariaDB |-|3306|MySQL|Només intern
