const Discord = require("discord.js"); //Lexar
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {
  if (!message.member.roles.cache.has("812996545728872459"))
    //register
    return message.channel.send("Bu komutu kullanamazsın!");

  let user = message.guild.member(
    message.mentions.users.first() || message.guild.members.cache.get(args[0])
  );
  if (!user)
    return message.channel.send(
      "__**HATA!**__ Doğru Kullanım; `.isim <üye> <isim> <yaş>`"
    );
  let isim = args[1];
  let yaş = args[2];
  if (!isim)
    return message.channel.send(
      "__**HATA!**__ Doğru Kullanım; `.isim <üye> <isim> <yaş>`"
    );
  if (!yaş)
    return message.channel.send(
      "__**HATA!**__ Doğru Kullanım; `.isim <üye> <isim> <yaş>`"
    );
  db.add(`isim-puan_${message.guild.id}_${message.author.id}`, 1);

  const embed = new Discord.MessageEmbed().setDescription(
    `${user} **Adlı Kullanıcının İsmi Başarıyla \`• ${isim} | ${yaş}\` Olarak Ayarlandı!**`
  );

  message.channel.send(embed);

  user.setNickname(`• ${isim} | ${yaş}`);
};

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["n"],
  permLevel: 0
};

module.exports.help = {
  name: "isim",
  description: "Botta bulunan tüm komutları gösterir",
  usage: "komutlar"
};
