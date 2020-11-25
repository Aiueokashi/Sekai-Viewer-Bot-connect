const { Command } = require('discord-akairo');
const Util = require('../util/Util')
const Discord = require('discord.js');

const musicNameIdMap = {
  'tell-your-world': 0,
  'ロキ': 1,
  'roki': 1,
  'テオ': 2,
  'teo': 2,
  'ヒバナ-reloaded-': 3,
  'ヒバナ': 3,
  'hibana': 3,
  'ハッピーシンセサイザ': 4,
  'happy-synthetizer': 4,
  'ビバハピ': 5,
  'viva-happy': 5,
  'nostalogic': 6,
  'ノスタロジック': 6,
  'アスノヨゾラ哨戒班': 7,
  'asu-no-yozora-shoukaihan': 7,
  'charles': 8,
  'シャルル': 8,
  'dappou-rock': 9,
  '脱法ロック': 9,
  'hated-by-life-itself': 10,
  '命に嫌われている': 10,
  '劣等上等': 11,
  'bring-it-on!': 11,
  'bring-it-on': 11,
  'just-be-friends': 12,
  'ドクターファンクビート': 13,
  'doctor=funk-beat': 13,
  'doctor-funk-beat': 13,
  'miracle-paint': 14,
  'ミラクルペイント': 14,
  'ブリキノダンス': 15,
  'buriki-no-dance': 15,
  'スイートマジック': 16,
  'sweet-magic': 16,
  'next-nest': 17,
  'ネクストネスト': 17,
  'hand-in-hand': 18,
  'ハンドインハンド': 18,
  '39みゅーじっく！': 19,
  '39みゅーじっく!': 19,
  '39-music!': 19,
  '39-music': 19,
  'メルト': 20,
  'melt': 20,
  'world-is-mine': 21,
  'ワールドイズマイン': 21,
  'the-disappearance-of-hatsune-miku': 22,
  '初音ミクの焼失': 22,
  'blessing': 23,
  'セカイはまだ始まってすらいない': 24,
  'the-world-hasn’t-even-started-yet': 24,
  'becoming-potatoes': 25,
  'potatoになっていく': 25,
  'ready-steady': 26,
  'アイドル新鋭隊': 27,
  'idol-shineitai': 27,
  '悔やむと書いてミライ': 28,
  'a-future-written-as-i-regret': 28,
  '携帯恋話': 29,
  'keitai-renwa': 29,
  'ジャックポットサッドガール': 30,
  'jackpot-sad-girl': 30,
  'needLe': 31,
  'ステラ': 32,
  'stella': 32,
  'hello/how-are-you': 33,
  'hello-how-are-you': 33,
  'ハロ／ハワユ': 33,
  'ハロ/ハワユ': 33,
  '自傷無色': 34,
  'jishou-mushoku': 34,
  'ダンスロボットダンス': 35,
  'dance-robot-dance': 35,
  'フラジール': 36,
  'fragile': 36,
  'メルティランドナイトメア': 37,
  'melty-land-nightmare': 37,
  'ツギハギスタッカート': 38,
  'patchwork-staccato': 38,
  'ニア': 39,
  'near': 39,
  'セカイ': 40,
  'sekai': 40,
  'ワーワーワールド': 41,
  'wah-wah-world': 41,
  'your-adventure-log-has-vanished': 42,
  'ぼうけんのしょがきえました！': 42,
  '夜咄ディセイブ': 43,
  'night-tales-deceive': 43,
  'alive': 44,
  'gimme×gimme': 45,
  'gimme-gimme': 45,
  'ジャンキーナイトタウンオーケストラ': 46,
  'junky-night-town-orchestra': 46,
  'leia-remind': 47,
  'leia': 47,
  'on-the-rocks': 48,
  'otome-dissection': 49,
  '乙女解剖': 49,
  '青く駆けろ！': 50,
  '青く駆けろ!': 50,
  'aoku-kakero': 50,
  'モア！ジャンプ！モア！': 51,
  'more!jump!more!': 51,
  'rolling-girl': 52,
  'ローリンガール': 52,
  'two-faced-lovers': 53,
  '裏表ラバーズ': 53,
  'unknown-mother-goose': 54,
  'アンノウン・マザーグース': 54,
}
const queryNames = Object.keys(musicNameIdMap)

module.exports = class MusicDataCommand extends Command {
  constructor() {
    super('music', {
      aliases: ['music', 'song'],
      channel: 'guild',
      ownerOnly: false,
      args: [
        {
          id: 'items',
          match: 'content',
          prompt: {
            start: 'Please tell me a song title'
          }
        }
      ]
    });
  }

  exec(message, args) {
    if (!message.channel.name.startsWith('bot-')) return;
    // const prefix = process.env.SEKAI_PREFIX;
    // const [command, ...args] = message.content.slice(prefix.length + 6).split(' ');

    const items = args.items.replace(/\s/g, '-')
    Util.fetchData(
      'https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/musics.json'
    ).then(data => {
      const filteredNames = queryNames.filter(elem => elem.startsWith(items))
      if (filteredNames.length > 1) {
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('Specific a song')
            .setDescription(filteredNames.join('\n'))
            .setTimestamp()
        );
      } else if (filteredNames.length === 0) {
        return message.channel.send(
          new Discord.MessageEmbed()
            .setTitle('Error')
            .setDescription('The song matching your input is not found')
            .setTimestamp()
        );
      }
      const idx = musicNameIdMap[filteredNames[0]];
      const newtitle = data[idx].title;
      const songId = data[idx].id
      const songName = data[idx].title
      message.channel.send(
        new Discord.MessageEmbed()
          .setTitle(`Song Title: ${newtitle}`)
          .setURL(`https://sekai-world.github.io/sekai-viewer/#/music/${songId}`)
          .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/music/jacket/jacket_s_${String(songId).padStart(3, '0')}_rip/jacket_s_${String(songId).padStart(3, '0')}.webp`)
          .setDescription(
            `Lyricist: **${data[idx].lyricist}** \nComposer: **${
            data[idx].composer
            }** \nArranger: **${data[idx].arranger}** \nMV-Dancers: **${
            data[idx].dancerCount
            }**`
          )
      );
    });
  }
};
