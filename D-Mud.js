const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const rea = require("./rea.json");
const mando = require("./mando.json");
const stats = require("./stats.json");
const config = require("./config.json");
const responseObject = require("./response.json");
var mandoDMG = {
  sides: mando.STR,
  roll: function () {
    var totalDMG = 
    Math.floor(Math.random()*this.sides);
    return totalDMG;
  }
}
var reaDMG = {
  sides: rea.STR,
  calc: function() {
  var totalDMG =
  Math.floor(Math.random()*this.sides);
  return totalDMG;
  }
}
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});
client.on("ready", () => {
  client.user.setStatus("dnd");
  client.user.setGame("D-MUD(WiP)");
  console.log("I am ready!");
});
client.on("message", (message) => {
  if (message.author.bot) return;
  if (responseObject[message.content]) {
    message.channel.send(responseObject[message.content]);
  }
});
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.includes("d6")) {
    message.channel.send(d6.roll())
  }
  if (message.content.includes("d20")) {
    message.channel.send(d20.roll())
    return
  }
  if (message.content.includes("d8")) {
    message.channel.send(d8.roll())
  }
  if (message.content.includes("d12")) {
    message.channel.send(d12.roll())
  }
  if (message.content.includes("d2")) {
    message.channel.send(d2.roll())
  }
});
client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args);
    } catch (err) {
      console.error(err);
    }
});
client.on("message", (message) => {
  if (message.author.id !== config.ownerID || message.author.bot) return;
  if (message.content.includes("cast")) {
    message.channel.send("You cast "  + mando.Spell + " for " + mando.Spelld + " damage")
  }
  if (message.content.includes("attack")) {
    let newDMG = mandoDMG.calc()
    mando.DMG = newDMG;
    fs.writeFile("./rea.json", JSON.stringify(mando), (err) => console.error);
    message.channel.send("You swing your " + mando.WPN + " and deal " + mando.DMG + " damage")
  }
});
client.on("message", (message) => {
  if (message.author.id !== config.reaID || message.author.bot) return;
  if (message.content.includes("cast")) {
    message.channel.send("You cast "  + rea.Spell + " for " + rea.Spelld + " damage")
  }
  if (message.content.includes("attack")) {
    let newDMG = reaDMG.calc()
    rea.DMG = newDMG;
    fs.writeFile("./rea.json", JSON.stringify(rea), (err) => console.error);
    message.channel.send("You swing your " + rea.WPN + " and deal " + rea.DMG + " damage")
  }
});
client.on("message", (message) => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  if(message.author.id !== config.ownerID) return;
  if(message.content.indexOf(config.prefix) !== 0) return; 
  if(message.content.startsWith(config.prefix + "prefix")) {
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    config.prefix = newPrefix;
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
    message.channel.send("User prefix has been set to => " + config.prefix);
  }
});
client.login(config.token);
