const hexToRgb = val => {
    // Dividir el valor exadecimal en las siguientes posibles formas
    // Si son tres = [f, f, f]
    // Si son seis = [ff, ff, ff]
    let hex = val.length > 3 ? val.match(/[a-f0-9]{2}/g) : val.split('');
    let rgba = [];

    for (let index = 0, size = hex.length; index < size; index++) {
        rgba.push(
            parseInt(hex[index].length > 1
                ? hex[index]
                : `${hex[index]}${hex[index]}`, 16).toString()
        );
    }

    rgba = rgba.join(', ');
    return `rgba(${rgba}, 1) | rgb(${rgba})`;
};

const rgbToHex = val => {
    let strInt = 0;
    let hex = [];

    // Elminar los parentecis del valor y convertir el string en un array
    // Como la conversión es a hexadecimal de 6 dígitos (omitiendo el alpha)
    // el valor es independiente de este, osea si se pasa un valor rgba el
    // array resultante será de largo 4 (útlimo valor el alpha), debiendo eliminar el último
    let rgb = val.replace(/[rgba\(\);]+/g, '').split(',');

    for (let index = 0, size = rgb.length; index < size; index++) {
        strInt = Number(rgb[index].trim());

        hex.push(
            strInt < 10 ? `0${strInt}` : strInt.toString(16)
        );
    }

    if (hex.length > 3) hex.pop();

    return `#${hex.join('')}`;
};

const pxToEm = val => `${Number(val, 10) / 16}em`;

const emToPx = val => `${Math.round(parseFloat(val) * 16)}px`;

let Converter = {
    value: '',
    setType: function (_type) {
        switch (_type) {
            case '#': this.value = hexToRgb(this.value.toLowerCase()); break;
            case 'rgb':
            case 'rgba': this.value = rgbToHex(this.value.toLowerCase()); break;
            case 'px': this.value = pxToEm(this.value.toLowerCase()); break;
            case 'em':
            case 'rem': this.value = emToPx(this.value.toLowerCase()); break;
        }
    }
}

exports.Converter = Converter