export default function (value) {

    value = parseFloat(value);
    
    let section = [
        [0, 19],
        [20, 39],
        [40, 59],
        [60, 79],
        [80, 99],
        [100, Number.POSITIVE_INFINITY]
    ]

    let colors = ['#F2F4F7', '#bad3f7', '#a0c3f5', '#85b2f1', '#6ca1ef', '#5291ec', '#0caed4'];

    if(!value) {
        return colors[0];
    }

    for (let i = 0; i < section.length; i++) {
        let [min, max] = section[i];
        let color = i + 1;
        if(value <= min) {
            return colors[color];
        }
        else if (value >= min && value <= max) {
            return colors[color];
        }
    }
}