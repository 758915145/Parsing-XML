function loadXML(path,callback){
    //所有单元格数据,表格,所有的行,所有的列
    var data=[];

    //获取数据
    ajax({
        url:path,
        responseType:'text'
    },function(res){
        var domParser = new  DOMParser();
        var xmlDoc = domParser.parseFromString(res, 'text/xml');
        var table = xmlDoc.querySelectorAll('Table');
        [].forEach.call(table,function(item,index){
            data[index] = analysis(item);
            data[index].getData = getData;
            data[index].getColumn = getColumn;
            data[index].getRow = getRow;
        });
        callback&&callback(data);
    });

    //解析数据
    function analysis(table){
        var data=[];
        var Rows = table.querySelectorAll('Row');
        [].forEach.call(Rows,function(item,index){
            data[index] = [];
            [].forEach.call(item.querySelectorAll('Cell'),function(sitem,sindex){

                var ssMergeAcross = ~~sitem.getAttribute('ss:MergeAcross');
                var ssIndex = ~~sitem.getAttribute('ss:Index');

                //普通的单元格
                if(!ssMergeAcross&&!ssIndex){
                    var elemData = sitem.querySelector('Data');
                    var len = data[index].length;
                    if(elemData)
                    data[index][len] = {
                        data:elemData.innerHTML,
                        type:elemData.getAttribute('ss:Type'),
                        across:null,
                        row:index,
                        column:len
                    }
                }

                //合并的单元格
                if(ssMergeAcross&&!ssIndex){
                    var elemData = sitem.querySelector('Data');
                    var len = data[index].length;
                    var max = len+ssMergeAcross;
                    for(var i=len;i<max;i++){
                        data[index][i] = {
                            data:elemData.innerHTML,
                            type:elemData.getAttribute('ss:Type'),
                            across:sitem.getAttribute('ss:MergeAcross'),
                            row:index,
                            column:i
                        }
                    }
                }

                //连串空白的单元格
                if(ssIndex&&!ssMergeAcross){
                    var elemData = sitem.querySelector('Data');
                    var len = data[index].length;
                    for(var i=len;i<=ssIndex-1;i++){
                        if(i===ssIndex-1){
                            data[index][i] = {
                                data:elemData&&elemData.innerHTML,
                                type:elemData&&elemData.getAttribute('ss:Type'),
                                across:null,
                                row:index,
                                column:i
                            }
                        }else{
                            data[index][i] = {
                                data:null,
                                type:null,
                                across:null,
                                row:index,
                                column:i
                            }
                        }
                    }
                }
            });
        });
        return data;
    }

    //获取某单元格对应的列号
    function getData(str){
        var result = [];
        this.forEach(function(item){
            item.forEach(function(sitem){
                if(sitem.data==str)
                result.push(sitem);
            });
        });
        if(result.length===0){
            return null;
        }else if(result.length===1){
            return result[0];
        }else{
            return result;
        }
    }

    //获取列的数据
    function getColumn(num,start){
        var result = [];
        this.forEach(function(item){
            item.forEach(function(sitem){
                if(sitem&&sitem.column===num&&sitem.row>start){
                    result.push(sitem);
                }
            });
        });
        return result;
    }

    //获取行的数据
    function getRow(num,start){
        return this[num].slice(start);
    }
}

//将行和列转化为excel中的叫法，比如：0行3列 = C1
function getPosition(cell){
    var c = cell.column;
    var r = cell.row;
    var arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    return arr[c]+(r+1);
}
