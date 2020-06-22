var stock = 'IBM.N';
var start = '20190610';
var end = '20200610';

system.out.putTable('1', getTable(stock, start, end));

///////////////////////////////////////////////////////////////////////////////////////

function average(nums) {

    return nums.reduce((a, b) = > (a + b)) / nums.length;
    
}

function sum(nums) {

    return nums.reduce((a, b) = > (a + b));

}

function getMaxOfArray(numArray) {

    return Math.max.apply(null, numArray);

}

function getMinOfArray(numArray) {

    return Math.min.apply(null, numArray);

}

///////////////////////////////////////////////////////////////////////////////////////

function getTable(stock, startDate, endDate) {

    var startDate = Number(startDate);
    var endDate = Number(endDate);
    var featuretable = new DataTable();
    var stocktable = timeseries.getPricesTable({
        symbol: stock,
        startDate: startDate,
        endDate: endDate,
        side: 'all'

    });

///////////////////////////////////////////////////////////////////////////////////////

    var Date = [];

    for (let i = 0; i < stocktable.rowCount; i++) {

        var a = stocktable.get(i, 'Date');
        Date.push(a);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var Close = [];

    for (let i = 0; i < stocktable.rowCount; i++) {

        var price = stocktable.get(i, stock + ' close');
        Close.push(price);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var Open = [];

    for (let i = 0; i < stocktable.rowCount; i++) {

        var price = stocktable.get(i, stock + ' open');
        Open.push(price);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var Volume = [];

    for (let i = 0; i < stocktable.rowCount; i++) {

        var vol = stocktable.get(i, stock + ' volume');
        Volume.push(vol);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var stock_high = [];

    for (let i = 0; i < stocktable.rowCount; i++) {

        stock_high.push(stocktable.get(i, stock + ' high'));

    }

///////////////////////////////////////////////////////////////////////////////////////

    var stock_low = [];

    for (let i = 0; i < stocktable.rowCount; i++) {

        stock_low.push(stocktable.get(i, stock + ' low'));

    }

///////////////////////////////////////////////////////////////////////////////////////

    //featuretable.setLabel('all',Date);

    var Change = [0];
    var change = 0;

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < Close.length - 1; i++) {

        change = Close[i + 1] - Close[i];
        Change.push(change);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var Gain = [];
    var Loss = [];

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < Change.length; i++) {

        if (Change[i] > 0) {

            Gain.push(Change[i]);
            Loss.push(0);

        } else {

            Gain.push(0);
            Loss.push(-Change[i]);

        }

    }

///////////////////////////////////////////////////////////////////////////////////////

    var AvgGain = [];

    for (let i = 0; i <= 12; i++) {

        AvgGain.push(0);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var AvgLoss = [];

    for (let i = 0; i <= 12; i++) {

        AvgLoss.push(0);

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < Gain.length - 13; i++) {

        var Gain14 = Gain.slice(i, i + 14);
        //system.out.println(AvgGain14);
        AvgGain.push(average(Gain14));

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < Loss.length - 13; i++) {

        var Loss14 = Loss.slice(i, i + 14);
        AvgLoss.push(average(Loss14));

    }

///////////////////////////////////////////////////////////////////////////////////////

    var RS = [];

    for (let i = 0; i < AvgGain.length; i++) {

        RS.push(AvgGain[i] / AvgLoss[i]);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var RSI14 = [];

    for (let i = 0; i < 13; i++) {

        RSI14.push(0);

    }

    for (let i = 13; i < RS.length; i++) {

        if (AvgLoss[i] == 0) {

            RSI14.push(100);

        } else {

            RSI14.push(100 - (100 / (1 + RS[i])));

        }
    }

///////////////////////////////////////////////////////////////////////////////////////

    var SMA14 = [];

    for (let i = 0; i < 13; i++) {

        SMA14.push(0);

    }

    for (let i = 0; i < Close.length - 13; i++) {

        SMA14.push(average(Close.slice(i, i + 14)));

    }

///////////////////////////////////////////////////////////////////////////////////////

    var EMA14 = [];

    for (let i = 0; i < 13; i++) {

        EMA14.push(0);

    }

    EMA14.push(average(Close.slice(0, 14)));

    for (let i = 14; i < Close.length; i++) {

        let ema = Close[i] * (2 / (14 + 1)) + EMA14[i - 1] * (1 - (2 / (14 + 1)));
        EMA14.push(ema);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var EMA12 = [];

    for (let i = 0; i < 11; i++) {

        EMA12.push(0);

    }

    EMA12.push(average(Close.slice(0, 12)));

    for (let i = 12; i < Close.length; i++) {

        let ema = Close[i] * (2 / (12 + 1)) + EMA12[i - 1] * (1 - (2 / (12 + 1)));
        EMA12.push(ema);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var EMA26 = [];
    for (let i = 0; i < 25; i++) {

        EMA26.push(0);

    }

    EMA26.push(average(Close.slice(0, 26)));

    for (let i = 26; i < Close.length; i++) {

        let ema = Close[i] * (2 / (26 + 1)) + EMA26[i - 1] * (1 - (2 / (26 + 1)));
        EMA26.push(ema);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var MACD = [];

    for (let i = 0; i < 25; i++) {

        MACD.push(0);

    }

    for (let i = 25; i < EMA26.length; i++) {

        MACD.push(EMA12[i] - EMA26[i]);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var MACD_sl = [];

    for (let i = 0; i < 32; i++) {

        MACD_sl.push(0);

    }

    MACD_sl.push(average(MACD.slice(25, 33)));

    for (let i = 33; i < MACD.length; i++) {

        MACD_sl.push(MACD[i] * (2 / (9 + 1)) + MACD_sl[i - 1] * (1 - (2 / (9 + 1))));
    }

///////////////////////////////////////////////////////////////////////////////////////

    var MACD_h = [];


    for (let i = 0; i < 32; i++) {

        MACD_h.push(0);

    }

    for (let i = 32; i < MACD_sl.length; i++) {

        MACD_h.push(MACD[i] - MACD_sl[i]);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var High = [];
    var Low = [];

    for (let i = 0; i < 13; i++) {

        High.push(0);

    }

    for (let i = 0; i < 13; i++) {

        Low.push(0);

    }

    for (let i = 0; i < stock_high.length - 13; i++) {

        High.push(getMaxOfArray(stock_high.slice(i, i + 14)));

    }

    for (let i = 0; i < stock_low.length - 13; i++) {

        Low.push(getMinOfArray(stock_low.slice(i, i + 14)));

    }

///////////////////////////////////////////////////////////////////////////////////////

    var WilliamsR = [];

    for (let i = 0; i < 13; i++) {

        WilliamsR.push(0);

    }
    for (let i = 13; i < High.length; i++) {

        WilliamsR.push((High[i] - Close[i]) / (High[i] - Low[i]) * 100);

    }

///////////////////////////////////////////////////////////////////////////////////////

    var SC = [];

    for (let i = 0; i < 15; i++) {

        SC.push(0);

    }
    for (let i = 15; i < WilliamsR.length; i++) {

        SC.push(average(WilliamsR.slice(i - 2, i + 1)));

    }

///////////////////////////////////////////////////////////////////////////////////////

    var BP = [];
    var TR = [];
    var avg7 = [];
    var avg14 = [];
    var avg28 = [];
    var UO = [];

///////////////////////////////////////////////////////////////////////////////////////

    BP.push(0);

    for (let i = 1; i < Close.length; i++) {

        BP.push(Close[i] - Math.min(stock_low[i], Close[i - 1]));

    }

///////////////////////////////////////////////////////////////////////////////////////
    TR.push(0);

    for (let i = 1; i < Close.length; i++) {

        TR.push(Math.max(stock_high[i], Close[i - 1]) - Math.min(stock_low[i], Close[i - 1]));

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < 7; i++) {

        avg7.push(0);

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 1; i < Close.length - 6; i++) {

        avg7.push(sum(BP.slice(i, i + 7)) / sum(TR.slice(i, i + 7)));

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < 14; i++) {

        avg14.push(0);

    }

    for (let i = 1; i < Close.length - 13; i++) {

        avg14.push(sum(BP.slice(i, i + 14)) / sum(TR.slice(i, i + 14)));

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < 28; i++) {

        avg28.push(0);

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 1; i < Close.length - 27; i++) {

        avg28.push(sum(BP.slice(i, i + 28)) / sum(TR.slice(i, i + 28)));

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < 28; i++) {

        UO.push(0);

    }

    for (let i = 28; i < Close.length; i++) {
        UO.push((4 * avg7[i] + 2 * avg14[i] + avg28[i]) / (4 + 2 + 1) * 100);
    }

///////////////////////////////////////////////////////////////////////////////////////

    var TP = [];
    var RawMF = [];
    var updown = [];
    var pMF1 = [];
    var nMF1 = [];
    var pMF14 = [];
    var nMF14 = [];
    var MFr14 = [];
    var MFindex14 = [];

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < Open.length; i++) {

        TP.push(average([Open[i], stock_low[i], Close[i]]));

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < Open.length; i++) {

        RawMF.push(TP[i] * Volume[i]);

    }

///////////////////////////////////////////////////////////////////////////////////////

    updown.push(0);

    for (let i = 1; i < Close.length; i++) {

        if (Change[i] >= 0) {

            updown.push(1);

        } else {

            updown.push(-1);

        }
    }

///////////////////////////////////////////////////////////////////////////////////////

    pMF1.push(0);
    nMF1.push(0);

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 1; i < Close.length; i++) {

        if (updown[i] > 0) {

            pMF1.push(RawMF[i]);
            nMF1.push(0);

        } else {

            pMF1.push(0);
            nMF1.push(RawMF[i]);

        }
    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 0; i < 14; i++) {

        pMF14.push(0);
        nMF14.push(0);
        MFr14.push(0);
        MFindex14.push(0);

    }

///////////////////////////////////////////////////////////////////////////////////////

    for (let i = 14; i < Close.length; i++) {

        pMF14.push(sum(pMF1.slice(i - 13, i + 1)));
        nMF14.push(sum(nMF1.slice(i - 13, i + 1)));
        MFr14.push(pMF14[i] / nMF14[i]);
        MFindex14.push(100 - (100 / (1 + MFr14[i])));

    }

///////////////////////////////////////////////////////////////////////////////////////

    featuretable.addRow({

        High: High,
        Low: Low,
        WilliamsR: WilliamsR,
        MACD_h: MACD_h,
        "Open": Open,
        "Close": Close,
        "High": stock_high,
        "Low": stock_low,
        "Volume": Volume,
        'RSI14': RSI14,
        "SMA14": SMA14,
        "EMA14": EMA14,
        EMA12: EMA12,
        EMA26: EMA26,
        MACD: MACD,
        MACD_sl: MACD_sl,
        "UO": UO,
        "MFindex14": MFindex14

    });

///////////////////////////////////////////////////////////////////////////////////////

    return featuretable;

}