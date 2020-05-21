$(function() {
    //数据格式{title: "abc", done: false }
    //0.打开页面时自动调用，显示本地数据
    load();
    //1.按下回车，将输入框中数据储存到本地存储
    $('#title').on('keypress', function(e) {
        //回车的keyCode为13
        if (e.keyCode == 13) {
            if ($(this).val() == '') {
                alert('请输入内容');
            } else {
                //获取原本地存储中的数据
                var local = getData();
                //将新数据存入local数组中,对本地存储中的数据进行更新
                local.push({ title: $(this).val(), done: false });
                //把此数组给本地存储
                saveData(local);
                // 将todolist的内容渲染到页面
                load();
                $(this).val('');
            }
        }
    });
    //2.删除操作
    $('ol').on('click', 'a', function() {
        //思路：删除本地存储中的数据，然后再次渲染页面
        var data = getData();
        //this指向a,即触发事件的元素
        var index = $(this).attr('index');
        //alert(index);
        //因无法直接修改本地存储数据
        //所以先将数组中index索引号的数据删掉，在将data存入本地存储中来替换原数据
        data.splice(index, 1);
        saveData(data);
        load();
    });
    //3.正在进行和已经完成模块
    //思路：通过修改数据的done的值，来判断是是否完成，然后再次渲染页面
    $('ol').on('click', 'input', function() {
        var data = getData();
        //获取触发事件的元素的索引号
        var index = $(this).siblings('a').attr('index');
        //使done与checked的值同步，选中即为完成，未选中即为进行
        data[index].done = $(this).prop('checked');
        saveData(data);
        load();
    });

    //获取本地数据
    function getData() {
        var data = localStorage.getItem('todolist');
        if (data !== null) {
            //本地存储中为字符串形式，先转化为对象格式
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    //保存本地数据
    function saveData(data) {
        localStorage.setItem('todolist', JSON.stringify(data));
    }
    //在页面上渲染本地数据
    function load() {
        //先清空ol，确保不会数据重复显示
        $('#todolist,#donelist').empty();
        var todocount = 0; //正在进行的个数
        var donecount = 0; //已经完成的个数
        //获取本地存储的数据
        var data = getData();
        //遍历data的内容
        $.each(data, function(i, domEle) {
            //通过done来判断完成与否
            if (data[i].done == false) {
                //统计正在进行的个数
                $('#todolist').prepend('<li><input type="checkbox"><p>' + domEle.title + '</p><a href="javascript:;" index="' + i + '">删除</a></li>');
                todocount++; //每遍历一次就加一，确保与li数量一致
            } else {
                $('#donelist').prepend('<li><input type="checkbox" checked="checked"><p>' + domEle.title + '</p><a href="javascript:;" index="' + i + '">删除</a></li>');
                donecount++;
            }
        });
        $('#todocount').text(todocount);
        $('#donecount').text(donecount);

    }
})
