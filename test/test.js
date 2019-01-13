const assert = require('assert');

describe('2019-01-08 테스트', () => {

    const testObj = {
        key1: 'value1',
        key2: 'value2'
    }

    it('객체 -> 배열 변환 테스트', () => {
        let tempObj = [];
        Object.keys(testObj).forEach(item => {
            let tempItem = {};
            tempItem[item] = testObj[item]
            tempObj = [
                ...tempObj, tempItem
            ]
        })
        assert.equal('value1', tempObj[0].key1);
    });

    const convertingObj = {
        key: 'key',
        value: 'value'
    }

    it('객체 key, value -> {key: value} ', () => {
        let tempObj = {};
        tempObj[convertingObj.key] = convertingObj.value

        let expectObj = { key: 'value'}
        assert.deepEqual(expectObj, tempObj)
    });
});
