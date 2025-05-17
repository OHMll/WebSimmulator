export default function mergeSort(arr, key) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), key);
    const right = mergeSort(arr.slice(mid), key);

    return merge(left, right, key);
}

function merge(left, right, key) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        const leftVal = parseFloat(left[i][key]);
        const rightVal = parseFloat(right[j][key]);

        if (leftVal <= rightVal) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}
