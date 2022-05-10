# GestionaleVannini

## Per setuppare il progetto:

**(Node.js e npm devono essere necessariamente installati)**

Clona la repository e entraci:

	git clone https://github.com/LorenzoLotti/GestionaleVannini.git
	cd GestionaleVannini

comando Linux/macOS

	bash setup.bash

comando Windows

	setup

---

*È obbligatorio installare le estensioni VS Code consigliate dello workspace
(.vscode/extensions.json)*

Per il funzionamento corretto del Back-End, c'è bisogno di Docker!

Windows:

    Scaricare dal seguente Link: https://docs.docker.com/desktop/windows/install/ Docker Desktop per Windows. Avviare il file.exe scaricato e seguire i passaggi di installazione.

    Windows per il corretto funzionamento di Docker ha bisogno di WSL(Windows Subsystem for Linux) 2, durante l'installazione di Docker dovrebbe chiedere all'utente di installare i pacchetti di aggiornamento del Kernel Linux.

    Controllare se nella macchina è stato installato WSL, in caso contrario consultare il seguente Link: https://docs.microsoft.com/it-it/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package per lo scaricamento e l'installazione dei pacchetti necessari.

    Dopo la corretta installazione necessaria, Docker può funzionare; Per avviare il Back-End a linea di comando consigliamo di utilizzare la PoweShell, ed essa ha bisogno dei privilegi di amministratore.

    Avviare Mysql tramite Docker!

    Mysql:

    scaricare il database(create_employee.sql) situato nel Repository Back-End e lanciare i seguenti comandi:

    1) avviare il container con mysql-server montando un volume per la persistenza dei dati del DBMS (/var/lib/mysql) e un'altro volume per accedere al file precedentemente scaricato (/dump):

    comando: docker run --name my-mysql-server --rm -v C:/path/Locale:/var/lib/mysql -v C:/path/Locale:/dump -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest

    legenda:
        --name = nome container.
        --rm = rimuovi il container quando termina il processo.
        -v = percorso della cartella della macchina fisica(La cartella deve esistere, altrimenti Docker lancia un errore)
        MYSQL_ROOT_PASSWORD = password MYSQL.
        -p = porta macchina fisica:porta container.

    2) ottenere una bash dentro il container al fine di importare il database:

    comando: docker exec -it my-mysql-server bash                   //accedere alla Bash del Container
    comando: mysql -u root -p < /dump/create_employee.sql; exit;    //Importare il DataBase

    Nota!:
    se l'ultimo comando non viene eseguito, siginifica che il Container mysql sta ancora generando i file necessari per il corretto funzionamento, attendere qualche secondo.

    legenda:
        -it = interface(indica di volere una interfaccia seguito dal nome del container)
        bash = otteremo una interfaccia a linea di comando
        -u = indica l'utente
        -p = parametro necessario per l'utente root se è stata definita una password per MYSQL
        < = prende in input il file

    Le volte succesive sarà necessario avviare il docker mysql senza il volume dump:

    comando: docker run --name my-mysql-server --rm -v C:/path/Locale:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest


Linux:

    Installare su Linux l'ultima versione di Docker, bisogna avere i privilegi di root e avviare una bash eseguendo i seguenti comandi:

    comando:  sudo apt-get update                                           //Aggiorna i pacchetti
    comando:  sudo apt-get install docker-ce docker-ce-cli containerd.io    //Installa l'ultima versione di Docker

    Per verificare che Docker sia stato installato eseguire l'immagine HelloWorld:

    comando: sudo docker run hello-world    //Questo comando scarica un'immagine di prova e la esegue in un contenitore. Quando il contenitore viene eseguito, stampa un messaggio ed esce.

    Avviare Mysql tramite Docker!

     Mysql:

    scaricare il database(create_employee.sql) situato nel Repository Back-End e lanciare i seguenti comandi:

    1) avviare il container con mysql-server montando un volume per la persistenza dei dati del DBMS (/var/lib/mysql) e un'altro volume per accedere al file precedentemente scaricato (/dump):

    comando: sudo docker run --name my-mysql-server --rm -v /home/path/Locale:/var/lib/mysql -v /home/path/Locale:/dump -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest

    legenda:
        --name = nome container.
        --rm = rimuovi il container quando termina il processo.
        -v = percorso della cartella della macchina fisica(La cartella deve esistere, altrimenti Docker lancia un errore)
        MYSQL_ROOT_PASSWORD = password MYSQL.
        -p = porta macchina fisica:porta container.

    2) ottenere una bash dentro il Container al fine di importare il database:

    comando: sudo docker exec -it my-mysql-server bash                   //accedere alla Bash del Container
    comando: mysql -u root -p < /dump/create_employee.sql; exit;         //Importare il DataBase

    Nota!:
    se l'ultimo comando non viene eseguito, siginifica che il Container mysql sta ancora generando i file necessari per il corretto funzionamento, attendere qualche secondo.

    legenda:
        -it = interface(indica di volere una interfaccia seguito dal nome del container)
        bash = otteremo una interfaccia a linea di comando
        -u = indica l'utente
        -p = parametro necessario per l'utente root se è stata definita una password per MYSQL
        < = prende in input il file

    Le volte succesive sarà necessario avviare il docker mysql senza il volume dump:

    comando: sudo docker run --name my-mysql-server --rm -v /home/path/Locale:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest
