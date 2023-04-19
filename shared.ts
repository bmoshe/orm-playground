import {v4} from 'uuid';
export const range = (n: number) => {
    const rangeAux = function* () {
        for(let i = 0; i < n; i++) {
            yield v4();
        }
    };

    return [...rangeAux()];
};

export const benchmark = async (f) => {
    const enterAt = Date.now();
    await f();

    const duration = Date.now() - enterAt;
    return duration;
}