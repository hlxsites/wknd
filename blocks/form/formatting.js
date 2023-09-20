const decimalSymbol = '.';
const groupingSymbol = ',';
const minFractionDigits = '00';

function toString(num) {
  const [integer, fraction] = num.toString().split('.');
  const formattedInteger = integer.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${groupingSymbol}`);
  let formattedFraction = fraction || minFractionDigits;
  const lengthFraction = formattedFraction.length;
  if (lengthFraction < minFractionDigits) {
    formattedFraction += Array(minFractionDigits - lengthFraction).fill(0).join('');
  }
  return `${formattedInteger}${decimalSymbol}${fraction || '00'}`;
}

function currency(num, currencySymbol = '$') {
  return `${currencySymbol} ${toString(num)}`;
}

function year(num) {
  if (num < 1) {
    return `${num * 12} months`;
  } if (num === 1) {
    return `${num} year`;
  }
  return `${num} years`;
}

function percent(num) {
  return `${(num * 100).toFixed(2).replace(/(\.0*$)|0*$/, '')}%`;
}

export default {
  currency,
  year,
  '%': percent,
};
