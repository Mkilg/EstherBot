'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Hallo, ich bin MKII, der persönliche Bot von Marie. Schreib etwas!')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    var zufall = Math.random()
                        if (zufall <=0.25) {
                             return bot.say(`Das verstehe ich nicht.\nSorry!`).then(() => 'speak');
                        } else if (0.25 < zufall <=0.50) {
                             return bot.say(`Ok.`).then(() => 'speak');
                        } else if (0.50 < zufall <=0.90) {
                             return bot.say(`Das verstehe ich nicht.`).then(() => 'speak');
                        } else {
                            return bot.say(`Tut mir Leid, ich verstehe noch nicht so viel. Möchtest du lieber mit Marie selbst sprechen? Dann schreibe "Nachricht".`).then(() => 'speak');
                        };
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
