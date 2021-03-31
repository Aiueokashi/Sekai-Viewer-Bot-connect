const crypto = require('crypto');
const { stripIndents } = require('common-tags');
const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)?\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi; 
const fetch = require('node-fetch');

class Util {
  static shorten(text, maxLen = 2000) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
  }

  static trimValue(text, maxLen = 1150) {
    return text.length > maxLen ? `${text.substr(0, maxLen)}` : text;
  }

  static trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);
      arr.push(`${len} more...`);
    }
    return arr;
  }
  static firstUpperCase(text) {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  }

  static escapeRegex(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  }

  static base64(text, mode = 'encode') {
    if (mode === 'encode') return Buffer.from(text).toString('base64');
    if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null;
    throw new TypeError(`${mode} base64 mode is not supported`);
  }
  static streamToArray(stream) {
    if (!stream.readable) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      const array = [];
      function onData(data) {
        array.push(data);
      }
      function onEnd(error) {
        if (error) reject(error);
        else resolve(array);
        cleanup();
      }
      function onClose() {
        resolve(array);
        cleanup();
      }
      function cleanup() {
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        stream.removeListener('close', onClose);
      }
      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onEnd);
      stream.on('close', onClose);
    });
  }

  static fetchData(url = '') {
    return fetch(url).then(res => res.json());
  }
  static txfetchData(url = '') {
    return fetch(url).then(res => res.text());
  }
  static list(arr, conj = 'and') {
		const len = arr.length;
		if (len === 0) return '';
		if (len === 1) return arr[0];
		return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}
  static async reactIfAble(msg, user, emoji, fallbackEmoji) {
    const dm = !msg.guild;
    if (fallbackEmoji && (!dm && !msg.channel.permissionsFor(user).has('USE_EXTERNAL_EMOJIS'))) {
      emoji = fallbackEmoji;
    }
    if (dm || msg.channel.permissionsFor(user).has(['ADD_REACTIONS', 'READ_MESSAGE_HISTORY'])) {
      try {
        await msg.react(emoji);
      } catch {
        return null;
      }
    }
    return null;
  }
}


module.exports = Util;