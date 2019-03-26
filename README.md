# ramverk2-projekt-react
Frontend för projektet i kursen ramverk2.


<!-- Gör ett medvetet val av teknik och berätta utförligt i din README om vilka teknikval du har gjort och varför. -->


För min frontend valde jag att fortsätta jobba med **React** som jag använt tidigare i kursen. Jag ville lära mig mer om hur det fungerar och se om jag kunde förbättra min kod. Jag skapade en del **React-komponenter** för att förenkla och minska upprepningen av min kod. Det blev bland annat en `Choice.js`-komponent som returnerar ett formulär för att exempelvis välja antal objekt vid köp eller försäljning. Jag skapade också en `Message.js`-komponent som visar upp ett fel- eller succé-meddelande från API:et. Med hjälp av **CSS** animeras meddelandet in och sedan ut efter ett par sekunder. Meddelandet blir kvar även om användaren går till en annan sida och behöver inte själv trycka bort det. För att anpassa min meny för att även kunna användas på små skärmar använde jag mig av paketet **react-bootstrap**. Det gjorde det enkelt att skapa en meny som kollapsar när skärmbredden går under en viss gräns.

Jag använde **Socket.io** för real-tids-delen av klienten. Jag hade inte använt det tidigare under kursen men ville testa hur det fungerade. Jag tyckte att det var smidigare än **Websockets** som jag använt tidigare, bland annat var det enklare att använda `this.socket.on("stocks", (data) => {};` för att anpassa vilken data som togs emot.

För att visa grafer använde jag mig av **Rickshaw** som jag fått tips om i en kmom-video. Med hjälp av deras dokumentation och exempelkod i kurs-katalogen gick det ganska enkelt att skapa graferna lokalt. Jag fick däremot problem när jag skulle testa dem online. Efter lite läsande kom jag fram till att Reacts minifiering med webpack inte fungerade så bra med Rickshaw. Jag hittade till slut lösningen att "ejecta" mitt projekt för att sen kunna modifiera en konfigurations-fil. Efter att ha lagt till `mangled: {reserved: ['$super']}` i `webpack.config.js` fungerade det.
