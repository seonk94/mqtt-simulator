const topic = {
    data: '',
    data2: ''
}

export default {
    returnObject (msgName) {
        switch(msgName) {
            case 'topic' :
                return topic;
            default:
                console.log('not match');
                break;
        }
    },
    
    randomValue (key) {
        switch(key) {
            case 'data':
                return 'user' + ~~((Math.random() * 10) + 1)
            case 'data2':
                return 'SN' + ~~((Math.random() * 10000000))
            
            default:
                console.log(key);
                break;
        }
    }
}