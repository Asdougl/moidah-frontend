export const randRange = (min, max) => {
    min = Math.ceil(+min)
    max = Math.floor(+max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randChar = () => {
    const charPos = randRange(0, 25);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return characters[charPos];
}

export const randString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let randstr = '';
    for(let i = 0; i < length; i++) {
        randstr += characters[randRange(0, 25)]
    }
    return randstr;
}

export const randStringArray = (count, strLen) => {
    const arr = [];
    for(let i = 0; i < count; i++) {
        arr[i] = randString(strLen)
    }
    return arr;
}

export const shuffle = (arr) => {
    let j, x, i;
    for(i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i]
        arr[i] = arr[j]
        arr[j] = x
    }
    return arr;
}