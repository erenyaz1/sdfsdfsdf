const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader.js")(client);
const path = require("path");
const snekfetch = require("snekfetch");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + "7/24 AKTİF TUTMA İŞLEMİ BAŞARILI");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

client.on("guildMemberAdd", member => {
  let yetkili = ayarlar.yetkili;
  let kayıtsohbet2 = ayarlar.kayıtsohbet; //FALCO

  let guild = member.guild;

  const channel = member.guild.channels.cache.find(
    channel => channel.id === kayıtsohbet2
  ); /// Kayıt Kanalı Adı
  let aylartoplam = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs", //FALCO
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos", //FALCO
    "09": "Eylül", //FALCO
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık"
  };
  let aylar = aylartoplam;

  let user = client.users.cache.get(member.id);
  require("moment-duration-format"); //FALCO

  const kurulus = new Date().getTime() - user.createdAt.getTime();
  const gün = moment.duration(kurulus).format("D");
  var kontrol = [];

  if (gün < 7) {
    kontrol =
      "<a:B_Dikkat:811693553008902235>  **Şüpheli** <a:B_Dikkat:811693553008902235> ";
  }
  if (gün > 7) {
    //FALCO
    kontrol =
      "<a:onayli:812681277349298176>  **Güvenilir <a:onayli:812681277349298176> ";
  }
  let kanal = ayarlar.kayıtsohbet; //FALCO
  if (!kanal) return;

  const embed = new Discord.MessageEmbed()
    .setColor("36393F")
    .setThumbnail(
      user.avatarURL({
        dynamic: true,
        format: "gif",
        format: "png",
        format: "jpg",
        size: 2048
      })
    )
    .setImage(`https://media0.giphy.com/media/NKEt9elQ5cR68/200.gif`)
    .setDescription(
      ` <a:803722979141615616:811693560335695922>** •  Sunucumuza hoşgeldin ${
        member.user
      }

<a:803722979141615616:811693560335695922> • Kayıt olmak için  \`TAGLI ALIM\` odalarından birine geçerek kaydınızı tamamlası için <@&812996545728872459> rolündeki yetkiliye isim ve yaşınızı belirtirseniz size yardımcı olacaktır. \n
      <a:803722979141615616:811693560335695922> • Tagımızı \`△\` Almayı unutmayınız \n\n <a:803722979141615616:811693560335695922> • Hesap Kuruluş: \`${moment(
        user.createdAt
      ).format("DD")} ${aylar[moment(user.createdAt).format("MM")]} ${moment(
        user.createdAt
      ).format("YYYY HH:mm:ss")}\`

<a:803722979141615616:811693560335695922> • Seninle beraber \`${
        guild.memberCount
      }\` kişi olduk! \n\n<a:803722979141615616:811693560335695922> • Hesabın: ${kontrol} \n`
    );
  client.channels.cache.get(kanal).send(`<@&${yetkili}>, ${member.user}`); //FALCO
  client.channels.cache.get(kanal).send(embed);
});
////////////////////////////////////////////////////////////BOTU ODAYA SOKAR////////////////////////////////////////////////////
client.on("ready", () => {
  let odayagir = ayarlar.odayagir;
  client.channels.cache.get(odayagir).join();
});

//////////////////////////////////////////////////////////OTO ROL//////////////////////////////////////////////////////////////

client.on("guildMemberAdd", member => {
  let kayıtsızcık = ayarlar.kayıtsız; //FALCO
  member.roles.add(kayıtsızcık);
});

client.on("guildMemberAdd", member => {
  let emoji = ayarlar.emoji; //FALCO
  member.roles.add(emoji);
});

//FALCO
/////////////////////////////////////////////////////////////////YASAKLI TAG//////////////////////////////////////////////////////////
client.on("guildMemberAdd", member => {
  let tag = ayarlar.yasaklıtag;
  let kayıtsızcık = ayarlar.kayıtsız; //FALCO
  let cezalıcık = ayarlar.cezalı;

  if (member.user.username.includes(tag)) {
    //FALCO
    member.roles.add(cezalıcık);
    member.roles.remove(kayıtsızcık);
    member.send(
      ` \`${member.guild.name}\` adlı **sunucuda __yasaklı tag__ kullandığınız için __Cezalı__ rolünü aldınız!**`
    );
  } //FALCO
});

/////////////////////////////

client.on("guildMemberAdd", async member => {
  //FALCO
  member.setNickname("• İsim | Yaş");
});
client.login(process.env.token);
