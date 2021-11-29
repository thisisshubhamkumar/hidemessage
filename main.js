const app_data = {
  tab: 'hide',
  hide: {
    secretMessage: 'I love you!',
    content: 'Hi, how are you doing?',
    result: '',
    submit() {
      const converted = convertToZWC(this.secretMessage);
      const where = Math.floor(this.content.length / 2);
      this.result = this.content.slice(0, where) + '\u200e' + converted + '\u200f' + this.content.slice(where);
    }
  },
  reveal: {
    content: '',
    result: '',
    submit() {
      const regex = /\u200e(.*?)\u200f/g;
      const matches = this.content.matchAll(regex);
      const matchesArr = [...matches];

      if (matchesArr) {
        const results = [];
        matchesArr.forEach((match) => {
          results.push(retrieveMessage(match[1]));
        });

        this.result = results.join('\n\n');
      } else {
        this.result = '';
      }
    }
  }
};

const convertToZWC = (str) => {
  const byteArr = Array.from(new TextEncoder().encode(str));
  const bitArr = byteArr
    .map((dec) => dec.toString(2).padStart(8, '0').split(''))
    .flat();

  return bitArr
    .map((bit) => {
      if (bit == 0) return '\u200b';
      if (bit == 1) return '\u200c';
    })
    .join('');
};

const retrieveMessage = (zwdStr) => {
  const bitArr = zwdStr.split('').map((c) => {
    if (c == '\u200b') return '0';
    if (c == '\u200c') return '1';
  });
  const byteArr = chunk(bitArr, 8).map((byteStr) => parseInt(byteStr, 2));
  return new TextDecoder().decode(Uint8Array.from(byteArr));
};

const chunk = (array, size) => {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index).join(''));
    index += size;
  }
  return chunked_arr;
};
