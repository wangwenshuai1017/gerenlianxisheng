window.onload=function(){
    function init(){
        var obox = document.getElementsByClassName("box")[0];
        var item1 = obox.children[0];
        var item2 = obox.children[1];
        var item3 = obox.children[2];
        var item4 = obox.children[3];
        var arr = [];
        var x = 0;
        for(var a = 0;a<obox.children.length;a++){
            var he = obox.children[a];
            for(var b = 0;b<he.children.length;b++){
                x += he.children[b].height;
            }
            console.log("第" + a + "列：" + x);
            arr[a] = x;
            x = 0;
        }
        console.log(indexOfSmallest(arr));
        obox.children[indexOfSmallest(arr)].appendChild(addimg());
        //添加限制条件
        if(obox.children[indexOfSmallest(arr)].clientHeight>document.documentElement.clientHeight + 200){
            clearInterval(timer);
        }
        window.onscroll=function(){
            if(document.documentElement.scrollTop+document.documentElement.clientHeight>=document.documentElement.scrollHeight){
                var timer2 = setInterval(function(){
                    init();
                    if(document.documentElement.scrollHeight>document.documentElement.scrollTop + document.documentElement.clientHeight + 200){
                        clearInterval(timer2);
                    }
                },100)   
            }
        }
    }
    init();

    var timer = setInterval(function(){
        init();
    },100)
    //返回一个数组里最小值的索引。
    function indexOfSmallest(a) {
        return a.indexOf(Math.min.apply(Math, a));
    }
    //追加图片。
    function addimg(){
        var a = Math.floor(Math.random()*14+1);
        var oimg = document.createElement("img");
        oimg.setAttribute("src","./images/0423(" + a + ").jpg");
        return oimg;
        console.log(oimg);
    }
}