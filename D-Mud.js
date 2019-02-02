const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const mob = require("./mob.json");
const rea = require("./rea.json");
const mando = require("./mando.json");
const stats = require("./stats.json");
const config = require("./config.json");
const responseObject = require("./response.json");
var mandoDMG = {
  sides: mando.STR,
  calc: function () {
    var totalDMG = 
    Math.floor(Math.random()*this.sides);
    return totalDMG;
  }
};
var hit = {
  sides: 2,
  calc: function() {
  var miss =
  Math.floor(Math.random()*this.sides);
  return miss;
  }
};
var reaDMG = {
  sides: rea.STR,
  calc: function() {
  var totalDMG =
  Math.floor(Math.random()*this.sides);
  return totalDMG;
  }
};
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
  client.user.setGame("D-MUD(aV.1.0.2b)");
  console.log("I am ready!");
});
client.on("message", (message) => {
  if (message.author.bot) return;
  if (responseObject[message.content]) {
    message.channel.send(responseObject[message.content]);
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
    message.channel.send("You cast " + mando.Spell + " at the " + mob.ID + " for " + mando.Spelld + " damage")
    message.channel.send("The " + mob.ID + " flinches under the influence of your spell")
  }
  if (message.content.includes("attack")) {
    let newDMG = mandoDMG.calc()
    mando.DMG = newDMG;
    fs.writeFile("./mando.json", JSON.stringify(mando), (err) => console.error);
    message.channel.send("You swing your " + mando.WPN + " and hit the " + mob.ID + " for " + mando.DMG + " damage.")
    message.channel.send("The " + mob.ID + " hits you back for " + mob.DMG + " damage")
  }
});
client.on("message", (message) => {
  if (message.author.id !== config.reaID || message.author.bot) return;
  if (message.content.includes("cast")) {
    message.channel.send("You cast "  + rea.Spell + " at the " + mob.ID + " for " + rea.Spelld + " damage")
    message.channel.send("The " + mob.ID + " flinches und the influence of your spell")
  }
  if (message.content.includes("attack")) {
    let newDMG = reaDMG.calc()
    rea.DMG = newDMG;
    fs.writeFile("./rea.json", JSON.stringify(rea), (err) => console.error);
    message.channel.send("You swing your " + rea.WPN + " at the " + mob.ID +  " and deal " + rea.DMG + " damage")
    message.channel.send("The " + mob.ID + " hits you back for " + mob.DMG + " damage")
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
