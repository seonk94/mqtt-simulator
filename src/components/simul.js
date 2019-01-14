const gw_cert = {
    user_id: '',
    gw1_sn: '',
    mac: '',
    topic: '/cert'
}

const gw_connect = {
    gw1_sn: '',
    topic: '/connect'
}

const server_time = {
    command_type: '',
    time: '',
    topic: '/command/'
}

const m_data = {
    conn_dev: '',
    gw1_type: '',
    gw1_status: '',
    gw1_sn: '',
    tm1_data_list : [
        {
            tm1_sn: '',
            skin_temp: '',
            abd_mov: '',
            sleep_pos: '',
            ev_temp: '',
            ev_hum: '',
            dev_status: '',
            batt_lv: '',
            rssi: '',
        },
        {
            tm1_sn: '',
            skin_temp: '',
            abd_mov: '',
            sleep_pos: '',
            ev_temp: '',
            ev_hum: '',
            dev_status: '',
            batt_lv: '',
            rssi: '',
        }
    ],
    aq1_pm10: '',
    aq1_pm2_5: '',
    aq1_pm1_0: '',
    aq1_tvoc: '',
    aq1_co2: '',
    aq1_ev_temp: '',
    aq1_ev_hum: '',
    time: '',
    topic: '/data/'
}

const unsubscribe = {
    command_type: '',
    topic: '/command/'
}

const scan_res = {
    command_type: '',
    scan_tm1_list : [{
        tm1_sn: '',
        rssi: ''
    }],
    con_tm1_list : [{
        tm1_sn: '',
        rssi: '',
    }],
    cmd_no: '',
    topic: '/command/'
}

export default {
    returnObject (msgName) {
        switch(msgName) {
            case 'gw_cert' : 
                return gw_cert;
            case 'gw_connect' : 
                return gw_connect;
            case 'server_time' :
                return server_time;
            case 'm_data' :
                return m_data;
            case 'unsubscribe' :
                return unsubscribe;
            case 'scan_res'  :
                return scan_res;
            default:
                console.log('not match');
                break;
        }
    },
    
    randomValue (key) {
        switch(key) {
            case 'user_id':
                return 'user' + ~~((Math.random() * 10) + 1)
            case 'gw1_sn':
                return 'SN' + ~~((Math.random() * 10000000))
            case 'mac':
                return '01'
            case 'command_type':
                return ~~(Math.random() * 10)
            case 'time':
                return (new Date()).getTime();
            case 'conn_dev':
                return ~~(Math.random() * 10);
            case 'gw1_type':
                return ~~(Math.random() * 10)
            case 'gw1_status':
                return ~~(Math.random() * 5)
            case 'tm1_sn':
                return 'TM1SN' + ~~((Math.random() * 100000))
            case 'skin_temp':
                return ~~(((Math.random() * 1) + 2) * 100000)
            case 'abd_mov':
                return ~~(Math.random() * 4)
            case 'sleep_pos':
                return ~~(Math.random() * 4)
            case 'ev_temp':
                return ~~(Math.random() * 1)   
            case 'ev_hum':
                return ~~(Math.random() * 5)   
            case 'dev_status':
                return ~~(Math.random() * 5)    
            case 'batt_lv':
                return ~~(Math.random() * 5)   
            case 'rssi':
                return ~~(Math.random() * 10)   
            case 'aq1_pm10':
                return ~~(Math.random() * 10)  
            case 'aq1_pm2_5':
                return ~~(Math.random() * 10)  
            case 'aq1_pm1_0':
                return ~~(Math.random() * 10) 
            case 'aq1_tvoc':
                return ~~(Math.random() * 10)  
            case 'aq1_co2':
                return ~~(Math.random() * 10)  
            case 'aq1_ev_temp':
                return ~~(Math.random() * 1)  
            case 'aq1_ev_hum':
                return ~~(Math.random() * 5)   
            case 'cmd_no':
                return ~~(Math.random() * 10)   
                 
            default:
                console.log(key);
                break;
        }
    }
}