Simple Ticket Discord Bot
=========
Nederlands onder / Русский снизу / Українська нижче
=========

Simple Discord bot with ticket system and their full customization.

The system was taken from Discord bot [Swallow](https://discord.gg/ug7qrbW4Bj).


Settings
=========
The configuration file is named **config.json**.

* `token`: Your Discord bot token.
* `dataURL`: Link to your database.
* `applicationId`: The ID of your Discord bot.


Important moments
=========
1. The bot has a cache system. Because of this, a ticket may not be created the first time, because the bot needs to first put the information into the cache or create a schema in the database if there is no user/guild in it.
2. The same applies to buttons in tickets. If the bot is restarted, the guild is not in the cache, so when you press a button, nothing may happen.
3. Since there are slash commands in the bot, it is necessary to specify `applicationId` specifically for the bot you are going to use.


Project installation and startup
=========
Setting up a bot requires basic knowledge of the command line, which is bash or similar in Linux/Mac and cmd.exe in Windows.

1. Install [nodejs](https://nodejs.org). Install the LTS version.
2. Clone this repository, or download it in zip format, then unzip it.
3. Write the `npm i` command in the root folder of the project.
4. Get a token for Discord bot (you can copy it [here](https://discord.com/developers/applications)) and specify it in the settings file.
    - All 3 intents (PRESENCE INTENT, SERVER MEMBERS INTENT and MESSAGE CONTENT INTENT) must be enabled for the bot to work correctly. To do this, go to the `Bot` section in the application settings.
   - If you already have this bot running, or are using it for other purposes, then do not use it. It may cause various kinds of errors. Create a new one.
5. Get the link for your database(you can generate it [here](https://www.mongodb.com)) and specify it in the settings file.
6. Run the bot: `npm start`.

Done! Now you have a Discord bot with a simple ticket system at your disposal.


Nederlands
=========

Eenvoudige Discord bot met ticketsysteem en hun volledige aanpassing.

Het systeem is overgenomen van Discord bot [Swallow] (https://discord.gg/ug7qrbW4Bj).


Instellingen
=========
Het configuratiebestand heeft de naam **config.json**.

* `token`: Jouw Discord bot token.
* `dataURL`: Link naar je database.
* `applicationId`: De ID van je Discord bot.


Belangrijke momenten
=========
1. De bot heeft een cache systeem. Hierdoor is het mogelijk dat een ticket niet de eerste keer wordt aangemaakt, omdat de bot eerst de informatie in de cache moet zetten of een schema in de database moet maken als er geen gebruiker/gilde in zit.
2. Hetzelfde geldt voor knoppen in tickets. Als de bot opnieuw wordt opgestart, staat het gilde niet in de cache, dus als je op een knop drukt, gebeurt er misschien niets.
3. Aangezien er slash commando's in de bot zitten, is het nodig om `applicationId` specifiek te specificeren voor de bot die je gaat gebruiken.


Project installeren en opstarten
=========
Het opzetten van een bot vereist basiskennis van de commandoregel, wat bash of iets dergelijks is in Linux/Mac en cmd.exe in Windows.

1. Installeer [nodejs](https://nodejs.org). Installeer de LTS-versie.
2. Kloon deze repository of download het in zip-formaat en pak het vervolgens uit.
3. Schrijf het `npm i` commando in de hoofdmap van het project.
4. Verkrijg een token voor Discord bot (je kunt het [hier](https://discord.com/developers/applications) kopiëren) en specificeer het in het instellingenbestand.
    - Alle 3 de intenties (PRESENCE INTENT, SERVER MEMBERS INTENT en MESSAGE CONTENT INTENT) moeten ingeschakeld zijn om de bot correct te laten werken. Ga hiervoor naar de sectie `Bot` in de applicatie-instellingen.
   - Als je deze bot al hebt draaien of voor andere doeleinden gebruikt, gebruik hem dan niet. Het kan verschillende soorten fouten veroorzaken. Maak een nieuwe..
5. Verkrijg de link voor uw database (u kunt deze [hier](https://www.mongodb.com) genereren) en geef deze op in het instellingenbestand.
6. Start de bot: `npm start`.

Gedaan! Nu heb je een Discord bot met een eenvoudig ticketsysteem tot je beschikking.


Русский
=========

Простой Discord бот с системой тикетов и их полной настройкой.

Система была взята с Discord бота [Swallow](https://discord.gg/ug7qrbW4Bj).

Настройки
=========
Файл с настройками называется **config.json**.

* `token`: Токен вашего дискорд бота.
* `dataURL`: Ссылка на вашу базу данных.
* `applicationId`: Айди вашего дискорд бота.


Важные моменты
=========
1. В боте присутствует система кэша. Из-за этого тикет может создасться не с первого раза, так как боту необходимо сначала занести информацию в кэш либо же создать схему в базе данных в случае отсутствия пользователя/гильдии в ней.
2. Тоже самое касается и непосредственно кнопок в тикетах. Если произошел рестарт бота, то гильдия отсутствует в кэше, поэтому при нажатии кнопки может ничего не произойти.
3. Так как в боте присутствуют слэш команды, указывать `applicationId` необходимо конкретно того бота, которого вы собираетесь использовать.


Установка и запуск проекта
=========
Настройка бота требует базовых знаний о командной строке, которая представляет собой bash или аналогичное приложение в Linux/Mac и cmd.exe в Windows.

1. Установите [nodejs](https://nodejs.org). Устанавливайте LTS версию.
2. Клонируйте этот репозиторий, или скачайте его в формате zip, затем распакуйте.
3. Пропишите в корневой папке проекта команду `npm i`.
4. Получите токен для Discord бота(скопировать его можно [тут](https://discord.com/developers/applications)) и укажите в файле настроек.
   - Для корректной работы бота необходимо включить все 3 интента (PRESENCE INTENT, SERVER MEMBERS INTENT и MESSAGE CONTENT INTENT). Для этого перейдите в настройках приложения в раздел `Bot`.
   - Если у вас уже запущен этот бот, либо же он используется для других целей, то не используйте его. Это может привести к различного рода ошибкам. Создайте нового.
5. Получите ссылку для вашей базы данных(сгенерировать её можно [здесь](https://www.mongodb.com)) и укажите в файле настроек.
6. Запустите бота: `npm start`.

Готово! Теперь в вашем распоряжении Discord бот с простой системой тикетов.


Українська
=========

Простий Discord-бот із системою тікетів та їх повним налаштуванням.

Систему було взято з Discord бота [Swallow](https://discord.gg/ug7qrbW4Bj).


Налаштування
=========
Файл із налаштуваннями називається **config.json**.

* `token`: Токен вашого телеграм бота.
* `dataURL`: Посилання на вашу базу даних.
* `applicationId`: Айді вашого дискорд бота.


Важливі моменти
=========
1. У боті присутня система кешу. Через це тікет може створитися не з першого разу, оскільки боту необхідно спочатку занести інформацію в кеш або ж створити схему в базі даних у разі відсутності користувача/гільдії в ній.
2 Теж саме стосується і безпосередньо кнопок у тікетах. Якщо стався рестарт бота, то гільдія відсутня в кеші, тому під час натискання кнопки може нічого не статися.
3) Оскільки в боті присутні слеш-команди, вказувати `applicationId` необхідно конкретно того бота, якого ви збираєтеся використовувати.


Встановлення та запуск проекту
=========
Налаштування бота вимагає базових знань про командний рядок, що являє собою bash або аналогічний застосунок у Linux/Mac і cmd.exe у Windows.

1. Встановіть [nodejs](https://nodejs.org). Встановлюйте LTS версію.
2. Клонуйте цей репозиторій, або скачайте його у форматі zip, потім розпакуйте.
3. Пропишіть у корневій папці проєкту команду `npm i`.
4. Отримайте токен для Discord бота (скопіювати його можна [тут] (https://discord.com/developers/applications)) і вкажіть у файлі налаштувань.
   - Для коректної роботи бота необхідно увімкнути всі 3 інтенти (PRESENCE INTENT, SERVER MEMBERS INTENT і MESSAGE CONTENT INTENT). Для цього перейдіть у налаштуваннях програми в розділ `Bot`.
   - Якщо у вас уже запущений цей бот, або ж він використовується для інших цілей, то не використовуйте його. Це може призвести до різного роду помилок. Створіть нового.
5. Отримайте посилання для вашої бази даних (згенерувати його можна [тут](https://www.mongodb.com)) і вкажіть у файлі налаштувань.
6. Запустіть бота: `npm start`.

Готово! Тепер у вашому розпорядженні Discord бот із простою системою тікетів.


Feedback
=========
[Telegram](https://t.me/jason_kings_tg)<br>
[Discord](https://discordapp.com/users/608684992335446064)<br>


Documentation
=========
[discord-html-transcripts](https://www.npmjs.com/package/discord-html-transcripts)<br>
[discord.js](https://discord.js.org/#/docs/discord.js/main/general/welcome)<br>
[fs](https://github.com/npm/security-holder)<br>
[mongoose](https://www.mongodb.com/docs/atlas/)<br>
[ms](https://www.npmjs.com/package/ms)<br>
[path](https://nodejs.org/docs/latest/api/path.html)